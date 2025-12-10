# 🚨 Fix "Internal Server Error" on Contact Page

The entire `/contact` page is showing "Internal Server Error". This means there's a runtime error in the Cloudflare Worker.

---

## 🚀 Quick Fix: Redeploy Latest Code

The code builds fine locally (103.79 kB, no errors), so let's redeploy:

```powershell
cd C:\Users\Buzgrowth\Documents\risivo-website
git pull origin staging
npm run build
npx wrangler pages deploy dist --project-name risivo-staging --branch staging
```

**Wait for:** `✨ Deployment complete!`

Then test: https://risivo-staging.pages.dev/contact

---

## 🔍 Check Cloudflare Logs

If redeploying doesn't fix it, check the logs:

1. Go to: https://dash.cloudflare.com
2. Navigate: **Pages** → **risivo-staging** → **Deployments**
3. Click: Latest deployment
4. Look for: **Logs** or **Functions** tab
5. Visit: https://risivo-staging.pages.dev/contact
6. **Refresh logs** and look for error messages

**Common errors:**
- "Cannot find module" → Missing import
- "undefined is not a function" → Code error
- Stack trace → Shows exact line causing error

---

## 🐛 Possible Causes

### Cause 1: Old Deployment Still Cached

**Solution:** Redeploy (command above)

### Cause 2: Environment Variable Issue

Even though `/api/health` works, the page rendering might be failing.

**Check:** Are ALL environment variables set?
- SUPABASE_URL
- SUPABASE_ANON_KEY  
- ENABLE_FULL_SITE

### Cause 3: Import Error

The page imports `designSystem` from `../styles/design-system`.

**Test:** Visit homepage - does it load?
- https://risivo-staging.pages.dev/

**If homepage works but contact doesn't:** Issue is specific to contact page.

---

## 🧪 Alternative: Test API Directly

The API might still work even if the page doesn't render. Try this in browser console or Postman:

```javascript
fetch('https://risivo-staging.pages.dev/api/contact', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    firstName: 'Test',
    lastName: 'User',
    email: 'test@example.com',
    message: 'Test message'
  })
}).then(r => r.json()).then(console.log)
```

**If this works:** API is fine, just the page rendering is broken.

---

## 🔧 Emergency Fix: Simplify Contact Page

If the issue is with the contact page code, let's try a minimal version.

Let me know if you want me to create a simplified contact page without all the styling to test if that works.

---

## 📊 Diagnostic Steps

1. **Redeploy** (most likely fix)
2. **Check Cloudflare logs** for exact error
3. **Test homepage** - does it load?
4. **Test API directly** - does it work?
5. **Share error from logs** - I'll fix the code

---

## 🆘 What to Share

To fix this immediately, please share:

**Option 1: Cloudflare Logs**
- After visiting /contact, what error appears in logs?

**Option 2: Homepage Status**
- Does https://risivo-staging.pages.dev/ load?

**Option 3: API Test Result**
- Run the fetch command above in browser console
- What response do you get?

---

## 💡 Most Likely Issue

The old deployment is still active. **Redeploying will fix it 90% of the time.**

---

**Run the redeploy commands now, then test /contact again!** 🚀

If still broken after redeploy, check Cloudflare logs and share the error.
