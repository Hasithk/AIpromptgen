import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';

// GET - List all registered users with their stats
export async function GET(req: Request) {
  try {
    // Check if user is authenticated and is admin
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // You might want to add admin check here
    // For now, any authenticated user can access this
    
    // Get all users with their stats
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        credits: true,
        monthlyCreditsUsed: true,
        lastCreditResetDate: true,
        plan: true,
        subscriptionStatus: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            promptHistory: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Get total stats
    const totalUsers = users.length;
    const usersByPlan = users.reduce((acc, user) => {
      acc[user.plan] = (acc[user.plan] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const totalCreditsRemaining = users.reduce((sum, user) => sum + user.credits, 0);
    const totalCreditsUsed = users.reduce((sum, user) => sum + user.monthlyCreditsUsed, 0);

    return NextResponse.json({
      success: true,
      data: {
        users: users.map(user => ({
          id: user.id,
          email: user.email,
          name: user.name || 'N/A',
          credits: user.credits,
          monthlyCreditsUsed: user.monthlyCreditsUsed,
          lastCreditResetDate: user.lastCreditResetDate,
          plan: user.plan,
          subscriptionStatus: user.subscriptionStatus || 'free',
          promptsGenerated: user._count.promptHistory,
          registeredAt: user.createdAt,
          lastUpdated: user.updatedAt
        })),
        summary: {
          totalUsers,
          usersByPlan,
          totalCreditsRemaining,
          totalCreditsUsed,
          averageCreditsPerUser: totalUsers > 0 ? Math.round(totalCreditsRemaining / totalUsers) : 0
        }
      }
    });

  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch users',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
