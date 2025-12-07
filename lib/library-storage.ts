import fs from 'fs/promises';
import path from 'path';

const LIBRARY_DIR = path.join(process.cwd(), 'data', 'library');

export interface LibraryPrompt {
  id: string;
  title: string;
  description: string;
  prompt: string;
  category: string;
  platform: string;
  tags: string[];
  likes: number;
  rating: number;
  author: string;
  featured: boolean;
  trending?: boolean;
  createdAt: string;
}

// Ensure directory exists
async function ensureDirectory() {
  await fs.mkdir(LIBRARY_DIR, { recursive: true });
}

// Save prompt to library
export async function saveLibraryPrompt(prompt: Omit<LibraryPrompt, 'createdAt'>): Promise<LibraryPrompt> {
  await ensureDirectory();
  
  const fullPrompt: LibraryPrompt = {
    ...prompt,
    createdAt: new Date().toISOString()
  };
  
  const filename = `${prompt.id}.json`;
  await fs.writeFile(
    path.join(LIBRARY_DIR, filename),
    JSON.stringify(fullPrompt, null, 2)
  );
  
  console.log(`[Library Storage] Saved prompt: ${prompt.title}`);
  return fullPrompt;
}

// Get all library prompts
export async function getAllLibraryPrompts(): Promise<LibraryPrompt[]> {
  try {
    await ensureDirectory();
    const files = await fs.readdir(LIBRARY_DIR);
    const prompts = await Promise.all(
      files
        .filter(file => file.endsWith('.json'))
        .map(async (file) => {
          const content = await fs.readFile(path.join(LIBRARY_DIR, file), 'utf-8');
          return JSON.parse(content) as LibraryPrompt;
        })
    );
    return prompts.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  } catch (error) {
    console.log('[Library Storage] No prompts found:', error);
    return [];
  }
}

// Get trending prompts (last 7 days)
export async function getTrendingPrompts(): Promise<LibraryPrompt[]> {
  const allPrompts = await getAllLibraryPrompts();
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  
  return allPrompts
    .filter(p => new Date(p.createdAt) >= sevenDaysAgo)
    .sort((a, b) => b.likes - a.likes)
    .slice(0, 20);
}

// Save multiple prompts
export async function saveBulkPrompts(prompts: Omit<LibraryPrompt, 'createdAt'>[]): Promise<LibraryPrompt[]> {
  const savedPrompts = [];
  for (const prompt of prompts) {
    const saved = await saveLibraryPrompt(prompt);
    savedPrompts.push(saved);
  }
  return savedPrompts;
}
