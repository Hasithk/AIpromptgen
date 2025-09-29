// Update user credits API
export async function updateUserCredits(amount: number) {
  return fetchAPI('/user/credits', {
    method: 'POST',
    body: JSON.stringify({ amount }),
  });
}
// API utilities for the AI Prompt Generator app

export interface APIResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export class APIError extends Error {
  constructor(
    message: string,
    public status: number = 500,
    public code?: string
  ) {
    super(message);
    this.name = 'APIError';
  }
}

export async function fetchAPI<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<APIResponse<T>> {
  try {
    const response = await fetch(`/api${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new APIError(
        data.message || 'An error occurred',
        response.status,
        data.code
      );
    }

    return data;
  } catch (error) {
    if (error instanceof APIError) {
      throw error;
    }
    
    throw new APIError(
      error instanceof Error ? error.message : 'Network error occurred'
    );
  }
}

// Prompt generation API
export async function generatePrompt(params: {
  subject: string;
  platform: string;
  styles: string[];
  mood?: string;
  lighting?: string;
  creativity: number;
  duration?: number;
  includeNegative: boolean;
}) {
  return fetchAPI('/prompts/generate', {
    method: 'POST',
    body: JSON.stringify(params),
  });
}

// User credits API
export async function getUserCredits() {
  return fetchAPI('/user/credits');
}

// News API
export async function getLatestNews() {
  return fetchAPI('/news/latest');
}

// Blog API
export async function getBlogPosts(params?: {
  category?: string;
  search?: string;
  limit?: number;
}) {
  const searchParams = new URLSearchParams();
  if (params?.category) searchParams.set('category', params.category);
  if (params?.search) searchParams.set('search', params.search);
  if (params?.limit) searchParams.set('limit', params.limit.toString());
  
  const query = searchParams.toString();
  return fetchAPI(`/blog${query ? `?${query}` : ''}`);
}

// Create blog post
export async function createBlogPost(postData: {
  title: string;
  excerpt: string;
  content: string;
  category: string;
  tags: string[];
  author?: string;
  featured?: boolean;
}) {
  return fetchAPI('/blog', {
    method: 'POST',
    body: JSON.stringify(postData),
  });
}

// Get cron status (for monitoring purposes)
export async function getCronStatus() {
  return fetchAPI('/blog/cron');
}