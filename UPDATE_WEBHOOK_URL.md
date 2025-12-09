# 🔄 Update Make.com Webhook URL

## Quick Instructions

You need to update the `WEBHOOK_URL` environment variable in Cloudflare Pages for your production site.

---

## Step 1: Get Your New Webhook URL

From Make.com:
1. Go to your Make.com scenario
2. Find the webhook module
3. Copy the new webhook URL (looks like: `https://hook.us1.make.com/xxxxxxxxxxxxx`)

---

## Step 2: Update Production Environment Variable

Open **Command Prompt** or **PowerShell** and run:

```bash
npx wrangler pages secret put WEBHOOK_URL --project-name risivo-coming-soon
```

**What happens**:
- You'll be prompted: `Enter a secret value:`
- Paste your new Make.com webhook URL
- Press Enter

**Expected output**:
```
🌀 Creating the secret for the Pages project "risivo-coming-soon"
✨ Success! Uploaded secret WEBHOOK_URL
```

---

## Step 3: Verify the Update

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

---

## Step 4: Test the Email Form

**No redeployment needed!** Environment variables take effect immediately.

1. Visit: **https://risivo.com**
2. Hard refresh: **Ctrl + Shift + R**
3. Enter a test email
4. Click **"NOTIFY ME"**
5. Check your Make.com scenario - should see the webhook triggered

---

## If You Also Need to Update Staging

If you're using Make.com webhooks on the staging site too:

```bash
npx wrangler pages secret put WEBHOOK_URL --project-name risivo-staging
```

Then paste your webhook URL when prompted.

---

## Verify Webhook is Working

### Option 1: Check Make.com
- Go to your Make.com scenario
- Check the execution history
- Should see new entries when form is submitted

### Option 2: Check API Health Endpoint

Visit: https://risivo.com/api/health

Should return:
```json
{
  "status": "healthy",
  "environment": "production",
  "webhookConfigured": true
}
```

If `webhookConfigured: false`, the environment variable isn't set correctly.

---

## Troubleshooting

### Error: "Not authenticated"

Run this first to login:
```bash
npx wrangler login
```

Then try the `secret put` command again.

### Error: "Project not found"

Make sure you're using the correct project name:
- **Production**: `risivo-coming-soon`
- **Staging**: `risivo-staging`

### Webhook Not Triggering

1. **Check the URL is correct**: Make sure you copied the entire URL from Make.com
2. **Check Make.com scenario is ON**: Ensure your scenario is activated
3. **Check API endpoint**: Visit `https://risivo.com/api/health` to verify webhook is configured

---

## Summary Commands

```bash
# Update production webhook
npx wrangler pages secret put WEBHOOK_URL --project-name risivo-coming-soon

# Update staging webhook (if needed)
npx wrangler pages secret put WEBHOOK_URL --project-name risivo-staging

# Verify production
npx wrangler pages secret list --project-name risivo-coming-soon

# Verify staging
npx wrangler pages secret list --project-name risivo-staging

# Test production
# Visit: https://risivo.com/api/health
```

---

## Important Notes

✅ **No deployment needed** - Environment variables update immediately  
✅ **Changes take effect instantly** - Just refresh the page  
✅ **Old URL is completely replaced** - Not merged or cached  
✅ **Secure** - The value is encrypted and never visible in logs  

---

## What This Does

The `WEBHOOK_URL` environment variable is used in `/api/subscribe` endpoint:

```javascript
// When user submits email form
const webhookUrl = c.env.WEBHOOK_URL

// Send email to your Make.com webhook
await fetch(webhookUrl, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email })
})
```

---

**Time Required**: 2 minutes  
**Deployment Needed**: No  
**Takes Effect**: Immediately

---

*Last Updated: Dec 9, 2025*
