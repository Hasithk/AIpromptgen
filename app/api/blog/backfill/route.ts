import { NextRequest, NextResponse } from 'next/server';
import { saveBlogPost } from '@/lib/blog-file-storage';

const CRON_SECRET = process.env.CRON_SECRET || 'your-secure-cron-secret-key';
const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;

const topics = [
  'AI Industry Weekly Update',
  'Cutting-Edge Multimodal AI Breakthroughs',
  'Practical Prompt Engineering Wins',
  'Enterprise AI Adoption Trends',
  'AI Video & Image Generation Advances',
  'Open Source AI Momentum',
  'Responsible AI & Governance',
  'AI Infrastructure and Performance',
];

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization');
    if (authHeader && authHeader !== `Bearer ${CRON_SECRET}`) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { startDate, endDate, days } = await req.json().catch(() => ({ startDate: undefined, endDate: undefined, days: undefined }));

    const start = startDate ? new Date(startDate) : new Date();
    const end = endDate ? new Date(endDate) : new Date();

    // If only days provided, backfill that many days backwards from today
    if (days && !startDate && !endDate) {
      start.setHours(0, 0, 0, 0);
      end.setDate(start.getDate() - (days - 1));
    }

    // Ensure chronological loop from oldest to newest
    const from = end < start ? end : start;
    const to = end < start ? start : end;
    from.setHours(0, 0, 0, 0);
    to.setHours(0, 0, 0, 0);

    const generated = [] as { id: string; title: string; publishedAt: string }[];

    for (let d = new Date(from); d <= to; d.setDate(d.getDate() + 1)) {
      const date = new Date(d);
      const topic = topics[(generated.length) % topics.length];
      const post = await generatePost(topic, date);
      await saveBlogPost(post);
      generated.push({ id: post.id, title: post.title, publishedAt: post.publishedAt });
      // small delay to respect API rate limits
      await new Promise((res) => setTimeout(res, 250));
    }

    return NextResponse.json({ success: true, count: generated.length, posts: generated });
  } catch (error) {
    console.error('[Blog Backfill] Error:', error);
    return NextResponse.json({ success: false, error: 'Backfill failed' }, { status: 500 });
  }
}

async function generatePost(topic: string, date: Date) {
  const prompt = `You are an expert AI technology writer. Write a concise but insightful AI blog article for ${date.toDateString()} about "${topic}".

Requirements:
- Title as H1 (# Title)
- 5-7 sections with clear headings (##)
- Separate paragraphs with blank lines
- Include bullet lists where helpful
- 700-900 words
- Actionable takeaways at the end
- Tone: clear, professional, optimistic
- Keep content timeless (avoid specific short-lived news)
`;

  let content = '';
  if (DEEPSEEK_API_KEY) {
    try {
      const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${DEEPSEEK_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'deepseek-chat',
          messages: [
            { role: 'system', content: 'You write engaging, well-structured AI blog posts in markdown.' },
            { role: 'user', content: prompt },
          ],
          temperature: 0.7,
          max_tokens: 2600,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        content = data.choices?.[0]?.message?.content || '';
      }
    } catch (err) {
      console.error('[Blog Backfill] DeepSeek error:', err);
    }
  }

  if (!content) {
    content = `# ${topic}

AI continues to evolve rapidly, reshaping how teams build products, create content, and operate. This update captures the most important shifts and what they mean for builders right now.

## Why this matters

- Faster model releases and better reasoning are enabling richer experiences.
- Multimodal capabilities are moving from novelty to necessity.
- Safety, governance, and reliability are becoming first-class requirements.

## Key developments

- Model quality and context windows keep expanding, letting teams ship with less prompt hacking.
- Video and 3D generation are accelerating, opening new creative workflows.
- Open-source models are closing the gap, giving teams deployment flexibility.

## Impact for teams

- Product teams can validate ideas faster with AI-native prototypes.
- Content teams can scale production while maintaining quality.
- Engineering teams must plan for evaluation, safety, and observability from day one.

## Best practices

- Design prompts with structure: roles, objectives, constraints, and examples.
- Build evaluation harnesses early to track quality drift.
- Keep humans-in-the-loop for high-impact decisions.

## Looking ahead

Expect faster iteration cycles, richer multimodal experiences, and higher expectations for trust and safety. Teams that combine speed with discipline will win.

## Takeaways

- Treat AI as a product capability, not a bolt-on.
- Invest in evaluation and monitoring.
- Keep experimenting—this space moves weekly.`;
  }

  const titleMatch = content.match(/^#\s+(.+)$/m);
  const title = titleMatch ? titleMatch[1].trim() : `${topic} - ${date.toDateString()}`;
  const cleanedContent = content.replace(/^#\s+.+$/m, '').trim();
  const excerptSource = cleanedContent.split('\n\n')[0] || cleanedContent.slice(0, 220);
  const excerpt = excerptSource.replace(/[#*_`]/g, '').slice(0, 180) + '...';

  return {
    id: `blog-${date.toISOString().split('T')[0]}`,
    title,
    excerpt,
    content,
    author: 'AI News Bot',
    category: 'AI Technology',
    tags: ['AI', 'Technology', 'Innovation'],
    featured: false,
    readTime: '6 min read',
    publishedAt: date.toISOString(),
    createdAt: date.toISOString(),
    updatedAt: date.toISOString(),
  };
}

export async function GET() {
  return NextResponse.json({ success: true, message: 'Use POST with startDate/endDate or days to backfill blogs.' });
}
