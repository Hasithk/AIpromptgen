# Blog Generation System

## Overview
The blog system automatically generates daily AI news articles using DeepSeek API and stores them in `data/blog-articles.json`.

## Environment Variables Required
```env
DEEPSEEK_API_KEY=your-deepseek-api-key
CRON_SECRET=your-secure-cron-secret-key
NEXTAUTH_URL=https://aipromptgen.app (or http://localhost:3000)
```

## Available Endpoints

### 1. Generate Daily Blog Post
**Endpoint:** `POST /api/blog/generate-daily`

Generates a single blog post for today using the latest AI news.

**Usage:**
```bash
curl -X POST https://aipromptgen.app/api/blog/generate-daily \
  -H "Content-Type: application/json" \
  -d '{"secret": "your-cron-secret-here"}'
```

**PowerShell:**
```powershell
$body = @{ secret = "your-cron-secret-here" } | ConvertTo-Json
Invoke-RestMethod -Uri "https://aipromptgen.app/api/blog/generate-daily" -Method Post -Body $body -ContentType "application/json"
```

### 2. Generate Missed Blog Posts (Backfill)
**Endpoint:** `POST /api/blog/generate-missed`

Generates multiple blog posts for missed days. By default generates 7 days of posts.

**Usage:**
```bash
curl -X POST https://aipromptgen.app/api/blog/generate-missed \
  -H "Content-Type: application/json" \
  -d '{"secret": "your-cron-secret-here", "daysBack": 7}'
```

**PowerShell:**
```powershell
$body = @{ 
  secret = "your-cron-secret-here"
  daysBack = 7 
} | ConvertTo-Json
Invoke-RestMethod -Uri "https://aipromptgen.app/api/blog/generate-missed" -Method Post -Body $body -ContentType "application/json"
```

**Parameters:**
- `secret` (required): Your CRON_SECRET value
- `daysBack` (optional): Number of days to backfill (default: 7)

### 3. View Blog Articles
**Endpoint:** `GET /api/blog-articles`

View all generated blog articles.

**Usage:**
```bash
curl https://aipromptgen.app/api/blog-articles
```

**Query Parameters:**
- `category`: Filter by category
- `search`: Search in title, excerpt, or tags
- `limit`: Number of posts per page (default: 25)
- `page`: Page number (default: 1)

## How to Generate Missed Blog Posts

### Option 1: Using PowerShell (Recommended for Windows)

1. Open PowerShell
2. Run this command (replace with your actual CRON_SECRET):

```powershell
# Generate 7 days of missed blog posts
$body = @{ 
  secret = "your-cron-secret-here"
  daysBack = 7 
} | ConvertTo-Json

$response = Invoke-RestMethod -Uri "https://aipromptgen.app/api/blog/generate-missed" -Method Post -Body $body -ContentType "application/json"
Write-Host "Success: $($response.success)"
Write-Host "Message: $($response.message)"
Write-Host "Generated Articles:"
$response.articles | ForEach-Object { Write-Host "  - $($_.title) ($($_.publishedAt))" }
```

### Option 2: Using curl

```bash
curl -X POST https://aipromptgen.app/api/blog/generate-missed \
  -H "Content-Type: application/json" \
  -d '{"secret": "your-cron-secret-here", "daysBack": 7}'
```

### Option 3: Create a Local Test Script

Create a file named `generate-missed-blogs.ps1`:

```powershell
# generate-missed-blogs.ps1
$CRON_SECRET = $env:CRON_SECRET
$BASE_URL = "https://aipromptgen.app"
$DAYS_BACK = 7

if (-not $CRON_SECRET) {
  Write-Host "Error: CRON_SECRET environment variable not set" -ForegroundColor Red
  exit 1
}

Write-Host "Generating $DAYS_BACK days of missed blog posts..." -ForegroundColor Cyan

$body = @{ 
  secret = $CRON_SECRET
  daysBack = $DAYS_BACK 
} | ConvertTo-Json

try {
  $response = Invoke-RestMethod -Uri "$BASE_URL/api/blog/generate-missed" -Method Post -Body $body -ContentType "application/json"
  
  if ($response.success) {
    Write-Host "✓ Success!" -ForegroundColor Green
    Write-Host "Message: $($response.message)" -ForegroundColor Green
    Write-Host "`nGenerated Articles:" -ForegroundColor Cyan
    $response.articles | ForEach-Object { 
      $date = [DateTime]::Parse($_.publishedAt).ToString("yyyy-MM-dd")
      Write-Host "  ✓ $date - $($_.title)" -ForegroundColor White
    }
  } else {
    Write-Host "✗ Failed: $($response.error)" -ForegroundColor Red
  }
} catch {
  Write-Host "✗ Error: $($_.Exception.Message)" -ForegroundColor Red
}
```

Then run:
```powershell
./generate-missed-blogs.ps1
```

## Automation Setup

### Digital Ocean Cron Job

Set up a daily cron job in your Digital Ocean app:

1. Go to your App Settings → Cron Jobs
2. Add a new job:
   - Schedule: `0 0 * * *` (daily at midnight)
   - Command: 
   ```bash
   curl -X POST https://aipromptgen.app/api/blog/generate-daily -H "Content-Type: application/json" -d '{"secret": "your-cron-secret-here"}'
   ```

### Alternative: GitHub Actions

Create `.github/workflows/daily-blog.yml`:

```yaml
name: Generate Daily Blog

on:
  schedule:
    - cron: '0 0 * * *'  # Daily at midnight UTC
  workflow_dispatch:  # Manual trigger

jobs:
  generate:
    runs-on: ubuntu-latest
    steps:
      - name: Generate Blog Post
        run: |
          curl -X POST https://aipromptgen.app/api/blog/generate-daily \
            -H "Content-Type: application/json" \
            -d '{"secret": "${{ secrets.CRON_SECRET }}"}'
```

## Troubleshooting

### Blog Not Generating

1. **Check Environment Variables:**
   ```powershell
   # In your production environment
   echo $env:DEEPSEEK_API_KEY
   echo $env:CRON_SECRET
   ```

2. **Test API Manually:**
   ```powershell
   $body = @{ secret = "your-secret" } | ConvertTo-Json
   Invoke-RestMethod -Uri "https://aipromptgen.app/api/blog/generate-daily" -Method Post -Body $body -ContentType "application/json"
   ```

3. **Check Logs:**
   - Digital Ocean: App → Logs
   - Look for errors related to DeepSeek API or file system

4. **Verify News API:**
   ```bash
   curl https://aipromptgen.app/api/news/latest
   ```

### Common Issues

- **401 Unauthorized:** Wrong CRON_SECRET
- **Failed to fetch news:** News API not working
- **DeepSeek API error:** Invalid DEEPSEEK_API_KEY or rate limit
- **File system error:** Check if `data/` directory has write permissions

## File Structure

```
data/
  blog-articles.json  # Generated blog posts stored here

app/
  api/
    blog/
      generate-daily/route.ts    # Single daily post
      generate-missed/route.ts   # Multiple missed posts
    blog-articles/route.ts       # CRUD operations
    news/
      latest/route.ts            # News source
  blog/
    page.tsx                     # Blog page
components/
  blog-page.tsx                  # Blog UI component
```

## Quick Start Guide

**To generate missed blog posts right now:**

1. Find your CRON_SECRET (check your `.env` file or Digital Ocean environment variables)

2. Open PowerShell and run:
```powershell
$body = @{ secret = "PASTE-YOUR-CRON-SECRET-HERE"; daysBack = 7 } | ConvertTo-Json
Invoke-RestMethod -Uri "https://aipromptgen.app/api/blog/generate-missed" -Method Post -Body $body -ContentType "application/json"
```

3. Check your blog page: https://aipromptgen.app/blog

4. The posts will be saved to `data/blog-articles.json` in your app

That's it! 🎉
