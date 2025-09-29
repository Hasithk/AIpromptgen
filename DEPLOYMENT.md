# 🚀 Production Deployment Guide

## Prerequisites

1. **GitHub Repository** - Push your code to GitHub
2. **Vercel Account** - Sign up at https://vercel.com
3. **PostgreSQL Database** - Choose a provider:
   - [Neon](https://neon.tech/) (Recommended - Free tier)
   - [Supabase](https://supabase.com/) (Free tier + additional features)
   - [PlanetScale](https://planetscale.com/) (MySQL alternative)
4. **DeepSeek API Key** - Get from https://platform.deepseek.com/

## Step 1: Set up PostgreSQL Database

### Option A: Neon (Recommended)
1. Go to https://neon.tech/ and create an account
2. Create a new project
3. Copy the connection string (starts with `postgresql://`)
4. The format will be: `postgresql://username:password@host/database?sslmode=require`

### Option B: Supabase
1. Go to https://supabase.com/ and create an account
2. Create a new project
3. Go to Settings → Database
4. Copy the Connection String (URI format)

## Step 2: Deploy to Vercel

### 2.1 Connect Repository
1. Go to https://vercel.com/dashboard
2. Click "New Project"
3. Import your GitHub repository
4. Choose the root directory: `project/`

### 2.2 Configure Environment Variables
In Vercel dashboard → Settings → Environment Variables, add:

```
DATABASE_URL=your_postgresql_connection_string
DEEPSEEK_API_KEY=sk-your-deepseek-api-key
NEWS_API_KEY=88ec2cc8ec274a1ba697cfdb6b353ab3
NEWS_API_BASE_URL=https://newsapi.org/v2
NEXTAUTH_URL=https://your-app-name.vercel.app
NEXTAUTH_SECRET=generate-a-random-32-character-string
CRON_SECRET=generate-another-random-string
```

### 2.3 Database Migration
After first deployment:
1. Go to Vercel dashboard → Functions → Terminal
2. Run: `npx prisma migrate deploy`
3. Or use the Vercel CLI locally:
   ```bash
   vercel env pull .env.local
   npx prisma migrate deploy
   ```

## Step 3: Verify Deployment

### 3.1 Test API Endpoints
- `https://your-app.vercel.app/api/blog` - Should return blog posts
- `https://your-app.vercel.app/api/news/latest` - Should return AI news
- `https://your-app.vercel.app/api/blog/cron` - Should return cron status

### 3.2 Test Automated Blog Generation
```bash
curl -X POST https://your-app.vercel.app/api/blog/cron \
  -H "Authorization: Bearer your-cron-secret"
```

### 3.3 Verify Cron Job
- Check Vercel dashboard → Functions → Cron
- The job should run every 3 days at midnight UTC
- Check logs for successful execution

## Step 4: Custom Domain (Optional)

1. In Vercel dashboard → Settings → Domains
2. Add your custom domain
3. Update `NEXTAUTH_URL` environment variable

## Troubleshooting

### Database Connection Issues
- Ensure connection string includes `sslmode=require`
- Check if IP whitelist is required (Neon/Supabase usually don't need this)

### Cron Job Not Working
- Verify `CRON_SECRET` environment variable is set
- Check Vercel Functions logs
- Ensure your plan supports Cron Jobs

### DeepSeek API Issues
- Verify API key is valid
- Check rate limits
- Monitor usage in DeepSeek dashboard

## Environment Variables Summary

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | Yes | PostgreSQL connection string |
| `DEEPSEEK_API_KEY` | Yes | AI content generation |
| `NEWS_API_KEY` | Yes | Already configured (88ec2cc8ec274a1ba697cfdb6b353ab3) |
| `CRON_SECRET` | Yes | Security for cron endpoint |
| `NEXTAUTH_URL` | Yes | Your app URL |
| `NEXTAUTH_SECRET` | Yes | Random string for session security |

## Post-Deployment Checklist

- [ ] Database connection working
- [ ] Blog posts displaying correctly
- [ ] News API returning data
- [ ] Cron job configured and running
- [ ] SSL certificate active
- [ ] Custom domain configured (if applicable)
- [ ] Environment variables secured

Your AI blog will automatically generate new posts every 3 days using the latest AI news! 🎉
