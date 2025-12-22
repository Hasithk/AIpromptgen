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

// Mock AI news data
const mockNewsData: NewsItem[] = [
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
    url: 'https://deepmind.google/research/publications/2024/',
    urlToImage: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&h=400&fit=crop',
    publishedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    source: { id: 'deepmind', name: 'DeepMind Research' },
    category: 'Research',
    aiRelevance: 'high'
  },
  {
    id: '3',
    title: 'Microsoft Copilot Integration Reaches 1 Billion Users Worldwide',
    description: 'Microsoft announces that Copilot AI assistant has reached 1 billion users across Office 365, Windows, and developer tools, marking a major milestone.',
    url: 'https://news.microsoft.com/copilot-milestone/',
    urlToImage: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=800&h=400&fit=crop',
    publishedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    source: { id: 'microsoft', name: 'Microsoft News' },
    category: 'Industry',
    aiRelevance: 'high'
  },
  {
    id: '4',
    title: 'Anthropic Claude 3.5 Sonnet Shows Superior Code Generation',
    description: 'Latest benchmarks reveal Claude 3.5 Sonnet outperforming competitors in code generation tasks, with 94% accuracy in complex programming challenges.',
    url: 'https://www.anthropic.com/news/claude-3-5-sonnet',
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
    url: 'https://ai.meta.com/research/publications/2024/',
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
    title: 'Stability AI Releases Open-Source LLM with 175B Parameters',
    description: 'Stability AI launches Stable LLM 175B, a fully open-source large language model that rivals GPT-4 performance while being freely available.',
    url: 'https://stability.ai/news/stable-llm-175b',
    urlToImage: 'https://images.unsplash.com/photo-1516110833967-0b5716ca1387?w=800&h=400&fit=crop',
    publishedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    source: { id: 'stability', name: 'Stability AI' },
    category: 'Model Release',
    aiRelevance: 'high'
  },
  {
    id: '8',
    title: 'AI Startup Perplexity Raises $500M in Series C Funding',
    description: 'AI-powered search engine Perplexity secures $500 million in Series C funding, valuing the company at $9 billion amid growing competition.',
    url: 'https://www.perplexity.ai/news/series-c-funding',
    urlToImage: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800&h=400&fit=crop',
    publishedAt: new Date(Date.now() - 36 * 60 * 60 * 1000).toISOString(),
    source: { id: 'perplexity', name: 'Perplexity AI' },
    category: 'Startup',
    aiRelevance: 'medium'
  }
];

// GET /api/ai-news - Get AI news with filtering
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const limit = parseInt(searchParams.get('limit') || '20');

    let filteredNews = [...mockNewsData];

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

    return NextResponse.json({
      success: true,
      news: filteredNews,
      total: filteredNews.length
    });

  } catch (error) {
    console.error('AI News API error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch AI news',
        news: [],
        total: 0 
      },
      { status: 500 }
    );
  }
}