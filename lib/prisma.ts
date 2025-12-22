import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

// Database connection check
export async function checkDatabaseConnection(): Promise<boolean> {
  try {
    await prisma.$connect();
    return true;
  } catch (error) {
    console.error('Database connection failed:', error);
    return false;
  }
}

// Blog post database functions
export async function createBlogPost(blogData: {
  title: string;
  excerpt: string;
  content: string;
  author?: string;
  category?: string;
  tags?: string[] | string;
  featured?: boolean;
  readTime?: string;
}) {
  try {
    // Handle both string array and string inputs for tags
    const tagsArray = normalizeTags(blogData.tags);

    const blogPost = await prisma.blogPost.create({
      data: {
        title: blogData.title,
        excerpt: blogData.excerpt,
        content: blogData.content,
        author: blogData.author || 'AI News Bot',
        category: blogData.category || 'AI News',
        tags: tagsArray,
        featured: blogData.featured ?? true,
        readTime: blogData.readTime || calculateReadTime(blogData.content),
      }
    });

    console.log('Blog post created successfully:', blogPost.id);
    return blogPost;
  } catch (error) {
    console.error('Error creating blog post:', error);
    throw error;
  }
}

export async function getBlogPosts(params?: {
  category?: string;
  search?: string;
  limit?: number;
  featured?: boolean;
}) {
  try {
    const where: any = {};

    if (params?.category && params.category !== 'all') {
      where.category = {
        contains: params.category
      };
    }

    if (params?.search) {
      where.OR = [
        { title: { contains: params.search } },
        { excerpt: { contains: params.search } },
        { tags: { contains: params.search } }
      ];
    }

    if (params?.featured !== undefined) {
      where.featured = params.featured;
    }

    const blogPosts = await prisma.blogPost.findMany({
      where,
      orderBy: { publishedAt: 'desc' },
      take: params?.limit || 20
    });

    return blogPosts;
  } catch (error) {
    console.error('Error getting blog posts:', error);
    // Return empty array instead of throwing error for better UX
    return [];
  }
}

export async function getBlogPostById(id: string) {
  try {
    const blogPost = await prisma.blogPost.findUnique({
      where: { id }
    });
    return blogPost;
  } catch (error) {
    console.error('Error getting blog post by id:', error);
    throw error;
  }
}

// Helper function to normalize tags input
function normalizeTags(tags?: string[] | string): string[] {
  if (Array.isArray(tags)) {
    return tags;
  }
  if (typeof tags === 'string') {
    return tags.split(',').map(tag => tag.trim()).filter(Boolean);
  }
  return [];
}

// Helper function to calculate reading time
function calculateReadTime(content: string): string {
  const wordsPerMinute = 200;
  const wordCount = content.split(/\s+/).length;
  const readingTime = Math.ceil(wordCount / wordsPerMinute);
  return `${readingTime} min read`;
}
