# GitHub Actions Workflows

This directory contains automated workflows for the AI Prompts Gen project.

## 📋 Available Workflows

### 1. Deploy to Digital Ocean (`deploy-digital-ocean.yml`)
Automatically deploys the application to your Digital Ocean droplet when code is pushed to the `main` branch.

**Triggers:**
- Automatic: On push to `main` branch
- Manual: Via GitHub Actions tab → "Run workflow"

**Required Secrets:**
You must configure these secrets in your GitHub repository settings:

1. Go to your GitHub repository
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret** and add each of these:

| Secret Name | Description | Example |
|-------------|-------------|---------|
| `DO_HOST` | Your Digital Ocean droplet IP address | `167.99.123.45` |
| `DO_USERNAME` | SSH username (usually `root` or `deploy`) | `root` |
| `DO_SSH_KEY` | Private SSH key for authentication | Contents of your private key file |
| `DO_PORT` | SSH port (optional, defaults to 22) | `22` |
| `DO_PROJECT_PATH` | Path to your project on the server | `/var/www/ai-prompts-gen` |

**How to Get Your SSH Key:**

```bash
# On your local machine, generate a new SSH key if you don't have one:
ssh-keygen -t ed25519 -C "github-actions@ai-prompts-gen"

# Copy the PRIVATE key content (this goes in DO_SSH_KEY secret):
cat ~/.ssh/id_ed25519

# Copy the PUBLIC key to your Digital Ocean droplet:
ssh-copy-id root@your-droplet-ip

# Or manually add it to the droplet:
cat ~/.ssh/id_ed25519.pub
# Then paste it into your droplet's ~/.ssh/authorized_keys
```

**What It Does:**
1. ✅ Connects to your Digital Ocean droplet via SSH
2. ⬇️ Pulls the latest code from GitHub
3. 📦 Installs dependencies
4. 🔨 Builds the application
5. 🔄 Restarts the app using PM2
6. ✅ Verifies deployment status

---

### 2. Monthly Credit Reset (`reset-credits.yml`)
Automatically resets user credits on the 1st of every month.

**Triggers:**
- Automatic: Monthly on the 1st at 00:00 UTC
- Manual: Via GitHub Actions tab → "Run workflow"

**Required Secrets:**
- `CRON_SECRET` - Your cron endpoint authorization token

**Configuration:**
Update the domain in the workflow file:
```yaml
curl -X GET https://your-domain.com/api/cron/reset-credits
```

---

## 🔧 Setup Instructions

### Step 1: Configure GitHub Secrets

1. **Generate SSH Key Pair:**
   ```bash
   ssh-keygen -t ed25519 -f ~/.ssh/digitalocean_deploy -C "deploy@ai-prompts-gen"
   ```

2. **Add Public Key to Digital Ocean:**
   ```bash
   # Copy public key
   cat ~/.ssh/digitalocean_deploy.pub
   
   # SSH to your droplet and add it
   ssh root@your-droplet-ip
   mkdir -p ~/.ssh
   echo "paste-your-public-key-here" >> ~/.ssh/authorized_keys
   chmod 600 ~/.ssh/authorized_keys
   ```

3. **Add Private Key to GitHub:**
   - Copy the entire private key: `cat ~/.ssh/digitalocean_deploy`
   - Go to GitHub → Settings → Secrets → New secret
   - Name: `DO_SSH_KEY`
   - Value: Paste the entire private key (including `-----BEGIN` and `-----END` lines)

4. **Add Other Secrets:**
   - `DO_HOST`: Your droplet IP (e.g., `167.99.123.45`)
   - `DO_USERNAME`: Usually `root` or `deploy`
   - `DO_PROJECT_PATH`: e.g., `/var/www/ai-prompts-gen`
   - `CRON_SECRET`: Your cron secret from `.env`

### Step 2: Test the Workflow

1. Go to **Actions** tab in your GitHub repository
2. Select **Deploy to Digital Ocean**
3. Click **Run workflow** → **Run workflow**
4. Watch the deployment progress
5. Check the logs for any errors

### Step 3: Verify Deployment

After the workflow completes:
```bash
# SSH to your droplet
ssh root@your-droplet-ip

# Check PM2 status
pm2 status

# Check application logs
pm2 logs ai-prompts-gen --lines 50
```

---

## 🔍 Troubleshooting

### "Permission denied (publickey)"
- Ensure your public key is in `/root/.ssh/authorized_keys` on the droplet
- Check that the private key in GitHub secrets is complete and correct
- Verify SSH key permissions: `chmod 600 ~/.ssh/authorized_keys`

### "npm: command not found"
- SSH to your droplet and install Node.js:
  ```bash
  curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
  sudo apt-get install -y nodejs
  ```

### "PM2 not found"
- Install PM2 globally on your droplet:
  ```bash
  npm install -g pm2
  ```

### Build Fails
- Check if you have enough disk space: `df -h`
- Check if you have enough memory: `free -h`
- Review build logs in GitHub Actions
- Verify environment variables are set on the droplet

### Deployment Succeeds but Site Doesn't Update
- Check PM2 logs: `pm2 logs`
- Verify the application is running: `pm2 status`
- Check if port is correct: `netstat -tlnp | grep 3000`
- Verify nginx configuration if using reverse proxy

---

## 📚 Additional Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [SSH Action by appleboy](https://github.com/appleboy/ssh-action)
- [Digital Ocean Deployment Guide](https://www.digitalocean.com/community/tutorials)
- [PM2 Documentation](https://pm2.keymetrics.io/docs/usage/quick-start/)

---

## 🔐 Security Best Practices

1. **Never commit secrets** to your repository
2. **Use separate SSH keys** for deployment (not your personal key)
3. **Limit SSH key permissions** to only what's needed
4. **Rotate secrets** regularly (every 90 days)
5. **Review workflow logs** for sensitive information before making public
6. **Use environment-specific** secrets for different environments

---

## 📝 Workflow Customization

To modify when deployments happen, edit `.github/workflows/deploy-digital-ocean.yml`:

```yaml
# Deploy only on tags
on:
  push:
    tags:
      - 'v*'

# Deploy on specific branches
on:
  push:
    branches:
      - main
      - production

# Deploy on pull request merge
on:
  pull_request:
    types: [closed]
    branches:
      - main
```

---

**Need Help?** Check the [DIGITAL_OCEAN_DEPLOY.md](../../DIGITAL_OCEAN_DEPLOY.md) guide for more details.
