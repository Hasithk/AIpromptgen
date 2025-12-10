import { NextResponse } from 'next/server';
import { getBlogPosts as getPrismaBlogs, createBlogPost } from '@/lib/prisma';
import { getBlogPosts as getContentBlogs } from '@/lib/blog-content';
import { getAllBlogPosts } from '@/lib/blog-file-storage';
import type { BlogPost } from '@/types';

// Import generated blogs with safety check
let generatedBlogs: BlogPost[] = [];
try {
  const imported = require('@/lib/generated-blogs');
  generatedBlogs = imported.generatedBlogs || [];
  console.log(`🔧 Import check: generatedBlogs has ${generatedBlogs.length} items`);
} catch (error) {
  console.error('❌ Failed to import generated-blogs:', error);
  generatedBlogs = [];
}

// Sample blog posts for fallback
function getSampleBlogPosts(): BlogPost[] {
  return [
    {
      id: 'sample-1',
      title: 'The Future of AI Prompt Engineering: Mastering the Art of AI Communication',
      excerpt: 'Discover advanced prompt engineering techniques that will transform how you interact with AI models. Learn the secrets to crafting prompts that deliver exceptional results.',
      content: 'Complete guide to mastering AI prompt engineering with practical examples, advanced techniques, and best practices for GPT-4, Claude, and other leading AI models.',
      author: 'AI News Team',
      category: 'Prompt Engineering',
      tags: ['AI', 'Prompt Engineering', 'Tutorial', 'Best Practices'],
      featured: true,
      publishedAt: new Date().toISOString(),
      readTime: '12 min read'
    },
    {
      id: 'sample-2',
      title: 'AI Video Generation Revolution: Sora, Runway, and the Future of Content Creation',
      excerpt: 'Explore how AI video generation tools like Sora and Runway are transforming content creation, marketing, and entertainment industries with unprecedented capabilities.',
      content: 'Comprehensive analysis of AI video generation technology, comparing leading platforms and exploring their impact on creative industries worldwide.',
      author: 'AI Video Expert',
      category: 'AI Technology',
      tags: ['AI', 'Video Generation', 'Sora', 'Runway', 'Technology'],
      featured: true,
      publishedAt: new Date(Date.now() - 86400000).toISOString(),
      readTime: '10 min read'
    },
    {
      id: 'sample-3',
      title: 'ChatGPT vs Claude vs DeepSeek: The Ultimate AI Model Comparison for 2025',
      excerpt: 'Compare the top AI models of 2025 in this comprehensive analysis. Discover which AI assistant is best for your specific needs and use cases.',
      content: 'Detailed performance comparison of leading AI models, including pricing analysis, use case recommendations, and future predictions for the AI landscape.',
      author: 'AI Research Team',
      category: 'AI Comparison',
      tags: ['AI', 'ChatGPT', 'Claude', 'DeepSeek', 'Comparison'],
      featured: false,
      publishedAt: new Date(Date.now() - 172800000).toISOString(),
      readTime: '15 min read'
    },
    {
      id: 'sample-4',
      title: 'Building Your First AI-Powered Application: A Developer\'s Guide',
      excerpt: 'Step-by-step tutorial for developers looking to integrate AI capabilities into their applications using modern APIs and frameworks.',
      content: 'Practical development guide with code examples, API integration best practices, and real-world implementation strategies for AI-powered applications.',
      author: 'Dev Team',
      category: 'Development',
      tags: ['AI', 'Development', 'API', 'Tutorial'],
      featured: false,
      publishedAt: new Date(Date.now() - 259200000).toISOString(),
      readTime: '8 min read'
    },
    {
      id: 'sample-5',
      title: 'AI in Business: Transforming Industries with Intelligent Automation',
      excerpt: 'Discover how artificial intelligence is revolutionizing business operations across industries, from customer service to predictive analytics.',
      content: 'Business-focused analysis of AI implementation strategies, ROI considerations, and success stories across various industries and use cases.',
      author: 'Business AI Team',
      category: 'Business',
      tags: ['AI', 'Business', 'Automation', 'Strategy'],
      featured: false,
      publishedAt: new Date(Date.now() - 345600000).toISOString(),
      readTime: '9 min read'
    }
  ];
}

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

    let posts: BlogPost[] = [];

    // 1) Try file-based generated blogs first (automation output)
    try {
      posts = (await getAllBlogPosts()).map((p) => ({
        ...p,
        tags: p.tags || [],
        readTime: p.readTime || '5 min read',
        category: p.category || 'AI News',
      }));
      console.log(`✅ Loaded ${posts.length} posts from file storage`);
    } catch (error) {
      console.error('⚠️ File blog read error, using static generated blogs:', error);
      // Use static import as fallback for serverless environments
      console.log(`📦 Static import has ${generatedBlogs.length} blogs`);
      posts = generatedBlogs.map((p) => ({
        ...p,
        tags: p.tags || [],
        readTime: p.readTime || '5 min read',
        category: p.category || 'AI News',
      }));
      console.log(`✅ Loaded ${posts.length} posts from static import`);
    }

    // Only fall back to database/content library if we have no generated posts
    if (!posts || posts.length === 0) {
      console.log('⚠️ No generated posts found, falling back to content library');
      // Try to get posts from database if available
      if (process.env.DATABASE_URL) {
        try {
          // Database posts functionality can be added later
          // For now, just use empty array to fall back to content library
          posts = [];
        } catch (error) {
          console.error('Database error, using fallback posts:', error);
          posts = [];
        }
      }

      // If no posts from database, provide content library posts
      if (!posts || posts.length === 0) {
        posts = await getContentBlogs();
        console.log(`📚 Loaded ${posts.length} sample posts from content library (FALLBACK)`);
      }
    } else {
      console.log(`✅ Using ${posts.length} generated blog posts`);
    }

    // Apply filters after loading posts
    if (posts && posts.length > 0) {
      
      // Apply filters to sample posts if needed
      if (params.category && params.category !== 'all') {
        posts = posts.filter((post: BlogPost) => 
          post.category.toLowerCase().includes(params.category!.toLowerCase())
        );
      }
      
      if (params.search) {
        const searchTerm = params.search.toLowerCase();
        posts = posts.filter((post: BlogPost) =>
          post.title.toLowerCase().includes(searchTerm) ||
          post.excerpt.toLowerCase().includes(searchTerm) ||
          post.tags.some((tag: string) => tag.toLowerCase().includes(searchTerm))
        );
      }
      
      if (params.limit) {
        posts = posts.slice(0, params.limit);
      }
    }

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
