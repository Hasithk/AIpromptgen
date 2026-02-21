export interface User {
  id: string;
  email: string;
  name?: string;
  credits: number;
  plan: 'free' | 'pro' | 'elite';
  createdAt: Date;
  updatedAt: Date;
}

export interface Prompt {
  id: string;
  title: string;
  prompt: string;
  platform: 'sora' | 'veo3' | 'midjourney' | 'dall-e' | 'qwen';
  category: string;
  tags: string[];
  userId?: string;
  createdAt: Date;
  favorite?: boolean;
  creditsUsed: number;
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  publishedAt: string;
  date?: string;
  category: string;
  tags: string[];
  readTime: string;
  featured?: boolean;
}

export interface NewsItem {
  id: string;
  title: string;
  description: string;
  url: string;
  publishedAt: string;
  source: string;
  category: string;
}

export interface PricingPlan {
  name: string;
  description: string;
  price: string;
  period?: string;
  features: string[];
  limitations?: string[];
  cta: string;
  popular?: boolean;
}