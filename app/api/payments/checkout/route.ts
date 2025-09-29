import { NextRequest, NextResponse } from 'next/server';
import { createCheckoutSession, createStripeCustomer, STRIPE_PRICE_IDS } from '@/lib/stripe';
import { SUBSCRIPTION_PLANS } from '@/lib/subscription-plans';
import { getServerSession } from 'next-auth';

export async function POST(request: NextRequest) {
  try {
    const { planId, returnUrl } = await request.json();

    // Validate plan ID
    const plan = SUBSCRIPTION_PLANS.find(p => p.id === planId);
    if (!plan || plan.id === 'free') {
      return NextResponse.json({ error: 'Invalid plan selected' }, { status: 400 });
    }

    // Get user session (you'll need to implement this with NextAuth)
    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    // Create or get Stripe customer
    let customerId: string;
    try {
      // TODO: Check if user already has a Stripe customer ID in database
      const customer = await createStripeCustomer(
        session.user.email,
        session.user.name || undefined
      );
      customerId = customer.id;
    } catch (error) {
      console.error('Error creating Stripe customer:', error);
      return NextResponse.json({ error: 'Failed to create customer' }, { status: 500 });
    }

    // Get the correct price ID for the plan
    const priceId = STRIPE_PRICE_IDS[planId as keyof typeof STRIPE_PRICE_IDS];
    if (!priceId) {
      return NextResponse.json({ error: 'Plan not configured for payments' }, { status: 400 });
    }

    // Create checkout session
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
    const session_data = await createCheckoutSession({
      priceId,
      customerId,
      successUrl: `${baseUrl}/dashboard?upgrade=success&plan=${planId}`,
      cancelUrl: returnUrl || `${baseUrl}/pricing?upgrade=cancelled`,
      trialPeriodDays: plan.trialDays,
      metadata: {
        userId: session.user.id || session.user.email,
        planId,
      },
    });

    return NextResponse.json({ 
      checkoutUrl: session_data.url,
      sessionId: session_data.id 
    });

  } catch (error) {
    console.error('Checkout error:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const planId = searchParams.get('plan');

  if (!planId) {
    return NextResponse.json({ error: 'Plan ID required' }, { status: 400 });
  }

  try {
    // For GET requests, redirect to POST with the same data
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
    
    // Create a simple redirect to the pricing page with the plan pre-selected
    return NextResponse.redirect(`${baseUrl}/pricing?selected=${planId}`);
    
  } catch (error) {
    console.error('Checkout GET error:', error);
    return NextResponse.redirect(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/pricing`);
  }
}