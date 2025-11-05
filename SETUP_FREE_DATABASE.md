# Free Database Setup with Neon (Recommended)

## Why Neon?
- ✅ **FREE FOREVER** - No credit card required
- ✅ 0.5 GB storage (more than enough)
- ✅ Serverless PostgreSQL
- ✅ Auto-scaling
- ✅ Better than Digital Ocean's $7/month option

---

## Step 1: Create Neon Account

1. Go to: **https://neon.tech**
2. Click **"Sign Up"**
3. Sign up with:
   - GitHub (fastest)
   - Google
   - Or Email

---

## Step 2: Create Your Database

1. After sign-up, you'll see **"Create your first project"**
2. Fill in:
   - **Project name:** `aipromptgen`
   - **Database name:** `aipromptgen` (or leave default)
   - **Region:** Choose closest to your users:
     - **US East** (Virginia) - for US users
     - **Europe** (Frankfurt) - for EU users
     - **Asia Pacific** (Singapore) - for Asian users
3. Click **"Create project"**

---

## Step 3: Get Connection String

1. After project creation, you'll see the dashboard
2. Look for **"Connection string"** section
3. Click **"Pooled connection"** (recommended for serverless)
4. Copy the full string - it looks like:

```
postgresql://neondb_owner:AbCdEfGh123456@ep-cool-name-123456.us-east-2.aws.neon.tech/neondb?sslmode=require
```

**Important parts:**
- `neondb_owner` - username
- `AbCdEfGh123456` - password (auto-generated)
- `ep-cool-name-123456.us-east-2.aws.neon.tech` - host
- `neondb` - database name
- `?sslmode=require` - SSL required (secure!)

---

## Step 4: Add to Digital Ocean App

### Method A: Via Digital Ocean Dashboard

1. Go to: **https://cloud.digitalocean.com**
2. Navigate to: **Apps → aipromptgen**
3. Click: **Settings** tab
4. Scroll to: **App-Level Environment Variables**
5. Click: **"Edit"**
6. Add new variable:
   - **Key:** `DATABASE_URL`
   - **Value:** (paste your Neon connection string)
   - **Encrypt:** ✓ (check this box for security)
7. Click: **"Save"**
8. Wait for automatic redeploy (~2-5 minutes)

---

## Step 5: Run Database Migration

Once the app has redeployed:

1. Go to your app in Digital Ocean
2. Click **"Console"** tab
3. Click **"Run Console"**
4. Run these commands:

```bash
# Generate Prisma Client
npx prisma generate

# Run migration to create tables
npx prisma migrate deploy

# Verify it worked
npx prisma db pull
```

Expected output:
```
✔ Generated Prisma Client
✔ Applied 1 migration
Database schema is up to date!
```

---

## Step 6: Verify Database Connection

### Test locally (optional):

1. Copy your Neon connection string
2. Add to your local `.env` file:

```bash
DATABASE_URL="your-neon-connection-string-here"
```

3. Test it:

```bash
npx prisma db push
```

If successful, your tables are created!

---

## Step 7: Check Your Database (Neon Dashboard)

1. Go back to **Neon dashboard**
2. Click **"Tables"** in the left sidebar
3. You should see:
   - ✓ User
   - ✓ Subscription
   - ✓ Payment
   - ✓ BlogPost
   - ✓ BlogAutomation

---

## Troubleshooting

### Issue: "Can't reach database server"

**Solution:** Check your connection string:
- Make sure you copied the **entire string**
- Include `?sslmode=require` at the end
- No extra spaces or line breaks

### Issue: "SSL required"

**Solution:** Make sure your connection string ends with:
```
?sslmode=require
```

### Issue: "Too many connections"

**Solution:** Use **Pooled connection** instead of Direct:
- Go to Neon dashboard
- Click "Connection Details"
- Select "Pooled connection"
- Copy that string instead

---

## Neon Dashboard Tips

### View Your Data:
- Go to **Tables** → Click any table → View data

### Check Usage:
- Go to **Settings** → **Usage**
- See storage used (free tier = 0.5 GB)

### Get Different Connection Strings:
- **Pooled** - For serverless (recommended for Next.js)
- **Direct** - For long-running processes
- **JDBC** - For Java apps

### Add More Databases:
- Click **"Create database"** in sidebar
- Free tier = unlimited databases!

---

## Cost Comparison

| Provider | Free Tier | Paid |
|----------|-----------|------|
| **Neon** | 0.5 GB (FREE forever) | $19/mo for more |
| Digital Ocean | None | $7/mo minimum |
| Supabase | 500 MB free | $25/mo |
| ElephantSQL | 20 MB free | $19/mo |

**Winner: Neon** 🏆

---

## Security Best Practices

1. ✅ Never commit `.env` files to Git
2. ✅ Use encrypted variables in Digital Ocean
3. ✅ Rotate passwords periodically (Neon Settings → Reset password)
4. ✅ Enable IP restrictions in Neon (optional)
5. ✅ Use pooled connections for serverless

---

## What Happens After Setup?

1. ✅ Your app can connect to PostgreSQL
2. ✅ User authentication will work
3. ✅ Credits will be tracked per user
4. ✅ Blog posts will be stored in database
5. ✅ 70 daily credit resets will work

---

## Quick Reference

**Your Neon Dashboard:** https://console.neon.tech  
**Connection String Format:**
```
postgresql://USER:PASSWORD@HOST:5432/DATABASE?sslmode=require
```

**Add to Digital Ocean:**
```
Key: DATABASE_URL
Value: postgresql://neondb_owner:...@ep-cool-name.neon.tech/neondb?sslmode=require
```

**Test Migration:**
```bash
npx prisma migrate deploy
```

---

## Next Steps After Database Setup

1. ✅ Database connected
2. ✅ Migration run
3. ⏭️ Add other environment variables:
   - `NEXTAUTH_URL`
   - `NEXTAUTH_SECRET`
   - `GOOGLE_CLIENT_ID`
   - `GOOGLE_CLIENT_SECRET`
4. ⏭️ Test authentication
5. ⏭️ Deploy and verify!

---

**Status:** Database setup complete! 🎉
