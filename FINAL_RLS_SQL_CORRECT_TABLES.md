# ✅ Final RLS SQL - For Your Actual Tables

## Tables Found in Your Database:
- ✅ Agency (UNPROTECTED)
- ✅ Contact (UNPROTECTED)
- ✅ SubAccount (UNPROTECTED)
- ✅ User (UNPROTECTED)
- ✅ Session (UNPROTECTED)
- ❌ NewsletterSubscriber (DOES NOT EXIST)

---

## 🚀 Solution 1: Enable Contact Form Only (Quick Fix)

Since you don't have a NewsletterSubscriber table, let's just get the contact form working first.

### Run This SQL:

```sql
-- Enable RLS on Contact table
ALTER TABLE "Contact" ENABLE ROW LEVEL SECURITY;

-- Allow anonymous users to insert contacts
CREATE POLICY "public_insert_contacts"
ON "Contact"
FOR INSERT
TO anon
WITH CHECK (true);

-- Enable RLS on SubAccount table
ALTER TABLE "SubAccount" ENABLE ROW LEVEL SECURITY;

-- Allow anonymous users to read SubAccounts (to find default one)
CREATE POLICY "public_read_subaccounts"
ON "SubAccount"
FOR SELECT
TO anon
USING (true);
```

**Click "Run" in Supabase SQL Editor**

---

## ✅ Test Contact Form

1. Visit: https://risivo-staging.pages.dev/contact
2. Fill out form
3. Click "Send Message"

**Expected:** ✅ "Thank you! We'll be in touch soon."

---

## 📊 Verify Data Was Created

After successful submission:

1. Go to: Table Editor → **Contact** table
2. Look for: Your test contact (newest row)
3. Verify: name, email, createdAt are filled

---

## 🐛 If You Get "No sub-account found" Error

Your SubAccount table might be empty. Create a default one:

```sql
-- Insert a default SubAccount for website leads
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
WHERE NOT EXISTS (
  SELECT 1 FROM "SubAccount" WHERE name = 'Website Leads'
);
```

---

## 📝 About Newsletter Feature

Since there's no `NewsletterSubscriber` table, the newsletter form won't work yet.

**Two options:**

### Option A: Create the Table (CRM Team)

Ask the CRM team to run Prisma migrations:
```bash
cd C:\Users\Buzgrowth\Documents\risivo-crm
npx prisma migrate deploy
```

This will create all missing tables including NewsletterSubscriber.

### Option B: Use Contact Table for Newsletter

Modify the newsletter API to just create Contacts with a special tag.

**For now, let's just get the contact form working!**

---

## 🔍 What About Other Tables?

I see these tables are all "UNPROTECTED" (no RLS):
- Agency
- AIContentGeneration
- AIConversation
- AILeadScore
- AIPrediction
- AITranslation
- AIUsageLog
- AIVoiceCall
- Campaign
- User
- Session

**For now:** We only need RLS on Contact and SubAccount for the website to work.

**Later:** The CRM team should add proper RLS policies for all tables.

---

## ✅ Success Checklist

After running the SQL:

- [ ] SQL executed without errors
- [ ] Contact table has RLS enabled (shield icon)
- [ ] SubAccount table has RLS enabled
- [ ] Contact form submission works
- [ ] Success message appears
- [ ] New contact appears in Contact table
- [ ] No 500 errors

---

## 🎯 Summary

**Tables that exist:** Contact, SubAccount (and others)  
**Table that's missing:** NewsletterSubscriber  
**What we're fixing:** Contact form (newsletter comes later)  
**SQL:** Enable RLS + allow anon INSERT on Contact, SELECT on SubAccount

---

## 🆘 If Still Getting 500 Error

1. **Check browser console (F12 → Console)**
2. **Look for error message** - it will say exactly what failed
3. **Share the error** and I'll help immediately

Common errors after RLS fix:
- "No sub-account found" → Run the INSERT SubAccount SQL above
- "duplicate key" → Email already exists, try different email
- Other errors → Share in console

---

## 📞 About Newsletter Table

**Question for CRM Team:**

"The Prisma schema includes a NewsletterSubscriber table, but it doesn't exist in Supabase yet. Have you run all Prisma migrations? Should I create this table manually or will it come from the CRM migrations?"

---

**Run the SQL above (just Contact + SubAccount), then test the contact form!** 🚀

**Expected time to fix:** 1 minute  
**Expected result:** Contact form works ✅
