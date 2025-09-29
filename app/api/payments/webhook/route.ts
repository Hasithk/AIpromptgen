import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { stripe } from '@/lib/stripe';
import { prisma } from '@/lib/prisma';
import Stripe from 'stripe';

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = headers().get('stripe-signature');

  if (!signature) {
    return NextResponse.json({ error: 'No signature' }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (error) {
    console.error('Webhook signature verification failed:', error);
    return NextResponse.json({ error: 'Webhook signature verification failed' }, { status: 400 });
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        await handleCheckoutSessionCompleted(session);
        break;
      }

      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionUpserted(subscription);
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionDeleted(subscription);
        break;
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice;
        await handleInvoicePaymentSucceeded(invoice);
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice;
        await handleInvoicePaymentFailed(invoice);
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook handler error:', error);
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 });
  }
}

async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
  if (!session.customer || !session.subscription) {
    console.log('No customer or subscription in session');
    return;
  }

  const userId = session.metadata?.userId;
  if (!userId) {
    console.error('No userId in session metadata');
    return;
  }

  // Update user with Stripe customer ID
  await prisma.user.update({
    where: { id: userId },
    data: {
      stripeCustomerId: session.customer as string,
      subscriptionId: session.subscription as string,
    },
  });

  console.log(`Checkout completed for user ${userId}`);
}

async function handleSubscriptionUpserted(subscription: Stripe.Subscription) {
  const user = await prisma.user.findFirst({
    where: { stripeCustomerId: subscription.customer as string },
  });

  if (!user) {
    console.error(`User not found for customer ${subscription.customer}`);
    return;
  }

  // Determine plan from subscription
  const planId = getPlanFromSubscription(subscription);

  // Update user subscription
  await prisma.user.update({
    where: { id: user.id },
    data: {
      subscriptionId: subscription.id,
      subscriptionStatus: subscription.status,
      plan: planId,
      subscriptionEndsAt: new Date(subscription.current_period_end * 1000),
      credits: planId === 'free' ? 70 : 999999, // Unlimited for paid plans
    },
  });

  // Upsert subscription record
  await prisma.subscription.upsert({
    where: { stripeSubscriptionId: subscription.id },
    create: {
      userId: user.id,
      planId,
      status: subscription.status,
      stripeSubscriptionId: subscription.id,
      currentPeriodStart: new Date(subscription.current_period_start * 1000),
      currentPeriodEnd: new Date(subscription.current_period_end * 1000),
      cancelAtPeriodEnd: subscription.cancel_at_period_end,
      trialStart: subscription.trial_start ? new Date(subscription.trial_start * 1000) : null,
      trialEnd: subscription.trial_end ? new Date(subscription.trial_end * 1000) : null,
    },
    update: {
      status: subscription.status,
      currentPeriodStart: new Date(subscription.current_period_start * 1000),
      currentPeriodEnd: new Date(subscription.current_period_end * 1000),
      cancelAtPeriodEnd: subscription.cancel_at_period_end,
      trialStart: subscription.trial_start ? new Date(subscription.trial_start * 1000) : null,
      trialEnd: subscription.trial_end ? new Date(subscription.trial_end * 1000) : null,
    },
  });

  console.log(`Subscription updated for user ${user.id} to plan ${planId}`);
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  const user = await prisma.user.findFirst({
    where: { stripeCustomerId: subscription.customer as string },
  });

  if (!user) {
    console.error(`User not found for customer ${subscription.customer}`);
    return;
  }

  // Downgrade to free plan
  await prisma.user.update({
    where: { id: user.id },
    data: {
      subscriptionId: null,
      subscriptionStatus: 'canceled',
      plan: 'free',
      credits: 70,
      subscriptionEndsAt: null,
    },
  });

  // Update subscription record
  await prisma.subscription.updateMany({
    where: { stripeSubscriptionId: subscription.id },
    data: {
      status: 'canceled',
    },
  });

  console.log(`Subscription canceled for user ${user.id}`);
}

async function handleInvoicePaymentSucceeded(invoice: Stripe.Invoice) {
  const user = await prisma.user.findFirst({
    where: { stripeCustomerId: invoice.customer as string },
  });

  if (!user) {
    console.error(`User not found for customer ${invoice.customer}`);
    return;
  }

  // Record successful payment
  await prisma.payment.create({
    data: {
      userId: user.id,
      amount: invoice.amount_paid,
      currency: invoice.currency,
      status: 'succeeded',
      paymentMethod: 'stripe',
      stripePaymentIntentId: invoice.payment_intent as string,
      metadata: {
        invoiceId: invoice.id,
        subscriptionId: invoice.subscription,
      },
    },
  });

  console.log(`Payment succeeded for user ${user.id}: $${invoice.amount_paid / 100}`);
}

async function handleInvoicePaymentFailed(invoice: Stripe.Invoice) {
  const user = await prisma.user.findFirst({
    where: { stripeCustomerId: invoice.customer as string },
  });

  if (!user) {
    console.error(`User not found for customer ${invoice.customer}`);
    return;
  }

  // Record failed payment
  await prisma.payment.create({
    data: {
      userId: user.id,
      amount: invoice.amount_due,
      currency: invoice.currency,
      status: 'failed',
      paymentMethod: 'stripe',
      metadata: {
        invoiceId: invoice.id,
        subscriptionId: invoice.subscription,
        error: 'Payment failed',
      },
    },
  });

  console.log(`Payment failed for user ${user.id}: $${invoice.amount_due / 100}`);
}

function getPlanFromSubscription(subscription: Stripe.Subscription): string {
  // Extract plan ID from subscription metadata or price ID
  if (subscription.metadata?.planId) {
    return subscription.metadata.planId;
  }

  // Fallback: determine from price ID
  const priceId = subscription.items.data[0]?.price.id;
  if (priceId === process.env.STRIPE_PRO_PRICE_ID) {
    return 'pro';
  } else if (priceId === process.env.STRIPE_ELITE_PRICE_ID) {
    return 'elite';
  }

  return 'free';
}