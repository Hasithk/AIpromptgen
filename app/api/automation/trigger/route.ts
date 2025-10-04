import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Trigger the blog generation endpoint
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
    
    const response = await fetch(`${baseUrl}/api/blog/generate-now`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const result = await response.json();

    return NextResponse.json({
      success: true,
      message: 'Blog automation triggered successfully',
      timestamp: new Date().toISOString(),
      result: result
    });

  } catch (error) {
    console.error('Automation trigger error:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}

// Also allow POST requests
export async function POST() {
  return GET();
}