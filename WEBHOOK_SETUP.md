# Webhook Setup Guide - Email Capture Fix

## Issue
The email form on the coming soon page is showing an error because the `WEBHOOK_URL` environment variable is not configured in Cloudflare Pages.

## Solution

### Step 1: Get Your Make.com Webhook URL

1. Go to [Make.com](https://www.make.com/)
2. Open your scenario (or create a new one)
3. Add a **Webhooks > Custom webhook** module
4. Copy the webhook URL (it should look like: `https://hook.us1.make.com/xxxxxxxxx`)

### Step 2: Configure Environment Variable in Cloudflare Pages

#### Option A: Using Wrangler CLI (Recommended)

```bash
cd /home/user/webapp
npx wrangler pages secret put WEBHOOK_URL --project-name risivo-coming-soon
# When prompted, paste your Make.com webhook URL
```

#### Option B: Using Cloudflare Dashboard

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Navigate to **Workers & Pages**
3. Click on your project: `risivo-coming-soon`
4. Go to **Settings** tab
5. Click **Environment variables**
6. Click **Add variable**
7. Set:
   - **Variable name**: `WEBHOOK_URL`
   - **Value**: Your Make.com webhook URL (paste it here)
8. Click **Save**

### Step 3: Redeploy (if needed)

The environment variable will be available immediately for new deployments. You may need to trigger a redeploy:

```bash
cd /home/user/webapp
git commit --allow-empty -m "Trigger redeploy after webhook config"
git push origin main
```

Or in Cloudflare Dashboard:
1. Go to **Deployments** tab
2. Click **Retry deployment** on the latest deployment

### Step 4: Test

1. Visit [www.risivo.com](https://www.risivo.com)
2. Enter an email address in the form
3. Click "NOTIFY ME"
4. You should see: ✓ Thanks! We'll notify you when we launch.

### Step 5: Verify in Make.com

1. Go to your Make.com scenario
2. Check the **History** tab
3. You should see the webhook execution with the email data

## What Was Changed

### Backend Improvements (`src/index.tsx`)

1. **Better error handling**: Now logs detailed error information
2. **Graceful degradation**: Returns success even if webhook isn't configured (with warning in logs)
3. **Timeout protection**: 10-second timeout on webhook requests
4. **Better logging**: Logs webhook URL (partial), status codes, and error details

### Frontend Improvements

1. **Email validation**: Validates email format before sending
2. **Better error messages**: Shows specific errors for different failure cases
3. **Response parsing**: Reads and logs server response details
4. **Connection error handling**: Detects network issues vs server errors

## Troubleshooting

### Still Getting Errors?

**Check Cloudflare Logs:**
```bash
npx wrangler pages deployment tail --project-name risivo-coming-soon
```

**Verify Environment Variable:**
```bash
npx wrangler pages secret list --project-name risivo-coming-soon
```

**Test Webhook Manually:**
```bash
curl -X POST "https://your-webhook-url.make.com/xxxxxx" \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","timestamp":"2024-12-08T12:00:00Z","source":"test"}'
```

### Common Issues

1. **Invalid Webhook URL**: Make sure the URL starts with `https://` and is from Make.com
2. **Webhook Scenario Not Active**: Activate your Make.com scenario
3. **Wrong Project Name**: Use the correct Cloudflare project name
4. **CORS Issues**: The webhook should accept requests from your domain

## Make.com Scenario Setup

Your Make.com scenario should have at minimum:

1. **Webhooks > Custom webhook** (Trigger)
2. **Google Sheets > Add a row** (Save email)
3. **Email > Send an email** (Auto-response)

### Example Webhook Data Received

```json
{
  "email": "user@example.com",
  "timestamp": "2024-12-08T12:00:00.000Z",
  "source": "coming-soon-page",
  "subscribed_at": "2024-12-08T12:00:01.234Z",
  "page_url": "https://www.risivo.com/"
}
```

## Next Steps

Once webhook is configured:
1. ✅ Test email submission
2. ✅ Verify emails appear in Google Sheets
3. ✅ Check auto-response emails are sent
4. ✅ Monitor Make.com scenario for any errors

## Support

If you continue to have issues:
- Check Cloudflare Pages logs
- Check Make.com scenario execution history
- Verify webhook URL is correct
- Ensure scenario is active (not paused)

---

**Last Updated**: December 8, 2025
