import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;
const NEWS_API_KEY = process.env.NEWS_API_KEY;

// Immediate blog generation endpoint
export async function POST(req: Request) {
  try {
    console.log('Immediate blog generation triggered...');

    // Check if required API keys are available
    if (!DEEPSEEK_API_KEY) {
      return NextResponse.json({
        success: false,
        error: 'DeepSeek API key not configured',
        fallback: 'Creating fallback blog post...'
      });
    }

    let newsData = [];
    
    // Try to fetch AI news
    if (NEWS_API_KEY) {
      try {
        const newsResponse = await fetch(
          `https://newsapi.org/v2/everything?q=artificial+intelligence+OR+AI+OR+machine+learning+OR+ChatGPT+OR+OpenAI&language=en&sortBy=publishedAt&pageSize=5`,
          {
            headers: {
              'X-API-Key': NEWS_API_KEY,
            },
          }
        );

        if (newsResponse.ok) {
          const newsJson = await newsResponse.json();
          newsData = newsJson.articles || [];
          console.log(`Fetched ${newsData.length} news articles`);
        }
      } catch (error) {
        console.error('Error fetching news:', error);
      }
    }

    // Generate blog content using DeepSeek AI
    const blogContent = await generateBlogContent(newsData);

    // Save blog post to database
    try {
      if (process.env.DATABASE_URL) {
        const newPost = await prisma.blogPost.create({
          data: {
            title: blogContent.title,
            excerpt: blogContent.excerpt,
            content: blogContent.content,
            author: 'AI News Bot',
            category: 'AI News',
            tags: blogContent.tags,
            featured: true,
            readTime: blogContent.readTime,
            publishedAt: new Date()
          }
        });

        // Update blog automation tracking
        await prisma.blogAutomation.upsert({
          where: { id: 'blog_automation' },
          create: {
            id: 'blog_automation',
            lastGeneration: new Date(),
            nextGeneration: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days
            totalPosts: 1
          },
          update: {
            lastGeneration: new Date(),
            nextGeneration: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days
            totalPosts: { increment: 1 }
          }
        });

        console.log('Blog post created successfully:', newPost.id);

        return NextResponse.json({
          success: true,
          message: 'Blog post generated and scheduled for future automation',
          post: {
            id: newPost.id,
            title: newPost.title,
            excerpt: newPost.excerpt,
            publishedAt: newPost.publishedAt
          },
          nextGeneration: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
        });
      } else {
        throw new Error('Database not configured');
      }
    } catch (dbError) {
      console.error('Database error:', dbError);
      
      // Return success with content even if database fails
      return NextResponse.json({
        success: true,
        message: 'Blog content generated (database unavailable)',
        post: {
          title: blogContent.title,
          excerpt: blogContent.excerpt,
          content: blogContent.content.substring(0, 200) + '...'
        },
        nextGeneration: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        note: 'Content generated but not saved to database'
      });
    }

  } catch (error) {
    console.error('Blog generation error:', error);

    // Create fallback blog post
    const fallbackPost = createFallbackBlogPost();
    
    return NextResponse.json({
      success: true,
      message: 'Fallback blog post created',
      post: fallbackPost,
      nextGeneration: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

// Allow GET requests for testing
export async function GET() {
  return NextResponse.json({
    message: 'Blog generation endpoint ready',
    endpoint: 'POST /api/blog/generate-now',
    usage: 'Generates a blog post immediately and sets up 3-day automation'
  });
}

async function generateBlogContent(newsArticles: any[]) {
  const prompt = `Generate a comprehensive blog post about the latest AI developments. Use this recent AI news for context:

${newsArticles.map((article, index) => `
${index + 1}. ${article.title}
${article.description || ''}
`).join('\n')}

Create a blog post with:
1. An engaging title about AI trends and developments
2. A compelling excerpt (2-3 sentences)
3. Full article content (800-1200 words) covering:
   - Latest AI developments and trends
   - Impact on industries and society
   - Practical applications for users
   - Future predictions and insights
   - Tips for AI prompt engineering
4. Relevant tags (comma-separated)
5. Estimated read time

Format as JSON:
{
  "title": "...",
  "excerpt": "...",
  "content": "...",
  "tags": ["AI", "Technology", "Prompts"],
  "readTime": "8 min read"
}`;

  try {
    const response = await fetch('https://api.deepseek.com/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${DEEPSEEK_API_KEY}`
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          {
            role: 'system',
            content: 'You are an expert AI technology writer who creates engaging, informative blog posts about artificial intelligence, machine learning, and prompt engineering.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 2000,
        temperature: 0.7
      })
    });

    if (!response.ok) {
      throw new Error(`DeepSeek API error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content;

    if (!content) {
      throw new Error('No content generated from DeepSeek API');
    }

    // Try to parse JSON response
    try {
      const parsed = JSON.parse(content);
      return {
        title: parsed.title || 'Latest AI Developments and Trends',
        excerpt: parsed.excerpt || 'Explore the cutting-edge world of artificial intelligence and discover how AI is transforming industries worldwide.',
        content: parsed.content || generateFallbackContent(),
        tags: Array.isArray(parsed.tags) ? parsed.tags : ['AI', 'Technology', 'Innovation'],
        readTime: parsed.readTime || '8 min read'
      };
    } catch (parseError) {
      // If JSON parsing fails, create structured content from the raw text
      return {
        title: 'AI Revolution: Latest Developments and Trends',
        excerpt: 'Discover the latest breakthroughs in artificial intelligence and how they\'re shaping our future.',
        content: content,
        tags: ['AI', 'Technology', 'Innovation', 'Future'],
        readTime: '8 min read'
      };
    }

  } catch (error) {
    console.error('Error generating blog content:', error);
    throw error;
  }
}

function createFallbackBlogPost() {
  return {
    title: 'The Future of AI Prompt Engineering: Trends and Best Practices',
    excerpt: 'Explore the evolving landscape of AI prompt engineering and discover how to create more effective prompts for better AI interactions.',
    content: generateFallbackContent(),
    tags: ['AI', 'Prompts', 'Engineering', 'Best Practices'],
    readTime: '7 min read'
  };
}

function generateFallbackContent() {
  return `# The Future of AI Prompt Engineering: Trends and Best Practices

Artificial Intelligence has revolutionized how we interact with technology, and prompt engineering has emerged as a crucial skill in maximizing AI potential. As AI models become more sophisticated, understanding how to craft effective prompts becomes increasingly important.

## Understanding Prompt Engineering

Prompt engineering is the art and science of crafting inputs that guide AI models to produce desired outputs. It's not just about asking questions—it's about communicating effectively with AI systems to achieve specific goals.

### Key Principles of Effective Prompts

1. **Clarity and Specificity**: Clear, specific prompts yield better results than vague requests.
2. **Context Provision**: Giving AI models sufficient context helps them understand your needs better.
3. **Iterative Refinement**: The best prompts often emerge through testing and refinement.

## Current Trends in AI Development

The AI landscape is rapidly evolving with new developments in:

- **Large Language Models (LLMs)**: More capable and efficient models are being released regularly
- **Multimodal AI**: Systems that can process text, images, and audio simultaneously
- **AI Safety and Alignment**: Ensuring AI systems behave as intended
- **Democratization of AI**: Making AI tools accessible to non-technical users

## Best Practices for AI Prompt Creation

### 1. Structure Your Prompts
- Start with clear instructions
- Provide examples when possible
- Specify the desired output format

### 2. Use Context Effectively
- Include relevant background information
- Reference specific requirements or constraints
- Maintain consistency in your prompting style

### 3. Iterate and Improve
- Test different approaches
- Analyze what works and what doesn't
- Build a library of effective prompt templates

## Industry Applications

AI prompt engineering is transforming various industries:

- **Content Creation**: Writers use AI to generate ideas and overcome writer's block
- **Software Development**: Developers leverage AI for code generation and debugging
- **Marketing**: Marketers create personalized content at scale
- **Education**: Educators develop interactive learning experiences

## Future Predictions

Looking ahead, we can expect:

1. **More Intuitive Interfaces**: AI systems will become easier to interact with
2. **Specialized Models**: Industry-specific AI models will emerge
3. **Enhanced Collaboration**: Better human-AI collaboration tools
4. **Ethical AI Development**: Stronger focus on responsible AI deployment

## Tips for Success

To excel in AI prompt engineering:

- Stay updated with the latest AI developments
- Practice regularly with different AI models
- Join AI communities and share experiences
- Experiment with creative approaches
- Focus on solving real problems

## Conclusion

The future of AI prompt engineering is bright and full of possibilities. As AI systems become more integrated into our daily lives, the ability to communicate effectively with these systems will become an essential skill. By understanding the principles of good prompt engineering and staying current with AI developments, we can harness the full potential of artificial intelligence to solve complex problems and create innovative solutions.

Whether you're a content creator, developer, marketer, or simply curious about AI, investing time in learning prompt engineering will pay dividends in the AI-powered future that's rapidly approaching.`;
}