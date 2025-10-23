#!/usr/bin/env node

/**
 * Test script for DeepSeek API blog generation
 * Usage: node scripts/test-deepseek-blog.js
 */

const fs = require('fs');
const path = require('path');

// Load environment variables from .env.local
function loadEnvFile() {
  const envPath = path.join(process.cwd(), '.env.local');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    const lines = envContent.split('\n');
    
    lines.forEach(line => {
      line = line.trim();
      if (line && !line.startsWith('#') && line.includes('=')) {
        const [key, ...values] = line.split('=');
        const value = values.join('=').trim();
        process.env[key.trim()] = value;
      }
    });
    console.log('✅ Loaded environment variables from .env.local');
  } else {
    console.log('⚠️  .env.local file not found');
  }
}

// Load environment variables
loadEnvFile();

const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;
const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions';

// Mock news items for testing
const mockNewsItems = [
  {
    id: '1',
    title: 'OpenAI Releases GPT-5 with Revolutionary Capabilities',
    description: 'The latest language model shows significant improvements in reasoning and multimodal understanding.',
    url: 'https://openai.com/gpt-5',
    publishedAt: new Date().toISOString(),
    source: 'OpenAI',
    category: 'Language Models'
  },
  {
    id: '2',
    title: 'Google Announces Gemini 2.0 with Enhanced AI Agent Capabilities',
    description: 'New Gemini model features improved autonomous task completion and real-world interaction.',
    url: 'https://deepmind.google/gemini/',
    publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    source: 'Google DeepMind',
    category: 'AI Agents'
  },
  {
    id: '3',
    title: 'Meta Unveils Llama 3.5 with Advanced Coding Capabilities',
    description: 'The open-source model demonstrates state-of-the-art performance in programming tasks.',
    url: 'https://ai.meta.com/llama/',
    publishedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    source: 'Meta AI',
    category: 'Open Source AI'
  }
];

// Track timing
const startTime = Date.now();

async function testDeepSeekBlogGeneration() {
  console.log('🧪 Testing DeepSeek API Blog Generation...\n');

  if (!DEEPSEEK_API_KEY) {
    console.error('❌ DEEPSEEK_API_KEY environment variable not set');
    console.log('Please set your DeepSeek API key:');
    console.log('export DEEPSEEK_API_KEY=your-api-key-here');
    process.exit(1);
  }

  try {
    const currentDate = new Date().toLocaleDateString('en-US', { 
      month: 'long', 
      day: 'numeric', 
      year: 'numeric' 
    });

    const newsContext = mockNewsItems.map((item, index) => 
      `${index + 1}. **${item.title}**
   Source: ${item.source}
   Category: ${item.category}
   Published: ${new Date(item.publishedAt).toLocaleDateString()}
   Description: ${item.description}`
    ).join('\n\n');

    const prompt = `You are an expert AI news blogger. Create a comprehensive, engaging blog post about the latest AI developments.

**Date**: ${currentDate}

**Latest AI News**:
${newsContext}

**Requirements**:
1. Write a compelling blog post in markdown format
2. Focus on trending AI topics and breakthrough developments
3. Include SEO-optimized keywords naturally throughout the content
4. Structure with clear headings and subheadings
5. Make it informative and engaging for AI enthusiasts and professionals
6. Include analysis of market implications and future trends
7. Add a section about trending keywords
8. Keep the tone professional but accessible
9. Aim for 800-1200 words for this test
10. Include relevant insights about the AI industry

Please generate a complete markdown blog post based on these news items.`;

    console.log('📡 Sending request to DeepSeek API...');

    const requestBody = JSON.stringify({
      model: 'deepseek-chat',
      messages: [
        {
          role: 'system',
          content: 'You are an expert AI news blogger who creates engaging, SEO-optimized blog posts about artificial intelligence developments.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      max_tokens: 2000,
      temperature: 0.7,
      stream: false
    });

    const response = await fetch(DEEPSEEK_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${DEEPSEEK_API_KEY}`,
      },
      body: requestBody
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`DeepSeek API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    
    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      throw new Error('Invalid response format from DeepSeek API');
    }

    const generatedContent = data.choices[0].message.content;
    
    console.log('✅ Successfully generated blog content!\n');
    console.log('📝 Generated Blog Content:');
    console.log('=' .repeat(80));
    console.log(generatedContent);
    console.log('=' .repeat(80));
    
    console.log(`\n📊 Statistics:`);
    console.log(`- Content length: ${generatedContent.length} characters`);
    console.log(`- Word count: ~${generatedContent.split(' ').length} words`);
    console.log(`- API response time: ${Date.now() - startTime}ms`);
    
    console.log('\n✅ Test completed successfully!');
    console.log('\n🚀 Your DeepSeek integration is working properly.');
    console.log('The automated blog generation system will use this API to create');
    console.log('engaging, SEO-optimized blog posts from trending AI news every 3 days.');

  } catch (error) {
    console.error('❌ Error testing DeepSeek API:', error.message);
    console.log('\n🔧 Troubleshooting:');
    console.log('1. Verify your DeepSeek API key is correct');
    console.log('2. Check your internet connection');
    console.log('3. Ensure your API key has sufficient credits');
    console.log('4. Try again in a few moments');
    process.exit(1);
  }
}

if (require.main === module) {
  testDeepSeekBlogGeneration();
}

module.exports = { testDeepSeekBlogGeneration };
