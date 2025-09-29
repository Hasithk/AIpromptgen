import { NextResponse } from 'next/server';
import { NewsItem } from '@/types';
import { 
  checkIfShouldGenerateBlog, 
  updateLastBlogGeneration, 
  getBlogAutomationStatus,
  createBlogPost 
} from '@/lib/prisma';

const CRON_SECRET = process.env.CRON_SECRET || 'your-cron-secret-key';
const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;
const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions';

// This endpoint will be called by external cron services (Vercel Cron, GitHub Actions, etc.)
export async function POST(req: Request) {
  try {
    // Security: Verify cron secret for external calls
    const authHeader = req.headers.get('authorization');
    if (authHeader && authHeader !== `Bearer ${CRON_SECRET}`) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    console.log('Starting automatic blog generation...');

    // Check if we should generate (every 3 days)
    const shouldGenerate = await checkIfShouldGenerateBlog();
    
    if (!shouldGenerate) {
      const status = await getBlogAutomationStatus();
      return NextResponse.json({
        success: true,
        message: 'Blog generation not due yet',
        nextGeneration: status.nextGeneration
      });
    }

    // Fetch latest AI news
    const newsResponse = await fetch(`${getBaseUrl()}/api/news/latest`);
    const newsData = await newsResponse.json();
    
    if (!newsData.success || !newsData.data?.length) {
      throw new Error('No news data available for blog generation');
    }

    // Generate blog post from news using DeepSeek API
    const blogContent = await generateBlogWithDeepSeek(newsData.data);
    const blogPostData = await createBlogPostFromContent(newsData.data, blogContent);
    
    // Save the blog post directly to database
    const savedBlogPost = await createBlogPost(blogPostData);

    // Update last generation timestamp
    await updateLastBlogGeneration();

    console.log('Blog post generated successfully:', savedBlogPost.title);

    const status = await getBlogAutomationStatus();
    
    return NextResponse.json({
      success: true,
      message: 'Blog post generated and saved successfully',
      post: {
        id: savedBlogPost.id,
        title: savedBlogPost.title,
        excerpt: blogPostData.excerpt,
        category: blogPostData.category,
        publishedAt: savedBlogPost.createdAt
      },
      nextGeneration: status.nextGeneration
    });

  } catch (error) {
    console.error('Cron blog generation error:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// GET endpoint to check cron status
export async function GET() {
  try {
    const status = await getBlogAutomationStatus();

    return NextResponse.json({
      success: true,
      ...status
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to get cron status' },
      { status: 500 }
    );
  }
}

// Helper functions
function getBaseUrl(): string {
  return process.env.NEXTAUTH_URL || 'http://localhost:3000';
}

// DeepSeek API integration function
async function generateBlogWithDeepSeek(newsItems: NewsItem[]): Promise<string> {
  if (!DEEPSEEK_API_KEY) {
    console.warn('DeepSeek API key not found, falling back to local generation');
    return generateLocalBlogContent(newsItems);
  }

  try {
    const currentDate = new Date().toLocaleDateString('en-US', { 
      month: 'long', 
      day: 'numeric', 
      year: 'numeric' 
    });

    const newsContext = newsItems.slice(0, 8).map((item, index) => 
      `${index + 1}. **${item.title}**
   Source: ${item.source}
   Category: ${item.category}
   Published: ${new Date(item.publishedAt).toLocaleDateString()}
   Description: ${item.description}
   URL: ${item.url}`
    ).join('\n\n');

    const prompt = `You are an expert AI news blogger. Create a comprehensive, engaging blog post about the latest AI developments.

**Date**: ${currentDate}

**Latest AI News**:
${newsContext}

**Requirements**:
1. Write a compelling blog post in markdown format
2. Focus on trending AI topics and breakthrough developments
3. Include SEO-optimized keywords naturally throughout the content
4. Structure with clear headings and subheadings
5. Make it informative and engaging for AI enthusiasts and professionals
6. Include analysis of market implications and future trends
7. Add a section about trending keywords
8. Keep the tone professional but accessible
9. Aim for 1500-2500 words
10. Include relevant links where appropriate

**Structure should include**:
- Compelling headline-style title (H1)
- Introduction summarizing key developments
- Main sections covering the most important news items
- Trending topics analysis
- Market impact and implications
- Future outlook
- Conclusion with key takeaways

Please generate a complete markdown blog post based on these news items, making it SEO-friendly and engaging for readers interested in AI developments.`;

    const response = await fetch(DEEPSEEK_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${DEEPSEEK_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          {
            role: 'system',
            content: 'You are an expert AI news blogger who creates engaging, SEO-optimized blog posts about artificial intelligence developments. You write in a professional yet accessible tone and always structure content with clear headings and valuable insights.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 4000,
        temperature: 0.7,
        stream: false
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`DeepSeek API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    
    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      throw new Error('Invalid response format from DeepSeek API');
    }

    const generatedContent = data.choices[0].message.content;
    
    // Add footer to indicate AI generation
    const finalContent = `${generatedContent}

---

*This blog post was automatically generated using AI analysis of the latest news sources and is updated regularly to reflect current developments in artificial intelligence.*`;

    console.log('Successfully generated blog content using DeepSeek API');
    return finalContent;

  } catch (error) {
    console.error('DeepSeek API error:', error);
    console.log('Falling back to local content generation');
    return generateLocalBlogContent(newsItems);
  }
}

// Create blog post metadata from DeepSeek content
async function createBlogPostFromContent(newsItems: NewsItem[], content: string): Promise<any> {
  // Extract title from the content (first H1)
  const titleMatch = content.match(/^#\s+(.+)$/m);
  const title = titleMatch ? titleMatch[1] : generateTrendingTitle(newsItems, extractTrendingTopics(newsItems));

  // Generate excerpt from the first paragraph after the title
  const contentAfterTitle = content.replace(/^#\s+.+$/m, '').trim();
  const firstParagraph = contentAfterTitle.split('\n\n')[0];
  const excerpt = firstParagraph ? 
    firstParagraph.replace(/[#*_`]/g, '').substring(0, 200) + '...' :
    generateTrendingExcerpt(newsItems, extractTrendingTopics(newsItems));

  // Extract trending topics and generate keywords
  const trendingTopics = extractTrendingTopics(newsItems);
  const seoKeywords = generateSEOKeywords(newsItems, trendingTopics);

  return {
    title,
    excerpt,
    content,
    author: 'AI News Bot',
    category: 'Trending AI News',
    tags: seoKeywords.slice(0, 6),
    featured: true
  };
}

// Fallback function for local content generation (when DeepSeek API is unavailable)
function generateLocalBlogContent(newsItems: NewsItem[]): string {
  const trendingTopics = extractTrendingTopics(newsItems);
  const seoKeywords = generateSEOKeywords(newsItems, trendingTopics);
  return generateTrendingContent(newsItems, trendingTopics, seoKeywords);
}

async function generateBlogFromTrendingNews(newsItems: NewsItem[]): Promise<any> {
  // Get the most recent and relevant news items
  const topNews = newsItems.slice(0, 5);
  
  // Extract trending topics from today's news
  const trendingTopics = extractTrendingTopics(topNews);
  const seoKeywords = generateSEOKeywords(topNews, trendingTopics);
  
  // Create blog post content based on trending news
  const title = generateTrendingTitle(topNews, trendingTopics);
  const excerpt = generateTrendingExcerpt(topNews, trendingTopics);
  const content = generateTrendingContent(topNews, trendingTopics, seoKeywords);
  
  return {
    title,
    excerpt,
    content,
    author: 'AI News Bot',
    category: 'Trending AI News',
    tags: seoKeywords.slice(0, 6),
    featured: true
  };
}

function extractTrendingTopics(newsItems: NewsItem[]): string[] {
  const topics = new Set<string>();
  const today = new Date().toDateString();
  
  // Focus on today's news
  const todaysNews = newsItems.filter(item => 
    new Date(item.publishedAt).toDateString() === today
  );
  
  // If no today's news, use recent news
  const relevantNews = todaysNews.length > 0 ? todaysNews : newsItems.slice(0, 3);
  
  relevantNews.forEach(item => {
    // Extract key topics from titles and descriptions
    const text = `${item.title} ${item.description}`.toLowerCase();
    
    // Look for trending AI topics
    const trendingTerms = [
      'breakthrough', 'launch', 'release', 'announce', 'unveil', 'debut',
      'partnership', 'acquisition', 'funding', 'investment',
      'gpt', 'sora', 'veo', 'midjourney', 'claude', 'gemini',
      'video ai', 'image ai', 'text ai', 'voice ai',
      'automation', 'robotics', 'self-driving', 'autonomous'
    ];
    
    trendingTerms.forEach(term => {
      if (text.includes(term)) {
        topics.add(term);
      }
    });
    
    // Add the main category
    topics.add(item.category.toLowerCase());
  });
  
  return Array.from(topics).slice(0, 8);
}

function generateSEOKeywords(newsItems: NewsItem[], trendingTopics: string[]): string[] {
  const keywords = new Set<string>();
  const currentDate = new Date();
  const month = currentDate.toLocaleDateString('en-US', { month: 'long' });
  const year = currentDate.getFullYear();
  
  // Add trending topics
  trendingTopics.forEach(topic => keywords.add(topic));
  
  // Add time-based SEO keywords
  keywords.add(`ai news ${month.toLowerCase()} ${year}`);
  keywords.add(`artificial intelligence trends ${year}`);
  keywords.add(`latest ai developments`);
  keywords.add(`ai breakthrough news`);
  keywords.add(`machine learning updates`);
  
  // Add category-specific keywords
  newsItems.forEach(item => {
    const category = item.category.toLowerCase().replace(/\s+/g, '-');
    keywords.add(category);
    keywords.add(`${category} news`);
  });
  
  return Array.from(keywords).slice(0, 12);
}

function generateTrendingTitle(newsItems: NewsItem[], trendingTopics: string[]): string {
  const currentDate = new Date();
  const month = currentDate.toLocaleDateString('en-US', { month: 'long' });
  const day = currentDate.getDate();
  const year = currentDate.getFullYear();
  
  const mainTopic = trendingTopics[0] || 'AI';
  const secondTopic = trendingTopics[1] || 'Technology';
  
  const titleTemplates = [
    `Breaking: Latest ${mainTopic.charAt(0).toUpperCase() + mainTopic.slice(1)} Developments - ${month} ${day}, ${year}`,
    `Today's AI Headlines: ${mainTopic.charAt(0).toUpperCase() + mainTopic.slice(1)} and ${secondTopic.charAt(0).toUpperCase() + secondTopic.slice(1)} Updates`,
    `${month} ${year} AI Roundup: ${mainTopic.charAt(0).toUpperCase() + mainTopic.slice(1)} Trends You Need to Know`,
    `Trending Now: ${mainTopic.charAt(0).toUpperCase() + mainTopic.slice(1)} News and ${secondTopic.charAt(0).toUpperCase() + secondTopic.slice(1)} Breakthroughs`
  ];
  
  return titleTemplates[Math.floor(Math.random() * titleTemplates.length)];
}

function generateTrendingExcerpt(newsItems: NewsItem[], trendingTopics: string[]): string {
  const topicsList = trendingTopics.slice(0, 3).join(', ');
  const currentDate = new Date().toLocaleDateString('en-US', { 
    month: 'long', 
    day: 'numeric', 
    year: 'numeric' 
  });
  
  return `Stay updated with the latest AI developments from ${currentDate}. Today's trending topics include ${topicsList} and other breakthrough technologies shaping the future of artificial intelligence.`;
}

function generateTrendingContent(newsItems: NewsItem[], trendingTopics: string[], keywords: string[]): string {
  const currentDate = new Date().toLocaleDateString('en-US', { 
    month: 'long', 
    day: 'numeric', 
    year: 'numeric' 
  });

  let content = `# Today's AI News Roundup - ${currentDate}\n\n`;
  content += `The artificial intelligence landscape continues to evolve rapidly. Here are today's most significant developments in AI technology, featuring ${trendingTopics.slice(0, 3).join(', ')} and other emerging trends.\n\n`;

  // Add trending topics section
  content += `## 🔥 Trending Today\n\n`;
  content += `The AI community is buzzing about:\n\n`;
  trendingTopics.slice(0, 5).forEach((topic, index) => {
    content += `${index + 1}. **${topic.charAt(0).toUpperCase() + topic.slice(1)}**\n`;
  });
  content += '\n';

  // Add news sections based on actual news items
  content += `## 📰 Latest Developments\n\n`;
  newsItems.slice(0, 4).forEach((item, index) => {
    content += `### ${index + 1}. ${item.title}\n\n`;
    content += `${item.description}\n\n`;
    content += `**Source**: ${item.source} | **Category**: ${item.category}\n`;
    content += `**Published**: ${new Date(item.publishedAt).toLocaleDateString()}\n\n`;
    if (item.url !== '#') {
      content += `[Read Full Article](${item.url})\n\n`;
    }
  });

  // Add trending keywords section
  content += `## 🔍 Trending Keywords\n\n`;
  content += `These AI-related terms are trending in today's news and search queries:\n\n`;
  keywords.slice(0, 8).forEach((keyword, index) => {
    content += `- **${keyword.charAt(0).toUpperCase() + keyword.slice(1)}**\n`;
  });
  content += '\n';

  // Add market implications
  content += `## 📊 Market Impact\n\n`;
  content += `Today's developments highlight key trends affecting the AI market:\n\n`;
  content += `- **Innovation Acceleration**: Companies are pushing boundaries with new AI capabilities\n`;
  content += `- **Competitive Landscape**: Major players are racing to dominate emerging AI sectors\n`;
  content += `- **Industry Adoption**: Businesses across sectors are integrating AI solutions\n`;
  content += `- **Regulatory Focus**: Governments worldwide are developing AI governance frameworks\n\n`;

  // Add what to watch
  content += `## 👀 What to Watch\n\n`;
  content += `Keep an eye on these developing stories:\n\n`;
  content += `- Upcoming AI model releases and updates\n`;
  content += `- New partnerships and collaborations\n`;
  content += `- Regulatory announcements and policy changes\n`;
  content += `- Breakthrough research publications\n\n`;

  content += `## 🚀 Stay Connected\n\n`;
  content += `For real-time AI news and updates:\n`;
  content += `- Visit our [AI News Hub](/news) for the latest developments\n`;
  content += `- Explore our [Prompt Library](/library) for practical AI tools\n`;
  content += `- Follow trending AI topics and industry insights\n\n`;
  
  content += `---\n\n`;
  content += `*This blog post was automatically generated from trending AI news sources and is updated regularly to reflect the latest developments in artificial intelligence.*`;

  return content;
}
