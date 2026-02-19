# Authentication System Deployment Guide

## Overview
This guide covers deploying the complete authentication system with:
- Google OAuth 2.0 sign-in
- Email/Password registration and sign-in
- 70 daily credits per user with automatic reset
- Protected prompt generation routes
- Session management with NextAuth.js

---

## Prerequisites

### 1. Database Setup
Ensure your PostgreSQL database is configured with the updated schema:

```bash
# Run Prisma migration to add authentication fields
npx prisma migrate deploy

# Or if creating a new migration
npx prisma migrate dev --name add_auth_fields
```

### 2. Required Environment Variables
Add these to your Digital Ocean environment (or .env.production):

```env
# Database
DATABASE_URL="postgresql://user:password@host:port/database?schema=public"

# NextAuth Configuration
NEXTAUTH_URL="https://aipromptgen.app"
NEXTAUTH_SECRET="your-nextauth-secret-here"

# Google OAuth
GOOGLE_CLIENT_ID="your-google-client-id.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="GOCSPX-your-google-client-secret-here"
```

---

## Files Created/Modified

### New Authentication Files
1. **middleware.ts** - Route protection middleware
2. **app/auth/signin/page.tsx** - Sign-in page
3. **app/auth/signup/page.tsx** - Sign-up page
4. **app/api/auth/register/route.ts** - User registration API
5. **types/next-auth.d.ts** - NextAuth TypeScript types

### Modified Files
1. **app/api/auth/[...nextauth]/route.ts** - Added Credentials provider, credit reset logic
2. **components/prompt-generator.tsx** - Added authentication checks
3. **prisma/schema.prisma** - Added hashedPassword and lastCreditReset fields

---

## Features Implemented

### 1. Authentication Gate
- Unauthenticated users see "Sign In to Generate" button
- Clicking redirects to `/auth/signin`
- Both Guided Builder and Advanced tabs are protected

### 2. Dual Authentication Methods

#### Google OAuth
- One-click sign-in with Google account
- Auto-creates user with 70 credits on first sign-in
- No password management required

#### Email/Password
- Traditional registration with email/password
- Passwords hashed with bcryptjs (10 salt rounds)
- Minimum 8 characters required
- Email uniqueness enforced

### 3. Daily Credit System
- Every user starts with **70 credits**
- Credits reset to 70 every 24 hours
- Reset tracked by `lastCreditReset` field
- Automatic reset on next sign-in after 24 hours

### 4. Protected Routes
Middleware protects:
- `/api/prompts/*` - Prompt generation endpoints
- `/api/user/*` - User data endpoints

### 5. Session Management
- JWT-based sessions for performance
- Session includes user ID for credit tracking
- Automatic redirect if authenticated user visits auth pages

---

## Deployment Steps

### Step 1: Install Dependencies
```bash
npm install bcryptjs @types/bcryptjs
```

### Step 2: Generate Prisma Client
```bash
npx prisma generate
```

### Step 3: Update Database Schema
```bash
# For production
npx prisma migrate deploy

# For development (creates migration files)
npx prisma migrate dev --name add_auth_fields
```

### Step 4: Push to GitHub
```bash
git add .
git commit -m "feat: Add authentication system with Google OAuth and email/password"
git push origin main
```

### Step 5: Configure Digital Ocean Environment

#### Option A: Via App Platform Dashboard
1. Go to your App Platform dashboard
2. Navigate to Settings → Environment Variables
3. Add each variable from the list above
4. Click "Save"
5. App will automatically redeploy

#### Option B: Via SSH (Droplet)
1. SSH into your droplet:
   ```bash
   ssh root@your-droplet-ip
   ```

2. Navigate to app directory:
   ```bash
   cd /var/www/aipromptgen
   ```

3. Create/update .env.production:
   ```bash
   nano .env.production
   ```
   
4. Add all environment variables (paste from ENV_CONFIG_READY.txt)

5. Pull latest code:
   ```bash
   git pull origin main
   ```

6. Install dependencies:
   ```bash
   npm install
   ```

7. Run database migration:
   ```bash
   npx prisma migrate deploy
   ```

8. Build the app:
   ```bash
   npm run build
   ```

9. Restart the application:
   ```bash
   pm2 restart aipromptgen
   # or
   systemctl restart aipromptgen
   ```

### Step 6: Verify Google OAuth Configuration
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Navigate to APIs & Services → Credentials
3. Verify Authorized redirect URIs includes:
   ```
   https://aipromptgen.app/api/auth/callback/google
   ```
4. Verify Authorized JavaScript origins includes:
   ```
   https://aipromptgen.app
   ```

---

## Testing the Authentication System

### 1. Test Google OAuth
1. Visit https://aipromptgen.app
2. Click "Generate Prompt" or navigate to prompt generator
3. Click "Sign In to Generate"
4. Click "Continue with Google"
5. Sign in with Google account
6. Should redirect to home page as authenticated user

### 2. Test Email/Password Registration
1. Visit https://aipromptgen.app/auth/signup
2. Fill in name, email, password (min 8 chars)
3. Confirm password
4. Click "Create Account"
5. Should be automatically signed in and redirected

### 3. Test Email/Password Sign-In
1. Visit https://aipromptgen.app/auth/signin
2. Enter registered email and password
3. Click "Sign In"
4. Should be authenticated and redirected

### 4. Test Authentication Gate
1. Visit https://aipromptgen.app (not signed in)
2. Go to prompt generator
3. Should see "Sign In to Generate" button instead of "Generate Prompt"
4. Try to generate - should redirect to sign-in page

### 5. Test Credit System
1. Sign in to your account
2. Check credit display (should show 70 for new users)
3. Generate a prompt (costs 3-5 credits depending on platform)
4. Verify credits decrease
5. Wait 24 hours or manually update `lastCreditReset` in database
6. Sign out and sign back in
7. Credits should reset to 70

### 6. Test Protected API Routes
```bash
# Without authentication - should return 401
curl https://aipromptgen.app/api/prompts/generate

# With valid session - should work (test from browser while signed in)
```

---

## User Flow Diagrams

### New User Registration Flow
```
User visits site
    ↓
Tries to generate prompt
    ↓
Redirected to /auth/signin
    ↓
Clicks "Sign up" link → /auth/signup
    ↓
Option 1: Google OAuth → Auto-creates account → 70 credits
Option 2: Email/Password → Creates account → 70 credits
    ↓
Automatically signed in
    ↓
Redirected to home page
    ↓
Can now generate prompts
```

### Daily Credit Reset Flow
```
User signs in
    ↓
System checks lastCreditReset timestamp
    ↓
If > 24 hours ago:
    ↓
Reset credits to 70
Update lastCreditReset to now
    ↓
User continues with fresh credits
```

---

## Database Schema Changes

```prisma
model User {
  id              String    @id @default(uuid())
  email           String    @unique
  name            String?
  image           String?
  hashedPassword  String?   // NEW: For email/password auth
  credits         Int       @default(70)
  lastCreditReset DateTime? @default(now()) // NEW: For daily reset tracking
  // ... other fields
}
```

---

## Security Best Practices Implemented

1. **Password Security**
   - bcryptjs with 10 salt rounds
   - Minimum 8 characters enforced
   - Passwords never stored in plain text

2. **Session Security**
   - JWT tokens with secure secret
   - HTTP-only cookies (NextAuth default)
   - CSRF protection enabled

3. **API Protection**
   - Middleware validates all protected routes
   - Returns 401 for unauthenticated requests
   - Session validation on every request

4. **Input Validation**
   - Email format validation
   - Password strength requirements
   - Duplicate email prevention

5. **Environment Variables**
   - Secrets stored in environment only
   - Not committed to Git (.gitignore configured)
   - Different secrets for dev/production

---

## Troubleshooting

### Issue: "Cannot find module 'bcryptjs'"
**Solution:**
```bash
npm install bcryptjs @types/bcryptjs
```

### Issue: Prisma error about missing fields
**Solution:**
```bash
npx prisma migrate deploy
# or
npx prisma migrate dev --name add_auth_fields
```

### Issue: Google OAuth redirect error
**Solution:**
1. Check NEXTAUTH_URL matches your domain exactly
2. Verify Google Console has correct redirect URI
3. Clear browser cookies and try again

### Issue: "Invalid credentials" on sign-in
**Solution:**
1. Verify email is correct
2. Check password (case-sensitive)
3. Ensure user was created successfully (check database)

### Issue: Credits not resetting
**Solution:**
1. Check `lastCreditReset` field in database
2. Verify date calculation in NextAuth callbacks
3. Sign out and sign back in to trigger check

### Issue: Middleware redirecting incorrectly
**Solution:**
1. Check middleware matcher config
2. Verify NEXTAUTH_SECRET is set
3. Clear cookies and try again

### Issue: Build errors in production
**Solution:**
```bash
# Regenerate Prisma Client
npx prisma generate

# Rebuild the app
npm run build
```

---

## Monitoring & Maintenance

### Check Authentication Status
```bash
# View active sessions (if using database sessions)
npx prisma studio
# Navigate to Session table

# Check user count
# SQL query in your database:
SELECT COUNT(*) FROM "User";
```

### Monitor Credit Usage
```sql
-- Average credits per user
SELECT AVG(credits) FROM "User";

-- Users with low credits
SELECT email, credits FROM "User" WHERE credits < 10;

-- Credit reset status
SELECT email, "lastCreditReset" FROM "User" ORDER BY "lastCreditReset" DESC;
```

### Database Backup
```bash
# Create backup before any changes
pg_dump -h your-db-host -U your-db-user -d your-db-name > backup_$(date +%Y%m%d).sql
```

---

## Next Steps (Optional Enhancements)

1. **Password Reset Flow**
   - Implement forgot password functionality
   - Email verification for new accounts

2. **Social Auth Expansion**
   - Add GitHub, Discord, or other OAuth providers
   - Follow same pattern as Google provider

3. **Enhanced Credit System**
   - Different credit amounts for different plans
   - Purchase additional credits
   - Credit usage analytics

4. **Rate Limiting**
   - Add request rate limiting
   - Prevent abuse of generation API

5. **User Dashboard**
   - View credit usage history
   - Manage account settings
   - View generated prompts history

---

## Support

If you encounter issues:
1. Check the Troubleshooting section above
2. Review Digital Ocean logs: `pm2 logs aipromptgen`
3. Check browser console for client-side errors
4. Verify all environment variables are set correctly

---

**Last Updated:** January 2025
**Version:** 1.0
**Status:** ✅ Production Ready
