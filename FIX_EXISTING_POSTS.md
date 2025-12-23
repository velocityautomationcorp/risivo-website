# 🎬 Fix Video/Image Not Showing on Existing Posts

## 🔍 **Problem Identified**

Your existing post "Welcome to Risivo - Your Early Bird Benefits Explained" was created **BEFORE** the media fields were added to the database.

So it has:
- ❌ `media_type` = `NULL` (should be `'video'`)
- ❌ `media_url` = `NULL` (should be your Wistia URL)

That's why the video doesn't show!

---

## ✅ **Solution: Edit the Post**

### **Option 1: Quick Fix via Admin Dashboard (Recommended)**

1. **Go to Admin Dashboard:**
   ```
   https://risivo.com/updates/admin/dashboard
   ```

2. **Click "Edit" on your "Welcome to Risivo" post**

3. **Scroll down to the "Media Type" section**

4. **Select "Video"** (the radio button)

5. **Paste your Wistia video URL in the "Video URL" field:**
   ```
   https://risivo.wistia.com/medias/pdn4i8fmyo
   ```

6. **Optional: Add a Featured Image URL** (for the thumbnail)
   ```
   https://your-image-url.com/thumbnail.jpg
   ```

7. **Click "Save Update"**

8. **Refresh your detail page** - Video should now appear!

---

### **Option 2: Direct Database Update (If Admin Edit Doesn't Work)**

Run this in Supabase SQL Editor:

```sql
-- Update the specific post
UPDATE project_updates 
SET 
  media_type = 'video',
  media_url = 'https://risivo.wistia.com/medias/pdn4i8fmyo',
  featured_image_url = 'YOUR_THUMBNAIL_URL_HERE'  -- Optional
WHERE slug = 'welcome-to-risivo-your-early-bird-benefits-explained';

-- Verify it worked
SELECT id, title, media_type, media_url, featured_image_url 
FROM project_updates 
WHERE slug = 'welcome-to-risivo-your-early-bird-benefits-explained';
```

**Expected result:**
```
media_type: video
media_url: https://risivo.wistia.com/medias/pdn4i8fmyo
featured_image_url: (your thumbnail URL or NULL)
```

---

## 📋 **For Future Posts**

When creating NEW posts:

1. ✅ Always select a "Media Type" (Image, Video, Gallery, or No Media)
2. ✅ Fill in the corresponding URL field
3. ✅ Optionally add a Featured Image URL for custom thumbnail

The system will then automatically display:
- 🎬 **Videos** - Embedded player (YouTube, Vimeo, Wistia)
- 🖼️ **Images** - Full-width image display
- 🎨 **Galleries** - Grid of images
- 🎯 **Featured Image** - Always shows if provided (overrides auto-thumbnail)

---

## 🎯 **Video URL Formats Supported**

### YouTube:
```
https://www.youtube.com/watch?v=VIDEO_ID
https://youtu.be/VIDEO_ID
```

### Vimeo:
```
https://vimeo.com/VIDEO_ID
```

### Wistia:
```
https://risivo.wistia.com/medias/VIDEO_ID
https://home.wistia.com/medias/VIDEO_ID
```

### Direct Video Files:
```
https://your-domain.com/video.mp4
https://your-domain.com/video.webm
```

---

## 🧪 **Test After Fix**

1. **Edit your post** (Option 1 above)
2. **Save changes**
3. **Visit:** https://risivo.com/updates/view/welcome-to-risivo-your-early-bird-benefits-explained
4. **You should see:**
   - ✅ Wistia video embedded
   - ✅ Video player controls
   - ✅ Thumbnail (if you added featured_image_url)
   - ✅ Likes/Dislikes working
   - ✅ Comments working

---

## 💡 **Why This Happened**

Your post was created during development when the media fields didn't exist yet. The database migration added the columns, but **existing rows have NULL values** by default.

**New posts** will have these fields populated automatically from the form.

**Old posts** need to be edited once to populate these fields.

---

## 🆘 **Still Not Working?**

### Debug Steps:

1. **Check the post data in database:**
   ```sql
   SELECT media_type, media_url, featured_image_url 
   FROM project_updates 
   WHERE slug = 'welcome-to-risivo-your-early-bird-benefits-explained';
   ```
   
   Should show:
   - `media_type`: `video`
   - `media_url`: Your Wistia URL
   - `featured_image_url`: Your thumbnail URL or NULL

2. **Check browser console** (F12)
   - Look for JavaScript errors
   - Check if media_url is being passed to the page

3. **View page source** (Right-click → View Page Source)
   - Search for "article-video" or "iframe"
   - If not found, the rendering logic isn't working

4. **Check Cloudflare logs:**
   ```bash
   npx wrangler pages deployment tail --project-name=risivo-production
   ```

---

## ✨ **Expected Result**

After fixing, your update page will show:

```
┌─────────────────────────────────────┐
│  Welcome to Risivo - Your Early...  │
│  📝 Risivo Team | 📅 Dec 13, 2024   │
├─────────────────────────────────────┤
│                                     │
│   🎬 [WISTIA VIDEO PLAYER]          │
│      ▶️ Play button visible         │
│                                     │
├─────────────────────────────────────┤
│  [Post content with rich text]      │
│                                     │
│  👍 Helpful (0)  👎 Not Helpful (0) │
│                                     │
│  💬 Comments (0)                    │
│  [Comment input box]                │
└─────────────────────────────────────┘
```

Perfect! 🎉
