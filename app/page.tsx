import { PromptGenerator } from '@/components/prompt-generator';
import { HeroSection } from '@/components/hero-section';
import { AINewsWidget } from '@/components/ai-news-widget';
import { FeaturesSection } from '@/components/features-section';
import { PricingSection } from '@/components/pricing-section';

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
      <PricingSection />
      <div className="container-max section-padding py-8">
        <div id="container-b5f74cb024e464af5087017b5cf56ec6"></div>
      </div>
    </div>
  );
}