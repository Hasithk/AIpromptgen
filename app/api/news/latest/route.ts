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

    // Use 8 diverse queries to get more articles (aim for 25+)
    const queries = [
      'artificial intelligence',
      'machine learning',
      'ChatGPT',
      'OpenAI',
      'Sora OR Midjourney OR DALL-E',
      'Claude OR Gemini',
      'DeepSeek OR LLM',
      'neural network OR deep learning'
    ];
    let allArticles: any[] = [];
    
    for (const q of queries) {
      try {
        // Increased pageSize from 10 to 20 per query
        const url = `${NEWS_API_BASE_URL}/everything?q=${encodeURIComponent(q)}&sortBy=publishedAt&language=en&pageSize=20&apiKey=${NEWS_API_KEY}`;
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

    // Increased from 10 to 25 articles minimum
    const news = unique
      .filter((a: any) => AI_KEYWORDS.some(k => a.title?.toLowerCase().includes(k.toLowerCase()) || a.description?.toLowerCase().includes(k.toLowerCase())))
      .slice(0, 25)
      .map((a: any, index: number) => ({
        id: `${a.url}-${Date.now()}`,
        title: a.title || 'Untitled',
        description: a.description || '',
        url: a.url,
        urlToImage: a.urlToImage || getPlaceholderImage(index),
        publishedAt: a.publishedAt,
        source: a.source?.name || 'Unknown',
        category: 'AI News'
      }));

    return NextResponse.json(
      { success: true, data: news, timestamp: new Date().toISOString(), total: news.length },
      { headers: { 'Cache-Control': 'no-cache, no-store, must-revalidate' } }
    );
  } catch (error) {
    console.error('News API error:', error);
    
    const fallback = [{
      id: '1',
      title: 'Latest AI News and Updates',
      description: 'Stay updated with the latest in artificial intelligence and machine learning.',
      url: 'https://openai.com',
      urlToImage: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=400&fit=crop',
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

// Generate different placeholder images based on index
function getPlaceholderImage(index: number): string {
  const images = [
    'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=400&fit=crop',
    'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&h=400&fit=crop',
    'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=800&h=400&fit=crop',
    'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=400&fit=crop',
    'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&h=400&fit=crop',
    'https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&h=400&fit=crop',
    'https://images.unsplash.com/photo-1516110833967-0b5716ca1387?w=800&h=400&fit=crop',
    'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800&h=400&fit=crop',
    'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=400&fit=crop',
    'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&h=400&fit=crop',
    'https://images.unsplash.com/photo-1516321318423-f06f70b504b5?w=800&h=400&fit=crop',
    'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=400&fit=crop',
    'https://images.unsplash.com/photo-1460925895917-adf4e565db6d?w=800&h=400&fit=crop',
    'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&h=400&fit=crop',
    'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=400&fit=crop',
    'https://images.unsplash.com/photo-1535821314519-680f4b6781d4?w=800&h=400&fit=crop',
    'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&h=400&fit=crop',
    'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=800&h=400&fit=crop',
    'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&h=400&fit=crop',
    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=400&fit=crop',
    'https://images.unsplash.com/photo-1483058712412-4245999e10d7?w=800&h=400&fit=crop',
    'https://images.unsplash.com/photo-1518611505868-48510c8dfa93?w=800&h=400&fit=crop',
    'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=800&h=400&fit=crop',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=400&fit=crop',
    'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=800&h=400&fit=crop'
  ];
  
  return images[index % images.length];
}
