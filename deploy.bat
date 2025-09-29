@echo off
REM Quick Deployment Script for AI Prompts Generator (Windows)
REM Run this script to deploy to Vercel

echo 🚀 Deploying AI Prompts Generator to Vercel...

REM Check if Vercel CLI is installed
vercel --version >nul 2>&1
if errorlevel 1 (
    echo 📦 Installing Vercel CLI...
    npm install -g vercel
)

REM Login to Vercel (if not already logged in)
echo 🔑 Checking Vercel authentication...
vercel whoami || vercel login

REM Set up project (if first time)
echo ⚙️ Setting up Vercel project...
vercel link

REM Add environment variables reminder
echo.
echo 📝 Don't forget to set these environment variables in Vercel dashboard:
echo    - DATABASE_URL (PostgreSQL connection string)
echo    - DEEPSEEK_API_KEY (already have: sk-50be...)
echo    - NEWS_API_KEY (already configured)
echo    - CRON_SECRET (secure random string)
echo    - NEXTAUTH_URL (your app URL)
echo    - NEXTAUTH_SECRET (random 32-char string)
echo.

REM Deploy
echo 🚀 Deploying to production...
vercel --prod

echo.
echo ✅ Deployment complete!
echo 📋 Next steps:
echo    1. Set up PostgreSQL database (Neon/Supabase)
echo    2. Add environment variables in Vercel dashboard
echo    3. Run database migration: vercel env pull ^&^& npx prisma migrate deploy
echo    4. Test your endpoints!
echo.
echo 🔗 Your app will be available at: https://your-app.vercel.app

pause
