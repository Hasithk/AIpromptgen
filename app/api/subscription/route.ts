import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { createPortalSession } from '@/lib/stripe';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    // Get user subscription info
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        subscriptions: {
          where: { status: { in: ['active', 'trialing', 'past_due'] } },
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const currentSubscription = user.subscriptions[0];

    return NextResponse.json({
      plan: user.plan,
      credits: user.credits,
      subscriptionStatus: user.subscriptionStatus,
      subscriptionEndsAt: user.subscriptionEndsAt,
      trialEndsAt: user.trialEndsAt,
      hasActiveSubscription: !!currentSubscription,
      subscription: currentSubscription ? {
        id: currentSubscription.id,
        planId: currentSubscription.planId,
        status: currentSubscription.status,
        currentPeriodEnd: currentSubscription.currentPeriodEnd,
        cancelAtPeriodEnd: currentSubscription.cancelAtPeriodEnd,
        trialEnd: currentSubscription.trialEnd,
      } : null,
    });

  } catch (error) {
    console.error('Subscription info error:', error);
    return NextResponse.json(
      { error: 'Failed to get subscription info' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { action } = await request.json();
    const session = await getServerSession();
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user || !user.stripeCustomerId) {
      return NextResponse.json({ error: 'No subscription found' }, { status: 404 });
    }

    switch (action) {
      case 'manage': {
        // Create Stripe Customer Portal session
        const portalSession = await createPortalSession(
          user.stripeCustomerId,
          `${process.env.NEXTAUTH_URL}/dashboard`
        );
        
        return NextResponse.json({ url: portalSession.url });
      }

      case 'cancel': {
        // This will be handled through Stripe Customer Portal
        return NextResponse.json({ 
          message: 'Please use the customer portal to manage your subscription' 
        });
      }

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

  } catch (error) {
    console.error('Subscription management error:', error);
    return NextResponse.json(
      { error: 'Failed to manage subscription' },
      { status: 500 }
    );
  }
}