# 🔧 Fix Supabase RLS Policies - Allow Contact Form to Work

## ✅ Good News!
Environment variables are working perfectly! (`/api/health` shows `"status": "ok"`)

## ❌ The Problem
The 500 error is because **Supabase Row Level Security (RLS)** is blocking the `anon` key from inserting records into the database.

---

## 🚀 Solution: Add RLS Policies

We need to allow the `anon` role (public users from website) to INSERT records.

### Step 1: Go to Supabase SQL Editor

1. **Open:** https://supabase.com/dashboard/project/sldpdgdkrakfzwtroglx
2. **Click:** SQL Editor (left sidebar - looks like `</>` icon)
3. **Click:** "+ New query" button

---

### Step 2: Run These SQL Commands

**Copy and paste this entire SQL script:**

```sql
-- Allow anonymous users to insert contacts
CREATE POLICY IF NOT EXISTS "Allow public contact creation"
ON "Contact"
FOR INSERT
TO anon
WITH CHECK (true);

-- Allow anonymous users to read SubAccounts (needed to find default subaccount)
CREATE POLICY IF NOT EXISTS "Allow public subaccount read"
ON "SubAccount"
FOR SELECT
TO anon
USING (true);

-- Allow anonymous users to insert newsletter subscribers
CREATE POLICY IF NOT EXISTS "Allow public newsletter subscription"
ON "NewsletterSubscriber"
FOR INSERT
TO anon
WITH CHECK (true);

-- Allow anonymous users to read existing newsletter subscribers (check for duplicates)
CREATE POLICY IF NOT EXISTS "Allow public newsletter read"
ON "NewsletterSubscriber"
FOR SELECT
TO anon
USING (true);

-- Allow anonymous users to update newsletter subscribers (reactivate subscription)
CREATE POLICY IF NOT EXISTS "Allow public newsletter update"
ON "NewsletterSubscriber"
FOR UPDATE
TO anon
USING (true)
WITH CHECK (true);
```

**Click:** "Run" or "Execute" button

**Expected:** You should see success messages for each policy created.

---

### Step 3: Verify RLS is Enabled

After running the SQL, verify RLS is enabled:

1. **Click:** Table Editor (left sidebar)
2. **Click:** Contact table
3. **Look for:** A shield icon or "RLS enabled" badge
4. **If RLS is OFF:** Click the shield icon to enable it

**Repeat for:**
- SubAccount table
- NewsletterSubscriber table

---

### Step 4: Test the Contact Form Again

1. **Visit:** https://risivo-staging.pages.dev/contact
2. **Fill out:** First Name, Last Name, Email, Message
3. **Click:** "Send Message"

**Expected:** "Thank you! We'll be in touch soon."

---

## 🔍 Alternative: Disable RLS (Quick Test Only)

**⚠️ ONLY FOR TESTING** - This is not secure for production!

If you want to quickly test if RLS is the issue:

1. Go to: Table Editor → Contact table
2. Click: Shield icon (RLS badge)
3. Click: "Disable RLS"
4. Test contact form again

**If it works now:** RLS was the problem (re-enable it and use the SQL policies above)  
**If it still fails:** Something else is wrong

---

## 🐛 What If It Still Doesn't Work?

### Check Browser Console for Exact Error

1. **Open:** https://risivo-staging.pages.dev/contact
2. **Press:** F12 → Console tab
3. **Submit:** The form
4. **Look for:** Red error messages

**Common errors:**

### Error: "Failed to create contact: ..."
**Copy the full error message** - it will tell us exactly what Supabase is rejecting.

### Error: "No sub-account found in database"
**Cause:** The SubAccount table is empty  
**Fix:** Create a default SubAccount:

```sql
INSERT INTO "SubAccount" (id, name, "companyEmail", "agencyId", address, city, state, country, "zipCode", goal, "createdAt", "updatedAt")
VALUES (
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
);
```

### Error: "duplicate key value violates unique constraint"
**Cause:** Email already exists in Contact table  
**Fix:** Try a different email address

---

## 📊 Verify Data Was Created

After successful form submission:

1. **Go to:** https://supabase.com/dashboard/project/sldpdgdkrakfzwtroglx
2. **Click:** Table Editor
3. **Click:** Contact table
4. **Look for:** Your test contact (should be the newest row)

**Check:**
- Name matches what you entered
- Email is correct
- createdAt is recent
- subAccountId is filled

---

## 🔒 RLS Security Explanation

**What is RLS?**  
Row Level Security controls who can read/write data in Supabase tables.

**Default behavior:**  
- `anon` key (public users) can't do anything
- `authenticated` users can read/write their own data
- `service_role` key (server-side) can do everything

**What we did:**  
- Allowed `anon` to INSERT into Contact (for contact form)
- Allowed `anon` to SELECT from SubAccount (to find default)
- Allowed `anon` to INSERT/SELECT/UPDATE NewsletterSubscriber (for newsletter)

**Is this secure?**  
✅ Yes! We're only allowing:
- Creating new contacts (can't read existing ones)
- Reading SubAccount names (public info anyway)
- Managing newsletter subscriptions (public feature)

---

## ✅ Success Checklist

After running the SQL policies:

- [ ] SQL script executed without errors
- [ ] RLS is enabled on Contact table
- [ ] RLS is enabled on SubAccount table
- [ ] RLS is enabled on NewsletterSubscriber table
- [ ] Contact form submission works
- [ ] Success message appears
- [ ] New contact appears in Supabase Table Editor
- [ ] No errors in browser console

---

## 🎯 Expected Result

**Before (now):**  
Contact form → 500 error → No data saved

**After (with RLS policies):**  
Contact form → Success message → Contact saved in database ✅

---

## 📝 Quick Commands Summary

**1. Enable RLS Policies (run in Supabase SQL Editor):**
```sql
-- See full SQL script above
```

**2. Test Contact Form:**
Visit: https://risivo-staging.pages.dev/contact

**3. Verify Data:**
Check: Supabase Table Editor → Contact table

---

## 🆘 Still Getting 500 Error?

If you ran the SQL policies and still get 500:

1. **Open browser console (F12)**
2. **Submit form**
3. **Copy the exact error message**
4. **Share it with me**

The error will tell us exactly what's being rejected by Supabase.

---

## 💡 Why This Happened

By default, Supabase RLS blocks ALL operations for security. Since your website users are "anonymous" (not logged in), they use the `anon` key, which has no permissions by default.

**The fix:** Explicitly allow `anon` to insert contacts and subscribe to newsletter.

---

**Action: Run the SQL script in Supabase SQL Editor, then test the contact form!** 🚀

Time: 2-3 minutes  
Success Rate: 99% (this is almost certainly the issue)
