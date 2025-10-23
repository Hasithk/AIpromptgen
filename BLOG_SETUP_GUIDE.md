# Blog Automation & News Page Setup Guide

## Overview
Your aipromptgen.app now has:
1. ✅ **News API Integration** (`/api/news/latest`) - Fetches real AI news from NewsAPI
2. ✅ **News Page Component** (`/app/news/page.tsx`) - Displays news with filtering and search
3. ✅ **Daily Blog Generation Cron** (`/api/cron/generate-blog`) - Automatically generates blog posts from news
4. ✅ **Blog API** (`/api/blog`) - Stores and retrieves blog posts

## How It Works

### 1. News Page (`/news`)
- Fetches latest AI news from `/api/news/latest`
- Displays news in an interactive feed with:
  - Search functionality
  - Category filtering
  - Relative timestamps (e.g., "2h ago")
  - Direct links to source articles
- Auto-refreshes news every 30 minutes
- Fully responsive design

### 2. Daily Blog Generation (`/api/cron/generate-blog`)
This endpoint:
1. Fetches the 5 latest AI news items from `/api/news/latest`
2. Sends the news context to DeepSeek API
3. DeepSeek generates a comprehensive blog post based on the news
4. Saves the blog post to your database via `/api/blog`

**Response Example:**
```json
{
  "success": true,
  "message": "Blog post generated successfully",
  "blogPost": {
    "id": "blog-xyz",
    "title": "The Future of AI...",
    "excerpt": "...",
    "content": "...",
    "author": "AI News Bot",
    "category": "AI News",
    "tags": ["AI", "News"],
    "featured": false
  },
  "newsUsed": 5
}
```

## Setup Instructions

### Step 1: Verify Environment Variables
Make sure your `.env.local` has:
```
DEEPSEEK_API_KEY=sk-50be0064c10545699830f8b4b017f93f
NEWS_API_KEY=88ec2cc8ec274a1ba697cfdb6b353ab3
NEWS_API_BASE_URL=https://newsapi.org/v2
CRON_SECRET=your-secure-cron-secret-key
NEXTAUTH_URL=http://localhost:3000
```

### Step 2: Set Up Daily Blog Generation

**Option A: Using EasyCron (Recommended for Production)**
1. Go to https://www.easycron.com/
2. Create a free account
3. Click "Add Cron Job"
4. Set up a daily cron job:
   - **URL:** `https://yourdomain.com/api/cron/generate-blog?secret=your-secure-cron-secret-key`
   - **Frequency:** Daily (e.g., 9:00 AM UTC)
   - **Cron Expression:** `0 9 * * *`
5. Test the cron job

**Option B: Using CRON-JOB.ORG**
1. Go to https://cron-job.org/
2. Create an account
3. Add a new cronjob:
   - **URL:** `https://yourdomain.com/api/cron/generate-blog?secret=your-secure-cron-secret-key`
   - **Execution times:** Daily at your preferred time
4. Enable the cron job

**Option C: Local Testing (Development)**
Test the endpoint manually:
```bash
# Using curl
curl "http://localhost:3000/api/cron/generate-blog?secret=your-secure-cron-secret-key"

# Using PowerShell
Invoke-WebRequest -Uri "http://localhost:3000/api/cron/generate-blog?secret=your-secure-cron-secret-key"
```

### Step 3: Test Everything Locally

1. **Start your dev server:**
   ```bash
   npm run dev
   ```

2. **Visit the news page:**
   - Navigate to `http://localhost:3000/news`
   - Should display real AI news from NewsAPI

3. **Manually trigger blog generation:**
   ```bash
   curl "http://localhost:3000/api/cron/generate-blog?secret=your-secure-cron-secret-key"
   ```

4. **Check the blog page:**
   - Navigate to `http://localhost:3000/blog`
   - Should show the newly generated blog post

## Files Created/Modified

### Created:
- `/app/api/cron/generate-blog/route.ts` - Daily blog generation endpoint
- `/components/news-page.tsx` - News page component with filtering

### Modified:
- `/app/news/page.tsx` - Now uses the new NewsPage component

### Existing (Already Working):
- `/app/api/news/latest/route.ts` - Fetches AI news from NewsAPI
- `/app/api/blog/route.ts` - Blog CRUD operations
- `/components/blog-page.tsx` - Blog listing and display

## Troubleshooting

### News Not Showing
1. Check that `NEWS_API_KEY` is set in `.env.local`
2. Verify the key is valid by testing directly:
   ```bash
   curl "https://newsapi.org/v2/everything?q=AI&sortBy=publishedAt&apiKey=YOUR_KEY"
   ```
3. Check the News page for error messages

### Blog Generation Failing
1. Verify `DEEPSEEK_API_KEY` has sufficient credits
2. Check that `CRON_SECRET` matches in the URL and `.env.local`
3. Check server logs for detailed error messages
4. Make sure the cron URL is accessible publicly (not just localhost)

### News Updates Not Appearing
1. The news page auto-refreshes every 30 minutes
2. You can manually refresh by clicking the Refresh button
3. Check the last updated timestamp at the bottom of the news page

## Key Features Implemented

✅ **News Feed**
- Real-time AI news from NewsAPI
- Search and filter by category
- Responsive design
- Auto-refresh every 30 minutes

✅ **Daily Blog Generation**
- Automatic blog post creation from trending AI news
- Uses DeepSeek API for intelligent content generation
- Saves to database for persistence
- Fallback error handling

✅ **Integration**
- News widget on homepage
- News page with full listing
- Blog page displays all generated content
- Credit system integration

## Next Steps (Optional Enhancements)

1. **Add Email Notifications**
   - Send daily digest of new blog posts and news

2. **Implement Database Persistence**
   - Move from mock data to Prisma PostgreSQL
   - Track blog generation history

3. **Add Social Sharing**
   - Share news items and blog posts to Twitter, LinkedIn

4. **Analytics**
   - Track most popular news categories
   - Monitor blog post engagement

5. **SEO Optimization**
   - Add sitemap for blog posts
   - Implement schema markup for news

## Support

For issues or questions:
1. Check the error logs in your terminal
2. Verify all environment variables are set
3. Test API endpoints directly with curl/Postman
4. Check the PRD for feature requirements

Happy blogging! 🚀
