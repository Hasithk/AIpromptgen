#!/bin/bash
# One-line setup for credit reset cron on Digital Ocean
# Usage: curl -s https://raw.githubusercontent.com/YOUR_USERNAME/YOUR_REPO/main/scripts/quick-cron-setup.sh | bash

echo "🔄 Quick Credit Reset Cron Setup"
echo "=================================="

# Check if running on server
if [ ! -f ".env.production" ] && [ ! -f ".env.local" ]; then
    echo "❌ Error: No .env file found. Are you in the project directory?"
    exit 1
fi

# Load environment
if [ -f ".env.production" ]; then
    source .env.production
elif [ -f ".env.local" ]; then
    source .env.local
fi

# Check CRON_SECRET
if [ -z "$CRON_SECRET" ]; then
    echo "❌ CRON_SECRET not found in environment file"
    exit 1
fi

# Get current directory
PROJECT_DIR=$(pwd)

# Add to crontab
CRON_CMD="0 0 1 * * cd $PROJECT_DIR && curl -s -X GET \"http://localhost:3000/api/cron/reset-credits\" -H \"Authorization: Bearer $CRON_SECRET\" >> /var/log/credit-reset.log 2>&1"

# Check if already exists
if crontab -l 2>/dev/null | grep -q "reset-credits"; then
    echo "⚠️  Cron job already exists. Updating..."
    crontab -l 2>/dev/null | grep -v "reset-credits" | crontab -
fi

# Add cron job
(crontab -l 2>/dev/null; echo "$CRON_CMD") | crontab -

# Create log file
sudo touch /var/log/credit-reset.log 2>/dev/null || touch /var/log/credit-reset.log
sudo chmod 644 /var/log/credit-reset.log 2>/dev/null || chmod 644 /var/log/credit-reset.log

echo "✅ Cron job added successfully!"
echo ""
echo "📅 Schedule: 1st of every month at 00:00 (midnight)"
echo "📝 Logs: /var/log/credit-reset.log"
echo ""
echo "To verify:"
echo "  crontab -l | grep reset-credits"
echo ""
echo "To test now:"
echo "  curl -X GET 'http://localhost:3000/api/cron/reset-credits' -H 'Authorization: Bearer $CRON_SECRET'"
