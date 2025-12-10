# 🚀 Deploy Contact Page to Staging

**Issue:** `/contact` gives 404 on https://risivo-staging.pages.dev  
**Cause:** Latest build hasn't been deployed yet  
**Solution:** Deploy the new build with contact page

---

## ✅ What's Ready

The contact page is built and committed:
- ✅ Build succeeds (99.18 kB)
- ✅ Commit: `3f2221e`
- ✅ Pushed to `staging` branch
- ✅ Contact page at `/contact` route
- ✅ API endpoints working

---

## 🚀 Deploy to Staging Now

### **Option 1: Deploy from Local (Recommended)**

Run these commands on your Windows machine:

```powershell
# 1. Navigate to project
cd C:\Users\Buzgrowth\Documents\risivo-website

# 2. Checkout staging branch
git checkout staging

# 3. Pull latest changes (includes contact page)
git pull origin staging

# 4. Build the project
npm run build

# 5. Deploy to Cloudflare Pages
npx wrangler pages deploy dist --project-name risivo-staging --branch staging
```

---

### **Option 2: Automatic Deployment (If Connected)**

If your GitHub repo is connected to Cloudflare Pages for auto-deployment:

1. **Check Cloudflare Dashboard:**
   - Go to: https://dash.cloudflare.com
   - Navigate to: Pages → risivo-staging
   - Check "Deployments" tab
   
2. **Trigger Deployment:**
   - Should auto-deploy from `staging` branch
   - Or click "Retry deployment"
   - Wait 2-3 minutes

3. **Verify:**
   - Visit: https://risivo-staging.pages.dev/contact
   - Should load the contact page!

---

## 🔍 Verification Steps

After deployment, test these URLs:

### **1. Homepage** ✅
```
https://risivo-staging.pages.dev/
```
Should show the complete homepage (already working)

### **2. Contact Page** 🆕
```
https://risivo-staging.pages.dev/contact
```
Should show:
- Hero section with "Get in Touch"
- Contact form on the right
- Company info on the left
- Navigation + Footer

### **3. API Health Check** ✅
```
https://risivo-staging.pages.dev/api/health
```
Should return JSON with status

### **4. Test Contact Form** 🆕
1. Visit `/contact`
2. Fill out the form
3. Click "Send Message"
4. Should see success message
5. Contact should be created in CRM database

---

## 🎯 Expected Result

After deployment, visiting `https://risivo-staging.pages.dev/contact` should show:

```
┌─────────────────────────────────────────┐
│     [RISIVO LOGO]  Features | Pricing   │
│              | About | Contact          │
├─────────────────────────────────────────┤
│                                         │
│        🎨 Get in Touch                  │
│   Have questions? We'd love to hear     │
│            from you.                    │
│                                         │
├──────────────┬──────────────────────────┤
│              │                          │
│  CONTACT     │    📧 Email              │
│  INFO        │    hello@risivo.com      │
│              │                          │
│              │    💬 Support            │
│              │    support@risivo.com    │
│              │                          │
│              │    📞 Phone              │
│              │    +1 (555) 123-4567     │
│              │                          │
├──────────────┴──────────────────────────┤
│  CONTACT FORM                           │
│  ┌────────────┐ ┌────────────┐         │
│  │First Name  │ │Last Name   │         │
│  └────────────┘ └────────────┘         │
│  ┌──────────────────────────┐          │
│  │Email                     │          │
│  └──────────────────────────┘          │
│  ┌──────────────────────────┐          │
│  │Phone (Optional)          │          │
│  └──────────────────────────┘          │
│  ┌──────────────────────────┐          │
│  │Message                   │          │
│  │                          │          │
│  └──────────────────────────┘          │
│  [     Send Message      ]              │
└─────────────────────────────────────────┘
```

---

## 🐛 If Still Getting 404

### **Issue: Cloudflare Pages Cache**

If you still see 404 after deployment:

1. **Hard Refresh:**
   - Chrome: `Ctrl + Shift + R`
   - Firefox: `Ctrl + F5`
   - Safari: `Cmd + Shift + R`

2. **Clear Cloudflare Cache:**
   ```bash
   # Via Wrangler CLI
   npx wrangler pages deployment list --project-name risivo-staging
   
   # Then purge cache
   npx wrangler pages deployment purge --project-name risivo-staging
   ```

3. **Check Worker Route:**
   - The `_worker.js` handles all routes
   - The `_routes.json` includes `/*`
   - Should work after cache clear

---

## 📊 Build Information

**Latest Commit:** `3f2221e`  
**Branch:** `staging`  
**Build Size:** 99.18 kB  
**Modules:** 43  
**Routes:**
- `/` - Homepage ✅
- `/contact` - Contact page 🆕
- `/features` - Placeholder
- `/pricing` - Placeholder
- `/api/contact` - API endpoint ✅
- `/api/newsletter` - API endpoint ✅
- `/api/register` - API endpoint ✅

---

## 🚀 Quick Deploy Command

Just run this one command on your Windows machine:

```powershell
cd C:\Users\Buzgrowth\Documents\risivo-website && git checkout staging && git pull origin staging && npm run build && npx wrangler pages deploy dist --project-name risivo-staging --branch staging
```

---

## ✅ Success Checklist

After deployment, verify:
- [ ] https://risivo-staging.pages.dev/contact loads (not 404)
- [ ] Contact form is visible
- [ ] Can fill out and submit form
- [ ] Success message appears
- [ ] Contact is created in CRM (check database)

---

**Need help deploying?** Let me know if you encounter any issues! 🚀
