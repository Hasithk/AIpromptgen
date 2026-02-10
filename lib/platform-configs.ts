/**
 * Platform-Specific Prompt Generation Configurations
 * Each AI platform has different requirements and optimal prompt structures
 */

export interface PlatformConfig {
  name: string;
  value: string;
  type: 'image' | 'video';
  promptStyle: 'simple' | 'detailed' | 'technical';
  maxLength: number;
  includeParameters: boolean;
  systemPrompt: string;
  formatInstructions: string;
  examples: string[];
}

export const PLATFORM_CONFIGS: Record<string, PlatformConfig> = {
  // Image Generation Platforms
  'nanobanana': {
    name: 'NanoBanana (Google)',
    value: 'nanobanana',
    type: 'image',
    promptStyle: 'detailed',
    maxLength: 250,
    includeParameters: false,
    systemPrompt: 'You are an expert at creating detailed, effective prompts for NanoBanana AI image generation. Create comprehensive prompts with clear descriptions.',
    formatInstructions: `Generate a DETAILED prompt (max 250 characters) for NanoBanana. 
Focus on: 
- Main subject (clear and detailed)
- Visual elements and composition
- Style and artistic direction
- Lighting and atmosphere
- Quality descriptors
Provide rich details while keeping the language natural.`,
    examples: [
      'A sleek red sports car on a winding coastal highway at sunset, dramatic ocean views, golden hour lighting, photorealistic, highly detailed',
      'Cozy coffee shop interior with vintage furniture, warm ambient lighting, people reading, steam rising from cups, inviting atmosphere, detailed',
      'Majestic mountain landscape at sunrise, misty valleys, golden light rays, pine forests, dramatic sky, ultra detailed nature photography'
    ]
  },
  
  'qwen': {
    name: 'Qwen.ai (Alibaba)',
    value: 'qwen',
    type: 'image',
    promptStyle: 'detailed',
    maxLength: 300,
    includeParameters: false,
    systemPrompt: 'You are an expert at creating detailed prompts for Qwen.ai image generation. Qwen excels at understanding rich descriptions and cultural elements.',
    formatInstructions: `Generate a detailed, natural prompt (max 300 characters) for Qwen.ai.
Focus on:
- Comprehensive subject description
- Cultural or artistic context
- Detailed style indicators
- Atmosphere and mood
- Lighting and composition
- Quality descriptors
Use natural, flowing language with rich details.`,
    examples: [
      'Traditional Chinese garden with blooming cherry blossoms, elegant stone bridge over koi pond, lanterns glowing softly, misty morning atmosphere, serene and peaceful, highly detailed, masterpiece quality',
      'Modern minimalist living room with floor-to-ceiling windows, natural sunlight streaming in, designer furniture, indoor plants, clean aesthetic, photorealistic, professional interior design',
      'Vibrant street food market scene at night, colorful stalls, steam rising from cooking, people enjoying meals, neon signs reflecting on wet streets, bustling atmosphere, cinematic lighting, detailed'
    ]
  },

  'dall-e': {
    name: 'DALL-E 3',
    value: 'dall-e',
    type: 'image',
    promptStyle: 'detailed',
    maxLength: 400,
    includeParameters: false,
    systemPrompt: 'You are an expert at creating highly detailed, descriptive prompts for DALL-E 3. DALL-E 3 excels with complex scenes, rich descriptions, and abstract concepts.',
    formatInstructions: `Generate a highly detailed, descriptive prompt (max 400 characters) for DALL-E 3.
Focus on:
- Comprehensive subject description
- Specific artistic style and influences
- Detailed mood and atmosphere
- Precise composition and perspective
- Lighting details
- Texture and material descriptions
- Quality descriptors
Use rich, evocative language with extensive details.`,
    examples: [
      'A whimsical steampunk library with floating books suspended in mid-air, intricate brass gears mounted on mahogany walls, warm amber lighting streaming through tall arched windows, dust particles visible in light beams, Victorian illustration style, highly detailed, masterpiece quality, 8k',
      'Abstract representation of digital consciousness, flowing data streams of luminous blue and purple light, complex geometric patterns intersecting, cyberpunk aesthetic, holographic effects, depth and dimensionality, futuristic, trending on artstation, highly detailed',
      'Photorealistic portrait of an elderly craftsman in his traditional workshop, surrounded by handmade wooden toys and tools, golden hour lighting through dusty windows, shallow depth of field focusing on weathered hands, warm nostalgic atmosphere, professional photography, 8k detail'
    ]
  },

  'midjourney': {
    name: 'Midjourney',
    value: 'midjourney',
    type: 'image',
    promptStyle: 'detailed',
    maxLength: 500,
    includeParameters: true,
    systemPrompt: 'You are an expert at creating highly detailed prompts for Midjourney. Midjourney excels with specific artistic styles, technical photography terms, and comprehensive parameters.',
    formatInstructions: `Generate a comprehensive, detailed prompt for Midjourney with technical parameters.
Structure:
1. Main subject (highly detailed description)
2. Specific style and artistic references (artists, movements, techniques)
3. Detailed technical photography aspects (lighting type, quality, direction)
4. Composition and camera details (lens, angle, framing)
5. Atmosphere, mood, and color palette
6. Quality and detail descriptors
7. Parameters: --ar 16:9 --v 6 (always include)
8. Optional advanced parameters: --style raw, --chaos [value], --quality 2, --stylize [value]

Focus on professional artistic and photographic terminology with rich detail.`,
    examples: [
      'Epic high fantasy castle perched dramatically on floating islands surrounded by volumetric clouds, majestic waterfalls cascading into the void, dramatic golden sunset lighting with god rays, inspired by Marc Simonetti and Peter Mohrbacher, cinematic wide-angle composition, ultra detailed Gothic architecture with intricate spires, atmospheric perspective, vibrant fantasy colors --ar 16:9 --v 6 --quality 2 --stylize 750',
      'Hyperrealistic luxury product photography of an ornate Swiss watch with visible movement, professional studio lighting setup with soft box and rim light, perfectly reflective surface showing intricate details, macro lens perspective with tack-sharp focus, black velvet background, professional advertising photography style, 8K detail --ar 16:9 --v 6 --quality 2',
      'Expansive cyberpunk cityscape at night with towering neon-lit skyscrapers, holographic advertisements, neon signs reflecting on wet rain-soaked streets, hovering vehicles, blade runner aesthetic meets ghost in the shell, cinematic moody atmosphere, dramatic lighting, shot with wide angle lens from elevated perspective, highly detailed urban environment --ar 16:9 --v 6 --style raw --quality 2'
    ]
  },

  'stable-diffusion': {
    name: 'Stable Diffusion Web',
    value: 'stable-diffusion',
    type: 'image',
    promptStyle: 'detailed',
    maxLength: 350,
    includeParameters: true,
    systemPrompt: 'You are an expert at creating detailed prompts for Stable Diffusion. Stable Diffusion works best with clear subject descriptions, artistic styles, and quality modifiers.',
    formatInstructions: `Generate a detailed prompt for Stable Diffusion (max 350 characters).
Structure:
1. Main subject (very detailed)
2. Artistic style and references
3. Quality tags (masterpiece, best quality, highly detailed, 8k, etc.)
4. Lighting and atmosphere
5. Technical details (camera, composition)
6. Negative prompt suggestions

Use comma-separated tags and descriptors. Include quality modifiers.`,
    examples: [
      'A mystical forest at twilight, ancient trees with glowing mushrooms, ethereal mist, fantasy art style, highly detailed, masterpiece, cinematic lighting, volumetric fog, 8k, ultra sharp focus, professional digital art',
      'Portrait of a cyberpunk hacker, neon lighting, futuristic cityscape background, detailed face, photorealistic, best quality, studio lighting, bokeh, sharp focus, 4k resolution, trending on artstation',
      'Majestic dragon flying over snowy mountains, epic scale, fantasy illustration, dramatic sky, golden hour lighting, highly detailed scales, masterpiece quality, cinematic composition, 8k wallpaper'
    ]
  },

  // Video Generation Platforms
  'sora-video': {
    name: 'Sora (OpenAI) Video',
    value: 'sora-video',
    type: 'video',
    promptStyle: 'detailed',
    maxLength: 600,
    includeParameters: false,
    systemPrompt: 'You are an expert at creating highly detailed video prompts for OpenAI Sora. Sora excels at understanding complex scenes, precise camera movements, and temporal consistency.',
    formatInstructions: `Generate a comprehensive video prompt for Sora (max 600 characters).
Include:
1. Detailed scene description (what happens, environment, subjects)
2. Specific camera movement (pan, zoom, tracking, dolly, crane, static, etc.)
3. Precise lighting and atmosphere details
4. Detailed motion description (how subjects and objects move)
5. Temporal progression (how scene evolves from start to end)
6. Visual style and cinematography approach
7. Quality descriptors (4K, cinematic, professional, etc.)

Be extremely specific about motion, camera work, and visual details.`,
    examples: [
      "A majestic golden retriever runs joyfully through a sunlit meadow filled with colorful wildflowers swaying in the breeze. Camera starts with a wide establishing shot, then smoothly pushes in while tracking alongside the dog. The dog's golden fur flows naturally in the wind, ears flapping. Golden hour sunlight creates a warm, cinematic atmosphere with long shadows. Professional cinematography with buttery smooth motion, shallow depth of field, 4K quality, film-like color grading.",
      "Time-lapse of a bustling Tokyo intersection at night, Shibuya crossing. Camera slowly pans right across the scene as hundreds of people cross in both directions. Vibrant neon signs flicker and create colorful reflections on the wet pavement. Light rain begins to fall midway through, visible in the neon glow. Smooth gimbal movement, professional color grading with enhanced neon colors, highly detailed urban environment, 4K cinematic quality.",
      "Extreme close-up shot of skilled hands preparing nigiri sushi in a traditional Japanese restaurant. Camera slowly dollies back to reveal the focused chef and the authentic restaurant interior. Shallow depth of field keeps focus on hands, natural window lighting creates soft shadows. Steam rises delicately from warm rice. Ultra smooth camera movement, attention to fine details, professional food videography style, 4K quality."
    ]
  },

  'sora-image': {
    name: 'Sora (OpenAI) Image',
    value: 'sora-image',
    type: 'image',
    promptStyle: 'detailed',
    maxLength: 500,
    includeParameters: false,
    systemPrompt: 'You are an expert at creating highly detailed image prompts for OpenAI Sora. Sora excels at photorealistic details, complex compositions, and cinematic quality.',
    formatInstructions: `Generate a comprehensive image prompt for Sora (max 500 characters).
Include:
1. Detailed subject and composition
2. Specific artistic or photographic style
3. Comprehensive lighting details and direction
4. Mood, atmosphere, and emotional tone
5. Texture and material descriptions
6. Camera and lens characteristics
7. Quality descriptors (photorealistic, 8K, highly detailed, etc.)

Focus on professional photography and cinematic terminology with rich detail.`,
    examples: [
      'Breathtaking photorealistic aerial view of a misty mountain valley at sunrise, winding river reflecting golden and pink light through morning fog. Dramatic volumetric lighting pierces through atmospheric mist, creating god rays. Ultra-detailed landscape with visible textures on rocks and trees, professional landscape photography style, shot with wide-angle lens, 8K quality, masterpiece composition.',
      'High-end studio portrait of a fashion model wearing avant-garde designer clothing, dramatic side lighting creating strong Rembrandt shadows on face, minimalist gray seamless background. Tack-sharp focus on piercing eyes, shallow depth of field with beautiful bokeh, high-fashion editorial style, professional beauty lighting setup, medium format camera aesthetic, 8K detail, trending on Vogue.',
      'Cozy independent bookstore café interior during winter evening, warm Edison bulb string lights creating inviting ambiance, diverse people reading in comfortable leather chairs, fresh snow visible through large frosted windows. Beautiful bokeh effect on lights, natural window light mixing with warm interior lighting, steam rising from coffee cups, inviting nostalgic atmosphere, professional interior photography, highly detailed, 8K quality.'
    ]
  },

  'veo3': {
    name: 'Veo 3.1 (Google)',
    value: 'veo3',
    type: 'video',
    promptStyle: 'detailed',
    maxLength: 550,
    includeParameters: false,
    systemPrompt: 'You are an expert at creating detailed video prompts for Google Veo 3.1. Veo excels at realistic motion, accurate physics simulation, and professional cinematic quality.',
    formatInstructions: `Generate a comprehensive video prompt for Veo 3.1 (max 550 characters).
Include:
1. Detailed scene and action description
2. Specific camera work (movement type, angles, transitions)
3. Realistic physics and natural motion details
4. Precise lighting and time of day
5. Visual quality and cinematographic style
6. Temporal flow (how the scene progresses)
7. Technical details (frame rate, focus, etc.)

Emphasize realistic motion, accurate physics, and professional cinematography with rich detail.`,
    examples: [
      'A skilled skateboarder performs a technical kickflip down a 5-stair in a concrete skatepark during golden hour. Camera follows with buttery smooth tracking shot using gimbal, maintaining perfect focus on the skater throughout. Highly realistic physics of the skateboard spinning with accurate rotation speed, natural motion blur on wheels. Warm sunset lighting creates long dramatic shadows across the concrete. Professional action sports cinematography, shot at high frame rate for clean slow motion details, 4K quality.',
      'Powerful ocean waves crash dramatically against jagged rocky cliffs during an intense storm. Camera starts with sweeping aerial view, then descends smoothly toward the spray and foam. Hyperrealistic water physics with accurate foam dynamics and spray patterns, droplets caught in dramatic stormy lighting. Dark threatening clouds overhead with occasional breaks of golden sunlight creating contrast. Dynamic camera movement captures the raw power and massive scale of nature. Cinematic, professional-grade video, 4K quality.',
      'A skilled barista creates intricate latte art in extreme slow motion, pouring steamed milk into espresso. Camera slowly rotates 180 degrees around the cup while maintaining tack-sharp focus on the milk stream. Hyperrealistic fluid dynamics showing milk mixing with coffee, foam patterns forming naturally. Warm café lighting in soft-focus background with beautiful bokeh, professional depth of field. Steam rises naturally with realistic physics. Ultra smooth gimbal camera movement, professional product videography style, 4K quality.'
    ]
  }
};

/**
 * Get platform configuration by platform value
 */
export function getPlatformConfig(platform: string): PlatformConfig {
  return PLATFORM_CONFIGS[platform] || PLATFORM_CONFIGS['nanobanana'];
}

/**
 * Build system prompt for DeepSeek based on platform
 */
export function buildSystemPrompt(platform: string): string {
  const config = getPlatformConfig(platform);
  return config.systemPrompt;
}

/**
 * Build user prompt for DeepSeek based on platform and user input
 */
export function buildUserPrompt(
  platform: string,
  subject: string,
  styles: string[] = [],
  mood: string = '',
  lighting: string = '',
  creativity: number = 75,
  duration?: number
): string {
  const config = getPlatformConfig(platform);
  
  let userPrompt = `${config.formatInstructions}\n\n`;
  userPrompt += `Subject: ${subject}\n`;
  
  if (styles.length > 0) {
    userPrompt += `Styles: ${styles.join(', ')}\n`;
  }
  if (mood) {
    userPrompt += `Mood: ${mood}\n`;
  }
  if (lighting) {
    userPrompt += `Lighting: ${lighting}\n`;
  }
  if (duration && config.type === 'video') {
    userPrompt += `Duration: ${duration}s\n`;
  }
  
  userPrompt += `\nCreativity level: ${creativity}% - `;
  if (creativity < 50) {
    userPrompt += 'Keep it simple and straightforward.';
  } else if (creativity < 80) {
    userPrompt += 'Add moderate creative details.';
  } else {
    userPrompt += 'Be highly creative and detailed.';
  }
  
  userPrompt += `\n\nGenerate ONE optimized prompt following the format instructions above. The prompt should be ${config.maxLength} characters or less.`;
  
  return userPrompt;
}
