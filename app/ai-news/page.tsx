import { Metadata } from 'next';
import { AINewsPage } from '@/components/ai-news-page';

export const metadata: Metadata = {
  title: 'AI News | Stay Updated with Latest AI Trends & Developments',
  description: 'Get the latest AI news, breakthrough technologies, model releases, and industry insights. Stay ahead with real-time updates from the world of artificial intelligence.',
  keywords: [
    'AI news',
    'artificial intelligence news',
    'machine learning updates',
    'AI technology trends',
    'AI model releases',
    'AI research breakthroughs',
    'tech industry news',
    'AI innovations'
  ],
  openGraph: {
    title: 'AI News - Latest Artificial Intelligence Updates',
    description: 'Stay updated with the latest AI news, model releases, and industry breakthroughs.',
    type: 'website',
  },
};

export default function AINews() {
  return <AINewsPage />;
}