# 🚀 Quick Deployment Reference

## What Was Done
✅ Complete authentication system with Google OAuth and email/password  
✅ Protected prompt generation (requires sign-in)  
✅ 70 daily credits per user with automatic reset  
✅ Sign-in and sign-up pages created  
✅ Database schema updated  
✅ All code pushed to GitHub (commit: e720750)

---

## Digital Ocean Deployment Steps

### 1. Add Environment Variables
Go to Digital Ocean App Platform → Settings → Environment Variables

Add these 5 variables:
```
DATABASE_URL=postgresql://your-connection-string
NEXTAUTH_URL=https://aipromptgen.app
NEXTAUTH_SECRET=eyTZfsSK7pyoWU8YX2m/s3TPNA61sEb0XWIiVbvsGTE=
GOOGLE_CLIENT_ID=99526985674-i8f00g18huf19af01pber0ivv782csfo.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=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
```

### 2. Deploy via SSH (If using Droplet)
```bash
# SSH into your server
ssh root@your-droplet-ip

# Navigate to app directory
cd /var/www/aipromptgen

# Pull latest code
git pull origin main

# Install new dependencies
npm install

# Generate Prisma Client
npx prisma generate

# Run database migration
npx prisma migrate deploy

# Build the app
npm run build

# Restart application
pm2 restart aipromptgen
# or
systemctl restart aipromptgen
```

### 3. OR Deploy via App Platform (Automatic)
- Just add the environment variables above
- Digital Ocean will automatically pull from GitHub and deploy
- Migration runs automatically via `postinstall` script

---

## Test After Deployment

1. **Visit**: https://aipromptgen.app
2. **Click**: Prompt generator
3. **Verify**: Shows "Sign In to Generate" button
4. **Click**: Sign In button
5. **Test Google**: Click "Continue with Google"
6. **Test Email**: Click "Sign up" → Register with email/password
7. **Generate**: Try generating a prompt (should work)
8. **Check Credits**: Verify credits decrease after generation

---

## Important URLs

- **Home**: https://aipromptgen.app
- **Sign In**: https://aipromptgen.app/auth/signin
- **Sign Up**: https://aipromptgen.app/auth/signup
- **Google OAuth Callback**: https://aipromptgen.app/api/auth/callback/google

---

## Database Migration Required

The Prisma schema has 2 new fields:
- `hashedPassword` (String?, nullable)
- `lastCreditReset` (DateTime?, defaults to now)

Migration will run automatically with:
```bash
npx prisma migrate deploy
```

---

## Troubleshooting

### Google OAuth Not Working?
1. Check NEXTAUTH_URL is set to: `https://aipromptgen.app`
2. Verify Google Console has redirect URI: `https://aipromptgen.app/api/auth/callback/google`
3. Clear cookies and try again

### Database Errors?
```bash
# Regenerate Prisma Client
npx prisma generate

# Apply migrations
npx prisma migrate deploy
```

### Build Errors?
```bash
# Clear cache and rebuild
rm -rf .next
npm run build
```

---

## Documentation Files

- `AUTHENTICATION_DEPLOYMENT.md` - Full deployment guide (2000+ lines)
- `ENV_CONFIG_READY.txt` - All environment variables
- `OAUTH_CONFIG_aipromptgen.md` - Google OAuth setup
- This file - Quick reference

---

## Support

For detailed troubleshooting, see: `AUTHENTICATION_DEPLOYMENT.md`

**Status**: ✅ Ready for Production  
**Commit**: e720750  
**Pushed**: Yes  
**Tested**: Locally  
**Next**: Deploy to Digital Ocean
