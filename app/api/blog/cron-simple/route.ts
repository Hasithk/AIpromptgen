import { NextResponse } from 'next/server';
import { getBlogAutomationStatus, checkIfShouldGenerateBlog, updateLastBlogGeneration } from '@/lib/prisma';

const CRON_SECRET = process.env.CRON_SECRET || 'your-cron-secret-key';
const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;
const NEWS_API_KEY = process.env.NEWS_API_KEY;

// Simple blog generation endpoint that doesn't require external cron
export async function POST(req: Request) {
  try {
    // Verify cron secret if provided
    const authHeader = req.headers.get('authorization');
    if (authHeader && authHeader !== `Bearer ${CRON_SECRET}`) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    console.log('Blog automation triggered...');

    // Check if we should generate (every 3 days)
    const shouldGenerate = await checkIfShouldGenerateBlog();
    
    if (!shouldGenerate) {
      const status = await getBlogAutomationStatus();
      return NextResponse.json({
        success: true,
        message: 'Blog generation not due yet',
        nextGeneration: status.nextGeneration,
        shouldGenerate: false
      });
    }

    // Check if required API keys are available
    if (!DEEPSEEK_API_KEY) {
      throw new Error('DeepSeek API key not configured');
    }

    if (!NEWS_API_KEY) {
      throw new Error('News API key not configured');
    }

    // Fetch AI news from our news API
    const baseUrl = req.headers.get('host')?.includes('localhost') 
      ? 'http://localhost:3000' 
      : `https://${req.headers.get('host')}`;

    console.log('Fetching news from:', `${baseUrl}/api/news/latest`);
    
    const newsResponse = await fetch(`${baseUrl}/api/news/latest`, {
      method: 'GET',
      headers: {
        'User-Agent': 'AI-Prompt-Gen-Bot/1.0'
      }
    });

    if (!newsResponse.ok) {
      throw new Error(`News API failed: ${newsResponse.status} ${newsResponse.statusText}`);
    }

    const newsData = await newsResponse.json();
    
    if (!newsData.success || !newsData.data?.length) {
      throw new Error('No news data available for blog generation');
    }

    console.log(`Found ${newsData.data.length} news articles`);

    // Generate blog content using DeepSeek API
    const blogContent = await generateBlogWithDeepSeek(newsData.data.slice(0, 5)); // Use top 5 articles
    
    if (!blogContent) {
      throw new Error('Failed to generate blog content with DeepSeek');
    }

    // Create blog post in database
    const blogPost = await createBlogPostFromAI(newsData.data, blogContent);

    // Update last generation timestamp
    await updateLastBlogGeneration();

    console.log('Blog post created successfully:', blogPost.id);

    return NextResponse.json({
      success: true,
      message: 'Blog post generated successfully',
      blogPost: {
        id: blogPost.id,
        title: blogPost.title,
        excerpt: blogPost.excerpt
      },
      articlesUsed: newsData.data.length
    });

  } catch (error) {
    console.error('Blog automation error:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Blog generation failed',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}

// GET endpoint to check cron status
export async function GET() {
  try {
    const status = await getBlogAutomationStatus();
    const shouldGenerate = await checkIfShouldGenerateBlog();

    return NextResponse.json({
      success: true,
      ...status,
      shouldGenerate,
      config: {
        hasDeepSeekKey: !!DEEPSEEK_API_KEY,
        hasNewsApiKey: !!NEWS_API_KEY,
        cronSecret: !!CRON_SECRET
      }
    });
  } catch (error) {
    console.error('Status check error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to get status',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}

async function generateBlogWithDeepSeek(newsArticles: any[]): Promise<any> {
  if (!DEEPSEEK_API_KEY) {
    throw new Error('DeepSeek API key not available');
  }

  const prompt = `
Create a comprehensive blog post about the latest AI developments based on these news articles:

${newsArticles.map((article, i) => `
${i + 1}. ${article.title}
${article.description || article.content || ''}
Source: ${article.source}
`).join('\n')}

Please write a professional blog post with:
- Engaging title about AI trends
- Clear introduction
- Main content covering key developments
- Insights about impact on the AI industry  
- Conclusion with forward-looking thoughts
- 800-1200 words
- Professional tone suitable for AI enthusiasts

Format the response as JSON with: title, excerpt, content, tags
`;

  try {
    const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${DEEPSEEK_API_KEY}`
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 2000,
        temperature: 0.7
      })
    });

    if (!response.ok) {
      throw new Error(`DeepSeek API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    
    if (!content) {
      throw new Error('No content returned from DeepSeek API');
    }

    // Try to parse as JSON, fallback to plain text
    try {
      const parsed = JSON.parse(content);
      return parsed;
    } catch {
      // If not JSON, create structured response
      return {
        title: `AI Industry Update: ${new Date().toLocaleDateString()}`,
        excerpt: content.substring(0, 150) + '...',
        content: content,
        tags: ['AI', 'Technology', 'Industry News', 'Innovation']
      };
    }
  } catch (error) {
    console.error('DeepSeek generation error:', error);
    throw error;
  }
}

async function createBlogPostFromAI(newsArticles: any[], aiContent: any) {
  const { prisma } = await import('@/lib/prisma');

  const blogData = typeof aiContent === 'string' 
    ? {
        title: `AI Industry Insights: ${new Date().toLocaleDateString()}`,
        excerpt: aiContent.substring(0, 150) + '...',
        content: aiContent,
        tags: ['AI', 'News', 'Technology']
      }
    : aiContent;

  return await prisma.blogPost.create({
    data: {
      title: blogData.title || 'AI Industry Update',
      excerpt: blogData.excerpt || blogData.content?.substring(0, 150) + '...',
      content: blogData.content || 'AI industry continues to evolve with new developments.',
      author: 'AI News Bot',
      category: 'AI News',
      tags: Array.isArray(blogData.tags) ? blogData.tags : ['AI', 'News'],
      featured: true,
      readTime: `${Math.ceil((blogData.content?.length || 500) / 200)} min read`,
      publishedAt: new Date()
    }
  });
}