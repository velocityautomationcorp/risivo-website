# 🔴 URGENT FIX: Contact Form 500 Error - "System configuration error"

## Problem Diagnosed ✅

The contact form returns **500 error** with message: **"System configuration error. Please contact support."**

**Root Cause:** The `SubAccount` table is EMPTY. The API code (lines 99-105 in `contact.ts`) requires at least one SubAccount to create contacts, but finds none.

---

## ⚡ IMMEDIATE FIX (2 minutes)

### Step 1: Create Default SubAccount in Supabase

Go to Supabase SQL Editor:
👉 https://supabase.com/dashboard/project/sldpdgdkrakfzwtroglx

**Run this SQL:**

```sql
-- Create default Agency (if doesn't exist)
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
  '123 Business Street', 
  'San Francisco', 
  'CA', 
  'USA', 
  '94102', 
  5000, 
  now(), 
  now()
WHERE NOT EXISTS (
  SELECT 1 FROM "Agency" WHERE name = 'Risivo Marketing'
);

-- Create default SubAccount (Website Leads)
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
  '123 Business Street', 
  'San Francisco', 
  'CA', 
  'USA', 
  '94102', 
  5000, 
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

### Step 2: Verify Data Created

**Run this verification SQL:**

```sql
SELECT 
  (SELECT COUNT(*) FROM "Agency") as agencies,
  (SELECT COUNT(*) FROM "SubAccount") as subaccounts,
  (SELECT COUNT(*) FROM "Contact") as contacts;
```

**Expected Result:**
```
agencies | subaccounts | contacts
---------|-------------|----------
   1     |      1      |    0
```

---

### Step 3: Test Contact Form

1. **Visit:** https://risivo-staging.pages.dev/contact

2. **Fill out form:**
   - First Name: `Test`
   - Last Name: `User`
   - Email: `test@example.com`
   - Phone: `555-1234`
   - Message: `Testing contact form after SubAccount fix`

3. **Click:** "Send Message"

4. **Expected Result:**
   - ✅ Green success message: "Thank you! We'll be in touch soon."
   - ✅ Form clears
   - ✅ No browser console errors

---

### Step 4: Verify in Supabase

1. Go to: https://supabase.com/dashboard/project/sldpdgdkrakfzwtroglx
2. Click: **Table Editor** → **Contact**
3. Look for your test contact:
   - `name`: "Test User"
   - `email`: "test@example.com"
   - `subAccountId`: Should have a UUID value
   - `createdAt`: Recent timestamp

---

## 📊 What This Fixes

✅ **500 Error:** Resolved by creating default SubAccount  
✅ **"System configuration error":** API now finds SubAccount  
✅ **Contact Form:** Will successfully save data to Supabase  
✅ **CRM Sync:** Contact data flows into CRM database  

---

## 🔍 Why This Happened

The **Contact table** has RLS policies allowing INSERT, but the **SubAccount table** was empty. The contact form API requires a SubAccount to assign new contacts to (like a "bucket" for website leads).

The CRM team likely created their own SubAccounts for their super admin dashboard, but the **"Website Leads"** SubAccount for the marketing website was never created.

---

## 🎯 After Testing

Once the form works:

1. **Verify with CRM Team:** Confirm they can see contacts in their dashboard
2. **Newsletter Form:** Test `/api/newsletter` endpoint next
3. **Production Deploy:** Ready to deploy to `risivo-coming-soon` project

---

## ⚠️ If Still Getting 500 Error

### Check RLS Policies are Still Active

```sql
-- Verify RLS policies exist
SELECT schemaname, tablename, policyname 
FROM pg_policies 
WHERE tablename IN ('Contact', 'SubAccount')
ORDER BY tablename, policyname;
```

**Expected:** Should show policies like `public_insert_contacts`, `public_read_subaccounts`

**If empty:** Re-run the RLS SQL from earlier docs.

---

## 📞 Support

If form still fails after SQL:
1. Open browser console (F12 → Console)
2. Submit form and copy exact error message
3. Check Network tab → `contact` request → Response

---

**Created:** 2025-12-10  
**Status:** Ready to execute (SQL + Test)  
**ETA:** 2 minutes to working contact form
