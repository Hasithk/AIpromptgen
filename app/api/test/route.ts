import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  return NextResponse.json({
    success: true,
    message: 'Test endpoint working',
    env: {
      hasDeepSeekKey: !!process.env.DEEPSEEK_API_KEY,
      hasNewsKey: !!process.env.NEWS_API_KEY,
      hasCronSecret: !!process.env.CRON_SECRET,
      nextAuthUrl: process.env.NEXTAUTH_URL
    }
  });
}
