import { NextResponse } from 'next/server';
import { BlogPost } from '@/types';

// Mock blog posts storage (same as in main blog route)
// In production, this would query a database
const blogPosts: BlogPost[] = [
  {
    id: '1',
    title: 'The Future of AI Video Generation: Sora vs Veo 3 Comparison',
    excerpt: 'A comprehensive analysis of the latest AI video generation models and their capabilities for content creators.',
    content: `
# The Future of AI Video Generation: Sora vs Veo 3 Comparison

The landscape of AI-powered video generation has evolved dramatically in recent years, with two major players leading the charge: OpenAI's Sora and Google's Veo 3. Both platforms represent significant leaps forward in generative AI technology, offering unique approaches to creating high-quality video content from simple text prompts.

## OpenAI Sora: Pioneering Video Generation

OpenAI's Sora has set new standards for video generation with its ability to create up to 60-second videos with remarkable consistency and quality. The platform excels in:

- **Temporal Consistency**: Maintaining coherent motion and object permanence across frames
- **Complex Scene Understanding**: Interpreting detailed prompts with multiple characters and interactions
- **Photorealistic Quality**: Producing videos that often blur the line between generated and real content

## Google Veo 3: The Next Evolution

Google's Veo 3 brings advanced computer vision capabilities to video generation, focusing on:

- **Enhanced Scene Comprehension**: Better understanding of spatial relationships and physics
- **Improved Object Tracking**: Maintaining object identity and properties throughout sequences
- **Advanced Prompt Engineering**: More nuanced interpretation of creative instructions

## Key Differences and Use Cases

### Sora Advantages:
- Longer video sequences (up to 60 seconds)
- Better for narrative storytelling
- Superior character consistency

### Veo 3 Advantages:
- Enhanced technical precision
- Better for educational and technical content
- More accurate physics simulation

## The Future of AI Video Generation

As both platforms continue to evolve, we can expect to see:

1. **Integration with Prompt Engineering Tools**: Making video generation more accessible
2. **Real-time Generation Capabilities**: Faster processing for immediate feedback
3. **Enhanced Creative Controls**: More granular control over style, pacing, and composition
4. **Industry-Specific Applications**: Tailored solutions for marketing, education, and entertainment

The competition between Sora and Veo 3 ultimately benefits creators, pushing both platforms to innovate and improve, leading to more powerful and accessible video generation tools for everyone.
    `,
    author: 'AI Prompt Team',
    publishedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    category: 'AI Models',
    tags: ['Sora', 'Veo 3', 'Video AI', 'Comparison', 'AI Tools'],
    readTime: '8 min read',
    featured: true
  },
  {
    id: '2',
    title: 'Mastering Prompt Engineering: Advanced Techniques for 2025',
    excerpt: 'Learn the latest prompt engineering strategies that professionals use to get better results from AI models.',
    content: `
# Mastering Prompt Engineering: Advanced Techniques for 2025

Prompt engineering has evolved from a simple art to a sophisticated science. As AI models become more powerful and nuanced, the techniques for communicating with them have become increasingly important.

## The Evolution of Prompt Engineering

In 2025, prompt engineering encompasses:

- **Contextual Awareness**: Understanding how AI models interpret context
- **Multi-modal Prompting**: Combining text, images, and other media
- **Chain-of-Thought Reasoning**: Guiding AI through complex problem-solving steps
- **Meta-prompting**: Creating prompts that help AI generate better prompts

## Advanced Techniques

### 1. Layered Prompting
Build complexity gradually by starting with basic concepts and adding layers of detail.

### 2. Negative Prompting
Use negative prompts to exclude unwanted elements and refine outputs.

### 3. Role-Based Prompting
Assign specific roles or personas to AI for more targeted responses.

### 4. Template Systems
Develop reusable prompt templates for consistent results across projects.

## Best Practices for 2025

- **Be Specific**: Vague prompts lead to unpredictable results
- **Use Examples**: Show the AI what you want with concrete examples
- **Iterate and Refine**: Treat prompting as an iterative process
- **Understand Limitations**: Know what each AI model can and cannot do

## The Future of Prompt Engineering

As AI technology advances, we expect to see:

- **Automated Prompt Optimization**: AI helping to improve its own prompts
- **Industry-Specific Prompt Libraries**: Curated prompts for different fields
- **Real-time Prompt Adjustment**: Dynamic prompting based on output quality
- **Collaborative Prompt Development**: Teams working together on prompt strategies

The key to success in prompt engineering is continuous learning and adaptation as AI capabilities expand.
    `,
    author: 'Sarah Chen',
    publishedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    category: 'Prompt Engineering',
    tags: ['Techniques', 'Best Practices', 'Advanced', 'AI Communication'],
    readTime: '12 min read'
  }
];

// GET /api/blog/[id] - Get a specific blog post
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const post = blogPosts.find(p => p.id === params.id);
    
    if (!post) {
      return NextResponse.json(
        { success: false, error: 'Blog post not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      post
    });
  } catch (error) {
    console.error('Blog post fetch error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch blog post' },
      { status: 500 }
    );
  }
}
