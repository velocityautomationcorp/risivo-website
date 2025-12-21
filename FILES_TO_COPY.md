# 📋 FILES TO COPY TO YOUR LOCAL MACHINE

**Total Files:** 5 files to create/update + 1 file to run in Supabase

---

## ✅ ALREADY UPDATED (No action needed)

These files were updated in previous steps:
- ✅ `src/lib/supabase.ts` - Your CRM client (PRESERVED, no changes)
- ✅ `src/index.tsx` - Routes already mounted
- ✅ `package.json` - Supabase dependency already added
- ✅ `.env.example` - Already has Supabase config

---

## 📝 NEW FILES TO CREATE

### **1. CMS Client Library**
**File:** `C:\Users\Buzgrowth\Documents\risivo-website\src\lib\supabase-cms.ts`  
**Action:** CREATE NEW FILE  
**Lines:** 134 lines  
**Purpose:** Supabase client for CMS (separate from CRM)

I'll provide this file content below.

---

### **2. Public CMS API Routes**
**File:** `C:\Users\Buzgrowth\Documents\risivo-website\src\routes\cms.ts`  
**Action:** CREATE NEW FILE  
**Lines:** 87 lines  
**Purpose:** Public API endpoints for CMS (read-only)

I'll provide this file content below.

---

### **3. Admin CMS API Routes**
**File:** `C:\Users\Buzgrowth\Documents\risivo-website\src\routes\cms-admin.ts`  
**Action:** CREATE NEW FILE  
**Lines:** 321 lines  
**Purpose:** Admin API endpoints for CMS (create, update, delete)

I'll provide this file content below.

---

## 🗄️ DATABASE MIGRATION (Already ran in Supabase)

**File:** `C:\Users\Buzgrowth\Documents\risivo-website\supabase\migrations\001_cms_schema.sql`  
**Status:** ✅ Already executed in Supabase  
**Action:** No action needed (already ran this in Supabase SQL Editor)

---

## 📦 QUICK DEPLOYMENT CHECKLIST

After copying the 3 new files:

1. **Install dependencies:**
   ```bash
   cd C:\Users\Buzgrowth\Documents\risivo-website
   npm install
   ```

2. **Configure Cloudflare variables:**
   - Go to Cloudflare dashboard
   - Add `SUPABASE_URL` and `SUPABASE_ANON_KEY`

3. **Build & Deploy:**
   ```bash
   npm run build
   npx wrangler pages deploy dist --project-name risivo-staging --branch staging --commit-dirty=true
   ```

4. **Test:**
   - `https://risivo-staging.pages.dev/api/cms/health`
   - `https://risivo-staging.pages.dev/api/cms/translations`

---

Ready to see the 3 file contents? Say **"YES"** and I'll provide them one by one for easy copying! 🚀
