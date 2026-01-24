import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Fetch user credits from database
    let user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { credits: true, plan: true, createdAt: true }
    });

    // Auto-create user if they don't exist (for users who signed in before migration)
    if (!user) {
      user = await prisma.user.create({
        data: {
          email: session.user.email,
          name: session.user.name || '',
          credits: 50,
          monthlyCreditsUsed: 0,
          lastCreditResetDate: new Date(),
          plan: 'free'
        },
        select: { credits: true, plan: true, createdAt: true }
      });
      console.log(`✓ Auto-created user during credits check: ${session.user.email}`);
    }

    // Calculate reset date (30 days from account creation for free tier)
    const resetDate = new Date(user.createdAt);
    resetDate.setDate(resetDate.getDate() + 30);

    return NextResponse.json({
      success: true,
      data: {
        credits: user.credits,
        plan: user.plan,
        resetDate: resetDate.toISOString(),
      }
    });
  } catch (error) {
    console.error('Credits fetch error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { amount } = await request.json();
    if (typeof amount !== 'number' || amount < 0) {
      return NextResponse.json(
        { success: false, error: 'Invalid amount' },
        { status: 400 }
      );
    }

    // Get current credits
    let user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { credits: true }
    });

    // Auto-create user if they don't exist
    if (!user) {
      user = await prisma.user.create({
        data: {
          email: session.user.email,
          name: session.user.name || '',
          credits: 50,
          monthlyCreditsUsed: 0,
          lastCreditResetDate: new Date(),
          plan: 'free'
        },
        select: { credits: true }
      });
      console.log(`✓ Auto-created user during credits POST: ${session.user.email}`);
    }

    // Check if user has enough credits
    if (user.credits - amount < 0) {
      return NextResponse.json(
        { success: false, error: 'Insufficient credits' },
        { status: 400 }
      );
    }

    // Update credits in database
    const updatedUser = await prisma.user.update({
      where: { email: session.user.email },
      data: { credits: { decrement: amount } },
      select: { credits: true }
    });

    return NextResponse.json({
      success: true,
      data: { credits: updatedUser.credits }
    });
  } catch (error) {
    console.error('Credits update error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}