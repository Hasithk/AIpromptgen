import { LibraryPage } from '@/components/library-page';

export const metadata = {
  title: 'AI Prompt Library | 500+ Free AI Prompt Templates for ChatGPT, Midjourney, DALL-E',
  description: 'Browse 500+ curated AI prompt templates. Free AI prompts for ChatGPT, Midjourney, DALL-E, Sora, Claude, Gemini. Copy-paste ready AI prompt examples for text, image, video, and code generation.',
  keywords: 'ai prompt library, ai prompt templates, free ai prompts, chatgpt prompts, midjourney prompts, dall-e prompts, sora prompts, ai prompt examples, prompt collection',
  alternates: {
    canonical: 'https://www.aipromptgen.app/library',
  },
  openGraph: {
    title: 'AI Prompt Library - 500+ Free AI Prompt Templates',
    description: 'Curated collection of proven AI prompt templates for every platform.',
    url: 'https://www.aipromptgen.app/library',
  },
};

export default function Library() {
  return <LibraryPage />;
}