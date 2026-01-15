# 🔒 Secure Digital Ocean Deployment Guide

**Date**: January 16, 2026  
**Status**: Production Ready with Security Best Practices

---

## 🚀 Quick Deployment Steps

### Step 1: SSH into Your Digital Ocean Server

```bash
ssh root@your-server-ip
# Or if you have a user account:
ssh your-username@your-server-ip
```

---

### Step 2: Navigate to Your Project Directory

```bash
cd /path/to/your/project
# Common locations:
# cd /var/www/aipromptgen
# cd ~/aipromptgen
```

---

### Step 3: Create Secure Environment File

**IMPORTANT**: Never create .env files in your local machine and upload. Create directly on the server.

```bash
# Create production environment file
nano .env.production

# Or use .env.local
nano .env.local
```

**Add this configuration:**

```env
# Production Environment - SECURE
# Digital Ocean Deployment

# Database (Use your actual PostgreSQL connection string)
DATABASE_URL="postgresql://username:password@localhost:5432/aipromptgen?sslmode=require"

# DeepSeek API Key (NEW - SECURE)
DEEPSEEK_API_KEY=sk-60f46f83c32747519104e99f2cd4193a

# News API
NEWS_API_KEY=88ec2cc8ec274a1ba697cfdb6b353ab3
NEWS_API_BASE_URL=https://newsapi.org/v2

# NextAuth Configuration
NEXTAUTH_URL=https://your-domain.com
NEXTAUTH_SECRET=generate-random-32-character-string-here
CRON_SECRET=generate-random-secret-for-cron-jobs

# Google OAuth (if using)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Environment
NODE_ENV=production
```

**Save and exit:**
- Press `Ctrl + X`
- Press `Y` to confirm
- Press `Enter` to save

---

### Step 4: Secure File Permissions

```bash
# Make environment file readable only by owner
chmod 600 .env.production
# Or
chmod 600 .env.local

# Verify permissions (should show -rw-------)
ls -la .env.production

# Set proper ownership
chown www-data:www-data .env.production
# Or if using different user:
chown your-app-user:your-app-user .env.production
```

---

### Step 5: Generate Secure Secrets

```bash
# Generate NEXTAUTH_SECRET (32 characters)
openssl rand -base64 32

# Generate CRON_SECRET
openssl rand -base64 24

# Copy these values and update your .env.production file
nano .env.production
```

---

### Step 6: Install Dependencies & Build

```bash
# Pull latest code (if using git)
git pull origin main

# Install dependencies
npm install --production

# Build the application
npm run build
```

---

### Step 7: Restart Application

**If using PM2:**
```bash
# Restart the app
pm2 restart all

# Or restart specific app
pm2 restart aipromptgen

# Check status
pm2 status

# View logs
pm2 logs aipromptgen
```

**If using systemd:**
```bash
sudo systemctl restart aipromptgen
sudo systemctl status aipromptgen
```

**If using Docker:**
```bash
docker-compose down
docker-compose up -d --build
```

---

## 🔐 Security Best Practices

### 1. Firewall Configuration

```bash
# Allow only necessary ports
ufw allow 22    # SSH
ufw allow 80    # HTTP
ufw allow 443   # HTTPS
ufw enable

# Check status
ufw status
```

### 2. Fail2Ban (Protect SSH)

```bash
# Install fail2ban
apt-get update
apt-get install fail2ban -y

# Start service
systemctl start fail2ban
systemctl enable fail2ban
```

### 3. Regular Security Updates

```bash
# Update system packages
apt-get update
apt-get upgrade -y

# Update Node.js packages
npm audit fix
```

### 4. Environment File Security Checklist

- ✅ **Never commit** `.env.production` to git
- ✅ **Never upload** via FTP/SFTP (create directly on server)
- ✅ **Use chmod 600** (readable only by owner)
- ✅ **Rotate API keys** every 3 months
- ✅ **Use different keys** for dev and production
- ✅ **Monitor API usage** daily

---

## 📊 Set Up Monitoring

### API Usage Monitoring

```bash
# Create monitoring script
nano /root/check-api-usage.sh
```

```bash
#!/bin/bash
# Check DeepSeek API usage daily

DATE=$(date +%Y-%m-%d)
echo "[$DATE] Checking DeepSeek API usage..."

# Add your monitoring logic here
# You can call DeepSeek API to check usage
# Or parse application logs

# Send alert if usage is high
USAGE=15  # Get actual usage from API
THRESHOLD=10

if [ $USAGE -gt $THRESHOLD ]; then
    echo "WARNING: High API usage detected: $USAGE"
    # Send email alert (configure mail later)
fi
```

```bash
# Make executable
chmod +x /root/check-api-usage.sh

# Add to crontab (runs daily at 9 AM)
crontab -e
# Add this line:
0 9 * * * /root/check-api-usage.sh >> /var/log/api-usage.log 2>&1
```

---

## 🛡️ Rate Limiting Setup

### Using Nginx (Recommended)

Edit your Nginx configuration:

```bash
nano /etc/nginx/sites-available/your-site
```

Add rate limiting:

```nginx
# Rate limiting zone
limit_req_zone $binary_remote_addr zone=api_limit:10m rate=10r/m;

server {
    listen 80;
    server_name your-domain.com;

    # Apply rate limit to API endpoints
    location /api/prompts/generate {
        limit_req zone=api_limit burst=5 nodelay;
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }

    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

```bash
# Test configuration
nginx -t

# Reload Nginx
systemctl reload nginx
```

---

## 🔍 Verification Steps

### 1. Test API Endpoint

```bash
# From your server
curl -X POST http://localhost:3000/api/test \
  -H "Content-Type: application/json"

# Expected response: {"success": true, "env": {...}}
```

### 2. Check Environment Variables

```bash
# Test if app can read environment
node -e "console.log(process.env.DEEPSEEK_API_KEY ? 'API key loaded' : 'API key missing')"
```

### 3. Monitor Logs

```bash
# PM2 logs
pm2 logs aipromptgen --lines 50

# System logs
journalctl -u aipromptgen -f

# Nginx logs
tail -f /var/log/nginx/access.log
tail -f /var/log/nginx/error.log
```

### 4. Test Prompt Generation

```bash
# Test from server
curl -X POST http://localhost:3000/api/prompts/generate \
  -H "Content-Type: application/json" \
  -H "Cookie: your-session-cookie" \
  -d '{
    "subject": "sunset",
    "platform": "midjourney",
    "styles": ["photorealistic"],
    "creativity": 75,
    "includeNegative": true
  }'
```

---

## 🚨 Troubleshooting

### Issue: "API key not set" Error

**Solution:**
```bash
# Check if environment file exists
ls -la .env.production

# Verify content
cat .env.production | grep DEEPSEEK

# Restart application
pm2 restart all
```

### Issue: Permission Denied

**Solution:**
```bash
# Fix permissions
chmod 600 .env.production
chown www-data:www-data .env.production

# Or for your user
chown $(whoami):$(whoami) .env.production
```

### Issue: High API Costs

**Check logs for unusual activity:**
```bash
# Check access logs
grep "POST /api/prompts/generate" /var/log/nginx/access.log | wc -l

# Check unique IPs
grep "POST /api/prompts/generate" /var/log/nginx/access.log | awk '{print $1}' | sort | uniq -c | sort -rn
```

---

## 📋 Deployment Checklist

Before going live:

- [ ] Created `.env.production` on server (not uploaded)
- [ ] Set secure file permissions (chmod 600)
- [ ] Generated strong NEXTAUTH_SECRET
- [ ] Generated strong CRON_SECRET
- [ ] Updated NEXTAUTH_URL to production domain
- [ ] Configured SSL/HTTPS (use certbot)
- [ ] Set up firewall (ufw)
- [ ] Installed fail2ban
- [ ] Configured Nginx rate limiting
- [ ] Set up monitoring script
- [ ] Tested API endpoints
- [ ] Verified prompt generation works
- [ ] Checked application logs
- [ ] Set up automated backups
- [ ] Documented server access credentials

---

## 🔄 Regular Maintenance

### Weekly:
- Check API usage in DeepSeek dashboard
- Review application logs for errors
- Check disk space: `df -h`
- Monitor memory: `free -h`

### Monthly:
- Update system packages: `apt-get update && apt-get upgrade`
- Update npm packages: `npm audit fix`
- Rotate API keys (recommended)
- Review and clear old logs

### Quarterly:
- Change NEXTAUTH_SECRET
- Change CRON_SECRET
- Update SSL certificates (auto with certbot)
- Full security audit

---

## 📞 Emergency Response

### If API Key is Compromised:

1. **Immediately revoke** old key at https://platform.deepseek.com/api_keys
2. **Generate new key**
3. **Update on server:**
   ```bash
   ssh your-server
   nano .env.production
   # Update DEEPSEEK_API_KEY
   pm2 restart all
   ```
4. **Monitor usage** for next 24 hours
5. **Check logs** for unauthorized access

---

## 🎯 Performance Optimization

### Enable Caching

```bash
# Install Redis (optional)
apt-get install redis-server -y
systemctl enable redis-server
systemctl start redis-server
```

### Database Optimization

```bash
# If using PostgreSQL
sudo -u postgres psql

# Create indexes
CREATE INDEX idx_user_email ON "User"(email);
CREATE INDEX idx_prompt_history_user ON "PromptHistory"("userId");
CREATE INDEX idx_prompt_history_date ON "PromptHistory"("createdAt");
```

---

## 💰 Cost Monitoring

### Set Daily Spending Limit

1. Go to https://platform.deepseek.com/usage
2. Set daily limit: **$2.00**
3. Enable email alerts
4. Monitor daily

### Expected Costs:
- **Normal usage**: $1-2/month (~54 requests)
- **With monitoring**: $0.10/day = $3/month maximum
- **Savings vs before**: $12/month (was $15.77 with breach)

---

## ✅ Final Verification

Run this verification script:

```bash
#!/bin/bash
echo "=== Environment Verification ==="
echo -n "1. Environment file exists: "
[ -f .env.production ] && echo "✓" || echo "✗"

echo -n "2. Secure permissions: "
[ "$(stat -c %a .env.production)" = "600" ] && echo "✓" || echo "✗"

echo -n "3. DEEPSEEK_API_KEY set: "
grep -q "DEEPSEEK_API_KEY=sk-" .env.production && echo "✓" || echo "✗"

echo -n "4. Application running: "
pm2 list | grep -q "online" && echo "✓" || echo "✗"

echo -n "5. Nginx configured: "
systemctl is-active --quiet nginx && echo "✓" || echo "✗"

echo -n "6. Firewall enabled: "
ufw status | grep -q "active" && echo "✓" || echo "✗"

echo "================================"
```

---

**Your application is now securely deployed! 🎉**

Need help? Check logs or contact support.
