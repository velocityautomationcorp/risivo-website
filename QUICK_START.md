# 🚀 ADMIN PANEL - QUICK START GUIDE

**Package Ready:** ✅ `risivo-admin-panel-complete.zip` (31 KB, 59 files)

---

## ⚡ **3-STEP INSTALLATION (10 MINUTES)**

### **STEP 1: Get the ZIP File**

The ZIP file is committed to your Git repository. Pull it to your local machine:

```bash
cd C:\Users\Buzgrowth\Documents\risivo-website
git pull origin staging
```

**Result:** You'll have `risivo-admin-panel-complete.zip` in your project root.

---

### **STEP 2: Extract & Setup**

```bash
# Extract the ZIP (creates admin-panel/ folder)
# On Windows: Right-click → Extract All
# Or use command: tar -xf risivo-admin-panel-complete.zip

cd admin-panel

# Install dependencies
npm install

# Create .env file
copy .env.example .env
# Then edit .env with your Supabase credentials
```

**Your `.env` file:**
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
VITE_API_BASE_URL=https://risivo-staging.pages.dev/api/cms
```

---

### **STEP 3: Run It!**

```bash
npm run dev
```

**Open:** http://localhost:3001  
**Login:** Use your Supabase admin credentials

---

## ✅ **WHAT YOU'LL GET**

- ✅ Professional admin dashboard
- ✅ Pages manager (create, edit, delete, publish)
- ✅ Multi-language support (6 languages)
- ✅ Secure authentication
- ✅ Responsive design
- ✅ Production-ready code

---

## 📊 **PACKAGE CONTENTS**

**59 files total:**
- 8 configuration files
- 4 core files
- 11 UI components
- 6 page components
- 6 utility/hook files
- 1 documentation file
- 23 directories

**Size:** 31 KB compressed, ~200 KB uncompressed (before node_modules)

---

## 🎯 **NEXT ACTIONS**

1. **Pull from Git** - `git pull origin staging`
2. **Extract ZIP** - Right-click → Extract All
3. **Install** - `npm install`
4. **Configure** - Create `.env` with Supabase credentials
5. **Run** - `npm run dev`
6. **Login** - http://localhost:3001

---

## 📖 **DETAILED GUIDES**

For more details, see:
- `ADMIN_PANEL_ZIP_GUIDE.md` - Complete installation guide
- `ADMIN_PANEL_COMPLETE.md` - Full feature documentation
- `admin-panel/README.md` - Technical documentation

---

**Estimated Time:** 10-15 minutes  
**Difficulty:** Easy  
**Status:** ✅ Ready to use

---

🎉 **You're almost there! Just 3 steps away from a fully working admin panel!**
