# 🔧 Supabase RLS Fix - Corrected SQL (No IF NOT EXISTS)

## ❌ Previous SQL Error
The `IF NOT EXISTS` clause caused a syntax error. Here's the corrected version.

---

## 🚀 Solution: Run This Corrected SQL

### Step 1: Open Supabase SQL Editor

1. Go to: https://supabase.com/dashboard/project/sldpdgdkrakfzwtroglx
2. Click: **SQL Editor** (left sidebar)
3. Click: **+ New query**

---

### Step 2: Copy and Paste This SQL (Corrected)

```sql
-- Allow anonymous users to insert contacts
CREATE POLICY "Allow public contact creation"
ON "Contact"
FOR INSERT
TO anon
WITH CHECK (true);

-- Allow anonymous users to read SubAccounts (needed to find default subaccount)
CREATE POLICY "Allow public subaccount read"
ON "SubAccount"
FOR SELECT
TO anon
USING (true);

-- Allow anonymous users to insert newsletter subscribers
CREATE POLICY "Allow public newsletter subscription"
ON "NewsletterSubscriber"
FOR INSERT
TO anon
WITH CHECK (true);

-- Allow anonymous users to read existing newsletter subscribers (check for duplicates)
CREATE POLICY "Allow public newsletter read"
ON "NewsletterSubscriber"
FOR SELECT
TO anon
USING (true);

-- Allow anonymous users to update newsletter subscribers (reactivate subscription)
CREATE POLICY "Allow public newsletter update"
ON "NewsletterSubscriber"
FOR UPDATE
TO anon
USING (true)
WITH CHECK (true);
```

---

### Step 3: Click "Run"

**Expected:** Success messages for each policy.

**If you see "policy already exists" error:**
That's OK! It means the policies were created. Just continue to testing.

---

### Step 4: Enable RLS on Tables

RLS policies won't work unless RLS is enabled. Let's make sure:

1. Click: **Table Editor** (left sidebar)
2. Click: **Contact** table
3. Look for: Shield icon or "RLS" badge at the top
4. **If it says "RLS disabled":** Click the shield to enable it
5. **Repeat for:**
   - SubAccount table
   - NewsletterSubscriber table

---

### Step 5: Test Contact Form

1. Visit: https://risivo-staging.pages.dev/contact
2. Fill out form
3. Click "Send Message"

**Expected:** ✅ "Thank you! We'll be in touch soon."

---

## 🐛 Alternative: If Policies Already Exist

If you get "policy already exists" errors, the policies might already be there but with wrong permissions.

**Drop and recreate them:**

```sql
-- Drop existing policies
DROP POLICY IF EXISTS "Allow public contact creation" ON "Contact";
DROP POLICY IF EXISTS "Allow public subaccount read" ON "SubAccount";
DROP POLICY IF EXISTS "Allow public newsletter subscription" ON "NewsletterSubscriber";
DROP POLICY IF EXISTS "Allow public newsletter read" ON "NewsletterSubscriber";
DROP POLICY IF EXISTS "Allow public newsletter update" ON "NewsletterSubscriber";

-- Recreate with correct permissions
CREATE POLICY "Allow public contact creation"
ON "Contact"
FOR INSERT
TO anon
WITH CHECK (true);

CREATE POLICY "Allow public subaccount read"
ON "SubAccount"
FOR SELECT
TO anon
USING (true);

CREATE POLICY "Allow public newsletter subscription"
ON "NewsletterSubscriber"
FOR INSERT
TO anon
WITH CHECK (true);

CREATE POLICY "Allow public newsletter read"
ON "NewsletterSubscriber"
FOR SELECT
TO anon
USING (true);

CREATE POLICY "Allow public newsletter update"
ON "NewsletterSubscriber"
FOR UPDATE
TO anon
USING (true)
WITH CHECK (true);
```

---

## 🔍 Check Current Policies

To see what policies already exist:

```sql
-- View all policies on Contact table
SELECT * FROM pg_policies WHERE tablename = 'Contact';

-- View all policies on SubAccount table
SELECT * FROM pg_policies WHERE tablename = 'SubAccount';

-- View all policies on NewsletterSubscriber table
SELECT * FROM pg_policies WHERE tablename = 'NewsletterSubscriber';
```

---

## 🚨 Quick Test: Temporarily Disable RLS

**⚠️ FOR TESTING ONLY** - Do this to confirm RLS is the problem:

1. Go to: Table Editor → Contact table
2. Click: Shield icon (RLS badge)
3. Click: "Disable RLS" 
4. Test contact form

**If it works now:** RLS was definitely the problem  
**Then:** Re-enable RLS and use the SQL policies above

---

## ✅ Verify RLS Status

After running SQL, check each table:

**Contact table:**
- [ ] RLS is enabled (shield icon shows "enabled")
- [ ] Policy "Allow public contact creation" exists
- [ ] Policy allows INSERT for anon role

**SubAccount table:**
- [ ] RLS is enabled
- [ ] Policy "Allow public subaccount read" exists
- [ ] Policy allows SELECT for anon role

**NewsletterSubscriber table:**
- [ ] RLS is enabled
- [ ] 3 policies exist (insert, select, update for anon)

---

## 📊 Test Data Creation

After successful form submission:

1. Go to: Supabase → Table Editor → Contact
2. Look for: Your test contact (newest row)
3. Verify:
   - id is a UUID
   - name = "First Last"
   - email is correct
   - subAccountId is filled
   - createdAt is recent timestamp

---

## 🐛 Common Errors After Running SQL

### Error: "policy already exists"
**Solution:** Use the DROP + CREATE version above

### Error: "relation does not exist"
**Cause:** Table name is wrong (case-sensitive)  
**Fix:** Check table names in Table Editor (might be lowercase: `contact` not `Contact`)

### Still 500 error after creating policies
**Check:** Is RLS actually enabled on the tables?  
**Fix:** Go to Table Editor and enable the shield icon

### Error: "No sub-account found in database"
**Cause:** SubAccount table is empty  
**Fix:** Create a default SubAccount:

```sql
INSERT INTO "SubAccount" (id, name, "companyEmail", "agencyId", address, city, state, country, "zipCode", goal, "createdAt", "updatedAt")
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
WHERE NOT EXISTS (SELECT 1 FROM "SubAccount" WHERE name = 'Website Leads');
```

---

## 🎯 Success Checklist

- [ ] SQL policies created without errors
- [ ] RLS enabled on Contact, SubAccount, NewsletterSubscriber
- [ ] Contact form submission works
- [ ] Success message appears
- [ ] New contact in database
- [ ] No 500 errors
- [ ] Browser console shows no errors

---

## 🆘 If Still Not Working

**Open browser console (F12 → Console) and share:**
1. The exact error message in red
2. Screenshot of Network tab (F12 → Network → click the failed request → Response)

The error will tell us exactly what Supabase is rejecting.

---

**Run the corrected SQL (without IF NOT EXISTS), then test the form!** 🚀
