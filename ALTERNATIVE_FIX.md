# 🔧 Alternative Fix - Bypass Wrangler Secret

## The Real Problem

The webhook URL you're pasting is clean:
```
https://hook.us2.make.com/rivwbr5agatlhhw212ly42qvxp60u56a
```

But Cloudflare is somehow storing it with a `\x16` control character.

This might be a bug with `wrangler pages secret` command.

---

## ✅ Solution: Use Cloudflare Dashboard Instead

### Step 1: Go to Cloudflare Dashboard

1. Go to: https://dash.cloudflare.com
2. Click **Pages** in the left menu
3. Click **risivo-coming-soon**
4. Go to **Settings** tab
5. Scroll to **Environment variables**

### Step 2: Delete Old WEBHOOK_URL

1. Find `WEBHOOK_URL` in the list
2. Click the **⋮** (three dots) or **Edit**
3. Click **Delete** or **Remove**
4. Confirm deletion

### Step 3: Add Fresh WEBHOOK_URL via Dashboard

1. Click **"Add variable"** or **"+ Add"**
2. **Variable name**: `WEBHOOK_URL`
3. **Value**: `https://hook.us2.make.com/rivwbr5agatlhhw212ly42qvxp60u56a`
4. **Environment**: Select **Production**
5. Click **Save** or **Encrypt and Save**

### Step 4: Trigger New Deployment

Environment variables only update with new deployments:

```bash
cd C:\Users\Buzgrowth\Documents\risivo-website
npm run build
npx wrangler pages deploy dist --project-name risivo-coming-soon --branch main
```

---

## 🎯 Alternative: Use wrangler.toml File

Instead of secrets, use a config file:

### Step 1: Create wrangler.toml

Create file: `C:\Users\Buzgrowth\Documents\risivo-website\wrangler.toml`

```toml
name = "risivo-coming-soon"
compatibility_date = "2024-12-09"

[vars]
WEBHOOK_URL = "https://hook.us2.make.com/rivwbr5agatlhhw212ly42qvxp60u56a"
```

### Step 2: Deploy

```bash
npm run build
npx wrangler pages deploy dist --project-name risivo-coming-soon
```

This will use the URL from the file instead of the secret.

---

## 🧪 Test Direct Connection First

Let's verify the URL works from Cloudflare Workers:

### Test Script:

Create `test-webhook.js`:
```javascript
export default {
  async fetch(request) {
    const webhookUrl = "https://hook.us2.make.com/rivwbr5agatlhhw212ly42qvxp60u56a"
    
    try {
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'cloudflare-test@example.com',
          source: 'direct-test'
        })
      })
      
      return new Response(`Status: ${response.status}\nBody: ${await response.text()}`)
    } catch (e) {
      return new Response(`Error: ${e.message}`)
    }
  }
}
```

Deploy as a test worker:
```bash
npx wrangler pages deploy test-webhook.js --project-name test-webhook-debug
```

---

## 🔍 Debug: Show Actual Environment Variable

Let me add code to show what's actually stored:

```javascript
app.get('/api/debug-webhook', (c) => {
  const webhookUrl = c.env?.WEBHOOK_URL || ''
  
  // Show hex representation to see hidden characters
  const hexString = Array.from(webhookUrl)
    .map(char => char.charCodeAt(0).toString(16).padStart(2, '0'))
    .join(' ')
  
  return c.json({
    hasWebhook: !!webhookUrl,
    length: webhookUrl.length,
    first40: webhookUrl.substring(0, 40),
    hexFirst40: hexString.substring(0, 120),
    allCharCodes: Array.from(webhookUrl.substring(0, 50)).map(c => c.charCodeAt(0))
  })
})
```

This will show us exactly what's in the environment variable, byte by byte.

---

## 💡 Hypothesis

The `\x16` character might be getting added by:
1. Wrangler command line processing
2. PowerShell encoding
3. Clipboard manager
4. Windows terminal encoding

**Solution**: Use Cloudflare Dashboard instead of CLI.

---

## ⚡ Do This NOW

### Quick Fix (5 minutes):

1. **Cloudflare Dashboard**:
   - Delete WEBHOOK_URL variable
   - Add it again via dashboard (not CLI)
   - Type the URL manually if needed

2. **Redeploy**:
   ```bash
   npm run build
   npx wrangler pages deploy dist --project-name risivo-coming-soon --branch main
   ```

3. **Test**: Visit https://risivo.com and submit email

---

**Try the Cloudflare Dashboard method - bypassing Wrangler CLI completely!** 🚀

The `\x16` is definitely coming from the storage process, not your clipboard.
