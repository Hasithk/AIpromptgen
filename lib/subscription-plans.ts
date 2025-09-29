export interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  interval: 'month' | 'year';
  features: string[];
  popular?: boolean;
  buttonText: string;
  buttonVariant: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  trialDays?: number;
  limits: {
    generations: number | 'unlimited';
    savedPrompts: number | 'unlimited';
    apiCalls?: number;
    teamMembers?: number;
  };
}

export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: 'free',
    name: 'Free',
    description: 'Perfect for getting started',
    price: 0,
    currency: 'USD',
    interval: 'month',
    features: [
      '70 generations per month',
      'Basic categories & styles',
      'Standard support',
      'Basic export formats'
    ],
    buttonText: 'Current Plan',
    buttonVariant: 'outline',
    limits: {
      generations: 70,
      savedPrompts: 10
    }
  },
  {
    id: 'pro',
    name: 'Pro',
    description: 'For serious creators and professionals',
    price: 5,
    currency: 'USD',
    interval: 'month',
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
    popular: true,
    buttonText: 'Start Pro Trial',
    buttonVariant: 'default',
    trialDays: 7,
    limits: {
      generations: 'unlimited',
      savedPrompts: 'unlimited',
      teamMembers: 3
    }
  },
  {
    id: 'elite',
    name: 'Elite',
    description: 'For teams and power users',
    price: 10,
    currency: 'USD',
    interval: 'month',
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
    buttonText: 'Contact Sales',
    buttonVariant: 'destructive',
    limits: {
      generations: 'unlimited',
      savedPrompts: 'unlimited',
      apiCalls: 10000,
      teamMembers: 'unlimited'
    }
  }
];

export const getCurrentPlan = (planId: string): SubscriptionPlan | undefined => {
  return SUBSCRIPTION_PLANS.find(plan => plan.id === planId);
};

export const getUpgradePlans = (currentPlanId: string): SubscriptionPlan[] => {
  const currentPlanIndex = SUBSCRIPTION_PLANS.findIndex(plan => plan.id === currentPlanId);
  return SUBSCRIPTION_PLANS.slice(currentPlanIndex + 1);
};