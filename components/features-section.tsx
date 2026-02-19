import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Zap, 
  Target, 
  History, 
  Palette, 
  Brain, 
  Shield,
  Sparkles,
  Users
} from 'lucide-react';

const features = [
  {
    icon: Target,
    title: 'AI Prompt Optimization',
    description: 'Generate optimized AI prompts for ChatGPT, Midjourney, DALL-E, Sora, Claude, and Gemini with platform-specific parameters and best practices.'
  },
  {
    icon: Brain,
    title: 'Smart AI Prompt Suggestions',
    description: 'Intelligent AI prompt recommendations based on your input, style preferences, and current AI model capabilities for better results.'
  },
  {
    icon: Palette,
    title: 'AI Prompt Style Control',
    description: 'Fine-tune every aspect of your AI prompts with comprehensive style, mood, lighting, and parameter controls for image, video, and text.'
  },
  {
    icon: History,
    title: 'AI Prompt History & Manager',
    description: 'Save, organize, and revisit all your generated AI prompts. Manage your AI prompt library with powerful search and categorization.'
  },
  {
    icon: Sparkles,
    title: 'Real-time AI Prompt Enhancement',
    description: 'Dynamic AI prompt optimization that adapts to the latest AI model capabilities. Get the best AI prompts automatically.'
  },
  {
    icon: Users,
    title: 'AI Prompt Collaboration',
    description: 'Share AI prompts with team members, collaborate on prompt engineering projects, and maintain consistent AI prompt guidelines.'
  },
  {
    icon: Shield,
    title: 'AI Prompt Quality Assurance',
    description: 'Built-in AI prompt filters ensure your prompts meet quality standards and follow best practices for each AI platform.'
  },
  {
    icon: Zap,
    title: 'Instant AI Prompt Generation',
    description: 'Generate professional AI prompts in seconds with our optimized pipeline. The fastest free AI prompt generator available.'
  }
];

export function FeaturesSection() {
  return (
    <section className="py-20 bg-muted/30">
      <div className="container-max section-padding">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl md:text-4xl font-bold gradient-text">
            AI Prompt Generator Features — Everything You Need
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Our free AI prompt generator has every tool you need to create, manage, and optimize AI prompts for professional results across all platforms.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card 
              key={feature.title}
              className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-0 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardHeader className="pb-4">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-lg group-hover:text-primary transition-colors">
                  {feature.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm leading-relaxed">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}