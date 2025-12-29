# 📦 ADMIN PANEL ZIP PACKAGE - INSTALLATION GUIDE

**Package:** `risivo-admin-panel-complete.zip` (31 KB)  
**Contains:** 60 files (30 source files + directories)  
**Status:** ✅ Ready to extract and use

---

## 📥 **STEP 1: GET THE ZIP FILE**

The ZIP file is located at:
```
/home/user/webapp/risivo-admin-panel-complete.zip
```

**To download it to your local machine:**

Since this is in a sandbox environment, you'll need to:

### **Option A: Via Git (Recommended)**
```bash
# In sandbox (already done)
cd /home/user/webapp
git add risivo-admin-panel-complete.zip
git commit -m "Add admin panel ZIP package"
git push origin staging

# On your local machine
cd C:\Users\Buzgrowth\Documents\risivo-website
git pull origin staging
```

### **Option B: Via File Download**
If you have access to download the file directly from the sandbox, download:
`risivo-admin-panel-complete.zip`

---

## 📂 **STEP 2: EXTRACT THE ZIP**

Once you have the ZIP file on your local machine:

```bash
# Navigate to your project folder
cd C:\Users\Buzgrowth\Documents\risivo-website

# Extract the ZIP file
# This will create the admin-panel/ folder
unzip risivo-admin-panel-complete.zip

# Or on Windows, right-click → Extract All
```

**Result:** You'll have a complete `admin-panel/` folder with this structure:
```
admin-panel/
├── src/
│   ├── components/
│   │   ├── auth/           (2 files)
│   │   ├── layout/         (3 files)
│   │   └── ui/             (6 files)
│   ├── pages/              (6 files)
│   ├── hooks/              (2 files)
│   ├── lib/                (4 files)
│   ├── types/              (1 file)
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── index.html
├── package.json
├── vite.config.ts
├── tsconfig.json
├── tailwind.config.js
├── postcss.config.js
├── .env.example
├── .gitignore
└── README.md
```

---

## ⚙️ **STEP 3: INSTALL DEPENDENCIES**

```bash
cd C:\Users\Buzgrowth\Documents\risivo-website\admin-panel

# Install all dependencies
npm install
```

**This will install:**
- React, ReactDOM, React Router
- TypeScript
- Vite (build tool)
- Tailwind CSS
- Supabase client
- React Query
- Zustand
- Headless UI
- Hero Icons
- And more...

**Time:** 2-3 minutes  
**Size:** ~200 MB (node_modules/)

---

## 🔑 **STEP 4: CONFIGURE ENVIRONMENT**

Create `.env` file in the admin-panel folder:

**File:** `C:\Users\Buzgrowth\Documents\risivo-website\admin-panel\.env`

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
VITE_API_BASE_URL=https://risivo-staging.pages.dev/api/cms
```

**Get your credentials:**
1. Go to https://supabase.com/dashboard
2. Select your project
3. Settings → API
4. Copy:
   - **Project URL** → `VITE_SUPABASE_URL`
   - **anon public** key → `VITE_SUPABASE_ANON_KEY`

---

## 🚀 **STEP 5: RUN THE ADMIN PANEL**

```bash
cd C:\Users\Buzgrowth\Documents\risivo-website\admin-panel

npm run dev
```

**Expected output:**
```
  VITE v5.0.12  ready in 423 ms

  ➜  Local:   http://localhost:3001/
  ➜  Network: use --host to expose
  ➜  press h to show help
```

**Open your browser:** http://localhost:3001

---

## 🔐 **STEP 6: LOGIN**

You'll see the login page automatically.

**Credentials:**
- Email: Your Supabase admin email
- Password: Your Supabase password

**After login:** You'll see the dashboard with sidebar navigation.

---

## ✅ **VERIFICATION CHECKLIST**

After completing all steps, verify:

- [ ] ZIP file extracted successfully
- [ ] `admin-panel/` folder exists
- [ ] `node_modules/` folder created after npm install
- [ ] `.env` file created with Supabase credentials
- [ ] Dev server running on port 3001
- [ ] Login page loads at http://localhost:3001
- [ ] Can login with Supabase credentials
- [ ] Dashboard loads after login
- [ ] Sidebar navigation visible
- [ ] Can navigate to Pages, Media, etc.

---

## 🎯 **WHAT'S INCLUDED**

### **Working Features** ✅
1. ✅ Login/Authentication
2. ✅ Dashboard with stats
3. ✅ Pages Manager (list, create, edit, delete)
4. ✅ Page Editor (multi-language meta)
5. ✅ Publish/Unpublish pages
6. ✅ Responsive design
7. ✅ Professional UI

### **Coming Soon** 🔜
1. 🔜 Block Editor (drag-and-drop)
2. 🔜 Media Library (upload images)
3. 🔜 Translations Manager
4. 🔜 Settings page

---

## 📊 **FILE BREAKDOWN**

**Configuration Files (8):**
- package.json, vite.config.ts, tsconfig.json, tailwind.config.js, postcss.config.js, .env.example, .gitignore, index.html

**Core Files (4):**
- src/main.tsx, src/App.tsx, src/index.css, src/types/index.ts

**Components (11):**
- Auth (2): LoginPage, ProtectedRoute
- Layout (3): AppLayout, Sidebar, Header
- UI (6): Button, Input, Card, Badge, Loading, EmptyState

**Pages (6):**
- Dashboard, PagesManager, PageEditor, MediaLibrary, TranslationsManager, Settings

**Lib & Hooks (6):**
- supabase.ts, api.ts, utils.ts, auth-store.ts, useAuth.ts, usePages.ts

**Documentation (1):**
- README.md

**Total: 36 files** (excluding directories)

---

## 🆘 **TROUBLESHOOTING**

### **Issue 1: ZIP extraction fails**
**Solution:** Use a different extraction tool (7-Zip, WinRAR, or built-in Windows)

### **Issue 2: npm install fails**
**Solution:** 
```bash
# Delete package-lock.json if it exists
rm package-lock.json
# Try again
npm install
```

### **Issue 3: "Missing environment variables"**
**Solution:** Make sure `.env` file exists in `admin-panel/` folder with correct values

### **Issue 4: Port 3001 already in use**
**Solution:** 
- Stop other apps using port 3001
- Or edit `vite.config.ts` to use different port (e.g., 3002)

### **Issue 5: Can't login**
**Solution:**
- Verify user exists in Supabase Auth
- Check admin profile exists in `cms_user_profiles` table
- Check browser console for errors

---

## 📞 **NEXT STEPS**

Once the admin panel is running:

1. ✅ **Test creating a page** - Click "New Page"
2. ✅ **Test editing** - Edit meta information
3. ✅ **Test publishing** - Publish a page
4. ✅ **Test multi-language** - Add translations
5. 🔜 **Deploy to production** - Build and deploy

---

## 🎉 **SUCCESS CRITERIA**

You're successful when:
- ✅ Admin panel runs on http://localhost:3001
- ✅ You can login
- ✅ Dashboard shows your stats
- ✅ You can create/edit/publish pages
- ✅ All navigation works

---

**Time to complete:** 10-15 minutes  
**Difficulty:** Easy  
**Prerequisites:** Node.js installed, Supabase credentials ready

**Let's get started!** 🚀
