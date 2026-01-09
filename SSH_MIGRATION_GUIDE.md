# 🔐 SSH into Digital Ocean & Run Database Migration

## Step-by-Step Guide for Windows PowerShell

---

## Option 1: Using Digital Ocean Web Console (Easiest)

### Step 1: Log into Digital Ocean Dashboard
1. Go to https://cloud.digitalocean.com/
2. Log in with your credentials
3. Click on **"Droplets"** in the left sidebar

### Step 2: Access Console
1. Find your droplet (server) in the list
2. Click on the droplet name
3. Click the **"Console"** button in the top right
4. A web-based terminal will open - you're now connected! 🎉

### Step 3: Navigate to Your Project
```bash
# Find your project directory
cd /var/www
ls -la

# OR try these common locations:
cd /home/deploy
cd /opt
cd ~/

# Once you find it, navigate into it
cd ai-prompts-gen
# or whatever your project folder is named
```

### Step 4: Pull Latest Code
```bash
# Pull the latest changes from GitHub
git pull origin main

# You should see the new files being pulled
```

### Step 5: Install Dependencies
```bash
# Install any new npm packages
npm install
```

### Step 6: Run Database Migration
```bash
# Generate Prisma client with new models
npx prisma generate

# Run the database migration
npx prisma migrate deploy

# You should see:
# ✔ Applied migration: add_prompt_history_and_update_credits
```

### Step 7: Restart Your Application
```bash
# If using PM2:
pm2 restart all
# OR
pm2 restart ai-prompts-gen

# If using systemd:
sudo systemctl restart your-app-name

# If using Docker:
docker-compose restart
```

### Step 8: Verify Deployment
```bash
# Check if app is running
pm2 status
# OR
pm2 logs

# Test the API
curl http://localhost:3000/api/health
```

---

## Option 2: Using SSH from Windows PowerShell

### Prerequisites
Windows 10/11 has built-in SSH client. If not available, install it:
```powershell
# Check if SSH is installed
ssh -V

# If not installed, enable it:
Add-WindowsCapability -Online -Name OpenSSH.Client~~~~0.0.1.0
```

### Step 1: Find Your Server IP Address
1. Go to Digital Ocean Dashboard
2. Click on your Droplet
3. Copy the **IPv4 address** (e.g., `167.99.123.45`)

### Step 2: Get Your SSH Credentials

#### If you have SSH Key configured:
```powershell
# Open PowerShell and connect
ssh root@YOUR_DROPLET_IP

# Example:
ssh root@167.99.123.45
```

#### If you use password:
```powershell
# Connect and enter password when prompted
ssh root@YOUR_DROPLET_IP
# Type your password (won't show as you type)
```

#### If you have a custom user:
```powershell
# Connect with username
ssh your-username@YOUR_DROPLET_IP

# Example:
ssh deploy@167.99.123.45
```

### Step 3: Accept Fingerprint (First Time Only)
```
The authenticity of host 'xxx.xxx.xxx.xxx' can't be established.
ECDSA key fingerprint is SHA256:xxxxxxxxxxxxx.
Are you sure you want to continue connecting (yes/no/[fingerprint])?
```
Type: **yes** and press Enter

### Step 4: You're Now Connected! 🎉
You should see something like:
```
Welcome to Ubuntu 22.04.1 LTS
root@your-droplet:~#
```

### Step 5: Navigate to Project & Run Migration
```bash
# Find your project
cd /var/www
ls

# Go into your project folder
cd ai-prompts-gen  # or your folder name

# Pull latest code
git pull origin main

# Install dependencies
npm install

# Generate Prisma client
npx prisma generate

# Run migration
npx prisma migrate deploy

# Restart app
pm2 restart all
```

---

## Option 3: Using PuTTY (Alternative Windows Tool)

### Step 1: Download PuTTY
1. Download from: https://www.putty.org/
2. Install PuTTY

### Step 2: Open PuTTY
1. Open PuTTY application
2. In "Host Name" field, enter: `root@YOUR_DROPLET_IP`
   - Example: `root@167.99.123.45`
3. Port: `22`
4. Connection type: `SSH`
5. Click **"Open"**

### Step 3: Login
1. Enter username (usually `root`)
2. Enter password
3. You're connected! Follow Step 5 from Option 2 above

---

## 🔍 Troubleshooting

### Issue 1: "Permission denied (publickey)"
**Solution A**: Use password authentication
```powershell
ssh -o PreferredAuthentications=password root@YOUR_IP
```

**Solution B**: Find your SSH key location
```powershell
# Check for SSH keys
ls ~/.ssh/
# Look for: id_rsa, id_ed25519, or similar

# Connect with specific key
ssh -i ~/.ssh/your_key_name root@YOUR_IP
```

### Issue 2: "Connection refused"
- Check your droplet IP address is correct
- Verify your droplet is running (check Digital Ocean dashboard)
- Check if firewall allows SSH (port 22)

### Issue 3: "Host key verification failed"
```powershell
# Remove old key and try again
ssh-keygen -R YOUR_DROPLET_IP
ssh root@YOUR_DROPLET_IP
```

### Issue 4: Can't find SSH key
1. Go to Digital Ocean Dashboard
2. Click "Settings" → "Security" → "SSH Keys"
3. Download or reset your SSH key
4. Or use Password authentication instead

### Issue 5: Forgot Password
1. Go to Digital Ocean Dashboard
2. Click on your Droplet
3. Click "Access" → "Reset Root Password"
4. Check your email for new password

---

## 📋 Complete Migration Commands (Copy & Paste)

Once you're connected via SSH, run these commands:

```bash
# 1. Navigate to project (adjust path if needed)
cd /var/www/ai-prompts-gen

# 2. Pull latest code
git pull origin main

# 3. Install dependencies
npm install

# 4. Generate Prisma client
npx prisma generate

# 5. Run migration
npx prisma migrate deploy

# 6. Restart application (choose one based on your setup)
pm2 restart all
# OR
sudo systemctl restart your-app-name
# OR
docker-compose restart

# 7. Check status
pm2 status
pm2 logs --lines 50

# 8. Test the deployment
curl http://localhost:3000/
```

---

## ✅ Verification Steps

After migration, verify everything works:

### 1. Check Database
```bash
npx prisma studio
# Opens database viewer in browser
```

### 2. Check if PromptHistory table exists
```bash
npx prisma db execute --stdin <<< "SELECT * FROM \"PromptHistory\" LIMIT 1;"
```

### 3. Test the application
```bash
# Check app is running
curl http://localhost:3000/

# Test API endpoint
curl http://localhost:3000/api/admin/usage?days=7
```

### 4. Check logs for errors
```bash
pm2 logs ai-prompts-gen --lines 100
# OR
journalctl -u your-app-name -n 100
```

---

## 🎯 Quick Reference Card

### Digital Ocean Dashboard
```
URL: https://cloud.digitalocean.com/
→ Droplets → Your Droplet → Console (button)
```

### SSH Command
```bash
ssh root@YOUR_DROPLET_IP
# Enter password when prompted
```

### Migration Commands (in order)
```bash
cd /var/www/ai-prompts-gen
git pull origin main
npm install
npx prisma generate
npx prisma migrate deploy
pm2 restart all
```

### Check Status
```bash
pm2 status
pm2 logs
```

---

## 🆘 Need Help?

If you get stuck:

1. **Use Web Console**: Easiest option - no SSH setup needed
   - Digital Ocean Dashboard → Droplets → Your Droplet → Console

2. **Check your project location**:
   ```bash
   # Try these commands to find your project
   find / -name "package.json" -type f 2>/dev/null | grep ai-prompt
   cd ~
   ls -la
   ```

3. **Reset and start fresh**:
   - Use Digital Ocean web console
   - Reset root password from dashboard
   - Connect via console (no SSH needed)

---

## 📝 What Each Command Does

| Command | What It Does |
|---------|-------------|
| `ssh root@IP` | Connect to your server |
| `cd /var/www/...` | Go to project folder |
| `git pull` | Download latest code from GitHub |
| `npm install` | Install new packages |
| `npx prisma generate` | Update database code |
| `npx prisma migrate deploy` | Update database structure |
| `pm2 restart all` | Restart your app |
| `pm2 logs` | View app logs |

---

**Next**: After successful migration, your cost optimizations will be live! 🚀

Expected improvements:
- ✅ Free tier: 50 credits (was 70)
- ✅ Rate limiting: 10/day for free users
- ✅ API costs reduced by 20-35%
- ✅ Usage tracking enabled
