import { Metadata } from 'next';
import { BlogPage } from '@/components/blog-page';

export const metadata: Metadata = {
  title: 'AI Prompt Blog & Tips 2026',
  description: 'AI prompt tips, tutorials and examples. Learn prompt engineering for ChatGPT, Midjourney, DALL-E. Updated daily with expert AI prompt guides.',
  keywords: 'ai prompt blog, ai prompt tips, ai prompt examples, prompt engineering guide, chatgpt prompt tips, midjourney prompt tips, ai prompt tutorial, how to write ai prompts, best ai prompts 2026',
  alternates: {
    canonical: 'https://www.aipromptgen.app/blog',
  },
  openGraph: {
    title: 'AI Prompt Blog & Tips | AI Prompt Generator',
    description: 'AI prompt tips, tutorials and examples. Learn prompt engineering for ChatGPT, Midjourney, DALL-E with expert guides.',
    url: 'https://www.aipromptgen.app/blog',
    type: 'website',
  },
};

export default function Blog() {
  return <BlogPage />;
}