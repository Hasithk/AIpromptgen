
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { buildSystemPrompt, buildUserPrompt, getPlatformConfig } from '@/lib/platform-configs';
// Use process.env for server-side environment variables


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

    if (!subject || !platform) {
      return NextResponse.json(
        { success: false, error: 'Subject and platform are required' },
        { status: 400 }
      );
    }

    // Calculate credits required (doubled cost)
    // Sora platforms use more credits due to complexity
    const creditsRequired = platform.startsWith('sora') ? 10 : 6;

    // Check user credits before making API call
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true, credits: true, email: true, name: true }
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
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
      subject,
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
      const aiPrompt = result.choices?.[0]?.message?.content || '';

      // Generate negative prompt if requested (for platforms that support it)
      let negativePrompt = '';
      if (includeNegative && ['midjourney', 'dall-e', 'nanobanana'].includes(platform)) {
        negativePrompt = 'blurry, low quality, distorted, watermark, text, signature, deformed, ugly, bad anatomy';
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