import { NextRequest, NextResponse } from 'next/server';
import { getBlogPosts, createBlogPost } from '@/lib/prisma';
import { blogPosts as staticBlogPosts } from '@/data/blog-posts';

// Normalize a database post to match the expected BlogPost interface
function normalizePost(post: any) {
  const tags = Array.isArray(post.tags)
    ? post.tags
    : typeof post.tags === 'string' && post.tags.length > 0
      ? post.tags.split(',').map((t: string) => t.trim())
      : [];
  const date = post.date || (post.publishedAt instanceof Date ? post.publishedAt.toISOString() : post.publishedAt) || '';
  return {
    ...post,
    tags,
    date,
    publishedAt: date,
    readTime: post.readTime || `${Math.ceil((post.content || '').split(/\s+/).length / 200)} min read`,
  };
}

// Normalize a static post too (some use date, some use publishedAt)
function normalizeStaticPost(post: any) {
  const date = post.date || post.publishedAt || '';
  return {
    ...post,
    tags: Array.isArray(post.tags) ? post.tags : [],
    date,
    publishedAt: date,
  };
}

// Get a sortable date value from a post
function getPostDate(post: any): number {
  const d = post.date || post.publishedAt;
  return d ? new Date(d).getTime() : 0;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category') || undefined;
    const search = searchParams.get('search') || undefined;
    const limit = parseInt(searchParams.get('limit') || '200');

    // Always start with normalized static posts
    let allPosts: any[] = staticBlogPosts.map(normalizeStaticPost);
    
    try {
      // Get posts from database
      const dbPosts = await getBlogPosts({ limit: 500 });
      
      if (dbPosts && dbPosts.length > 0) {
        // Normalize database posts (tags is stored as String in DB)
        const normalizedDb = dbPosts.map(normalizePost);
        
        // Merge: DB posts + static posts, deduplicate by title (case-insensitive)
        const existingTitles = new Set(normalizedDb.map(p => p.title.toLowerCase().trim()));
        const uniqueStatic = allPosts.filter(p => !existingTitles.has(p.title.toLowerCase().trim()));
        allPosts = [...normalizedDb, ...uniqueStatic];
      }
    } catch (dbError) {
      console.log('Database unavailable, using static blog posts only');
    }

    // Apply category filter
    if (category && category !== 'All') {
      allPosts = allPosts.filter(post => 
        post.category.toLowerCase().includes(category.toLowerCase())
      );
    }

    // Apply search filter
    if (search) {
      const searchLower = search.toLowerCase();
      allPosts = allPosts.filter(post =>
        post.title.toLowerCase().includes(searchLower) ||
        (post.excerpt || '').toLowerCase().includes(searchLower) ||
        (Array.isArray(post.tags) ? post.tags : []).some((tag: string) => tag.toLowerCase().includes(searchLower))
      );
    }

    // Sort all posts by date (newest first)
    allPosts.sort((a, b) => getPostDate(b) - getPostDate(a));

    // Apply limit
    const posts = allPosts.slice(0, limit);

    return NextResponse.json({
      success: true,
      posts,
      count: posts.length
    });
  } catch (error) {
    console.error('Blog API error:', error);
    // Return static posts even on error
    const fallback = staticBlogPosts.map(normalizeStaticPost);
    return NextResponse.json({
      success: true,
      posts: fallback,
      count: fallback.length
    });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, excerpt, content, author, category, tags, featured, readTime } = body;

    if (!title || !content) {
      return NextResponse.json(
        { success: false, error: 'Title and content are required' },
        { status: 400 }
      );
    }

    const blogPost = await createBlogPost({
      title,
      excerpt: excerpt || '',
      content,
      author,
      category,
      tags,
      featured,
      readTime
    });

    return NextResponse.json({
      success: true,
      post: blogPost
    });
  } catch (error) {
    console.error('Blog creation error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create blog post' },
      { status: 500 }
    );
  }
}
