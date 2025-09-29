#!/bin/bash

# Quick Deployment Script for AI Prompts Generator
# Run this script to deploy to Vercel

echo "🚀 Deploying AI Prompts Generator to Vercel..."

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "📦 Installing Vercel CLI..."
    npm install -g vercel
fi

# Login to Vercel (if not already logged in)
echo "🔑 Checking Vercel authentication..."
vercel whoami || vercel login

# Set up project (if first time)
echo "⚙️ Setting up Vercel project..."
vercel link

# Add environment variables (you'll need to set these manually in Vercel dashboard)
echo "📝 Don't forget to set these environment variables in Vercel dashboard:"
echo "   - DATABASE_URL (PostgreSQL connection string)"
echo "   - DEEPSEEK_API_KEY (already have: sk-50be...)"
echo "   - NEWS_API_KEY (already configured)"
echo "   - CRON_SECRET (secure random string)"
echo "   - NEXTAUTH_URL (your app URL)"
echo "   - NEXTAUTH_SECRET (random 32-char string)"

# Deploy
echo "🚀 Deploying to production..."
vercel --prod

echo "✅ Deployment complete!"
echo "📋 Next steps:"
echo "   1. Set up PostgreSQL database (Neon/Supabase)"
echo "   2. Add environment variables in Vercel dashboard"
echo "   3. Run database migration: vercel env pull && npx prisma migrate deploy"
echo "   4. Test your endpoints!"

echo "🔗 Your app will be available at: https://your-app.vercel.app"
