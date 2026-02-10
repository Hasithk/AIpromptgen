#!/bin/bash
# Setup Monthly Credit Reset Cron Job on Digital Ocean
# Run this script on your Digital Ocean server

echo "🔄 Setting up Monthly Credit Reset Cron Job"
echo "=============================================="
echo ""

# Check if CRON_SECRET is set
if [ -z "$CRON_SECRET" ]; then
    echo "⚠️  CRON_SECRET not found in environment"
    echo "Please add CRON_SECRET to your .env.production file"
    echo ""
    echo "Generate a secret:"
    echo "  openssl rand -base64 32"
    exit 1
fi

# Get the domain/URL
read -p "Enter your domain (e.g., aipromptgen.com): " DOMAIN
if [ -z "$DOMAIN" ]; then
    echo "❌ Domain is required"
    exit 1
fi

# Create the cron script
CRON_SCRIPT="/usr/local/bin/reset-credits.sh"

echo "📝 Creating cron script at $CRON_SCRIPT"

cat > $CRON_SCRIPT << 'EOF'
#!/bin/bash
# Monthly Credit Reset - Runs on 1st of every month at midnight

# Load environment variables
source /path/to/your/project/.env.production

# Call the reset endpoint
curl -X GET "https://DOMAIN_PLACEHOLDER/api/cron/reset-credits" \
  -H "Authorization: Bearer ${CRON_SECRET}" \
  -H "User-Agent: DigitalOcean-Cron/1.0" \
  >> /var/log/credit-reset.log 2>&1

echo "$(date): Credit reset completed" >> /var/log/credit-reset.log
EOF

# Replace domain placeholder
sed -i "s|DOMAIN_PLACEHOLDER|$DOMAIN|g" $CRON_SCRIPT

# Make script executable
chmod +x $CRON_SCRIPT

echo "✅ Cron script created"
echo ""

# Add to crontab
echo "📅 Adding to crontab (runs 1st of every month at 00:00 UTC)"

# Check if cron job already exists
if crontab -l 2>/dev/null | grep -q "reset-credits.sh"; then
    echo "⚠️  Cron job already exists in crontab"
    echo "Updating..."
    # Remove old entry
    crontab -l | grep -v "reset-credits.sh" | crontab -
fi

# Add new cron job
(crontab -l 2>/dev/null; echo "0 0 1 * * $CRON_SCRIPT") | crontab -

echo "✅ Cron job added successfully!"
echo ""

# Display current crontab
echo "📋 Current crontab:"
crontab -l | grep "reset-credits"
echo ""

# Create log file
touch /var/log/credit-reset.log
chmod 644 /var/log/credit-reset.log

echo "✅ Setup Complete!"
echo ""
echo "📅 Schedule: 1st of every month at 00:00 UTC (midnight)"
echo "📝 Logs: /var/log/credit-reset.log"
echo "🔧 Script: $CRON_SCRIPT"
echo ""
echo "To test manually:"
echo "  sudo $CRON_SCRIPT"
echo ""
echo "To view logs:"
echo "  tail -f /var/log/credit-reset.log"
echo ""
