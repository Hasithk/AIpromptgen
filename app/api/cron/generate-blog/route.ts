import { NextResponse } from 'next/server';
import { generateAndSaveDailyBlog } from '@/lib/blog-generator';

/**
 * Cron endpoint for automated daily blog generation.
 * 
 * Call this from:
 * - Vercel Cron (vercel.json)
 * - GitHub Actions
 * - External cron service (e.g., cron-job.org)
 * - Windows Task Scheduler (curl)
 * 
 * GET /api/cron/generate-blog
 * Headers: Authorization: Bearer <CRON_SECRET>
 * Query params:
 *   - count: Number of posts to generate (default: 1, max: 5)
 */
export async function GET(req: Request) {
  try {
    // Verify authorization
    const authHeader = req.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET || 'your-secret-key';

    if (authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const url = new URL(req.url);
    const count = Math.min(parseInt(url.searchParams.get('count') || '1'), 5);

    // Determine base URL for fetching news
    const baseUrl = getBaseUrl(req);

    console.log(`[CRON] Daily blog generation started - generating ${count} post(s)`);

    const result = await generateAndSaveDailyBlog(baseUrl, { count });

    console.log(`[CRON] Blog generation complete: ${result.posts.length} created, ${result.errors.length} failed`);

    return NextResponse.json({
      success: result.success,
      message: `Generated ${result.posts.length} blog post(s)`,
      data: {
        postsCreated: result.posts.length,
        posts: result.posts.map(p => ({
          id: p.id,
          title: p.title,
          category: p.category,
        })),
        errors: result.errors,
        executedAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('[CRON] Blog generation failed:', error);
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

function getBaseUrl(req: Request): string {
  const host = req.headers.get('host') || 'localhost:3000';
  const protocol = host.includes('localhost') ? 'http' : 'https';
  return `${protocol}://${host}`;
}
