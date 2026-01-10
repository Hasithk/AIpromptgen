# Monthly Credit Reset - Quick Reference

## ✅ What's Been Implemented

### 1. Database Schema Updated
- Added `monthlyCreditsUsed` field to track monthly usage
- Added `lastCreditResetDate` to track reset dates
- Updated in: [prisma/schema.prisma](prisma/schema.prisma#L18-L19)

### 2. API Endpoints Created

#### 📊 List All Users
**GET** `/api/admin/users/list`
- Shows all registered users
- Displays credits, usage, and plan info
- Returns summary statistics

#### 🔄 Reset Credits (Manual)
**POST** `/api/admin/credits/reset`
- Reset all users: `{"resetAll": true}`
- Reset one user: `{"userId": "user-id"}`
- Auto-detect who needs reset: `{}`

**GET** `/api/admin/credits/reset`
- Check who needs credit reset

#### ⏰ Automated Cron Job
**GET** `/api/cron/reset-credits`
- Runs automatically every 1st of the month at midnight
- Configured in [vercel.json](vercel.json#L8-L11)
- Requires `Authorization: Bearer CRON_SECRET` header

### 3. Monthly Credit Limits

| Plan | Monthly Credits |
|------|----------------|
| Free | 50 |
| Pro  | 500 |
| Elite| 9999 |

## 🚀 Setup Steps

### Step 1: Generate Secret Key
```powershell
# PowerShell
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Minimum 0 -Maximum 256 }))
```

### Step 2: Add to Environment
Add to `.env.local`:
```env
CRON_SECRET=your-generated-secret-here
```

### Step 3: Run Migration
```bash
npx prisma generate
npx prisma migrate dev --name add_monthly_reset_tracking
```

**OR** use the setup script:
```powershell
.\setup-credit-reset.ps1
```

## 📝 How to Use

### List All Registered Users
```powershell
# See how many users are registered
Invoke-WebRequest -Uri "http://localhost:3000/api/admin/users/list" | ConvertFrom-Json | Select-Object -ExpandProperty data | Select-Object -ExpandProperty summary
```

### Reset Credits for All Users
```powershell
$body = @{ resetAll = $true } | ConvertTo-Json
Invoke-WebRequest -Uri "http://localhost:3000/api/admin/credits/reset" -Method POST -Body $body -ContentType "application/json"
```

### Check Who Needs Reset
```powershell
Invoke-WebRequest -Uri "http://localhost:3000/api/admin/credits/reset" -Method GET
```

### Test Cron Job
```powershell
$headers = @{ Authorization = "Bearer your-cron-secret" }
Invoke-WebRequest -Uri "http://localhost:3000/api/cron/reset-credits" -Headers $headers
```

## 📅 Automatic Reset

The system automatically resets credits:
- **When:** 1st of every month at 00:00 UTC
- **Who:** Users whose `lastCreditResetDate` is before current month
- **What:** 
  - Resets `credits` to plan limit
  - Resets `monthlyCreditsUsed` to 0
  - Updates `lastCreditResetDate` to now

## 🔍 Check User Stats

To see current registered users, call the list endpoint:

```javascript
// Example Response
{
  "success": true,
  "data": {
    "users": [
      {
        "email": "user@example.com",
        "credits": 45,
        "monthlyCreditsUsed": 5,
        "plan": "free",
        "promptsGenerated": 3,
        "registeredAt": "2026-01-01T10:00:00Z"
      }
    ],
    "summary": {
      "totalUsers": 150,
      "usersByPlan": {
        "free": 120,
        "pro": 25,
        "elite": 5
      },
      "totalCreditsRemaining": 6500,
      "totalCreditsUsed": 3500
    }
  }
}
```

## 🛠️ Troubleshooting

### Migration fails?
```bash
# Reset and reapply
npx prisma migrate reset
npx prisma migrate dev
```

### Check database directly
```sql
SELECT email, credits, "monthlyCreditsUsed", "lastCreditResetDate", plan 
FROM "User" 
LIMIT 10;
```

### Cron not working on Vercel?
- Vercel Cron requires Pro plan
- Alternative: Use GitHub Actions (see [setup guide](MONTHLY_CREDIT_RESET_SETUP.md#option-a-github-actions))

## 📚 Documentation

For detailed setup and troubleshooting, see:
- [MONTHLY_CREDIT_RESET_SETUP.md](MONTHLY_CREDIT_RESET_SETUP.md) - Full documentation
- [setup-credit-reset.ps1](setup-credit-reset.ps1) - Automated setup script

## 🔐 Security Notes

1. Protect admin endpoints (add admin role check)
2. Keep `CRON_SECRET` secure
3. Don't commit secrets to git
4. Use environment variables for production

---

**Files Modified/Created:**
- ✅ [prisma/schema.prisma](prisma/schema.prisma)
- ✅ [app/api/admin/users/list/route.ts](app/api/admin/users/list/route.ts)
- ✅ [app/api/admin/credits/reset/route.ts](app/api/admin/credits/reset/route.ts)
- ✅ [app/api/cron/reset-credits/route.ts](app/api/cron/reset-credits/route.ts)
- ✅ [app/api/prompts/generate/route.ts](app/api/prompts/generate/route.ts)
- ✅ [vercel.json](vercel.json)
- ✅ [setup-credit-reset.ps1](setup-credit-reset.ps1)
- ✅ [MONTHLY_CREDIT_RESET_SETUP.md](MONTHLY_CREDIT_RESET_SETUP.md)
