'use client';

import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles, Zap, Target } from 'lucide-react';

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-hero-gradient">
      <div className="absolute inset-0 bg-black/10" />
      <div className="relative container-max section-padding py-20 md:py-32">
        <div className="text-center text-white space-y-8 animate-fade-in">
          <div className="space-y-4">
            <div className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 text-sm font-medium">
              <Sparkles className="h-4 w-4" />
              <span>AI Prompt Engineering Made Simple</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight">
              Generate Perfect
              <br />
              <span className="text-secondary">AI Prompts</span>
            </h1>
            
            <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto leading-relaxed">
              Create professional prompts for Sora, Veo 3, Midjourney, and more. 
              Our advanced platform guides you through the entire process with 
              intelligent suggestions and real-time optimization.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              size="lg" 
              className="bg-white text-primary hover:bg-white/90 font-semibold px-8 py-4 text-lg group"
            >
              Start Creating
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="border-white text-white hover:bg-white hover:text-primary px-8 py-4 text-lg"
            >
              View Examples
            </Button>
          </div>

          <div className="grid md:grid-cols-3 gap-8 pt-12 max-w-4xl mx-auto">
            {[
              {
                icon: Target,
                title: 'Platform-Specific',
                description: 'Tailored prompts for each AI platform\'s unique requirements'
              },
              {
                icon: Zap,
                title: 'Instant Generation',
                description: 'Get professional results in seconds with our advanced AI'
              },
              {
                icon: Sparkles,
                title: 'Expert Quality',
                description: 'Built by prompt engineers, trusted by professionals'
              }
            ].map((feature, index) => (
              <div 
                key={feature.title} 
                className="text-center space-y-3 animate-fade-in"
                style={{ animationDelay: `${index * 200}ms` }}
              >
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl mx-auto flex items-center justify-center">
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="font-semibold text-lg">{feature.title}</h3>
                <p className="text-sm text-white/80">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}