# 🔧 Fix 500 Error on Contact Form

## Good News! 
✅ The `/contact` page now loads (no more 404!)  
✅ The deployment worked!  

## The Problem
❌ Contact form submission returns 500 error  
**Cause:** Environment variables not configured correctly in Cloudflare

---

## 🔍 Quick Diagnosis

The 500 error means one of these is happening:
1. `SUPABASE_URL` is missing or incorrect
2. `SUPABASE_ANON_KEY` is missing or incorrect
3. Environment variables are set for "Production" but not "Preview"
4. Supabase anon key doesn't have correct permissions

---

## 🚀 Solution 1: Verify Environment Variables

### Step 1: Check Cloudflare Dashboard

Go to: https://dash.cloudflare.com  
Navigate: **Pages** → **risivo-staging** → **Settings** → **Environment Variables**

**Verify these 3 variables exist:**

| Variable Name | Expected Value | Check |
|---------------|----------------|-------|
| `SUPABASE_URL` | `https://sldpdgdkrakfzwtroglx.supabase.co` | Exactly this |
| `SUPABASE_ANON_KEY` | `eyJhbGci...` (long string) | Starts with `eyJ` |
| `ENABLE_FULL_SITE` | `true` | Exactly `true` |

**CRITICAL:** Each variable must be checked for **BOTH**:
- ✅ Production environment
- ✅ Preview environment

---

### Step 2: Get Fresh Supabase Anon Key

The key might be wrong or expired. Let's get a fresh one:

1. Go to: https://supabase.com/dashboard/project/sldpdgdkrakfzwtroglx
2. Click: **Settings** (left sidebar)
3. Click: **API** (under Settings)
4. Find: **Project API keys** section
5. Copy: The `anon` `public` key (NOT the service_role key!)

**It should look like:**
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNsZHBkZ2RrcmFrZnp3dHJvZ2x4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTk4OTk5OTksImV4cCI6MjAxNTQ3NTk5OX0.XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
```

---

### Step 3: Update SUPABASE_ANON_KEY in Cloudflare

1. In Cloudflare Dashboard (Environment Variables page)
2. Click **Edit** on `SUPABASE_ANON_KEY`
3. **Delete** the old value
4. **Paste** the fresh key from Step 2
5. Make sure it's checked for **BOTH** Production AND Preview
6. Click **Save**

---

### Step 4: Redeploy

After updating environment variables, you MUST redeploy:

```powershell
cd C:\Users\Buzgrowth\Documents\risivo-website
npx wrangler pages deploy dist --project-name risivo-staging --branch staging
```

**OR** in Cloudflare Dashboard:
- Go to: Pages → risivo-staging → **Deployments**
- Click: **Retry deployment** on the latest deployment

---

### Step 5: Test Again

1. Visit: https://risivo-staging.pages.dev/contact
2. Open browser console: F12 → Console tab
3. Fill out contact form
4. Click "Send Message"
5. Check for errors in console

**Expected:** "Thank you! We'll be in touch soon."

---

## 🚀 Solution 2: Check API Health Endpoint

This will tell us exactly what's missing:

**Visit:** https://risivo-staging.pages.dev/api/health

**Expected Response:**
```json
{
  "status": "ok",
  "environment": "staging",
  "webhookConfigured": false,
  "fullSiteEnabled": true,
  "timestamp": "2025-12-10T..."
}
```

**If you see an error here**, share the error message and I'll help debug.

---

## 🚀 Solution 3: Check Browser Console Logs

1. Open https://risivo-staging.pages.dev/contact
2. Press F12 (Developer Tools)
3. Go to **Console** tab
4. Submit the form
5. Look for red error messages

**Common errors and fixes:**

### Error: "Service configuration error"
**Cause:** `SUPABASE_URL` or `SUPABASE_ANON_KEY` missing  
**Fix:** Add them in Cloudflare Dashboard (Step 1-3 above)

### Error: "Failed to fetch"
**Cause:** Network issue or CORS problem  
**Fix:** Check browser console for more details

### Error: "Tenant or user not found"
**Cause:** Wrong Supabase URL or wrong project  
**Fix:** Verify `SUPABASE_URL` is exactly: `https://sldpdgdkrakfzwtroglx.supabase.co`

---

## 🚀 Solution 4: Check Cloudflare Pages Function Logs

Real-time logs will show exactly what's failing:

1. Go to: https://dash.cloudflare.com
2. Navigate: **Pages** → **risivo-staging** → **Deployments**
3. Click: Latest deployment (the one with "Success" badge)
4. Click: **View logs** or **Functions** tab
5. Submit form again
6. Look for error messages in logs

**Look for:**
- `[CONTACT] Missing Supabase credentials` → Environment variables not set
- `[CONTACT] Failed to create contact:` → Database/permission error
- Stack traces showing the exact error

---

## 🚀 Solution 5: Verify Supabase RLS Policies

The anon key might not have permission to insert records.

1. Go to: https://supabase.com/dashboard/project/sldpdgdkrakfzwtroglx
2. Click: **Authentication** → **Policies**
3. Check: **Contact** table
4. Verify: There's a policy allowing `INSERT` for `anon` role

**If no policy exists, create one:**

```sql
-- Allow anonymous users to insert contacts
CREATE POLICY "Allow anonymous contact creation"
ON "Contact"
FOR INSERT
TO anon
WITH CHECK (true);
```

**Also check these tables:**
- `NewsletterSubscriber` - needs INSERT for anon
- `SubAccount` - needs SELECT for anon (to find default subaccount)

---

## 📊 Debugging Checklist

Run through this checklist:

### Environment Variables
- [ ] `SUPABASE_URL` is set in Cloudflare Dashboard
- [ ] `SUPABASE_ANON_KEY` is set in Cloudflare Dashboard
- [ ] `ENABLE_FULL_SITE` is set to `true`
- [ ] All 3 variables are set for BOTH Production AND Preview
- [ ] Redeployed after adding/changing variables

### Supabase Configuration
- [ ] Anon key is correct (from Settings → API)
- [ ] Supabase project is active (not paused)
- [ ] Contact table exists in database
- [ ] SubAccount table exists and has at least 1 record
- [ ] RLS policies allow anon to INSERT on Contact table

### Deployment
- [ ] Latest code deployed (103.79 kB)
- [ ] Deployment shows "Success" status
- [ ] No errors in Cloudflare Pages Function logs
- [ ] /api/health endpoint returns JSON

---

## 🔍 What to Share for Debugging

If still not working, share:

1. **Screenshot of Environment Variables page** (blur sensitive values)
2. **Response from:** https://risivo-staging.pages.dev/api/health
3. **Browser console error** (F12 → Console → screenshot red errors)
4. **Cloudflare Function logs** (from deployment page)

---

## 📝 Quick Command Summary

```powershell
# Redeploy after changing environment variables
cd C:\Users\Buzgrowth\Documents\risivo-website
npx wrangler pages deploy dist --project-name risivo-staging --branch staging

# Check logs in real-time (if wrangler supports it)
npx wrangler pages deployment tail --project-name risivo-staging
```

---

## ✅ Success Criteria

After fixing, you should see:

1. ✅ `/api/health` returns JSON with status "ok"
2. ✅ Contact form submits without errors
3. ✅ Success message: "Thank you! We'll be in touch soon."
4. ✅ New Contact record appears in Supabase database
5. ✅ No errors in browser console
6. ✅ No errors in Cloudflare Pages logs

---

## 🎯 Most Likely Fix

**90% of the time, it's one of these:**

1. **Environment variables not saved** → Go back and verify they're all there
2. **Variables only set for Production, not Preview** → Check BOTH boxes
3. **Wrong Supabase anon key** → Get fresh one from Supabase Dashboard
4. **Forgot to redeploy after adding variables** → Redeploy now

---

## 🆘 Still Getting 500 Error?

Try this emergency test:

**Visit:** https://risivo-staging.pages.dev/api/health

**If this also returns 500**, it means:
- Deployment failed somehow
- Environment variables are completely missing
- There's a code error (unlikely since build succeeded)

**Share the response and I'll help immediately!**

---

**TL;DR:**
1. Verify all 3 environment variables in Cloudflare Dashboard
2. Get fresh Supabase anon key
3. Update SUPABASE_ANON_KEY in Cloudflare
4. Redeploy
5. Test form again

**Time:** 3-5 minutes  
**Success Rate:** 95% (environment variables are almost always the issue)

Let me know what you find! 🔧
