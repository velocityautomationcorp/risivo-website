# ✅ CORRECT SQL - Final Version

## Actual SubAccount Columns Confirmed:
`id`, `agencyId`, `name`, `industry`, `logo`, `email`, `phone`, `address`, `website`, `timezone`, `language`, `aiEnabled`, `createdAt`, `updatedAt`

---

## 🎯 RUN THIS SQL NOW

Copy and paste into Supabase SQL Editor:
👉 https://supabase.com/dashboard/project/sldpdgdkrakfzwtroglx

```sql
-- Create default Agency
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

-- Create Website Leads SubAccount
INSERT INTO "SubAccount" (
  id, 
  name, 
  email, 
  "agencyId", 
  industry, 
  timezone, 
  language, 
  "aiEnabled", 
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
  false,
  now(), 
  now()
WHERE NOT EXISTS (
  SELECT 1 FROM "SubAccount" WHERE name = 'Website Leads'
);
```

**Expected Result:** `Success. No rows returned`

---

## ✅ Verify Data Created

```sql
SELECT name, email, slug FROM "Agency";
SELECT name, email, industry FROM "SubAccount";
```

**Expected:**
- Agency: `Risivo Marketing` | `admin@risivo.com` | `risivo-marketing`
- SubAccount: `Website Leads` | `admin@risivo.com` | `Marketing`

---

## 🚀 After SQL Runs Successfully

### Deploy Updated Code:

```powershell
cd C:\Users\Buzgrowth\Documents\risivo-website
git checkout staging
git pull origin staging
npm run build
npx wrangler pages deploy dist --project-name risivo-staging --branch staging
```

### Test Contact Form:

1. Visit: https://risivo-staging.pages.dev/contact
2. Fill form and submit
3. Expect: **"Thank you! We'll be in touch soon."** ✅
4. Verify in Supabase → Contact table

---

**Status:** ✅ SQL Corrected | 🟡 Run SQL | 🟡 Deploy | 🟡 Test
