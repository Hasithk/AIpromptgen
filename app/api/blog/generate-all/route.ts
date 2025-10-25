import { NextRequest, NextResponse } from 'next/server';

/**
 * Generate blog posts for multiple days based on AI news
 * Creates articles for each day with top AI news summaries
 */

interface BlogArticle {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  category: string;
  tags: string[];
  featured: boolean;
  publishedAt: string;
  readTime: string;
  coverImage?: string;
}

// In-memory storage for blog articles (in production, use database)
let generatedArticles: BlogArticle[] = [];

// Cover images rotation - curated, reliable Unsplash URLs
const coverImages = [
  'https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d?q=80&auto=format&w=1200&h=600&fit=crop',
  'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&auto=format&w=1200&h=600&fit=crop',
  'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&auto=format&w=1200&h=600&fit=crop',
  'https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&auto=format&w=1200&h=600&fit=crop',
  'https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?q=80&auto=format&w=1200&h=600&fit=crop',
  'https://images.unsplash.com/photo-1531746790731-6c087fecd65b?q=80&auto=format&w=1200&h=600&fit=crop',
  'https://images.unsplash.com/photo-1555949963-aa79dcee981d?q=80&auto=format&w=1200&h=600&fit=crop',
  'https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&auto=format&w=1200&h=600&fit=crop',
  'https://images.unsplash.com/photo-1531297484001-80022131f5a1?q=80&auto=format&w=1200&h=600&fit=crop',
  'https://images.unsplash.com/photo-1556157382-97eda2d62296?q=80&auto=format&w=1200&h=600&fit=crop',
  'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&auto=format&w=1200&h=600&fit=crop',
  'https://images.unsplash.com/photo-1526378722423-4d4f7ec2ce88?q=80&auto=format&w=1200&h=600&fit=crop',
  'https://images.unsplash.com/photo-1550439062-609e1531270e?q=80&auto=format&w=1200&h=600&fit=crop'
];

// Helper to get cover image for article
function getCoverImage(index: number): string {
  return coverImages[index % coverImages.length];
}

// Helper to generate a full article for a specific date
async function generateArticleForDate(targetDate: Date, newsItems: any[]): Promise<BlogArticle | null> {
  try {
    const dateString = targetDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    
    // Get the top news story for this day
    const topNews = newsItems[0];
    
    if (!topNews) {
      return null;
    }

    const title = topNews.title || `AI News Roundup - ${dateString}`;

    // Create comprehensive prompt for DeepSeek
    const deepSeekPrompt = `You are an expert AI technology journalist and writer. Your task is to write a COMPREHENSIVE, IN-DEPTH blog article.

Based on this news headline and description:
Title: ${topNews.title}
Description: ${topNews.description}
Source: ${topNews.source}

Write a DETAILED, COMPREHENSIVE blog article about this topic. The article MUST be at least 500-600 words. 

Structure your article as follows:
1. Opening Hook (2-3 sentences) - Grab attention with the significance of this news
2. Context & Background (3-4 paragraphs) - Explain what's happening and why it matters
3. Key Details & Analysis (3-4 paragraphs) - Deep dive into the specifics, implications, and what experts are saying
4. Industry Impact & Implications (2-3 paragraphs) - Broader implications for the AI and tech industry
5. Related Developments (2 paragraphs) - How this connects to other trends and news
6. Future Outlook & Conclusion (2-3 paragraphs) - What this means for the future, next steps to watch

IMPORTANT:
- Each paragraph should be 3-5 sentences
- Aim for exactly 500-600 words total
- Use technical but accessible language
- Include specific examples and context where relevant
- Be factual and professional but engaging

Return ONLY the article content. No title, no markdown formatting, no headers with # symbols.`;

    // Call DeepSeek API with increased token limit
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
            content: 'You are an expert AI technology journalist with deep industry knowledge. Write comprehensive, well-researched articles about AI and technology topics that are suitable for professional tech audiences. Your articles should be detailed, well-structured, and at least 500 words.'
          },
          {
            role: 'user',
            content: deepSeekPrompt
          }
        ],
        temperature: 0.7,
        max_tokens: 3000
      })
    });

    let fullContent = '';
    let fromDeepSeek = false;
    
    if (deepSeekResponse.ok) {
      const deepSeekData = await deepSeekResponse.json();
      fullContent = deepSeekData.choices?.[0]?.message?.content || '';
      if (fullContent.length > 500) {
        fromDeepSeek = true;
      }
    }

    // Fallback if DeepSeek fails or produces too short content - create a comprehensive structured article
    if (!fullContent || fullContent.length < 500) {
      fullContent = `
${topNews.title}

${topNews.description}

Understanding the Context and Background

This development represents a pivotal moment in the artificial intelligence industry. The story highlights the ongoing evolution and rapid pace of innovation in AI technology that continues to reshape how we work and interact with technology. Industry experts and analysts are closely watching how this situation develops, as it may have significant broader implications for the entire field. The timing of this announcement is particularly important given the current state of AI development and competition in the market.

The News in Detail

Breaking down the specifics of this announcement, we can see several key factors at play. This news comes from a major player in the industry, and it represents a significant step forward in AI development and applications. The implications extend across multiple sectors and use cases. Many organizations are now reconsidering their strategies in light of this development. The competitive landscape in AI is shifting rapidly, with new players entering and established companies making bold moves.

Key Takeaways and Implications

The importance of this news cannot be overstated for anyone working in or affected by the AI industry. It demonstrates the dynamic nature of the AI landscape and how quickly things can change. Organizations and developers need to stay informed about such developments to make better decisions regarding their technology stacks and business strategies. This announcement will likely trigger ripple effects across the industry. Companies will need to adapt their approaches to stay competitive. The skilled professionals in this space will be in even higher demand.

Industry Impact and Broader Significance

These developments underscore the importance of monitoring the AI space closely and continuously. The intersection of technology, business strategy, and innovation creates both tremendous opportunities and significant challenges that organizations must navigate carefully. The competitive dynamics within the AI industry are intensifying. Companies are investing heavily in research and development. The race for AI dominance is accelerating globally.

Looking Forward and Future Implications

As the AI industry continues to mature and evolve, we can expect more stories like this to emerge with increasing frequency. The fundamental principles of innovation, adaptation, and continuous improvement will remain central to success in this space. Those who stay informed and adapt quickly will be best positioned to thrive in this rapidly evolving ecosystem. The next few months and years will be critical for determining how this industry develops.

The Role of the Broader Community

The AI community plays a crucial role in analyzing and understanding these developments in context. Through discussion, collaboration, and knowledge sharing, industry professionals help ensure that innovations are understood in their broader context and that their potential benefits are maximized. This collaborative approach is essential for responsible AI development and deployment.
      `.trim();
    }

    return {
      id: `blog-${targetDate.getTime()}`,
      title: title,
      excerpt: topNews.description || 'Important AI news and industry update',
      content: fullContent,
      author: 'AI Tech Team',
      category: 'AI News & Updates',
      tags: ['AI', 'Technology', 'News', 'Industry', 'Innovation'],
      featured: targetDate.getTime() === new Date().setHours(0, 0, 0, 0),
      publishedAt: targetDate.toISOString(),
      readTime: `${Math.ceil(fullContent.length / 200)} min read`,
      coverImage: getCoverImage(new Date(targetDate).getDate() - 1)
    };
  } catch (error) {
    console.error('Error generating article:', error);
    return null;
  }
}

export async function GET(request: NextRequest) {
  try {
    // Validate cron secret
    const secret = request.nextUrl.searchParams.get('secret');
    const daysParam = request.nextUrl.searchParams.get('days') || '24'; // Default 24 days
    const cronSecret = process.env.CRON_SECRET || 'your-secure-cron-secret-key';
    
    if (!secret || secret !== cronSecret) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const days = Math.min(parseInt(daysParam), 31); // Max 31 days
    console.log(`Generating blog articles for ${days} past days...`);

    // Fetch news from API
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
    const newsResponse = await fetch(`${baseUrl}/api/news/latest?t=${Date.now()}`);
    
    if (!newsResponse.ok) {
      throw new Error(`Failed to fetch news: ${newsResponse.status}`);
    }

    const newsData = await newsResponse.json();
    const allNews = newsData.data || [];

    if (allNews.length === 0) {
      return NextResponse.json({
        success: false,
        error: 'No news data available',
        articlesGenerated: 0
      });
    }

    // Generate articles for past N days
    const articles: BlogArticle[] = [];
    const today = new Date();
    
    for (let i = 0; i < days; i++) {
      const targetDate = new Date(today);
      targetDate.setDate(targetDate.getDate() - i);
      
      // Rotate through available news for variety
      const newsForDay = allNews.slice(
        (i * 5) % allNews.length,
        ((i + 1) * 5) % allNews.length + 5
      );

      // If we don't have enough news, cycle through what we have
      if (newsForDay.length === 0) {
        newsForDay.push(...allNews.slice(0, 5));
      }

      console.log(`Generating article for ${targetDate.toDateString()}...`);
      
      const article = await generateArticleForDate(targetDate, newsForDay);
      if (article) {
        articles.push(article);
      }

      // Add small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    // Store generated articles
    generatedArticles = articles;

    // Also save to blog-articles endpoint
    try {
      await fetch(`${baseUrl}/api/blog-articles`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ articles: articles, isRegeneration: true })
      });
    } catch (err) {
      console.log('Note: Could not sync to blog-articles endpoint:', err);
    }

    console.log(`Generated ${articles.length} blog articles`);

    return NextResponse.json({
      success: true,
      message: `Generated ${articles.length} blog articles for ${days} days`,
      articlesGenerated: articles.length,
      articles: articles
    });

  } catch (error) {
    console.error('Blog generation error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to generate blog articles',
        articlesGenerated: 0
      },
      { status: 500 }
    );
  }
}

// GET endpoint to retrieve generated articles
export async function GET_ARTICLES() {
  return generatedArticles;
}
