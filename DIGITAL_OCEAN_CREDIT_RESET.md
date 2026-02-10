# 🔄 Credit Reset on Digital Ocean Server - Setup Guide

## Current Status

✅ **Credits manually reset on Feb 6, 2026** - Both users now have 50 credits

⚠️ **Automatic reset NOT set up yet on Digital Ocean server**

---

## How Credit Reset Works

### 1. **On User Login** ✅ (Already Working)
When a user signs in via Google OAuth, the system checks if it's a new month and automatically resets their credits. This is already configured in your code.

### 2. **Scheduled Cron Job** ⚠️ (Needs Setup on Digital Ocean)
A cron job runs on the 1st of every month at midnight to reset all users' credits automatically.

---

## 🚀 Setup Credit Reset on Digital Ocean

### Option 1: Quick Setup (Recommended)

SSH into your Digital Ocean server and run these commands:

```bash
# 1. SSH into your server
ssh your-username@your-server-ip

# 2. Go to your project directory
cd /var/www/aipromptgen
# Or wherever your project is located

# 3. Load environment variables to get CRON_SECRET
source .env.production
# Or: source .env.local

# 4. Add cron job for monthly reset (runs 1st of every month at 00:00)
crontab -e

# 5. Add this line (press 'i' to insert in vim):
0 0 1 * * curl -X GET "http://localhost:3000/api/cron/reset-credits" -H "Authorization: Bearer $CRON_SECRET" >> /var/log/credit-reset.log 2>&1

# Save and exit (press Esc, then :wq, then Enter)

# 6. Verify cron job was added
crontab -l | grep reset-credits
```

---

### Option 2: Using the Setup Script

```bash
# 1. SSH into your server
ssh your-username@your-server-ip

# 2. Go to your project directory
cd /var/www/aipromptgen

# 3. Pull latest code (includes the setup script)
git pull origin main

# 4. Make the script executable
chmod +x scripts/setup-credit-reset-cron.sh

# 5. Run the setup script
sudo ./scripts/setup-credit-reset-cron.sh

# Follow the prompts to enter your domain
```

---

### Option 3: Manual Detailed Setup

#### Step 1: Create a Cron Script

```bash
# Create the script
sudo nano /usr/local/bin/reset-credits.sh
```

Add this content:
```bash
#!/bin/bash
# Monthly Credit Reset - Runs on 1st of every month

# Load your environment variables
cd /var/www/aipromptgen  # Change to your project path
source .env.production    # Or .env.local

# Get your domain/URL
DOMAIN="your-domain.com"  # Or use localhost:3000

# Call the reset endpoint
curl -X GET "https://$DOMAIN/api/cron/reset-credits" \
  -H "Authorization: Bearer $CRON_SECRET" \
  -H "User-Agent: DigitalOcean-Cron/1.0" \
  >> /var/log/credit-reset.log 2>&1

# Log completion
echo "$(date): Credit reset completed" >> /var/log/credit-reset.log
```

Save and exit (Ctrl+X, Y, Enter)

#### Step 2: Make Script Executable

```bash
sudo chmod +x /usr/local/bin/reset-credits.sh
```

#### Step 3: Add to Crontab

```bash
# Open crontab editor
crontab -e

# Add this line (runs 1st of every month at midnight):
0 0 1 * * /usr/local/bin/reset-credits.sh
```

Save and exit.

#### Step 4: Create Log File

```bash
sudo touch /var/log/credit-reset.log
sudo chmod 644 /var/log/credit-reset.log
```

---

## ✅ Verify Setup

### Test the Cron Job Manually

```bash
# Run the reset manually
/usr/local/bin/reset-credits.sh

# Or call the API directly
curl -X GET "http://localhost:3000/api/cron/reset-credits" \
  -H "Authorization: Bearer YOUR_CRON_SECRET"
```

### Check If Users Need Reset

```bash
# From your project directory
node scripts/check-reset-status.js
```

### View Cron Jobs

```bash
# List all cron jobs
crontab -l

# Should show:
# 0 0 1 * * /usr/local/bin/reset-credits.sh
```

### View Logs

```bash
# View credit reset logs
tail -f /var/log/credit-reset.log

# View cron daemon logs
sudo journalctl -u cron -f
```

---

## 📅 Schedule Explanation

```
0 0 1 * * /usr/local/bin/reset-credits.sh
│ │ │ │ │
│ │ │ │ └─── Day of week (0-7, both 0 and 7 mean Sunday)
│ │ │ └───── Month (1-12)
│ │ └─────── Day of month (1-31)
│ └───────── Hour (0-23)
└─────────── Minute (0-59)
```

**Translation:** Run at **00:00 (midnight)** on the **1st day** of **every month**

---

## 🔍 Troubleshooting

### If credits don't reset on March 1st:

1. **Check if cron is running:**
   ```bash
   sudo systemctl status cron
   # Should show "active (running)"
   ```

2. **Check cron logs:**
   ```bash
   sudo journalctl -u cron | grep reset
   ```

3. **Check your app logs:**
   ```bash
   pm2 logs aipromptgen | grep CRON
   # Or
   sudo journalctl -u aipromptgen | grep CRON
   ```

4. **Verify CRON_SECRET is set:**
   ```bash
   cd /var/www/aipromptgen
   grep CRON_SECRET .env.production
   ```

5. **Test the endpoint manually:**
   ```bash
   # From your server
   curl -X GET "http://localhost:3000/api/cron/reset-credits" \
     -H "Authorization: Bearer $(grep CRON_SECRET .env.production | cut -d '=' -f2)"
   ```

6. **Manual reset as backup:**
   ```bash
   node scripts/manual-reset.js
   ```

---

## 🎯 What Happens Now

✅ **Users who login** - Credits reset automatically if it's a new month  
✅ **March 1st, 2026 at 00:00** - Cron job will reset all users automatically  
✅ **Every 1st of month** - Automatic reset continues

---

## 📝 Important Notes

1. **Both methods work together:**
   - Cron job resets credits at midnight on the 1st
   - Login check ensures users get credits even if cron fails

2. **Time zone:**
   - Cron runs in server's timezone (usually UTC)
   - Adjust cron time if needed for your timezone

3. **Users already reset:**
   - Won't be reset again in the same month
   - System checks `lastCreditResetDate` to avoid double-reset

---

## 🚀 Quick Commands Reference

```bash
# Check current status
node scripts/check-reset-status.js

# Manual reset if needed
node scripts/manual-reset.js

# View cron jobs
crontab -l

# View logs
tail -f /var/log/credit-reset.log

# Test endpoint
curl http://localhost:3000/api/cron/reset-credits -H "Authorization: Bearer YOUR_SECRET"
```

---

✅ **Follow the steps above to set up automatic credit reset on your Digital Ocean server!**
