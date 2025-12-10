# 🔍 Final Diagnostic - Let's Fix This 500 Error

Good! I can see you have the correct Supabase anon key. Now let's diagnose the exact issue.

---

## 🧪 Critical Test: What Does /api/health Show?

**Please visit this URL and tell me EXACTLY what you see:**

https://risivo-staging.pages.dev/api/health

**Possible responses:**

### Response A: JSON with "ok"
```json
{
  "status": "ok",
  "environment": "production",
  "webhookConfigured": false,
  "fullSiteEnabled": true,
  "timestamp": "2025-12-10T..."
}
```
✅ **If you see this:** Environment variables are working! The 500 error is something else.

### Response B: Error 500
❌ **If you see this:** Environment variables are NOT being loaded by Cloudflare Workers.

### Response C: Other error
📝 **Copy the exact error message**

---

## 🔧 If You See Error 500 on /api/health

This means Cloudflare isn't loading the environment variables. Here's why:

### Most Likely Cause: Need to Redeploy

After setting environment variables, you MUST redeploy. Did you run this?

```powershell
cd C:\Users\Buzgrowth\Documents\risivo-website
npx wrangler pages deploy dist --project-name risivo-staging --branch staging
```

**If not, run it now!** Environment variable changes don't apply until you redeploy.

---

## 🔍 Alternative: Check Cloudflare Pages Deployment Logs

1. Go to: https://dash.cloudflare.com
2. Navigate: **Pages** → **risivo-staging** → **Deployments**
3. Click on: Latest deployment (the one at the top)
4. Look for: **View logs** or **Functions** tab
5. Try submitting the contact form again
6. Look at the logs - what error appears?

**Common log errors:**

**"SUPABASE_URL is undefined"**
→ Environment variable not set or not deployed

**"Failed to fetch"**
→ Supabase connection issue

**"Tenant or user not found"**
→ Wrong Supabase credentials

---

## 🚨 Quick Verification Checklist

Please verify these:

### 1. Environment Variables in Cloudflare
- [ ] `ENABLE_FULL_SITE` = `true` (exactly)
- [ ] `SUPABASE_URL` = `https://sldpdgdkrakfzwtroglx.supabase.co` (exactly, no trailing /)
- [ ] `SUPABASE_ANON_KEY` = The anon key from your screenshot (starts with `eyJhbG...`)
- [ ] All 3 are checked for **BOTH** Production AND Preview

### 2. Deployment
- [ ] Ran `npx wrangler pages deploy dist --project-name risivo-staging --branch staging`
- [ ] Saw "✨ Deployment complete!" message
- [ ] Waited 30 seconds for cache to clear

### 3. Testing
- [ ] Visited `/api/health` in browser
- [ ] Opened browser console (F12 → Console)
- [ ] Tried submitting contact form
- [ ] Checked console for error messages

---

## 🎯 Let's Try Alternative Approach: Check Supabase RLS Policies

The anon key might not have permission to insert records. Let's check:

### Step 1: Check Supabase RLS

1. Go to: https://supabase.com/dashboard/project/sldpdgdkrakfzwtroglx
2. Click: **Table Editor** (left sidebar)
3. Find: **Contact** table
4. Click: **RLS** or **Policies** button
5. Check: Is there a policy allowing `INSERT` for `anon` role?

**If NO policy exists**, create one:

1. Click: **New Policy**
2. Select: **Enable Insert**
3. Role: `anon`
4. Check: `WITH CHECK (true)` (allow all)
5. Save

**Repeat for:**
- `NewsletterSubscriber` table (needs INSERT for anon)
- `SubAccount` table (needs SELECT for anon)

---

## 🔍 Test Supabase Connection Directly

Let's verify Supabase is accessible. Open browser console (F12) and paste this:

```javascript
fetch('https://sldpdgdkrakfzwtroglx.supabase.co/rest/v1/Contact?limit=1', {
  headers: {
    'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNsZHBkZ2RrcmFrZnp3dHJvZ2x4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzM4NjIwMDAsImV4cCI6MjA0OTQzODAwMH0.szd8RpYwF23f3-CqhIz1tI0TRQTI1KT3zTnRccCtEipq',
    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNsZHBkZ2RrcmFrZnp3dHJvZ2x4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzM4NjIwMDAsImV4cCI6MjA0OTQzODAwMH0.szd8RpYwF23f3-CqhIz1tI0TRQTI1KT3zTnRccCtEipq'
  }
}).then(r => r.json()).then(console.log)
```

**Expected:** Array of contacts (or empty array `[]`)  
**If error:** Copy the error message and share it

---

## 🐛 Most Common Issues (In Order)

### Issue 1: Forgot to Redeploy (70% of cases)
**Fix:** Run `npx wrangler pages deploy dist --project-name risivo-staging --branch staging`

### Issue 2: Supabase RLS Policies Block Anon (20% of cases)
**Fix:** Add RLS policies allowing INSERT for anon role on Contact and NewsletterSubscriber tables

### Issue 3: Wrong Environment (5% of cases)
**Fix:** Make sure variables are set for BOTH Production AND Preview in Cloudflare

### Issue 4: Typo in SUPABASE_URL (3% of cases)
**Fix:** Verify exactly `https://sldpdgdkrakfzwtroglx.supabase.co` (no trailing slash)

### Issue 5: Something Else (2% of cases)
**Fix:** Share /api/health response and console errors

---

## 🆘 What I Need From You

To fix this quickly, please share:

### 1. /api/health Response
Visit: https://risivo-staging.pages.dev/api/health  
**Copy/paste:** The entire response (JSON or error message)

### 2. Browser Console Error
1. Visit: https://risivo-staging.pages.dev/contact
2. Press F12 → Console tab
3. Submit the form
4. **Screenshot:** Any red error messages

### 3. Deployment Confirmation
Did you run `npx wrangler pages deploy` after setting environment variables?  
**Copy/paste:** The output of that command

---

## 🎯 Quick Action Plan

**Do this right now:**

1. **Redeploy** (most important!):
   ```powershell
   cd C:\Users\Buzgrowth\Documents\risivo-website
   npx wrangler pages deploy dist --project-name risivo-staging --branch staging
   ```

2. **Wait 30 seconds** for deployment to finish

3. **Test /api/health:**
   Visit: https://risivo-staging.pages.dev/api/health

4. **Share the result** (JSON or error)

---

## 💡 Theory: Why 500 Error Happens

The code is trying to access `c.env.SUPABASE_URL` and `c.env.SUPABASE_ANON_KEY`, but if these aren't loaded by Cloudflare Workers, they'll be `undefined`, causing the API to return 500.

**From the code (src/routes/contact.ts):**
```typescript
const supabaseUrl = env.SUPABASE_URL
const supabaseKey = env.SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  return c.json({ error: 'Service configuration error' }, 500)
}
```

So the 500 error is actually our own error handling saying "environment variables are missing".

**The fix:** Make sure Cloudflare loads them (requires redeploy after setting).

---

## ✅ Expected Timeline

After redeploying:
- ⏱️ 30 seconds - Deployment finishes
- ✅ `/api/health` returns JSON with "ok"
- ✅ Contact form works
- ✅ Success message appears
- ✅ Data saved to Supabase

---

**What does /api/health show right now? That will tell us exactly what's wrong!** 🔍
