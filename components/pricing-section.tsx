import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, Zap, Crown, Rocket } from 'lucide-react';

const plans = [
  {
    name: 'Free',
    description: 'Perfect for getting started',
    price: '$0',
    period: 'forever',
    icon: Zap,
    features: [
      '70 credits per month',
      'Basic prompt generation',
      'Access to all platforms',
      'Community support',
      'Basic templates'
    ],
    limitations: [
      'Limited advanced features',
      'No API access',
      'Basic export options'
    ],
    cta: 'Get Started',
    popular: false
  },
  {
    name: 'Pro',
    description: 'For serious creators and professionals',
    price: '$5',
    period: 'month',
    icon: Crown,
    features: [
      'Unlimited generations',
      'Premium categories & styles',
      'Advanced filtering & controls',
      'No watermarks',
      'Unlimited saved prompts',
      'Priority support',
      'Export in all formats',
      'Prompt optimization',
      'Team collaboration (up to 3 members)'
    ],
    cta: 'Start Pro Trial',
    popular: true
  },
  {
    name: 'Elite',
    description: 'For teams and power users',
    price: '$10',
    period: 'month',
    icon: Rocket,
    features: [
      'Everything in Pro',
      'API access (10,000 calls/month)',
      'Advanced team collaboration',
      'Custom style training',
      'Priority generation queue',
      'Dedicated account manager',
      'Custom integrations',
      'Advanced analytics',
      'White-label options',
      'SLA guarantee'
    ],
    cta: 'Contact Sales',
    popular: false
  }
];

export function PricingSection() {
  return (
    <section className="py-20">
      <div className="container-max section-padding">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl md:text-4xl font-bold gradient-text">
            Choose Your Plan
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Start free and upgrade as you grow. All plans include access to our core features.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <Card 
              key={plan.name}
              className={`relative overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 animate-fade-in ${
                plan.popular 
                  ? 'border-primary shadow-lg scale-105' 
                  : 'border-border hover:border-primary/50'
              }`}
              style={{ animationDelay: `${index * 200}ms` }}
            >
              {plan.popular && (
                <div className="absolute top-0 left-0 right-0">
                  <div className="bg-hero-gradient text-white text-center py-2 text-sm font-medium">
                    Most Popular
                  </div>
                </div>
              )}
              
              <CardHeader className={`text-center ${plan.popular ? 'pt-12' : 'pt-6'}`}>
                <div className="w-12 h-12 bg-primary/10 rounded-xl mx-auto flex items-center justify-center mb-4">
                  <plan.icon className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                <CardDescription className="text-base">
                  {plan.description}
                </CardDescription>
                <div className="pt-4">
                  <div className="flex items-baseline justify-center">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    {plan.period && (
                      <span className="text-muted-foreground ml-2">/{plan.period}</span>
                    )}
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-6">
                <ul className="space-y-3">
                  {plan.features.map((feature, featureIndex) => (
                    <li 
                      key={featureIndex} 
                      className="flex items-center text-sm animate-slide-in"
                      style={{ animationDelay: `${(index * 200) + (featureIndex * 50)}ms` }}
                    >
                      <Check className="h-4 w-4 text-primary mr-3 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                  {plan.limitations?.map((limitation, limitIndex) => (
                    <li 
                      key={`limitation-${limitIndex}`} 
                      className="flex items-center text-sm text-muted-foreground"
                    >
                      <div className="w-4 h-4 mr-3 flex-shrink-0" />
                      <span className="line-through">{limitation}</span>
                    </li>
                  ))}
                </ul>
                
                <Button 
                  className={`w-full ${
                    plan.popular 
                      ? 'btn-primary' 
                      : plan.name === 'Elite' 
                        ? 'btn-secondary'
                        : 'btn-outline'
                  }`}
                  size="lg"
                >
                  {plan.cta}
                </Button>
                
                {plan.popular && (
                  <p className="text-xs text-center text-muted-foreground">
                    7-day free trial • Cancel anytime
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-16 text-center">
          <div className="bg-muted/50 rounded-2xl p-8 max-w-4xl mx-auto">
            <h3 className="text-xl font-semibold mb-4">Need a Custom Plan?</h3>
            <p className="text-muted-foreground mb-6">
              For enterprise customers with specific requirements, we offer custom pricing and features.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="outline" size="lg">
                Contact Sales
              </Button>
              <Button variant="outline" size="lg">
                View Enterprise Features
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}