import { NextResponse } from 'next/server';

interface NewsItem {
  id: string;
  title: string;
  description: string;
  url: string;
  urlToImage?: string;
  publishedAt: string;
  source: {
    id: string | null;
    name: string;
  };
  category: string;
  aiRelevance: 'high' | 'medium' | 'low';
}

// Fallback mock data (only used if real API fails)
const mockNewsData: NewsItem[] = [
  {
    id: '1',
    title: 'Latest AI News and Developments',
    description: 'Stay updated with the latest in artificial intelligence and machine learning.',
    url: 'https://openai.com',
    urlToImage: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=400&fit=crop',
    publishedAt: new Date().toISOString(),
    source: { id: 'ai', name: 'AI News' },
    category: 'Model Release',
    aiRelevance: 'high'
  }
];

// Helper to determine AI relevance and category from article content
function analyzeArticle(title: string, description: string): { relevance: 'high' | 'medium' | 'low', category: string } {
  const content = (title + ' ' + description).toLowerCase();
  
  // Determine relevance
  const highRelevanceKeywords = ['chatgpt', 'gpt-', 'openai', 'claude', 'gemini', 'sora', 'midjourney', 'dall-e', 'deepseek', 'ai model', 'llm', 'machine learning', 'neural network', 'deep learning', 'artificial intelligence'];
  const relevance = highRelevanceKeywords.some(k => content.includes(k)) ? 'high' as const : 'medium' as const;
  
  // Determine category
  let category = 'Industry';
  if (content.includes('model') || content.includes('release') || content.includes('launch')) category = 'Model Release';
  if (content.includes('research') || content.includes('breakthrough') || content.includes('study')) category = 'Research';
  if (content.includes('regulation') || content.includes('policy') || content.includes('act')) category = 'Regulation';
  if (content.includes('startup') || content.includes('funding') || content.includes('series')) category = 'Startup';
  
  return { relevance, category };
}

// GET /api/ai-news - Fetch real AI news from /api/news/latest
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const limit = parseInt(searchParams.get('limit') || '20');

    // Fetch real news from /api/news/latest with cache busting
    const timestamp = Date.now();
    const newsResponse = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/news/latest?t=${timestamp}`, {
      method: 'GET',
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache'
      },
      cache: 'no-store' as any
    });

    if (!newsResponse.ok) {
      console.warn('Failed to fetch from /api/news/latest, using fallback');
      return NextResponse.json({
        success: true,
        news: mockNewsData,
        total: mockNewsData.length,
        fallback: true
      });
    }

    const newsData = await newsResponse.json();
    
    if (!newsData.success || !Array.isArray(newsData.data)) {
      console.warn('Invalid response from /api/news/latest, using fallback');
      return NextResponse.json({
        success: true,
        news: mockNewsData,
        total: mockNewsData.length,
        fallback: true
      });
    }

    // Transform news items to include analysis
    let transformedNews: NewsItem[] = newsData.data.map((item: any, index: number) => {
      const analysis = analyzeArticle(item.title, item.description);
      return {
        id: item.id || `news-${index}`,
        title: item.title,
        description: item.description,
        url: item.url,
        urlToImage: item.urlToImage || `https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=400&fit=crop`,
        publishedAt: item.publishedAt,
        source: {
          id: item.source?.toLowerCase() || 'ai',
          name: item.source || 'AI News'
        },
        category: analysis.category,
        aiRelevance: analysis.relevance
      };
    });

    // Filter by category
    if (category && category !== 'All') {
      transformedNews = transformedNews.filter(item => 
        item.category.toLowerCase() === category.toLowerCase()
      );
    }

    // Filter by search term
    if (search) {
      const searchLower = search.toLowerCase();
      transformedNews = transformedNews.filter(item =>
        item.title.toLowerCase().includes(searchLower) ||
        item.description.toLowerCase().includes(searchLower)
      );
    }

    // Sort by publication date (newest first)
    transformedNews.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

    // Apply limit
    transformedNews = transformedNews.slice(0, limit);

    return NextResponse.json(
      {
        success: true,
        news: transformedNews,
        total: transformedNews.length,
        fallback: false
      },
      {
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate'
        }
      }
    );

  } catch (error) {
    console.error('AI News API error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch AI news',
        news: mockNewsData,
        total: mockNewsData.length,
        fallback: true
      },
      { 
        status: 500,
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate'
        }
      }
    );
  }
}