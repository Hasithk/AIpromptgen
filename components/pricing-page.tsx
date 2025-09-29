'use client';

import { useState } from 'react';
import { Check, Star, Zap, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { SUBSCRIPTION_PLANS } from '@/lib/subscription-plans';

interface PricingPageProps {
  currentPlan?: string;
  onUpgrade?: (planId: string) => void;
}

export function PricingPage({ currentPlan = 'free', onUpgrade }: PricingPageProps) {
  const [isLoading, setIsLoading] = useState<string | null>(null);

  const handleUpgrade = async (planId: string) => {
    setIsLoading(planId);
    try {
      if (onUpgrade) {
        await onUpgrade(planId);
      } else {
        // Default upgrade action - redirect to checkout
        window.location.href = `/api/payments/checkout?plan=${planId}`;
      }
    } catch (error) {
      console.error('Upgrade error:', error);
    } finally {
      setIsLoading(null);
    }
  };

  const getPlanIcon = (planId: string) => {
    switch (planId) {
      case 'free':
        return <Star className="w-6 h-6 text-blue-500" />;
      case 'pro':
        return <Zap className="w-6 h-6 text-purple-500" />;
      case 'elite':
        return <Users className="w-6 h-6 text-gold-500" />;
      default:
        return <Star className="w-6 h-6" />;
    }
  };

  return (
    <div className="container mx-auto px-4 py-16">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
          Choose Your Plan
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
          Unlock the full potential of AI prompt generation with our flexible pricing plans. 
          Start with our free tier or upgrade for unlimited access and premium features.
        </p>
      </div>

      {/* Pricing Cards */}
      <div className="grid lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {SUBSCRIPTION_PLANS.map((plan) => (
          <Card 
            key={plan.id} 
            className={`relative ${
              plan.popular 
                ? 'border-2 border-purple-500 shadow-lg scale-105 bg-gradient-to-b from-purple-50 to-white dark:from-purple-900/20 dark:to-gray-900' 
                : 'border border-gray-200 dark:border-gray-700'
            } ${currentPlan === plan.id ? 'ring-2 ring-green-500 ring-offset-2' : ''}`}
          >
            {plan.popular && (
              <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                Most Popular
              </Badge>
            )}
            
            {currentPlan === plan.id && (
              <Badge className="absolute -top-3 right-4 bg-green-500 text-white">
                Current Plan
              </Badge>
            )}

            <CardHeader className="text-center pb-2">
              <div className="flex justify-center mb-4">
                {getPlanIcon(plan.id)}
              </div>
              <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-300">
                {plan.description}
              </CardDescription>
            </CardHeader>

            <CardContent className="text-center">
              {/* Pricing */}
              <div className="mb-6">
                <div className="flex items-baseline justify-center">
                  <span className="text-5xl font-bold">${plan.price}</span>
                  <span className="text-gray-500 ml-2">/{plan.interval}</span>
                </div>
                {plan.trialDays && (
                  <p className="text-sm text-purple-600 mt-2">
                    {plan.trialDays}-day free trial • Cancel anytime
                  </p>
                )}
              </div>

              {/* Features */}
              <div className="space-y-3 text-left">
                {plan.features.map((feature, index) => (
                  <div key={index} className="flex items-start">
                    <Check className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">{feature}</span>
                  </div>
                ))}
              </div>
            </CardContent>

            <CardFooter>
              <Button
                className={`w-full ${
                  plan.popular 
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700' 
                    : ''
                }`}
                variant={plan.buttonVariant}
                onClick={() => handleUpgrade(plan.id)}
                disabled={currentPlan === plan.id || isLoading === plan.id}
              >
                {isLoading === plan.id ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Processing...
                  </>
                ) : currentPlan === plan.id ? (
                  'Current Plan'
                ) : (
                  plan.buttonText
                )}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* FAQ Section */}
      <div className="mt-20 max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-8">Frequently Asked Questions</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-lg mb-2">What happens after my free trial?</h3>
              <p className="text-gray-600 dark:text-gray-300">
                After your 7-day free trial, you'll be automatically subscribed to the Pro plan at $5/month. 
                You can cancel anytime during the trial with no charges.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2">Can I change plans anytime?</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately, 
                and we'll prorate the billing.
              </p>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-lg mb-2">What payment methods do you accept?</h3>
              <p className="text-gray-600 dark:text-gray-300">
                We accept all major credit cards, PayPal, and local payment methods through our secure 
                payment processor.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2">Is there a long-term commitment?</h3>
              <p className="text-gray-600 dark:text-gray-300">
                No! All our plans are month-to-month with no long-term contracts. 
                Cancel anytime from your account settings.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="mt-16 text-center bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl p-8">
        <h2 className="text-3xl font-bold mb-4">Ready to supercharge your creativity?</h2>
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
          Join thousands of creators who trust AI Prompt Generator for their projects.
        </p>
        <Button 
          size="lg" 
          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
          onClick={() => handleUpgrade('pro')}
        >
          Start Your Free Trial
        </Button>
      </div>
    </div>
  );
}