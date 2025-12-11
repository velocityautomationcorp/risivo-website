# 🚀 Quick Webhook Test - 3 Minute Fix

## The Data Being Sent

Your API sends this to Make.com:
```json
{
  "email": "user@example.com",
  "timestamp": "2025-12-09T14:30:00Z",
  "source": "coming-soon-page",
  "subscribed_at": "2025-12-09T14:30:45.123Z",
  "page_url": "https://risivo.com/"
}
```

---

## ⚡ 3-Step Quick Fix

### Step 1: Check if WEBHOOK_URL is Set (30 seconds)

Visit this URL in your browser:
```
https://risivo.com/api/health
```

**Look for**:
```json
{
  "webhookConfigured": true  ← Should be TRUE
}
```

**If it shows `false`**, the webhook URL is NOT set in Cloudflare!

---

### Step 2: Set/Update the Webhook URL (1 minute)

```bash
npx wrangler pages secret put WEBHOOK_URL --project-name risivo-coming-soon
```

When prompted, paste your Make.com webhook URL from the screenshot:
- It should look like: `https://hook.us1.make.com/xxxxxxxxxxxxxxxxxxxxxxxxxx`
- Copy it CAREFULLY from Make.com (no extra spaces!)

---

### Step 3: Test the Form (1 minute)

1. Go to: https://risivo.com
2. **Hard refresh**: Ctrl+Shift+R (to clear cache)
3. Open **Developer Tools**: Press F12
4. Go to **Console** tab
5. Submit a test email
6. Look for these log messages:
   ```
   [SUBSCRIBE] Email: test@example.com
   [SUBSCRIBE] Webhook configured: true
   [SUBSCRIBE] Webhook URL (first 30 chars): https://hook.us1.make.com/...
   [SUBSCRIBE] Sending to webhook...
   [SUBSCRIBE] Webhook response status: 200
   ```

---

## 🔍 Diagnose the Issue

### Scenario A: "webhookConfigured: false"

**Problem**: Environment variable not set in Cloudflare Pages

**Solution**:
```bash
# Set it now
npx wrangler pages secret put WEBHOOK_URL --project-name risivo-coming-soon

# Verify
npx wrangler pages secret list --project-name risivo-coming-soon
```

---

### Scenario B: "Webhook response status: 400 or 500"

**Problem**: Make.com webhook is rejecting the data

**Possible causes**:
1. Make.com scenario is OFF
2. Webhook URL is wrong/expired
3. Make.com expects different data format

**Solution**:
1. Go to Make.com
2. Turn scenario ON (toggle in top-right)
3. Click webhook module
4. Click "Re-determine data structure"
5. Test form again

---

### Scenario C: "Webhook configured: true" but no status logged

**Problem**: Network issue or timeout

**Solution**: Check browser Console tab for network errors

---

## 🧪 Direct Test (Copy-Paste This)

Replace `YOUR_WEBHOOK_URL` with your actual URL from Make.com:

### For Windows (PowerShell):
```powershell
Invoke-RestMethod -Uri "YOUR_WEBHOOK_URL" -Method POST -Headers @{"Content-Type"="application/json"} -Body '{"email":"powershell-test@example.com","source":"direct-test"}'
```

### For Mac/Linux (Terminal):
```bash
curl -X POST YOUR_WEBHOOK_URL \
  -H "Content-Type: application/json" \
  -d '{"email":"curl-test@example.com","source":"direct-test"}'
```

**Expected Result**: Make.com should immediately show the data

---

## 📋 Checklist

Before testing, verify:

- [ ] Make.com scenario is **ON** (green toggle)
- [ ] Webhook module shows "**Waiting for data...**"
- [ ] WEBHOOK_URL is set in Cloudflare (check `/api/health`)
- [ ] You copied the COMPLETE webhook URL (no truncation)
- [ ] Webhook URL starts with `https://hook.`
- [ ] No spaces at beginning/end of webhook URL

---

## 🎯 Expected Flow

1. **User submits email** → `POST /api/subscribe`
2. **API validates email** → Check @ symbol
3. **API checks WEBHOOK_URL** → Must be configured
4. **API sends to Make.com**:
   ```json
   {
     "email": "user@example.com",
     "timestamp": "...",
     "source": "coming-soon-page",
     "subscribed_at": "2025-12-09T14:30:00Z",
     "page_url": "https://risivo.com/"
   }
   ```
5. **Make.com receives data** → Shows in webhook module
6. **API returns success** → User sees "Thank you!" message

---

## 🚨 Common Mistakes

### Mistake 1: Webhook URL has spaces
```
❌ " https://hook.us1.make.com/xxx "  ← Spaces!
✅ "https://hook.us1.make.com/xxx"     ← No spaces
```

### Mistake 2: Copied partial URL
```
❌ "https://hook.us1.make.com/abc"          ← Truncated
✅ "https://hook.us1.make.com/abcdefghijk"  ← Complete
```

### Mistake 3: Make.com scenario is OFF
- Look for green toggle in top-right corner
- Should say "ON" not "OFF"

### Mistake 4: Old webhook URL
- Make.com generates NEW URLs when you recreate webhooks
- Use the LATEST URL from your current scenario

---

## 📊 What to Send Me if Still Not Working

Run these commands and send results:

```bash
# 1. Check secrets
npx wrangler pages secret list --project-name risivo-coming-soon

# 2. Check health endpoint (copy result)
# Visit: https://risivo.com/api/health
```

**Also send**:
1. Screenshot of Make.com webhook module (showing status)
2. Screenshot of browser Console tab after submitting form
3. First 40 characters of your webhook URL (e.g., `https://hook.us1.make.com/abc123...`)

---

## ⏱️ Time Required

- **If webhook not set**: 2 minutes to fix
- **If Make.com is off**: 30 seconds to fix
- **If wrong URL**: 2 minutes to update

---

**Next**: Run the 3-Step Quick Fix above and tell me what you see!

---

*Created: Dec 9, 2025 14:35 UTC*
