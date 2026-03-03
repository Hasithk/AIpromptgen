import { Metadata } from 'next';
import { AINewsPage } from '@/components/ai-news-page';

export const metadata: Metadata = {
  title: 'AI News 2026',
  description: 'Latest AI news and prompt updates. Stay informed about new AI models, ChatGPT updates, Midjourney releases, and prompt engineering breakthroughs.',
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
    title: 'AI News & Updates 2026 | AI Prompt Generator',
    description: 'Latest AI news and prompt updates. Stay informed about new AI models, ChatGPT updates, and prompt engineering breakthroughs.',
    type: 'website',
  },
};

export default function AINews() {
  return <AINewsPage />;
}