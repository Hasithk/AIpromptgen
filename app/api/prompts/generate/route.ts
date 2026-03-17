
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { buildSystemPrompt, buildUserPrompt, getPlatformConfig } from '@/lib/platform-configs';
// Use process.env for server-side environment variables

function normalizePromptText(value: string): string {
  return value
    .toLowerCase()
    .replace(/[`"'*_#]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function toWordSet(value: string): Set<string> {
  return new Set(
    normalizePromptText(value)
      .split(/[^a-z0-9]+/)
      .filter(word => word.length > 2)
  );
}

function calculateOverlapRatio(source: string, target: string): number {
  const sourceWords = toWordSet(source);
  const targetWords = toWordSet(target);

  if (sourceWords.size === 0) {
    return 0;
  }

  let overlap = 0;
  for (const word of Array.from(sourceWords)) {
    if (targetWords.has(word)) {
      overlap += 1;
    }
  }

  return overlap / sourceWords.size;
}

function countDescriptiveSegments(value: string): number {
  return value
    .split(/[,.]/)
    .map(segment => segment.trim())
    .filter(Boolean)
    .length;
}

function includesAnyTerm(value: string, terms: string[]): boolean {
  const normalizedValue = normalizePromptText(value);
  return terms.some(term => normalizedValue.includes(normalizePromptText(term)));
}

function buildImageDetailPack(styles: string[], mood?: string, lighting?: string, creativity: number = 75): string[] {
  const detailPack = [
    'editorial-grade composition',
    'layered foreground and background depth',
    'refined material realism',
    'subtle texture variation',
  ];

  if (styles.includes('Photorealistic')) {
    detailPack.push('true-to-life materials', 'natural reflections', 'physically plausible light behavior');
  }

  if (styles.includes('Cinematic')) {
    detailPack.push('cinematic framing', 'controlled contrast', 'film-like tonal balance');
  }

  if (styles.includes('Minimalist')) {
    detailPack.push('clean spatial rhythm', 'intentional negative space', 'curated decorative restraint');
  }

  if (styles.includes('Vintage')) {
    detailPack.push('subtle retro accents', 'warm patina', 'timeless styling cues');
  }

  if (mood) {
    detailPack.push(`${mood.toLowerCase()} atmosphere`);
  }

  if (lighting) {
    detailPack.push(`${lighting.toLowerCase()} light shaping the scene`);
  }

  if (creativity >= 80) {
    detailPack.push('bespoke design details', 'visually memorable focal points');
  }

  return detailPack;
}

function buildFallbackPrompt({
  platform,
  subject,
  styles,
  mood,
  lighting,
  creativity,
  duration,
}: {
  platform: string;
  subject: string;
  styles: string[];
  mood?: string;
  lighting?: string;
  creativity: number;
  duration?: number;
}): string {
  const config = getPlatformConfig(platform);
  const qualityDescriptors = creativity >= 85
    ? ['cinematic', 'highly detailed', 'visually striking', 'professional quality']
    : creativity >= 60
      ? ['detailed', 'polished', 'atmospheric', 'high quality']
      : ['clean composition', 'clear subject', 'refined details'];

  const styleText = styles.length > 0 ? `${styles.join(', ')} style` : 'tasteful contemporary visual styling';
  const moodText = mood ? `${mood.toLowerCase()} mood` : 'immersive atmosphere';
  const lightingText = lighting ? `${lighting.toLowerCase()} lighting` : 'carefully shaped lighting';

  let prompt = '';

  if (config.type === 'video') {
    const durationText = duration ? `over ${duration} seconds` : 'with a natural cinematic progression';
    prompt = `${subject.trim()}, ${styleText}, ${moodText}, ${lightingText}, dynamic scene development ${durationText}, smooth camera movement, realistic motion, layered environmental detail, strong sense of depth, ${qualityDescriptors.join(', ')}`;
  } else {
    const imageDetailPack = buildImageDetailPack(styles, mood, lighting, creativity);
    const platformSpecificTail = platform === 'midjourney'
      ? '--ar 16:9 --v 6'
      : platform === 'stable-diffusion'
        ? 'masterpiece, best quality'
        : 'refined composition';

    prompt = `${subject.trim()}, ${styleText}, ${moodText}, ${lightingText}, ${imageDetailPack.join(', ')}, ${qualityDescriptors.join(', ')}, ${platformSpecificTail}`;
  }

  if (prompt.length > config.maxLength) {
    return prompt.slice(0, config.maxLength).trim().replace(/[,:;\-]+$/, '');
  }

  return prompt;
}

function isPromptTooSimple({
  generatedPrompt,
  subject,
  styles,
  mood,
  lighting,
  platform,
}: {
  generatedPrompt: string;
  subject: string;
  styles: string[];
  mood?: string;
  lighting?: string;
  platform: string;
}): boolean {
  const config = getPlatformConfig(platform);
  const normalizedPrompt = normalizePromptText(generatedPrompt);
  const segmentCount = countDescriptiveSegments(generatedPrompt);
  const minimumLength = Math.min(Math.round(config.maxLength * 0.62), normalizePromptText(subject).length + 120);
  const importantTerms = [...styles];

  if (mood) {
    importantTerms.push(mood);
  }

  if (lighting) {
    importantTerms.push(lighting);
  }

  const matchingSelections = importantTerms.filter(term => includesAnyTerm(generatedPrompt, [term])).length;
  const expectedSelectionMatches = importantTerms.length === 0 ? 0 : Math.max(1, Math.ceil(importantTerms.length / 2));
  const lacksImageLanguage = config.type === 'image' && !includesAnyTerm(generatedPrompt, [
    'composition', 'framing', 'texture', 'material', 'palette', 'depth', 'shadow', 'light', 'surface', 'editorial', 'render'
  ]);

  return normalizedPrompt.length < minimumLength
    || segmentCount < 8
    || matchingSelections < expectedSelectionMatches
    || lacksImageLanguage;
}

function shouldUseFallbackPrompt(subject: string, generatedPrompt: string): boolean {
  const normalizedSubject = normalizePromptText(subject);
  const normalizedPrompt = normalizePromptText(generatedPrompt);

  if (!normalizedPrompt) {
    return true;
  }

  if (normalizedPrompt === normalizedSubject) {
    return true;
  }

  const overlapRatio = calculateOverlapRatio(subject, generatedPrompt);
  const isBarelyExpanded = normalizedPrompt.length < Math.max(normalizedSubject.length + 24, normalizedSubject.length * 1.35);

  return overlapRatio > 0.85 && isBarelyExpanded;
}


export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, error: 'Authentication required. Please sign in.' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const {
      subject,
      platform,
      styles,
      mood,
      lighting,
      creativity,
      duration,
      includeNegative
    } = body;

    const trimmedSubject = typeof subject === 'string' ? subject.trim() : '';

    if (!trimmedSubject || !platform) {
      return NextResponse.json(
        { success: false, error: 'Subject and platform are required' },
        { status: 400 }
      );
    }

    // Calculate credits required
    // Sora platforms use more credits due to complexity
    const creditsRequired = platform.startsWith('sora') ? 10 : 2;

    // Check user credits before making API call
    let user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true, credits: true, email: true, name: true }
    });

    // Auto-create user if they don't exist (for users who signed in before migration)
    if (!user) {
      user = await prisma.user.create({
        data: {
          email: session.user.email,
          name: session.user.name || '',
          credits: 50,
          monthlyCreditsUsed: 0,
          lastCreditResetDate: new Date(),
          plan: 'free'
        },
        select: { id: true, credits: true, email: true, name: true }
      });
      console.log(`✓ Auto-created user during generation: ${user.email}`);
    }

    if (user.credits < creditsRequired) {
      return NextResponse.json(
        { 
          success: false, 
          error: `Insufficient credits. You need ${creditsRequired} credits but only have ${user.credits}.` 
        },
        { status: 400 }
      );
    }

    // Rate limiting for free tier users (10 generations per day)
    // Only enforce if PromptHistory table exists (after migration)
    if (user.credits <= 50) { // Free tier users
      try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const todayGenerations = await prisma.$queryRaw<[{ count: bigint }]>`
          SELECT COUNT(*) as count FROM "PromptHistory"
          WHERE "userId" = ${user.id}
          AND "createdAt" >= ${today}
        `;
        
        const generationCount = Number(todayGenerations[0]?.count || 0);
        
        if (generationCount >= 10) {
          return NextResponse.json(
            { 
              success: false, 
              error: 'Daily limit reached. Free tier users can generate up to 10 prompts per day. Please upgrade to Pro for unlimited access.' 
            },
            { status: 429 }
          );
        }
      } catch (rateLimitError) {
        // Table doesn't exist yet - skip rate limiting until migration is run
        console.warn('Rate limiting skipped - PromptHistory table not found:', rateLimitError);
      }
    }

    // Get platform-specific configuration
    const platformConfig = getPlatformConfig(platform);

    // Build platform-optimized prompts using AI
    const systemPrompt = buildSystemPrompt(platform);
    const userPrompt = buildUserPrompt(
      platform,
      trimmedSubject,
      styles,
      mood,
      lighting,
      creativity,
      duration
    );

    // Call DeepSeek API with platform-specific prompts
    const apiKey = process.env.DEEPSEEK_API_KEY;
    if (!apiKey) {
      console.error('DeepSeek API key not set');
      return NextResponse.json({ success: false, error: 'DeepSeek API key not configured. Please contact administrator.' }, { status: 500 });
    }

    try {
      const deepSeekUrl = 'https://api.deepseek.com/v1/chat/completions';
      const deepSeekPayload = {
        model: 'deepseek-chat',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: creativity > 80 ? 0.9 : creativity > 50 ? 0.7 : 0.5,
        max_tokens: platformConfig.promptStyle === 'simple' ? 200 : platformConfig.promptStyle === 'detailed' ? 400 : 300
      };

      const response = await fetch(deepSeekUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify(deepSeekPayload)
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('DeepSeek API error:', errorText);
        return NextResponse.json({ success: false, error: 'DeepSeek API error', details: errorText }, { status: 500 });
      }

      const result = await response.json();
      const rawAiPrompt = result.choices?.[0]?.message?.content || '';
      const aiPrompt = shouldUseFallbackPrompt(trimmedSubject, rawAiPrompt)
        || isPromptTooSimple({
          generatedPrompt: rawAiPrompt,
          subject: trimmedSubject,
          styles,
          mood,
          lighting,
          platform,
        })
        ? buildFallbackPrompt({
            platform,
            subject: trimmedSubject,
            styles,
            mood,
            lighting,
            creativity,
            duration,
          })
        : rawAiPrompt.trim();

      // Generate negative prompt if requested (for platforms that support it)
      let negativePrompt = '';
      if (includeNegative && ['midjourney', 'dall-e', 'nanobanana', 'stable-diffusion', 'qwen'].includes(platform)) {
        negativePrompt = 'blurry, low quality, distorted, watermark, text, signature, deformed, ugly, bad anatomy, poorly drawn, amateur';
      }

      // Log prompt generation for analytics (optional - won't crash if table doesn't exist)
      try {
        await prisma.promptHistory.create({
          data: {
            userId: user.id,
            platform,
            creditsUsed: creditsRequired
          }
        });
      } catch (historyError) {
        // Table might not exist yet - migration pending
        console.warn('Could not log to PromptHistory:', historyError);
      }

      // Deduct credits and track monthly usage after successful generation
      await prisma.user.update({
        where: { email: session.user.email },
        data: { 
          credits: { decrement: creditsRequired },
          monthlyCreditsUsed: { increment: creditsRequired }
        }
      });

      return NextResponse.json({
        success: true,
        data: {
          prompt: aiPrompt,
          negativePrompt,
          platform,
          creditsUsed: creditsRequired,
        }
      });
    } catch (err) {
      console.error('DeepSeek API fetch failed:', err);
      return NextResponse.json({ success: false, error: 'DeepSeek API fetch failed', details: String(err) }, { status: 500 });
    }
  } catch (error) {
    console.error('Prompt generation error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}