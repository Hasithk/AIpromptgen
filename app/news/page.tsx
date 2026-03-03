import { NewsPage } from '@/components/news-page';

export const metadata = {
  title: 'AI & Tech News Feed 2026',
  description: 'Latest AI news and prompt engineering updates. Stay informed about AI model releases, ChatGPT updates, and AI prompt trends.',
  keywords: 'ai news, ai prompt news, ai updates, ai trends 2026, chatgpt news, midjourney updates, ai prompt engineering news',
  alternates: {
    canonical: 'https://www.aipromptgen.app/news',
  },
};

export default function News() {
  return <NewsPage />;
}
