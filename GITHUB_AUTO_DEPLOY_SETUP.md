# 🚀 GitHub to Digital Ocean Auto-Deployment Setup

This guide will help you set up automatic deployment from GitHub to your Digital Ocean droplet.

## ✅ What This Does

Every time you push code to GitHub's `main` branch, it will automatically:
1. Connect to your Digital Ocean server
2. Pull the latest code
3. Install dependencies
4. Build the application
5. Restart the app with PM2
6. Notify you of success or failure

## 📋 Prerequisites

- ✅ A Digital Ocean droplet running Ubuntu/Debian
- ✅ Node.js and npm installed on the droplet
- ✅ Your application already deployed once manually
- ✅ SSH access to your droplet
- ✅ GitHub repository with your code

---

## 🔧 Step-by-Step Setup

### Step 1: Prepare Your Digital Ocean Droplet

SSH into your droplet and set up the required software:

```bash
# SSH to your droplet
ssh root@your-droplet-ip

# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js (if not already installed)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 globally
npm install -g pm2

# Navigate to your project directory or create it
mkdir -p /var/www/ai-prompts-gen
cd /var/www/ai-prompts-gen

# Clone your repository (first time only)
git clone https://github.com/YOUR-USERNAME/YOUR-REPO.git .

# Install dependencies
npm install

# Build the app
npm run build

# Start with PM2
pm2 start npm --name "ai-prompts-gen" -- start
pm2 save
pm2 startup

# Verify it's running
pm2 status
```

### Step 2: Generate SSH Keys for GitHub Actions

On your **local machine** (not the droplet), generate a dedicated SSH key:

```bash
# Generate new SSH key pair
ssh-keygen -t ed25519 -f ~/.ssh/github_actions_deploy -C "github-actions@ai-prompts-gen"

# When prompted for passphrase, press Enter (no passphrase for automation)
```

This creates two files:
- `~/.ssh/github_actions_deploy` (private key - keep secret!)
- `~/.ssh/github_actions_deploy.pub` (public key - safe to share)

### Step 3: Add Public Key to Digital Ocean

Copy the public key to your droplet:

```bash
# Display your public key
cat ~/.ssh/github_actions_deploy.pub

# Copy the output, then SSH to your droplet
ssh root@your-droplet-ip

# Add the public key to authorized keys
mkdir -p ~/.ssh
chmod 700 ~/.ssh
nano ~/.ssh/authorized_keys

# Paste the public key on a new line
# Save and exit (Ctrl+X, Y, Enter)

# Set correct permissions
chmod 600 ~/.ssh/authorized_keys
```

**Test the connection:**
```bash
# From your local machine
ssh -i ~/.ssh/github_actions_deploy root@your-droplet-ip

# If it works without asking for a password, you're good!
```

### Step 4: Add Secrets to GitHub

1. **Go to your GitHub repository**
2. Click **Settings** (top right)
3. Click **Secrets and variables** → **Actions** (left sidebar)
4. Click **New repository secret**

Add these secrets one by one:

#### Secret 1: DO_SSH_KEY
```bash
# On your local machine, display the PRIVATE key:
cat ~/.ssh/github_actions_deploy

# Copy the ENTIRE output including:
# -----BEGIN OPENSSH PRIVATE KEY-----
# ... all the content ...
# -----END OPENSSH PRIVATE KEY-----
```
- **Name:** `DO_SSH_KEY`
- **Value:** Paste the entire private key
- Click **Add secret**

#### Secret 2: DO_HOST
- **Name:** `DO_HOST`
- **Value:** Your droplet IP address (e.g., `167.99.123.45`)
- Click **Add secret**

#### Secret 3: DO_USERNAME
- **Name:** `DO_USERNAME`
- **Value:** `root` (or your SSH username)
- Click **Add secret**

#### Secret 4: DO_PROJECT_PATH
- **Name:** `DO_PROJECT_PATH`
- **Value:** `/var/www/ai-prompts-gen` (your project path on the server)
- Click **Add secret**

#### Secret 5: DO_PORT (Optional)
- **Name:** `DO_PORT`
- **Value:** `22` (only if using a different SSH port)
- Click **Add secret**

#### Secret 6: CRON_SECRET (For monthly credit reset)
- **Name:** `CRON_SECRET`
- **Value:** Your cron secret from `.env` file
- Click **Add secret**

### Step 5: Update Credit Reset Workflow (Optional)

Edit `.github/workflows/reset-credits.yml` to use your production domain:

```yaml
curl -X GET https://your-actual-domain.com/api/cron/reset-credits \
```

### Step 6: Test the Deployment

#### Option A: Push to GitHub (Automatic)
```bash
# Make a small change to test
echo "# Test deployment" >> README.md
git add README.md
git commit -m "test: Verify GitHub Actions deployment"
git push origin main
```

#### Option B: Manual Trigger
1. Go to your GitHub repository
2. Click **Actions** tab
3. Click **Deploy to Digital Ocean** workflow
4. Click **Run workflow** button
5. Click green **Run workflow** button

#### Watch the Progress
1. Click on the running workflow
2. Click on the **deploy** job
3. Watch each step execute
4. Look for the ✅ success message

### Step 7: Verify Deployment on Digital Ocean

SSH to your droplet and check:

```bash
ssh root@your-droplet-ip

# Check if code was updated
cd /var/www/ai-prompts-gen
git log --oneline -1

# Check PM2 status
pm2 status

# Check application logs
pm2 logs ai-prompts-gen --lines 50

# Check if the app is responding
curl http://localhost:3000
```

---

## 🔍 Troubleshooting

### ❌ "Permission denied (publickey)"

**Problem:** GitHub Actions can't connect to your droplet.

**Solutions:**
1. Verify the public key is in `/root/.ssh/authorized_keys`
2. Check permissions: `chmod 600 ~/.ssh/authorized_keys`
3. Ensure you copied the ENTIRE private key including begin/end lines
4. Test SSH manually: `ssh -i ~/.ssh/github_actions_deploy root@your-droplet-ip`

### ❌ "npm: command not found"

**Problem:** Node.js not installed on the droplet.

**Solution:**
```bash
# SSH to droplet and install Node.js
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
node --version  # Verify installation
```

### ❌ "pm2: command not found"

**Problem:** PM2 not installed globally.

**Solution:**
```bash
# SSH to droplet
npm install -g pm2
pm2 --version  # Verify installation
```

### ❌ Build Succeeds but Site Doesn't Update

**Problem:** App not restarting properly.

**Solutions:**
```bash
# SSH to droplet
pm2 list                    # Check if app is running
pm2 restart ai-prompts-gen  # Manually restart
pm2 logs ai-prompts-gen     # Check for errors
```

### ❌ "Error: Cannot find module..."

**Problem:** Dependencies not installed.

**Solution:**
```bash
# SSH to droplet
cd /var/www/ai-prompts-gen
rm -rf node_modules package-lock.json
npm install
npm run build
pm2 restart all
```

### ❌ Workflow Shows "Error: Process completed with exit code 1"

**Problem:** Build or deployment command failed.

**Solutions:**
1. Click on the failed step in GitHub Actions to see exact error
2. Check if there are TypeScript errors: Run `npm run build` locally first
3. Verify all environment variables are set on the droplet
4. Check disk space: `df -h`
5. Check memory: `free -h`

---

## 🔒 Security Checklist

- ✅ SSH key is dedicated for GitHub Actions (not reused)
- ✅ Private key stored as GitHub secret (never committed to repo)
- ✅ Public key only on Digital Ocean (not GitHub)
- ✅ Secrets properly configured in GitHub repository settings
- ✅ SSH authentication works without password
- ✅ Firewall configured on droplet (UFW or similar)

---

## 📊 Monitoring Deployments

### GitHub Actions Dashboard
- Go to **Actions** tab in your repository
- See all deployment history
- View logs for each deployment
- Re-run failed deployments

### Digital Ocean Monitoring
```bash
# SSH to droplet
pm2 monit              # Real-time monitoring
pm2 logs               # Live logs
pm2 status             # Application status
journalctl -u pm2-root # System logs
```

### Setting Up Notifications

Add to your workflow file to get notifications:

```yaml
- name: Notify on Success
  if: success()
  uses: 8398a7/action-slack@v3
  with:
    status: ${{ job.status }}
    text: '✅ Deployment successful!'
    webhook_url: ${{ secrets.SLACK_WEBHOOK }}
```

---

## 🎯 Next Steps

1. ✅ Set up SSL certificate with Let's Encrypt
2. ✅ Configure Nginx as reverse proxy
3. ✅ Set up automated backups
4. ✅ Configure monitoring and alerts
5. ✅ Set up staging environment
6. ✅ Add database migration workflow

---

## 📚 Related Documentation

- [GitHub Actions Workflows README](./.github/workflows/README.md)
- [Digital Ocean Deploy Guide](./DIGITAL_OCEAN_DEPLOY.md)
- [Production Deployment](./PRODUCTION-DEPLOYMENT.md)
- [Security Setup](./DIGITAL_OCEAN_SECURE_SETUP.md)

---

## 🆘 Getting Help

If you encounter issues:

1. **Check GitHub Actions logs** - Most detailed error information
2. **SSH to droplet and check PM2 logs** - `pm2 logs`
3. **Review this guide** - Common issues covered above
4. **Check Digital Ocean status** - https://status.digitalocean.com
5. **Search GitHub Issues** - Someone may have had same problem

---

## ✅ Success Checklist

After setup, you should have:

- ✅ GitHub Actions workflow file (`.github/workflows/deploy-digital-ocean.yml`)
- ✅ All 5 secrets configured in GitHub repository settings
- ✅ SSH connection working from GitHub Actions to droplet
- ✅ PM2 running your application on the droplet
- ✅ Successful test deployment completed
- ✅ Application accessible and working
- ✅ Automatic deployment triggered on push to main

**Congratulations! 🎉 Your auto-deployment is now set up!**

Every time you push to `main`, your site will automatically update on Digital Ocean.
