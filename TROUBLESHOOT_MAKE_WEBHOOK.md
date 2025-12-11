# 🔍 Troubleshooting Make.com Webhook Not Receiving Data

## Current Issue
✅ Form submits successfully on https://risivo.com  
✅ Shows "Thank you! We'll notify you when we launch."  
❌ Make.com webhook not receiving the data  

---

## Quick Diagnosis Steps

### Step 1: Check the Webhook URL Format

Your webhook URL should look like this:
```
https://hook.us1.make.com/xxxxxxxxxxxxxxxxxxxxxxxxxx
```

**Common mistakes**:
- ❌ Extra spaces at the beginning or end
- ❌ Missing `https://`
- ❌ Wrong region (e.g., `hook.eu1.make.com` vs `hook.us1.make.com`)
- ❌ Incomplete URL (missing characters at the end)

---

### Step 2: Verify the Webhook URL is Set in Cloudflare

Run this command:

```bash
npx wrangler pages secret list --project-name risivo-coming-soon
```

**Expected output**:
```
[
  {
    "name": "WEBHOOK_URL",
    "type": "secret_text"
  }
]
```

If you don't see `WEBHOOK_URL`, it's not set. Run:
```bash
npx wrangler pages secret put WEBHOOK_URL --project-name risivo-coming-soon
```

---

### Step 3: Check API Health Endpoint

Visit this URL in your browser:
```
https://risivo.com/api/health
```

**What to look for**:

✅ **GOOD** - Webhook is configured:
```json
{
  "status": "healthy",
  "environment": "production",
  "webhookConfigured": true,
  "enableFullSite": "false"
}
```

❌ **BAD** - Webhook is NOT configured:
```json
{
  "status": "healthy",
  "environment": "production",
  "webhookConfigured": false,
  "enableFullSite": "false"
}
```

If `webhookConfigured: false`, the `WEBHOOK_URL` environment variable is not set.

---

### Step 4: Test the Webhook Directly from Terminal

Let's test if your Make.com webhook URL works:

```bash
curl -X POST https://your-make-webhook-url-here \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com"}'
```

**Replace** `https://your-make-webhook-url-here` with your actual webhook URL from Make.com.

**Expected result**: 
- Make.com should show "Waiting for data..." change to show the received data
- OR you should see an immediate response

---

### Step 5: Check Make.com Webhook Status

In your Make.com scenario:

1. **Click on the webhook module** (the first module)
2. **Check the status**:
   - ✅ Green: Webhook is active and waiting
   - ⚠️ Orange: Webhook might be inactive
   - ❌ Red: Webhook has an error

3. **Look for "Waiting for webhook data"** message
4. **Try clicking "Redetermine data structure"** to reset the webhook listener

---

## Common Issues & Solutions

### Issue 1: Webhook URL Has Spaces or Extra Characters

**Solution**: 
1. Copy the webhook URL from Make.com again (carefully)
2. Update it in Cloudflare:
   ```bash
   npx wrangler pages secret put WEBHOOK_URL --project-name risivo-coming-soon
   ```
3. Paste the URL (make sure no extra spaces)
4. Press Enter

### Issue 2: Make.com Webhook is Turned Off

**Solution**:
1. Go to your Make.com scenario
2. Make sure the scenario is **ON** (toggle in top right)
3. Click on the webhook module
4. Click **"Run once"** or **"Re-determine data structure"**
5. Then test the form again

### Issue 3: Wrong Webhook URL Region

**Solution**:
- Check if your Make.com webhook URL uses:
  - `hook.us1.make.com` (US region)
  - `hook.eu1.make.com` (Europe region)
  - `hook.eu2.make.com` (Europe region 2)
- Make sure you copied the complete URL

### Issue 4: CORS or Network Issue

**Solution**: Let me check the current API endpoint code to ensure it's sending data correctly.

---

## Step-by-Step Testing Process

### Test 1: Direct cURL Test
```bash
# Replace YOUR_WEBHOOK_URL with your actual Make.com webhook URL
curl -X POST YOUR_WEBHOOK_URL \
  -H "Content-Type: application/json" \
  -d '{"email":"direct-test@example.com"}'
```

**Result**: 
- ✅ If Make.com receives this → Webhook URL is correct, issue is in Cloudflare
- ❌ If Make.com doesn't receive this → Webhook URL is wrong or Make.com is off

---

### Test 2: Check Browser Network Tab

1. Open https://risivo.com
2. Press **F12** to open Developer Tools
3. Go to **Network** tab
4. Submit the email form
5. Look for a request to `/api/subscribe`
6. Click on it and check:
   - **Status Code**: Should be `200 OK`
   - **Response**: Should show `{"success":true,"message":"Email submitted successfully"}`
   - **Request Payload**: Should show `{"email":"your-email@example.com"}`

**Screenshot what you see** if there are errors.

---

### Test 3: Check Cloudflare Logs (Advanced)

If you have access to Cloudflare dashboard:

1. Go to **Cloudflare Dashboard**
2. Select your **risivo-coming-soon** project
3. Go to **Functions** → **Logs**
4. Look for `/api/subscribe` requests
5. Check if there are any errors

---

## What Data Format Does Make.com Expect?

The current code sends:
```json
{
  "email": "user@example.com"
}
```

**If Make.com expects a different format**, we might need to modify the code.

Common formats:
```json
// Option 1: Simple email (current)
{"email": "user@example.com"}

// Option 2: With timestamp
{"email": "user@example.com", "timestamp": "2025-12-09T14:30:00Z"}

// Option 3: With source
{"email": "user@example.com", "source": "coming-soon-page"}

// Option 4: Form data style
{"data": {"email": "user@example.com"}}
```

---

## Immediate Action Plan

### ✅ Do This Right Now:

1. **Copy your webhook URL from Make.com** (from the screenshot, it looks like it starts with `https://hook.us1.make.com/...`)

2. **Update the environment variable**:
   ```bash
   npx wrangler pages secret put WEBHOOK_URL --project-name risivo-coming-soon
   ```

3. **Verify it's set**:
   ```bash
   npx wrangler pages secret list --project-name risivo-coming-soon
   ```

4. **Check API health**:
   - Visit: https://risivo.com/api/health
   - Should show `"webhookConfigured": true`

5. **Make sure Make.com scenario is ON**:
   - Go to Make.com
   - Toggle should be green/ON in top right
   - Webhook module should show "Waiting for data"

6. **Test the form**:
   - Go to https://risivo.com
   - Hard refresh (Ctrl+Shift+R)
   - Enter test email: `test123@example.com`
   - Click "NOTIFY ME"
   - Check Make.com immediately

---

## If Still Not Working - Send Me:

1. **Screenshot of**:
   - Make.com webhook module status
   - Browser Network tab showing `/api/subscribe` request
   - Result of visiting `https://risivo.com/api/health`

2. **Copy-paste**:
   - First 20 characters of your webhook URL (e.g., `https://hook.us1.make...`)
   - Result of `npx wrangler pages secret list --project-name risivo-coming-soon`

3. **Confirm**:
   - Is your Make.com scenario ON?
   - Did you click "Re-determine data structure" on the webhook module?
   - What does the form show when you submit? (Success message or error?)

---

## Alternative: Test with RequestBin

If you want to see exactly what data is being sent:

1. Go to https://requestbin.com
2. Click "Create a Request Bin"
3. Copy the URL (e.g., `https://requestbin.com/r/xxxxx`)
4. Update Cloudflare with this URL:
   ```bash
   npx wrangler pages secret put WEBHOOK_URL --project-name risivo-coming-soon
   ```
5. Test the form
6. Check RequestBin to see the exact data being sent
7. Then update back to your Make.com URL

---

**Next Step**: Please run the commands in "Immediate Action Plan" above and let me know what you see!

---

*Last Updated: Dec 9, 2025 14:30 UTC*
