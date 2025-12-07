import { NextResponse } from 'next/server';
import { saveBulkPrompts, getAllLibraryPrompts } from '@/lib/library-storage';

const CRON_SECRET = process.env.CRON_SECRET || 'your-secure-cron-secret-key';
const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;

export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get('authorization');
    if (authHeader && authHeader !== `Bearer ${CRON_SECRET}`) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    console.log('[Library Automation] Starting daily prompt generation...');

    if (!DEEPSEEK_API_KEY) {
      console.log('[Library Automation] Using fallback prompts - no API key');
      const fallbackPrompts = getFallbackPrompts();
      await saveBulkPrompts(fallbackPrompts);
      return NextResponse.json({
        success: true,
        message: 'Library updated with fallback prompts',
        promptsGenerated: fallbackPrompts.length
      });
    }

    // Generate 10 world-class trending prompts
    const newPrompts = await generateWorldClassPrompts();
    
    // Save to storage
    const saved = await saveBulkPrompts(newPrompts);

    console.log(`[Library Automation] Generated ${saved.length} new prompts`);

    return NextResponse.json({
      success: true,
      message: 'Library updated successfully',
      promptsGenerated: saved.length,
      prompts: saved.map(p => ({ id: p.id, title: p.title, platform: p.platform }))
    });

  } catch (error) {
    console.error('[Library Automation] Error:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const prompts = await getAllLibraryPrompts();
    return NextResponse.json({
      success: true,
      totalPrompts: prompts.length,
      schedule: 'Daily at 6 AM UTC (10 new prompts)',
      nextUpdate: getNextUpdateTime()
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to get status' }, { status: 500 });
  }
}

function getNextUpdateTime(): string {
  const now = new Date();
  const next = new Date();
  next.setUTCHours(6, 0, 0, 0);
  if (now.getUTCHours() >= 6) {
    next.setDate(next.getDate() + 1);
  }
  return next.toISOString();
}

async function generateWorldClassPrompts() {
  const platforms = ['Sora', 'Midjourney', 'Veo 3', 'DALL-E', 'Qwen.ai'];
  const categories = [
    'Cinematography', 'Character Design', 'Fantasy', 'Sci-Fi', 
    'Architecture', 'Nature', 'Abstract', 'Product', 'Fashion', 'Animation'
  ];

  const prompts = [];

  // Generate 10 diverse, world-class prompts
  for (let i = 0; i < 10; i++) {
    const platform = platforms[i % platforms.length];
    const category = categories[i % categories.length];
    
    try {
      const prompt = await generateSinglePrompt(platform, category, i);
      prompts.push(prompt);
      // Small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 500));
    } catch (error) {
      console.error(`Failed to generate prompt ${i + 1}:`, error);
    }
  }

  return prompts.length > 0 ? prompts : getFallbackPrompts();
}

async function generateSinglePrompt(platform: string, category: string, index: number) {
  const trendingThemes = [
    'hyperrealistic', 'award-winning', 'viral', 'trending', 'masterpiece',
    'cinematic', 'epic', 'stunning', 'breathtaking', 'professional'
  ];

  const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
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
          content: `You are a world-class AI prompt engineer who creates award-winning, viral prompts for top AI platforms. Your prompts regularly trend on social media and win competitions. You understand composition, lighting, style, and technical parameters for each platform.`
        },
        {
          role: 'user',
          content: `Create a WORLD-CLASS, trending prompt for ${platform} in the ${category} category.

This prompt should be:
- Professional quality that could win competitions
- Highly detailed and specific
- Include advanced technical parameters
- Use trending visual styles and aesthetics
- Be memorable and shareable
- Optimized specifically for ${platform}

Return ONLY a JSON object:
{
  "title": "Catchy 3-6 word title",
  "description": "One compelling sentence about what this creates",
  "prompt": "The complete, detailed prompt optimized for ${platform}",
  "tags": ["tag1", "tag2", "tag3", "tag4", "tag5"]
}

Make it AMAZING - something people will want to copy and use immediately.`
        }
      ],
      temperature: 0.9,
      max_tokens: 800
    })
  });

  if (!response.ok) {
    throw new Error(`DeepSeek API error: ${response.statusText}`);
  }

  const data = await response.json();
  const content = data.choices[0].message.content;
  
  const jsonMatch = content.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error('Invalid response format');
  
  const promptData = JSON.parse(jsonMatch[0]);
  
  return {
    id: `prompt-${Date.now()}-${index}`,
    title: promptData.title,
    description: promptData.description,
    prompt: promptData.prompt,
    category,
    platform,
    tags: promptData.tags || [],
    likes: Math.floor(Math.random() * 500) + 100,
    rating: parseFloat((Math.random() * 0.5 + 4.5).toFixed(1)),
    author: 'AI Prompt Masters',
    featured: index < 3,
    trending: true
  };
}

function getFallbackPrompts() {
  return [
    {
      id: `prompt-${Date.now()}-1`,
      title: 'Epic Fantasy Dragon Flight',
      description: 'Majestic dragon soaring over mystical mountains at sunset',
      prompt: 'Cinematic shot of a massive dragon with iridescent scales flying over snow-capped mountains at golden hour, volumetric lighting, rays of sunlight breaking through clouds, epic fantasy atmosphere, 8K, ultra detailed, Unreal Engine quality --ar 16:9 --v 6',
      category: 'Fantasy',
      platform: 'Midjourney',
      tags: ['dragon', 'fantasy', 'cinematic', 'epic', 'trending'],
      likes: 892,
      rating: 4.9,
      author: 'AI Prompt Masters',
      featured: true,
      trending: true
    },
    {
      id: `prompt-${Date.now()}-2`,
      title: 'Hyperrealistic Product Photography',
      description: 'Luxury watch with dramatic lighting and reflections',
      prompt: 'Professional product photography of a luxury swiss watch on black marble surface, dramatic side lighting, water droplets, perfect reflections, studio quality, shallow depth of field, commercial photography, 8K resolution, Phase One camera quality',
      category: 'Product',
      platform: 'DALL-E',
      tags: ['product', 'luxury', 'photography', 'commercial', 'hyperrealistic'],
      likes: 756,
      rating: 4.8,
      author: 'AI Prompt Masters',
      featured: true,
      trending: true
    },
    {
      id: `prompt-${Date.now()}-3`,
      title: 'Futuristic Cyberpunk City',
      description: 'Neon-lit metropolis with flying vehicles and holographic ads',
      prompt: 'Aerial view of a massive cyberpunk city at night, neon signs in Japanese and English, flying cars with light trails, holographic advertisements, rain-slicked streets reflecting neon lights, blade runner atmosphere, volumetric fog, cinematic composition, 8K, hyperdetailed',
      category: 'Sci-Fi',
      platform: 'Sora',
      tags: ['cyberpunk', 'city', 'futuristic', 'neon', 'cinematic'],
      likes: 1024,
      rating: 4.9,
      author: 'AI Prompt Masters',
      featured: true,
      trending: true
    },
    {
      id: `prompt-${Date.now()}-4`,
      title: 'Ethereal Forest Spirit',
      description: 'Mystical creature made of light and nature',
      prompt: 'Bioluminescent forest spirit creature, translucent body made of flowing light particles, surrounded by glowing fireflies, ancient forest setting, magical atmosphere, soft volumetric lighting, fantasy art, highly detailed, ethereal beauty, trending on ArtStation',
      category: 'Fantasy',
      platform: 'Midjourney',
      tags: ['fantasy', 'spirit', 'magical', 'bioluminescent', 'ethereal'],
      likes: 645,
      rating: 4.7,
      author: 'AI Prompt Masters',
      featured: false,
      trending: true
    },
    {
      id: `prompt-${Date.now()}-5`,
      title: 'Minimalist Modern Architecture',
      description: 'Clean geometric building with dramatic shadows',
      prompt: 'Minimalist white concrete building with geometric shapes, dramatic shadows at sunset, palm tree in foreground, brutalist architecture, clean lines, architectural photography, natural lighting, high contrast, professional photography, 8K --ar 4:5',
      category: 'Architecture',
      platform: 'Qwen.ai',
      tags: ['architecture', 'minimalist', 'modern', 'geometric', 'brutalist'],
      likes: 523,
      rating: 4.6,
      author: 'AI Prompt Masters',
      featured: false,
      trending: true
    },
    {
      id: `prompt-${Date.now()}-6`,
      title: 'Anime Character Portrait',
      description: 'Stunning anime girl with detailed eyes and hair',
      prompt: 'Beautiful anime girl portrait, long flowing silver hair, glowing blue eyes, detailed face, soft lighting, cherry blossoms in background, Studio Ghibli style, makoto shinkai, high quality anime art, trending on pixiv, 4K --niji 5',
      category: 'Character Design',
      platform: 'Midjourney',
      tags: ['anime', 'portrait', 'character', 'beautiful', 'trending'],
      likes: 987,
      rating: 4.8,
      author: 'AI Prompt Masters',
      featured: false,
      trending: true
    },
    {
      id: `prompt-${Date.now()}-7`,
      title: 'Wildlife Documentary Scene',
      description: 'Powerful predator in natural habitat, National Geographic style',
      prompt: 'Close-up of a majestic tiger walking through misty jungle at dawn, dramatic lighting, shallow depth of field, National Geographic quality, wildlife documentary cinematography, 8K, RED camera, cinematic color grading, professional wildlife photography',
      category: 'Nature',
      platform: 'Sora',
      tags: ['wildlife', 'documentary', 'nature', 'cinematic', 'professional'],
      likes: 734,
      rating: 4.7,
      author: 'AI Prompt Masters',
      featured: false,
      trending: true
    },
    {
      id: `prompt-${Date.now()}-8`,
      title: 'Fashion Editorial Haute Couture',
      description: 'High fashion model in avant-garde designer outfit',
      prompt: 'High fashion editorial, model wearing avant-garde haute couture dress made of metallic fabric and crystals, dramatic pose, studio lighting, white background, Vogue magazine quality, shot by Annie Leibovitz, professional fashion photography, 8K, medium format camera',
      category: 'Fashion',
      platform: 'DALL-E',
      tags: ['fashion', 'editorial', 'haute couture', 'luxury', 'professional'],
      likes: 612,
      rating: 4.6,
      author: 'AI Prompt Masters',
      featured: false,
      trending: true
    },
    {
      id: `prompt-${Date.now()}-9`,
      title: '3D Abstract Art Installation',
      description: 'Colorful geometric shapes floating in space',
      prompt: 'Abstract 3D art installation, floating geometric shapes in vibrant colors, glass and chrome materials, studio lighting with colored gels, reflective surfaces, modern art gallery, octane render, photorealistic, 8K, trending on Behance',
      category: 'Abstract',
      platform: 'Veo 3',
      tags: ['abstract', '3d', 'geometric', 'colorful', 'modern art'],
      likes: 445,
      rating: 4.5,
      author: 'AI Prompt Masters',
      featured: false,
      trending: true
    },
    {
      id: `prompt-${Date.now()}-10`,
      title: 'Magical Potion Shop Interior',
      description: 'Cozy fantasy alchemy shop with glowing potions',
      prompt: 'Interior of a magical potion shop, shelves filled with glowing bottles in various colors, wooden furniture, hanging herbs, mystical atmosphere, warm candlelight, fantasy setting, highly detailed, digital painting, concept art quality, trending on ArtStation, 4K',
      category: 'Fantasy',
      platform: 'Midjourney',
      tags: ['fantasy', 'interior', 'magical', 'cozy', 'detailed'],
      likes: 567,
      rating: 4.7,
      author: 'AI Prompt Masters',
      featured: false,
      trending: true
    }
  ];
}
