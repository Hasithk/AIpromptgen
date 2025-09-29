import Stripe from 'stripe';

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is required');
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2024-06-20',
  typescript: true,
});

// Stripe Price IDs for each plan (you'll need to create these in Stripe Dashboard)
export const STRIPE_PRICE_IDS = {
  pro: process.env.STRIPE_PRO_PRICE_ID || 'price_pro_monthly',
  elite: process.env.STRIPE_ELITE_PRICE_ID || 'price_elite_monthly',
};

export const createStripeCustomer = async (email: string, name?: string) => {
  return await stripe.customers.create({
    email,
    name: name || undefined,
    metadata: {
      source: 'aipromptgen_app',
    },
  });
};

export const createCheckoutSession = async ({
  priceId,
  customerId,
  successUrl,
  cancelUrl,
  trialPeriodDays,
  metadata = {},
}: {
  priceId: string;
  customerId: string;
  successUrl: string;
  cancelUrl: string;
  trialPeriodDays?: number;
  metadata?: Record<string, string>;
}) => {
  const sessionParams: Stripe.Checkout.SessionCreateParams = {
    customer: customerId,
    payment_method_types: ['card'],
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    mode: 'subscription',
    success_url: successUrl,
    cancel_url: cancelUrl,
    metadata,
    allow_promotion_codes: true,
    billing_address_collection: 'auto',
    subscription_data: {
      metadata,
    },
  };

  if (trialPeriodDays && trialPeriodDays > 0) {
    sessionParams.subscription_data!.trial_period_days = trialPeriodDays;
  }

  return await stripe.checkout.sessions.create(sessionParams);
};

export const cancelSubscription = async (subscriptionId: string) => {
  return await stripe.subscriptions.update(subscriptionId, {
    cancel_at_period_end: true,
  });
};

export const reactivateSubscription = async (subscriptionId: string) => {
  return await stripe.subscriptions.update(subscriptionId, {
    cancel_at_period_end: false,
  });
};

export const getSubscription = async (subscriptionId: string) => {
  return await stripe.subscriptions.retrieve(subscriptionId);
};

export const createPortalSession = async (customerId: string, returnUrl: string) => {
  return await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: returnUrl,
  });
};