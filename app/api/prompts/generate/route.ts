
import { NextRequest, NextResponse } from 'next/server';
// Use process.env for server-side environment variables


export async function POST(request: NextRequest) {
  try {
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

    // Build the prompt as before
    const styleText = styles?.length > 0 ? `, ${styles.join(', ')} style` : '';
    const moodText = mood ? `, ${mood.toLowerCase()} mood` : '';
    const lightingText = lighting ? `, ${lighting.toLowerCase()} lighting` : '';
    let prompt = `${subject}${styleText}${moodText}${lightingText}`;
    if (platform === 'sora') {
      prompt += `, professional cinematography, smooth motion`;
      if (duration) {
        prompt += `, ${duration}s duration`;
      }
    } else if (platform === 'midjourney') {
      prompt += ` --ar 16:9 --v 6`;
      if (creativity > 80) {
        prompt += ' --style raw';
      }
    } else if (platform === 'veo3') {
      prompt += ', high-quality video generation, realistic motion';
    } else if (platform === 'dall-e') {
      prompt += ', high-resolution, detailed artwork';
    } else if (platform === 'qwen') {
      prompt += ', ultra-realistic, high-quality Chinese AI art generation';
      if (creativity > 80) {
        prompt += ', intricate details, photographic quality';
      }
    }
    if (creativity > 80) {
      prompt += ', highly detailed, ultra-creative composition';
    }
    let negativePrompt = '';
    if (includeNegative) {
      negativePrompt = 'blurry, low quality, distorted, watermark, text, signature';
    }

    // Call DeepSeek API
    const apiKey = process.env.DEEPSEEK_API_KEY;
    if (!apiKey) {
      console.error('DeepSeek API key not set');
      return NextResponse.json({ success: false, error: 'DeepSeek API key not set' }, { status: 500 });
    }

    try {
      const deepSeekUrl = 'https://api.deepseek.com/v1/chat/completions';
      const deepSeekPayload = {
        model: 'deepseek-chat',
        messages: [
          { role: 'system', content: 'You are an expert AI prompt engineer.' },
          { role: 'user', content: `Generate a prompt for platform: ${platform}.\nPrompt: ${prompt}${negativePrompt ? `\nNegative prompt: ${negativePrompt}` : ''}` }
        ],
        temperature: 0.7
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

      return NextResponse.json({
        success: true,
        data: {
          prompt: aiPrompt,
          negativePrompt,
          platform,
          creditsUsed: platform === 'sora' ? 5 : 3,
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