import { NextRequest, NextResponse } from 'next/server';

/**
 * Generate blog posts for missed days
 * Call this to backfill blog posts for dates when automation didn't run
 */

interface BlogPost {
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
  'https://images.unsplash.com/photo-1556157382-97eda2d62296?q=80&auto=format&w=1200&h=600&fit=crop'
];

function getCoverImage(index: number): string {
  return coverImages[index % coverImages.length];
}

async function generateArticleContent(newsItem: any, date: Date): Promise<string> {
  try {
    const deepSeekPrompt = `You are an expert AI technology journalist. Write a comprehensive blog article about this AI news:

Title: ${newsItem.title}
Description: ${newsItem.description}
Source: ${newsItem.source}

Write a detailed 500-600 word article with these sections:
1. Opening hook (2-3 sentences)
2. Context & background (3-4 paragraphs)
3. Key details & analysis (3-4 paragraphs)
4. Industry impact (2-3 paragraphs)
5. Future outlook (2-3 paragraphs)

Make it professional, engaging, and factual. Return ONLY the article content without title or markdown.`;

    const deepSeekResponse = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          { role: 'system', content: 'You are an expert AI technology journalist.' },
          { role: 'user', content: deepSeekPrompt }
        ],
        temperature: 0.7,
        max_tokens: 3000
      })
    });

    if (deepSeekResponse.ok) {
      const data = await deepSeekResponse.json();
      const content = data.choices?.[0]?.message?.content || '';
      if (content && content.length > 500) {
        return content;
      }
    }
  } catch (error) {
    console.error('DeepSeek API error:', error);
  }

  // Fallback content
  return `
${newsItem.title}

${newsItem.description}

This significant development in artificial intelligence represents a major milestone in the industry. The announcement has captured the attention of tech leaders, developers, and businesses worldwide who are closely monitoring its implications for the future of AI technology.

Understanding the Context

The timing of this news is particularly noteworthy given the current state of AI development and the competitive landscape. Industry experts have been anticipating movements in this direction, and this announcement confirms several key trends that have been emerging over recent months. The technology sector continues to evolve at a rapid pace, with AI at the forefront of innovation.

Key Details and Analysis

Looking at the specifics of this development, we can identify several critical factors that make this announcement particularly significant. The technological advancement represents a substantial leap forward in AI capabilities and applications. Organizations across various sectors are evaluating how this impacts their current strategies and future planning.

The competitive dynamics in the AI space are intensifying, with major players making strategic moves to maintain or gain market position. This development is likely to influence how other companies in the ecosystem respond and adapt their own approaches to AI development and deployment.

Industry Impact and Implications

The broader implications of this news extend across multiple dimensions of the technology industry. Companies are reassessing their AI strategies in light of these developments, and we're seeing increased investment and focus in related areas. The ripple effects will likely continue to unfold over the coming months.

For developers and technical professionals, this creates both new opportunities and challenges. Staying informed about such developments is crucial for making strategic decisions about skills development, technology choices, and career planning in the AI space.

Future Outlook

As we look ahead, this development is likely to catalyze further innovation and competition in the AI sector. The pace of change shows no signs of slowing, and industry watchers expect to see more significant announcements in the near future. Organizations that can quickly adapt and leverage these advancements will be well-positioned for success.

The AI community plays a vital role in shaping how these technologies develop and are deployed. Through collaboration, discussion, and responsible innovation, the industry continues to push boundaries while addressing important ethical and practical considerations.
  `.trim();
}

export async function POST(request: NextRequest) {
  try {
    // Validate secret
    const { secret, daysBack = 7 } = await request.json();
    const cronSecret = process.env.CRON_SECRET || 'your-secure-cron-secret-key';
    
    if (!secret || secret !== cronSecret) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    console.log(`Generating blog posts for last ${daysBack} days...`);

    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
    const generatedArticles: BlogPost[] = [];

    // Fetch news
    const newsResponse = await fetch(`${baseUrl}/api/news/latest?t=${Date.now()}`);
    if (!newsResponse.ok) {
      throw new Error('Failed to fetch news');
    }

    const newsData = await newsResponse.json();
    const allNews = newsData.data || [];

    if (allNews.length === 0) {
      return NextResponse.json({
        success: false,
        error: 'No news data available'
      });
    }

    // Generate articles for each day
    for (let i = 0; i < daysBack; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);

      // Use different news item for each day
      const newsIndex = i % allNews.length;
      const newsItem = allNews[newsIndex];

      const content = await generateArticleContent(newsItem, date);

      const article: BlogPost = {
        id: `blog-${date.getTime()}`,
        title: newsItem.title || `AI Industry Update - ${date.toLocaleDateString()}`,
        excerpt: newsItem.description || 'Important AI news and industry insights',
        content: content,
        author: 'AI Tech Team',
        category: 'AI News & Updates',
        tags: ['AI', 'Technology', 'News', 'Industry', 'Innovation'],
        featured: i === 0, // Only first one is featured
        publishedAt: date.toISOString(),
        readTime: `${Math.ceil(content.length / 200)} min read`,
        coverImage: getCoverImage(date.getDate() - 1)
      };

      generatedArticles.push(article);

      // Small delay between generations to avoid rate limits
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    // Save all articles
    try {
      const saveResponse = await fetch(`${baseUrl}/api/blog-articles`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ articles: generatedArticles })
      });

      if (!saveResponse.ok) {
        console.error('Failed to save articles');
      }
    } catch (err) {
      console.error('Could not sync to blog-articles:', err);
    }

    return NextResponse.json({
      success: true,
      message: `Generated ${generatedArticles.length} blog articles`,
      articles: generatedArticles.map(a => ({ 
        id: a.id, 
        title: a.title, 
        publishedAt: a.publishedAt 
      }))
    });

  } catch (error) {
    console.error('Missed blog generation error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to generate missed articles'
      },
      { status: 500 }
    );
  }
}
