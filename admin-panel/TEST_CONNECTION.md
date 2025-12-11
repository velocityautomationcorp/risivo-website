# Admin Panel Connection Diagnostic

## ✅ Backend API Status (All Working)

```
✅ https://risivo-staging.pages.dev/api/cms/health
✅ https://risivo-staging.pages.dev/api/cms/translations  
✅ https://risivo-staging.pages.dev/api/cms/pages
✅ https://risivo-staging.pages.dev/api/cms/admin/pages
✅ https://risivo-staging.pages.dev/api/cms/admin/translations
```

## 🔍 Troubleshooting "Failed to Fetch" Error

### Step 1: Check .env File

Verify your `.env` file at:
```
C:\Users\Buzgrowth\Documents\risivo-website\admin-panel\.env
```

It should contain:
```env
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here

# API Configuration
VITE_API_BASE_URL=https://risivo-staging.pages.dev/api/cms
```

### Step 2: Check Browser Console

1. Open your admin panel at `http://localhost:3001`
2. Open Browser DevTools (F12)
3. Go to **Console** tab
4. Look for errors

**Common errors:**

#### Error: "CORS policy: No 'Access-Control-Allow-Origin'"
**Solution:** We need to add CORS headers to your Cloudflare Worker

#### Error: "Supabase environment variables not found"
**Solution:** Your .env file is missing or not loaded. Restart dev server:
```bash
cd C:\Users\Buzgrowth\Documents\risivo-website\admin-panel
npm run dev
```

#### Error: "Failed to fetch"
**Possible causes:**
- Network issue
- API endpoint is down (but we verified it's working)
- CORS blocking the request

### Step 3: Test API Connection from Browser

1. Open Chrome/Edge browser
2. Go to: `https://risivo-staging.pages.dev/api/cms/health`
3. You should see: `{"success":true,"service":"CMS API",...}`

If this works, then the API is fine. The issue is with the admin panel connection.

### Step 4: Check Network Tab

1. Open admin panel at `http://localhost:3001`
2. Open DevTools (F12) → **Network** tab
3. Try to perform an action (like viewing dashboard)
4. Look for failed requests (red color)
5. Click on failed request
6. Check the **Response** tab

**What to look for:**
- Status Code: 404 = Endpoint not found
- Status Code: 500 = Server error
- Status Code: 0 = CORS or network issue
- Status Code: 403 = Authentication issue

## 🛠️ Quick Fixes

### Fix 1: Add CORS Headers (Most Likely Issue)

Your CMS API needs to allow requests from `localhost:3001`.

I'll need to update your `src/routes/cms-admin.ts` file to add CORS headers.

### Fix 2: Use Proxy (Alternative)

Add to `admin-panel/vite.config.ts`:

```typescript
export default defineConfig({
  // ... existing config
  server: {
    port: 3001,
    proxy: {
      '/api': {
        target: 'https://risivo-staging.pages.dev',
        changeOrigin: true,
      },
    },
  },
})
```

Then change `.env`:
```env
VITE_API_BASE_URL=/api/cms
```

This will proxy all `/api` requests through your Vite dev server, avoiding CORS.

## 📝 Next Steps

**Please provide:**

1. **Screenshot of Browser Console** (F12 → Console tab) when you see the error
2. **Screenshot of Network Tab** (F12 → Network tab) showing failed requests
3. **Contents of your .env file** (hide the actual Supabase keys, just show the structure)

Then I can provide the exact fix for your specific issue!

## 🎯 Most Likely Solution

Based on symptoms, I believe the issue is **CORS**. 

**Quick Test:**
1. Open `https://risivo-staging.pages.dev/api/cms/admin/pages` in your browser
2. If it works in browser but not in admin panel, it's CORS
3. I'll add CORS headers to fix it

Let me know what you see in the console!
