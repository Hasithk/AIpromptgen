import { Metadata } from 'next';
import { AINewsPage } from '@/components/ai-news-page';

export const metadata: Metadata = {
  title: 'AI News & AI Prompt Updates | Latest AI Trends 2026',
  description: 'Latest AI news, AI prompt trends, and technology updates. Stay informed about new AI models, prompt engineering breakthroughs, ChatGPT updates, Midjourney releases, and the latest AI prompt techniques.',
  keywords: [
    'AI news',
    'ai prompt news',
    'ai prompt updates',
    'artificial intelligence news',
    'AI technology trends 2026',
    'AI model releases',
    'chatgpt updates',
    'midjourney news',
    'ai prompt engineering updates',
    'AI innovations'
  ],
  alternates: {
    canonical: 'https://www.aipromptgen.app/ai-news',
  },
  openGraph: {
    title: 'AI News & AI Prompt Updates - Latest 2026',
    description: 'Stay updated with AI news, prompt engineering breakthroughs, and model releases.',
    type: 'website',
  },
};

export default function AINews() {
  return <AINewsPage />;
}