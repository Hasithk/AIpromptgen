# NextAuth 404 Error Troubleshooting Guide

## Current Error: 404 NOT_FOUND on Sign In

The 404 error when clicking "Sign In" is typically caused by missing or incorrect environment variables in production.

## Root Cause Analysis

The error ID `sin1::t5b7q-1759591465279-c2cdb8e77c69` suggests that DigitalOcean cannot find the NextAuth endpoint, which means either:

1. **Missing Environment Variables** ❌
2. **Incorrect NEXTAUTH_URL** ❌  
3. **Google OAuth Configuration Issues** ❌

## ✅ Step-by-Step Fix

### 1. Check DigitalOcean Environment Variables

In your DigitalOcean App Platform settings, verify these variables are set:

```bash
# Critical - NextAuth Configuration
NEXTAUTH_URL=https://your-actual-app-url.ondigitalocean.app
NEXTAUTH_SECRET=your-32-character-secret-key-here

# Critical - Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Optional - Database (can work without)
DATABASE_URL=postgresql://user:pass@host:port/database
```

### 2. Generate NEXTAUTH_SECRET

```bash
# Generate a secure secret (32+ characters)
openssl rand -base64 32
```

Or use this online generator: https://generate-secret.vercel.app/32

### 3. Configure Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project (or create new one)
3. Go to "APIs & Services" → "Credentials"
4. Click "Create Credentials" → "OAuth 2.0 Client ID"
5. Choose "Web Application"
6. Add these URLs:

**Authorized Redirect URIs:**
```
https://your-actual-app-url.ondigitalocean.app/api/auth/callback/google
```

**Authorized JavaScript Origins:**
```
https://your-actual-app-url.ondigitalocean.app
```

### 4. Test Configuration

After setting environment variables, test the NextAuth status:

**URL to test:** `https://your-app-url.ondigitalocean.app/api/auth/status`

Expected response:
```json
{
  "status": "NextAuth configuration check",
  "environment": {
    "hasGoogleClientId": true,
    "hasGoogleClientSecret": true,
    "hasNextAuthSecret": true,
    "hasNextAuthUrl": true
  },
  "ready": true
}
```

### 5. Test NextAuth Endpoint

**URL to test:** `https://your-app-url.ondigitalocean.app/api/auth/providers`

Expected response:
```json
{
  "google": {
    "id": "google",
    "name": "Google",
    "type": "oauth",
    "signinUrl": "https://your-app/api/auth/signin/google",
    "callbackUrl": "https://your-app/api/auth/callback/google"
  }
}
```

## Common Issues & Solutions

### Issue 1: NEXTAUTH_URL Mismatch
- ❌ Wrong: `http://localhost:3000`
- ❌ Wrong: `https://example.com` 
- ✅ Correct: Your actual DigitalOcean app URL

### Issue 2: Google OAuth Redirect URL Mismatch
- Must exactly match your app URL
- Include `/api/auth/callback/google` path
- Use HTTPS (not HTTP)

### Issue 3: Missing Environment Variables
- All 4 critical variables must be set
- No empty values or placeholder text
- Case-sensitive names

## Verification Checklist

Before testing sign-in again:

- [ ] NEXTAUTH_URL matches your actual app URL
- [ ] NEXTAUTH_SECRET is 32+ characters long
- [ ] Google OAuth credentials are correct
- [ ] Redirect URLs match exactly in Google Console
- [ ] All environment variables are saved in DigitalOcean
- [ ] App has been redeployed after setting variables

## Emergency Fallback

If Google OAuth continues failing, the app includes fallback authentication that allows basic functionality without sign-in.

---
**Next Step**: Set the correct environment variables in DigitalOcean and redeploy the app.