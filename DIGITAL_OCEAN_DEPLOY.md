# 🌊 Digital Ocean Deployment Guide

## ✅ Code Status
- **Latest Commit:** `e2058d5` 
- **Status:** All changes pushed to GitHub successfully
- **Remote Branch:** `origin/main` is up to date

## 📦 What Was Updated

### New Features Added:
1. **🍌 Nanobanana Platform** - Image generation with banana emoji
2. **Platform Type Filtering** - Separate image/video platforms with auto-switching
3. **Blog Persistence** - File-based storage in `data/blog-articles.json`
4. **Blog APIs:**
   - `/api/blog-articles` - Storage and pagination
   - `/api/blog/generate-all` - Bulk generate 24 articles
   - `/api/blog/generate-daily` - Daily article generation
5. **DeepSeek Integration** - AI-enhanced prompt generation
6. **Fixed Blog Images** - Curated Unsplash URLs with fallbacks

### Files Changed:
- ✅ `app/api/blog-articles/route.ts` (NEW)
- ✅ `app/api/blog/generate-all/route.ts` (NEW)
- ✅ `app/api/blog/generate-daily/route.ts` (NEW)
- ✅ `data/blog-articles.json` (NEW)
- ✅ `lib/constants.ts` (MODIFIED - Added Nanobanana)
- ✅ `components/prompt-generator.tsx` (MODIFIED - Platform filtering)
- ✅ `app/api/prompts/generate/route.ts` (MODIFIED - DeepSeek)
- ✅ `components/blog-page.tsx` (MODIFIED - Images & pagination)
- ✅ And more...

---

## 🚀 Deploy to Digital Ocean

### Method 1: SSH Deployment (Manual)

#### Step 1: Connect to Your Server
```bash
ssh root@your-droplet-ip
# OR if you have a user configured:
ssh your-username@your-droplet-ip
```

#### Step 2: Navigate to Your App Directory
```bash
# Common locations:
cd /var/www/your-app
# OR
cd /home/deploy/ai-prompts-gen
# OR
cd /opt/ai-prompts-gen

# Verify you're in the right directory
pwd
ls -la
```

#### Step 3: Pull Latest Changes
```bash
# Backup current state (optional but recommended)
git stash

# Fetch and pull latest changes from GitHub
git fetch origin
git pull origin main

# You should see the new commit e2058d5
git log --oneline -1
# Should show: e2058d5 feat: Add platform type filtering...
```

#### Step 4: Install Dependencies
```bash
# Install any new packages
npm install
# OR if using yarn
yarn install
```

#### Step 5: Create Data Directory
```bash
# Create directory for blog persistence
mkdir -p data
chmod 755 data

# Verify it was created
ls -la data/
```

#### Step 6: Set Environment Variables
```bash
# Edit your environment file
nano .env.production
# OR
nano .env.local

# Ensure these variables are set:
# DEEPSEEK_API_KEY=your_deepseek_key_here
# NEWS_API_KEY=your_news_api_key_here
# CRON_SECRET=your_secure_secret_here

# Save and exit (Ctrl+X, then Y, then Enter)
```

#### Step 7: Build the Application
```bash
# Build Next.js production version
npm run build

# Check for build errors
echo $?
# Should output: 0 (means success)
```

#### Step 8: Restart the Application

**If using PM2:**
```bash
# Restart the app
pm2 restart all
# OR restart specific app by name
pm2 restart ai-prompts-gen

# Reload with updated environment
pm2 reload all --update-env

# Check status
pm2 status

# View logs
pm2 logs
# Press Ctrl+C to exit logs
```

**If using systemd service:**
```bash
# Restart the service
sudo systemctl restart your-app-name

# Check status
sudo systemctl status your-app-name

# View logs
sudo journalctl -u your-app-name -f
```

**If using Docker:**
```bash
# Rebuild and restart
docker-compose down
docker-compose build --no-cache
docker-compose up -d

# View logs
docker-compose logs -f
```

**If running directly with npm:**
```bash
# Stop the current process
pkill -f "next start"

# Start the app
npm start &
# OR
nohup npm start > output.log 2>&1 &
```

#### Step 9: Generate Initial Blog Articles
```bash
# Replace YOUR_SECRET with your actual CRON_SECRET
curl "http://localhost:3000/api/blog/generate-all?secret=YOUR_SECRET&days=24"

# Check if articles were created
cat data/blog-articles.json | head -n 50
```

#### Step 10: Test the Deployment
```bash
# Test blog API
curl http://localhost:3000/api/blog-articles | jq

# Test news API
curl http://localhost:3000/api/news/latest | jq

# Test prompt generation
curl -X POST http://localhost:3000/api/prompts/generate \
  -H "Content-Type: application/json" \
  -d '{"subject":"test","platform":"midjourney","styles":[],"mood":"","lighting":"","creativity":75,"includeNegative":false}'
```

---

### Method 2: Digital Ocean App Platform (Automatic)

#### If Using App Platform with GitHub Integration:

1. **Check Auto-Deploy Status:**
   - Login to Digital Ocean Dashboard
   - Go to "Apps"
   - Click on your app
   - Go to "Settings" → "App-Level Settings"
   - Verify "Auto Deploy" is enabled for `main` branch

2. **Trigger Manual Deploy (if auto-deploy didn't work):**
   - In your App dashboard, click "Actions" → "Force Rebuild and Deploy"
   - OR click "Create Deployment"
   - Select branch: `main`
   - Select commit: `e2058d5`
   - Click "Deploy"

3. **Add/Update Environment Variables:**
   - Go to "Settings" → "App-Level Environment Variables"
   - Add or update:
     ```
     DEEPSEEK_API_KEY = your_deepseek_api_key
     NEWS_API_KEY = your_news_api_key
     CRON_SECRET = your_secure_random_secret
     ```
   - Click "Save"
   - App will automatically redeploy

4. **Monitor Deployment:**
   - Go to "Runtime Logs" to watch the build
   - Wait for status to show "Deployed successfully"
   - Usually takes 3-5 minutes

5. **Generate Blog Articles:**
   ```bash
   # From your local machine
   curl "https://your-app.ondigitalocean.app/api/blog/generate-all?secret=YOUR_SECRET&days=24"
   ```

---

## ✅ Verify Deployment

### 1. Check from Browser
Visit your domain/IP and verify:

- **Homepage** loads correctly
- **Blog page** (`/blog`) shows articles with images
- **Prompt Generator** shows:
  - When "Image" selected: Nanobanana 🍌, Midjourney, DALL-E, Qwen
  - When "Video" selected: Sora, Veo3
- **AI News page** loads with news items

### 2. Test API Endpoints
```bash
# Replace YOUR_DOMAIN with actual domain/IP
export DOMAIN="your-domain.com"
# OR
export DOMAIN="123.45.67.89"

# Test blog articles
curl https://$DOMAIN/api/blog-articles

# Test news
curl https://$DOMAIN/api/news/latest

# Test prompt generation
curl -X POST https://$DOMAIN/api/prompts/generate \
  -H "Content-Type: application/json" \
  -d '{"subject":"dragon flying","platform":"midjourney","styles":["Fantasy"],"mood":"Epic","lighting":"Dramatic","creativity":80,"duration":30,"includeNegative":true,"type":"image"}'
```

### 3. Check Logs for Errors
```bash
# If using PM2
pm2 logs --lines 100

# If using systemd
sudo journalctl -u your-app -n 100

# If using Docker
docker-compose logs --tail=100

# If using App Platform
# Check "Runtime Logs" in Digital Ocean dashboard
```

---

## 🔧 Troubleshooting

### Issue: Changes Not Showing Up

**Solution:**
```bash
# SSH into server
ssh your-user@your-server

# Check current commit
cd /path/to/your/app
git log --oneline -1

# If it's NOT e2058d5, pull again
git fetch origin
git reset --hard origin/main
git log --oneline -1  # Should now show e2058d5

# Clear cache and rebuild
rm -rf .next
npm run build
pm2 restart all
```

### Issue: Blog Articles Not Displaying

**Solution:**
```bash
# 1. Check if data directory exists
ls -la data/

# 2. Check if blog-articles.json exists and has content
cat data/blog-articles.json | head

# 3. If empty or missing, generate articles
curl "http://localhost:3000/api/blog/generate-all?secret=YOUR_CRON_SECRET&days=24"

# 4. Verify articles were created
ls -lh data/blog-articles.json
cat data/blog-articles.json | jq 'length'  # Should show 24
```

### Issue: Prompt Generation Not Working

**Solution:**
```bash
# 1. Check if DEEPSEEK_API_KEY is set
printenv | grep DEEPSEEK

# 2. If not set, add it to .env file
nano .env.production
# Add: DEEPSEEK_API_KEY=your_key_here

# 3. Restart with updated environment
pm2 restart all --update-env

# 4. Test the endpoint
curl -X POST http://localhost:3000/api/prompts/generate \
  -H "Content-Type: application/json" \
  -d '{"subject":"test","platform":"sora","styles":[],"mood":"","lighting":"","creativity":75,"duration":30,"includeNegative":false,"type":"video"}'
```

### Issue: Images Not Loading on Blog

**Solution:**
```bash
# Images should load from Unsplash
# Check browser console for CORS errors
# Verify Next.js config allows external images

# In next.config.js, ensure:
# images: {
#   domains: ['images.unsplash.com', 'images.pexels.com'],
#   unoptimized: true
# }

# Restart app after config change
pm2 restart all
```

### Issue: "Module not found" Errors

**Solution:**
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
pm2 restart all
```

### Issue: Port Already in Use

**Solution:**
```bash
# Find process using port 3000
lsof -i :3000
# OR
netstat -tulpn | grep 3000

# Kill the process
kill -9 PID_NUMBER

# Or kill all node processes
pkill -9 node

# Restart your app
pm2 restart all
```

---

## 🔐 Security Checklist

- [ ] DEEPSEEK_API_KEY is set and not exposed in logs
- [ ] CRON_SECRET is strong and random (at least 32 characters)
- [ ] NEWS_API_KEY is set correctly
- [ ] `.env` files are in `.gitignore` (NOT in GitHub)
- [ ] File permissions are correct: `chmod 755 data/`
- [ ] Firewall allows HTTP/HTTPS traffic
- [ ] SSL certificate is configured (use Certbot for Let's Encrypt)

---

## 📊 Monitor Your Deployment

### Check Application Health
```bash
# CPU and Memory usage
pm2 monit

# Or use htop
htop

# Check disk space
df -h

# Check data directory size
du -sh data/
```

### Application Logs
```bash
# Real-time logs
pm2 logs --lines 200

# Error logs only
pm2 logs --err

# Specific app logs
pm2 logs ai-prompts-gen
```

### Set Up Monitoring (Optional)
```bash
# Install PM2 monitoring
pm2 install pm2-logrotate

# Link to PM2 Plus (free monitoring)
pm2 link your-secret-key your-public-key
```

---

## 🎯 Success Indicators

After successful deployment, you should see:

1. ✅ **Blog Page**: Shows 24 articles across 3 pages (9 per page)
2. ✅ **Blog Images**: All images load correctly (Unsplash URLs)
3. ✅ **Prompt Generator**:
   - Image type: Shows 🍌 Nanobanana, Midjourney, DALL-E, Qwen
   - Video type: Shows Sora, Veo3
   - Auto-switches when changing type
4. ✅ **AI Enhancement**: Generated prompts are 400-550 characters (enhanced by DeepSeek)
5. ✅ **No Console Errors**: Browser console shows no API errors
6. ✅ **Fast Loading**: Pages load in < 2 seconds

---

## 📞 Need Help?

If you're still having issues:

1. **Check the logs first:**
   ```bash
   pm2 logs --lines 500
   ```

2. **Verify git status:**
   ```bash
   git log --oneline -1
   git status
   ```

3. **Test locally first:**
   ```bash
   npm run dev
   # Visit http://localhost:3000
   ```

4. **Check Digital Ocean Status:**
   - Visit https://status.digitalocean.com/
   - Ensure no outages in your region

---

## 📝 Next Steps After Deployment

1. **Set up daily blog generation cron:**
   ```bash
   # Add to crontab
   crontab -e
   
   # Add this line (runs daily at midnight):
   0 0 * * * curl "http://localhost:3000/api/blog/generate-daily?secret=YOUR_SECRET"
   ```

2. **Set up SSL certificate:**
   ```bash
   sudo certbot --nginx -d your-domain.com
   ```

3. **Configure backups:**
   ```bash
   # Backup data directory daily
   0 2 * * * tar -czf /backups/data-$(date +\%Y\%m\%d).tar.gz /path/to/app/data/
   ```

4. **Monitor application:**
   - Set up uptime monitoring (e.g., UptimeRobot)
   - Configure PM2 Plus for advanced monitoring

---

✅ **Your application is now deployed and running on Digital Ocean!** 🎉
