# 🚨 Quick Fix: Deploy to Cloudflare Pages NOW

## The Problem

You're seeing a **404 error** on https://risivo-staging.pages.dev/contact because:
- ✅ The code is ready (contact route exists in `src/index.tsx` line 146-148)
- ✅ The code is pushed to GitHub (staging branch)
- ❌ **NOT DEPLOYED YET** - Cloudflare Pages still has old code

## The Solution (5 minutes)

### Step 1: Get Supabase Anon Key (REQUIRED)

**Without this, the deployment will succeed but forms won't work!**

1. Go to: https://supabase.com/dashboard/project/sldpdgdkrakfzwtroglx
2. Click: **Settings** (left sidebar) → **API**
3. Copy: The `anon` `public` key (looks like `eyJhbGci...`)
4. **Save it** - you'll paste it in Step 3

---

### Step 2: Configure Environment Variables in Cloudflare

**Go to:** https://dash.cloudflare.com  
**Navigate:** Pages → **risivo-staging** → Settings → **Environment Variables**

**Click:** "Add variable" and add these **3 variables** for **BOTH Production AND Preview**:

| Variable Name | Value |
|---------------|-------|
| `SUPABASE_URL` | `https://sldpdgdkrakfzwtroglx.supabase.co` |
| `SUPABASE_ANON_KEY` | (Paste the key from Step 1) |
| `ENABLE_FULL_SITE` | `true` |

**IMPORTANT:** Make sure you select **BOTH** "Production" AND "Preview" when adding each variable!

**Click "Save"** after adding all 3 variables.

---

### Step 3: Deploy from Your Computer

Open PowerShell or Command Prompt and run:

```powershell
cd C:\Users\Buzgrowth\Documents\risivo-website
git checkout staging
git pull origin staging
npm run build
npx wrangler pages deploy dist --project-name risivo-staging --branch staging
```

**Expected Output:**
```
✨ Success! Uploaded 1 files (103.79 kB gzip)
✨ Compiled Worker successfully
✨ Uploading Worker bundle
✨ Uploading _routes.json
✨ Deployment complete! Take a peek over at https://XXXX.risivo-staging.pages.dev
```

---

### Step 4: Test Immediately

**Visit:** https://risivo-staging.pages.dev/contact

**Expected:**
- ✅ No 404 error
- ✅ Contact form loads
- ✅ Company info on right side
- ✅ Navigation and footer visible

**Try submitting the form:**
1. Fill in: First Name, Last Name, Email, Message
2. Click "Send Message"
3. Should see: "Thank you! We'll be in touch soon."

---

## 🐛 Troubleshooting

### Issue: "wrangler: command not found"

**Solution:** Install Wrangler globally:
```powershell
npm install -g wrangler
```

Then run the deploy command again.

---

### Issue: "Not authorized"

**Solution:** Login to Cloudflare:
```powershell
npx wrangler login
```

A browser window will open. Login with your Cloudflare account, then try deploy again.

---

### Issue: Form submits but shows "Service configuration error"

**Cause:** Environment variables not set in Cloudflare Dashboard

**Solution:**
1. Go back to Step 2
2. Verify all 3 variables are added
3. Make sure they're set for **BOTH** "Production" AND "Preview"
4. Click "Redeploy" in Cloudflare Dashboard or run deploy command again

---

### Issue: Still seeing 404 after deployment

**Solution:**
1. Wait 30 seconds (Cloudflare cache)
2. Hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
3. Try in incognito/private window
4. Check deployment logs in Cloudflare Dashboard

---

## ✅ Success Checklist

After deployment, verify:

- [ ] https://risivo-staging.pages.dev/ loads (homepage)
- [ ] https://risivo-staging.pages.dev/contact loads (no 404)
- [ ] Contact form is visible and functional
- [ ] Newsletter form in footer works
- [ ] https://risivo-staging.pages.dev/api/health returns JSON

---

## 📊 What Gets Deployed

- **Contact Page:** `/contact` route (NO MORE 404!)
- **Contact API:** `POST /api/contact` (Supabase REST API)
- **Newsletter API:** `POST /api/newsletter` (Supabase REST API)
- **Register API:** `POST /api/register` (Supabase REST API)
- **Homepage:** All 8 sections with responsive mobile menu
- **Build:** 103.79 kB (42 modules)

---

## 🎯 After Successful Deployment

1. **Test forms** on staging
2. **Verify data** in Supabase database
3. **Share with CRM team** for verification
4. **Deploy to production** (risivo.com)

---

## 🆘 Still Stuck?

If you're still seeing the 404 error after following all steps:

1. Check Cloudflare Pages deployment status:
   - Go to: Dashboard → Pages → risivo-staging → Deployments
   - Look for latest deployment (should show "Success")
   - Click on it and check logs

2. Verify the build included the contact route:
   - Look for `dist/_worker.js` file
   - Should be ~103 kB

3. Share screenshot of:
   - Cloudflare deployment page
   - Environment variables page
   - Error message in browser console (F12 → Console)

---

**Quick Summary:**
1. ✅ Get Supabase anon key
2. ✅ Add 3 environment variables in Cloudflare Dashboard
3. ✅ Run deploy commands from terminal
4. ✅ Test /contact page - should work!

**Time:** 5 minutes  
**Current Status:** Code is ready, just needs deployment configuration + deploy command

---

**Let's fix this 404 now! 🚀**
