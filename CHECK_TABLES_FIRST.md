# 🔍 Check Which Tables Exist in Your Database

## The Error

`relation "NewsletterSubscriber" does not exist`

This means either:
1. The table doesn't exist yet
2. The table has a different name (case-sensitive!)
3. The table is in a different schema

---

## 🔍 Step 1: Check What Tables Exist

### In Supabase SQL Editor, run this:

```sql
-- List all tables in your database
SELECT tablename 
FROM pg_tables 
WHERE schemaname = 'public'
ORDER BY tablename;
```

**This will show you all table names.**

---

## 📋 Step 2: Tell Me What You See

**Copy and paste the list of tables here.**

We need to know:
- Is it `NewsletterSubscriber` or `newslettersubscriber` or `newsletter_subscriber`?
- Is it `Contact` or `contact`?
- Is it `SubAccount` or `subaccount` or `sub_account`?

---

## 🎯 Common Scenarios

### Scenario A: Tables Don't Exist Yet

If the CRM hasn't created these tables, we need to create them first.

**Check if these tables exist:**
- Contact (or contact)
- SubAccount (or subaccount)  
- NewsletterSubscriber (or newslettersubscriber)
- Agency (or agency)
- User (or user)

### Scenario B: Different Table Names

PostgreSQL is case-sensitive. The tables might be:
- Lowercase: `contact`, `subaccount`, `newslettersubscriber`
- Snake case: `newsletter_subscriber`, `sub_account`
- Different naming: `contacts`, `subscribers`, etc.

---

## 🚀 Temporary Fix: Just Allow Contact Creation

While we figure out the table names, let's at least get the contact form working.

**Run this simplified SQL:**

```sql
-- Enable RLS on Contact table
ALTER TABLE "Contact" ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert contacts
CREATE POLICY "public_insert_contacts"
ON "Contact"
FOR INSERT
TO anon
WITH CHECK (true);

-- Allow anyone to read subaccounts
ALTER TABLE "SubAccount" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public_read_subaccounts"
ON "SubAccount"
FOR SELECT
TO anon
USING (true);
```

**If that gives an error, try lowercase:**

```sql
-- Enable RLS on contact table (lowercase)
ALTER TABLE contact ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert contacts
CREATE POLICY "public_insert_contacts"
ON contact
FOR INSERT
TO anon
WITH CHECK (true);

-- Allow anyone to read subaccounts
ALTER TABLE subaccount ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public_read_subaccounts"
ON subaccount
FOR SELECT
TO anon
USING (true);
```

---

## 🔍 Step 3: Check Table Structure

Once you know the table names, check their structure:

```sql
-- Replace 'Contact' with actual table name
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'Contact'
ORDER BY ordinal_position;
```

---

## 🎯 Quick Actions

### Option 1: Check Tables in Table Editor (Easiest)

1. Go to: Supabase → **Table Editor** (left sidebar)
2. Look at the list of tables
3. **Screenshot it** or write down the exact table names
4. Tell me what you see

### Option 2: Run SQL Query

Run the SQL from Step 1 above and share the results.

---

## 📊 What We're Looking For

From the Prisma schema in the code, we expect these tables:
- `Contact` or `contact`
- `SubAccount` or `subaccount` 
- `NewsletterSubscriber` or `newslettersubscriber` or `newsletter_subscribers`
- `Agency` or `agency`
- `User` or `user`

---

## 🐛 If Tables Don't Exist

If the CRM team hasn't run migrations yet, the tables won't exist.

**Ask CRM team:**
1. Have you run `npx prisma migrate deploy` on the database?
2. Can you see the Contact and SubAccount tables in your CRM?
3. Are the tables in Supabase or a different database?

---

## ✅ Once We Know Table Names

I'll give you the correct SQL with the right table names to:
1. Enable RLS on the correct tables
2. Create policies for anon access
3. Make the contact form work

---

## 🆘 Quick Answer Needed

**Please do ONE of these:**

**Option A (Fastest):** 
- Go to Supabase → Table Editor
- Screenshot the list of tables on the left
- Share it

**Option B:**
- Run the SQL query from Step 1
- Copy/paste the table names

**Option C:**
- Tell me: Can you see Contact, SubAccount tables in Table Editor?

---

**Once I know the exact table names, I'll give you the working SQL!** 🎯
