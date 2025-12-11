# 🔐 FIX: RLS Policy Violation - Use Service Role Key

## 🎯 Problem
Contact form failing with **`42501: new row violates row-level security policy`**

This happens because:
1. Your `Contact` table has **Row Level Security (RLS)** enabled
2. The API uses `SUPABASE_ANON_KEY` which is restricted by RLS policies
3. Server-side operations need the **Service Role Key** to bypass RLS

---

## ✅ Solution: Add Service Role Key

### **STEP 1: Get Your Service Role Key**

1. Go to: https://supabase.com/dashboard/project/sldpdgdkrakfzwtroglx/settings/api
2. Find **"Service Role Key"** under "Project API keys"
3. Copy the entire key (starts with `eyJ...`)

⚠️ **Important:** Keep this key secret! It bypasses all RLS policies.

---

### **STEP 2: Add to Cloudflare Pages**

**Option A: Using Wrangler CLI (Recommended)**

```powershell
cd C:\Users\Buzgrowth\Documents\risivo-website

npx wrangler pages secret put SUPABASE_SERVICE_KEY --project-name risivo-staging
# When prompted, paste your service role key and press Enter
```

**Option B: Using Cloudflare Dashboard**

1. Go to: https://dash.cloudflare.com
2. Navigate to **Workers & Pages** → **risivo-staging**
3. Go to **Settings** → **Environment variables**
4. Click **Add variable**
5. Name: `SUPABASE_SERVICE_KEY`
6. Value: Paste your service role key
7. Click **Save**

---

### **STEP 3: Deploy Updated Code**

```powershell
cd C:\Users\Buzgrowth\Documents\risivo-website
git pull origin staging
npm run build
npx wrangler pages deploy dist --project-name risivo-staging --branch staging
```

---

### **STEP 4: Test the Form**

1. **Visit:** https://risivo-staging.pages.dev/contact

2. **Fill and submit:**
   - First Name: `Jean Pierre`
   - Last Name: `Francois`
   - Email: `jpfrancois2021@gmail.com`
   - Phone: `+1 8552568794`
   - Message: `Test`

3. **Expected result:**
   - ✅ Console: `Response status: 200`
   - ✅ Green message: "Thank you! We'll be in touch soon."
   - ✅ Data appears in Supabase `Contact` table

---

## 🔍 How It Works

### **Before (BROKEN):**
```typescript
const supabaseKey = env.SUPABASE_ANON_KEY  // ❌ Restricted by RLS
```

### **After (FIXED):**
```typescript
const supabaseKey = env.SUPABASE_SERVICE_KEY || env.SUPABASE_ANON_KEY  // ✅ Bypasses RLS
```

The service role key has **full database access** and bypasses all RLS policies, making it perfect for server-side API operations.

---

## 🛡️ Alternative: Fix RLS Policies (Not Recommended for Now)

If you prefer to keep using `SUPABASE_ANON_KEY`, you'd need to create proper RLS policies:

```sql
-- Allow anonymous inserts to Contact table
CREATE POLICY "Allow public contact submissions"
ON "Contact"
FOR INSERT
TO anon
WITH CHECK (true);
```

**But:** Using the service role key is simpler and more secure for server-side operations.

---

## ✅ What's Ready

- ✅ Code updated to use `SUPABASE_SERVICE_KEY` (Commit: 8fd4866)
- ✅ Falls back to `SUPABASE_ANON_KEY` if service key not set
- ✅ Build successful: 104.26 kB
- ✅ Pushed to staging branch

---

## 🚀 Quick Deploy Commands

```powershell
# 1. Add service key
cd C:\Users\Buzgrowth\Documents\risivo-website
npx wrangler pages secret put SUPABASE_SERVICE_KEY --project-name risivo-staging

# 2. Deploy
git pull origin staging && npm run build
npx wrangler pages deploy dist --project-name risivo-staging --branch staging

# 3. Test at: https://risivo-staging.pages.dev/contact
```

---

## 🎉 After This Fix

The contact form will work because:
1. ✅ Schema matches (firstName + lastName)
2. ✅ API uses service role key (bypasses RLS)
3. ✅ SubAccount exists (Website Leads)
4. ✅ All required fields properly mapped

**This is the final piece! Add the service key and you're done.** 🚀
