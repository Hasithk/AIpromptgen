import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
import type { BlogPost } from '@/types';
import { promises as fs } from 'fs';
import path from 'path';

// File-based persistence for generated blog articles (dev-friendly)
const DATA_DIR = path.join(process.cwd(), 'data');
const DATA_FILE = path.join(DATA_DIR, 'blog-articles.json');

async function ensureDataDir() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
  } catch {}
}

async function readArticles(): Promise<BlogPost[]> {
  try {
    await ensureDataDir();
    const buf = await fs.readFile(DATA_FILE, 'utf-8');
    const parsed = JSON.parse(buf);
    if (Array.isArray(parsed)) return parsed as BlogPost[];
    if (Array.isArray(parsed?.articles)) return parsed.articles as BlogPost[];
    return [];
  } catch {
    return [];
  }
}

async function writeArticles(articles: BlogPost[]): Promise<void> {
  await ensureDataDir();
  await fs.writeFile(DATA_FILE, JSON.stringify(articles, null, 2), 'utf-8');
}

// Default/sample articles
function getDefaultBlogPosts(): BlogPost[] {
  return [
    {
      id: 'blog-default-1',
      title: 'Daily AI News Brief - Today\'s Top Developments',
      excerpt: 'Stay updated with the latest AI breakthroughs, model releases, and industry innovations.',
      content: 'Comprehensive daily summary of the most important AI news and developments from around the world.',
      author: 'AI News Bot',
      category: 'Daily AI Digest',
      tags: ['AI', 'Daily', 'News', 'Digest'],
      featured: true,
      publishedAt: new Date().toISOString(),
      readTime: '8 min read',
      coverImage: 'https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d?q=80&auto=format&w=1200&h=600&fit=crop'
    }
  ];
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const limit = parseInt(searchParams.get('limit') || '25');
    const page = parseInt(searchParams.get('page') || '1');

    // Load persisted articles (fallback to defaults if empty)
    let posts: BlogPost[] = await readArticles();
    if (!posts || posts.length === 0) {
      posts = getDefaultBlogPosts();
    }

    // Apply filters
    if (category && category !== 'All') {
      posts = posts.filter((post: BlogPost) => 
        post.category.toLowerCase().includes(category.toLowerCase())
      );
    }

    if (search) {
      const searchLower = search.toLowerCase();
      posts = posts.filter((post: BlogPost) =>
        post.title.toLowerCase().includes(searchLower) ||
        post.excerpt.toLowerCase().includes(searchLower) ||
        post.tags.some((tag: string) => tag.toLowerCase().includes(searchLower))
      );
    }

    // Sort by date (newest first)
    posts.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

    // Ensure every post has a cover image (fallbacks + domain whitelist)
    const fallbackCovers = [
      'https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d?q=80&auto=format&w=1200&h=600&fit=crop',
      'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&auto=format&w=1200&h=600&fit=crop',
      'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&auto=format&w=1200&h=600&fit=crop',
      'https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&auto=format&w=1200&h=600&fit=crop',
      'https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?q=80&auto=format&w=1200&h=600&fit=crop',
      'https://images.unsplash.com/photo-1531746790731-6c087fecd65b?q=80&auto=format&w=1200&h=600&fit=crop'
    ];
    const allowedHosts = new Set(['images.unsplash.com', 'images.pexels.com', 'via.placeholder.com']);
    const ensureCover = (url: string | undefined, idx: number): string => {
      try {
        if (!url) return fallbackCovers[idx % fallbackCovers.length];
        const u = new URL(url);
        if (!allowedHosts.has(u.hostname)) {
          return fallbackCovers[idx % fallbackCovers.length];
        }
        return url;
      } catch {
        return fallbackCovers[idx % fallbackCovers.length];
      }
    };
    posts = posts.map((p, i) => ({
      ...p,
      coverImage: ensureCover(p.coverImage, i)
    }));

    // Pagination
    const totalPages = Math.ceil(posts.length / limit);
    const startIdx = (page - 1) * limit;
    const endIdx = startIdx + limit;
    const paginatedPosts = posts.slice(startIdx, endIdx);

    return NextResponse.json({
      success: true,
      posts: paginatedPosts,
      count: paginatedPosts.length,
      total: posts.length,
      page: page,
      totalPages: totalPages,
      limit: limit
    });
  } catch (error) {
    console.error('Blog API GET error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch blog posts',
        posts: [],
        count: 0
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Load existing persisted articles
    let existing = await readArticles();

    // Handle batch article creation (from generate-all or generate-daily)
    if (Array.isArray(body.articles)) {
      const incoming: BlogPost[] = body.articles as BlogPost[];

      // Bulk regeneration replaces all
      if (body.isRegeneration === true || incoming.length > 5) {
        // Sort newest first
        incoming.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
        await writeArticles(incoming);
        return NextResponse.json({
          success: true,
          message: `Replaced with ${incoming.length} articles`,
          articlesCount: incoming.length
        });
      }

      // Daily append: dedupe by id and by publishedAt date (day granularity)
      const dedupById = new Set(incoming.map(a => a.id));
      existing = existing.filter(a => !dedupById.has(a.id));

      // Remove any existing article for the same calendar day as incoming ones
      const incomingDays = new Set(
        incoming.map(a => {
          const d = new Date(a.publishedAt); d.setHours(0,0,0,0); return d.getTime();
        })
      );
      existing = existing.filter(a => {
        const d = new Date(a.publishedAt); d.setHours(0,0,0,0);
        return !incomingDays.has(d.getTime());
      });

      const merged = [...incoming, ...existing]
        .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
        .slice(0, 200); // keep recent 200

      await writeArticles(merged);
      return NextResponse.json({
        success: true,
        message: `Appended ${incoming.length} article(s)`,
        articlesCount: merged.length
      });
    }

    // Handle single article creation (manual)
    const newPost: BlogPost = {
      id: body.id || `blog-${Date.now()}`,
      title: body.title,
      excerpt: body.excerpt,
      content: body.content,
      author: body.author || 'AI News Bot',
      category: body.category || 'AI News',
      tags: Array.isArray(body.tags) ? body.tags : (body.tags ? body.tags.split(', ') : []),
      featured: body.featured || false,
      publishedAt: body.publishedAt || new Date().toISOString(),
      readTime: body.readTime || '5 min read',
      coverImage: body.coverImage,
    };

    // Upsert by id
    const idx = existing.findIndex(p => p.id === newPost.id);
    if (idx >= 0) existing[idx] = newPost; else existing.unshift(newPost);
    existing = existing.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
    await writeArticles(existing);

    return NextResponse.json({
      success: true,
      post: newPost,
      message: 'Blog post saved successfully',
      totalArticles: existing.length
    });
  } catch (error) {
    console.error('Blog API POST error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to create blog post'
      },
      { status: 500 }
    );
  }
}
