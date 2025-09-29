const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function createSampleBlogPost() {
  try {
    // Create a sample blog post
    const blogPost = await prisma.blogPost.create({
      data: {
        title: "Welcome to AI Prompts Generator - Your Ultimate AI Content Creation Hub",
        excerpt: "Discover the power of AI-driven content creation with our comprehensive prompt generator. From image generation to text creation, explore the latest in artificial intelligence technology.",
        content: `# Welcome to AI Prompts Generator

Welcome to the future of content creation! Our AI Prompts Generator is your one-stop solution for creating engaging, high-quality content using the power of artificial intelligence.

## What We Offer

### 🚀 Advanced AI Prompt Generation
- Create detailed prompts for image generation
- Generate text content for various platforms
- Customize outputs based on your specific needs

### 📰 Latest AI News
Stay updated with the latest developments in artificial intelligence, including:
- Breakthrough AI technologies
- Industry updates and trends
- New tool releases and updates

### 💡 Creative Content Solutions
Whether you're creating content for:
- Social media platforms
- Marketing campaigns
- Educational materials
- Creative projects

Our AI-powered tools help you generate exactly what you need.

## Getting Started

1. **Explore our Prompt Generator**: Create custom prompts for any AI platform
2. **Browse Latest News**: Stay informed about AI developments  
3. **Join our Community**: Connect with other AI enthusiasts

## Why Choose AI Prompts Generator?

- **Easy to Use**: Intuitive interface designed for all skill levels
- **Constantly Updated**: Regular updates with the latest AI capabilities
- **Community Driven**: Built by AI enthusiasts, for AI enthusiasts
- **Free to Start**: Begin your AI journey with our free tools

Ready to revolutionize your content creation process? Start generating prompts today!

---

*Stay tuned for more updates and features as we continue to expand our AI-powered platform.*`,
        author: "AI News Bot",
        category: "Welcome",
        tags: "ai, prompts, generator, welcome, getting-started",
        featured: true,
        readTime: "3 min read"
      }
    });

    console.log('Sample blog post created:', blogPost.title);
    console.log('Blog post ID:', blogPost.id);
    
    return blogPost;
  } catch (error) {
    console.error('Error creating sample blog post:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createSampleBlogPost();
