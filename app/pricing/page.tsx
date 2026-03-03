import { Metadata } from 'next';
import { PricingPage } from '@/components/pricing-page';

export const metadata: Metadata = {
  title: 'Free AI Prompt Plans & Pricing',
  description: 'AI Prompt Generator pricing. Start free with 70 AI prompt generations monthly. Upgrade to Pro for unlimited AI prompts and features.',
  keywords: 'ai prompt generator pricing, free ai prompt generator, ai prompt tool cost, ai prompt subscription, prompt generator plans',
  alternates: {
    canonical: 'https://www.aipromptgen.app/pricing',
  },
  openGraph: {
    title: 'AI Prompt Generator - Free & Pro Plans',
    description: 'Start free with 70 AI prompt generations monthly. Upgrade to Pro for unlimited AI prompts and premium features.',
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