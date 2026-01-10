# Registered Users - Current Status

**Last Updated:** January 10, 2026

## 📊 Current Status

**Total Registered Users:** 0

No users have signed up yet. Users will appear here after they register using Google OAuth.

## 🔍 How to Check Registered Users

### Method 1: Run the Script
```powershell
node scripts/list-users-simple.js
```

This will show:
- Total number of registered users
- Breakdown by plan (Free/Pro/Elite)
- Detailed list with email, name, credits, plan
- Copy-paste ready email list
- CSV export format

### Method 2: Query Database Directly
```powershell
# Using Prisma Studio (Visual Database Browser)
npx prisma studio
```

### Method 3: Use the API Endpoint
```powershell
# Start your server first (npm run dev)
# Then call the API
Invoke-WebRequest -Uri "http://localhost:3000/api/admin/users/list"
```

## 📝 What Information Is Available

For each registered user, you can see:
- ✅ Email address
- ✅ Name (if provided)
- ✅ Current credit balance
- ✅ Subscription plan (free/pro/elite)
- ✅ Monthly credits used (after migration)
- ✅ Last credit reset date (after migration)
- ✅ Registration date
- ✅ Number of prompts generated

## 🚀 Monthly Credit Reset System

The system is now configured to automatically:
1. Reset credits on the 1st of every month
2. Track monthly usage per user
3. Reset based on their plan:
   - **Free:** 50 credits/month
   - **Pro:** 500 credits/month
   - **Elite:** 9999 credits/month

## 📧 When Users Start Registering

Once users sign up via Google OAuth:
1. They'll automatically get 70 credits (as configured in auth route)
2. Their email and basic info will be stored
3. You can run the script to see them
4. Monthly reset will track and reset their credits

## 🎯 Next Steps

1. **Set up Google OAuth** (if not already done)
   - See: GOOGLE_OAUTH_SETUP.md

2. **Test User Registration**
   - Sign up with a test Google account
   - Run: `node scripts/list-users-simple.js`
   - Verify the user appears

3. **Monitor User Growth**
   - Run the script periodically
   - Or use Prisma Studio: `npx prisma studio`
   - Or use the API endpoint

## 📦 Available Scripts

| Script | Command | Purpose |
|--------|---------|---------|
| List Users (Simple) | `node scripts/list-users-simple.js` | Quick user list |
| List Users (Detailed) | `node scripts/list-registered-users.js` | Detailed with prompt history |
| Prisma Studio | `npx prisma studio` | Visual database browser |
| Reset Credits | API: `POST /api/admin/credits/reset` | Manual credit reset |

---

**Note:** Currently showing 0 users because no one has registered yet. This will update automatically as users sign up through your application.
