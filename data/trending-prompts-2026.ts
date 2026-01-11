// AI Prompt Library - Trending Topics 2026
// High-traffic SEO-optimized prompts

export interface PromptTemplate {
  id: string;
  title: string;
  description: string;
  category: 'image' | 'video' | 'text' | 'chatgpt';
  platform: string[];
  prompt: string;
  tags: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  featured: boolean;
}

export const trendingPrompts2026: PromptTemplate[] = [
  // IMAGE GENERATION PROMPTS
  {
    id: 'img-photorealistic-portrait-2026',
    title: 'Ultra-Realistic Portrait Photography',
    description: 'Professional-quality portrait with studio lighting and bokeh effect. Perfect for Midjourney V7 and DALL-E 3.',
    category: 'image',
    platform: ['Midjourney', 'DALL-E 3', 'Stable Diffusion XL'],
    prompt: `Professional portrait photography of [subject], shot on Canon EOS R5 with 85mm f/1.2 lens, soft studio lighting from 45 degrees, gentle rim light creating highlight on hair, shallow depth of field with creamy bokeh background, sharp focus on eyes, natural skin tones, professional color grading, captured in RAW format, ultra high definition 8K resolution, photorealistic quality --ar 2:3 --style raw --v 7`,
    tags: ['portrait', 'photography', 'realistic', 'professional', 'studio'],
    difficulty: 'intermediate',
    featured: true
  },
  {
    id: 'img-product-commercial-2026',
    title: 'Premium Product Photography',
    description: 'High-end commercial product shot with professional lighting. Trending for e-commerce and advertising.',
    category: 'image',
    platform: ['Midjourney', 'DALL-E 3', 'Firefly'],
    prompt: `Commercial product photography of [product name], placed on matte black surface with subtle reflections, dramatic side lighting creating depth and dimension, gradient background fading from charcoal to deep gray, accent light highlighting key features, professional studio setup, macro lens capturing intricate details, advertising quality, clean composition, premium feel, shot for luxury brand campaign, 8K resolution, perfect for e-commerce --ar 4:5`,
    tags: ['product', 'commercial', 'advertising', 'e-commerce', 'professional'],
    difficulty: 'intermediate',
    featured: true
  },
  {
    id: 'img-ai-art-trending-2026',
    title: 'Trending AI Art Style 2026',
    description: 'Viral AI art style combining photorealism with surreal elements. Perfect for social media and NFTs.',
    category: 'image',
    platform: ['Midjourney', 'Stable Diffusion XL'],
    prompt: `Surreal digital art blending photorealistic elements with dreamlike atmosphere, [main subject] surrounded by floating geometric shapes and ethereal light particles, vibrant color palette with neon accents, atmospheric volumetric lighting creating god rays, intricate details throughout, trending on ArtStation and Instagram, modern digital art aesthetic, highly detailed textures, cinematic composition following rule of thirds, masterpiece quality, 8K ultra HD --ar 16:9 --stylize 200`,
    tags: ['digital art', 'surreal', 'trending', 'social media', 'NFT'],
    difficulty: 'advanced',
    featured: true
  },
  
  // VIDEO GENERATION PROMPTS
  {
    id: 'vid-product-showcase-2026',
    title: 'Product Showcase Video (Sora/Runway)',
    description: 'Professional 360° product reveal perfect for commercials and social media ads.',
    category: 'video',
    platform: ['Sora', 'Runway Gen-2', 'Pika Labs'],
    prompt: `Cinematic product reveal video: [product name] rotating smoothly 360 degrees on premium display stand, studio lighting setup with key light from front-left creating professional highlights, subtle rim lighting defining edges, elegant gradient background transitioning from black to deep blue, camera slowly orbiting product while maintaining perfect focus, smooth gimbal-like movement, emphasize [key features], professional commercial quality, 4K resolution at 60fps, duration: 15 seconds, polished and premium feel suitable for TV commercial`,
    tags: ['product video', 'commercial', 'rotation', '360', 'advertising'],
    difficulty: 'intermediate',
    featured: true
  },
  {
    id: 'vid-social-media-reel-2026',
    title: 'Viral Social Media Reel',
    description: 'High-energy short-form video optimized for TikTok, Instagram Reels, and YouTube Shorts.',
    category: 'video',
    platform: ['Sora', 'Pika Labs', 'Runway'],
    prompt: `Dynamic social media video: fast-paced sequence showing [subject/concept], quick cuts between 3-5 scenes with smooth transitions, vibrant and saturated colors optimized for mobile screens, trending aesthetic with modern motion graphics overlays, upbeat energetic pacing, vertical 9:16 format perfect for mobile viewing, eye-catching hook in first 2 seconds, maintain engagement throughout, trendy visual effects, optimized for Instagram Reels and TikTok, 30-second duration, 4K vertical video`,
    tags: ['social media', 'reels', 'tiktok', 'viral', 'mobile'],
    difficulty: 'beginner',
    featured: true
  },
  
  // CHATGPT & TEXT GENERATION PROMPTS
  {
    id: 'text-blog-seo-optimized-2026',
    title: 'SEO-Optimized Blog Post Writer',
    description: 'Create comprehensive, search-engine-optimized blog content that ranks on Google.',
    category: 'chatgpt',
    platform: ['ChatGPT', 'Claude', 'Gemini'],
    prompt: `Act as an expert SEO content writer and digital marketing specialist. Write a comprehensive, search-engine-optimized blog post about [topic].

Requirements:
- Target keyword: [main keyword]
- Secondary keywords: [keyword 1], [keyword 2], [keyword 3]
- Word count: 2000-2500 words
- Target audience: [describe audience]
- Tone: Professional yet engaging, conversational

Structure:
1. Attention-grabbing headline with target keyword
2. Meta description (150-160 characters)
3. Introduction addressing reader pain points
4. 8-10 H2 sections with keyword variations
5. Include H3 subheadings for readability
6. FAQ section answering "People Also Ask" questions
7. Conclusion with clear call-to-action
8. Internal linking suggestions

Content Guidelines:
- Use short paragraphs (2-3 sentences max)
- Include bullet points and numbered lists
- Add relevant statistics and data
- Create engaging subheadings
- Optimize for featured snippets
- Include transition phrases for flow
- Write for E-E-A-T (Experience, Expertise, Authority, Trust)

Output format: Markdown with proper heading hierarchy`,
    tags: ['SEO', 'blog writing', 'content marketing', 'copywriting'],
    difficulty: 'advanced',
    featured: true
  },
  {
    id: 'text-social-media-captions-2026',
    title: 'Viral Social Media Captions',
    description: 'Create engaging, high-converting captions for Instagram, LinkedIn, and Twitter/X.',
    category: 'chatgpt',
    platform: ['ChatGPT', 'Claude'],
    prompt: `You are a viral social media strategist and copywriting expert. Create compelling social media captions for [platform: Instagram/LinkedIn/Twitter] about [topic/product/service].

Brand voice: [describe brand personality]
Target audience: [audience description]
Goal: [awareness/engagement/sales/followers]

Create 5 caption variations:

1. **Hook-focused** (Start with attention-grabbing question or statement)
2. **Storytelling** (Personal narrative that connects emotionally)
3. **Value-driven** (Lead with benefit, provide actionable tips)
4. **Controversial** (Challenge common belief, spark discussion)
5. **Curiosity gap** (Create intrigue, promise revelation)

For each caption include:
- Attention-grabbing first line
- Main content (keep Instagram under 150 characters for preview)
- Call-to-action
- 5-10 relevant hashtags (mix of popular and niche)
- Emoji usage (strategic, not excessive)

Best practices:
- Use line breaks for readability
- Include question to boost engagement
- Add urgency or FOMO where appropriate
- Optimize for platform algorithm
- Consider accessibility (capitalize hashtags)`,
    tags: ['social media', 'captions', 'copywriting', 'engagement'],
    difficulty: 'intermediate',
    featured: true
  },
  {
    id: 'text-email-marketing-2026',
    title: 'High-Converting Email Sequence',
    description: 'Create persuasive email marketing campaigns with high open and click-through rates.',
    category: 'chatgpt',
    platform: ['ChatGPT', 'Claude', 'Gemini'],
    prompt: `You are a direct response copywriter and email marketing expert. Create a high-converting email sequence for [product/service/course].

Campaign type: [welcome/nurture/sales/re-engagement]
Sequence length: [number] emails
Target audience: [description]
Main goal: [conversion/engagement/education]

For each email provide:

**Subject Line Options** (3 variations each):
- Curiosity-driven
- Benefit-focused  
- Urgency-based

**Preview Text**: Compelling 40-50 characters

**Email Body**:
1. Personalized greeting
2. Engaging opening (hook within first 2 lines)
3. Main content following PAS framework (Problem-Agitate-Solution)
4. Social proof or credibility indicators
5. Clear, singular call-to-action
6. PS line for additional engagement

**Technical Specifications**:
- Mobile-optimized formatting
- Ideal length: 150-300 words
- Grade level: 8th grade readability
- Include [number] links maximum
- Recommended send time

Tone: [Professional/Friendly/Urgent/Educational]

Additional elements:
- A/B testing recommendations
- Segmentation suggestions
- Follow-up sequence if no response`,
    tags: ['email marketing', 'copywriting', 'conversion', 'sales'],
    difficulty: 'advanced',
    featured: true
  },

  // FREE AI PROMPT EXAMPLES
  {
    id: 'img-free-landscape-2026',
    title: 'Stunning Landscape Photography',
    description: 'Free prompt for creating breathtaking landscape images. Works with all free AI image generators.',
    category: 'image',
    platform: ['Bing Creator', 'Leonardo.ai', 'Playground AI', 'Stable Diffusion'],
    prompt: `Breathtaking landscape photography of [location type: mountain/beach/forest/desert], captured during golden hour with warm sunlight casting long shadows, dramatic clouds in vibrant sky with rich colors, foreground elements adding depth to composition, crystal clear details throughout scene, professional nature photography, shot with wide-angle lens, vivid saturation, National Geographic quality, pristine and untouched environment, sense of scale and grandeur, 8K ultra high definition --ar 16:9`,
    tags: ['landscape', 'nature', 'photography', 'free', 'beginner'],
    difficulty: 'beginner',
    featured: true
  },
  {
    id: 'text-free-chatgpt-assistant-2026',
    title: 'Personal AI Assistant (Free ChatGPT)',
    description: 'Transform free ChatGPT into your personal productivity assistant.',
    category: 'chatgpt',
    platform: ['ChatGPT Free', 'Perplexity', 'Microsoft Copilot'],
    prompt: `You are my personal AI productivity assistant. Help me manage my day effectively.

Your capabilities:
- Task prioritization and time management
- Email draft assistance
- Meeting preparation
- Research and summarization
- Creative brainstorming
- Problem-solving strategies

Current task: [describe what you need]

Please provide:
1. Quick analysis of the situation
2. Step-by-step action plan
3. Time estimates for each step
4. Potential obstacles and solutions
5. Success criteria

Format your response for easy scanning with:
- Clear headings
- Bullet points
- Priority indicators (🔴 urgent, 🟡 important, 🟢 nice-to-have)
- Actionable next steps

Let's make today productive!`,
    tags: ['productivity', 'assistant', 'free', 'organization'],
    difficulty: 'beginner',
    featured: true
  }
];

// Prompt Categories for Library Organization
export const promptCategories = [
  {
    id: 'image-generation',
    name: 'Image Generation',
    description: 'Prompts for Midjourney, DALL-E, Stable Diffusion, and other AI image generators',
    icon: '🎨',
    count: 150
  },
  {
    id: 'video-creation',
    name: 'Video Creation',
    description: 'Prompts for Sora, Runway, Pika Labs, and AI video generation tools',
    icon: '🎬',
    count: 75
  },
  {
    id: 'text-generation',
    name: 'Text & Writing',
    description: 'ChatGPT, Claude, and Gemini prompts for content creation',
    icon: '✍️',
    count: 200
  },
  {
    id: 'free-prompts',
    name: 'Free AI Prompts',
    description: 'Best prompts for free AI tools - no subscription needed',
    icon: '🆓',
    count: 100
  }
];
