# 🔐 Google OAuth Configuration for aipromptgen.app

## ✅ YOUR EXACT CONFIGURATION

### 🌐 Authorized Redirect URI
```
https://aipromptgen.app/api/auth/callback/google
```
**⚠️ Copy this EXACTLY - no trailing slash!**

### 🌐 Authorized JavaScript Origins
```
https://aipromptgen.app
```

### 📋 Authorized Domain for OAuth Consent Screen
```
aipromptgen.app
```

---

## 🔑 Environment Variables for Digital Ocean

Add these to your Digital Ocean environment variables:

```env
GOOGLE_CLIENT_ID=<your-client-id-from-google>.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-<your-client-secret-from-google>
NEXTAUTH_URL=https://aipromptgen.app
NEXTAUTH_SECRET=your-nextauth-secret-here
```

**✅ NEXTAUTH_SECRET already generated above** (keep it secret!)

---

## 🚀 Quick Setup Guide

### Step 1: Google Cloud Console Setup

1. **Go to:** [Google Cloud Console](https://console.cloud.google.com/)

2. **Create Project:**
   - Click "Select a Project" → "New Project"
   - Name: `AI Prompts Gen`
   - Click "Create"

3. **Enable APIs:**
   - Go to "APIs & Services" → "Library"
   - Enable: **Google+ API**
   - Enable: **Google Identity** (or Google People API)

### Step 2: Configure OAuth Consent Screen

1. Go to "APIs & Services" → "OAuth consent screen"

2. Choose **"External"** → Click "Create"

3. Fill in:
   ```
   App name: AI Prompts Gen
   User support email: your-email@gmail.com
   Application home page: https://aipromptgen.app
   ```

4. **Authorized domains** (click "+ Add Domain"):
   ```
   aipromptgen.app
   ```

5. **Developer contact information:**
   ```
   your-email@gmail.com
   ```

6. Click "Save and Continue"

7. **Scopes:** Add these scopes:
   - ✅ `.../auth/userinfo.email`
   - ✅ `.../auth/userinfo.profile`
   - ✅ `openid`
   - Click "Update" → "Save and Continue"

8. **Test users:** Add your email (for testing)
   - Click "Save and Continue"

9. **Summary:** Review and go "Back to Dashboard"

### Step 3: Create OAuth 2.0 Client ID

1. Go to "APIs & Services" → "Credentials"

2. Click "+ Create Credentials" → "OAuth client ID"

3. **Application type:** Web application

4. **Name:** `AI Prompts Gen Web Client`

5. **Authorized JavaScript origins** (click "+ Add URI"):
   ```
   https://aipromptgen.app
   ```

6. **Authorized redirect URIs** (click "+ Add URI"):
   ```
   https://aipromptgen.app/api/auth/callback/google
   ```
   
   **Optional - Add for development:**
   ```
   http://localhost:3000/api/auth/callback/google
   ```

7. Click **"Create"**

8. **Copy Credentials:**
   - ✅ Client ID (looks like: `123456789-abc...apps.googleusercontent.com`)
   - ✅ Client Secret (looks like: `GOCSPX-abc123xyz...`)
   - Download JSON (optional backup)

---

## 🌊 Add to Digital Ocean

### Method 1: App Platform Dashboard (Recommended)

1. Go to [Digital Ocean Dashboard](https://cloud.digitalocean.com/apps)
2. Select your app
3. Go to "Settings" → "App-Level Environment Variables"
4. Click "Edit"
5. Add these variables:

| Variable | Value |
|----------|-------|
| `GOOGLE_CLIENT_ID` | `paste-your-client-id-here` |
| `GOOGLE_CLIENT_SECRET` | `paste-your-client-secret-here` |
| `NEXTAUTH_URL` | `https://aipromptgen.app` |
| `NEXTAUTH_SECRET` | `your-nextauth-secret-here` |

6. Click "Save"
7. App will automatically redeploy (wait 2-3 minutes)

### Method 2: SSH to Droplet

```bash
# SSH into your server
ssh root@your-server-ip

# Navigate to app directory
cd /var/www/aipromptgen  # or your app path

# Edit environment file
nano .env.production

# Add these lines (replace with your actual values):
GOOGLE_CLIENT_ID=123456789-abcdef.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-abc123xyz
NEXTAUTH_URL=https://aipromptgen.app
NEXTAUTH_SECRET=your-nextauth-secret-here

# Save: Ctrl+X, then Y, then Enter

# Restart application
pm2 restart all --update-env
```

---

## ✅ Test Your Setup

### 1. Test Sign In Page
Visit: https://aipromptgen.app/api/auth/signin

You should see:
- ✅ "Sign in with Google" button
- ✅ Clicking it redirects to Google login
- ✅ After login, redirects back to your app
- ✅ User is signed in

### 2. Test from Your App
Add a sign-in button to your app:

```typescript
import { signIn, signOut, useSession } from 'next-auth/react';

export function SignInButton() {
  const { data: session } = useSession();
  
  if (session) {
    return (
      <>
        Signed in as {session.user?.email} <br />
        <button onClick={() => signOut()}>Sign out</button>
      </>
    );
  }
  
  return <button onClick={() => signIn('google')}>Sign in with Google</button>;
}
```

### 3. Verify Environment Variables (on server)
```bash
# SSH into server
ssh root@your-server-ip

# Check variables are set
printenv | grep GOOGLE
printenv | grep NEXTAUTH

# Should show all 4 variables
```

---

## 🐛 Common Issues & Solutions

### ❌ Error: "redirect_uri_mismatch"

**Problem:** Redirect URI doesn't match exactly

**Solution:**
1. Go to Google Console → Credentials → Your OAuth Client
2. Check redirect URI is EXACTLY:
   ```
   https://aipromptgen.app/api/auth/callback/google
   ```
3. Verify:
   - ✅ Uses `https://` (not `http://`)
   - ✅ Domain is `aipromptgen.app` (no typos)
   - ✅ Path is `/api/auth/callback/google`
   - ✅ NO trailing slash
   - ✅ NO extra spaces

### ❌ Error: "invalid_client"

**Problem:** Client ID or Secret is wrong

**Solution:**
1. Check environment variables on Digital Ocean
2. Ensure no extra spaces or line breaks
3. Copy credentials again from Google Console
4. Regenerate OAuth client if needed

### ❌ Error: "Access blocked: This app's request is invalid"

**Problem:** OAuth consent screen not configured

**Solution:**
1. Complete all required fields in OAuth consent screen
2. Add authorized domain: `aipromptgen.app`
3. Ensure app is not "Verification required"

### ❌ Sign in button does nothing

**Problem:** NEXTAUTH_URL not set or incorrect

**Solution:**
```bash
# Set the correct URL
NEXTAUTH_URL=https://aipromptgen.app

# Restart app
pm2 restart all --update-env
```

### ❌ Session doesn't persist

**Problem:** NEXTAUTH_SECRET missing or changed

**Solution:**
- Ensure NEXTAUTH_SECRET is set (check your Digital Ocean env vars)
- Never change this value once set
- Restart app after adding

---

## 📱 Complete Configuration Summary

### Google Cloud Console Settings:

**Project:** AI Prompts Gen

**OAuth Consent Screen:**
- App name: AI Prompts Gen
- Authorized domain: `aipromptgen.app`
- Scopes: email, profile, openid

**OAuth 2.0 Client:**
- Type: Web application
- JavaScript origins: `https://aipromptgen.app`
- Redirect URIs: `https://aipromptgen.app/api/auth/callback/google`

### Digital Ocean Environment Variables:

```env
GOOGLE_CLIENT_ID=<from-google-console>.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-<from-google-console>
NEXTAUTH_URL=https://aipromptgen.app
NEXTAUTH_SECRET=your-nextauth-secret-here
```

---

## 🎯 Checklist

- [ ] Google Cloud Project created
- [ ] Google+ API enabled
- [ ] OAuth Consent Screen configured with domain `aipromptgen.app`
- [ ] OAuth 2.0 Client ID created
- [ ] JavaScript origins added: `https://aipromptgen.app`
- [ ] Redirect URI added: `https://aipromptgen.app/api/auth/callback/google`
- [ ] Client ID and Secret copied
- [ ] Environment variables added to Digital Ocean
- [ ] App redeployed/restarted
- [ ] Tested sign in at: https://aipromptgen.app/api/auth/signin
- [ ] User can sign in and session works

---

## 🎉 You're Done!

Your Google OAuth is now configured for **https://aipromptgen.app**

Users can sign in with their Google accounts and you'll receive:
- ✅ Email address
- ✅ Full name
- ✅ Profile picture
- ✅ Google user ID

**Test it now:** https://aipromptgen.app/api/auth/signin

For more details, see: [GOOGLE_OAUTH_SETUP.md](./GOOGLE_OAUTH_SETUP.md)
