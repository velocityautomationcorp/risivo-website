# Troubleshooting Email Form Issues

## Current Issue
Email form shows: "⚠ Oops! Something went wrong. Please try again."

## Diagnostic Steps

### Step 1: Wait for Deployment (2-3 minutes)
The latest fix with debugging has been pushed. Wait for Cloudflare Pages to deploy:
- Check: https://dash.cloudflare.com/ → Workers & Pages → risivo-coming-soon → Deployments
- Latest commit: `27f429f - Add comprehensive debugging and health check endpoint`

### Step 2: Check API Health
Once deployed, open the browser console and visit:
```
https://www.risivo.com/api/health
```

You should see:
```json
{
  "status": "ok",
  "webhookConfigured": true,
  "timestamp": "2025-12-08T..."
}
```

**If `webhookConfigured` is `false`**, the WEBHOOK_URL environment variable is not set correctly.

### Step 3: Test with Browser Console Open

1. Open www.risivo.com
2. Open Browser DevTools (F12)
3. Go to **Console** tab
4. You should see on page load:
   ```
   [HEALTH CHECK] API Status: {status: "ok", webhookConfigured: true, ...}
   ```

5. Enter an email and click "NOTIFY ME"
6. Watch the console for detailed logs:
   ```
   [FORM] Submitting email: test@example.com
   [FORM] Sending to /api/subscribe...
   [FORM] Response status: 200
   [FORM] Response ok: true
   [FORM] Response data: {success: true, message: "..."}
   ```

### Step 4: Common Issues & Solutions

#### Issue: `webhookConfigured: false`

**Solution**: Reconfigure the webhook URL

```bash
# In your local terminal
cd C:\Users\Buzgrowth\Documents\risivo-website

# Set the secret (will prompt for value)
npx wrangler pages secret put WEBHOOK_URL --project-name risivo-coming-soon

# Or delete and recreate
npx wrangler pages secret delete WEBHOOK_URL --project-name risivo-coming-soon
npx wrangler pages secret put WEBHOOK_URL --project-name risivo-coming-soon
```

Then trigger a redeploy:
```bash
git commit --allow-empty -m "Trigger redeploy"
git push origin main
```

#### Issue: `[FORM] Response status: 503`
**Meaning**: Webhook URL is not configured
**Solution**: Follow "webhookConfigured: false" steps above

#### Issue: `[FORM] Response status: 400`
**Meaning**: Invalid email format
**Solution**: Check email validation logic

#### Issue: `[FORM] Response status: 500`
**Meaning**: Server error (webhook failed)
**Console logs will show**: 
```
[SUBSCRIBE] Webhook error response: ...
```

**Solutions**:
1. Check Make.com scenario is active
2. Verify webhook URL is correct
3. Test webhook directly:
   ```bash
   curl -X POST "YOUR_WEBHOOK_URL" \
     -H "Content-Type: application/json" \
     -d '{"email":"test@example.com","timestamp":"2025-12-08T12:00:00Z","source":"test"}'
   ```

#### Issue: Network error / "Failed to fetch"
**Meaning**: Cannot reach the API
**Solutions**:
1. Check internet connection
2. Check if Cloudflare is down
3. Try incognito/private browsing
4. Clear cache: Ctrl+Shift+Delete

### Step 5: Verify Webhook URL Format

The webhook URL should look like:
```
https://hook.us1.make.com/xxxxxxxxxxxxxxxxxxxxxxx
```

Or from other Make.com regions:
```
https://hook.eu1.make.com/xxxxxxxxxxxxxxxxxxxxxxx
https://hook.ap1.make.com/xxxxxxxxxxxxxxxxxxxxxxx
```

**Common mistakes**:
- ❌ Missing `https://`
- ❌ Extra spaces
- ❌ Truncated URL
- ❌ Scenario ID instead of webhook URL

### Step 6: Check Cloudflare Logs

View real-time logs:
```bash
npx wrangler pages deployment tail --project-name risivo-coming-soon
```

Or in dashboard:
1. Go to Cloudflare Dashboard
2. Workers & Pages → risivo-coming-soon
3. Click latest deployment
4. View logs

Look for:
- `[SUBSCRIBE] Email: ...` - Shows email was received
- `[SUBSCRIBE] Webhook configured: true/false` - Shows if env var is set
- `[SUBSCRIBE] Webhook response status: ...` - Shows webhook result

### Step 7: Test Make.com Webhook Directly

1. Get your webhook URL from Make.com
2. Test it with curl or Postman:

```bash
curl -X POST "https://hook.us1.make.com/YOUR_ID" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "timestamp": "2025-12-08T12:00:00Z",
    "source": "test"
  }'
```

3. Check Make.com scenario History tab
4. You should see execution with your test data

### Step 8: Verify Environment Variable in Cloudflare

Using Dashboard:
1. Go to https://dash.cloudflare.com/
2. Workers & Pages → risivo-coming-soon
3. Settings → Environment variables
4. Production → Variables

You should see:
- Name: `WEBHOOK_URL`
- Value: `********` (hidden)
- Type: `Secret`

**If missing**: Add it via dashboard or wrangler

### Step 9: Force Redeploy

Sometimes environment variables need a fresh deployment:

**Method 1 - Via Git**:
```bash
git commit --allow-empty -m "Force redeploy"
git push origin main
```

**Method 2 - Via Dashboard**:
1. Go to Deployments tab
2. Click "..." menu on latest deployment
3. Click "Retry deployment"

## Quick Diagnosis Checklist

Run through this checklist:

- [ ] Deployment finished (check Cloudflare dashboard)
- [ ] Visit /api/health shows `webhookConfigured: true`
- [ ] Browser console shows `[HEALTH CHECK]` logs
- [ ] Make.com scenario is **Active** (not paused)
- [ ] Webhook URL starts with `https://hook.`
- [ ] Environment variable is set in Cloudflare
- [ ] Tested webhook URL directly with curl (works)
- [ ] Browser console shows detailed `[FORM]` logs
- [ ] No CORS or network errors in console

## Expected Console Output (Success)

When everything works, you should see:

```
[HEALTH CHECK] API Status: {status: "ok", webhookConfigured: true, timestamp: "2025-12-08T21:45:00.000Z"}

[FORM] Submitting email: yourname@example.com
[FORM] Sending to /api/subscribe...
[FORM] Response status: 200
[FORM] Response ok: true
[FORM] Response data: {success: true, message: "Subscription successful"}
[FORM] Subscription successful!
```

## Still Not Working?

If you've tried everything above:

1. **Share the console logs**: Copy all `[HEALTH CHECK]`, `[FORM]`, and `[SUBSCRIBE]` logs
2. **Check Make.com**: Verify scenario ran and check execution details
3. **Verify project name**: Confirm it's `risivo-coming-soon`
4. **Test in incognito**: Rule out browser cache issues
5. **Check Cloudflare status**: Visit status.cloudflare.com

## Contact Information

If issue persists, provide:
- Screenshot of browser console showing all logs
- Screenshot of /api/health response
- Screenshot of Cloudflare environment variables page (blur values)
- Make.com scenario status (active/paused)
- Cloudflare deployment logs

---

**Last Updated**: December 8, 2025
**Latest Commit**: 27f429f
