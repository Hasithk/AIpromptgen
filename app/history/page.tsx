import { HistoryPage } from '@/components/history-page';

export const metadata = {
  title: 'My AI Prompt History',
  description: 'View and manage your AI prompt history. Track all prompts created with our free AI prompt generator for ChatGPT and Midjourney.',
  keywords: 'ai prompt history, saved ai prompts, prompt manager, ai prompt organizer',
};

export default function History() {
  return <HistoryPage />;
}