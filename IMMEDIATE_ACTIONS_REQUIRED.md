# 🚨 IMMEDIATE ACTIONS REQUIRED - Security Breach Response

## ✅ Completed Actions

1. ✅ **Removed malicious redirect script** from `app/layout.tsx`
   - Deleted: `https://pl28340926.effectivegatecpm.com/b5f74cb024e464af5087017b5cf56ec6/invoke.js`
   
2. ✅ **Updated Next.js** from 13.5.1 → 14.2.35 (latest patched version)

3. ✅ **Verified ads.txt** - Clean, contains only authorized Google AdSense publisher

4. ✅ **Pushed to GitHub** - All security fixes committed

---

## 🔴 CRITICAL: DO THIS NOW (Within 1 Hour)

### 1. Rotate ALL Environment Variables in DigitalOcean

**Your site may still be compromised until you rotate these secrets!**

#### Step-by-Step:

1. **Go to DigitalOcean Dashboard:**
   - Visit: https://cloud.digitalocean.com
   - Navigate to your App

2. **Generate New Secrets:**

```powershell
# Generate new NEXTAUTH_SECRET (run in PowerShell):
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"

# Generate new CRON_SECRET:
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

3. **Update These Environment Variables:**

Go to **Settings** → **App-Level Environment Variables** and update:

```bash
# CRITICAL - Generate new value
NEXTAUTH_SECRET=<paste-new-secret-from-step-2>

# CRITICAL - Generate new value  
CRON_SECRET=<paste-new-secret-from-step-2>

# Get new credentials from Google Cloud Console
GOOGLE_CLIENT_ID=<get-new-from-google>
GOOGLE_CLIENT_SECRET=<get-new-from-google>

# Get new API key from DeepSeek Platform
DEEPSEEK_API_KEY=<get-new-from-deepseek>

# Database - Get new connection string from Neon/Supabase
DATABASE_URL=<get-new-connection-string>

# Keep same (update if compromised)
ADMIN_EMAIL=lookinternationallk@gmail.com
NEXTAUTH_URL=https://www.aipromptgen.app
```

4. **Save and Redeploy:**
   - Click **Save** in DigitalOcean
   - Wait for automatic redeployment
   - Test the application

---

## 📋 How to Get New Credentials

### Google OAuth (Client ID & Secret)

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Navigate to **APIs & Services** → **Credentials**
3. Click on your OAuth 2.0 Client ID
4. Click **Reset Secret** or create a new OAuth client
5. Copy new Client ID and Client Secret
6. Update in DigitalOcean

### DeepSeek API Key

1. Go to [DeepSeek Platform](https://platform.deepseek.com)
2. Navigate to **API Keys** section
3. Delete old API key
4. Click **Create New Key**
5. Copy the new key
6. Update in DigitalOcean

### Database URL (Neon)

1. Go to [Neon Console](https://console.neon.tech)
2. Select your project
3. Go to **Dashboard** → **Connection Details**
4. Click **Reset Password** (if needed)
5. Copy new connection string
6. Update in DigitalOcean

**OR** - Create a completely new database:
- Create new Neon project
- Run migrations: `npm run db:migrate`
- Update DATABASE_URL

---

## 🔍 Additional Security Checks

### Check Git History for Suspicious Commits

```powershell
cd "d:\My Projects\AI Prompts Gen\project"

# View recent commits
git log --oneline -20

# Look for when the malicious script was added
git log --all --full-history -- "app/layout.tsx"

# Check who made the changes
git log --all --author=".*" --oneline -20
```

### Check GitHub Access

1. Go to your GitHub repository settings
2. Check **Settings** → **Manage access**
3. Review who has access
4. Remove any unauthorized collaborators

### Enable GitHub Security

```powershell
# Enable branch protection (in GitHub repo settings):
# Settings → Branches → Add rule
# - Require pull request reviews
# - Require status checks to pass
# - Include administrators
```

---

## 🛡️ Test After Deployment

### 1. Test for Redirects

Visit your site and check:
- ✅ Homepage loads correctly
- ✅ No unexpected redirects
- ✅ Browser console has no errors
- ✅ All navigation works properly

```
Visit: https://www.aipromptgen.app
Check: Should stay on your domain, no external redirects
```

### 2. Test Authentication

- ✅ Google OAuth login works
- ✅ Sign up works
- ✅ Credits are tracked correctly

### 3. Test API Endpoints

```powershell
# Test prompt generation (requires authentication)
Invoke-WebRequest -Uri "https://www.aipromptgen.app/api/prompts/generate" -Method POST

# Test news API
Invoke-WebRequest -Uri "https://www.aipromptgen.app/api/news/latest"
```

---

## 📊 Monitoring

### Set Up Alerts

1. **Google Search Console** - Check for security warnings
2. **Google AdSense** - Monitor for policy violations
3. **DigitalOcean** - Set up uptime monitoring
4. **UptimeRobot** (Free) - https://uptimerobot.com

### Regular Security Audits

- [ ] Weekly: Check for unauthorized scripts
- [ ] Weekly: Review DigitalOcean logs
- [ ] Monthly: Update dependencies (`npm audit fix`)
- [ ] Monthly: Review GitHub access logs

---

## 📞 If You See Continued Issues

### Signs of Persistent Compromise:

- Redirects still happening after secret rotation
- Unauthorized ads appearing
- Database records being modified
- Unusual API usage

### Emergency Actions:

1. **Take site offline** (pause app in DigitalOcean)
2. **Create fresh deployment:**
   - New DigitalOcean app
   - New database
   - New domain (if needed)
   - Fresh git clone
3. **Contact support:**
   - DigitalOcean support
   - Google AdSense support
   - Report to GitHub if repo was compromised

---

## ✅ Checklist

- [ ] Generated new NEXTAUTH_SECRET
- [ ] Generated new CRON_SECRET  
- [ ] Created new Google OAuth credentials
- [ ] Created new DeepSeek API key
- [ ] Updated/rotated DATABASE_URL
- [ ] Updated all env vars in DigitalOcean
- [ ] Saved and redeployed app
- [ ] Tested site for redirects
- [ ] Tested authentication
- [ ] Tested API endpoints
- [ ] Reviewed GitHub access logs
- [ ] Set up monitoring alerts
- [ ] Documented incident

---

## 📄 Related Documentation

- [SECURITY_FIX_2026-01-11.md](./SECURITY_FIX_2026-01-11.md) - Full security report
- [GOOGLE_OAUTH_SETUP.md](./GOOGLE_OAUTH_SETUP.md) - OAuth setup guide
- [DEPLOYMENT.md](./DEPLOYMENT.md) - Deployment instructions

---

**Last Updated:** January 11, 2026  
**Urgency:** CRITICAL - Complete within 1 hour  
**Status:** Awaiting secret rotation and redeployment
