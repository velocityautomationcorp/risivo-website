# 🚀 CMS API - DEPLOYMENT GUIDE

## ✅ WHAT'S COMPLETE

### **Phase 1: Database** ✅
- ✅ 7 Supabase tables created
- ✅ RLS policies configured
- ✅ Admin profile created

### **Phase 2: API Layer** ✅
- ✅ Supabase client (`src/lib/supabase.ts`)
- ✅ Public CMS API (`src/routes/cms.ts`)
- ✅ Admin CMS API (`src/routes/cms-admin.ts`)
- ✅ Routes integrated into main app

---

## 📦 FILES CREATED (Copy These)

### **1. NEW: `src/lib/supabase.ts`**
- Supabase client configuration
- TypeScript types for CMS
- Helper functions

### **2. NEW: `src/routes/cms.ts`**
- Public API endpoints
- GET pages, translations

### **3. NEW: `src/routes/cms-admin.ts`**
- Admin API endpoints
- Full CRUD for pages, blocks, media, translations

### **4. UPDATED: `src/index.tsx`**
- Added CMS route imports
- Mounted `/api/cms` and `/api/cms/admin` routes

### **5. UPDATED: `package.json`**
- Added `@supabase/supabase-js` dependency

### **6. NEW: `.env.example`**
- Environment variables template

---

## 🔧 DEPLOYMENT STEPS

### **Step 1: Install Supabase Package**

```bash
cd C:\Users\Buzgrowth\Documents\risivo-website

npm install @supabase/supabase-js
```

---

### **Step 2: Configure Environment Variables**

You need to add Supabase credentials to **Cloudflare Pages**:

1. **Go to:** Cloudflare Dashboard → Workers & Pages → risivo-staging
2. **Click:** Settings → Environment variables
3. **Add these variables:**

```
SUPABASE_URL=https://YOUR_PROJECT.supabase.co
SUPABASE_ANON_KEY=your_anon_key_here
```

**To find your Supabase credentials:**
1. Go to Supabase Dashboard → Project Settings → API
2. Copy "Project URL" → Use as `SUPABASE_URL`
3. Copy "anon public" key → Use as `SUPABASE_ANON_KEY`

---

### **Step 3: Deploy**

```bash
cd C:\Users\Buzgrowth\Documents\risivo-website

# Pull latest changes
git pull origin staging

# Install dependencies
npm install

# Build
npm run build

# Deploy to Cloudflare
npx wrangler pages deploy dist --project-name risivo-staging --branch staging --commit-dirty=true
```

---

## 🧪 TEST THE API

After deployment, test these endpoints:

### **Public Endpoints** (No auth required)

1. **Health Check:**
```
GET https://risivo-staging.pages.dev/api/cms/health
```

Expected response:
```json
{
  "success": true,
  "service": "CMS API",
  "timestamp": "2025-12-11T..."
}
```

2. **Get Translations:**
```
GET https://risivo-staging.pages.dev/api/cms/translations?category=navigation
```

Expected response:
```json
{
  "success": true,
  "data": {
    "nav.features": "Features",
    "nav.pricing": "Pricing",
    ...
  }
}
```

3. **List Published Pages:**
```
GET https://risivo-staging.pages.dev/api/cms/pages
```

Expected response:
```json
{
  "success": true,
  "data": []
}
```
(Empty array for now - we haven't created any pages yet)

---

### **Admin Endpoints** (Will require auth later)

These work but currently have no authentication. We'll add Supabase Auth in the admin panel.

```
GET    /api/cms/admin/pages              - List all pages
POST   /api/cms/admin/pages              - Create page
PUT    /api/cms/admin/pages/:id          - Update page
DELETE /api/cms/admin/pages/:id          - Delete page
POST   /api/cms/admin/pages/:id/publish  - Publish page
```

---

## 📊 API ENDPOINTS OVERVIEW

### **Public API** (`/api/cms/`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Health check |
| GET | `/pages` | List published pages |
| GET | `/pages/:slug?lang=en` | Get page by slug |
| GET | `/translations?category=nav` | Get translations |

### **Admin API** (`/api/cms/admin/`)

#### **Pages:**
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/pages` | List all pages |
| GET | `/pages/:id` | Get page with blocks |
| POST | `/pages` | Create new page |
| PUT | `/pages/:id` | Update page |
| DELETE | `/pages/:id` | Delete page |
| POST | `/pages/:id/publish` | Publish page |

#### **Content Blocks:**
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/blocks` | Create block |
| PUT | `/blocks/:id` | Update block |
| DELETE | `/blocks/:id` | Delete block |
| PUT | `/blocks/reorder` | Reorder blocks |

#### **Media:**
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/media?folder=root` | List media |
| DELETE | `/media/:id` | Delete media |

#### **Translations:**
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/translations` | List translations |
| PUT | `/translations/:key` | Update translation |

---

## 🔐 SECURITY NOTE

**Current State:**
- ✅ Database has RLS (Row Level Security)
- ⚠️ API endpoints are open (no middleware auth yet)

**Next Step:**
- When we build the admin panel, we'll add Supabase Auth middleware
- Only authenticated users with correct roles will access admin endpoints

---

## ✅ VERIFICATION CHECKLIST

Before moving to admin panel:

- [ ] `npm install` completed successfully
- [ ] Environment variables added to Cloudflare
- [ ] Build successful (`npm run build`)
- [ ] Deployed to Cloudflare Pages
- [ ] `/api/cms/health` returns success
- [ ] `/api/cms/translations` returns 6 seed translations
- [ ] `/api/cms/pages` returns empty array (expected)

---

## 🎯 WHAT'S NEXT

**Now that the API is ready, I'll build:**

### **Phase 3: Admin Panel** (Next)
- Login page with Supabase Auth
- Dashboard overview
- Page manager (list, create, edit)
- Block editor (drag-and-drop)
- Media library UI
- Translations manager

**This will be a simple, functional admin interface accessible at:**
```
https://risivo-staging.pages.dev/admin/cms
```

---

## 📝 EXAMPLE: CREATE A PAGE VIA API

Once deployed, you can create pages using the API:

```javascript
// POST /api/cms/admin/pages
{
  "slug": "test-page",
  "template": "default",
  "status": "draft",
  "meta_title": {
    "en": "Test Page",
    "es": "Página de Prueba"
  },
  "meta_description": {
    "en": "This is a test page",
    "es": "Esta es una página de prueba"
  }
}
```

Then add content blocks:

```javascript
// POST /api/cms/admin/blocks
{
  "page_id": "page-uuid-here",
  "block_type": "hero",
  "position": 0,
  "content": {
    "en": {
      "title": "Welcome",
      "subtitle": "To our CMS"
    },
    "es": {
      "title": "Bienvenido",
      "subtitle": "A nuestro CMS"
    }
  }
}
```

---

**Ready to deploy the API?** After this, we'll build the admin panel! 🚀
