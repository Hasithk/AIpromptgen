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
    title: 'Platform-Specific Optimization',
    description: 'Tailored prompts for Sora, Veo 3, Midjourney, DALL-E, and Qwen.ai with platform-specific parameters and best practices.'
  },
  {
    icon: Brain,
    title: 'AI-Powered Suggestions',
    description: 'Intelligent recommendations based on your input, style preferences, and current AI trends.'
  },
  {
    icon: Palette,
    title: 'Advanced Style Control',
    description: 'Fine-tune every aspect of your prompts with our comprehensive style and parameter controls.'
  },
  {
    icon: History,
    title: 'Prompt History & Management',
    description: 'Save, organize, and revisit all your generated prompts with our powerful management tools.'
  },
  {
    icon: Sparkles,
    title: 'Real-time Optimization',
    description: 'Dynamic prompt enhancement that adapts to the latest AI model capabilities and best practices.'
  },
  {
    icon: Users,
    title: 'Team Collaboration',
    description: 'Share prompts, collaborate with team members, and maintain consistent brand guidelines.'
  },
  {
    icon: Shield,
    title: 'Quality Assurance',
    description: 'Built-in filters to ensure your prompts meet quality standards and avoid common pitfalls.'
  },
  {
    icon: Zap,
    title: 'Lightning Fast Generation',
    description: 'Generate professional-quality prompts in seconds with our optimized AI pipeline.'
  }
];

export function FeaturesSection() {
  return (
    <section className="py-20 bg-muted/30">
      <div className="container-max section-padding">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl md:text-4xl font-bold gradient-text">
            Powerful Features for Every Creator
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Everything you need to create, manage, and optimize AI prompts for professional results.
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