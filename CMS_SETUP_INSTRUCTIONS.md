# 🚀 CUSTOM CMS SETUP INSTRUCTIONS

## ✅ WHAT'S READY

1. ✅ **Database Schema** - `supabase/migrations/001_cms_schema.sql`
2. ✅ **Architecture Document** - `CMS_ARCHITECTURE.md`
3. ⏳ **API Routes** - Next step
4. ⏳ **Admin Panel** - After API

---

## 📋 STEP 1: RUN SUPABASE MIGRATION

### **Option A: Supabase Dashboard (Recommended)**

1. **Go to** https://supabase.com/dashboard
2. **Select your project:** `risivo-website`
3. **Navigate to:** SQL Editor (left sidebar)
4. **Click:** "New query"
5. **Copy-paste** the complete content from:
   ```
   C:\Users\Buzgrowth\Documents\risivo-website\supabase\migrations\001_cms_schema.sql
   ```
6. **Click:** "Run" (bottom right)
7. **Wait:** ~5-10 seconds
8. **Verify:** Check "Table Editor" - you should see 7 new tables:
   - `cms_user_profiles`
   - `cms_pages`
   - `cms_content_blocks`
   - `cms_media`
   - `cms_translations`
   - `cms_templates`
   - `cms_history`

---

### **Option B: Supabase CLI** (If you have it installed)

```bash
cd C:\Users\Buzgrowth\Documents\risivo-website

# Login to Supabase
supabase login

# Link to your project
supabase link --project-ref YOUR_PROJECT_REF

# Run migration
supabase db push
```

---

## 🧪 STEP 2: VERIFY MIGRATION

### **Check Tables:**

1. Go to **Table Editor** in Supabase Dashboard
2. You should see 7 new tables with `cms_` prefix
3. Click on `cms_translations` - you should see 6 seed rows

### **Check RLS Policies:**

1. Click on any `cms_` table
2. Go to "Policies" tab (top right)
3. You should see multiple policies (e.g., "Published pages are public", "Editors can manage blocks")

---

## 👤 STEP 3: CREATE YOUR FIRST CMS USER

Since you'll need admin access, let's create your profile:

1. **Go to:** Supabase Dashboard → Authentication → Users
2. **Find your user account** (the one you use for login)
3. **Copy your User ID** (UUID format)

4. **Go to:** SQL Editor
5. **Run this query** (replace `YOUR_USER_ID` with your actual UUID):

```sql
INSERT INTO cms_user_profiles (id, role, display_name)
VALUES (
  'YOUR_USER_ID',  -- Replace with your actual user ID
  'admin',
  'Your Name'      -- Replace with your name
);
```

6. **Verify:** Go to Table Editor → `cms_user_profiles` → You should see your profile with role 'admin'

---

## ✅ WHAT YOU'HAVE NOW

After running the migration:

### **Database Tables:**
- ✅ **7 CMS tables** created
- ✅ **RLS policies** protecting data
- ✅ **Indexes** for fast queries
- ✅ **Triggers** for auto-timestamps
- ✅ **Seed translations** for nav/footer

### **Security:**
- ✅ **Row Level Security** enabled
- ✅ **Role-based access** (admin, editor, viewer)
- ✅ **Public read** for published content
- ✅ **Authenticated write** for editors

### **Features Ready:**
- ✅ **Multi-language support** (6 languages)
- ✅ **Flexible content blocks**
- ✅ **Media library**
- ✅ **Version control** (history)
- ✅ **Page templates**

---

## 📊 DATABASE STRUCTURE OVERVIEW

```
cms_pages (Main pages)
    └─── cms_content_blocks (Page content in blocks)
    └─── cms_history (Version control)

cms_media (Media library)

cms_translations (UI translations)

cms_templates (Reusable templates)

cms_user_profiles (User roles & permissions)
```

---

## 🔐 SECURITY MODEL

### **Public Users:**
- ✅ Can read published pages
- ✅ Can read all media
- ✅ Can read translations
- ❌ Cannot write anything

### **Authenticated Users (Editors):**
- ✅ Can read all pages (including drafts)
- ✅ Can create/edit pages
- ✅ Can upload media
- ✅ Can manage translations
- ❌ Cannot delete pages

### **Admins:**
- ✅ Full access to everything
- ✅ Can delete pages
- ✅ Can manage user roles
- ✅ Can manage templates

---

## 🎯 NEXT STEPS

After you've run the migration:

### **Immediate:**
1. ✅ Run the SQL migration
2. ✅ Create your admin profile
3. ✅ Verify tables exist

### **Next (I'll build):**
1. ⏳ CMS API routes (public + admin)
2. ⏳ Admin panel UI
3. ⏳ Page editor with drag-drop blocks
4. ⏳ Media library interface
5. ⏳ Translations manager

---

## 📝 NOTES

### **Supabase Project Details:**

You'll need these for API connection:
- **Project URL:** `https://YOUR_PROJECT.supabase.co`
- **Anon Key:** (Public, safe to expose)
- **Service Role Key:** (Secret, only for server-side)

Find these in: Supabase Dashboard → Project Settings → API

---

## ⚠️ IMPORTANT

**Before running the migration:**
1. ✅ Backup your existing Supabase database (if you have data)
2. ✅ Make sure you're in the correct project
3. ✅ Review the migration SQL to understand what it does

**The migration is SAFE:**
- ✅ Only creates new tables (won't affect existing data)
- ✅ No destructive operations
- ✅ Can be rolled back if needed

---

## 🆘 TROUBLESHOOTING

### **Error: "uuid-ossp extension does not exist"**
**Fix:** Run this first:
```sql
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
```

### **Error: "permission denied for schema public"**
**Fix:** Make sure you're logged in as project owner/admin

### **Error: "relation already exists"**
**Fix:** Tables already exist. You can either:
1. Drop them first (if testing): `DROP TABLE cms_pages CASCADE;`
2. Or skip this migration

---

## ✅ CHECKLIST

Before moving to next phase:
- [ ] Migration SQL executed successfully
- [ ] All 7 tables visible in Table Editor
- [ ] RLS policies showing up
- [ ] Your admin profile created
- [ ] 6 seed translations exist in `cms_translations`

**Once complete, tell me and I'll build the API layer!** 🚀
