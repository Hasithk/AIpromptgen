import { Metadata } from 'next';
import { BlogPage } from '@/components/blog-page';

export const metadata: Metadata = {
  title: 'AI Prompt Blog | AI Prompt Tips, Examples & Engineering Guides (2026)',
  description: 'Expert AI prompt guides, tutorials, and examples updated daily. Learn how to write the best AI prompts for ChatGPT, Midjourney, DALL-E, Sora. Free AI prompt tips and prompt engineering techniques.',
  keywords: 'ai prompt blog, ai prompt tips, ai prompt examples, prompt engineering guide, chatgpt prompt tips, midjourney prompt tips, ai prompt tutorial, how to write ai prompts, best ai prompts 2026',
  alternates: {
    canonical: 'https://www.aipromptgen.app/blog',
  },
  openGraph: {
    title: 'AI Prompt Blog - Tips, Examples & Engineering Guides',
    description: 'Daily AI prompt tips, examples, and engineering guides for ChatGPT, Midjourney, DALL-E, Sora.',
    url: 'https://www.aipromptgen.app/blog',
    type: 'website',
  },
};

export default function Blog() {
  return <BlogPage />;
}