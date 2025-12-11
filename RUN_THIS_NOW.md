# 🚀 RUN THIS NOW - Contact Form Fix

## Step 1: Run SQL (Copy & Paste)

Go to: https://supabase.com/dashboard/project/sldpdgdkrakfzwtroglx → SQL Editor

```sql
-- Create Agency
INSERT INTO "Agency" (id, name, slug, email, "createdAt", "updatedAt")
SELECT gen_random_uuid(), 'Risivo Marketing', 'risivo-marketing', 'admin@risivo.com', now(), now()
WHERE NOT EXISTS (SELECT 1 FROM "Agency" WHERE slug = 'risivo-marketing');

-- Create SubAccount
INSERT INTO "SubAccount" (id, name, email, "agencyId", industry, timezone, language, "aiEnabled", "createdAt", "updatedAt")
SELECT gen_random_uuid(), 'Website Leads', 'admin@risivo.com', 
  (SELECT id FROM "Agency" WHERE slug = 'risivo-marketing' LIMIT 1),
  'Marketing', 'America/Los_Angeles', 'en', false, now(), now()
WHERE NOT EXISTS (SELECT 1 FROM "SubAccount" WHERE name = 'Website Leads');
```

---

## Step 2: Deploy Code

```powershell
cd C:\Users\Buzgrowth\Documents\risivo-website
git pull origin staging
npm run build
npx wrangler pages deploy dist --project-name risivo-staging --branch staging
```

---

## Step 3: Test

1. Visit: https://risivo-staging.pages.dev/contact
2. Fill form → Submit
3. Should see: "Thank you! We'll be in touch soon." ✅

---

**Latest Code:** Commit 6f95539 (pushed to staging)  
**Status:** ✅ Ready to deploy
