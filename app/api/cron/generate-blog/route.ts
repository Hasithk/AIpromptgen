import { NextRequest, NextResponse } from 'next/server';

/**
 * Cron endpoint to generate daily blog posts from AI news
 * Call this endpoint daily using a service like EasyCron or AWS EventBridge
 * 
 * Expected request:
 * GET /api/cron/generate-blog?secret=your-secure-cron-secret-key
 */

export async function GET(request: NextRequest) {
  try {
    // Validate cron secret for security
    const secret = request.nextUrl.searchParams.get('secret');
    const cronSecret = process.env.CRON_SECRET || 'your-secure-cron-secret-key';
    
    if (!secret || secret !== cronSecret) {
      console.error('Cron secret mismatch. Provided:', secret, 'Expected:', cronSecret);
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    console.log('Starting daily blog generation...');

    // Step 1: Fetch latest AI news
    console.log('Fetching latest AI news...');
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
    const newsResponse = await fetch(`${baseUrl}/api/news/latest`);
    
    if (!newsResponse.ok) {
      throw new Error(`Failed to fetch news: ${newsResponse.status}`);
    }

    const newsData = await newsResponse.json();
    const latestNews = newsData.data?.slice(0, 5) || [];

    if (latestNews.length === 0) {
      console.warn('No news data available for blog generation');
      return NextResponse.json({
        success: true,
        message: 'No news available for blog generation',
        blogPost: null
      });
    }

    // Step 2: Generate blog post using DeepSeek with news as context
    console.log('Generating blog post using DeepSeek...');
    
    const newsContext = latestNews
      .map((news: any) => `- ${news.title}: ${news.description}`)
      .join('\n');

    const deepSeekPrompt = `You are an AI blog writer. Based on the following latest AI news headlines, write a comprehensive and engaging blog post about trending AI topics. The blog post should be informative, well-structured, and suitable for an AI prompt engineering platform.

Latest AI News:
${newsContext}

Write a blog post with:
1. An engaging title
2. A brief excerpt (2-3 sentences)
3. Full content (800-1000 words)
4. Relevant tags
5. A category

Format your response as JSON with the following structure:
{
  "title": "Blog title",
  "excerpt": "Brief excerpt",
  "content": "Full blog content",
  "tags": ["tag1", "tag2", "tag3"],
  "category": "Category name"
}`;

    const deepSeekResponse = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          {
            role: 'system',
            content: 'You are an expert AI writer specializing in AI news and prompt engineering topics.'
          },
          {
            role: 'user',
            content: deepSeekPrompt
          }
        ],
        temperature: 0.7,
        max_tokens: 2000
      })
    });

    if (!deepSeekResponse.ok) {
      const errorText = await deepSeekResponse.text();
      console.error('DeepSeek API error:', errorText);
      throw new Error(`DeepSeek API error: ${deepSeekResponse.status} - ${errorText}`);
    }

    const deepSeekData = await deepSeekResponse.json();
    const responseContent = deepSeekData.choices?.[0]?.message?.content || '';

    console.log('DeepSeek response received:', responseContent.substring(0, 200));

    // Parse the JSON response from DeepSeek
    let blogPostData;
    try {
      // Extract JSON from the response (sometimes DeepSeek wraps it in markdown code blocks)
      const jsonMatch = responseContent.match(/\{[\s\S]*\}/);
      blogPostData = JSON.parse(jsonMatch ? jsonMatch[0] : responseContent);
    } catch (parseError) {
      console.error('Failed to parse DeepSeek response as JSON:', responseContent);
      // Return a default blog post if parsing fails
      blogPostData = {
        title: `Daily AI News Digest - ${new Date().toLocaleDateString()}`,
        excerpt: 'Latest developments in artificial intelligence and machine learning.',
        content: newsContext.split('\n').map((line: string, i: number) => `${i + 1}. ${line}`).join('\n\n'),
        tags: ['AI', 'News', 'Trends'],
        category: 'AI News'
      };
    }

    // Step 3: Return generated blog post (save to database would go here)
    console.log('Blog post generated successfully');
    
    return NextResponse.json({
      success: true,
      message: 'Blog post generated successfully',
      blogPost: {
        id: `blog-${Date.now()}`,
        title: blogPostData.title,
        excerpt: blogPostData.excerpt,
        content: blogPostData.content,
        author: 'AI News Bot',
        category: blogPostData.category || 'AI News',
        tags: Array.isArray(blogPostData.tags) ? blogPostData.tags : (blogPostData.tags ? blogPostData.tags.split(', ') : []),
        featured: false,
        publishedAt: new Date().toISOString(),
        readTime: `${Math.ceil((blogPostData.content?.length || 1000) / 200)} min read`
      },
      newsUsed: latestNews.length
    });

  } catch (error) {
    console.error('Blog generation error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to generate blog post',
        stack: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.stack : null) : undefined
      },
      { status: 500 }
    );
  }
}
