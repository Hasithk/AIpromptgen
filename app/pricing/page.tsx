import { Metadata } from 'next';
import { PricingPage } from '@/components/pricing-page';

export const metadata: Metadata = {
  title: 'AI Prompt Generator Pricing | Free AI Prompt Tool + Pro Plans',
  description: 'AI Prompt Generator pricing plans. Start free with 70 AI prompt generations monthly. Pro plan for unlimited AI prompts. Best value AI prompt tool for ChatGPT, Midjourney, DALL-E, Sora.',
  keywords: 'ai prompt generator pricing, free ai prompt generator, ai prompt tool cost, ai prompt subscription, prompt generator plans',
  alternates: {
    canonical: 'https://www.aipromptgen.app/pricing',
  },
  openGraph: {
    title: 'AI Prompt Generator Pricing - Free + Pro Plans',
    description: 'Start free with 70 AI prompt generations/month. Upgrade for unlimited AI prompts.',
    type: 'website',
    url: 'https://www.aipromptgen.app/pricing',
  },
};

export default function PricingRoute() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
      <PricingPage />
    </div>
  );
}