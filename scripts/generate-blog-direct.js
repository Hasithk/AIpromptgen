/**
 * Direct blog generation script for GitHub Actions
 * Runs blog generation without HTTP overhead
 */
const { PrismaClient } = require('@prisma/client');

// Initialize Prisma
const prisma = new PrismaClient();

const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions';

async function generateBlogContent(newsTitle, newsDescription) {
  try {
    const response = await fetch(DEEPSEEK_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          {
            role: 'system',
            content: 'You are an expert AI and technology blogger. Create engaging, SEO-optimized blog posts about AI prompts and AI tools.',
          },
          {
            role: 'user',
            content: `Create a blog post about this AI news: "${newsTitle}". Description: ${newsDescription}. Include the keyword "AI Prompt" naturally in the content. Format: {title, excerpt, content}`,
          },
        ],
        temperature: 0.7,
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      throw new Error(`DeepSeek API error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices[0].message.content;
    
    try {
      return JSON.parse(content);
    } catch {
      // If JSON parsing fails, extract basic info
      return {
        title: newsTitle,
        excerpt: newsDescription.substring(0, 200),
        content: content,
      };
    }
  } catch (error) {
    console.error('[BlogGenerator] Failed to generate content:', error);
    return null;
  }
}

async function fetchLatestAINews() {
  try {
    const response = await fetch(
      `https://newsapi.org/v2/everything?q=AI+OR+ChatGPT+OR+GPT&sortBy=publishedAt&language=en&pageSize=10`,
      {
        headers: {
          'X-API-Key': process.env.NEWS_API_KEY,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`NewsAPI error: ${response.status}`);
    }

    const data = await response.json();
    return (data.articles || []).slice(0, 5);
  } catch (error) {
    console.error('[BlogGenerator] Failed to fetch news:', error);
    return [];
  }
}

async function generateAndSaveBlogPosts(count = 2) {
  const posts = [];
  const errors = [];

  try {
    console.log(`[BLOG-GEN] Fetching latest AI news...`);
    const newsArticles = await fetchLatestAINews();

    if (newsArticles.length === 0) {
      console.warn('[BLOG-GEN] No news articles found');
      return { success: false, posts: [], errors: ['No AI news available'] };
    }

    for (let i = 0; i < Math.min(count, newsArticles.length); i++) {
      const article = newsArticles[i];
      
      try {
        console.log(`[BLOG-GEN] Generating blog post ${i + 1}/${count}...`);
        
        const content = await generateBlogContent(article.title, article.description);
        if (!content) {
          errors.push(`Failed to generate content for: ${article.title}`);
          continue;
        }

        const safeExcerpt = (
          content.excerpt ||
          article.description ||
          `Latest AI update: ${article.title}`
        ).slice(0, 200);

        const tags = ['AI', 'News', 'ChatGPT', 'AI Prompt'].join(', ');

        const post = await prisma.blogPost.create({
          data: {
            title: content.title || article.title,
            excerpt: safeExcerpt,
            content: content.content || article.description,
            category: 'AI News',
            tags,
            author: 'AI News Generator',
          },
        });

        posts.push(post);
        console.log(`✅ Created: ${post.title}`);
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : String(error);
        errors.push(`Post ${i + 1}: ${errorMsg}`);
        console.error(`❌ Error generating post ${i + 1}:`, errorMsg);
      }
    }

    return {
      success: posts.length > 0,
      posts,
      errors,
    };
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.error('[BLOG-GEN] Generation failed:', errorMsg);
    return {
      success: false,
      posts: [],
      errors: [errorMsg],
    };
  } finally {
    await prisma.$disconnect();
  }
}

// Main execution
const count = parseInt(process.argv[2] || '2', 10);
console.log(`[BLOG-GEN] Starting daily blog generation (${count} posts)...`);

generateAndSaveBlogPosts(count)
  .then((result) => {
    console.log('\n[BLOG-GEN] Generation complete');
    console.log(`Posts created: ${result.posts.length}`);
    if (result.errors.length > 0) {
      console.log(`Errors: ${result.errors.length}`);
      result.errors.forEach(e => console.log(`  - ${e}`));
    }
    process.exit(result.success ? 0 : 1);
  })
  .catch((error) => {
    console.error('[BLOG-GEN] Fatal error:', error);
    process.exit(1);
  });
