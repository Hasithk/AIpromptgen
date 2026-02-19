import dynamic from 'next/dynamic';
import { Metadata } from 'next';
import { PromptGenerator } from '@/components/prompt-generator';
import { HeroSection } from '@/components/hero-section';

export const metadata: Metadata = {
  title: 'AI Prompt Generator | #1 Free AI Prompt Tool for ChatGPT, Midjourney, DALL-E, Sora',
  description: 'The best free AI prompt generator of 2026. Create perfect AI prompts for ChatGPT, Midjourney, DALL-E, Sora, Claude, Gemini. 70 free AI prompt generations monthly. AI prompt templates, examples, and curated prompt library.',
  keywords: 'ai prompt, ai prompt generator, free ai prompt, best ai prompt generator, ai prompt generator free, ai prompts, ai prompt examples, chatgpt prompt generator, midjourney prompt generator, dall-e prompt, sora prompt, ai prompt engineering, ai prompt tool, ai prompt maker, ai prompt writer',
  alternates: {
    canonical: 'https://www.aipromptgen.app',
  },
  openGraph: {
    title: 'AI Prompt Generator - #1 Free AI Prompt Tool 2026',
    description: 'Create perfect AI prompts for ChatGPT, Midjourney, DALL-E, Sora. 70 free generations. Best AI prompt generator.',
    url: 'https://www.aipromptgen.app',
    type: 'website',
  },
};

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
      
      {/* SEO Content Section */}
      <section className="container-max section-padding py-12 bg-muted/10">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold gradient-text">
            The Best Free AI Prompt Generator
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Welcome to <strong>AI Prompt Generator</strong> — the #1 free AI prompt tool trusted by over 50,000 creators worldwide. 
            Generate professional <strong>AI prompts</strong> for <strong>ChatGPT</strong>, <strong>Midjourney</strong>, <strong>DALL-E</strong>, 
            <strong>Sora</strong>, <strong>Claude</strong>, <strong>Gemini</strong>, and every major AI platform. 
            Our AI prompt generator creates optimized prompts for text, image, video, and code generation — all with 70 free monthly credits.
          </p>
          <div className="grid md:grid-cols-3 gap-6 text-left">
            <div className="p-4 rounded-lg bg-background/50">
              <h3 className="font-semibold mb-2">AI Prompt for Images</h3>
              <p className="text-sm text-muted-foreground">Generate stunning AI image prompts for Midjourney, DALL-E, and Stable Diffusion with optimized parameters.</p>
            </div>
            <div className="p-4 rounded-lg bg-background/50">
              <h3 className="font-semibold mb-2">AI Prompt for Text</h3>
              <p className="text-sm text-muted-foreground">Create powerful ChatGPT and Claude prompts with role-based templates and context-aware optimization.</p>
            </div>
            <div className="p-4 rounded-lg bg-background/50">
              <h3 className="font-semibold mb-2">AI Prompt for Video</h3>
              <p className="text-sm text-muted-foreground">Craft cinematic Sora and video AI prompts with camera movements, timing, and style controls.</p>
            </div>
          </div>
        </div>
      </section>

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
      
      {/* Bottom SEO Content */}
      <section className="container-max section-padding py-12 bg-muted/5">
        <div className="max-w-4xl mx-auto space-y-8">
          <h2 className="text-2xl font-bold text-center">Why Choose Our AI Prompt Generator?</h2>
          <div className="grid md:grid-cols-2 gap-8 text-muted-foreground">
            <div>
              <h3 className="font-semibold text-foreground mb-2">What is an AI Prompt?</h3>
              <p className="text-sm leading-relaxed">An AI prompt is the text instruction you provide to an AI model to generate content. Whether you need an AI prompt for ChatGPT, an image prompt for Midjourney, or a video prompt for Sora, the quality of your AI prompt determines the quality of output. Our AI prompt generator optimizes every prompt automatically.</p>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-2">Free AI Prompt Generation</h3>
              <p className="text-sm leading-relaxed">Get 70 free AI prompt generations every month — no credit card required. Our AI prompt generator supports all major platforms including ChatGPT, Midjourney, DALL-E, Sora, Claude, Gemini, and Stable Diffusion. Create professional AI prompts in seconds.</p>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-2">AI Prompt Templates & Library</h3>
              <p className="text-sm leading-relaxed">Browse our curated AI prompt library with hundreds of proven templates. Find the perfect AI prompt for any use case — marketing, design, coding, writing, photography, and more. Every AI prompt template is tested and optimized for best results.</p>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-2">AI Prompt Engineering Made Easy</h3>
              <p className="text-sm leading-relaxed">Stop struggling with AI prompt writing. Our AI prompt generator handles the engineering for you — adding the right parameters, structure, and optimization for each platform. Turn simple ideas into professional AI prompts instantly.</p>
            </div>
          </div>
        </div>
      </section>
      
      <div className="container-max section-padding py-8">
        <div id="container-b5f74cb024e464af5087017b5cf56ec6"></div>
      </div>
    </div>
  );
}