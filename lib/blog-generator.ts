import { createBlogPost } from '@/lib/prisma';

const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions';

// Primary keyword — always included in every blog post
const PRIMARY_KEYWORD = 'AI Prompt';

// SEO target keywords to rank for (AI Prompt variations)
const SEO_KEYWORDS = [
  'AI Prompt',
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
  aiRelevance?: 'high' | 'medium' | 'low';
}

interface GeneratedBlog {
  title: string;
  excerpt: string;
  content: string;
  category: string;
  tags: string[];
}

/**
 * Fetch latest AI news from the AI news page API, filtering for high relevance only
 */
export async function fetchLatestAINews(baseUrl: string): Promise<NewsArticle[]> {
  try {
    // Fetch from the AI news endpoint which has relevance tagging
    const aiNewsResponse = await fetch(`${baseUrl}/api/ai-news`, {
      cache: 'no-store',
    });

    if (aiNewsResponse.ok) {
      const aiNewsData = await aiNewsResponse.json();
      const newsItems = aiNewsData.news || aiNewsData.data || [];

      if (newsItems.length > 0) {
        // Map all news with their relevance
        const allNews: NewsArticle[] = newsItems.map((item: any) => ({
          title: item.title,
          description: item.description || item.summary || '',
          source: item.source?.name || item.source || 'AI News',
          url: item.url || '',
          publishedAt: item.publishedAt || item.date || new Date().toISOString(),
          category: item.category,
          aiRelevance: item.aiRelevance || 'low',
        }));

        // Return high-relevance news first, then medium as fallback
        const highRelevance = allNews.filter(n => n.aiRelevance === 'high');
        const mediumRelevance = allNews.filter(n => n.aiRelevance === 'medium');

        if (highRelevance.length > 0) {
          console.log(`[BlogGenerator] Found ${highRelevance.length} high-relevance news items`);
          return highRelevance;
        }
        if (mediumRelevance.length > 0) {
          console.log(`[BlogGenerator] No high-relevance news, using ${mediumRelevance.length} medium-relevance items`);
          return mediumRelevance;
        }
        // If no relevance-tagged items, return all
        return allNews;
      }
    }

    // Also try the /api/news/latest endpoint as secondary source
    const newsResponse = await fetch(`${baseUrl}/api/news/latest`, {
      cache: 'no-store',
    });

    if (newsResponse.ok) {
      const newsData = await newsResponse.json();
      if (newsData.success && newsData.data?.length > 0) {
        return newsData.data.map((item: any) => ({
          title: item.title,
          description: item.description || '',
          source: item.source?.name || item.source || 'AI News',
          url: item.url || '',
          publishedAt: item.publishedAt,
          category: item.category,
          aiRelevance: item.aiRelevance || 'medium',
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
 * Extract unique tags and trending topics from high-relevance news articles
 */
function extractNewsTags(newsArticles: NewsArticle[]): string[] {
  const tagSet = new Set<string>();

  for (const article of newsArticles) {
    // Extract category as a tag
    if (article.category) tagSet.add(article.category);

    // Extract key AI-related terms from title and description
    const text = `${article.title} ${article.description}`.toLowerCase();
    const knownTags = [
      'ChatGPT', 'GPT-4', 'GPT-5', 'OpenAI', 'Claude', 'Gemini', 'DeepSeek',
      'Midjourney', 'DALL-E', 'Sora', 'Copilot', 'LLM', 'RAG',
      'Prompt Engineering', 'Fine-Tuning', 'Transformer',
      'AI Agent', 'Generative AI', 'Computer Vision', 'NLP',
    ];
    for (const tag of knownTags) {
      if (text.includes(tag.toLowerCase())) tagSet.add(tag);
    }
  }

  return Array.from(tagSet);
}

/**
 * Pick SEO keywords — always includes 'AI Prompt' as the primary keyword
 */
function pickSEOKeywords(count: number = 4, extraTags: string[] = []): string[] {
  // Always start with the primary keyword
  const keywords = [PRIMARY_KEYWORD];

  // Add relevant tags from the news if available
  const newsKeywords = extraTags
    .filter(t => !t.toLowerCase().includes('ai prompt'))
    .slice(0, 2);
  keywords.push(...newsKeywords);

  // Fill remaining slots from SEO_KEYWORDS
  const remaining = SEO_KEYWORDS.filter(
    k => !keywords.some(kw => kw.toLowerCase() === k.toLowerCase())
  );
  const shuffled = [...remaining].sort(() => Math.random() - 0.5);
  while (keywords.length < count && shuffled.length > 0) {
    keywords.push(shuffled.shift()!);
  }

  return keywords;
}

/**
 * Pick a blog category
 */
function pickCategory(): string {
  return BLOG_CATEGORIES[Math.floor(Math.random() * BLOG_CATEGORIES.length)];
}

/**
 * Generate an SEO-optimized, creative blog post using DeepSeek AI
 * based on the day's high-relevance AI news, with "AI Prompt" as the main keyword
 */
export async function generateBlogFromNews(
  newsArticles: NewsArticle[],
  options?: {
    focusKeywords?: string[];
    category?: string;
    newsTags?: string[];
  }
): Promise<GeneratedBlog> {
  const apiKey = process.env.DEEPSEEK_API_KEY;
  if (!apiKey) {
    throw new Error('DEEPSEEK_API_KEY not configured');
  }

  // Extract tags from the high-relevance news to weave into the blog
  const newsTags = options?.newsTags || extractNewsTags(newsArticles);
  const focusKeywords = options?.focusKeywords || pickSEOKeywords(5, newsTags);
  const category = options?.category || pickCategory();

  // Summarize the top high-relevance news for the AI
  const newsSummary = newsArticles
    .slice(0, 10)
    .map((article, i) => {
      const relevance = article.aiRelevance ? ` [Relevance: ${article.aiRelevance}]` : '';
      return `${i + 1}. "${article.title}" - ${article.description} (Source: ${article.source}, Category: ${article.category || 'General'})${relevance}`;
    })
    .join('\n');

  const today = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const trendingTagsStr = newsTags.length > 0
    ? `\nTRENDING TAGS FROM TODAY'S NEWS: ${newsTags.join(', ')}\n`
    : '';

  const systemPrompt = `You are an expert SEO blog writer for AIPromptGen.com, a leading AI prompt generator platform. Your job is to write creative, engaging, informative, SEO-optimized blog posts.

MAIN KEYWORD: "AI Prompt" — this MUST appear in the title, first paragraph, at least 3 headings, and throughout the article naturally.

CRITICAL SEO RULES:
- The phrase "AI Prompt" must be the primary keyword in EVERY blog post
- Naturally weave ALL focus keywords throughout the article (title, headings, first paragraph, body, conclusion)
- Use H2 (##) and H3 (###) headings that include "AI Prompt" or related keywords
- Write in a creative, conversational yet authoritative tone
- Include practical AI prompt examples and tips that readers can use RIGHT NOW
- Always relate news topics back to AI prompts and prompt engineering
- Include internal references to "AI prompt generator" tools and techniques
- Aim for 1200-1800 words for good SEO length
- Use bullet points and numbered lists for readability
- Include a compelling meta description as the excerpt (150-160 chars) that INCLUDES "AI Prompt"
- End with a call-to-action encouraging readers to try AI prompts on AIPromptGen.com
- Incorporate trending tags from today's news naturally into the content

CREATIVE STYLE:
- Open with a hook that grabs attention (question, bold statement, or surprising fact)
- Use storytelling elements to make the news relatable
- Include "Try This AI Prompt" boxes with copy-paste ready prompts
- Add expert analysis on how each news item impacts AI prompt users
- Create a unique angle that connects multiple news stories together

CONTENT FORMAT:
Write the blog in Markdown format. Structure it as:
1. Creative hook / engaging introduction connecting the day's AI news to AI prompts
2. News breakdown sections with keyword-rich headings (reference specific news stories)
3. "AI Prompt of the Day" section with 3-5 practical prompt examples inspired by the news
4. How today's AI developments affect prompt engineering
5. Creative conclusion with CTA to AIPromptGen.com

OUTPUT FORMAT (respond in valid JSON only):
{
  "title": "SEO-optimized title that includes 'AI Prompt' (50-60 chars ideal)",
  "excerpt": "Meta description with 'AI Prompt' keyword (150-160 chars)",
  "content": "Full creative markdown blog content",
  "tags": ["AI Prompt", "tag2", "tag3", "tag4", "tag5"]
}`;

  const userPrompt = `Write a CREATIVE blog post for today (${today}) based on these HIGH-RELEVANCE AI news stories from today:

${newsSummary}
${trendingTagsStr}
FOCUS KEYWORDS (must include all naturally): ${focusKeywords.join(', ')}
PRIMARY KEYWORD: AI Prompt
CATEGORY: ${category}

Transform these news items into a creative, engaging, SEO-optimized blog post that:
1. Opens with a creative hook that connects today's top AI news to AI prompts
2. Discusses each major news story and what it means for AI prompt users
3. Includes a dedicated "AI Prompt of the Day" section with 3-5 PRACTICAL AI prompt examples inspired by today's news that readers can copy and use
4. Incorporates trending tags (${newsTags.join(', ')}) naturally into the content
5. Connects everything back to AI prompts and prompt engineering
6. Mentions our AI Prompt Generator tool naturally
7. Is optimized to rank for "AI Prompt" as the primary keyword

Remember: The main keyword is "AI Prompt" — it MUST appear in the title and throughout. Output ONLY valid JSON with title, excerpt, content, and tags fields.`;

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

  // Step 1: Fetch existing titles from DB to avoid duplicate posts
  let existingTitles: Set<string> = new Set();
  try {
    const recent = await import('@/lib/prisma').then(m => m.getBlogPosts({ limit: 30 }));
    for (const p of recent) {
      existingTitles.add(p.title.toLowerCase().trim());
    }
    console.log(`[BlogGenerator] Loaded ${existingTitles.size} existing titles for deduplication`);
  } catch (_) {
    // Non-fatal — proceed without dedup
  }

  // Step 2: Fetch high-relevance news from the AI news page
  const news = await fetchLatestAINews(baseUrl);
  console.log(`[BlogGenerator] Fetched ${news.length} news articles (filtered for high relevance)`);

  // Step 2: Extract trending tags from the news for keyword enrichment
  const newsTags = extractNewsTags(news);
  console.log(`[BlogGenerator] Extracted trending tags: ${newsTags.join(', ')}`);

  if (news.length === 0) {
    console.log('[BlogGenerator] No news available, generating topic-based content with fallback topics');
  }

  // Fallback AI topics for when news is unavailable (all centered around AI Prompt)
  const FALLBACK_TOPICS: NewsArticle[] = [
    { title: 'How AI Prompt Engineering Is Evolving in 2026', description: 'New techniques in prompt engineering are making AI outputs more accurate, creative, and useful than ever before. Learn the latest strategies for writing effective prompts.', source: 'AI Prompt Gen', url: '', publishedAt: new Date().toISOString(), aiRelevance: 'high' },
    { title: 'Best Practices for ChatGPT Prompts in 2026', description: 'Discover proven methods for crafting ChatGPT prompts that deliver consistent, high-quality results for writing, coding, analysis, and creative tasks.', source: 'AI Prompt Gen', url: '', publishedAt: new Date().toISOString(), aiRelevance: 'high' },
    { title: 'AI Image Generation: Midjourney, DALL-E and Sora Prompt Tips', description: 'Master the art of writing image and video generation prompts with expert techniques for Midjourney, DALL-E 3, and Sora that produce stunning visuals.', source: 'AI Prompt Gen', url: '', publishedAt: new Date().toISOString(), aiRelevance: 'high' },
    { title: 'The Rise of Free AI Prompt Generators and Tools', description: 'Free AI prompt tools are democratizing access to advanced prompt engineering, helping beginners and experts create better prompts faster.', source: 'AI Prompt Gen', url: '', publishedAt: new Date().toISOString(), aiRelevance: 'high' },
    { title: 'Advanced Prompt Engineering Techniques: Chain-of-Thought, Few-Shot, and More', description: 'Go beyond basic prompting with advanced techniques like chain-of-thought reasoning, few-shot learning, role-playing, and structured output formatting.', source: 'AI Prompt Gen', url: '', publishedAt: new Date().toISOString(), aiRelevance: 'high' },
    { title: 'AI Coding Assistants: How to Write Better Prompts for Code Generation', description: 'Learn how to prompt AI coding tools like GitHub Copilot, Claude, and ChatGPT to generate accurate, production-ready code.', source: 'AI Prompt Gen', url: '', publishedAt: new Date().toISOString(), aiRelevance: 'high' },
    { title: 'AI Video Generation with Sora: Complete Prompting Guide', description: 'OpenAI Sora is revolutionizing AI video creation. Learn expert prompt techniques for generating cinematic, realistic videos from text prompts.', source: 'AI Prompt Gen', url: '', publishedAt: new Date().toISOString(), aiRelevance: 'high' },
    { title: 'How to Use AI Prompts for Business and Marketing', description: 'AI prompts can transform business workflows. Discover prompt templates for marketing content, email campaigns, social media, and customer engagement.', source: 'AI Prompt Gen', url: '', publishedAt: new Date().toISOString(), aiRelevance: 'high' },
    { title: 'Claude, Gemini, and DeepSeek: Comparing AI Models for Prompt Results', description: 'Different AI models respond differently to prompts. Learn which models excel at different tasks and how to optimize your prompts for each.', source: 'AI Prompt Gen', url: '', publishedAt: new Date().toISOString(), aiRelevance: 'high' },
    { title: 'AI Prompt Templates: Ready-to-Use Prompts for Every Task', description: 'A comprehensive collection of AI prompt templates for writing, coding, images, analysis, brainstorming, and more — ready to use and customize.', source: 'AI Prompt Gen', url: '', publishedAt: new Date().toISOString(), aiRelevance: 'high' },
  ];

  // Use fetched high-relevance news, or pick random fallback topics
  const topicsToUse = news.length > 0
    ? news
    : FALLBACK_TOPICS.sort(() => Math.random() - 0.5).slice(0, 5);

  for (let i = 0; i < count; i++) {
    try {
      // Shuffle topics for variety if generating multiple posts
      const shuffledNews = [...topicsToUse].sort(() => Math.random() - 0.5);

      // Pick keywords enriched with trending news tags — "AI Prompt" always first
      const focusKeywords = options?.focusKeywords || pickSEOKeywords(5, newsTags);
      const category = options?.category || pickCategory();

      console.log(`[BlogGenerator] Generating post ${i + 1}/${count} with keywords: ${focusKeywords.join(', ')}`);
      console.log(`[BlogGenerator] Using ${shuffledNews.length} news articles, trending tags: ${newsTags.slice(0, 5).join(', ')}`);

      // Step 3: Generate creative blog content from high-relevance news
      const blog = await generateBlogFromNews(shuffledNews, {
        focusKeywords,
        category,
        newsTags,
      });

      // Ensure "AI Prompt" tag is always present
      if (!blog.tags.some(t => t.toLowerCase() === 'ai prompt')) {
        blog.tags.unshift('AI Prompt');
      }

      // Skip if a post with the same title was already saved recently
      if (existingTitles.has(blog.title.toLowerCase().trim())) {
        console.log(`[BlogGenerator] Skipping duplicate title: "${blog.title}"`);
        continue;
      }
      existingTitles.add(blog.title.toLowerCase().trim());

      // Step 4: Save to database — auto-generated posts are never featured
      // (featured flag is reserved for manually curated / static posts)
      const savedPost = await createBlogPost({
        title: blog.title,
        excerpt: blog.excerpt,
        content: blog.content,
        author: 'AI Prompt Gen Team',
        category: blog.category,
        tags: blog.tags,
        featured: false,
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
