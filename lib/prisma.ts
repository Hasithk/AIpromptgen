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

// Blog automation functions
export async function getLastBlogGeneration(): Promise<Date | null> {
  try {
    const automation = await prisma.blogAutomation.findUnique({
      where: { id: 'blog_automation' }
    });
    return automation?.lastGeneration || null;
  } catch (error) {
    console.error('Error getting last blog generation:', error);
    return null;
  }
}

export async function updateLastBlogGeneration(): Promise<void> {
  try {
    const now = new Date();
    const nextGeneration = new Date(now.getTime() + 1 * 24 * 60 * 60 * 1000); // 1 day later

    await prisma.blogAutomation.upsert({
      where: { id: 'blog_automation' },
      create: {
        id: 'blog_automation',
        lastGeneration: now,
        nextGeneration: nextGeneration,
        isEnabled: true,
        generationInterval: 1
      },
      update: {
        lastGeneration: now,
        nextGeneration: nextGeneration,
        updatedAt: now
      }
    });
    
    console.log('Last blog generation timestamp updated:', now.toISOString());
  } catch (error) {
    console.error('Error updating last blog generation:', error);
    throw error;
  }
}

export async function getNextBlogGeneration(): Promise<Date | null> {
  try {
    const automation = await prisma.blogAutomation.findUnique({
      where: { id: 'blog_automation' }
    });
    return automation?.nextGeneration || null;
  } catch (error) {
    console.error('Error getting next blog generation:', error);
    return null;
  }
}

export async function checkIfShouldGenerateBlog(): Promise<boolean> {
  try {
    const lastGeneration = await getLastBlogGeneration();
    
    // If no previous generation, allow generation
    if (!lastGeneration) {
      return true;
    }

    const now = new Date();
    const daysSinceLastGeneration = (now.getTime() - lastGeneration.getTime()) / (1000 * 60 * 60 * 24);
    
    return daysSinceLastGeneration >= 1;
  } catch (error) {
    console.error('Error checking if should generate blog:', error);
    // Default to allowing generation if there's an error
    return true;
  }
}

export async function getBlogAutomationStatus() {
  try {
    const automation = await prisma.blogAutomation.findUnique({
      where: { id: 'blog_automation' }
    });

    const now = new Date();
    const shouldGenerate = await checkIfShouldGenerateBlog();
    
    return {
      lastGeneration: automation?.lastGeneration?.toISOString() || null,
      nextGeneration: automation?.nextGeneration?.toISOString() || null,
      shouldGenerate,
      isEnabled: automation?.isEnabled ?? true,
      generationInterval: automation?.generationInterval ?? 1,
      timeUntilNext: automation?.nextGeneration ? 
        Math.max(0, automation.nextGeneration.getTime() - now.getTime()) : 0
    };
  } catch (error) {
    console.error('Error getting blog automation status:', error);
    throw error;
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
