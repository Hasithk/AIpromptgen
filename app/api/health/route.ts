import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // Test database connection
    await prisma.$connect();
    
    // Test database query
    const userCount = await prisma.user.count();
    
    // Test environment variables
    const hasDeepSeekKey = !!process.env.DEEPSEEK_API_KEY;
    const hasNewsApiKey = !!process.env.NEWS_API_KEY;
    
    return NextResponse.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      database: 'connected',
      users: userCount,
      apis: {
        deepseek: hasDeepSeekKey ? 'configured' : 'missing',
        newsapi: hasNewsApiKey ? 'configured' : 'missing'
      },
      version: '1.0.0'
    });
  } catch (error) {
    console.error('Health check failed:', error);
    
    return NextResponse.json(
      {
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}