import { NextRequest, NextResponse } from 'next/server';
import { getBlogPosts, createBlogPost } from '@/lib/prisma';
import { blogPosts as staticBlogPosts } from '@/data/blog-posts';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category') || undefined;
    const search = searchParams.get('search') || undefined;
    const limit = parseInt(searchParams.get('limit') || '20');

    let posts;
    
    try {
      // Try to get posts from database first
      posts = await getBlogPosts({
        category: category !== 'All' ? category : undefined,
        search,
        limit
      });
      
      // If database returns empty, use static posts
      if (!posts || posts.length === 0) {
        posts = staticBlogPosts;
      }
    } catch (dbError) {
      // If database fails, use static posts
      console.log('Database unavailable, using static blog posts');
      posts = staticBlogPosts;
    }

    // Filter static posts if needed
    if (posts === staticBlogPosts) {
      let filtered = [...staticBlogPosts];
      
      if (category && category !== 'All') {
        filtered = filtered.filter(post => 
          post.category.toLowerCase().includes(category.toLowerCase())
        );
      }
      
      if (search) {
        const searchLower = search.toLowerCase();
        filtered = filtered.filter(post =>
          post.title.toLowerCase().includes(searchLower) ||
          post.excerpt.toLowerCase().includes(searchLower) ||
          post.tags.some(tag => tag.toLowerCase().includes(searchLower))
        );
      }
      
      posts = filtered.slice(0, limit);
    }

    return NextResponse.json({
      success: true,
      posts,
      count: posts.length
    });
  } catch (error) {
    console.error('Blog API error:', error);
    // Return static posts even on error
    return NextResponse.json({
      success: true,
      posts: staticBlogPosts,
      count: staticBlogPosts.length
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
