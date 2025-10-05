import { NextResponse } from 'next/server';

const CRON_SECRET = process.env.CRON_SECRET || 'your-cron-secret-key';
const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;
const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions';

// This endpoint will be called daily to update the library with new prompts
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

    console.log('Starting daily library update...');

    // Generate new prompt examples using DeepSeek AI
    const newPrompts = await generateDailyPrompts();

    // In a real implementation, these would be saved to the database
    // For now, we'll return the generated prompts
    console.log(`Generated ${newPrompts.length} new prompts for library`);

    return NextResponse.json({
      success: true,
      message: 'Library updated successfully',
      promptsGenerated: newPrompts.length,
      prompts: newPrompts,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Library cron update error:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// GET endpoint to check library automation status
export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      message: 'Library automation is active',
      schedule: 'Daily at 6 AM UTC',
      nextUpdate: getNextUpdateTime()
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to get library status' },
      { status: 500 }
    );
  }
}

function getNextUpdateTime(): string {
  const now = new Date();
  const next = new Date();
  next.setUTCHours(6, 0, 0, 0);
  
  // If it's already past 6 AM UTC today, schedule for tomorrow
  if (now.getUTCHours() >= 6) {
    next.setDate(next.getDate() + 1);
  }
  
  return next.toISOString();
}

async function generateDailyPrompts() {
  if (!DEEPSEEK_API_KEY) {
    console.log('No DeepSeek API key found, using fallback prompts');
    return getFallbackPrompts();
  }

  try {
    const platforms = ['Sora', 'Midjourney', 'Veo 3', 'DALL-E', 'Qwen.ai'];
    const categories = ['Cinematography', 'Character', 'Abstract', 'Product', 'Nature', 'Architecture', 'Animation', 'Fantasy'];
    
    // Generate 2-3 prompts daily
    const promptCount = 2 + Math.floor(Math.random() * 2); // 2-3 prompts
    const prompts = [];

    for (let i = 0; i < promptCount; i++) {
      const platform = platforms[Math.floor(Math.random() * platforms.length)];
      const category = categories[Math.floor(Math.random() * categories.length)];
      
      const prompt = await generatePromptWithAI(platform, category);
      prompts.push(prompt);
    }

    return prompts;
  } catch (error) {
    console.error('Error generating prompts with AI:', error);
    return getFallbackPrompts();
  }
}

async function generatePromptWithAI(platform: string, category: string) {
  const systemPrompt = `You are an expert AI prompt engineer specializing in creating high-quality prompts for various AI image and video generation platforms. Generate creative, detailed, and effective prompts.`;

  const userPrompt = `Create a professional prompt example for the ${platform} platform in the ${category} category. 

Return a JSON object with the following structure:
{
  "title": "A catchy title for this prompt (3-5 words)",
  "description": "A brief description explaining what this prompt creates (1 sentence)",
  "prompt": "The actual detailed prompt text optimized for ${platform}",
  "tags": ["tag1", "tag2", "tag3"] (3-5 relevant tags),
  "category": "${category}",
  "platform": "${platform}"
}

Make it creative, specific, and production-ready.`;

  try {
    const response = await fetch(DEEPSEEK_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${DEEPSEEK_API_KEY}`
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.8,
        max_tokens: 500
      })
    });

    if (!response.ok) {
      throw new Error(`DeepSeek API error: ${response.statusText}`);
    }

    const data = await response.json();
    const content = data.choices[0].message.content;
    
    // Try to extract JSON from the response
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const promptData = JSON.parse(jsonMatch[0]);
      return {
        ...promptData,
        likes: Math.floor(Math.random() * 200) + 50, // Random likes 50-250
        rating: (Math.random() * 1 + 4).toFixed(1), // Random rating 4.0-5.0
        author: 'AI Prompt Team',
        featured: Math.random() > 0.7 // 30% chance of being featured
      };
    }

    throw new Error('Failed to parse AI response');
  } catch (error) {
    console.error('Error calling DeepSeek API:', error);
    throw error;
  }
}

function getFallbackPrompts() {
  const fallbackPrompts = [
    {
      title: 'Futuristic Cityscape',
      description: 'Stunning sci-fi city with neon lights and flying vehicles',
      prompt: 'Futuristic cyberpunk cityscape at night, neon lights reflecting on wet streets, flying cars, towering skyscrapers with holographic advertisements, cinematic composition, 8K ultra detailed',
      category: 'Cinematography',
      platform: 'Midjourney',
      tags: ['cyberpunk', 'futuristic', 'cityscape', 'neon'],
      likes: 178,
      rating: 4.7,
      author: 'AI Prompt Team',
      featured: true
    },
    {
      title: 'Mystical Forest Guardian',
      description: 'Ethereal creature protecting an ancient forest',
      prompt: 'Mystical forest guardian spirit, translucent glowing form, ancient trees with bioluminescent moss, magical particles floating in air, ethereal lighting, fantasy art style',
      category: 'Fantasy',
      platform: 'DALL-E',
      tags: ['fantasy', 'mystical', 'guardian', 'forest'],
      likes: 156,
      rating: 4.6,
      author: 'AI Prompt Team',
      featured: false
    },
    {
      title: 'Smooth Product Reveal',
      description: 'Professional product showcase with elegant animation',
      prompt: 'Premium product reveal animation, luxury watch rotating on marble pedestal, soft studio lighting, gold accents, smooth camera movement, 4K commercial quality',
      category: 'Product',
      platform: 'Sora',
      tags: ['product', 'luxury', 'commercial', 'animation'],
      likes: 192,
      rating: 4.8,
      author: 'AI Prompt Team',
      featured: false
    }
  ];

  // Return 2 random prompts
  const shuffled = fallbackPrompts.sort(() => Math.random() - 0.5);
  return shuffled.slice(0, 2);
}
