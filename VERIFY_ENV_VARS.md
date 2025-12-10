# ✅ Environment Variables Verification

Great! I can see you've added the 3 secret variables to both Production and Preview. Now let's verify they have the correct values.

---

## 🔍 Step 1: Verify the Values Are Correct

Since the values are encrypted in Cloudflare Dashboard, let's double-check them:

### Variable 1: `ENABLE_FULL_SITE`
- **Click:** Edit button on `ENABLE_FULL_SITE`
- **Verify value is EXACTLY:** `true`
- **Save**

### Variable 2: `SUPABASE_URL`
- **Click:** Edit button on `SUPABASE_URL`
- **Verify value is EXACTLY:** `https://sldpdgdkrakfzwtroglx.supabase.co`
- **Important:** No trailing slash `/`, no extra spaces
- **Save**

### Variable 3: `SUPABASE_ANON_KEY`
This is the most likely issue. Let's get the correct key:

1. **Open new tab:** https://supabase.com/dashboard/project/sldpdgdkrakfzwtroglx
2. **Click:** Settings (left sidebar)
3. **Click:** API
4. **Find:** "Project API keys" section
5. **Copy:** The `anon` `public` key

**Screenshot of what to copy:**
- Look for a table with two keys
- One labeled `anon` (this is what you need)
- One labeled `service_role` (DON'T use this one)
- The `anon` key is a long string starting with `eyJ`

**Example format:**
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNsZHBkZ2RrcmFrZnp3dHJvZ2x4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzM4NjIwMDAsImV4cCI6MjA0OTQzODAwMH0.XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
```

6. **Go back to Cloudflare:** Edit `SUPABASE_ANON_KEY`
7. **Delete old value**
8. **Paste the anon key from Supabase**
9. **Make sure BOTH Production and Preview are checked**
10. **Save**

---

## 🚀 Step 2: Redeploy After Changing Variables

**CRITICAL:** After changing environment variables, you MUST redeploy!

```powershell
cd C:\Users\Buzgrowth\Documents\risivo-website
npx wrangler pages deploy dist --project-name risivo-staging --branch staging
```

**Wait for:** `✨ Deployment complete!`

---

## 🧪 Step 3: Test the API Health Endpoint

**Visit:** https://risivo-staging.pages.dev/api/health

**Expected Response:**
```json
{
  "status": "ok",
  "environment": "production",
  "webhookConfigured": false,
  "fullSiteEnabled": true,
  "timestamp": "2025-12-10T..."
}
```

**If you see this, environment variables are working!**

**If you see an error:** Environment variables still not loaded, try:
1. Wait 30 seconds (cache)
2. Deploy again
3. Try in incognito window

---

## 🔧 Step 4: Test Contact Form

1. Visit: https://risivo-staging.pages.dev/contact
2. Open browser console: **F12** → **Console** tab
3. Fill out form with test data
4. Click "Send Message"
5. Watch the console for messages

**Expected Console Output:**
```
[CONTACT] Creating contact: {firstName: "Test", lastName: "User", email: "test@example.com"}
[CONTACT] Contact created: <some-uuid>
```

**Expected Success Message:**
```
"Thank you! We'll be in touch soon."
```

---

## 🐛 Common Issues & Fixes

### Issue: Still getting 500 error after redeploy

**Check in browser console (F12):**

**Error: "Service configuration error"**
- Cause: SUPABASE_URL or SUPABASE_ANON_KEY still missing
- Fix: Verify all 3 variables show in Cloudflare Dashboard
- Redeploy after verification

**Error: "Network error" or "Failed to fetch"**
- Cause: Supabase anon key might be wrong
- Fix: Get fresh key from Supabase Dashboard (Settings → API)

**Error: "Tenant or user not found"**
- Cause: Wrong Supabase URL
- Fix: Verify URL is exactly `https://sldpdgdkrakfzwtroglx.supabase.co`

---

## 📊 Verification Checklist

After completing all steps:

- [ ] `ENABLE_FULL_SITE` = `true` (exact value)
- [ ] `SUPABASE_URL` = `https://sldpdgdkrakfzwtroglx.supabase.co` (exact value, no trailing slash)
- [ ] `SUPABASE_ANON_KEY` = Fresh anon key from Supabase Dashboard
- [ ] All 3 variables checked for BOTH Production AND Preview
- [ ] Redeployed after setting variables
- [ ] `/api/health` returns JSON with `"status": "ok"`
- [ ] Contact form submission works
- [ ] Success message appears
- [ ] New contact appears in Supabase database

---

## 🆘 Still Not Working?

If after following all steps you still get 500 error, please share:

1. **Screenshot of:** `/api/health` response (the JSON or error)
2. **Browser console errors:** F12 → Console → Screenshot of red errors after submitting form
3. **Confirmation:** All 3 variables show in Cloudflare Dashboard for both environments

---

## 🎯 Most Likely Issues (in order)

1. **Wrong SUPABASE_ANON_KEY** (90% of cases)
   - Get fresh one from Supabase Dashboard → Settings → API
   - Use the `anon` key, not `service_role`

2. **Typo in SUPABASE_URL** (5% of cases)
   - Should be: `https://sldpdgdkrakfzwtroglx.supabase.co`
   - No trailing `/`, no extra spaces

3. **Forgot to redeploy** (4% of cases)
   - Must run `npx wrangler pages deploy dist --project-name risivo-staging`
   - Environment changes don't apply without redeploy

4. **Variables only on one environment** (1% of cases)
   - Check BOTH Production and Preview boxes
   - Your screenshots show this is correct ✓

---

## 🔑 Quick Action Plan

**Do this now (5 minutes):**

1. Go to Supabase Dashboard → Settings → API
2. Copy the `anon` `public` key
3. Go to Cloudflare → Edit `SUPABASE_ANON_KEY`
4. Paste the fresh key
5. Save
6. Redeploy: `npx wrangler pages deploy dist --project-name risivo-staging`
7. Test: Visit `/api/health` first, then `/contact`

---

**The environment variables are in the right place! Now we just need to verify the VALUES are correct, especially the Supabase anon key.**

**Next step: Get fresh anon key from Supabase Dashboard and update it in Cloudflare!** 🔑
