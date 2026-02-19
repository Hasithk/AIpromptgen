import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { generateAndSaveDailyBlog } from '@/lib/blog-generator';

/**
 * Admin endpoint to manually trigger blog generation.
 * Requires authenticated admin user.
 * 
 * POST /api/admin/generate-blog
 * Body: { count?: number, keywords?: string[], category?: string }
 */
export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Check if user is admin (check against admin emails)
    const adminEmails = (process.env.ADMIN_EMAILS || '').split(',').map(e => e.trim().toLowerCase());
    if (!adminEmails.includes(session.user.email.toLowerCase())) {
      return NextResponse.json(
        { success: false, error: 'Admin access required' },
        { status: 403 }
      );
    }

    const body = await request.json().catch(() => ({}));
    const count = Math.min(body.count || 1, 5);
    const focusKeywords = body.keywords || undefined;
    const category = body.category || undefined;

    // Determine base URL
    const host = request.headers.get('host') || 'localhost:3000';
    const protocol = host.includes('localhost') ? 'http' : 'https';
    const baseUrl = `${protocol}://${host}`;

    console.log(`[Admin] Blog generation triggered by ${session.user.email} - ${count} post(s)`);

    const result = await generateAndSaveDailyBlog(baseUrl, {
      count,
      focusKeywords,
      category,
    });

    return NextResponse.json({
      success: result.success,
      message: `Generated ${result.posts.length} blog post(s)`,
      data: {
        postsCreated: result.posts.length,
        posts: result.posts.map(p => ({
          id: p.id,
          title: p.title,
          category: p.category,
          excerpt: p.excerpt,
        })),
        errors: result.errors,
        generatedAt: new Date().toISOString(),
        generatedBy: session.user.email,
      },
    });
  } catch (error) {
    console.error('[Admin] Blog generation error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Blog generation failed',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
