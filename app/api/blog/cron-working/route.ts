import { NextResponse } from 'next/server';
import {
  shouldGenerateBlog,
  saveBlogPost,
  updateLastGeneration,
  getAutomationStatus
} from '@/lib/blog-file-storage';

const CRON_SECRET = process.env.CRON_SECRET || 'your-secure-cron-secret-key';
const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;
const NEWS_API_KEY = process.env.NEWS_API_KEY;

// Blog automation endpoint
export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get('authorization');
    if (authHeader && authHeader !== `Bearer ${CRON_SECRET}`) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    console.log('[Blog Automation] Starting generation...');

    const shouldGenerate = await shouldGenerateBlog();
    if (!shouldGenerate) {
      const status = await getAutomationStatus();
      return NextResponse.json({
        success: true,
        message: 'Blog generation not due yet',
        nextGeneration: status.nextGeneration
      });
    }

    if (!DEEPSEEK_API_KEY) {
      return NextResponse.json({
        success: false,
        error: 'DeepSeek API key not configured. Add DEEPSEEK_API_KEY to environment variables.'
      }, { status: 500 });
    }

    // Generate blog post
    const blogPost = await generateAIBlogPost();

    // Save to file storage
    const saved = await saveBlogPost(blogPost);

    // Update generation timestamp
    await updateLastGeneration();

    console.log('[Blog Automation] Successfully generated:', saved.title);

    return NextResponse.json({
      success: true,
      message: 'Blog post generated and saved successfully',
      post: {
        id: saved.id,
        title: saved.title,
        excerpt: saved.excerpt,
        publishedAt: saved.publishedAt
      }
    });

  } catch (error) {
    console.error('[Blog Automation] Error:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const status = await getAutomationStatus();
    return NextResponse.json({
      success: true,
      ...status,
      apiKeyConfigured: !!DEEPSEEK_API_KEY,
      newsApiConfigured: !!NEWS_API_KEY
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to get status' }, { status: 500 });
  }
}

async function generateAIBlogPost() {
  const topics = [
    'Revolutionary AI Breakthroughs in 2025',
    'The Future of AI Image and Video Generation',
    'How AI is Transforming Creative Industries',
    'Latest Developments in Generative AI',
    'Prompt Engineering Best Practices',
    'AI Tools Every Creator Should Know',
    'The Rise of Multimodal AI Models',
    'Ethical Considerations in AI Development'
  ];

  const topic = topics[Math.floor(Math.random() * topics.length)];

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
            role: 'system',
            content: 'You are an expert AI technology writer who creates engaging, SEO-optimized blog posts. You write in markdown format with proper headings (##), clear paragraph breaks, well-formatted lists, and emphasis on key terms.'
          },
          {
            role: 'user',
            content: `Write a comprehensive blog post about "${topic}".

Requirements:
- Title as H1 (# Title)
- Use ## for main sections and ### for subsections
- Separate ALL paragraphs with blank lines
- Use markdown lists with proper spacing
- Include practical tips and insights
- Make it 1000-1500 words
- Use **bold** for key terms
- Include a compelling introduction
- End with actionable takeaways

Format in clean markdown.`
          }
        ],
        temperature: 0.7,
        max_tokens: 3000
      })
    });

    if (!response.ok) {
      throw new Error(`DeepSeek API error: ${response.statusText}`);
    }

    const data = await response.json();
    const content = data.choices[0].message.content;

    // Extract title
    const titleMatch = content.match(/^#\s+(.+)$/m);
    const title = titleMatch ? titleMatch[1] : topic;

    // Extract excerpt
    const contentWithoutTitle = content.replace(/^#\s+.+$/m, '').trim();
    const firstPara = contentWithoutTitle.split('\n\n')[0];
    const excerpt = firstPara.replace(/[#*_`]/g, '').substring(0, 200) + '...';

    const now = new Date().toISOString();

    return {
      id: `blog-${Date.now()}`,
      title,
      excerpt,
      content: content + '\n\n---\n\n*Generated using AI - Updated regularly with the latest insights.*',
      author: 'AI News Bot',
      category: 'AI Technology',
      tags: ['AI', 'Technology', 'Innovation', 'Prompt Engineering'],
      featured: true,
      readTime: '5 min read',
      publishedAt: now
    };

  } catch (error) {
    console.error('[Blog Generation] DeepSeek API error:', error);
    
    // Fallback content
    const now = new Date().toISOString();
    return {
      id: `blog-${Date.now()}`,
      title: topic,
      excerpt: 'Explore the latest developments in artificial intelligence and learn how AI is transforming the way we create and innovate.',
      content: `# ${topic}\n\nThe artificial intelligence landscape is evolving rapidly. Stay updated with the latest trends, tools, and techniques in AI technology.\n\n## Key Developments\n\nAI continues to advance across multiple domains, from image generation to natural language processing. Understanding these developments is crucial for staying competitive in today's tech landscape.\n\n## What This Means for You\n\nWhether you're a developer, designer, or business professional, AI tools are becoming essential to modern workflows. Learn how to leverage these technologies effectively.\n\n---\n\n*Check back for more AI insights and updates.*`,
      author: 'AI News Bot',
      category: 'AI Technology',
      tags: ['AI', 'Technology'],
      featured: false,
      readTime: '3 min read',
      publishedAt: now
    };
  }
}
