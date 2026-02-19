'use client';

import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles, Zap, Target, Code2, Image as ImageIcon } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { trackEvent } from '@/components/analytics';

export function HeroSection() {
  const canvasRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Add floating animation with CSS transforms
    const floatingElements = document.querySelectorAll('.floating-screen');
    floatingElements.forEach((el, index) => {
      const element = el as HTMLElement;
      element.style.animationDelay = `${index * 0.5}s`;
    });
  }, []);

  return (
    <section className="relative overflow-hidden min-h-[90vh] bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Liquid Glass Background Effect */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-purple-600/10 to-pink-600/10 backdrop-blur-3xl" />
        <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-500/30 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob" />
        <div className="absolute top-0 -right-4 w-72 h-72 bg-blue-500/30 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000" />
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-500/30 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000" />
      </div>

      {/* Glass Morphism Overlay */}
      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" />

      <div className="relative container-max section-padding py-20 md:py-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="text-white space-y-8 animate-fade-in z-10">
            <div className="space-y-6">
              <div className="inline-flex items-center space-x-2 glass-morphism rounded-full px-6 py-3 text-sm font-medium border border-white/20 shadow-lg">
                <Sparkles className="h-4 w-4 text-blue-400" />
                <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  #1 Free AI Prompt Generator 2026
                </span>
              </div>
              
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-tight">
                AI Prompt
                <br />
                <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Generator Free
                </span>
              </h1>
              
              <p className="text-lg md:text-xl text-slate-300 leading-relaxed">
                The <strong>best AI prompt generator</strong> for 2026. Create perfect <strong>AI prompts</strong> for 
                <strong> ChatGPT, Midjourney, DALL-E, Sora, Claude, and Gemini</strong>. 
                Our free AI prompt tool generates optimized prompts for image, video, text, and code — with 70 free monthly credits. 
                <strong>No credit card required</strong> — start creating stunning AI content now!
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg" 
                className="glass-morphism border border-white/20 text-white hover:bg-white/20 font-semibold px-8 py-6 text-lg group shadow-2xl"
                onClick={() => {
                  trackEvent.ctaClick('Generate Free AI Prompts', 'Hero Section');
                  window.location.href = '/#generator';
                }}
              >
                Generate Free AI Prompts
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="glass-morphism border-white/30 text-white hover:bg-white/10 px-8 py-6 text-lg"
                onClick={() => {
                  trackEvent.ctaClick('View Free Prompt Examples', 'Hero Section');
                  window.location.href = '/library';
                }}
              >
                View Examples
              </Button>
            </div>

            <div className="grid grid-cols-3 gap-6 pt-8">
              {[
                {
                  icon: Target,
                  title: 'Platform-Specific',
                  description: 'Tailored for each AI'
                },
                {
                  icon: Zap,
                  title: 'Instant Results',
                  description: 'Generate in seconds'
                },
                {
                  icon: Sparkles,
                  title: 'Expert Quality',
                  description: 'Professional output'
                }
              ].map((feature, index) => (
                <div 
                  key={feature.title} 
                  className="text-center space-y-2 animate-fade-in"
                  style={{ animationDelay: `${index * 200}ms` }}
                >
                  <div className="w-12 h-12 glass-morphism border border-white/20 rounded-xl mx-auto flex items-center justify-center shadow-lg">
                    <feature.icon className="h-5 w-5 text-blue-400" />
                  </div>
                  <h3 className="font-semibold text-sm">{feature.title}</h3>
                  <p className="text-xs text-slate-400">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right Content - 3D Floating Screens */}
          <div className="relative h-[600px] hidden lg:block" ref={canvasRef}>
            {/* Phone Screen - Code Editor */}
            <div className="floating-screen absolute top-20 left-10 w-64 h-96 transform -rotate-12 hover:rotate-0 transition-all duration-500">
              <div className="glass-card border border-white/20 rounded-3xl overflow-hidden shadow-2xl h-full">
                <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-4 h-full flex flex-col">
                  {/* Phone Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <Code2 className="h-4 w-4 text-blue-400" />
                      <span className="text-xs text-slate-300 font-mono">prompt.ai</span>
                    </div>
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 rounded-full bg-red-400" />
                      <div className="w-2 h-2 rounded-full bg-yellow-400" />
                      <div className="w-2 h-2 rounded-full bg-green-400" />
                    </div>
                  </div>
                  
                  {/* Code Editor Content */}
                  <div className="flex-1 space-y-2 font-mono text-xs">
                    <div className="text-purple-400">// AI Prompt</div>
                    <div className="text-blue-300">
                      <span className="text-pink-400">const</span> prompt = {'{'}
                    </div>
                    <div className="pl-4 text-slate-300">
                      <span className="text-green-400">"style"</span>: <span className="text-yellow-300">"cinematic"</span>,
                    </div>
                    <div className="pl-4 text-slate-300">
                      <span className="text-green-400">"subject"</span>: <span className="text-yellow-300">"futuristic city"</span>,
                    </div>
                    <div className="pl-4 text-slate-300">
                      <span className="text-green-400">"mood"</span>: <span className="text-yellow-300">"dramatic"</span>
                    </div>
                    <div className="text-blue-300">{'}'}</div>
                    <div className="mt-4 pt-4 border-t border-slate-700">
                      <div className="flex items-center space-x-2 text-green-400">
                        <Zap className="h-3 w-3 animate-pulse" />
                        <span>Generating...</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Tablet Screen - AI Generated Image */}
            <div className="floating-screen absolute top-10 right-0 w-80 h-64 transform rotate-6 hover:rotate-0 transition-all duration-500 animation-delay-2000">
              <div className="glass-card border border-white/20 rounded-2xl overflow-hidden shadow-2xl h-full">
                <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-4 h-full flex flex-col">
                  {/* Tablet Header */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <ImageIcon className="h-4 w-4 text-pink-400" />
                      <span className="text-xs text-slate-300 font-semibold">AI Output</span>
                    </div>
                    <div className="glass-morphism px-3 py-1 rounded-full text-xs text-green-400 border border-green-400/30">
                      Generated
                    </div>
                  </div>
                  
                  {/* Generated Image Preview */}
                  <div className="flex-1 rounded-xl bg-gradient-to-br from-purple-500/20 via-blue-500/20 to-pink-500/20 border border-white/10 flex items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-600/30 via-purple-600/30 to-pink-600/30 animate-pulse" />
                    <div className="relative z-10 text-center space-y-2">
                      <Sparkles className="h-12 w-12 text-white/80 mx-auto animate-spin-slow" />
                      <p className="text-xs text-white/60 font-medium">Futuristic City</p>
                    </div>
                  </div>
                  
                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-2 mt-3">
                    <div className="glass-morphism rounded-lg p-2 text-center border border-white/10">
                      <div className="text-xs text-blue-400 font-bold">4K</div>
                      <div className="text-[10px] text-slate-400">Quality</div>
                    </div>
                    <div className="glass-morphism rounded-lg p-2 text-center border border-white/10">
                      <div className="text-xs text-purple-400 font-bold">2.3s</div>
                      <div className="text-[10px] text-slate-400">Speed</div>
                    </div>
                    <div className="glass-morphism rounded-lg p-2 text-center border border-white/10">
                      <div className="text-xs text-pink-400 font-bold">98%</div>
                      <div className="text-[10px] text-slate-400">Match</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Elements */}
            <div className="floating-screen absolute bottom-20 left-20 w-20 h-20 glass-morphism rounded-2xl border border-white/20 flex items-center justify-center shadow-xl animation-delay-1000">
              <Zap className="h-10 w-10 text-yellow-400 animate-pulse" />
            </div>

            <div className="floating-screen absolute top-40 right-20 w-16 h-16 glass-morphism rounded-full border border-white/20 flex items-center justify-center shadow-xl animation-delay-3000">
              <Sparkles className="h-8 w-8 text-blue-400" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}