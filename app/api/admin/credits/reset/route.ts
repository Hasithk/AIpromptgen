import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import prisma from '@/lib/prisma';

// POST - Reset monthly credits for all users or specific user
export async function POST(req: Request) {
  try {
    // Check if user is authenticated and is admin
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { userId, resetAll = false } = body;

    let result;

    if (resetAll) {
      // Reset credits for all users based on their plan
      const users = await prisma.user.findMany({
        select: { id: true, plan: true }
      });

      const updatePromises = users.map(user => {
        // Define monthly credits by plan
        const monthlyCredits = {
          free: 50,
          pro: 500,  // or unlimited (9999)
          elite: 9999
        };

        const creditsToReset = monthlyCredits[user.plan as keyof typeof monthlyCredits] || 50;

        return prisma.user.update({
          where: { id: user.id },
          data: {
            credits: creditsToReset,
            monthlyCreditsUsed: 0,
            lastCreditResetDate: new Date()
          }
        });
      });

      result = await Promise.all(updatePromises);

      return NextResponse.json({
        success: true,
        message: `Successfully reset credits for ${result.length} users`,
        data: {
          usersReset: result.length
        }
      });

    } else if (userId) {
      // Reset credits for specific user
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { plan: true }
      });

      if (!user) {
        return NextResponse.json(
          { success: false, error: 'User not found' },
          { status: 404 }
        );
      }

      const monthlyCredits = {
        free: 50,
        pro: 500,
        elite: 9999
      };

      const creditsToReset = monthlyCredits[user.plan as keyof typeof monthlyCredits] || 50;

      result = await prisma.user.update({
        where: { id: userId },
        data: {
          credits: creditsToReset,
          monthlyCreditsUsed: 0,
          lastCreditResetDate: new Date()
        }
      });

      return NextResponse.json({
        success: true,
        message: 'Successfully reset credits for user',
        data: {
          userId: result.id,
          newCredits: result.credits,
          resetDate: result.lastCreditResetDate
        }
      });

    } else {
      // Check which users need reset based on date
      const now = new Date();
      const firstOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

      const usersNeedingReset = await prisma.user.findMany({
        where: {
          lastCreditResetDate: {
            lt: firstOfMonth
          }
        },
        select: { id: true, plan: true, lastCreditResetDate: true }
      });

      const monthlyCredits = {
        free: 50,
        pro: 500,
        elite: 9999
      };

      const updatePromises = usersNeedingReset.map(user => {
        const creditsToReset = monthlyCredits[user.plan as keyof typeof monthlyCredits] || 50;

        return prisma.user.update({
          where: { id: user.id },
          data: {
            credits: creditsToReset,
            monthlyCreditsUsed: 0,
            lastCreditResetDate: new Date()
          }
        });
      });

      result = await Promise.all(updatePromises);

      return NextResponse.json({
        success: true,
        message: `Successfully reset credits for ${result.length} users who needed reset`,
        data: {
          usersReset: result.length
        }
      });
    }

  } catch (error) {
    console.error('Error resetting credits:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to reset credits',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// GET - Check which users need credit reset
export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const now = new Date();
    const firstOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const usersNeedingReset = await prisma.user.findMany({
      where: {
        lastCreditResetDate: {
          lt: firstOfMonth
        }
      },
      select: {
        id: true,
        email: true,
        name: true,
        credits: true,
        monthlyCreditsUsed: true,
        lastCreditResetDate: true,
        plan: true
      }
    });

    return NextResponse.json({
      success: true,
      data: {
        usersNeedingReset: usersNeedingReset.length,
        users: usersNeedingReset,
        currentDate: now.toISOString(),
        resetThreshold: firstOfMonth.toISOString()
      }
    });

  } catch (error) {
    console.error('Error checking reset status:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to check reset status',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
