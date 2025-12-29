# 🏗️ CUSTOM CMS ARCHITECTURE WITH SUPABASE

## 🎯 DESIGN GOALS

1. ✅ **Multi-language support** - 6 languages (EN, ES, FR, DE, IT, PT)
2. ✅ **Flexible content blocks** - Reusable components
3. ✅ **Page builder** - Dynamic page creation
4. ✅ **Media library** - Images, videos, documents
5. ✅ **SEO friendly** - Meta tags, slugs, sitemaps
6. ✅ **Version control** - Content history
7. ✅ **User permissions** - Role-based access
8. ✅ **Fast API** - Cached responses

---

## 📊 DATABASE SCHEMA

### **1. Pages Table** (`cms_pages`)
```sql
CREATE TABLE cms_pages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT NOT NULL UNIQUE,
  template TEXT NOT NULL DEFAULT 'default',
  status TEXT NOT NULL DEFAULT 'draft', -- draft, published, archived
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),
  published_at TIMESTAMPTZ,
  
  -- SEO
  meta_title JSONB, -- { "en": "Title", "es": "Título", ... }
  meta_description JSONB,
  meta_keywords JSONB,
  
  -- Settings
  layout TEXT DEFAULT 'default',
  include_header BOOLEAN DEFAULT true,
  include_footer BOOLEAN DEFAULT true
);
```

**Purpose:** Store page metadata and structure

---

### **2. Content Blocks Table** (`cms_content_blocks`)
```sql
CREATE TABLE cms_content_blocks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  page_id UUID REFERENCES cms_pages(id) ON DELETE CASCADE,
  block_type TEXT NOT NULL, -- hero, features, pricing, text, image, etc.
  position INTEGER NOT NULL,
  content JSONB NOT NULL, -- Multi-language content
  settings JSONB, -- Block-specific settings
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_content_blocks_page ON cms_content_blocks(page_id);
CREATE INDEX idx_content_blocks_position ON cms_content_blocks(page_id, position);
```

**Purpose:** Store flexible content blocks for each page

**Content structure example:**
```json
{
  "en": {
    "title": "Transform Your Marketing",
    "description": "Powerful automation made simple",
    "cta_text": "Start Free Trial"
  },
  "es": {
    "title": "Transforma tu Marketing",
    "description": "Automatización potente hecha simple",
    "cta_text": "Comenzar Prueba Gratis"
  }
}
```

---

### **3. Media Library Table** (`cms_media`)
```sql
CREATE TABLE cms_media (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  filename TEXT NOT NULL,
  original_filename TEXT NOT NULL,
  file_type TEXT NOT NULL, -- image, video, document
  mime_type TEXT NOT NULL,
  size_bytes INTEGER NOT NULL,
  url TEXT NOT NULL,
  storage_path TEXT NOT NULL,
  
  -- Image-specific
  width INTEGER,
  height INTEGER,
  alt_text JSONB, -- Multi-language alt text
  
  -- Organization
  folder TEXT,
  tags TEXT[],
  
  -- Metadata
  uploaded_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Usage tracking
  usage_count INTEGER DEFAULT 0
);

CREATE INDEX idx_media_type ON cms_media(file_type);
CREATE INDEX idx_media_folder ON cms_media(folder);
```

**Purpose:** Central media management with multi-language alt text

---

### **4. Translations Table** (`cms_translations`)
```sql
CREATE TABLE cms_translations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  key TEXT NOT NULL UNIQUE, -- e.g., "nav.features", "footer.copyright"
  translations JSONB NOT NULL, -- { "en": "Features", "es": "Características", ... }
  category TEXT, -- navigation, footer, forms, etc.
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_translations_category ON cms_translations(category);
```

**Purpose:** Store UI translations (nav, footer, buttons, etc.)

**Example:**
```json
{
  "key": "nav.features",
  "translations": {
    "en": "Features",
    "es": "Características",
    "fr": "Fonctionnalités",
    "de": "Funktionen",
    "it": "Caratteristiche",
    "pt": "Recursos"
  },
  "category": "navigation"
}
```

---

### **5. Content Templates Table** (`cms_templates`)
```sql
CREATE TABLE cms_templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  structure JSONB NOT NULL, -- Predefined block structure
  preview_image TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Purpose:** Reusable page templates (e.g., "Product Page", "Blog Post", "Landing Page")

---

### **6. Content History Table** (`cms_history`)
```sql
CREATE TABLE cms_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  page_id UUID REFERENCES cms_pages(id) ON DELETE CASCADE,
  content_snapshot JSONB NOT NULL, -- Full page content at this version
  changed_by UUID REFERENCES auth.users(id),
  change_note TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_history_page ON cms_history(page_id, created_at DESC);
```

**Purpose:** Version control and rollback capability

---

### **7. Users & Roles** (using Supabase Auth)
```sql
-- Custom user metadata in profiles table
CREATE TABLE cms_user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  role TEXT NOT NULL DEFAULT 'editor', -- admin, editor, viewer
  permissions JSONB DEFAULT '{}',
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Roles:**
- **Admin:** Full access
- **Editor:** Create, edit, publish content
- **Viewer:** Read-only access

---

## 🔐 ROW LEVEL SECURITY (RLS) POLICIES

### **Pages - Read Access**
```sql
CREATE POLICY "Pages are viewable by everyone (published only)"
ON cms_pages FOR SELECT
USING (status = 'published');

CREATE POLICY "Authenticated users can view all pages"
ON cms_pages FOR SELECT
TO authenticated
USING (true);
```

### **Pages - Write Access**
```sql
CREATE POLICY "Only editors and admins can insert pages"
ON cms_pages FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM cms_user_profiles
    WHERE id = auth.uid()
    AND role IN ('editor', 'admin')
  )
);

CREATE POLICY "Only editors and admins can update pages"
ON cms_pages FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM cms_user_profiles
    WHERE id = auth.uid()
    AND role IN ('editor', 'admin')
  )
);
```

### **Media - Public Read, Authenticated Write**
```sql
CREATE POLICY "Media is viewable by everyone"
ON cms_media FOR SELECT
USING (true);

CREATE POLICY "Authenticated users can upload media"
ON cms_media FOR INSERT
TO authenticated
WITH CHECK (true);
```

---

## 🔄 API STRUCTURE

### **Public API Endpoints** (for website)
```typescript
GET  /api/cms/pages/:slug?lang=en           // Get page content
GET  /api/cms/translations?category=nav     // Get translations
GET  /api/cms/media/:id                     // Get media file
```

### **Admin API Endpoints** (for CMS dashboard)
```typescript
// Pages
GET    /api/cms/admin/pages                 // List all pages
GET    /api/cms/admin/pages/:id             // Get page details
POST   /api/cms/admin/pages                 // Create page
PUT    /api/cms/admin/pages/:id             // Update page
DELETE /api/cms/admin/pages/:id             // Delete page
POST   /api/cms/admin/pages/:id/publish     // Publish page

// Content Blocks
POST   /api/cms/admin/blocks                // Create block
PUT    /api/cms/admin/blocks/:id            // Update block
DELETE /api/cms/admin/blocks/:id            // Delete block
PUT    /api/cms/admin/blocks/reorder        // Reorder blocks

// Media
GET    /api/cms/admin/media                 // List media
POST   /api/cms/admin/media/upload          // Upload file
DELETE /api/cms/admin/media/:id             // Delete file

// Translations
GET    /api/cms/admin/translations          // List translations
PUT    /api/cms/admin/translations/:key     // Update translation
```

---

## 🎨 CONTENT BLOCK TYPES

### **Available Block Types:**

1. **Hero** - Large header with image/video background
2. **Features** - Feature grid (3, 4, or 6 columns)
3. **Pricing** - Pricing cards
4. **Text** - Rich text editor content
5. **Image** - Single image with caption
6. **Gallery** - Image gallery/carousel
7. **Video** - Embedded video (YouTube, Vimeo, self-hosted)
8. **CTA** - Call-to-action section
9. **Testimonials** - Customer testimonials
10. **FAQ** - Accordion-style FAQ
11. **Form** - Contact/signup forms
12. **Code** - Code snippets
13. **HTML** - Custom HTML block

Each block has multi-language content support.

---

## 💾 CACHING STRATEGY

### **Redis Cache Layers:**
```typescript
// 1. Page cache (30 minutes)
cache.set(`page:${slug}:${lang}`, pageContent, 1800)

// 2. Translations cache (1 hour)
cache.set(`translations:${category}:${lang}`, translations, 3600)

// 3. Media cache (24 hours)
cache.set(`media:${id}`, mediaUrl, 86400)
```

**Cache invalidation:**
- Clear page cache on publish/update
- Clear translations cache on update
- Media cache persists (long TTL)

---

## 📱 ADMIN PANEL STRUCTURE

```
/admin/cms/
  ├── /pages           ← List and manage pages
  ├── /pages/new       ← Create new page
  ├── /pages/:id/edit  ← Edit page (drag-drop blocks)
  ├── /media           ← Media library
  ├── /translations    ← Manage translations
  ├── /templates       ← Page templates
  └── /settings        ← CMS settings
```

---

## 🚀 IMPLEMENTATION PLAN

### **Phase 1: Database Setup** (30 min)
- ✅ Create tables in Supabase
- ✅ Set up RLS policies
- ✅ Add indexes for performance

### **Phase 2: API Layer** (1 hour)
- ✅ Public API for pages
- ✅ Admin API for CRUD
- ✅ Supabase client integration

### **Phase 3: Admin UI** (2 hours)
- ✅ Login page
- ✅ Pages list view
- ✅ Page editor (drag-drop blocks)
- ✅ Media library
- ✅ Translations manager

### **Phase 4: Frontend Integration** (1 hour)
- ✅ Dynamic page loading
- ✅ Multi-language routing
- ✅ SEO meta tags
- ✅ Cache implementation

---

**Total estimated time: 4-5 hours**

---

## ✅ READY TO START?

I'll now create:
1. **Supabase migration SQL** - All tables and policies
2. **API endpoints** - Public + Admin
3. **Admin panel UI** - Content management interface
4. **Frontend integration** - Dynamic pages

**Shall I proceed with Step 1: Creating the database schema?** 🚀
