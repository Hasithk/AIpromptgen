# 🔧 Fix "Port Already in Use" Error

## The Error You're Seeing
```
Error: listen EADDRINUSE: address already in use :::8080
```

This means another process is already using port 8080.

---

## Quick Fix - Run These Commands on Digital Ocean

### Step 1: Find What's Using Port 8080
```bash
# Find the process ID (PID) using port 8080
lsof -i :8080
# OR
netstat -tulpn | grep 8080
# OR
fuser 8080/tcp
```

### Step 2: Kill the Old Process
```bash
# If you see a PID number (like 12345), kill it:
kill -9 PID_NUMBER

# Example:
# kill -9 12345

# OR kill all node processes:
pkill -f node

# OR if using PM2:
pm2 delete all
pm2 kill
```

### Step 3: Navigate to Your Project
```bash
# Go to your project directory
cd /workspace
# OR
cd /var/www/ai-prompts-gen
# OR find it:
pwd
ls -la
```

### Step 4: Run Database Migration
```bash
# Install dependencies
npm install

# Generate Prisma client
npx prisma generate

# Run migration
npx prisma migrate deploy
```

### Step 5: Restart App Properly

#### Option A: If Using PM2 (Recommended)
```bash
# Start with PM2
pm2 start npm --name "ai-prompts-gen" -- start

# OR if package.json has start script:
pm2 start "npm start" --name ai-prompts-gen

# Save PM2 config
pm2 save

# Set PM2 to start on reboot
pm2 startup
```

#### Option B: If Using npm directly
```bash
# Run in background with nohup
nohup npm start &

# OR use screen
screen -S aiapp
npm start
# Press Ctrl+A then D to detach
```

#### Option C: If on Digital Ocean App Platform
```bash
# Just run the build
npm run build

# The platform will auto-restart
# No need to run npm start manually
```

### Step 6: Verify It's Running
```bash
# Check if process is running
pm2 status
# OR
ps aux | grep node

# Test the app
curl http://localhost:8080
# OR
curl http://localhost:3000

# Check logs
pm2 logs
# OR
npm run logs
```

---

## 🎯 Complete Command Set (Copy & Paste)

```bash
# 1. Kill existing processes
pkill -f node
pm2 delete all

# 2. Go to project
cd /workspace

# 3. Pull latest code (if needed)
git pull origin main

# 4. Install & migrate
npm install
npx prisma generate
npx prisma migrate deploy

# 5. Start with PM2
pm2 start npm --name "ai-prompts-gen" -- start
pm2 save

# 6. Check status
pm2 status
pm2 logs --lines 50
```

---

## 🔍 Troubleshooting

### Issue: "pm2 command not found"
```bash
# Install PM2 globally
npm install -g pm2

# Then start your app
pm2 start npm --name "ai-prompts-gen" -- start
```

### Issue: "Still getting EADDRINUSE"
```bash
# Find and kill ALL processes on port 8080
lsof -ti:8080 | xargs kill -9

# Or use fuser
fuser -k 8080/tcp

# Then restart
pm2 start npm --name "ai-prompts-gen" -- start
```

### Issue: "Cannot find module"
```bash
# Clean install
rm -rf node_modules package-lock.json
npm install
npx prisma generate
pm2 restart all
```

### Issue: App crashes immediately
```bash
# Check logs for the real error
pm2 logs ai-prompts-gen --lines 100

# Common fixes:
# 1. Missing environment variables
nano .env.production
# Add required vars

# 2. Database not connected
npx prisma db push

# 3. Port conflict - change port
# Edit your app to use different port
```

---

## 📝 What's Happening in Your Screenshot

Looking at your error:
- You tried: `npm start`
- Port 8080 is already occupied
- Previous instance didn't shut down properly

**Solution**: Kill the old process first, then use PM2 to manage your app properly.

---

## ✅ Recommended Setup

Use PM2 for production apps:

```bash
# One-time setup
npm install -g pm2

# Start your app
pm2 start npm --name "ai-prompts-gen" -- start

# Useful PM2 commands
pm2 list          # Show all apps
pm2 stop all      # Stop all apps
pm2 restart all   # Restart all apps
pm2 delete all    # Remove all apps
pm2 logs          # View logs
pm2 monit         # Monitor resources
```

---

## 🚀 After Migration Success

Once running, verify:

```bash
# Test the API
curl http://localhost:8080/api/health
curl http://localhost:8080/

# Check database
npx prisma studio
# Opens at http://localhost:5555

# Monitor logs
pm2 logs --lines 50 --follow
```

Your cost optimizations should now be live! 🎉
