import { NextResponse } from 'next/server';
import { NewsItem } from '@/types';

const NEWS_API_KEY = process.env.NEWS_API_KEY || '88ec2cc8ec274a1ba697cfdb6b353ab3';
const NEWS_API_BASE_URL = process.env.NEWS_API_BASE_URL || 'https://newsapi.org/v2';

// AI-related keywords to filter news
const AI_KEYWORDS = [
  'artificial intelligence',
  'AI',
  'machine learning',
  'deep learning',
  'neural network',
  'OpenAI',
  'ChatGPT',
  'GPT',
  'Sora',
  'Veo',
  'Midjourney',
  'DALL-E',
  'Claude',
  'Gemini',
  'Copilot',
  'prompt engineering',
  'generative AI',
  'computer vision',
  'natural language processing',
  'NLP',
  'LLM',
  'large language model'
];

export async function GET() {
  try {
    // Fetch AI-related news from NewsAPI
    const aiQuery = AI_KEYWORDS.slice(0, 5).join(' OR '); // Use first 5 keywords to avoid URL length issues
    const url = `${NEWS_API_BASE_URL}/everything?q=${encodeURIComponent(aiQuery)}&sortBy=publishedAt&language=en&pageSize=20&apiKey=${NEWS_API_KEY}`;
    
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'AI-Prompts-Gen/1.0'
      }
    });

    if (!response.ok) {
      throw new Error(`News API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    if (data.status !== 'ok') {
      throw new Error(`News API error: ${data.message || 'Unknown error'}`);
    }

    // Transform the data to match our NewsItem interface
    const newsItems: NewsItem[] = data.articles
      .filter((article: any) => 
        article.title && 
        article.description && 
        article.url &&
        // Filter for AI-related content more strictly
        AI_KEYWORDS.some(keyword => 
          article.title.toLowerCase().includes(keyword.toLowerCase()) ||
          article.description.toLowerCase().includes(keyword.toLowerCase())
        )
      )
      .slice(0, 10) // Limit to 10 articles
      .map((article: any, index: number) => ({
        id: `news-${index}-${Date.now()}`,
        title: article.title,
        description: article.description,
        url: article.url,
        publishedAt: article.publishedAt,
        source: article.source?.name || 'Unknown Source',
        category: categorizeAINews(article.title, article.description)
      }));

    return NextResponse.json({
      success: true,
      data: newsItems
    });
  } catch (error) {
    console.error('News fetch error:', error);
    
    // Fallback to mock data if API fails
    const fallbackNews: NewsItem[] = [
      {
        id: '1',
        title: 'OpenAI Releases Sora 2.0 with Enhanced Video Generation',
        description: 'The latest version of Sora introduces longer video sequences and improved quality.',
        url: 'https://openai.com/sora',
        publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        source: 'OpenAI',
        category: 'Video AI'
      },
      {
        id: '2',
        title: 'Google\'s Veo 3 Shows Breakthrough in Video Understanding',
        description: 'New capabilities in scene comprehension and object tracking revealed.',
        url: 'https://deepmind.google/technologies/veo/',
        publishedAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
        source: 'Google DeepMind',
        category: 'Google AI'
      },
      {
        id: '3',
        title: 'Midjourney V7 Beta: Revolutionary Prompt Engineering',
        description: 'Enhanced natural language understanding and style control features.',
        url: 'https://www.midjourney.com',
        publishedAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
        source: 'Midjourney',
        category: 'Image AI'
      }
    ];

    return NextResponse.json({
      success: true,
      data: fallbackNews,
      fallback: true
    });
  }
}

// Helper function to categorize AI news based on content
function categorizeAINews(title: string, description: string): string {
  const content = (title + ' ' + description).toLowerCase();
  
  if (content.includes('sora') || content.includes('video')) return 'Video AI';
  if (content.includes('midjourney') || content.includes('dall-e') || content.includes('image')) return 'Image AI';
  if (content.includes('chatgpt') || content.includes('gpt') || content.includes('claude')) return 'Language Models';
  if (content.includes('google') || content.includes('gemini') || content.includes('veo')) return 'Google AI';
  if (content.includes('openai')) return 'OpenAI';
  if (content.includes('prompt engineering') || content.includes('prompt')) return 'Prompt Engineering';
  if (content.includes('machine learning') || content.includes('deep learning')) return 'ML/DL';
  if (content.includes('computer vision')) return 'Computer Vision';
  if (content.includes('nlp') || content.includes('natural language')) return 'NLP';
  
  return 'General AI';
}