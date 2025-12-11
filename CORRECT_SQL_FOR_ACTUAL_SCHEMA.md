# ✅ CORRECT SQL - Matches Your Actual Database Schema

## Database Schema Confirmed

**Agency table has:** `id`, `name`, `slug`, `email`, `logo`, `domains`, `plan`, `stripeCustomerId`, `subscriptionStatus`, `trialEndsAt`, `stripeSubscriptionId`, `maxSubAccounts`, `createdAt`, `updatedAt`

**SubAccount table has:** `id`, `agencyId`, `name`, `industry`, `logo`, `email`, `phone`, `address`, `website`, `timezone`, `language`, `isEnabled`, `createdAt`, `updatedAt`

---

## 🎯 CORRECT SQL (Copy & Paste This)

Run this in Supabase SQL Editor:
👉 https://supabase.com/dashboard/project/sldpdgdkrakfzwtroglx

```sql
-- Create default Agency for website leads
INSERT INTO "Agency" (
  id, 
  name, 
  slug,
  email,
  "createdAt", 
  "updatedAt"
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

-- Create default SubAccount for website contact form
INSERT INTO "SubAccount" (
  id, 
  name,
  email,
  "agencyId",
  industry,
  timezone,
  language,
  "isEnabled",
  "createdAt", 
  "updatedAt"
)
SELECT 
  gen_random_uuid(), 
  'Website Leads',
  'admin@risivo.com',
  (SELECT id FROM "Agency" WHERE slug = 'risivo-marketing' LIMIT 1),
  'Marketing',
  'America/Los_Angeles',
  'en',
  true,
  now(), 
  now()
WHERE NOT EXISTS (
  SELECT 1 FROM "SubAccount" WHERE name = 'Website Leads'
);
```

**Expected Result:**
```
Success. No rows returned
```

---

## ✅ Verify Data Created

```sql
SELECT 
  (SELECT COUNT(*) FROM "Agency") as agencies,
  (SELECT COUNT(*) FROM "SubAccount") as subaccounts,
  (SELECT name, email FROM "Agency" LIMIT 1) as agency_info,
  (SELECT name, email FROM "SubAccount" LIMIT 1) as subaccount_info;
```

**Expected Result:**
- `agencies: 1`
- `subaccounts: 1`
- Agency: `Risivo Marketing` / `admin@risivo.com`
- SubAccount: `Website Leads` / `admin@risivo.com`

---

## 🚨 CRITICAL ISSUE FOUND

Your API code expects columns that **don't exist** in your database:

### Agency Table Mismatch:
- Code expects: `companyEmail`, `address`, `city`, `state`, `country`, `zipCode`, `goal`
- Database has: `email`, (no address fields), (no goal field)

### SubAccount Table Mismatch:
- Code expects: `companyEmail`, `city`, `state`, `country`, `zipCode`, `goal`
- Database has: `email`, `address` (single field), (no city/state/country/zipCode), (no goal)

---

## 🔧 TWO OPTIONS TO FIX THIS

### Option 1: Update API Code (Recommended - Faster)

Update the code to match your actual database schema. I need to modify:
- `src/lib/supabase.ts`
- `src/routes/contact.ts`
- `src/routes/newsletter.ts`
- `src/routes/register.ts`

**Changes needed:**
- Replace `companyEmail` → `email`
- Remove references to `address`, `city`, `state`, `country`, `zipCode`, `goal`
- Use your actual schema fields

### Option 2: Alter Database (Not Recommended - CRM team already built their dashboard)

Add missing columns to match the code expectations. **DON'T DO THIS** - it will break the CRM team's work.

---

## ⚡ IMMEDIATE ACTION

1. **Run the SQL above** - This will create Agency + SubAccount with your actual schema
2. **I'll update the API code** to match your database schema
3. **Rebuild and redeploy** - Contact form will work

---

**Which option do you prefer?**

I recommend **Option 1** (update code to match your database). I can do this now and have it working in 5 minutes!
