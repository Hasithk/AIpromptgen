import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// This endpoint should be called by a cron job on the 1st of every month
// You can use Vercel Cron, GitHub Actions, or any external cron service
export async function GET(req: Request) {
  try {
    // Verify the request is coming from a cron job
    // In production, add authentication like a secret token
    const authHeader = req.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET || 'your-secret-key';
    
    if (authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const now = new Date();
    const firstOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    console.log(`[CRON] Monthly credit reset started at ${now.toISOString()}`);

    // Find all users who haven't been reset this month
    const usersNeedingReset = await prisma.user.findMany({
      where: {
        lastCreditResetDate: {
          lt: firstOfMonth
        }
      },
      select: { id: true, plan: true, email: true, lastCreditResetDate: true }
    });

    console.log(`[CRON] Found ${usersNeedingReset.length} users needing credit reset`);

    if (usersNeedingReset.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'No users need credit reset',
        data: {
          usersReset: 0,
          executedAt: now.toISOString()
        }
      });
    }

    // Define monthly credits by plan
    const monthlyCredits = {
      free: 50,
      pro: 500,
      elite: 9999
    };

    // Reset credits for each user based on their plan
    const updatePromises = usersNeedingReset.map(async (user) => {
      const creditsToReset = monthlyCredits[user.plan as keyof typeof monthlyCredits] || 50;

      try {
        const updated = await prisma.user.update({
          where: { id: user.id },
          data: {
            credits: creditsToReset,
            monthlyCreditsUsed: 0,
            lastCreditResetDate: now
          }
        });

        console.log(`[CRON] Reset credits for user ${user.email}: ${creditsToReset} credits`);
        return { success: true, userId: user.id, email: user.email };
      } catch (error) {
        console.error(`[CRON] Failed to reset credits for user ${user.email}:`, error);
        return { success: false, userId: user.id, email: user.email, error };
      }
    });

    const results = await Promise.allSettled(updatePromises);
    
    const successful = results.filter(r => r.status === 'fulfilled' && r.value.success).length;
    const failed = results.length - successful;

    console.log(`[CRON] Credit reset completed: ${successful} successful, ${failed} failed`);

    return NextResponse.json({
      success: true,
      message: `Monthly credit reset completed`,
      data: {
        usersReset: successful,
        failed: failed,
        executedAt: now.toISOString(),
        nextReset: new Date(now.getFullYear(), now.getMonth() + 1, 1).toISOString()
      }
    });

  } catch (error) {
    console.error('[CRON] Error in monthly credit reset:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to execute monthly credit reset',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// POST endpoint for manual trigger (requires admin auth)
export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET || 'your-secret-key';
    
    if (authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Same logic as GET but can be triggered manually
    return GET(req);

  } catch (error) {
    console.error('[CRON] Error in manual credit reset:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to execute manual credit reset',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
