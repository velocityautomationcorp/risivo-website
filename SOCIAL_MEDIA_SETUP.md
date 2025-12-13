# Social Media Auto-Post Setup Guide

This guide explains how to set up automatic posting to social media platforms when creating updates.

## Overview

When creating or editing an update in the Admin Dashboard, you can check the "Push update to social media channels" checkbox. If checked and the update status is "published", the system will automatically post to:

- **LinkedIn**: https://www.linkedin.com/showcase/risivo-crm/
- **Facebook**: https://www.facebook.com/risivocrm
- **Instagram**: https://www.instagram.com/risivocrm/
- **X (Twitter)**: https://x.com/risivocrm

## Required Environment Variables

Add these environment variables to your Cloudflare Pages project (`risivo-production`):

### LinkedIn

1. **LINKEDIN_ACCESS_TOKEN**
   - Go to: https://www.linkedin.com/developers/
   - Create an app for your organization
   - Request access to "Share on LinkedIn" and "Marketing Developer Platform"
   - Generate an access token with `w_organization_social` permission
   - Token format: `AQV...` (long alphanumeric string)
   - **Note**: You also need to get your Organization URN (format: `urn:li:organization:XXXXXXX`)
     - Replace `YOUR_LINKEDIN_ORG_ID` in `/src/routes/social-media.ts` line 34 with your actual org ID

### Facebook

2. **FACEBOOK_ACCESS_TOKEN**
   - Go to: https://developers.facebook.com/
   - Create a Facebook App
   - Add "Pages" product
   - Generate a Page Access Token with `pages_manage_posts` and `pages_read_engagement` permissions
   - Token format: Long string starting with `EAA...`

3. **FACEBOOK_PAGE_ID**
   - Get your Page ID from: https://www.facebook.com/risivocrm/about
   - Or use Graph API Explorer: https://developers.facebook.com/tools/explorer/
   - Format: Numeric ID (e.g., `123456789012345`)

### Instagram

4. **INSTAGRAM_ACCESS_TOKEN**
   - Same as Facebook Access Token (Instagram Business accounts use Facebook's API)
   - Ensure your Facebook Page is connected to an Instagram Business Account

5. **INSTAGRAM_BUSINESS_ACCOUNT_ID**
   - Get via Facebook Graph API Explorer
   - Query: `GET /{page-id}?fields=instagram_business_account`
   - Format: Numeric ID (e.g., `1234567890`)

### X (Twitter)

6. **X_API_KEY**
   - Go to: https://developer.twitter.com/
   - Create a Project and App
   - Navigate to "Keys and tokens"
   - Copy the "API Key"
   - Format: Alphanumeric string (e.g., `abcd1234...`)

7. **X_API_KEY_SECRET**
   - Same location as X_API_KEY
   - Copy the "API Key Secret"
   - Format: Alphanumeric string

8. **X_ACCESS_TOKEN**
   - Same location, under "Access Token and Secret"
   - Generate if not already created
   - Format: Alphanumeric string

9. **X_ACCESS_TOKEN_SECRET**
   - Same location as X_ACCESS_TOKEN
   - Format: Alphanumeric string

**Note**: X (Twitter) API requires OAuth 1.0a authentication which is complex. For the initial implementation, you may want to use Make.com or Zapier webhook integration instead.

## How to Add Environment Variables to Cloudflare

1. Go to: https://dash.cloudflare.com
2. Navigate to: **Workers & Pages** → **risivo-production**
3. Click on: **Settings** → **Environment variables**
4. Click: **Add variable**
5. For each variable above:
   - Enter the **Variable name** (exact names as listed above)
   - Enter the **Value** (your token/ID)
   - Select: **Production** environment
   - Click **Save**
6. After adding all variables, **redeploy** your application

## API Endpoints

### Health Check
```
GET /api/social-media/health
```

Returns the status of configured platforms:
```json
{
  "status": "ok",
  "platforms": {
    "linkedin": "https://www.linkedin.com/showcase/risivo-crm/",
    "facebook": "https://www.facebook.com/risivocrm",
    "instagram": "https://www.instagram.com/risivocrm/",
    "x": "https://x.com/risivocrm"
  },
  "configured": {
    "linkedin": true,
    "facebook": true,
    "instagram": true,
    "x": false
  }
}
```

### Manual Post
```
POST /api/social-media/post
```

Request body:
```json
{
  "title": "Update Title",
  "content": "Full content...",
  "excerpt": "Short excerpt",
  "slug": "update-slug",
  "featured_image": "https://example.com/image.jpg",
  "tags": ["crm", "update"]
}
```

Response:
```json
{
  "success": true,
  "posted_to": 3,
  "total_platforms": 4,
  "results": {
    "linkedin": {
      "success": true,
      "platform_post_id": "urn:li:share:123456"
    },
    "facebook": {
      "success": true,
      "platform_post_id": "123456789_987654321"
    },
    "instagram": {
      "success": true,
      "platform_post_id": "18123456789012345"
    },
    "x": {
      "success": false,
      "error": "X (Twitter) credentials not configured"
    }
  }
}
```

## Testing

After setting up environment variables:

1. **Test Health Check**
   ```bash
   curl https://risivo.com/api/social-media/health
   ```

2. **Create a Test Update**
   - Log into Admin Dashboard: https://risivo.com/updates/admin/login
   - Create a new update
   - Check "Push update to social media channels"
   - Set status to "Published"
   - Submit

3. **Verify Posts**
   - Check each social media platform to confirm the post appeared
   - Review the response JSON for any error messages

## Alternative: Make.com Integration (Recommended for X/Twitter)

If direct API integration is too complex (especially for X/Twitter), you can use Make.com:

1. Create a Make.com scenario
2. Set up a Webhook trigger
3. Add modules for:
   - LinkedIn (using HTTP module with OAuth)
   - Facebook (using Facebook module)
   - Instagram (using Instagram Business module)
   - X/Twitter (using Twitter module)

4. Update the social media endpoint to call your Make.com webhook:
   ```typescript
   const response = await fetch('YOUR_MAKE_COM_WEBHOOK_URL', {
     method: 'POST',
     headers: { 'Content-Type': 'application/json' },
     body: JSON.stringify(socialMediaPayload)
   });
   ```

## Troubleshooting

### Platform Not Posting

1. **Check Environment Variables**
   - Verify all required variables are set in Cloudflare
   - Confirm there are no typos in variable names

2. **Check Token Expiration**
   - Facebook/Instagram tokens expire after 60 days
   - LinkedIn tokens expire based on your app settings
   - Refresh tokens as needed

3. **Check API Permissions**
   - Ensure your app has the required scopes/permissions
   - Re-authorize if permissions changed

4. **Review Logs**
   - Check Cloudflare Workers logs for error messages
   - Review social media platform API error responses

### Image Not Posting

- Instagram **requires** an image - text-only posts won't work
- Ensure `featured_image_url` is a publicly accessible URL
- Image must meet platform requirements (size, format, etc.)

## Support

For issues:
1. Check the `/api/social-media/health` endpoint
2. Review Cloudflare Worker logs
3. Test API tokens using platform-specific API explorers
4. Contact platform developer support if needed

## Security Notes

- **Never commit tokens to Git**
- Store all credentials as Cloudflare environment variables
- Rotate tokens regularly
- Use production environment variables only for production
- Monitor API usage to avoid rate limits
