import { NextResponse } from 'next/server';
import { NewsItem } from '@/types';

const NEWS_API_KEY = process.env.NEWS_API_KEY;
const NEWS_API_BASE_URL = process.env.NEWS_API_BASE_URL || 'https://newsapi.org/v2';

const AI_KEYWORDS = ['artificial intelligence', 'AI', 'machine learning', 'ChatGPT', 'Sora', 'Midjourney', 'DALL-E', 'Claude', 'Gemini'];

export async function GET() {
  try {
    if (!NEWS_API_KEY) {
      throw new Error('NEWS_API_KEY not configured');
    }

    const queries = ['artificial intelligence', 'machine learning', 'ChatGPT', 'Sora OR Midjourney'];
    let allArticles: any[] = [];
    
    for (const q of queries) {
      try {
        const url = `${NEWS_API_BASE_URL}/everything?q=${encodeURIComponent(q)}&sortBy=publishedAt&language=en&pageSize=10&apiKey=${NEWS_API_KEY}`;
        const response = await fetch(url, { 
          cache: 'no-store' as any,
          headers: { 'Cache-Control': 'no-cache' }
        });
        
        if (response.ok) {
          const data = await response.json();
          if (data.articles && Array.isArray(data.articles)) {
            allArticles = allArticles.concat(data.articles);
          }
        }
      } catch (e) {
        console.warn(`Failed to fetch query "${q}":`, e);
      }
    }

    if (allArticles.length === 0) throw new Error('No articles found from NewsAPI');

    const unique = Array.from(new Map(allArticles.map((a: any) => [a.url, a])).values());
    unique.sort((a: any, b: any) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

    const news = unique
      .filter((a: any) => AI_KEYWORDS.some(k => a.title?.toLowerCase().includes(k.toLowerCase()) || a.description?.toLowerCase().includes(k.toLowerCase())))
      .slice(0, 10)
      .map((a: any) => ({
        id: `${a.url}-${Date.now()}`,
        title: a.title || 'Untitled',
        description: a.description || '',
        url: a.url,
        publishedAt: a.publishedAt,
        source: a.source?.name || 'Unknown',
        category: 'AI News'
      }));

    return NextResponse.json(
      { success: true, data: news, timestamp: new Date().toISOString() },
      { headers: { 'Cache-Control': 'no-cache, no-store, must-revalidate' } }
    );
  } catch (error) {
    console.error('News API error:', error);
    
    const fallback = [{
      id: '1',
      title: 'Latest AI News and Updates',
      description: 'Stay updated with the latest in artificial intelligence and machine learning.',
      url: 'https://openai.com',
      publishedAt: new Date().toISOString(),
      source: 'AI News',
      category: 'General AI'
    }];

    return NextResponse.json(
      { success: true, data: fallback, fallback: true },
      { headers: { 'Cache-Control': 'no-cache, no-store, must-revalidate' } }
    );
  }
}
