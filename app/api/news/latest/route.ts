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
    
    // Return comprehensive fallback with 25+ articles
    const fallback = [
      {
        id: '1',
        title: 'Latest AI News and Updates',
        description: 'Stay updated with the latest in artificial intelligence and machine learning breakthroughs.',
        url: 'https://openai.com',
        urlToImage: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=400&fit=crop',
        publishedAt: new Date(Date.now() - 0 * 60000).toISOString(),
        source: 'AI News',
        category: 'AI News & Updates'
      },
      {
        id: '2',
        title: 'Machine Learning Advances Transform Industry',
        description: 'New breakthroughs in machine learning are revolutionizing how businesses operate globally.',
        url: 'https://deepmind.google/discover/',
        urlToImage: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&h=400&fit=crop',
        publishedAt: new Date(Date.now() - 60 * 60000).toISOString(),
        source: 'Tech Daily',
        category: 'AI News & Updates'
      },
      {
        id: '3',
        title: 'ChatGPT Reaches New Milestone',
        description: 'OpenAI\'s ChatGPT continues to lead the generative AI revolution.',
        url: 'https://chat.openai.com',
        urlToImage: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=800&h=400&fit=crop',
        publishedAt: new Date(Date.now() - 120 * 60000).toISOString(),
        source: 'AI Insider',
        category: 'AI News & Updates'
      },
      {
        id: '4',
        title: 'Deep Learning Models Show Remarkable Progress',
        description: 'Recent developments in deep learning demonstrate unprecedented capabilities.',
        url: 'https://arxiv.org',
        urlToImage: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=400&fit=crop',
        publishedAt: new Date(Date.now() - 180 * 60000).toISOString(),
        source: 'AI Research',
        category: 'AI News & Updates'
      },
      {
        id: '5',
        title: 'Neural Networks Push Boundaries Further',
        description: 'Artificial neural networks achieve new performance benchmarks across multiple domains.',
        url: 'https://www.deeplearning.ai',
        urlToImage: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&h=400&fit=crop',
        publishedAt: new Date(Date.now() - 240 * 60000).toISOString(),
        source: 'AI Weekly',
        category: 'AI News & Updates'
      },
      {
        id: '6',
        title: 'AI in Healthcare: Revolutionary Applications',
        description: 'Artificial intelligence is transforming medical diagnosis and treatment.',
        url: 'https://www.ibm.com/cloud/watson',
        urlToImage: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&h=400&fit=crop',
        publishedAt: new Date(Date.now() - 300 * 60000).toISOString(),
        source: 'Medical AI',
        category: 'AI News & Updates'
      },
      {
        id: '7',
        title: 'Natural Language Processing Reaches New Heights',
        description: 'NLP models demonstrate human-like understanding of language.',
        url: 'https://huggingface.co',
        urlToImage: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&h=400&fit=crop',
        publishedAt: new Date(Date.now() - 360 * 60000).toISOString(),
        source: 'NLP Digest',
        category: 'AI News & Updates'
      },
      {
        id: '8',
        title: 'Computer Vision AI Powers New Applications',
        description: 'Advanced computer vision systems enable unprecedented visual understanding.',
        url: 'https://www.nvidia.com/en-us/ai/',
        urlToImage: 'https://images.unsplash.com/photo-1677442d019cecf4d49f109fb4fdb618?w=800&h=400&fit=crop',
        publishedAt: new Date(Date.now() - 420 * 60000).toISOString(),
        source: 'Vision AI',
        category: 'AI News & Updates'
      },
      {
        id: '9',
        title: 'Robotics AI Systems Advance Rapidly',
        description: 'Artificial intelligence is accelerating developments in robotics technology.',
        url: 'https://www.boston-engineering.com',
        urlToImage: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=800&h=400&fit=crop',
        publishedAt: new Date(Date.now() - 480 * 60000).toISOString(),
        source: 'Robotics News',
        category: 'AI News & Updates'
      },
      {
        id: '10',
        title: 'Quantum Computing Meets Artificial Intelligence',
        description: 'The intersection of quantum computing and AI opens new possibilities.',
        url: 'https://www.ibm.com/quantum',
        urlToImage: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&h=400&fit=crop',
        publishedAt: new Date(Date.now() - 540 * 60000).toISOString(),
        source: 'Quantum Daily',
        category: 'AI News & Updates'
      },
      {
        id: '11',
        title: 'AI Security and Ethical Considerations',
        description: 'Emerging challenges in AI security require innovative solutions.',
        url: 'https://www.nist.gov',
        urlToImage: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=400&fit=crop',
        publishedAt: new Date(Date.now() - 600 * 60000).toISOString(),
        source: 'AI Ethics',
        category: 'AI News & Updates'
      },
      {
        id: '12',
        title: 'Large Language Models Transforming Tech',
        description: 'LLMs continue to reshape the technological landscape globally.',
        url: 'https://www.anthropic.com',
        urlToImage: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&h=400&fit=crop',
        publishedAt: new Date(Date.now() - 660 * 60000).toISOString(),
        source: 'LLM Weekly',
        category: 'AI News & Updates'
      },
      {
        id: '13',
        title: 'AI in Business: Enterprise Solutions Grow',
        description: 'Businesses adopt AI solutions at unprecedented rates for competitive advantage.',
        url: 'https://www.google.com/cloud/ai',
        urlToImage: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&h=400&fit=crop',
        publishedAt: new Date(Date.now() - 720 * 60000).toISOString(),
        source: 'Enterprise AI',
        category: 'AI News & Updates'
      },
      {
        id: '14',
        title: 'Generative AI Models Breaking Barriers',
        description: 'Generative AI capabilities expand faster than ever before.',
        url: 'https://www.midjourney.com',
        urlToImage: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=400&fit=crop',
        publishedAt: new Date(Date.now() - 780 * 60000).toISOString(),
        source: 'Gen AI Hub',
        category: 'AI News & Updates'
      },
      {
        id: '15',
        title: 'AI Literacy Becomes Essential Skill',
        description: 'Understanding AI is becoming critical for professionals across industries.',
        url: 'https://www.coursera.org',
        urlToImage: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=800&h=400&fit=crop',
        publishedAt: new Date(Date.now() - 840 * 60000).toISOString(),
        source: 'AI Education',
        category: 'AI News & Updates'
      },
      {
        id: '16',
        title: 'AI Models Achieve Human-Level Performance',
        description: 'New benchmarks show AI systems matching human capabilities.',
        url: 'https://www.superannotate.com',
        urlToImage: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=400&fit=crop',
        publishedAt: new Date(Date.now() - 900 * 60000).toISOString(),
        source: 'AI Benchmark',
        category: 'AI News & Updates'
      },
      {
        id: '17',
        title: 'Multimodal AI Systems Advance',
        description: 'AI systems processing multiple data types show remarkable capabilities.',
        url: 'https://www.openai.com',
        urlToImage: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&h=400&fit=crop',
        publishedAt: new Date(Date.now() - 960 * 60000).toISOString(),
        source: 'Multimodal AI',
        category: 'AI News & Updates'
      },
      {
        id: '18',
        title: 'Edge AI Computing Grows Rapidly',
        description: 'AI deployment on edge devices enables new applications and efficiency.',
        url: 'https://www.qualcomm.com',
        urlToImage: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&h=400&fit=crop',
        publishedAt: new Date(Date.now() - 1020 * 60000).toISOString(),
        source: 'Edge AI',
        category: 'AI News & Updates'
      },
      {
        id: '19',
        title: 'AI for Climate Change Solutions',
        description: 'Artificial intelligence plays a key role in addressing climate challenges.',
        url: 'https://www.climatetechlist.com',
        urlToImage: 'https://images.unsplash.com/photo-1677442d019cecf4d49f109fb4fdb618?w=800&h=400&fit=crop',
        publishedAt: new Date(Date.now() - 1080 * 60000).toISOString(),
        source: 'Climate AI',
        category: 'AI News & Updates'
      },
      {
        id: '20',
        title: 'AI Startups Attract Record Funding',
        description: 'Investment in AI startups reaches all-time highs as the sector matures.',
        url: 'https://www.crunchbase.com',
        urlToImage: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&h=400&fit=crop',
        publishedAt: new Date(Date.now() - 1140 * 60000).toISOString(),
        source: 'Venture AI',
        category: 'AI News & Updates'
      },
      {
        id: '21',
        title: 'Open Source AI Projects Flourish',
        description: 'Open source initiatives democratize AI development and deployment.',
        url: 'https://github.com',
        urlToImage: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=800&h=400&fit=crop',
        publishedAt: new Date(Date.now() - 1200 * 60000).toISOString(),
        source: 'Open AI',
        category: 'AI News & Updates'
      },
      {
        id: '22',
        title: 'AI Infrastructure Investments Soar',
        description: 'Companies invest heavily in AI infrastructure and GPU availability.',
        url: 'https://www.nvidia.com',
        urlToImage: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=400&fit=crop',
        publishedAt: new Date(Date.now() - 1260 * 60000).toISOString(),
        source: 'Infrastructure',
        category: 'AI News & Updates'
      },
      {
        id: '23',
        title: 'AI in Creative Industries Takes Off',
        description: 'Generative AI transforms art, music, and content creation.',
        url: 'https://www.dall-e.com',
        urlToImage: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&h=400&fit=crop',
        publishedAt: new Date(Date.now() - 1320 * 60000).toISOString(),
        source: 'Creative AI',
        category: 'AI News & Updates'
      },
      {
        id: '24',
        title: 'AI APIs Enable New Integrations',
        description: 'Accessible AI APIs allow developers to build innovative applications.',
        url: 'https://www.developer.com',
        urlToImage: 'https://images.unsplash.com/photo-1677442d019cecf4d49f109fb4fdb618?w=800&h=400&fit=crop',
        publishedAt: new Date(Date.now() - 1380 * 60000).toISOString(),
        source: 'Developer News',
        category: 'AI News & Updates'
      },
      {
        id: '25',
        title: 'AI Research Acceleration Continues',
        description: 'Academic and industry research in AI shows no signs of slowing down.',
        url: 'https://www.research.com',
        urlToImage: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&h=400&fit=crop',
        publishedAt: new Date(Date.now() - 1440 * 60000).toISOString(),
        source: 'Research Daily',
        category: 'AI News & Updates'
      }
    ];

    return NextResponse.json(
      { success: true, data: fallback, fallback: true, total: fallback.length },
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
