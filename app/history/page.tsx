import { HistoryPage } from '@/components/history-page';

export const metadata = {
  title: 'AI Prompt History | Manage Your Generated AI Prompts',
  description: 'View and manage your AI prompt generation history. Track all your AI prompts created with our free AI prompt generator for ChatGPT, Midjourney, DALL-E, and Sora.',
  keywords: 'ai prompt history, saved ai prompts, prompt manager, ai prompt organizer',
};

export default function History() {
  return <HistoryPage />;
}