# 🚀 Quick Reference: GitHub to Digital Ocean Deployment

## 📝 Required GitHub Secrets

Add these in: **Settings → Secrets and variables → Actions → New repository secret**

| Secret Name | Value | How to Get |
|-------------|-------|------------|
| `DO_SSH_KEY` | Private SSH key | `cat ~/.ssh/github_actions_deploy` |
| `DO_HOST` | Droplet IP address | Digital Ocean dashboard (e.g., `167.99.123.45`) |
| `DO_USERNAME` | SSH username | Usually `root` or `deploy` |
| `DO_PROJECT_PATH` | Project path on server | e.g., `/var/www/ai-prompts-gen` |
| `DO_PORT` | SSH port (optional) | Default: `22` |
| `CRON_SECRET` | Cron endpoint secret | From your `.env` file |

---

## 🔑 SSH Key Setup (5 Minutes)

```bash
# 1. Generate key pair (on your local machine)
ssh-keygen -t ed25519 -f ~/.ssh/github_actions_deploy -C "github-deploy"
# Press Enter when asked for passphrase (no passphrase)

# 2. Copy public key to clipboard
cat ~/.ssh/github_actions_deploy.pub
# Copy the output

# 3. Add to Digital Ocean droplet
ssh root@your-droplet-ip
mkdir -p ~/.ssh
nano ~/.ssh/authorized_keys
# Paste the public key, save (Ctrl+X, Y, Enter)
chmod 600 ~/.ssh/authorized_keys
exit

# 4. Copy private key for GitHub
cat ~/.ssh/github_actions_deploy
# Copy ALL output (including BEGIN/END lines)
# Paste into GitHub Secret: DO_SSH_KEY
```

---

## ✅ Pre-Deployment Checklist

Run these commands on your Digital Ocean droplet:

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2
npm install -g pm2

# Clone repo (first time only)
mkdir -p /var/www/ai-prompts-gen
cd /var/www/ai-prompts-gen
git clone https://github.com/YOUR-USERNAME/YOUR-REPO.git .

# Setup
npm install
npm run build
pm2 start npm --name "ai-prompts-gen" -- start
pm2 save
pm2 startup
```

---

## 🧪 Test Deployment

### Manual Test
1. Go to GitHub → **Actions** tab
2. Click **Deploy to Digital Ocean**
3. Click **Run workflow** → **Run workflow**
4. Watch it execute ✅

### Automatic Test
```bash
# Make a test commit
echo "# Test" >> README.md
git add README.md
git commit -m "test: Auto-deployment"
git push origin main

# Watch GitHub Actions automatically deploy!
```

---

## 🔍 Verify Deployment

```bash
# SSH to droplet
ssh root@your-droplet-ip

# Check if code updated
cd /var/www/ai-prompts-gen
git log --oneline -1

# Check app status
pm2 status
pm2 logs ai-prompts-gen --lines 20

# Test app
curl http://localhost:3000
```

---

## 🐛 Common Issues & Fixes

| Error | Solution |
|-------|----------|
| "Permission denied (publickey)" | Check public key in `/root/.ssh/authorized_keys` |
| "npm: command not found" | Install Node.js: `curl -fsSL https://deb.nodesource.com/setup_20.x \| sudo bash -` |
| "pm2: command not found" | Install PM2: `npm install -g pm2` |
| Build succeeds, site doesn't update | Restart PM2: `pm2 restart all` |
| "Cannot find module..." | Reinstall: `rm -rf node_modules && npm install` |

---

## 📊 Monitor Your App

```bash
# Real-time monitoring
pm2 monit

# View logs
pm2 logs

# App status
pm2 status

# Restart if needed
pm2 restart ai-prompts-gen
```

---

## 🔔 What Happens on Each Push

```
1. You push code to GitHub main branch
   ↓
2. GitHub Actions workflow triggers
   ↓
3. Connects to Digital Ocean via SSH
   ↓
4. Pulls latest code
   ↓
5. Installs dependencies (npm install)
   ↓
6. Builds app (npm run build)
   ↓
7. Restarts with PM2
   ↓
8. ✅ Your site is updated!
```

---

## 📱 Quick Commands

```bash
# Check deployment status
pm2 status

# View live logs
pm2 logs ai-prompts-gen

# Restart app
pm2 restart ai-prompts-gen

# Stop app
pm2 stop ai-prompts-gen

# Start app
pm2 start ai-prompts-gen

# Delete app from PM2
pm2 delete ai-prompts-gen

# Save PM2 config
pm2 save
```

---

## 📚 Full Guides

- **Setup Guide:** [GITHUB_AUTO_DEPLOY_SETUP.md](./GITHUB_AUTO_DEPLOY_SETUP.md)
- **Workflows Info:** [.github/workflows/README.md](./.github/workflows/README.md)
- **Manual Deploy:** [DIGITAL_OCEAN_DEPLOY.md](./DIGITAL_OCEAN_DEPLOY.md)

---

## ✅ Success Indicators

- ✅ GitHub Actions shows green checkmark
- ✅ `pm2 status` shows app running
- ✅ `git log` shows latest commit
- ✅ Site loads with new changes
- ✅ No errors in `pm2 logs`

**You're all set! 🎉 Push to main and watch the magic happen!**
