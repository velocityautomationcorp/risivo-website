# 📂 Category Management & Wistia Video Support Guide

## ✅ What's Been Completed

### 1. **Wistia Video Support** 🎥
Wistia videos are now fully supported alongside YouTube and Vimeo!

#### Supported Video Platforms:
- ✅ **YouTube** (youtube.com/watch?v=... or youtu.be/...)
- ✅ **Vimeo** (vimeo.com/...)
- ✅ **Wistia** (wistia.com/medias/... or wi.st/...)
- ✅ **Direct Video URLs** (.mp4, .webm, .ogg)

#### How to Use Wistia Videos:
1. Go to your Wistia account
2. Open the video you want to embed
3. Copy the video URL (e.g., `https://fast.wistia.com/embed/medias/xyz123abc`)
4. Paste it into the "Video URL" field when creating/editing an update
5. The video will automatically embed with responsive design

---

### 2. **Dynamic Category Management System** 📂

Categories are no longer hardcoded! You can now add, edit, and delete categories from the admin panel.

#### Features:
✅ **Add New Categories** - Create unlimited categories  
✅ **Edit Categories** - Update name, description, color, and status  
✅ **Delete Categories** - Remove unused categories (protected if in use)  
✅ **Color Coding** - Assign unique colors to each category  
✅ **Status Toggle** - Enable/disable categories (only active ones show in forms)  
✅ **Reordering** - Control the display order of categories  
✅ **Delete Protection** - Prevents deletion of categories being used by updates  

#### Database Structure:
```sql
Table: update_categories
Columns:
- id (UUID, Primary Key)
- name (VARCHAR 100, Unique)
- slug (VARCHAR 100, Unique)
- description (TEXT)
- color (VARCHAR 7, Default: #667eea)
- icon (VARCHAR 50)
- display_order (INT, Default: 0)
- is_active (BOOLEAN, Default: true)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

---

## 🚀 How to Deploy

### Step 1: Run Database Migration
**IMPORTANT:** Before deploying, run this SQL script in your Supabase dashboard!

1. Go to https://supabase.com/dashboard/project/sldpdgdkrakfzwtroglx
2. Click "SQL Editor" in the left sidebar
3. Click "New Query"
4. Copy and paste the entire content of `DATABASE_CATEGORIES.sql`
5. Click "Run" to execute the script

This will:
- Create the `update_categories` table
- Add default categories (Feature, Improvement, Bug Fix, Announcement, General)
- Set up proper indexes and triggers

### Step 2: Deploy to Cloudflare
```bash
cd C:\Users\Buzgrowth\Documents\risivo-website
git pull origin genspark_ai_developer
npm run deploy:production
```

### Step 3: Verify Deployment
After deployment, test the following:

1. **Category Management**:
   - Visit: https://risivo.com/updates/admin/dashboard
   - Click "📂 Manage Categories" button
   - Verify you can see the default categories
   - Try adding a new category

2. **Wistia Video**:
   - Visit: https://risivo.com/updates/admin/create
   - Select "Video" media type
   - Paste a Wistia URL
   - Verify the video preview loads

---

## 📖 Usage Guide

### Managing Categories

#### Access Category Management:
**Option 1:** From Admin Dashboard  
→ Go to https://risivo.com/updates/admin/dashboard  
→ Click "📂 Manage Categories" button

**Option 2:** Direct Link  
→ https://risivo.com/updates/admin/categories

#### Add a New Category:
1. Click "➕ Add Category" button
2. Fill in the form:
   - **Name** (required): e.g., "New Feature"
   - **Description** (optional): Brief description of the category
   - **Color**: Click color picker to choose a color
   - **Status**: Active or Inactive
3. Click "Save"

#### Edit a Category:
1. Find the category in the list
2. Click "✏️ Edit" button
3. Update any fields
4. Click "Save"

#### Delete a Category:
1. Find the category in the list
2. Click "🗑️ Delete" button
3. Confirm deletion

**Note:** You cannot delete a category that's currently being used by any updates. You'll need to reassign those updates first.

#### Category Colors:
Each category can have a unique color. The color picker lets you choose any hex color (e.g., #667eea).

Default colors:
- Feature: Green (#10b981)
- Improvement: Blue (#3b82f6)
- Bug Fix: Red (#ef4444)
- Announcement: Orange (#f59e0b)
- General: Purple (#8b5cf6)

---

### Using Videos in Updates

#### Supported Platforms:
1. **YouTube**
   - Example: `https://www.youtube.com/watch?v=dQw4w9WgXcQ`
   - Short form: `https://youtu.be/dQw4w9WgXcQ`

2. **Vimeo**
   - Example: `https://vimeo.com/123456789`

3. **Wistia** (NEW!)
   - Example: `https://fast.wistia.com/embed/medias/xyz123abc`
   - Short form: `https://wi.st/xyz123abc`

4. **Direct Video Files**
   - Example: `https://example.com/video.mp4`
   - Supported formats: .mp4, .webm, .ogg

#### How to Add a Video:
1. Create or edit an update
2. In "Media Type", select "📹 Video"
3. Paste the video URL in the "Video URL" field
4. The video will automatically preview
5. Continue filling out the rest of the form
6. Click "Publish Update"

---

## 🔌 API Endpoints

### Category Management API

#### Get All Categories
```bash
GET /api/admin/categories
Headers: Cookie: admin_session=<token>
Response: { success: true, categories: [...] }
```

#### Get Active Categories Only
```bash
GET /api/admin/categories/active
Response: { success: true, categories: [...] }
```

#### Create Category
```bash
POST /api/admin/categories
Headers: Cookie: admin_session=<token>
Body: {
  "name": "New Category",
  "description": "Description",
  "color": "#667eea",
  "icon": "🎉"
}
Response: { success: true, category: {...}, message: "..." }
```

#### Update Category
```bash
PUT /api/admin/categories/:id
Headers: Cookie: admin_session=<token>
Body: {
  "name": "Updated Name",
  "description": "Updated description",
  "color": "#10b981",
  "is_active": true
}
Response: { success: true, category: {...}, message: "..." }
```

#### Delete Category
```bash
DELETE /api/admin/categories/:id
Headers: Cookie: admin_session=<token>
Response: { success: true, message: "Category deleted successfully" }
Error (if in use): { error: "Cannot delete...", in_use: true }
```

#### Reorder Categories
```bash
POST /api/admin/categories/reorder
Headers: Cookie: admin_session=<token>
Body: {
  "order": [
    { "id": "uuid1", "display_order": 1 },
    { "id": "uuid2", "display_order": 2 }
  ]
}
Response: { success: true, message: "..." }
```

---

## 📋 New Routes

### Admin Pages:
- `/updates/admin/categories` - Category Management UI (Protected)

### API Routes:
- `/api/admin/categories` - GET all categories, POST new category
- `/api/admin/categories/active` - GET only active categories
- `/api/admin/categories/:id` - PUT (update), DELETE
- `/api/admin/categories/reorder` - POST to reorder

---

## 🎨 Features Overview

### Category Management Page Features:
- ✅ Grid layout of all categories
- ✅ Color-coded category badges
- ✅ Status indicators (Active/Inactive)
- ✅ Quick actions (Edit, Delete)
- ✅ Modal-based create/edit form
- ✅ Color picker for custom colors
- ✅ Status toggle (Active/Inactive)
- ✅ Delete protection for categories in use
- ✅ Mobile-responsive design
- ✅ Empty state messaging

### Admin Update Form Enhancements:
- ✅ Dynamic category dropdown (pulls from database)
- ✅ "Manage Categories" link in category field
- ✅ Wistia video support with live preview
- ✅ Video preview works for all platforms
- ✅ Responsive video embeds

### Admin Dashboard Improvements:
- ✅ "Manage Categories" quick action button
- ✅ Styled with green gradient to distinguish from "Create Update"

---

## 🔧 Troubleshooting

### Categories Not Showing in Dropdown:
1. Verify database migration ran successfully
2. Check that categories exist in `update_categories` table
3. Ensure categories have `is_active = true`
4. Clear browser cache and refresh

### Wistia Video Not Previewing:
1. Verify the URL is correct (wistia.com/medias/... or wi.st/...)
2. Check browser console for errors
3. Ensure internet connection is stable
4. Try a different Wistia video URL

### Cannot Delete Category:
This is intentional! Categories that are being used by updates cannot be deleted. To delete:
1. Edit all updates using that category
2. Change their category to something else
3. Then delete the category

### Category Management Page Returns 401:
1. Ensure you're logged in as admin
2. Check admin session hasn't expired
3. Try logging out and back in

---

## 📦 Files Changed

### New Files:
- `DATABASE_CATEGORIES.sql` - Database migration script
- `src/routes/admin-categories.ts` - Category CRUD API routes
- `src/pages/admin-categories.tsx` - Category management UI
- `CATEGORY_AND_WISTIA_GUIDE.md` - This guide!

### Modified Files:
- `src/index.tsx` - Registered category routes, fetch categories for forms
- `src/pages/admin-update-form.tsx` - Wistia support + dynamic categories
- `src/pages/admin-dashboard.tsx` - Added "Manage Categories" button

---

## ✨ What's Next?

The system is now fully functional! Here are some optional enhancements you could consider:

### Potential Future Features:
- 📊 Category analytics (how many updates per category)
- 🎨 Category icons (beyond just colors)
- 🔍 Filter updates by category on dashboard
- 📱 Category-specific notification settings
- 🌐 Public-facing category filtering on user dashboard

---

## 🆘 Support

If you encounter any issues:
1. Check the browser console for errors (F12)
2. Verify database migration was run
3. Ensure you're logged in as admin
4. Try clearing browser cache
5. Check Supabase dashboard for data

---

**System is ready to use! 🎉**

All changes have been committed and pushed to `genspark_ai_developer` branch.
