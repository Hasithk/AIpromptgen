# DeepSeek API Blog Generation

This document explains how the automated blog generation system uses the DeepSeek API to create high-quality, engaging blog posts from AI news.

## Overview

The system automatically:
1. Fetches the latest AI news every 3 days
2. Sends news data to DeepSeek API for content generation
3. Creates SEO-optimized blog posts
4. Publishes them automatically to the blog page

## API Integration

### Function: `generateBlogWithDeepSeek(newsItems: NewsItem[])`

This function takes an array of NewsItem objects and generates a markdown blog post using the DeepSeek API.

**Parameters:**
- `newsItems`: Array of NewsItem objects containing:
  - `id`: Unique identifier
  - `title`: News headline
  - `description`: News summary
  - `url`: Source URL
  - `publishedAt`: Publication date
  - `source`: News source
  - `category`: News category

**Returns:**
- `Promise<string>`: Markdown-formatted blog content

### How It Works

1. **News Context Preparation**: The function formats news items into a structured context for the AI
2. **Prompt Engineering**: Creates a comprehensive prompt instructing DeepSeek to generate engaging blog content
3. **API Call**: Sends the prompt to DeepSeek's chat completion endpoint
4. **Content Processing**: Extracts and formats the generated markdown content
5. **Fallback Handling**: Falls back to local generation if API is unavailable

### Prompt Structure

The system sends a detailed prompt to DeepSeek that includes:
- Current date for relevance
- Formatted news items with metadata
- Content requirements (structure, tone, SEO optimization)
- Word count guidelines (1500-2500 words)
- Specific sections to include

### Example API Request

```json
{
  "model": "deepseek-chat",
  "messages": [
    {
      "role": "system", 
      "content": "You are an expert AI news blogger..."
    },
    {
      "role": "user",
      "content": "Create a comprehensive blog post about..."
    }
  ],
  "max_tokens": 4000,
  "temperature": 0.7,
  "stream": false
}
```

## Configuration

### Environment Variables

Set these in your `.env.local` file:

```env
DEEPSEEK_API_KEY=your-deepseek-api-key-here
CRON_SECRET=your-secure-cron-secret-key
NEWS_API_KEY=88ec2cc8ec274a1ba697cfdb6b353ab3
```

### API Endpoint

The cron endpoint handles automated generation:
- **POST** `/api/blog/cron` - Triggers blog generation
- **GET** `/api/blog/cron` - Returns generation status

## Content Quality Features

The DeepSeek integration ensures:

### SEO Optimization
- Natural keyword integration
- Trending topic analysis
- Meta-friendly titles and descriptions

### Content Structure
- Clear hierarchical headings (H1, H2, H3)
- Logical flow from introduction to conclusion
- Scannable bullet points and lists

### Engagement Features
- Professional yet accessible tone
- Current events analysis
- Market implications and future outlook
- Trending keywords section

### Technical Excellence
- Proper markdown formatting
- Consistent style and voice
- Automatic attribution and sourcing

## Error Handling

The system includes robust error handling:

1. **API Failures**: Falls back to local content generation
2. **Rate Limiting**: Implements retry logic with exponential backoff
3. **Invalid Responses**: Validates API response format
4. **Network Issues**: Graceful degradation to backup systems

## Testing

Test the DeepSeek integration:

```bash
# Set your API key
export DEEPSEEK_API_KEY=your-key-here

# Run the test script
node scripts/test-deepseek-blog.js
```

The test script will:
- Validate your API key
- Generate sample blog content
- Display content statistics
- Verify the integration is working

## Deployment

The system works with various deployment platforms:

### Vercel
Uses `vercel.json` cron configuration to trigger generation every 3 days.

### GitHub Actions
Automated workflow runs on schedule to generate new blog posts.

### Railway
Server-side cron job calls the generation endpoint.

## Monitoring

Monitor the system via:
- Cron status endpoint: `GET /api/blog/cron`
- Server logs for generation activities
- Blog page for new posts every 3 days

## Benefits

### For Content Quality
- Consistent, professional writing style
- Up-to-date AI industry insights
- SEO-optimized for better search rankings

### For Automation
- Zero manual intervention required
- Reliable 3-day publishing schedule
- Trending topic awareness

### For Performance
- Fast generation (typically < 30 seconds)
- Efficient API usage
- Graceful fallback mechanisms

The DeepSeek integration transforms raw AI news into engaging, SEO-friendly blog content that keeps your audience informed about the latest developments in artificial intelligence.
