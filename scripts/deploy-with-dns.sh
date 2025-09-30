#!/bin/bash

# Production Deployment Script with DNS Check
# Usage: ./deploy-with-dns.sh yourdomain.com

set -e

DOMAIN=${1:-""}
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" &> /dev/null && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"

if [ -z "$DOMAIN" ]; then
    echo "❌ Error: Please provide your domain name"
    echo "Usage: ./deploy-with-dns.sh yourdomain.com"
    exit 1
fi

echo "🚀 AI Prompt Generator Deployment"
echo "=================================="
echo "Domain: $DOMAIN"
echo "Project: $PROJECT_DIR"
echo ""

# Check if domain resolves
echo "🔍 Checking DNS configuration..."
DOMAIN_IP=$(dig +short A $DOMAIN | tail -n1)

if [ -z "$DOMAIN_IP" ]; then
    echo "❌ Error: Domain $DOMAIN does not resolve to any IP"
    echo ""
    echo "📋 Please configure DNS first:"
    echo "1. Login to your DNS provider (Cloudflare)"
    echo "2. Add A record: @ → YOUR_DROPLET_IP"  
    echo "3. Add A record: www → YOUR_DROPLET_IP"
    echo "4. Wait 1-5 minutes for propagation"
    echo ""
    exit 1
fi

echo "✅ Domain resolves to: $DOMAIN_IP"

# Check if we can reach the server
echo "🔗 Testing connection..."
if ! ping -c 1 -W 5 $DOMAIN_IP >/dev/null 2>&1; then
    echo "❌ Error: Cannot reach server at $DOMAIN_IP"
    echo "   Check if your DigitalOcean droplet is running"
    exit 1
fi

echo "✅ Server is reachable"

# Build the application
echo ""
echo "📦 Building application..."
cd "$PROJECT_DIR"

if ! npm run build; then
    echo "❌ Build failed! Check TypeScript errors above."
    exit 1
fi

echo "✅ Build successful"

# Create production environment file
echo ""
echo "⚙️  Creating production environment..."
cp .env.production.example .env.production

# Update domain in production env
sed -i "s/yourdomain.com/$DOMAIN/g" .env.production

echo "✅ Production environment configured"

# Create Docker files for deployment
echo ""
echo "🐳 Creating Docker configuration..."

cat > Dockerfile << EOF
# Multi-stage build for production
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies
COPY package.json package-lock.json ./
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build application
ENV NEXT_TELEMETRY_DISABLED 1
RUN npm run build

# Production image
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

# Create nextjs user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy built application
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public
COPY --from=builder /app/prisma ./prisma

# Set permissions
RUN chown -R nextjs:nodejs /app
USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
EOF

cat > docker-compose.yml << EOF
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=\${DATABASE_URL}
      - NEXTAUTH_URL=https://$DOMAIN
      - DEEPSEEK_API_KEY=\${DEEPSEEK_API_KEY}
      - NEWS_API_KEY=\${NEWS_API_KEY}
      - CRON_SECRET=\${CRON_SECRET}
      - NEXTAUTH_SECRET=\${NEXTAUTH_SECRET}
    env_file:
      - .env.production
    restart: unless-stopped
    volumes:
      - ./data:/app/data
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/api/health"]
      interval: 30s
      timeout: 10s
      retries: 3

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/conf.d/default.conf
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - app
    restart: unless-stopped

volumes:
  data:
EOF

echo "✅ Docker configuration created"

echo ""
echo "🎉 Deployment preparation complete!"
echo ""
echo "📋 Next Steps:"
echo "1. Copy files to your DigitalOcean droplet"
echo "2. Run: docker-compose up -d"
echo "3. Configure SSL certificate"
echo "4. Test: https://$DOMAIN"
echo ""
echo "📞 If DNS errors persist:"
echo "1. Check Cloudflare DNS settings"
echo "2. Delete any conflicting A/CNAME records"
echo "3. Add new A record: @ → $DOMAIN_IP"
echo "4. Enable Cloudflare proxy (orange cloud)"
echo ""