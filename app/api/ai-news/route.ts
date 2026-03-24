import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const NEWS_API_KEY = process.env.NEWS_API_KEY;
const NEWS_API_BASE_URL = process.env.NEWS_API_BASE_URL || 'https://newsapi.org/v2';

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

// Keywords to check AI relevance
const HIGH_RELEVANCE_KEYWORDS = [
  'chatgpt', 'gpt-4', 'gpt-5', 'openai', 'claude', 'gemini', 'llm',
  'large language model', 'deepseek', 'midjourney', 'dall-e', 'sora',
  'copilot', 'prompt engineering', 'fine-tuning', 'rag', 'transformer'
];
const MEDIUM_RELEVANCE_KEYWORDS = [
  'artificial intelligence', 'machine learning', 'deep learning',
  'neural network', 'nlp', 'computer vision', 'ai model', 'ai agent',
  'generative ai', 'foundation model'
];

// Categorize articles based on content
function categorizeArticle(title: string, description: string): string {
  const text = `${title} ${description}`.toLowerCase();
  if (/launch|release|introduces|unveils|announces.*model|new model|upgrade/.test(text)) return 'Model Release';
  if (/research|study|paper|breakthrough|discovers|scientists/.test(text)) return 'Research';
  if (/startup|funding|raises|valuation|series [a-d]|seed round|venture/.test(text)) return 'Startup';
  if (/regulat|law|act|policy|govern|eu ai|compliance|ban/.test(text)) return 'Regulation';
  return 'Industry';
}

// Determine AI relevance
function getAIRelevance(title: string, description: string): 'high' | 'medium' | 'low' {
  const text = `${title} ${description}`.toLowerCase();
  if (HIGH_RELEVANCE_KEYWORDS.some(k => text.includes(k))) return 'high';
  if (MEDIUM_RELEVANCE_KEYWORDS.some(k => text.includes(k))) return 'medium';
  return 'low';
}

// Placeholder images
const PLACEHOLDER_IMAGES = [
  'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=400&fit=crop',
  'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&h=400&fit=crop',
  'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=800&h=400&fit=crop',
  'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=400&fit=crop',
  'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&h=400&fit=crop',
  'https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&h=400&fit=crop',
  'https://images.unsplash.com/photo-1516110833967-0b5716ca1387?w=800&h=400&fit=crop',
  'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800&h=400&fit=crop',
];

// Build fallback data on-demand so dates do not get stuck on a warm server instance.
function getMockNewsData(): NewsItem[] {
  return [
    {
      id: '1',
      title: 'OpenAI Announces GPT-5 with Revolutionary Multimodal Capabilities',
      description: 'OpenAI unveils GPT-5, featuring advanced reasoning, real-time web access, and unprecedented multimodal understanding across text, images, audio, and video.',
      url: 'https://openai.com/gpt-5',
      urlToImage: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=400&fit=crop',
      publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      source: { id: 'openai', name: 'OpenAI Blog' },
      category: 'Model Release',
      aiRelevance: 'high'
    },
    {
      id: '2',
      title: 'Google DeepMind Achieves Breakthrough in AI Agent Navigation',
      description: 'New research from Google DeepMind demonstrates AI agents that can navigate complex 3D environments with human-level spatial reasoning and planning.',
      url: 'https://deepmind.google/research/publications/',
      urlToImage: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&h=400&fit=crop',
      publishedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
      source: { id: 'deepmind', name: 'DeepMind Research' },
      category: 'Research',
      aiRelevance: 'high'
    },
    {
      id: '3',
      title: 'Microsoft Copilot Integration Reaches 1 Billion Users Worldwide',
      description: 'Microsoft announces that Copilot AI assistant has reached 1 billion users across Office 365, Windows, and developer tools.',
      url: 'https://news.microsoft.com/copilot-milestone/',
      urlToImage: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=800&h=400&fit=crop',
      publishedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
      source: { id: 'microsoft', name: 'Microsoft News' },
      category: 'Industry',
      aiRelevance: 'high'
    },
    {
      id: '4',
      title: 'Anthropic Claude Shows Superior Code Generation',
      description: 'Latest benchmarks reveal Claude outperforming competitors in code generation tasks, with 94% accuracy in complex programming challenges.',
      url: 'https://www.anthropic.com/news/',
      urlToImage: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=400&fit=crop',
      publishedAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
      source: { id: 'anthropic', name: 'Anthropic Research' },
      category: 'Model Release',
      aiRelevance: 'high'
    },
    {
      id: '5',
      title: 'Meta AI Introduces Advanced Video Generation Model',
      description: 'Meta unveils new AI model capable of generating high-quality videos from text descriptions, competing directly with OpenAI Sora and Google Veo.',
      url: 'https://ai.meta.com/research/',
      urlToImage: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&h=400&fit=crop',
      publishedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
      source: { id: 'meta', name: 'Meta AI Research' },
      category: 'Model Release',
      aiRelevance: 'high'
    },
    {
      id: '6',
      title: 'EU AI Act Implementation Guidelines Released',
      description: 'European Union publishes comprehensive guidelines for implementing the AI Act, affecting how AI companies operate in European markets.',
      url: 'https://digital-strategy.ec.europa.eu/en/policies/artificial-intelligence',
      urlToImage: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&h=400&fit=crop',
      publishedAt: new Date(Date.now() - 18 * 60 * 60 * 1000).toISOString(),
      source: { id: 'eu', name: 'European Commission' },
      category: 'Regulation',
      aiRelevance: 'medium'
    },
    {
      id: '7',
      title: 'Open-Source LLMs Rival Proprietary Models',
      description: 'New open-source large language models demonstrate competitive performance with proprietary alternatives, democratizing AI access.',
      url: 'https://huggingface.co/',
      urlToImage: 'https://images.unsplash.com/photo-1516110833967-0b5716ca1387?w=800&h=400&fit=crop',
      publishedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      source: { id: 'huggingface', name: 'Hugging Face' },
      category: 'Model Release',
      aiRelevance: 'high'
    },
    {
      id: '8',
      title: 'AI Startup Perplexity Raises $500M in Funding',
      description: 'AI-powered search engine Perplexity secures $500 million in funding amid growing competition in the AI search space.',
      url: 'https://www.perplexity.ai/',
      urlToImage: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800&h=400&fit=crop',
      publishedAt: new Date(Date.now() - 36 * 60 * 60 * 1000).toISOString(),
      source: { id: 'perplexity', name: 'Perplexity AI' },
      category: 'Startup',
      aiRelevance: 'medium'
    }
  ];
}

// Fetch real news from NewsAPI
async function fetchRealNews(): Promise<NewsItem[]> {
  if (!NEWS_API_KEY) {
    console.warn('NEWS_API_KEY not configured, using fallback data');
    return [];
  }

  const queries = [
    'artificial intelligence',
    'ChatGPT OR OpenAI',
    'machine learning OR deep learning',
    'Claude OR Gemini OR DeepSeek',
    'LLM OR "large language model"',
    'Sora OR Midjourney OR DALL-E',
  ];

  let allArticles: any[] = [];

  for (const q of queries) {
    try {
      const url = `${NEWS_API_BASE_URL}/everything?q=${encodeURIComponent(q)}&sortBy=publishedAt&language=en&pageSize=15&apiKey=${NEWS_API_KEY}`;
      const response = await fetch(url, {
        cache: 'no-store' as any,
        headers: { 'Cache-Control': 'no-cache' },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.articles && Array.isArray(data.articles)) {
          allArticles = allArticles.concat(data.articles);
        }
      } else {
        console.warn(`NewsAPI query "${q}" returned status ${response.status}`);
      }
    } catch (e) {
      console.warn(`Failed to fetch query "${q}":`, e);
    }
  }

  if (allArticles.length === 0) return [];

  // Deduplicate by URL
  const unique = Array.from(new Map(allArticles.map((a: any) => [a.url, a])).values());

  // Sort newest first
  unique.sort((a: any, b: any) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

  // Filter for AI relevance and transform
  const AI_KEYWORDS = [
    'artificial intelligence', 'AI', 'machine learning', 'ChatGPT', 'Sora',
    'Midjourney', 'DALL-E', 'Claude', 'Gemini', 'OpenAI', 'DeepSeek',
    'LLM', 'neural network', 'deep learning', 'GPT', 'copilot',
    'generative ai', 'transformer', 'prompt', 'fine-tuning',
  ];

  const newsItems: NewsItem[] = unique
    .filter((a: any) =>
      a.title && a.description &&
      AI_KEYWORDS.some(k =>
        a.title?.toLowerCase().includes(k.toLowerCase()) ||
        a.description?.toLowerCase().includes(k.toLowerCase())
      )
    )
    .slice(0, 25)
    .map((a: any, index: number) => ({
      id: `news-${index}-${Date.now()}`,
      title: a.title || 'Untitled',
      description: a.description || '',
      url: a.url,
      urlToImage: a.urlToImage || PLACEHOLDER_IMAGES[index % PLACEHOLDER_IMAGES.length],
      publishedAt: a.publishedAt,
      source: {
        id: a.source?.id || null,
        name: a.source?.name || 'Unknown',
      },
      category: categorizeArticle(a.title || '', a.description || ''),
      aiRelevance: getAIRelevance(a.title || '', a.description || ''),
    }));

  return newsItems;
}

// GET /api/ai-news - Get AI news with filtering (fetches real news from NewsAPI)
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const limit = parseInt(searchParams.get('limit') || '20');

    // Try fetching real news first
    const fallbackNewsData = getMockNewsData();
    let isFallbackData = false;
    let newsData = await fetchRealNews();

    // Fall back to mock data if real news fetch returned nothing
    if (newsData.length === 0) {
      console.log('Using fallback mock news data');
      newsData = fallbackNewsData;
      isFallbackData = true;
    }

    let filteredNews = [...newsData];

    // Filter by category
    if (category && category !== 'All') {
      filteredNews = filteredNews.filter(item =>
        item.category.toLowerCase() === category.toLowerCase()
      );
    }

    // Filter by search term
    if (search) {
      const searchLower = search.toLowerCase();
      filteredNews = filteredNews.filter(item =>
        item.title.toLowerCase().includes(searchLower) ||
        item.description.toLowerCase().includes(searchLower)
      );
    }

    // Sort by publication date (newest first)
    filteredNews.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

    // Apply limit
    filteredNews = filteredNews.slice(0, limit);

    return NextResponse.json(
      {
        success: true,
        news: filteredNews,
        total: filteredNews.length,
        live: !isFallbackData,
      },
      {
        headers: { 'Cache-Control': 'no-store, max-age=0' },
      }
    );
  } catch (error) {
    console.error('AI News API error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch AI news',
        news: getMockNewsData().slice(0, 8),
        total: 8,
      },
      { status: 500 }
    );
  }
}