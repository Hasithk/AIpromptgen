# 🔐 Google OAuth Setup Guide for Digital Ocean

## 📋 Prerequisites
- Your app is deployed on Digital Ocean
- You have a domain name (recommended) or Digital Ocean IP address
- Access to [Google Cloud Console](https://console.cloud.google.com/)

---

## 🌐 Your Authorized Redirect URIs

### For Digital Ocean App Platform:
```
https://your-app-name.ondigitalocean.app/api/auth/callback/google
```

### For Custom Domain:
```
https://yourdomain.com/api/auth/callback/google
```

### For Development (localhost):
```
http://localhost:3000/api/auth/callback/google
```

**⚠️ Important:** Replace with your actual domain/app name!

---

## 🚀 Step-by-Step Setup

### Step 1: Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click **"Select a Project"** → **"New Project"**
3. Enter project details:
   - **Project Name:** `AI Prompts Gen` (or your choice)
   - **Location:** Your organization (optional)
4. Click **"Create"**

---

### Step 2: Enable Google+ API

1. In the left sidebar, go to **"APIs & Services"** → **"Library"**
2. Search for **"Google+ API"**
3. Click on it and press **"Enable"**
4. Also enable **"Google Identity"** or **"Google People API"** (recommended for user info)

---

### Step 3: Configure OAuth Consent Screen

1. Go to **"APIs & Services"** → **"OAuth consent screen"**

2. Choose **"External"** (for public apps) or **"Internal"** (for organization only)
   - Click **"Create"**

3. **Fill in App Information:**
   ```
   App name: AI Prompts Gen
   User support email: your-email@gmail.com
   Application home page: https://your-app-name.ondigitalocean.app
   Application privacy policy link: https://your-app-name.ondigitalocean.app/privacy
   Application terms of service link: https://your-app-name.ondigitalocean.app/terms
   ```

4. **Authorized domains:**
   ```
   your-app-name.ondigitalocean.app
   ```
   (OR your custom domain: `yourdomain.com`)

5. **Developer contact information:**
   ```
   your-email@gmail.com
   ```

6. Click **"Save and Continue"**

7. **Scopes (Step 2):**
   - Click **"Add or Remove Scopes"**
   - Select these scopes:
     - `userinfo.email`
     - `userinfo.profile`
     - `openid`
   - Click **"Update"** → **"Save and Continue"**

8. **Test users (Step 3):**
   - Add your email and any test users
   - Click **"Save and Continue"**

9. **Summary (Step 4):**
   - Review everything
   - Click **"Back to Dashboard"**

---

### Step 4: Create OAuth 2.0 Credentials

1. Go to **"APIs & Services"** → **"Credentials"**

2. Click **"+ Create Credentials"** → **"OAuth client ID"**

3. **Application type:** Select **"Web application"**

4. **Name:** `AI Prompts Gen Web Client`

5. **Authorized JavaScript origins:**
   ```
   https://your-app-name.ondigitalocean.app
   ```
   
   **If using custom domain:**
   ```
   https://yourdomain.com
   ```
   
   **For development:**
   ```
   http://localhost:3000
   ```

6. **Authorized redirect URIs:** ⚠️ **THIS IS CRITICAL!**
   
   **For Digital Ocean App Platform:**
   ```
   https://your-app-name.ondigitalocean.app/api/auth/callback/google
   ```
   
   **For Custom Domain:**
   ```
   https://yourdomain.com/api/auth/callback/google
   ```
   
   **For Development:**
   ```
   http://localhost:3000/api/auth/callback/google
   ```
   
   **💡 Pro Tip:** Add all three URLs (production, custom domain if applicable, and development) so you can test locally and in production.

7. Click **"Create"**

8. **Save Your Credentials:**
   - You'll see a popup with:
     - **Client ID:** `123456789-abcdefghijklmnop.apps.googleusercontent.com`
     - **Client Secret:** `GOCSPX-abc123xyz789`
   - **⚠️ IMPORTANT:** Copy both values immediately!
   - Click **"Download JSON"** to save credentials (optional but recommended)

---

## 🔧 Configure Environment Variables

### On Digital Ocean:

#### Option A: App Platform Dashboard
1. Go to your App in Digital Ocean Dashboard
2. Click **"Settings"** → **"App-Level Environment Variables"**
3. Add these variables:

```env
GOOGLE_CLIENT_ID=your-client-id-here.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-your-client-secret-here
NEXTAUTH_URL=https://your-app-name.ondigitalocean.app
NEXTAUTH_SECRET=your-random-32-character-string-here
```

4. Click **"Save"**
5. App will automatically redeploy

#### Option B: SSH into Droplet
```bash
# SSH into your server
ssh root@your-droplet-ip

# Navigate to your app
cd /var/www/your-app

# Edit environment file
nano .env.production

# Add these lines:
GOOGLE_CLIENT_ID=your-client-id-here.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-your-client-secret-here
NEXTAUTH_URL=https://your-domain.com
NEXTAUTH_SECRET=your-random-32-character-string-here

# Save and exit (Ctrl+X, Y, Enter)

# Restart app
pm2 restart all --update-env
```

---

## 🔑 Generate NEXTAUTH_SECRET

Run this command to generate a secure random secret:

**On Linux/Mac:**
```bash
openssl rand -base64 32
```

**On Windows (PowerShell):**
```powershell
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }) -as [byte[]])
```

**Online Generator:**
- Visit: https://generate-secret.vercel.app/32
- Copy the generated secret

---

## ✅ Verification Checklist

After setup, verify these:

### 1. Environment Variables Set
```bash
# On your server, check if variables are loaded
printenv | grep GOOGLE
printenv | grep NEXTAUTH
```

Should show:
```
GOOGLE_CLIENT_ID=123456789-abc...
GOOGLE_CLIENT_SECRET=GOCSPX-...
NEXTAUTH_URL=https://your-app...
NEXTAUTH_SECRET=...
```

### 2. OAuth Consent Screen
- Status should be "In Production" or "Testing"
- Authorized domains added correctly

### 3. OAuth Credentials
- Client ID and Secret generated
- Redirect URIs match exactly (no trailing slashes!)

### 4. Test Sign In
1. Visit your app: `https://your-app-name.ondigitalocean.app`
2. Click "Sign In with Google"
3. Should redirect to Google login
4. After login, should redirect back to your app
5. User should be signed in

---

## 🐛 Troubleshooting

### Error: "redirect_uri_mismatch"

**Cause:** Redirect URI doesn't match exactly

**Solution:**
1. Check Google Console → Credentials → Your OAuth Client
2. Ensure redirect URI is **EXACTLY**:
   ```
   https://your-app-name.ondigitalocean.app/api/auth/callback/google
   ```
3. Check for:
   - ✅ Correct protocol (`https://` not `http://`)
   - ✅ Correct domain (no typos)
   - ✅ Correct path (`/api/auth/callback/google`)
   - ✅ No trailing slash
   - ✅ No extra spaces

### Error: "invalid_client"

**Cause:** Client ID or Secret is wrong

**Solution:**
1. Check environment variables on server
2. Ensure no extra spaces or quotes
3. Regenerate credentials if needed

### Error: "Access blocked: This app's request is invalid"

**Cause:** OAuth consent screen not configured properly

**Solution:**
1. Complete all required fields in OAuth consent screen
2. Add authorized domains
3. Ensure app status is not "Verification required"

### Error: NEXTAUTH_URL not set

**Cause:** Missing or incorrect NEXTAUTH_URL

**Solution:**
```bash
# Set the correct URL for your deployment
export NEXTAUTH_URL=https://your-app-name.ondigitalocean.app

# Or add to .env file
echo "NEXTAUTH_URL=https://your-app-name.ondigitalocean.app" >> .env.production

# Restart app
pm2 restart all --update-env
```

### Users Can't Sign In After First Time

**Cause:** Session secret changed or cookies issue

**Solution:**
1. Ensure NEXTAUTH_SECRET is set and doesn't change
2. Clear browser cookies
3. Check domain settings in NextAuth config

---

## 📱 Complete Example Configuration

### Your Redirect URIs (Replace with your actual domain):

**Production:**
```
https://ai-prompts-gen.ondigitalocean.app/api/auth/callback/google
```

**Development:**
```
http://localhost:3000/api/auth/callback/google
```

### Environment Variables (.env.production):
```env
# Google OAuth
GOOGLE_CLIENT_ID=123456789-abcdefghijklmnopqrstuvwxyz.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-Abc123Xyz789DEF456ghi789
NEXTAUTH_URL=https://ai-prompts-gen.ondigitalocean.app
NEXTAUTH_SECRET=SuperSecureRandomString32CharactersLong1234567890

# Existing variables
DEEPSEEK_API_KEY=sk-...
NEWS_API_KEY=...
CRON_SECRET=...
```

---

## 🎯 Quick Setup Checklist

- [ ] Create Google Cloud Project
- [ ] Enable Google+ API / Google Identity
- [ ] Configure OAuth Consent Screen
- [ ] Add authorized domains
- [ ] Create OAuth 2.0 Client ID
- [ ] Add JavaScript origins
- [ ] **Add redirect URIs** (most important!)
- [ ] Copy Client ID and Secret
- [ ] Add environment variables to Digital Ocean
- [ ] Generate NEXTAUTH_SECRET
- [ ] Deploy/Restart app
- [ ] Test sign in with Google
- [ ] Verify user session works

---

## 📞 Need Help?

### Check NextAuth.js Documentation:
- https://next-auth.js.org/providers/google

### Check Google OAuth Documentation:
- https://developers.google.com/identity/protocols/oauth2

### Test Your OAuth Setup:
1. Visit: https://your-app.ondigitalocean.app/api/auth/signin
2. You should see Google sign-in option
3. Click it and test the flow

---

## 🔒 Security Best Practices

1. **Never commit credentials to Git:**
   - Keep `.env.local` in `.gitignore`
   - Use environment variables in production

2. **Use strong NEXTAUTH_SECRET:**
   - At least 32 characters
   - Randomly generated
   - Never reuse across projects

3. **Limit OAuth scopes:**
   - Only request `email`, `profile`, `openid`
   - Don't request unnecessary permissions

4. **Monitor OAuth usage:**
   - Check Google Cloud Console for quota usage
   - Set up alerts for suspicious activity

5. **Use HTTPS in production:**
   - Never use `http://` for production redirect URIs
   - Enable SSL certificate on Digital Ocean

---

## 🎉 You're All Set!

Once configured, users can sign in with their Google accounts. Your app will receive their:
- ✅ Email address
- ✅ Name
- ✅ Profile picture
- ✅ Google user ID

This data is automatically managed by NextAuth.js and stored in your session.

**Happy authenticating! 🚀**
