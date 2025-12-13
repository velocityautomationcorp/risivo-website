# Make.com Social Media Integration Setup Guide

This guide will help you set up automatic social media posting using Make.com (formerly Integromat). This is the **fastest and easiest** way to post updates to LinkedIn, Facebook, Instagram, and X (Twitter).

---

## 🎯 **Overview**

When you create or edit an update in the Risivo Admin Dashboard and check the "Push update to social media channels" checkbox, the system will:

1. Send data to your Make.com webhook
2. Make.com receives the data and posts to all platforms
3. You get confirmation that the post was sent

**Total Setup Time: 30-45 minutes**

---

## 📋 **Prerequisites**

- [ ] Make.com account (free tier works fine - [Sign up here](https://www.make.com/en/register))
- [ ] Admin access to your social media accounts:
  - LinkedIn (showcase page admin)
  - Facebook (page admin)
  - Instagram (business account connected to Facebook)
  - X/Twitter (account access)

---

## 🚀 **Step 1: Create Make.com Account**

1. Go to: https://www.make.com/en/register
2. Sign up for a free account
3. Verify your email
4. Log in to Make.com dashboard

---

## 🔧 **Step 2: Create New Scenario**

1. Click **"Create a new scenario"** button
2. You'll see an empty canvas with a **"+"** icon

---

## 📡 **Step 3: Set Up Webhook Trigger**

### 3.1 Add Webhook Module

1. Click the **"+"** icon to add a module
2. Search for **"Webhooks"**
3. Select **"Webhooks"** app
4. Choose **"Custom webhook"**

### 3.2 Create Webhook

1. Click **"Add"** to create a new webhook
2. Give it a name: `Risivo Social Media Webhook`
3. Click **"Save"**
4. Make.com will generate a webhook URL like:
   ```
   https://hook.us1.make.com/xxxxxxxxxxxxxxxxx
   ```
5. **IMPORTANT:** Copy this webhook URL - you'll need it later!

### 3.3 Determine Data Structure

1. Click **"OK"** to close the webhook setup
2. Leave the scenario tab open - we'll test it later

---

## 📱 **Step 4: Connect LinkedIn**

### 4.1 Add LinkedIn Module

1. Click the **"+"** icon after the webhook
2. Search for **"LinkedIn"**
3. Select **"LinkedIn"** app
4. Choose **"Create a Company Share Update"** (or "Create a Share Update" depending on your account type)

### 4.2 Connect LinkedIn Account

1. Click **"Add"** next to "Connection"
2. Click **"Create a connection"**
3. Log in with your LinkedIn account
4. **Authorize** Make.com to post on your behalf
5. Select your company/showcase page: **risivo-crm**

### 4.3 Map LinkedIn Fields

Map the following fields from the webhook data:

- **Company ID:** Select your Risivo CRM showcase page
- **Text:** Map to `posts.linkedin.text`
- **Image URL (optional):** Map to `posts.linkedin.image_url`

**Alternative Mapping (simpler):**
- **Text:** 
  ```
  {{title}}
  
  {{excerpt}}
  
  Read more: {{update_url}}
  ```

---

## 📘 **Step 5: Connect Facebook**

### 5.1 Add Facebook Module

1. Click the **"+"** icon after LinkedIn module
2. Search for **"Facebook"**
3. Select **"Facebook Pages"**
4. Choose **"Create a Post"**

### 5.2 Connect Facebook Account

1. Click **"Add"** next to "Connection"
2. Click **"Create a connection"**
3. Log in with your Facebook account
4. **Authorize** Make.com
5. Grant permissions for **pages_manage_posts** and **pages_read_engagement**

### 5.3 Map Facebook Fields

- **Page:** Select **"risivocrm"** page
- **Message:** Map to `posts.facebook.message`
- **Link:** Map to `posts.facebook.link` or `update_url`
- **Picture URL (optional):** Map to `posts.facebook.picture`

---

## 📸 **Step 6: Connect Instagram**

### 6.1 Add Instagram Module

1. Click the **"+"** icon after Facebook module
2. Search for **"Instagram"**
3. Select **"Instagram Business"**
4. Choose **"Create a Photo Post"** (Instagram requires images)

### 6.2 Connect Instagram Account

1. **IMPORTANT:** Your Instagram account must be a Business account
2. It must be connected to your Facebook Page
3. Click **"Add"** next to "Connection"
4. Select the same Facebook connection (Instagram uses Facebook API)
5. Select your Instagram Business account

### 6.3 Map Instagram Fields

- **Instagram Account:** Select **"risivocrm"**
- **Image URL:** Map to `posts.instagram.image_url` or `featured_image`
- **Caption:** Map to `posts.instagram.caption`

### 6.4 Add Filter (Optional but Recommended)

Since Instagram requires an image, add a filter before the Instagram module:

1. Click the wrench icon between Facebook and Instagram modules
2. Select **"Set up a filter"**
3. Condition: `featured_image` **exists**
4. Label: "Only if image exists"

This prevents errors when there's no image.

---

## 🐦 **Step 7: Connect X (Twitter)**

### 7.1 Add X/Twitter Module

1. Click the **"+"** icon after Instagram module
2. Search for **"Twitter"** or **"X"**
3. Select **"Twitter"** app
4. Choose **"Create a Tweet"**

### 7.2 Connect X/Twitter Account

1. Click **"Add"** next to "Connection"
2. Click **"Create a connection"**
3. Log in with your X/Twitter account (@risivocrm)
4. **Authorize** Make.com

### 7.3 Map X/Twitter Fields

- **Status (Tweet Text):** Map to `posts.x.text`
- **Media URL (optional):** Map to `posts.x.media_url`

---

## ⚙️ **Step 8: Add Error Handling (Optional but Recommended)**

### 8.1 Add Error Handler to Each Platform

For each social media module (LinkedIn, Facebook, Instagram, X):

1. Right-click on the module
2. Select **"Add error handler"**
3. Choose **"Ignore"** (so one platform failing doesn't stop others)
4. Or choose **"Email"** to get notified of errors

---

## 🧪 **Step 9: Test the Integration**

### 9.1 Send Test Data

Now we need to send test data to the webhook to map fields properly:

**Option A: Use Risivo Test Endpoint**

1. First, deploy your Risivo updates with the webhook URL (Step 11)
2. Then go to: `https://risivo.com/api/social-media/test`
3. Click **"Send Test"**

**Option B: Use Postman or cURL**

```bash
curl -X POST https://hook.us1.make.com/YOUR_WEBHOOK_ID \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Post from Risivo",
    "content": "This is a test post.",
    "excerpt": "Test excerpt",
    "slug": "test-post",
    "update_url": "https://risivo.com/updates/view/test-post",
    "featured_image": "https://example.com/image.jpg",
    "tags": ["test"],
    "posts": {
      "linkedin": {
        "text": "Test Post from Risivo\n\nTesting Make.com integration\n\nRead more: https://risivo.com/updates/view/test-post"
      },
      "facebook": {
        "message": "Test Post from Risivo",
        "link": "https://risivo.com/updates/view/test-post"
      },
      "instagram": {
        "caption": "Test Post from Risivo #test",
        "image_url": "https://example.com/image.jpg"
      },
      "x": {
        "text": "Test Post from Risivo 🚀"
      }
    }
  }'
```

### 9.2 Check Make.com Scenario

1. Go back to your Make.com scenario
2. You should see the webhook received data
3. Now you can properly map all fields in each module
4. Click **"OK"** on each module after mapping

---

## ✅ **Step 10: Activate the Scenario**

1. Click the **"Scheduling"** toggle (bottom left)
2. Set it to **"Immediately"** (processes webhook data as it arrives)
3. Click **"Save"** (top right)
4. Toggle the scenario **"ON"** (switch in top left)
5. Your scenario is now active! 🎉

---

## 🔐 **Step 11: Add Webhook URL to Cloudflare**

Now add your Make.com webhook URL to Risivo:

1. Go to: https://dash.cloudflare.com
2. Navigate to: **Workers & Pages** → **risivo-production**
3. Click: **Settings** → **Environment variables**
4. Click: **Add variable**
5. Add:
   - **Variable name:** `MAKE_WEBHOOK_URL`
   - **Value:** Your webhook URL from Step 3.2
   - **Environment:** Production
6. Click **"Save"**
7. **Redeploy** your application

---

## 🧪 **Step 12: Test End-to-End**

### 12.1 Test via API

```bash
curl -X POST https://risivo.com/api/social-media/test \
  -H "Content-Type: application/json"
```

Expected response:
```json
{
  "success": true,
  "message": "Test post sent successfully to Make.com",
  "webhook_response": { ... }
}
```

### 12.2 Test via Admin Dashboard

1. Go to: https://risivo.com/updates/admin/login
2. Log in with your admin credentials
3. Create a new test update
4. Check the **"Push update to social media channels"** checkbox
5. Set status to **"Published"**
6. Click **"Save"**
7. Check each social media platform to verify the post appeared

---

## 📊 **Step 13: Monitor Your Scenario**

### View Execution History

1. Go to your Make.com scenario
2. Click **"History"** tab (bottom)
3. You'll see all executions with status (success/error)
4. Click on any execution to see details

### Check for Errors

- Green checkmark = Success
- Red X = Error (click to see details)
- Yellow warning = Partial success

---

## 🛠️ **Troubleshooting**

### Webhook Not Receiving Data

1. Check that `MAKE_WEBHOOK_URL` is set correctly in Cloudflare
2. Verify the webhook URL is correct (no extra spaces)
3. Check Cloudflare Workers logs for errors

### LinkedIn Not Posting

1. Verify you selected the correct company/showcase page
2. Check that your LinkedIn account has admin access
3. Ensure the text is not empty

### Facebook Not Posting

1. Check that you have admin rights to the Facebook page
2. Verify the page name is correct ("risivocrm")
3. Check that the message field is mapped correctly

### Instagram Not Posting

1. **Instagram requires an image** - Check that `featured_image` exists
2. Verify your Instagram account is a Business account
3. Check that it's connected to your Facebook page
4. Add the filter mentioned in Step 6.4

### X/Twitter Not Posting

1. Verify you're logged into the correct account (@risivocrm)
2. Check that the tweet text is under 280 characters
3. Ensure you authorized Make.com properly

### "Webhook URL not configured" Error

1. Go to Cloudflare environment variables
2. Verify `MAKE_WEBHOOK_URL` exists and has the correct value
3. Redeploy the application after adding the variable

---

## 💰 **Make.com Pricing & Limits**

### Free Tier
- 1,000 operations per month
- 15-minute interval (immediate for webhooks)
- 2 active scenarios
- **Perfect for your use case!**

### If You Need More
- **Core Plan:** $9/month (10,000 operations)
- **Pro Plan:** $16/month (40,000 operations)
- **Teams Plan:** $29/month (130,000 operations)

**Note:** Each social media post = 1 operation per platform (4 operations total per update)

---

## 📈 **Scaling Tips**

### Add More Platforms Later

You can easily add more platforms to your scenario:
- TikTok
- Pinterest  
- Reddit
- Discord
- Slack notifications
- Email notifications

Just add more modules to your existing scenario!

### Add Scheduling

Want to schedule posts for specific times?
1. Add a **"Data Store"** module to save posts
2. Add a **"Schedule"** module to trigger at specific times
3. Retrieve from data store and post

---

## 🎉 **You're Done!**

Your Risivo platform is now connected to Make.com and ready to automatically post to:
- ✅ LinkedIn (risivo-crm showcase)
- ✅ Facebook (risivocrm)
- ✅ Instagram (@risivocrm)
- ✅ X/Twitter (@risivocrm)

Every time you create or edit an update and check the social media box, it will automatically post to all platforms! 🚀

---

## 📞 **Need Help?**

- **Make.com Support:** https://www.make.com/en/help
- **Make.com Community:** https://community.make.com/
- **Video Tutorials:** https://www.make.com/en/academy

---

## 🔄 **API Endpoints Reference**

### Health Check
```bash
GET https://risivo.com/api/social-media/health
```

Returns webhook configuration status.

### Test Post
```bash
POST https://risivo.com/api/social-media/test
```

Sends a test post to Make.com webhook.

### Actual Post (Called automatically)
```bash
POST https://risivo.com/api/social-media/post
```

Called automatically when you create/edit an update with the social media checkbox checked.

---

**Happy Posting! 🎊**
