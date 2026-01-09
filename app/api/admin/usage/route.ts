import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    // Check authentication - only admins should access this
    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Get date range from query params
    const { searchParams } = new URL(request.url);
    const days = parseInt(searchParams.get('days') || '30');
    
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // Get usage statistics
    const [
      totalUsers,
      activeUsers,
      totalGenerations,
      generationsByPlatform,
      creditUsage,
      dailyGenerations
    ] = await Promise.all([
      // Total users
      prisma.user.count(),
      
      // Active users (generated in last 30 days)
      prisma.user.count({
        where: {
          promptHistory: {
            some: {
              createdAt: {
                gte: startDate
              }
            }
          }
        }
      }),
      
      // Total generations
      prisma.promptHistory.count({
        where: {
          createdAt: {
            gte: startDate
          }
        }
      }),
      
      // Generations by platform
      prisma.promptHistory.groupBy({
        by: ['platform'],
        where: {
          createdAt: {
            gte: startDate
          }
        },
        _count: {
          id: true
        },
        _sum: {
          creditsUsed: true
        }
      }),
      
      // Credit usage by plan
      prisma.user.groupBy({
        by: ['plan'],
        _count: {
          id: true
        },
        _sum: {
          credits: true
        },
        _avg: {
          credits: true
        }
      }),
      
      // Daily generation trends
      prisma.$queryRaw`
        SELECT 
          DATE("createdAt") as date,
          COUNT(*) as count,
          SUM("creditsUsed") as credits
        FROM "PromptHistory"
        WHERE "createdAt" >= ${startDate}
        GROUP BY DATE("createdAt")
        ORDER BY date DESC
        LIMIT 30
      `
    ]);

    // Calculate cost estimates
    const totalCreditsUsed = generationsByPlatform.reduce(
      (sum, item) => sum + (item._sum.creditsUsed || 0), 
      0
    );
    
    // Approximate API costs (based on report calculations)
    const avgCostPerGeneration = 0.03; // $0.03 average
    const estimatedAPICost = totalGenerations * avgCostPerGeneration;

    return NextResponse.json({
      success: true,
      data: {
        period: {
          days,
          startDate: startDate.toISOString(),
          endDate: new Date().toISOString()
        },
        users: {
          total: totalUsers,
          active: activeUsers,
          byPlan: creditUsage
        },
        generations: {
          total: totalGenerations,
          byPlatform: generationsByPlatform,
          daily: dailyGenerations
        },
        credits: {
          totalUsed: totalCreditsUsed,
          estimatedCost: estimatedAPICost.toFixed(2)
        }
      }
    });

  } catch (error) {
    console.error('Usage analytics error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch usage analytics' },
      { status: 500 }
    );
  }
}
