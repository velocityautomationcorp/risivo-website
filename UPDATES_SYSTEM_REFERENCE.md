# Risivo Updates System - Technical Reference

## Overview
This document covers the complete implementation of the Updates system for both **Waitlist Users** and **Investor Users**.

---

## Database Schema

### Required Tables

#### `project_updates` (Waitlist Updates)
```sql
-- Existing columns
id UUID PRIMARY KEY
title TEXT NOT NULL
slug TEXT NOT NULL
excerpt TEXT
content TEXT
category TEXT -- Stores UUID reference to waitlist_categories
author_name TEXT DEFAULT 'Risivo Team'
featured_image_url TEXT
media_type TEXT -- 'video' for YouTube links
media_url TEXT -- YouTube URL
gallery_images JSONB -- Array of image URLs
status TEXT DEFAULT 'draft' -- 'draft' | 'published'
is_featured BOOLEAN
views_count INTEGER DEFAULT 0
likes_count INTEGER DEFAULT 0
dislikes_count INTEGER DEFAULT 0
shares_count INTEGER DEFAULT 0
comments_count INTEGER DEFAULT 0
published_at TIMESTAMPTZ
created_at TIMESTAMPTZ DEFAULT NOW()
updated_at TIMESTAMPTZ
```

#### `investor_updates` (Investor Updates)
```sql
-- Required columns
id UUID PRIMARY KEY
title VARCHAR NOT NULL
slug VARCHAR NOT NULL
content TEXT NOT NULL
excerpt TEXT
featured_image_url TEXT
video_url TEXT
gallery_images JSONB
author_name TEXT DEFAULT 'Risivo Team'
visibility TEXT DEFAULT 'all_investors'
status VARCHAR DEFAULT 'draft'
views_count INTEGER DEFAULT 0
likes_count INTEGER DEFAULT 0
dislikes_count INTEGER DEFAULT 0
category_id UUID REFERENCES investor_categories(id)
published_at TIMESTAMPTZ
created_at TIMESTAMPTZ DEFAULT NOW()
```

#### `waitlist_categories`
```sql
id UUID PRIMARY KEY
name TEXT NOT NULL
slug TEXT
icon TEXT DEFAULT '📰'
color TEXT DEFAULT '#667eea'
description TEXT
sort_order INTEGER DEFAULT 0
is_active BOOLEAN DEFAULT true
```

#### `investor_categories`
```sql
id UUID PRIMARY KEY
name TEXT NOT NULL
slug TEXT
icon TEXT DEFAULT '📌'
color TEXT DEFAULT '#667eea'
description TEXT
sort_order INTEGER DEFAULT 0
is_active BOOLEAN DEFAULT true
```

### SQL to Add Missing Columns
```sql
-- Add to investor_updates if missing
ALTER TABLE investor_updates ADD COLUMN IF NOT EXISTS likes_count INTEGER DEFAULT 0;
ALTER TABLE investor_updates ADD COLUMN IF NOT EXISTS dislikes_count INTEGER DEFAULT 0;
ALTER TABLE investor_updates ADD COLUMN IF NOT EXISTS excerpt TEXT;
ALTER TABLE investor_updates ADD COLUMN IF NOT EXISTS featured_image_url TEXT;
ALTER TABLE investor_updates ADD COLUMN IF NOT EXISTS video_url TEXT;
ALTER TABLE investor_updates ADD COLUMN IF NOT EXISTS author_name TEXT DEFAULT 'Risivo Team';
ALTER TABLE investor_updates ADD COLUMN IF NOT EXISTS visibility TEXT DEFAULT 'all_investors';
ALTER TABLE investor_updates ADD COLUMN IF NOT EXISTS gallery_images JSONB;
```

---

## API Endpoints

### Waitlist Updates API (`/api/updates`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/updates/list` | Get all published updates with category names |
| GET | `/api/updates/:slug` | Get single update by slug |
| POST | `/api/updates/:id/view` | Track view (increments views_count) |
| POST | `/api/updates/:id/like` | Like update (increments likes_count) |
| POST | `/api/updates/:id/dislike` | Dislike update (increments dislikes_count) |
| POST | `/api/updates/:slug/share` | Track share event |

**Response includes:**
- `category_name` - Resolved category name from waitlist_categories
- `category_icon` - Category icon emoji
- `category_color` - Category color hex

### Investor Updates API (`/api/investor`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/investor/updates` | Get all published investor updates |
| POST | `/api/investor/updates/:id/view` | Track view |
| POST | `/api/investor/updates/:id/like` | Like update |
| POST | `/api/investor/updates/:id/dislike` | Dislike update |

**Response includes:**
- `investor_categories` object with `name`, `icon`, `color`

---

## Admin Panel Updates

### Waitlist Updates Admin (`/api/admin/waitlist`)
- File: `src/routes/admin-waitlist.ts`
- Table: `project_updates`
- Category field: `category` (stores UUID, maps to `waitlist_categories.id`)
- Video field: `media_url` + `media_type: 'video'`

### Investor Updates Admin (`/api/admin/investor-updates`)
- File: `src/routes/admin-investor-updates.ts`
- Table: `investor_updates`
- Category field: `category_id` (foreign key to `investor_categories.id`)
- Video field: `video_url`

---

## Frontend Components

### Waitlist Dashboard (`/waitlist/dashboard`)
- Route: Line ~5140 in `src/index.tsx`
- Features:
  - Blog-style update cards with featured image
  - Category badge (resolved from UUID)
  - Views/likes count display
  - Click to open detail modal
  - Detail modal with:
    - Featured image
    - Category, date, author
    - Views, like/dislike buttons
    - Full HTML content
    - YouTube video embed
    - Image gallery with lightbox
  - Keyboard navigation (ESC to close, arrows for gallery)

### Investor Dashboard (`/updates/investor/dashboard`)
- Route: Line ~2807 in `src/index.tsx`
- Features:
  - Update cards with featured image
  - Category from joined `investor_categories` table
  - Click to open detail modal
  - Detail modal with:
    - Featured image
    - Category, date, author
    - Views, like/dislike buttons
    - Full HTML content
    - YouTube video embed
    - Image gallery with lightbox
  - Keyboard navigation

---

## Key Fixes Applied

### 1. Category UUID Resolution (Waitlist)
**Problem:** Category showed UUID instead of name
**Solution:** Backend fetches `waitlist_categories` and maps UUIDs to names
**File:** `src/routes/updates.ts` lines 109-127
**Key:** Case-insensitive UUID matching with `.toLowerCase()`

### 2. Column Name Mismatches (Waitlist)
**Problem:** Code used wrong column names
**Fixes:**
- `category_id` → `category` (project_updates uses TEXT, not UUID FK)
- `video_url` → `media_url` + `media_type`
**File:** `src/routes/admin-waitlist.ts`

### 3. Gallery Images Format
**Problem:** Gallery images showing broken
**Solution:** Handle multiple formats:
- Array of strings: `["url1", "url2"]`
- Array of objects: `[{url: "url1"}]`
- JSON string that needs parsing
**File:** Frontend JavaScript in both dashboards

### 4. View/Like/Dislike Tracking
**Problem:** Stats not updating
**Solution:** 
- Added API endpoints for both waitlist and investor
- Frontend calls `/view` endpoint when opening modal
- Like/dislike buttons call respective endpoints
**Files:** 
- `src/routes/updates.ts` (waitlist)
- `src/routes/investor-auth.ts` (investor)

---

## Supabase Storage

### Bucket: `media` (public)
Used for:
- Featured images
- Gallery images

### Upload Endpoint: `/api/upload`
- `POST /api/upload/image` - Single image upload (max 5MB)
- `POST /api/upload/gallery` - Multiple images (max 10, 5MB each)
- `DELETE /api/upload/image` - Delete image by URL

---

## Deployment Checklist

1. **Pull latest code:**
   ```bash
   git pull origin main
   ```

2. **Build:**
   ```bash
   npm run build
   ```

3. **Deploy:**
   ```bash
   npx wrangler pages deploy dist --project-name=risivo-production
   ```

4. **Verify Supabase:**
   - `media` bucket exists and is public
   - All required columns exist in tables
   - Categories exist in `waitlist_categories` and `investor_categories`

---

## Troubleshooting

### Category shows UUID
- Check if category exists in `waitlist_categories`
- Run: `SELECT * FROM waitlist_categories WHERE id = 'your-uuid';`

### Gallery images not showing
- Check format in database: `SELECT gallery_images FROM project_updates WHERE id = 'x';`
- Should be JSONB array of strings

### Views/likes not updating
- Check browser console for API errors
- Verify columns exist: `views_count`, `likes_count`, `dislikes_count`

### 500 Error on save
- Check all required columns exist
- Check column types match (e.g., `category` is TEXT not UUID FK)

---

## File Reference

| File | Purpose |
|------|---------|
| `src/routes/updates.ts` | Waitlist updates public API |
| `src/routes/admin-waitlist.ts` | Admin CRUD for waitlist updates |
| `src/routes/admin-investor-updates.ts` | Admin CRUD for investor updates |
| `src/routes/investor-auth.ts` | Investor auth + updates API |
| `src/routes/upload.ts` | Image upload handling |
| `src/index.tsx` | All frontend routes/pages |

---

*Last Updated: December 30, 2025*
