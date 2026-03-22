# Blog Generation Fix - GitHub Secrets Setup

## Issue Fixed
The blog generation was failing with **HTTP 524 error (Cloudflare timeout)** because the workflow was making HTTP requests to the production website, which was timing out.

## Solution Applied
✅ Updated the workflow to **run blog generation directly** without HTTP calls
✅ Created a new direct Node.js script: `scripts/generate-blog-direct.js`
✅ This eliminates the timeout issue by running generation in the GitHub Actions environment

---

## Required GitHub Secrets Setup

You **MUST** set these secrets in your GitHub repository settings:

### 1. **DATABASE_URL** (Required)
- **Purpose**: PostgreSQL connection string for your Neon database
- **Where to get it**: 
  - Go to your [Neon Console](https://console.neon.tech/)
  - Copy the connection string (looks like: `postgresql://...`)
  - Ensure it includes `?sslmode=require`
- **Steps**:
  1. Go to your GitHub repo → Settings → Secrets and variables → Actions
  2. Click "New repository secret"
  3. Name: `DATABASE_URL`
  4. Value: Your full PostgreSQL connection string

### 2. **DEEPSEEK_API_KEY** (Required)
- **Purpose**: For generating blog content via DeepSeek API
- **Where to get it**: Your DeepSeek account (looks like: `sk-...`)
- **Steps**:
  1. Go to [DeepSeek](https://www.deepseek.com/) and get your API key
  2. In GitHub Settings → Secrets → Click "New repository secret"
  3. Name: `DEEPSEEK_API_KEY`
  4. Value: `sk-...` (your actual key)

### 3. **NEWS_API_KEY** (Required)
- **Purpose**: To fetch AI news articles from NewsAPI
- **Where to get it**: [NewsAPI.org](https://newsapi.org/)
- **Steps**:
  1. Sign up at NewsAPI.org and get your API key
  2. In GitHub Settings → Secrets → Click "New repository secret"
  3. Name: `NEWS_API_KEY`
  4. Value: Your NewsAPI key (looks like: `88ec2cc8ec274a1ba...`)

### 4. **NEXTAUTH_SECRET** (Required)
- **Purpose**: NextAuth.js secret for authentication
- **Where to get it**: You can use any secure random string
- **Generate one**: 
  ```
  node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
  ```
- **Steps**:
  1. Generate a random secret (see above command)
  2. In GitHub Settings → Secrets → Click "New repository secret"
  3. Name: `NEXTAUTH_SECRET`
  4. Value: Your generated secret string

---

## Testing the Fix

Once you've set all the secrets:

1. **Manual Test via GitHub UI**:
   - Go to Actions → Daily Blog Generation
   - Click "Run workflow" 
   - Choose your branch and number of posts (default: 2)
   - Click "Run workflow"
   - Watch the logs - should complete without 524 errors

2. **Check Logs**:
   - Click the workflow run
   - Check the "Generate Daily Blog Posts" step
   - Look for:
     ```
     ✅ Blog generation completed successfully
     ```

3. **Verify Database**:
   - Blog posts should appear in your database
   - Check your Neon database console to confirm new posts were created

---

## What Changed

### Before (Failed)
```
GitHub Actions → HTTP Request → API Endpoint → AI News API → NewsAPI
                                 ❌ 524 Timeout (Cloudflare)
```

### After (Works)
```
GitHub Actions → Direct Node Script → Database
                 ✅ No HTTP overhead
```

---

## If It Still Fails

Check these:
1. ✅ All 4 secrets are set in GitHub
2. ✅ DATABASE_URL is correct and accessible
3. ✅ DEEPSEEK_API_KEY is valid (check your DeepSeek balance)
4. ✅ NEWS_API_KEY is valid (check your NewsAPI account)
5. ✅ Check Vercel logs if database connection fails: `vercel logs`

---

## Production Vercel Setup (Optional)

For Vercel cron jobs to work (independent of GitHub Actions), also set these in Vercel:

1. Go to Vercel Dashboard → Project Settings → Environment Variables
2. Add all 4 secrets above
3. Apply to: Production environment

This allows Vercel's built-in cron (defined in `vercel.json`) to also generate blogs independently.
