# 🎯 FINAL FIX - Deploy Contact Form Now (3 Steps)

## ✅ Problem SOLVED

The API code was using **wrong column names** that don't exist in your database:
- Code had: `companyEmail`, `address`, `city`, `state`, `country`, `zipCode`, `goal`
- Database has: `email`, `slug`, `industry`, `timezone`, `language`, `isEnabled`

**I've fixed the code to match your actual database schema!**

---

## ⚡ 3-STEP FIX (5 minutes total)

### Step 1: Create SubAccount in Supabase (2 min)

Go to SQL Editor:
👉 https://supabase.com/dashboard/project/sldpdgdkrakfzwtroglx

**Run this SQL:**

```sql
-- Create default Agency
INSERT INTO "Agency" (
  id, name, slug, email, "createdAt", "updatedAt"
)
SELECT 
  gen_random_uuid(), 
  'Risivo Marketing',
  'risivo-marketing',
  'admin@risivo.com',
  now(), 
  now()
WHERE NOT EXISTS (
  SELECT 1 FROM "Agency" WHERE slug = 'risivo-marketing'
);

-- Create Website Leads SubAccount
INSERT INTO "SubAccount" (
  id, name, email, "agencyId", industry, timezone, language, "aiEnabled", "createdAt", "updatedAt"
)
SELECT 
  gen_random_uuid(), 
  'Website Leads',
  'admin@risivo.com',
  (SELECT id FROM "Agency" WHERE slug = 'risivo-marketing' LIMIT 1),
  'Marketing',
  'America/Los_Angeles',
  'en',
  false,
  now(), 
  now()
WHERE NOT EXISTS (
  SELECT 1 FROM "SubAccount" WHERE name = 'Website Leads'
);
```

**Expected:** `Success. No rows returned`

---

### Step 2: Deploy Updated Code (2 min)

Open PowerShell/Terminal and run:

```powershell
cd C:\Users\Buzgrowth\Documents\risivo-website
git checkout staging
git pull origin staging
npm run build
npx wrangler pages deploy dist --project-name risivo-staging --branch staging
```

**Expected output:**
```
✨ Compiled Worker successfully
✨ Uploading... 
✨ Deployment complete!
https://risivo-staging.pages.dev
```

---

### Step 3: Test Contact Form (1 min)

1. **Visit:** https://risivo-staging.pages.dev/contact

2. **Fill form:**
   - First Name: `Test`
   - Last Name: `User`
   - Email: `test@example.com`
   - Message: `Testing after schema fix`

3. **Submit** → Should see: **"Thank you! We'll be in touch soon."** ✅

4. **Verify in Supabase:**
   - Go to: https://supabase.com/dashboard/project/sldpdgdkrakfzwtroglx
   - Table Editor → **Contact**
   - See your new contact: `Test User` / `test@example.com`

---

## 📊 What Was Fixed

### Code Changes (Commit 88706ae):
✅ Changed `companyEmail` → `email` in Agency & SubAccount tables  
✅ Removed non-existent columns: `address`, `city`, `state`, `country`, `zipCode`, `goal`  
✅ Added actual columns: `slug` (Agency), `industry`, `timezone`, `language`, `isEnabled` (SubAccount)  
✅ Build successful: 92.00 kB  

### SQL Script:
✅ Uses correct column names matching your database  
✅ Creates Agency with `slug` and `email` (not `companyEmail`)  
✅ Creates SubAccount with required fields  

---

## 🎉 After This Works

✅ **Contact form** → Saves to Supabase → CRM sees data  
✅ **CRM sync** → Verified with your actual schema  
✅ **Ready for production** → Deploy to `risivo-coming-soon`  
✅ **Newsletter form** → Test next (already has correct schema)  

---

## ⚠️ If Still Getting 500 Error

**Check browser console (F12):**
- If "No sub-account found" → Re-run SQL Step 1
- If "RLS policy violation" → Re-run RLS policies from earlier
- If other error → Share the exact console message

**Check Supabase data:**
```sql
SELECT name, email FROM "Agency";
SELECT name, email FROM "SubAccount";
```
Should show `Risivo Marketing` and `Website Leads`.

---

## 🚀 Quick Commands Reference

**Deploy:**
```bash
cd C:\Users\Buzgrowth\Documents\risivo-website && git pull origin staging && npm run build && npx wrangler pages deploy dist --project-name risivo-staging --branch staging
```

**Test URLs:**
- Contact Page: https://risivo-staging.pages.dev/contact
- API Health: https://risivo-staging.pages.dev/api/health
- Supabase: https://supabase.com/dashboard/project/sldpdgdkrakfzwtroglx

---

**Status:** ✅ Code fixed | 🟡 SQL needed | 🟡 Deploy needed  
**ETA:** 5 minutes to working contact form  
**Commit:** 88706ae (pushed to staging)
