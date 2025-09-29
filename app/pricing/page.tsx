import { Metadata } from 'next';
import { PricingPage } from '@/components/pricing-page';

export const metadata: Metadata = {
  title: 'Pricing Plans - AI Prompt Generator',
  description: 'Choose the perfect plan for your AI prompt generation needs. Free tier available with Pro and Elite plans for advanced features.',
  keywords: 'ai prompt generator pricing, subscription plans, pro plan, elite plan, ai tools pricing',
  openGraph: {
    title: 'AI Prompt Generator - Pricing Plans',
    description: 'Flexible pricing for creators, professionals, and teams. Start free or upgrade for unlimited generations.',
    type: 'website',
  },
};

export default function PricingRoute() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
      <PricingPage />
    </div>
  );
}