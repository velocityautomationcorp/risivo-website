# 🔍 Check Exact Column Names in Supabase Tables

## Problem

SQL failed with: `column "companyEmail" of relation "Agency" does not exist`

This means the column names in the database are different from what the code expects.

---

## Step 1: Check Actual Column Names

Go to Supabase:
👉 https://supabase.com/dashboard/project/sldpdgdkrakfzwtroglx

### Option A: Visual Check (Fastest)

1. Click **Table Editor** in left sidebar
2. Click on **Agency** table
3. Look at the column headers - write down the EXACT names (case-sensitive)
4. Repeat for **SubAccount** table

### Option B: SQL Query

Run this in SQL Editor:

```sql
-- Get exact column names for Agency table
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'Agency' 
ORDER BY ordinal_position;
```

```sql
-- Get exact column names for SubAccount table
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'SubAccount' 
ORDER BY ordinal_position;
```

---

## Step 2: Common Column Name Patterns

The column could be named as:

- `companyEmail` (PascalCase - what code expects)
- `company_email` (snake_case - PostgreSQL default)
- `companyemail` (lowercase)
- `email` (simplified)

---

## Step 3: Report Back

Please provide:

1. **Agency table columns:** (exact names from Step 1)
2. **SubAccount table columns:** (exact names from Step 1)

Example format:
```
Agency: id, name, email, address, city, state, country, zipCode, goal, createdAt, updatedAt
SubAccount: id, name, email, agencyId, address, ...
```

---

## Step 4: I'll Create Correct SQL

Once I know the exact column names, I'll create SQL that matches your database structure.

---

## 🤔 Why This Happened

The Supabase REST API code (in `src/lib/supabase.ts` and `src/routes/*.ts`) uses **PascalCase** column names like:
- `companyEmail`
- `subAccountId`
- `createdAt`

But the actual database might be using **snake_case** like:
- `company_email`
- `sub_account_id`
- `created_at`

This mismatch causes the 500 error.

---

**Quick Action:** Check Agency and SubAccount table columns in Supabase Table Editor and report back the exact names!
