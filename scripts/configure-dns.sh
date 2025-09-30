#!/bin/bash

# DNS Configuration Script for AI Prompt Generator
# Usage: ./configure-dns.sh yourdomain.com your.droplet.ip

DOMAIN=${1:-"example.com"}
DROPLET_IP=${2:-"127.0.0.1"}

echo "🌐 DNS Configuration for AI Prompt Generator"
echo "=================================="
echo "Domain: $DOMAIN"
echo "Droplet IP: $DROPLET_IP"
echo ""

# Check if domain resolves
echo "🔍 Checking current DNS resolution..."
CURRENT_IP=$(dig +short A $DOMAIN | tail -n1)

if [ "$CURRENT_IP" ]; then
    echo "✅ Domain currently resolves to: $CURRENT_IP"
    if [ "$CURRENT_IP" = "$DROPLET_IP" ]; then
        echo "✅ DNS already points to your droplet!"
        exit 0
    else
        echo "⚠️  DNS points to different IP. Update needed."
    fi
else
    echo "❌ Domain does not resolve. DNS setup required."
fi

echo ""
echo "📋 Required DNS Records:"
echo "=================================="
echo "Type: A"
echo "Name: @ (root domain)"  
echo "Content: $DROPLET_IP"
echo "Proxy: Enabled (Orange Cloud)"
echo ""
echo "Type: A"
echo "Name: www"
echo "Content: $DROPLET_IP" 
echo "Proxy: Enabled (Orange Cloud)"
echo ""

# Test connection to droplet
echo "🔗 Testing connection to droplet..."
if ping -c 1 $DROPLET_IP >/dev/null 2>&1; then
    echo "✅ Droplet is reachable at $DROPLET_IP"
else
    echo "❌ Cannot reach droplet at $DROPLET_IP"
    echo "   Check if droplet is running and IP is correct"
    exit 1
fi

# Check if web server is running
echo ""
echo "🌐 Testing web server..."
if curl -f -s -o /dev/null http://$DROPLET_IP; then
    echo "✅ Web server is responding on droplet"
else
    echo "⚠️  Web server not responding. Check if your app is running."
fi

echo ""
echo "🔄 Next Steps:"
echo "=================================="
echo "1. Login to Cloudflare Dashboard"
echo "2. Go to DNS > Records"
echo "3. Delete any existing A/CNAME records for '$DOMAIN'"
echo "4. Add new A record:"
echo "   - Type: A"
echo "   - Name: @"
echo "   - Content: $DROPLET_IP"
echo "   - Proxy: Enabled"
echo "5. Add www redirect:"
echo "   - Type: A" 
echo "   - Name: www"
echo "   - Content: $DROPLET_IP"
echo "   - Proxy: Enabled"
echo ""
echo "⏰ DNS propagation usually takes 1-5 minutes with Cloudflare"
echo ""

# Wait and test again  
echo "🕐 Testing DNS propagation..."
for i in {1..5}; do
    sleep 10
    NEW_IP=$(dig +short A $DOMAIN | tail -n1)
    if [ "$NEW_IP" = "$DROPLET_IP" ]; then
        echo "✅ DNS propagation successful! Domain now points to droplet."
        break
    else
        echo "⏳ Attempt $i/5: Still propagating... (Current: ${NEW_IP:-'no response'})"
    fi
done

echo ""
echo "🚀 Test your website:"
echo "http://$DOMAIN"
echo "https://$DOMAIN (after SSL is configured)"