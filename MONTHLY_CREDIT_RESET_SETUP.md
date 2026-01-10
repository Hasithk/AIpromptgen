# Monthly Credit Reset System - Setup Guide

## Overview
This system automatically resets user credits on the 1st of every month based on their subscription plan.

## Features Implemented

### 1. Database Schema Updates
- Added `monthlyCreditsUsed` field to track credits used in current month
- Added `lastCreditResetDate` to track when credits were last reset
- Updated User model in `prisma/schema.prisma`

### 2. API Endpoints

#### List All Users
**Endpoint:** `GET /api/admin/users/list`

Returns all registered users with their statistics:
```bash
curl -X GET https://your-domain.com/api/admin/users/list \
  -H "Authorization: Bearer YOUR_TOKEN"
```

Response includes:
- Total users count
- Users by plan breakdown
- Individual user details (credits, usage, etc.)
- Total credits remaining/used

#### Check Reset Status
**Endpoint:** `GET /api/admin/credits/reset`

Check which users need credit reset:
```bash
curl -X GET https://your-domain.com/api/admin/credits/reset \
  -H "Authorization: Bearer YOUR_TOKEN"
```

#### Manual Reset Credits
**Endpoint:** `POST /api/admin/credits/reset`

Reset credits manually:
```bash
# Reset all users
curl -X POST https://your-domain.com/api/admin/credits/reset \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"resetAll": true}'

# Reset specific user
curl -X POST https://your-domain.com/api/admin/credits/reset \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"userId": "user-id-here"}'

# Reset only users who need it (based on date)
curl -X POST https://your-domain.com/api/admin/credits/reset \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{}'
```

#### Automated Cron Job
**Endpoint:** `GET /api/cron/reset-credits`

This endpoint is called automatically on the 1st of every month at midnight (configured in vercel.json).

### 3. Monthly Credit Limits by Plan

- **Free Plan:** 50 credits/month
- **Pro Plan:** 500 credits/month
- **Elite Plan:** 9999 credits/month (effectively unlimited)

## Setup Instructions

### Step 1: Apply Database Migration

Run the Prisma migration:
```bash
# Generate Prisma client with new schema
npx prisma generate

# Create and apply migration
npx prisma migrate dev --name add_monthly_reset_tracking

# Or if in production, use:
npx prisma migrate deploy
```

Alternatively, run the SQL migration directly:
```bash
# Connect to your database and run:
psql -U your_username -d your_database -f prisma/migrations/add_monthly_reset.sql
```

### Step 2: Update Environment Variables

Add to your `.env.local` or production environment:
```env
# Secret key for cron job authentication
CRON_SECRET=your-super-secret-key-here
```

Generate a secure secret:
```bash
# On Linux/Mac
openssl rand -hex 32

# On Windows PowerShell
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Minimum 0 -Maximum 256 }))
```

### Step 3: Configure Vercel Cron (if using Vercel)

The cron job is already configured in `vercel.json`:
```json
{
  "crons": [
    {
      "path": "/api/cron/reset-credits",
      "schedule": "0 0 1 * *"
    }
  ]
}
```

Schedule: `0 0 1 * *` = Every 1st day of the month at 00:00 (midnight)

**Note:** Vercel Cron is only available on Pro plans. For free plans, use alternatives below.

### Step 4: Alternative Cron Setup (if not using Vercel Pro)

#### Option A: GitHub Actions
Create `.github/workflows/reset-credits.yml`:
```yaml
name: Monthly Credit Reset

on:
  schedule:
    - cron: '0 0 1 * *'  # 1st of every month at midnight UTC
  workflow_dispatch:  # Allow manual trigger

jobs:
  reset-credits:
    runs-on: ubuntu-latest
    steps:
      - name: Call Reset Endpoint
        run: |
          curl -X GET https://your-domain.com/api/cron/reset-credits \
            -H "Authorization: Bearer ${{ secrets.CRON_SECRET }}"
```

#### Option B: External Cron Service
Use services like:
- **cron-job.org** (free)
- **EasyCron** (free tier available)
- **Uptime Robot** (can trigger URLs)

Configure them to call:
```
URL: https://your-domain.com/api/cron/reset-credits
Method: GET
Header: Authorization: Bearer YOUR_CRON_SECRET
Schedule: 1st of every month at 00:00
```

#### Option C: Server Cron (if you have your own server)
```bash
# Edit crontab
crontab -e

# Add this line
0 0 1 * * curl -X GET https://your-domain.com/api/cron/reset-credits -H "Authorization: Bearer YOUR_CRON_SECRET"
```

## Testing

### 1. Test User Listing
```bash
# Get all users
curl -X GET http://localhost:3000/api/admin/users/list
```

### 2. Test Manual Reset
```bash
# Reset all users
curl -X POST http://localhost:3000/api/admin/credits/reset \
  -H "Content-Type: application/json" \
  -d '{"resetAll": true}'
```

### 3. Test Cron Job
```bash
# Test the cron endpoint
curl -X GET http://localhost:3000/api/cron/reset-credits \
  -H "Authorization: Bearer your-secret-key"
```

## Monitoring

The cron job logs important events:
- Number of users found needing reset
- Each user reset operation
- Success/failure counts

Check your deployment logs:
```bash
# Vercel
vercel logs

# Or check the response from the cron endpoint
```

## How It Works

1. **Daily Check:** Every 1st of the month, the cron job runs
2. **Find Users:** Identifies users whose `lastCreditResetDate` is before the current month
3. **Reset Credits:** 
   - Sets `credits` to plan limit
   - Resets `monthlyCreditsUsed` to 0
   - Updates `lastCreditResetDate` to current date
4. **Skip Already Reset:** Users already reset this month are skipped

## Security Considerations

1. **Cron Authentication:** The cron endpoint requires a secret token
2. **Admin Endpoints:** Should be protected (consider adding admin role check)
3. **Rate Limiting:** Consider adding rate limiting to prevent abuse

## Future Enhancements

- [ ] Email notifications to users when credits reset
- [ ] Admin dashboard to view reset history
- [ ] Configurable reset day (not just 1st of month)
- [ ] Grace period for expired subscriptions
- [ ] Rollover unused credits option

## Troubleshooting

### Credits not resetting?
1. Check cron job is running (check logs)
2. Verify `CRON_SECRET` is set correctly
3. Check database `lastCreditResetDate` values
4. Manually trigger: `POST /api/admin/credits/reset`

### Users getting wrong credit amounts?
1. Verify their `plan` field is correct
2. Check `monthlyCredits` mapping in reset endpoint
3. Review migration was applied correctly

### Cron job returning 401 Unauthorized?
1. Verify `Authorization` header is correct
2. Check `CRON_SECRET` environment variable
3. Ensure header format: `Bearer YOUR_SECRET`

## Support

For issues or questions, check:
1. Deployment logs
2. Database state: `SELECT email, credits, "monthlyCreditsUsed", "lastCreditResetDate" FROM "User"`
3. Test endpoints manually using curl/Postman
