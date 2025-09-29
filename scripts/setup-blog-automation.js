#!/usr/bin/env node

/**
 * Blog Auto-Generation Setup Script
 * 
 * This script helps set up automatic blog generation every 3 days.
 */

const fs = require('fs');
const path = require('path');

// Create vercel.json for Vercel deployments
const vercelConfig = {
  "crons": [
    {
      "path": "/api/blog/cron",
      "schedule": "0 0 */3 * *"
    }
  ]
};

function createFile(filePath, content, description) {
  const fullPath = path.join(process.cwd(), filePath);
  const dir = path.dirname(fullPath);
  
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  
  fs.writeFileSync(fullPath, content);
  console.log(`✅ Created ${description}: ${filePath}`);
}

function main() {
  console.log('🚀 Setting up blog auto-generation...\n');

  // Create configuration files
  createFile('vercel.json', JSON.stringify(vercelConfig, null, 2), 'Vercel cron configuration');

  console.log(`
🎉 Blog auto-generation setup complete!

Features enabled:
✅ AI news fetching with API key: 88ec2cc8ec274a1ba697cfdb6b353ab3
✅ DeepSeek AI-powered blog content generation
✅ Fully automated blog generation every 3 days
✅ SEO keyword extraction from trending AI news
✅ Real-time trending topic detection
✅ Automatic blog publishing to website

The system will:
• Automatically fetch latest AI news every 3 days
• Use DeepSeek API to generate high-quality, engaging blog content
• Analyze trending topics from daily news
• Generate SEO-optimized blog posts with trending keywords
• Publish directly to the blog page without manual intervention
• Focus on breaking AI news and developments

Automation endpoints:
• Cron trigger: POST /api/blog/cron
• Status check: GET /api/blog/cron

Next steps:
1. Set DEEPSEEK_API_KEY in your environment variables
2. Test the integration: node scripts/test-deepseek-blog.js
3. Deploy with your preferred cron service (Vercel, GitHub Actions, etc.)

This is a completely automated system - no visitor controls needed!
`);
}

if (require.main === module) {
  main();
}

module.exports = { main };
