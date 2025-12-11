# 🚨 URGENT: Fix Email Form on Coming Soon Page

## Issue
The email form shows error: "⚠️ Oops! Something went wrong. Please try again."

## Root Cause
The `WEBHOOK_URL` environment variable is NOT set in Cloudflare Pages.

---

## ✅ SOLUTION - Set Environment Variable

### Step 1: Get Your Make.com Webhook URL
You should have a webhook URL from Make.com that looks like:
```
https://hook.us1.make.com/xxxxxxxxxxxxx
```

### Step 2: Set Environment Variable in Cloudflare Pages

**Option A: Using Wrangler CLI (FASTEST)**
```bash
cd C:\Users\Buzgrowth\Documents\risivo-website

# Set WEBHOOK_URL for risivo-staging project
npx wrangler pages secret put WEBHOOK_URL --project-name risivo-staging

# When prompted, paste your Make.com webhook URL
# Example: https://hook.us1.make.com/xxxxxxxxxxxxx
```

**Option B: Using Cloudflare Dashboard**
1. Go to: https://dash.cloudflare.com
2. Click on **Pages** in left sidebar
3. Select **risivo-staging** project
4. Click **Settings** tab
5. Scroll to **Environment variables**
6. Click **Add variable**
7. Name: `WEBHOOK_URL`
8. Value: Your Make.com webhook URL
9. Click **Save**
10. **Redeploy** the site

### Step 3: Redeploy (If using Dashboard method)
```bash
npm run deploy:staging
```

---

## 🧪 Test After Setting

1. Visit: https://risivo-staging.pages.dev
2. The coming soon page should be showing (since `ENABLE_FULL_SITE` is not true)
3. Enter an email in the form
4. Click "NOTIFY ME"
5. Should see: ✅ "Thank you! We'll notify you when we launch."

---

## 🔍 Verify Configuration

Check if variables are set:
```bash
npx wrangler pages secret list --project-name risivo-staging
```

Should show:
- `WEBHOOK_URL` ✅
- `ENABLE_FULL_SITE` ✅

---

## ⚠️ Common Issues

### Issue: "Service configuration incomplete"
**Cause**: `WEBHOOK_URL` not set  
**Fix**: Follow Step 2 above

### Issue: Still getting error after setting
**Cause**: Site not redeployed after setting variable  
**Fix**: Run `npm run deploy:staging`

### Issue: Email not reaching Make.com
**Cause**: Wrong webhook URL  
**Fix**: Verify webhook URL in Make.com and update in Cloudflare

---

## 📋 Quick Commands Summary

```bash
# 1. Set WEBHOOK_URL
npx wrangler pages secret put WEBHOOK_URL --project-name risivo-staging
# Paste your Make.com webhook URL when prompted

# 2. Verify it's set
npx wrangler pages secret list --project-name risivo-staging

# 3. Redeploy (optional - variables take effect immediately)
npm run deploy:staging
```

---

## ✅ Success Checklist

- [ ] WEBHOOK_URL set in Cloudflare Pages
- [ ] Webhook URL is correct (from Make.com)
- [ ] Site redeployed (if needed)
- [ ] Tested form submission
- [ ] Email received in Make.com
- [ ] Success message shown to user

---

## 🎯 Expected Behavior

**Before fix:**
```
❌ ⚠️ Oops! Something went wrong. Please try again.
```

**After fix:**
```
✅ Thank you! We'll notify you when we launch.
```

Email should appear in your Make.com scenario immediately.

---

## 📞 Need Help?

If still not working after setting WEBHOOK_URL:

1. Check Cloudflare Pages logs:
   ```bash
   npx wrangler pages deployment tail --project-name risivo-staging
   ```

2. Check browser console (F12) for errors

3. Verify Make.com webhook is active and accepting requests

---

**Action Required**: Set `WEBHOOK_URL` environment variable NOW! ⚡
