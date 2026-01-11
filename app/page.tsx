import dynamic from 'next/dynamic';
import { PromptGenerator } from '@/components/prompt-generator';
import { HeroSection } from '@/components/hero-section';

// Lazy load heavy components
const AINewsWidget = dynamic(() => import('@/components/ai-news-widget').then(mod => ({ default: mod.AINewsWidget })), {
  loading: () => <div className="animate-pulse bg-muted rounded-lg h-96" />,
  ssr: false
});

const FeaturesSection = dynamic(() => import('@/components/features-section').then(mod => ({ default: mod.FeaturesSection })), {
  loading: () => <div className="animate-pulse bg-muted rounded-lg h-48" />
});

const PricingSection = dynamic(() => import('@/components/pricing-section').then(mod => ({ default: mod.PricingSection })), {
  loading: () => <div className="animate-pulse bg-muted rounded-lg h-96" />
});

const FAQSection = dynamic(() => import('@/components/faq-section').then(mod => ({ default: mod.FAQSection })), {
  loading: () => <div className="animate-pulse bg-muted rounded-lg h-64" />
});

export default function Home() {
  return (
    <div className="space-y-0">
      <HeroSection />
      <div id="generator" className="container-max section-padding py-16">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <PromptGenerator />
          </div>
          <div className="space-y-8">
            <AINewsWidget />
          </div>
        </div>
      </div>
      <FeaturesSection />
      <FAQSection />
      <PricingSection />
      <div className="container-max section-padding py-8">
        <div id="container-b5f74cb024e464af5087017b5cf56ec6"></div>
      </div>
    </div>
  );
}