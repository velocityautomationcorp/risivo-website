# 🔴 LIVE DEBUG - Webhook Not Receiving Data

## You've Confirmed:
✅ `webhookConfigured: true` at `/api/health`  
✅ Webhook URL is set in Cloudflare  
✅ Form submits successfully  
❌ Make.com still not receiving data  

This means the request is failing somewhere between Cloudflare and Make.com.

---

## 🚨 IMMEDIATE DEBUG STEPS

### Step 1: Check Browser Console for Errors

1. Go to: **https://risivo.com**
2. Press **F12** (Developer Tools)
3. Go to **Console** tab
4. Clear the console (trash icon)
5. Submit a test email
6. **SCREENSHOT the Console** and send it to me

**Look for**:
- `[SUBSCRIBE] Webhook response status: ???` (what number?)
- Any RED error messages
- Network errors

---

### Step 2: Check Network Tab for API Response

1. Keep Developer Tools open (F12)
2. Go to **Network** tab
3. Clear it (trash icon)
4. Submit a test email
5. Look for **`subscribe`** in the list
6. Click on it
7. Go to **Response** sub-tab
8. **SCREENSHOT the Response** and send it to me

**What to look for**:
```json
{
  "success": true,
  "message": "Email submitted successfully"
}
```

OR error message like:
```json
{
  "error": "..."
}
```

---

### Step 3: Test Direct Connection to Make.com

Let's bypass the website and test if Make.com webhook works directly.

**Open PowerShell** and run this (replace `YOUR_WEBHOOK_URL` with your actual URL):

```powershell
$webhook = "YOUR_WEBHOOK_URL"
$body = @{
    email = "powershell-test@example.com"
    source = "direct-test"
    timestamp = (Get-Date).ToString("o")
} | ConvertTo-Json

Invoke-RestMethod -Uri $webhook -Method POST -Body $body -ContentType "application/json"
```

**Expected result**: 
- Make.com should IMMEDIATELY show this data
- PowerShell might show a response or nothing (that's OK)

**If Make.com receives this**: The webhook URL works, issue is in Cloudflare Workers code  
**If Make.com doesn't receive this**: The webhook URL or Make.com setup has an issue

---

## 🔍 Possible Issues

### Issue A: Make.com Webhook "Determine Data Structure" Mode

**Problem**: Make.com webhook is waiting in "determine data structure" mode but timing out

**Solution**:
1. Go to Make.com scenario
2. Click on the webhook module (first module)
3. Look for a button that says **"Re-determine data structure"** or **"Determine data structure"**
4. Click it
5. **Within 10 seconds**, submit the form at risivo.com
6. Make.com should catch the data

---

### Issue B: CORS or Cloudflare Worker Timeout

**Problem**: Cloudflare Worker might be timing out when calling Make.com

**Check**: Look in browser Console for:
```
[SUBSCRIBE] Sending to webhook...
[SUBSCRIBE] Webhook response status: ???
```

**If you don't see "Webhook response status"**: The fetch is timing out

**Solution**: We need to increase the timeout or make it fire-and-forget

---

### Issue C: Make.com Webhook URL Changed/Expired

**Problem**: The webhook URL you copied might be from an old/deleted scenario

**Solution**:
1. In Make.com, create a **BRAND NEW** webhook module
2. Copy the NEW webhook URL
3. Update Cloudflare:
   ```bash
   npx wrangler pages secret put WEBHOOK_URL --project-name risivo-coming-soon
   ```
4. Test again

---

### Issue D: Make.com Region/Account Issue

**Problem**: Webhook might be for a different Make.com account or region

**Check**: Your webhook URL should match your Make.com region:
- `https://hook.us1.make.com/...` (US)
- `https://hook.eu1.make.com/...` (Europe)
- `https://hook.eu2.make.com/...` (Europe 2)

---

## 🧪 Alternative Test: Use RequestBin

Let's see exactly what data is being sent:

### Step 1: Create a RequestBin
1. Go to: **https://requestbin.com** (or **https://webhook.site**)
2. Click **"Create a Request Bin"** (or copy the unique URL)
3. Copy the URL (e.g., `https://requestbin.com/r/xxxxx` or `https://webhook.site/xxxxx`)

### Step 2: Update Cloudflare to Send to RequestBin
```bash
npx wrangler pages secret put WEBHOOK_URL --project-name risivo-coming-soon
```
Paste the RequestBin URL when prompted

### Step 3: Test the Form
1. Go to https://risivo.com
2. Hard refresh (Ctrl+Shift+R)
3. Submit a test email

### Step 4: Check RequestBin
- Refresh the RequestBin page
- You should see the exact data being sent
- **SCREENSHOT it** and send to me

### Step 5: Update Back to Make.com URL
```bash
npx wrangler pages secret put WEBHOOK_URL --project-name risivo-coming-soon
```
Paste your Make.com URL again

---

## 🔧 Let Me Check the Code

There might be an issue with how the API handles errors. Let me create a test that shows more details:

### Enhanced Logging Version

I can create an updated version that logs MORE information so we can see exactly what's happening.

**Would you like me to**:
1. Add more detailed logging?
2. Add a test endpoint that shows the webhook URL (first 30 chars)?
3. Make the webhook call "fire-and-forget" so it doesn't block?

---

## 📊 What I Need From You NOW

Please send me:

### 1️⃣ Browser Console Screenshot
- F12 → Console tab
- After submitting form
- Look for `[SUBSCRIBE]` messages

### 2️⃣ Network Tab Screenshot
- F12 → Network tab
- Click on `subscribe` request
- Go to "Response" sub-tab

### 3️⃣ Make.com Screenshot
- Show the webhook module status
- Show if scenario is ON/OFF
- Show if there's "Determine data structure" button

### 4️⃣ Test Results
Run this in PowerShell (replace URL):
```powershell
$webhook = "YOUR_MAKE_WEBHOOK_URL"
$body = @{email = "test@example.com"} | ConvertTo-Json
Invoke-RestMethod -Uri $webhook -Method POST -Body $body -ContentType "application/json"
```

Tell me: Does Make.com receive this direct test?

---

## 🎯 Debug Checklist

Let's verify everything systematically:

- [ ] `/api/health` shows `webhookConfigured: true` ✅ (You confirmed)
- [ ] Form shows "Thank you!" message ✅ (You confirmed)
- [ ] Browser Console shows `[SUBSCRIBE]` messages - ❓ (Need screenshot)
- [ ] Network tab shows 200 response - ❓ (Need screenshot)
- [ ] Make.com scenario is ON - ❓ (Need confirmation)
- [ ] Webhook module shows "Waiting for data" - ❓ (Need confirmation)
- [ ] Direct PowerShell test works - ❓ (Need test)

---

## 🚀 Quick Alternative: Add Email to a Google Sheet

While we debug Make.com, would you like me to:
1. Add a fallback that also saves to a Google Sheet?
2. Add a fallback that sends an email notification?
3. Add detailed error logging so we can see what Make.com returns?

---

**Please send me the screenshots above so I can see exactly what's happening!** 🔍

The fact that `webhookConfigured: true` and the form submits means the code is running. We just need to see what Make.com is returning or why it's not receiving the data.

---

*Created: Dec 9, 2025 14:45 UTC*
