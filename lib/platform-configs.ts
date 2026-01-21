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
    promptStyle: 'simple',
    maxLength: 150,
    includeParameters: false,
    systemPrompt: 'You are an expert at creating simple, effective prompts for NanoBanana AI image generation. NanoBanana works best with concise, clear descriptions.',
    formatInstructions: `Generate a SHORT, simple prompt (max 150 characters) for NanoBanana. 
Focus on: 
- Main subject (clear and direct)
- Key visual elements (1-2 max)
- Style (single word if needed)
Keep it concise and natural. NO technical parameters.`,
    examples: [
      'A red sports car on a coastal highway',
      'Cozy coffee shop interior, warm lighting',
      'Mountain landscape at sunrise'
    ]
  },
  
  'qwen': {
    name: 'Qwen.ai (Alibaba)',
    value: 'qwen',
    type: 'image',
    promptStyle: 'simple',
    maxLength: 200,
    includeParameters: false,
    systemPrompt: 'You are an expert at creating prompts for Qwen.ai image generation. Qwen excels at understanding natural language and cultural elements.',
    formatInstructions: `Generate a natural, conversational prompt (max 200 characters) for Qwen.ai.
Focus on:
- Clear subject description
- Cultural or artistic context
- Simple style indicators
Use natural language, avoid technical jargon.`,
    examples: [
      'Traditional Chinese garden with cherry blossoms and stone bridge',
      'Modern minimalist living room with natural light',
      'Street food market scene at night, vibrant colors'
    ]
  },

  'dall-e': {
    name: 'DALL-E 3',
    value: 'dall-e',
    type: 'image',
    promptStyle: 'detailed',
    maxLength: 300,
    includeParameters: false,
    systemPrompt: 'You are an expert at creating detailed, descriptive prompts for DALL-E 3. DALL-E 3 understands complex scenes and abstract concepts.',
    formatInstructions: `Generate a detailed, descriptive prompt (max 300 characters) for DALL-E 3.
Focus on:
- Detailed subject description
- Specific artistic style
- Mood and atmosphere
- Composition and perspective
Use rich, descriptive language without technical parameters.`,
    examples: [
      'A whimsical steampunk library with floating books, brass gears on the walls, warm amber lighting streaming through tall windows, in the style of Victorian illustration',
      'Abstract representation of digital consciousness, flowing data streams of blue and purple light, geometric patterns, cyberpunk aesthetic',
      'Photorealistic portrait of an elderly craftsman in his workshop, surrounded by handmade wooden toys, golden hour lighting, shallow depth of field'
    ]
  },

  'midjourney': {
    name: 'Midjourney',
    value: 'midjourney',
    type: 'image',
    promptStyle: 'detailed',
    maxLength: 400,
    includeParameters: true,
    systemPrompt: 'You are an expert at creating detailed prompts for Midjourney. Midjourney excels with specific artistic styles, technical photography terms, and parameters.',
    formatInstructions: `Generate a detailed prompt for Midjourney with technical parameters.
Structure:
1. Main subject (detailed)
2. Style and artistic references
3. Technical details (lighting, composition, camera)
4. Parameters: --ar 16:9 --v 6 (always include)
5. Optional: --style raw, --chaos, --quality 2

Focus on artistic and photographic terminology.`,
    examples: [
      'Epic fantasy castle perched on floating islands, volumetric clouds, dramatic sunset lighting, by Marc Simonetti and Peter Mohrbacher, cinematic composition, ultra detailed architecture --ar 16:9 --v 6 --quality 2',
      'Hyperrealistic product photography of luxury watch, studio lighting, reflective surface, macro lens, sharp focus, professional advertising style --ar 16:9 --v 6',
      'Cyberpunk cityscape at night, neon signs reflecting on wet streets, rain, blade runner aesthetic, cinematic mood, wide angle lens --ar 16:9 --v 6 --style raw'
    ]
  },

  // Video Generation Platforms
  'sora-video': {
    name: 'Sora (OpenAI) Video',
    value: 'sora-video',
    type: 'video',
    promptStyle: 'detailed',
    maxLength: 500,
    includeParameters: false,
    systemPrompt: 'You are an expert at creating detailed video prompts for OpenAI Sora. Sora excels at understanding complex scenes, camera movements, and temporal consistency.',
    formatInstructions: `Generate a detailed video prompt for Sora (max 500 characters).
Include:
1. Scene description (what happens)
2. Camera movement (pan, zoom, tracking, static, etc.)
3. Lighting and atmosphere
4. Motion details (how subjects move)
5. Temporal progression (beginning to end)
6. Visual style and quality descriptors

Be very specific about motion and cinematography.`,
    examples: [
      "A majestic golden retriever runs through a sunlit meadow filled with wildflowers. Camera starts wide, then slowly pushes in while following the dog. The dog's fur flows naturally in the wind. Golden hour lighting creates a warm, cinematic atmosphere. Professional cinematography with smooth motion, 4K quality.",
      "Time-lapse of a bustling Tokyo street at night. Camera slowly pans right as people walk by in both directions. Neon signs flicker and reflect on the wet pavement. Rain begins to fall midway through. Smooth camera movement, professional color grading, highly detailed urban environment.",
      "Close-up shot of hands preparing sushi in a traditional Japanese restaurant. Camera slowly dollies back to reveal the chef and the restaurant interior. Shallow depth of field, natural lighting from windows, steam rising from rice. Smooth, professional cinematography with attention to detail."
    ]
  },

  'sora-image': {
    name: 'Sora (OpenAI) Image',
    value: 'sora-image',
    type: 'image',
    promptStyle: 'detailed',
    maxLength: 400,
    includeParameters: false,
    systemPrompt: 'You are an expert at creating detailed image prompts for OpenAI Sora. Sora understands complex compositions and photorealistic details.',
    formatInstructions: `Generate a detailed image prompt for Sora (max 400 characters).
Include:
1. Subject and composition
2. Artistic or photographic style
3. Lighting details
4. Mood and atmosphere
5. Quality descriptors (photorealistic, detailed, etc.)

Focus on photographic and cinematic terminology.`,
    examples: [
      'Photorealistic aerial view of a misty mountain valley at sunrise, with a winding river reflecting golden light. Dramatic volumetric lighting through fog, ultra-detailed landscape, professional landscape photography style, 8K quality.',
      'Studio portrait of a fashion model in avant-garde clothing, dramatic side lighting creating strong shadows, minimalist gray background, sharp focus on face, shallow depth of field, high-fashion editorial style.',
      'Cozy bookstore café interior during winter evening, warm string lights, people reading in comfortable chairs, snow visible through large windows, bokeh effect on lights, inviting atmosphere, professional interior photography.'
    ]
  },

  'veo3': {
    name: 'Veo 3.1 (Google)',
    value: 'veo3',
    type: 'video',
    promptStyle: 'detailed',
    maxLength: 450,
    includeParameters: false,
    systemPrompt: 'You are an expert at creating video prompts for Google Veo 3.1. Veo excels at realistic motion, physics simulation, and cinematic quality.',
    formatInstructions: `Generate a detailed video prompt for Veo 3.1 (max 450 characters).
Include:
1. Scene and action description
2. Camera work (movement, angles, transitions)
3. Realistic physics and motion
4. Lighting and time of day
5. Visual quality and style
6. Temporal flow (how scene evolves)

Emphasize realistic motion and professional cinematography.`,
    examples: [
      'A skateboarder performs a kickflip in a concrete skatepark at golden hour. Camera follows with smooth tracking shot, maintaining focus on the skater. Realistic physics of the board spinning, natural motion blur. Warm sunset lighting creates long shadows. Professional action sports cinematography, high frame rate for slow motion details.',
      'Ocean waves crash against rocky cliffs during a storm. Camera starts aerial, then descends toward the spray. Realistic water physics, foam and mist caught in dramatic lighting. Dark clouds overhead with breaks of sunlight. Dynamic camera movement captures the power and scale of nature. Cinematic, high-quality video.',
      'A barista creates latte art in slow motion. Camera slowly rotates around the cup while maintaining sharp focus. Realistic milk flow and foam physics. Warm café lighting in background, shallow depth of field. Steam rises naturally. Smooth camera movement, professional product videography style.'
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
