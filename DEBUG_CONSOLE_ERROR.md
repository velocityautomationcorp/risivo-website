# 🔍 Debug Contact Form 500 Error - Get Exact Error

RLS policies are now enabled, but still getting 500 error. Let's find out exactly what's failing.

---

## 🧪 Step 1: Check Browser Console

1. **Open:** https://risivo-staging.pages.dev/contact
2. **Press:** F12 (or right-click → Inspect)
3. **Click:** Console tab
4. **Clear console:** Click the 🚫 icon to clear old messages
5. **Submit the form** with test data
6. **Look for:** Red error messages

---

## 📋 What to Look For

### Expected Error Messages:

**Error A: "Failed to create contact: ..."**
This will tell us exactly what Supabase is rejecting.

**Error B: "No sub-account found in database"**
SubAccount table is empty - need to create one.

**Error C: "new row violates row-level security policy"**
RLS policy isn't working correctly.

**Error D: Network tab shows response body**
F12 → Network → Click the failed "contact" request → Response tab

---

## 🔍 Step 2: Check Network Response

1. **F12** → **Network** tab
2. **Submit form**
3. **Click** the red "contact" request (will show as "500")
4. **Click** "Response" sub-tab
5. **Copy** the entire error response

**This will show the exact server error!**

---

## 🚀 Quick Test: Check SubAccount Table

The most likely issue is an empty SubAccount table.

### In Supabase SQL Editor, run:

```sql
-- Check if SubAccount table has any records
SELECT COUNT(*) as subaccount_count FROM "SubAccount";

-- Also check Agency table
SELECT COUNT(*) as agency_count FROM "Agency";
```

**If SubAccount count is 0:** That's the problem!

---

## 🔧 Fix: Create Default SubAccount

If SubAccount table is empty, run this:

```sql
-- First, check if we have an Agency
INSERT INTO "Agency" (
  id,
  name,
  "companyEmail",
  address,
  city,
  state,
  country,
  "zipCode",
  goal,
  "createdAt",
  "updatedAt"
)
SELECT
  gen_random_uuid(),
  'Risivo Marketing',
  'admin@risivo.com',
  '',
  '',
  '',
  '',
  '',
  5000,
  now(),
  now()
WHERE NOT EXISTS (SELECT 1 FROM "Agency" LIMIT 1);

-- Then create SubAccount linked to that Agency
INSERT INTO "SubAccount" (
  id,
  name,
  "companyEmail",
  "agencyId",
  address,
  city,
  state,
  country,
  "zipCode",
  goal,
  "createdAt",
  "updatedAt"
)
SELECT
  gen_random_uuid(),
  'Website Leads',
  'admin@risivo.com',
  (SELECT id FROM "Agency" LIMIT 1),
  '',
  '',
  '',
  '',
  '',
  5000,
  now(),
  now()
WHERE NOT EXISTS (SELECT 1 FROM "SubAccount" LIMIT 1);

-- Verify it was created
SELECT id, name, "companyEmail" FROM "SubAccount";
```

---

## 🔍 Alternative: Test RLS Policy Directly

Let's test if the RLS policy actually works:

```sql
-- Test INSERT as anon user
SET ROLE anon;
INSERT INTO "Contact" (id, name, email, "subAccountId", "createdAt", "updatedAt")
VALUES (
  gen_random_uuid(),
  'Test Contact',
  'test@example.com',
  (SELECT id FROM "SubAccount" LIMIT 1),
  now(),
  now()
);
RESET ROLE;

-- Check if it was created
SELECT name, email FROM "Contact" ORDER BY "createdAt" DESC LIMIT 1;
```

**If this INSERT fails:** The RLS policy has an issue  
**If it succeeds:** The problem is in our API code

---

## 🐛 Common Issues

### Issue 1: SubAccount Table Empty
**Symptom:** "No sub-account found in database"  
**Fix:** Run the INSERT SubAccount SQL above

### Issue 2: RLS Policy Not Working
**Symptom:** "new row violates row-level security policy"  
**Fix:** Check that policies were created:
```sql
SELECT * FROM pg_policies WHERE tablename = 'Contact';
```

### Issue 3: Missing Required Fields
**Symptom:** "null value in column ... violates not-null constraint"  
**Fix:** Check Contact table structure:
```sql
SELECT column_name, is_nullable, data_type 
FROM information_schema.columns 
WHERE table_name = 'Contact';
```

---

## 📊 Diagnostic Checklist

Run through this:

- [ ] Browser console shows specific error message
- [ ] Network tab shows response body
- [ ] SubAccount table has at least 1 record
- [ ] Agency table has at least 1 record
- [ ] RLS policies exist on Contact table
- [ ] Can INSERT as anon role (test SQL above)

---

## 🆘 What to Share

To fix this quickly, please share:

1. **Browser Console Error:**
   - F12 → Console → Screenshot of red error
   - Or copy/paste the error text

2. **Network Response:**
   - F12 → Network → Click "contact" request → Response tab
   - Copy the entire response

3. **SubAccount Count:**
   ```sql
   SELECT COUNT(*) FROM "SubAccount";
   ```
   What number does it return?

---

## 💡 Most Likely Issues (Ranked)

1. **SubAccount table is empty** (80%)
   - Contact form needs a SubAccount to assign contacts to
   - Fix: Run INSERT SubAccount SQL

2. **Agency table is empty** (15%)
   - SubAccount needs an Agency to link to
   - Fix: Run INSERT Agency + SubAccount SQL

3. **RLS policy issue** (4%)
   - Policy wasn't created correctly
   - Fix: Re-run CREATE POLICY commands

4. **Other** (1%)
   - Share console/network errors for debugging

---

## ✅ Quick Verification

Run these checks:

```sql
-- 1. Check tables have data
SELECT 
  (SELECT COUNT(*) FROM "Agency") as agencies,
  (SELECT COUNT(*) FROM "SubAccount") as subaccounts,
  (SELECT COUNT(*) FROM "Contact") as contacts;

-- 2. Check RLS is enabled
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE tablename IN ('Contact', 'SubAccount');

-- 3. Check policies exist
SELECT tablename, policyname, roles, cmd
FROM pg_policies
WHERE tablename IN ('Contact', 'SubAccount');
```

Share the results!

---

**Please share the browser console error or network response, and I'll fix it immediately!** 🔍
