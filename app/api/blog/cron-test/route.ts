import { NextResponse } from 'next/server';

const CRON_SECRET = process.env.CRON_SECRET || 'your-secure-cron-secret-key';
const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;

// Simple blog generation without database dependency
export async function POST(req: Request) {
  try {
    // Security: Verify cron secret
    const authHeader = req.headers.get('authorization');
    if (authHeader && authHeader !== `Bearer ${CRON_SECRET}`) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    console.log('[Blog Automation] Starting generation...');

    if (!DEEPSEEK_API_KEY) {
      console.log('[Blog Automation] No DeepSeek API key found');
      return NextResponse.json({
        success: false,
        error: 'DeepSeek API key not configured'
      }, { status: 500 });
    }

    // Generate blog content
    const blogPost = await generateBlogPost();

    console.log('[Blog Automation] Blog generated:', blogPost.title);

    return NextResponse.json({
      success: true,
      message: 'Blog post generated successfully',
      post: blogPost,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('[Blog Automation] Error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}

// GET endpoint to test automation
export async function GET() {
  try {
    const hasApiKey = !!DEEPSEEK_API_KEY;
    
    return NextResponse.json({
      success: true,
      status: 'Blog automation is configured',
      apiKeyConfigured: hasApiKey,
      schedule: 'Daily at midnight UTC (0 0 * * *)',
      nextRun: getNextMidnight(),
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to get status' },
      { status: 500 }
    );
  }
}

function getNextMidnight(): string {
  const now = new Date();
  const next = new Date();
  next.setUTCHours(24, 0, 0, 0);
  return next.toISOString();
}

async function generateBlogPost() {
  const topics = [
    'Latest AI Developments in Image Generation',
    'New Features in Midjourney and DALL-E',
    'The Future of AI Video Generation',
    'Best Practices for AI Prompt Engineering',
    'How AI is Transforming Creative Industries'
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
            content: 'You are an expert AI technology writer. Write engaging, informative blog posts about AI and prompt engineering.'
          },
          {
            role: 'user',
            content: `Write a comprehensive blog post about "${topic}". 

Include:
- An engaging title
- A brief excerpt (2-3 sentences)
- Well-structured content with headings
- Practical tips and insights
- A conclusion

Format the content in markdown with proper headings (##), paragraphs, and lists.`
          }
        ],
        temperature: 0.7,
        max_tokens: 2000
      })
    });

    if (!response.ok) {
      throw new Error(`DeepSeek API error: ${response.statusText}`);
    }

    const data = await response.json();
    const content = data.choices[0].message.content;

    // Extract title from content (first line)
    const lines = content.split('\n').filter((line: string) => line.trim());
    const title = lines[0].replace(/^#+\s*/, '').trim();
    
    return {
      id: `blog-${Date.now()}`,
      title: title || topic,
      excerpt: lines[1] || 'Explore the latest developments in AI technology.',
      content: content,
      category: 'AI News',
      author: 'AI News Bot',
      publishedAt: new Date().toISOString(),
      readTime: '5 min read'
    };

  } catch (error) {
    console.error('DeepSeek API error:', error);
    
    // Fallback content if API fails
    return {
      id: `blog-${Date.now()}`,
      title: topic,
      excerpt: 'Stay updated with the latest trends in AI and machine learning.',
      content: `## ${topic}\n\nThe AI landscape is rapidly evolving with new developments in image and video generation. Stay tuned for more updates on the latest AI technologies and best practices for prompt engineering.`,
      category: 'AI News',
      author: 'AI News Bot',
      publishedAt: new Date().toISOString(),
      readTime: '5 min read'
    };
  }
}
