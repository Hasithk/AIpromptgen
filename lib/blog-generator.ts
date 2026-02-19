import { createBlogPost } from '@/lib/prisma';

const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions';

// SEO target keywords to rank for
const SEO_KEYWORDS = [
  'AI prompt generator',
  'AI prompts',
  'best AI prompts',
  'AI prompt engineering',
  'ChatGPT prompts',
  'Midjourney prompts',
  'DALL-E prompts',
  'Sora prompts',
  'AI image prompts',
  'AI video prompts',
  'free AI prompts',
  'AI prompt tips',
  'AI prompt examples',
  'how to write AI prompts',
  'AI prompt templates',
  'prompt engineering guide',
  'AI art prompts',
  'AI writing prompts',
  'generative AI prompts',
  'AI prompt best practices',
];

// Blog categories with SEO focus
const BLOG_CATEGORIES = [
  'AI Prompts',
  'Prompt Engineering',
  'AI Tools',
  'AI News',
  'AI Tips & Tricks',
  'AI Tutorials',
];

interface NewsArticle {
  title: string;
  description: string;
  source: string;
  url: string;
  publishedAt: string;
  category?: string;
}

interface GeneratedBlog {
  title: string;
  excerpt: string;
  content: string;
  category: string;
  tags: string[];
}

/**
 * Fetch latest AI news from the site's news API
 */
export async function fetchLatestAINews(baseUrl: string): Promise<NewsArticle[]> {
  try {
    // Try live news API first
    const newsResponse = await fetch(`${baseUrl}/api/news/latest`, {
      cache: 'no-store',
    });
    
    if (newsResponse.ok) {
      const newsData = await newsResponse.json();
      if (newsData.success && newsData.data?.length > 0) {
        return newsData.data.map((item: any) => ({
          title: item.title,
          description: item.description || '',
          source: item.source || 'AI News',
          url: item.url || '',
          publishedAt: item.publishedAt,
          category: item.category,
        }));
      }
    }

    // Fallback: try the AI news endpoint (static data)
    const aiNewsResponse = await fetch(`${baseUrl}/api/ai-news`, {
      cache: 'no-store',
    });
    
    if (aiNewsResponse.ok) {
      const aiNewsData = await aiNewsResponse.json();
      if (aiNewsData.data?.length > 0) {
        return aiNewsData.data.map((item: any) => ({
          title: item.title,
          description: item.description || item.summary || '',
          source: item.source || 'AI News',
          url: item.url || '',
          publishedAt: item.publishedAt || item.date || new Date().toISOString(),
          category: item.category,
        }));
      }
    }

    return [];
  } catch (error) {
    console.error('[BlogGenerator] Failed to fetch news:', error);
    return [];
  }
}

/**
 * Pick random SEO keywords for this blog post
 */
function pickSEOKeywords(count: number = 4): string[] {
  const shuffled = [...SEO_KEYWORDS].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

/**
 * Pick a blog category
 */
function pickCategory(): string {
  return BLOG_CATEGORIES[Math.floor(Math.random() * BLOG_CATEGORIES.length)];
}

/**
 * Generate an SEO-optimized blog post using DeepSeek AI based on news
 */
export async function generateBlogFromNews(
  newsArticles: NewsArticle[],
  options?: {
    focusKeywords?: string[];
    category?: string;
  }
): Promise<GeneratedBlog> {
  const apiKey = process.env.DEEPSEEK_API_KEY;
  if (!apiKey) {
    throw new Error('DEEPSEEK_API_KEY not configured');
  }

  const focusKeywords = options?.focusKeywords || pickSEOKeywords(4);
  const category = options?.category || pickCategory();

  // Summarize the top news for the AI
  const newsSummary = newsArticles
    .slice(0, 8)
    .map((article, i) => `${i + 1}. "${article.title}" - ${article.description} (Source: ${article.source})`)
    .join('\n');

  const today = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const systemPrompt = `You are an expert SEO blog writer for AIPromptGen.com, a leading AI prompt generator platform. Your job is to write engaging, informative, SEO-optimized blog posts about AI prompts, prompt engineering, and AI tools.

CRITICAL SEO RULES:
- Naturally weave the focus keywords throughout the article (title, headings, first paragraph, body, conclusion)
- Use H2 (##) and H3 (###) headings that include keywords
- Write in a conversational yet authoritative tone
- Include practical AI prompt examples and tips that readers can use
- Always relate news topics back to AI prompts and prompt engineering
- Include internal references to "AI prompt generator" tools and techniques
- Aim for 1200-1800 words for good SEO length
- Use bullet points and numbered lists for readability
- Include a compelling meta description as the excerpt (150-160 chars)
- End with a call-to-action encouraging readers to try AI prompts on AIPromptGen.com

CONTENT FORMAT:
Write the blog in Markdown format. Structure it as:
1. Engaging introduction connecting the news to AI prompts
2. Main content sections with keyword-rich headings
3. Practical prompt examples and tips
4. How this affects prompt engineering
5. Conclusion with CTA

OUTPUT FORMAT (respond in valid JSON only):
{
  "title": "SEO-optimized title with focus keyword (50-60 chars ideal)",
  "excerpt": "Meta description with keywords (150-160 chars)",
  "content": "Full markdown blog content",
  "tags": ["tag1", "tag2", "tag3", "tag4", "tag5"]
}`;

  const userPrompt = `Write a blog post for today (${today}) based on these latest AI news stories:

${newsSummary}

FOCUS KEYWORDS to naturally include: ${focusKeywords.join(', ')}
CATEGORY: ${category}

Transform these news items into an engaging, SEO-optimized blog post that:
1. Discusses the news and what it means for AI users
2. Connects everything back to AI prompts and prompt engineering
3. Includes 3-5 practical AI prompt examples readers can try
4. Mentions our AI Prompt Generator tool naturally
5. Is optimized to rank for "${focusKeywords[0]}" as the primary keyword

Remember: Output ONLY valid JSON with title, excerpt, content, and tags fields.`;

  const response = await fetch(DEEPSEEK_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'deepseek-chat',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.7,
      max_tokens: 4000,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`DeepSeek API error: ${response.status} - ${errorText}`);
  }

  const result = await response.json();
  const aiContent = result.choices?.[0]?.message?.content || '';

  // Parse the JSON response from AI
  let parsed: GeneratedBlog;
  try {
    // Try to extract JSON from the response (AI might wrap it in ```json blocks)
    const jsonMatch = aiContent.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No JSON found in AI response');
    }
    const raw = JSON.parse(jsonMatch[0]);
    parsed = {
      title: raw.title || `AI Prompts Update: ${today}`,
      excerpt: raw.excerpt || raw.meta_description || `Latest AI prompt engineering insights and news for ${today}.`,
      content: raw.content || aiContent,
      category,
      tags: Array.isArray(raw.tags) ? raw.tags : focusKeywords,
    };
  } catch (parseError) {
    // If JSON parsing fails, use the raw content with generated metadata
    console.warn('[BlogGenerator] JSON parse failed, using raw content:', parseError);
    parsed = {
      title: `AI Prompt Engineering: What's New in AI Today - ${today}`,
      excerpt: `Discover the latest AI news and how it impacts prompt engineering. Get practical AI prompt tips and examples for ${today}.`,
      content: aiContent,
      category,
      tags: focusKeywords,
    };
  }

  return parsed;
}

/**
 * Full pipeline: Fetch news → Generate blog → Save to database
 */
export async function generateAndSaveDailyBlog(
  baseUrl: string,
  options?: {
    count?: number; // Number of blog posts to generate (default: 1)
    focusKeywords?: string[];
    category?: string;
  }
): Promise<{ success: boolean; posts: any[]; errors: string[] }> {
  const count = options?.count || 1;
  const posts: any[] = [];
  const errors: string[] = [];

  console.log(`[BlogGenerator] Starting daily blog generation (${count} posts)...`);

  // Step 1: Fetch latest news
  const news = await fetchLatestAINews(baseUrl);
  console.log(`[BlogGenerator] Fetched ${news.length} news articles`);

  if (news.length === 0) {
    // Generate based on general AI prompt topics if no news available
    console.log('[BlogGenerator] No news available, generating topic-based content');
  }

  for (let i = 0; i < count; i++) {
    try {
      // Shuffle news for variety if generating multiple posts
      const shuffledNews = [...news].sort(() => Math.random() - 0.5);
      
      // Pick different keywords for each post
      const focusKeywords = options?.focusKeywords || pickSEOKeywords(4);
      const category = options?.category || pickCategory();

      console.log(`[BlogGenerator] Generating post ${i + 1}/${count} with keywords: ${focusKeywords.join(', ')}`);

      // Step 2: Generate blog content
      const blog = await generateBlogFromNews(shuffledNews, {
        focusKeywords,
        category,
      });

      // Step 3: Save to database
      const savedPost = await createBlogPost({
        title: blog.title,
        excerpt: blog.excerpt,
        content: blog.content,
        author: 'AI Prompt Gen Team',
        category: blog.category,
        tags: blog.tags,
        featured: i === 0, // First post is featured
      });

      console.log(`[BlogGenerator] ✓ Post saved: "${blog.title}" (ID: ${savedPost.id})`);
      posts.push(savedPost);

      // Small delay between generations to avoid rate limiting
      if (i < count - 1) {
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    } catch (error) {
      const errorMsg = `Failed to generate post ${i + 1}: ${error instanceof Error ? error.message : String(error)}`;
      console.error(`[BlogGenerator] ✗ ${errorMsg}`);
      errors.push(errorMsg);
    }
  }

  console.log(`[BlogGenerator] Complete: ${posts.length} posts created, ${errors.length} errors`);

  return {
    success: posts.length > 0,
    posts,
    errors,
  };
}
