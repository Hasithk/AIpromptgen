import fs from 'fs/promises';
import path from 'path';

const BLOG_DIR = path.join(process.cwd(), 'data', 'blogs');
const STATUS_FILE = path.join(process.cwd(), 'data', 'blog-automation-status.json');

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  category: string;
  tags?: string[];
  featured?: boolean;
  readTime?: string;
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface AutomationStatus {
  lastGeneration: string | null;
  nextGeneration: string | null;
  isEnabled: boolean;
  generationInterval: number; // in days
}

// Ensure directories exist
async function ensureDirectories() {
  await fs.mkdir(BLOG_DIR, { recursive: true });
  await fs.mkdir(path.dirname(STATUS_FILE), { recursive: true });
}

// Save blog post to file
export async function saveBlogPost(post: Omit<BlogPost, 'createdAt' | 'updatedAt'>): Promise<BlogPost> {
  await ensureDirectories();
  
  const now = new Date().toISOString();
  const fullPost: BlogPost = {
    ...post,
    createdAt: now,
    updatedAt: now
  };
  
  const filename = `${post.id}.json`;
  await fs.writeFile(
    path.join(BLOG_DIR, filename),
    JSON.stringify(fullPost, null, 2)
  );
  
  console.log(`[Blog Storage] Saved blog post: ${post.title}`);
  return fullPost;
}

// Get all blog posts
export async function getAllBlogPosts(): Promise<BlogPost[]> {
  try {
    await ensureDirectories();
    const files = await fs.readdir(BLOG_DIR);
    const blogs = await Promise.all(
      files
        .filter(file => file.endsWith('.json'))
        .map(async (file) => {
          const content = await fs.readFile(path.join(BLOG_DIR, file), 'utf-8');
          return JSON.parse(content) as BlogPost;
        })
    );
    return blogs.sort((a, b) => 
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );
  } catch (error) {
    console.log('[Blog Storage] No blogs found or error reading:', error);
    return [];
  }
}

// Get blog post by ID
export async function getBlogPostById(id: string): Promise<BlogPost | null> {
  try {
    const filename = `${id}.json`;
    const content = await fs.readFile(path.join(BLOG_DIR, filename), 'utf-8');
    return JSON.parse(content) as BlogPost;
  } catch {
    return null;
  }
}

// Get automation status
export async function getAutomationStatus(): Promise<AutomationStatus> {
  try {
    const content = await fs.readFile(STATUS_FILE, 'utf-8');
    return JSON.parse(content);
  } catch {
    // Default status if file doesn't exist
    return {
      lastGeneration: null,
      nextGeneration: null,
      isEnabled: true,
      generationInterval: 1 // daily
    };
  }
}

// Update automation status
export async function updateAutomationStatus(status: Partial<AutomationStatus>): Promise<void> {
  await ensureDirectories();
  const currentStatus = await getAutomationStatus();
  const newStatus = { ...currentStatus, ...status };
  await fs.writeFile(STATUS_FILE, JSON.stringify(newStatus, null, 2));
  console.log('[Blog Storage] Updated automation status');
}

// Check if should generate blog
export async function shouldGenerateBlog(): Promise<boolean> {
  const status = await getAutomationStatus();
  
  if (!status.isEnabled) {
    return false;
  }
  
  if (!status.lastGeneration) {
    return true; // Never generated before
  }
  
  const lastGen = new Date(status.lastGeneration);
  const now = new Date();
  const hoursSinceLastGen = (now.getTime() - lastGen.getTime()) / (1000 * 60 * 60);
  const intervalHours = status.generationInterval * 24;
  
  return hoursSinceLastGen >= intervalHours;
}

// Update last generation time
export async function updateLastGeneration(): Promise<void> {
  const now = new Date();
  const nextGen = new Date(now.getTime() + 24 * 60 * 60 * 1000); // +1 day
  
  await updateAutomationStatus({
    lastGeneration: now.toISOString(),
    nextGeneration: nextGen.toISOString()
  });
}
