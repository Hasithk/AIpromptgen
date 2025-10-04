import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Test if blog API works
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
    
    const response = await fetch(`${baseUrl}/api/blog`, {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error(`Blog API error: ${response.status}`);
    }

    const blogData = await response.json();

    return NextResponse.json({
      success: true,
      message: 'Blog system is working correctly',
      timestamp: new Date().toISOString(),
      blogPostCount: blogData.posts?.length || 0,
      sampleTitles: blogData.posts?.slice(0, 3).map((post: any) => post.title) || [],
      status: 'Blog content is available and accessible'
    });

  } catch (error) {
    console.error('Blog test error:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      message: 'Blog system test failed',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}