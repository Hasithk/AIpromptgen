import { NextResponse } from 'next/server';
import { getBlogPosts, createBlogPost } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const limit = searchParams.get('limit');

    const params = {
      category: category || undefined,
      search: search || undefined,
      limit: limit ? parseInt(limit) : undefined,
    };

    // Add database connection check
    if (!process.env.DATABASE_URL) {
      console.error('DATABASE_URL not configured');
      return NextResponse.json({
        success: true,
        posts: [],
        count: 0,
        message: 'Database not configured'
      });
    }

    const posts = await getBlogPosts(params);

    return NextResponse.json({
      success: true,
      posts: posts || [],
      count: posts?.length || 0
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
    const blogData = await request.json();

    const newPost = await createBlogPost({
      title: blogData.title,
      excerpt: blogData.excerpt,
      content: blogData.content,
      author: blogData.author || 'AI News Bot',
      category: blogData.category || 'AI News',
      tags: Array.isArray(blogData.tags) ? blogData.tags : (blogData.tags ? blogData.tags.split(', ') : []),
      featured: blogData.featured || false,
      readTime: blogData.readTime
    });

    return NextResponse.json({
      success: true,
      post: newPost,
      message: 'Blog post created successfully'
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
