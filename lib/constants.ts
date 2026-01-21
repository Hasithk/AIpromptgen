export const SITE_CONFIG = {
  name: 'AI Prompt Gen',
  description: 'The most advanced AI prompt generation platform for creators, designers, and professionals.',
  url: 'https://aipromptgen.app',
  ogImage: 'https://aipromptgen.app/og.jpg',
  links: {
    twitter: 'https://twitter.com/aipromptgen',
    github: 'https://github.com/aipromptgen',
  },
};

export const PLATFORMS = [
  { value: 'sora-video', label: 'Sora (OpenAI)', description: 'Cinematic video with detailed motion', type: 'video' },
  { value: 'veo3', label: 'Veo 3.1 (Google)', description: 'Realistic motion & physics', type: 'video' },
  { value: 'nanobanana', label: 'NanoBanana (Google)', description: 'Simple, effective images', type: 'image' },
  { value: 'qwen', label: 'Qwen.ai (Alibaba)', description: 'Natural language images', type: 'image' },
  { value: 'dall-e', label: 'DALL-E 3', description: 'Detailed artistic images', type: 'image' },
  { value: 'midjourney', label: 'Midjourney', description: 'Professional artistic images', type: 'image' },
  { value: 'sora-image', label: 'Sora (OpenAI)', description: 'Photorealistic images', type: 'image' },
];

export const STYLES = [
  'Photorealistic', 'Cinematic', 'Anime', 'Cyberpunk', 'Minimalist', 
  'Vintage', 'Abstract', 'Watercolor', 'Oil Painting', 'Digital Art'
];

export const MOODS = [
  'Calm', 'Energetic', 'Mysterious', 'Dramatic', 'Playful', 
  'Elegant', 'Bold', 'Serene', 'Dynamic', 'Ethereal'
];

export const LIGHTING_OPTIONS = [
  'Natural', 'Golden Hour', 'Blue Hour', 'Studio', 'Neon', 
  'Candlelight', 'Harsh', 'Soft', 'Dramatic', 'Backlit'
];

export const PRICING_PLANS = [
  {
    name: 'Free',
    description: 'Perfect for getting started',
    price: '$0',
    period: 'forever',
    features: [
      '50 credits per month',
      'Basic prompt generation',
      'Access to all platforms',
      'Community support',
      'Basic templates'
    ],
    limitations: [
      'Limited advanced features',
      'No API access',
      'Basic export options'
    ],
    cta: 'Get Started',
    popular: false
  },
  {
    name: 'Pro',
    description: 'For serious creators and professionals',
    price: '$5',
    period: 'month',
    features: [
      'Unlimited generations',
      'Premium categories & styles',
      'Advanced filtering & controls',
      'No watermarks',
      'Unlimited saved prompts',
      'Priority support',
      'Export in all formats',
      'Prompt optimization',
      'Team collaboration (up to 3 members)'
    ],
    cta: 'Start Pro Trial',
    popular: true
  },
  {
    name: 'Elite',
    description: 'For teams and power users',
    price: '$10',
    period: 'month',
    features: [
      'Everything in Pro',
      'API access (10,000 calls/month)',
      'Advanced team collaboration',
      'Custom style training',
      'Priority generation queue',
      'Dedicated account manager',
      'Custom integrations',
      'Advanced analytics',
      'White-label options',
      'SLA guarantee'
    ],
    cta: 'Contact Sales',
    popular: false
  }
];