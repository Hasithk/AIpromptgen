import { LibraryPage } from '@/components/library-page';

export const metadata = {
  title: 'AI Prompt Library - 500+ Templates',
  description: 'Browse 500+ free AI prompt templates for ChatGPT, Midjourney, DALL-E and Sora. Copy-paste ready AI prompts for text, image and code.',
  keywords: 'ai prompt library, ai prompt templates, free ai prompts, chatgpt prompts, midjourney prompts, dall-e prompts, sora prompts, ai prompt examples, prompt collection',
  alternates: {
    canonical: 'https://www.aipromptgen.app/library',
  },
  openGraph: {
    title: 'AI Prompt Library - 500+ Free Templates',
    description: 'Browse 500+ free AI prompt templates for ChatGPT, Midjourney, DALL-E and Sora. Copy-paste ready AI prompts.',
    url: 'https://www.aipromptgen.app/library',
  },
};

export default function Library() {
  return <LibraryPage />;
}