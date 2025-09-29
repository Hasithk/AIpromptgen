import { HistoryPage } from '@/components/history-page';

export const metadata = {
  title: 'Prompt History | AI Prompt Generator',
  description: 'View and manage your generated AI prompts history.',
};

export default function History() {
  return <HistoryPage />;
}