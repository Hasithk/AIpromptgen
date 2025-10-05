import { NextResponse } from 'next/server';
import { getBlogPostById } from '@/lib/blog-content';

// GET /api/blog/[id] - Get a specific blog post
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const post = await getBlogPostById(params.id);
    
    if (!post) {
      return NextResponse.json(
        { success: false, error: 'Blog post not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      post
    });
  } catch (error) {
    console.error('Blog post fetch error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch blog post' },
      { status: 500 }
    );
  }
}
