# How to Run Database Migration via SSH

## Step 1: Connect to Your Digital Ocean Server

Open PowerShell and connect via SSH:

```powershell
ssh root@your-droplet-ip
```

Or if you have a specific user:

```powershell
ssh username@your-droplet-ip
```

**Replace `your-droplet-ip` with your actual server IP address.**

---

## Step 2: Navigate to Your Project Directory

```bash
cd /var/www/aipromptgen
```

Or wherever your project is located. Common locations:
- `/var/www/aipromptgen`
- `/home/username/aipromptgen`
- `/opt/aipromptgen`

---

## Step 3: Pull Latest Code (if not done already)

```bash
git pull origin main
```

---

## Step 4: Install Dependencies

```bash
npm install
```

This will install `bcryptjs` and update other packages.

---

## Step 5: Generate Prisma Client

```bash
npx prisma generate
```

This updates the Prisma Client with your new schema fields.

---

## Step 6: Run Database Migration

```bash
npx prisma migrate deploy
```

This applies the migration to add:
- `hashedPassword` field to User table
- `lastCreditReset` field to User table

**Expected Output:**
```
Prisma Migrate applied the following migration(s):

migrations/
  └─ 20250105xxxxxx_add_auth_fields/
     └─ migration.sql

✔ Database schema is up to date!
```

---

## Step 7: Rebuild the Application

```bash
npm run build
```

---

## Step 8: Restart the Application

If using PM2:
```bash
pm2 restart aipromptgen
```

If using systemctl:
```bash
sudo systemctl restart aipromptgen
```

If using a different process manager, restart accordingly.

---

## Verification

Check if the migration worked:

```bash
npx prisma studio
```

This opens a browser interface where you can see your database tables and verify the new fields exist.

Or run a direct SQL query:

```bash
# Access PostgreSQL
psql $DATABASE_URL

# View User table structure
\d "User"

# You should see hashedPassword and lastCreditReset columns
```

---

## Troubleshooting

### Issue: "Migration file not found"

**Solution:** Create the migration first:

```bash
npx prisma migrate dev --name add_auth_fields
```

Then deploy:

```bash
npx prisma migrate deploy
```

---

### Issue: "Database connection failed"

**Solution:** Check your DATABASE_URL environment variable:

```bash
echo $DATABASE_URL
```

If empty, add it to your `.env` or `.env.production` file.

---

### Issue: "Cannot find module '@prisma/client'"

**Solution:**

```bash
npm install @prisma/client
npx prisma generate
```

---

### Issue: "Port already in use" after restart

**Solution:**

```bash
# Kill the process
pm2 delete aipromptgen
# or
sudo pkill -f "next"

# Start fresh
pm2 start npm --name "aipromptgen" -- start
```

---

## Complete Commands in Order

Here's the full sequence copy-paste ready:

```bash
# 1. Connect
ssh root@your-droplet-ip

# 2. Navigate
cd /var/www/aipromptgen

# 3. Pull code
git pull origin main

# 4. Install deps
npm install

# 5. Generate Prisma
npx prisma generate

# 6. Run migration
npx prisma migrate deploy

# 7. Build
npm run build

# 8. Restart
pm2 restart aipromptgen
```

---

## Need Your Droplet IP?

1. Go to [Digital Ocean Dashboard](https://cloud.digitalocean.com)
2. Click "Droplets" in the left sidebar
3. Your IP address is shown next to your droplet name

---

## Alternative: Run Migration Without SSH

If you can't access SSH, you can:

1. Use Digital Ocean's built-in console (Droplets → Your Droplet → "Console" button)
2. Use Digital Ocean App Platform console (if using App Platform)
3. Add migration to build command in Digital Ocean settings

**Add to Build Command:**
```
npx prisma generate && npx prisma migrate deploy && npm run build
```

This will run migrations automatically on every deployment.
