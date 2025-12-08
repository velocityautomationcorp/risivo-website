# 🚀 Risivo Coming Soon Page - Complete Deployment Guide

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Local Testing](#local-testing)
3. [Manual Deployment to Cloudflare Pages](#manual-deployment)
4. [Auto-Deployment Setup (GitHub Integration)](#auto-deployment)
5. [Webhook Configuration (Make.com)](#webhook-configuration)
6. [Custom Domain Setup](#custom-domain)
7. [Making Changes After Deployment](#making-changes)
8. [Common Issues & Solutions](#troubleshooting)

---

## 📋 Prerequisites

Before you begin, make sure you have:

- ✅ Cloudflare account (free or paid)
- ✅ Cloudflare API Token configured
- ✅ GitHub account with repository access
- ✅ Make.com account (for email automation)
- ✅ Node.js installed locally (v18 or higher)
- ✅ Git installed locally

---

## 🧪 Local Testing

Before deploying, test everything locally:

### Step 1: Clone the Repository
```bash
git clone https://github.com/velocityautomationcorp/risivo-website.git
cd risivo-website
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Create Local Environment File
Create `.dev.vars` file for local testing:
```bash
# .dev.vars
WEBHOOK_URL=https://hook.us1.make.com/your-webhook-url-here
```

### Step 4: Test Locally
```bash
npm run dev
```

Open browser: `http://localhost:8787`

Test the email form to ensure it works.

---

## 🌐 Manual Deployment to Cloudflare Pages

### Step 1: Setup Cloudflare API Token

**Already completed** - You've configured your Cloudflare API token.

Verify authentication:
```bash
npx wrangler whoami
```

Expected output:
```
Getting User settings...
👋 You are logged in with your API Token
```

### Step 2: Create Cloudflare Pages Project

**First time only:**
```bash
npx wrangler pages project create risivo-coming-soon \
  --production-branch main \
  --compatibility-date 2024-01-01
```

**Important:** If the name `risivo-coming-soon` is taken, try:
- `risivo-website`
- `risivo-launch`
- `risivo-soon`
- `risivo-coming-soon-2`

Remember the project name you used!

### Step 3: Build the Project
```bash
npm run build
```

This creates the `dist/` folder with compiled code.

### Step 4: Deploy to Cloudflare Pages
```bash
npx wrangler pages deploy dist --project-name risivo-coming-soon
```

Replace `risivo-coming-soon` with your actual project name.

### Step 5: Note Your Deployment URLs

After successful deployment, you'll see:
```
✨ Deployment complete!
✨ Production URL: https://risivo-coming-soon.pages.dev
```

**You'll get TWO URLs:**
1. **Production URL**: `https://risivo-coming-soon.pages.dev` (main deployment)
2. **Preview URL**: `https://main.risivo-coming-soon.pages.dev` (branch-specific)

### Step 6: Configure Webhook URL (Environment Variable)

Add your Make.com webhook URL:

```bash
npx wrangler pages secret put WEBHOOK_URL --project-name risivo-coming-soon
```

When prompted, paste your Make.com webhook URL:
```
https://hook.us1.make.com/your-webhook-url-here
```

**Verify it's set:**
```bash
npx wrangler pages secret list --project-name risivo-coming-soon
```

### Step 7: Test Your Deployment

1. Open your production URL: `https://risivo-coming-soon.pages.dev`
2. Enter a test email in the form
3. Click "Notify Me"
4. Check Make.com scenario - should receive the webhook data

---

## 🔄 Auto-Deployment Setup (GitHub Integration)

Set up automatic deployments so every push to GitHub auto-deploys!

### Step 1: Connect GitHub to Cloudflare

1. Go to **Cloudflare Dashboard**: https://dash.cloudflare.com/
2. Click **Workers & Pages** in sidebar
3. Click **Create application** → **Pages** tab
4. Click **Connect to Git**
5. Select **GitHub**
6. Authorize Cloudflare access to your GitHub

### Step 2: Select Repository

1. Choose: `velocityautomationcorp/risivo-website`
2. Click **Begin setup**

### Step 3: Configure Build Settings

Fill in these settings:

**Project name:** `risivo-coming-soon` (or your chosen name)

**Production branch:** `main`

**Build settings:**
- **Framework preset:** None
- **Build command:** `npm run build`
- **Build output directory:** `dist`
- **Root directory:** `/` (leave blank)

**Node.js version:** `18` or higher

### Step 4: Add Environment Variables

Before deploying, click **Add variable**:

| Variable Name | Value |
|--------------|-------|
| `WEBHOOK_URL` | `https://hook.us1.make.com/your-webhook-url` |
| `NODE_VERSION` | `18` |

### Step 5: Deploy

Click **Save and Deploy**

Wait 1-2 minutes for the first build.

### Step 6: Verify Auto-Deployment

**Test it:**
1. Make a small change to `README.md` locally
2. Commit and push:
   ```bash
   git add README.md
   git commit -m "test: Testing auto-deployment"
   git push origin main
   ```
3. Go to Cloudflare Dashboard → Your Pages project → **Deployments**
4. You should see a new deployment starting automatically!

**From now on:**
- Every push to `main` branch = auto-deploy
- Takes ~1-2 minutes per deployment
- No manual `wrangler pages deploy` needed

---

## 🪝 Webhook Configuration (Make.com Integration)

### Step 1: Create Make.com Scenario

1. Go to https://www.make.com/
2. Click **Create a new scenario**
3. Give it a name: "Risivo Coming Soon - Email Capture"

### Step 2: Add Webhook Trigger

1. Click the **+** button
2. Search for **Webhooks**
3. Select **Custom webhook**
4. Click **Add** to create a new webhook
5. Name it: "Risivo Email Subscription"
6. Click **Save**
7. Copy the webhook URL (starts with `https://hook.us1.make.com/...`)

### Step 3: Configure Webhook in Cloudflare

Use the webhook URL from Step 2:

```bash
npx wrangler pages secret put WEBHOOK_URL --project-name risivo-coming-soon
# Paste your webhook URL when prompted
```

### Step 4: Build Your Make.com Automation

**Module 1: Webhook** (already added)
- Receives data: `email`, `timestamp`, `source`

**Module 2: Google Sheets - Add a Row**
1. Add **Google Sheets** module
2. Choose **Add a Row**
3. Connect your Google account
4. Select your spreadsheet
5. Select sheet name (e.g., "Email Subscribers")
6. Map fields:
   - Email: `{{1.email}}`
   - Timestamp: `{{1.timestamp}}`
   - Source: `{{1.source}}`
   - Subscribed At: `{{1.subscribed_at}}`

**Module 3: Email - Send an Email** (Optional - using Gmail, SendGrid, etc.)
1. Add **Gmail** or **Email** module
2. Choose **Send an Email**
3. Configure:
   - **To:** `{{1.email}}`
   - **Subject:** "Thanks for subscribing to Risivo!"
   - **Content:** Your welcome email template

**Example Email Template:**
```html
Hi there!

Thank you for subscribing to Risivo updates!

We're building something amazing, and we can't wait to share it with you on March 1st, 2026.

You'll be among the first to know when we launch.

Best regards,
The Risivo Team

https://www.risivo.com
```

### Step 5: Test Your Webhook

1. In Make.com scenario, click **Run once**
2. Go to your coming soon page
3. Submit a test email
4. Check Make.com - should show "Successfully processed"
5. Check your Google Sheet - should have new row
6. Check email inbox - should receive welcome email

### Step 6: Activate Scenario

Click **ON** toggle in Make.com to activate the scenario.

**Now it runs automatically every time someone subscribes!**

---

## 🌐 Custom Domain Setup (www.risivo.com)

### Step 1: Add Custom Domain in Cloudflare

1. Go to **Cloudflare Dashboard**
2. Navigate to **Workers & Pages** → Your project
3. Click **Custom domains** tab
4. Click **Set up a custom domain**
5. Enter: `www.risivo.com`
6. Click **Continue**

### Step 2: Verify Domain

Cloudflare will automatically add DNS records if your domain is already on Cloudflare.

**If your domain is NOT on Cloudflare yet:**

1. Go to **Cloudflare Dashboard** → **Add site**
2. Enter: `risivo.com`
3. Follow instructions to change nameservers at your domain registrar
4. Wait for nameserver propagation (can take up to 24 hours)
5. Then add custom domain as above

### Step 3: Add Root Domain (Optional)

You might also want `risivo.com` (without www) to work:

1. Add another custom domain: `risivo.com`
2. Or set up redirect from `risivo.com` → `www.risivo.com`

### Step 4: Enable SSL

Cloudflare automatically provides free SSL certificates.

1. Go to **SSL/TLS** settings
2. Set mode to **Full (strict)** or **Full**
3. Wait 5-10 minutes for SSL certificate to activate

### Step 5: Test Your Domain

Visit:
- https://www.risivo.com
- https://risivo.com (if configured)

Both should show your coming soon page with valid HTTPS!

---

## ✏️ Making Changes After Deployment

### Quick Changes (Text, Dates, Colors)

**1. Change Launch Date:**
```typescript
// src/index.tsx - Line ~48
const launchDate = new Date('2026-03-01T00:00:00').getTime()
// Change date to whatever you want
```

**2. Change Headline:**
```html
<!-- src/index.tsx - Around line 335 -->
<div class="subtitle">The Future of CRM is Coming</div>
<!-- Change to your new headline -->
```

**3. Change Description:**
```html
<!-- src/index.tsx - Around line 337 -->
<p class="description">
    Transform how you manage customers, close deals, and grow your business.
    <!-- Change to your new description -->
</p>
```

**4. Change Colors:**
```css
/* src/index.tsx - Around line 66 */
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
/* Change to your new colors */
```

**5. Change Social Links:**
```html
<!-- src/index.tsx - Around line 377-395 -->
<a href="#" class="social-link" aria-label="Twitter">
<!-- Replace # with your actual social media URLs -->
```

### Deployment Process After Changes

**If using Auto-Deployment (Recommended):**
```bash
git add .
git commit -m "Update coming soon page"
git push origin main
# Wait 1-2 minutes - auto-deploys to Cloudflare!
```

**If using Manual Deployment:**
```bash
npm run build
npx wrangler pages deploy dist --project-name risivo-coming-soon
```

### Common Changes You Might Need

**Add Analytics (Google Analytics):**
```html
<!-- Add before </head> in src/index.tsx -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

**Change Webhook URL:**
```bash
npx wrangler pages secret put WEBHOOK_URL --project-name risivo-coming-soon
# Enter new webhook URL when prompted
```

**Update Logo/Favicon:**
1. Replace files in `public/` folder
2. Regenerate base64 encoding:
   ```bash
   base64 -w 0 public/your-new-logo.png > logo-base64.txt
   ```
3. Update `LOGO_BASE64` constant in `src/index.tsx`
4. Rebuild and deploy

---

## 🔧 Troubleshooting

### Issue 1: "Webhook not configured" error

**Problem:** Form submission fails with webhook error.

**Solution:**
```bash
# Verify WEBHOOK_URL is set
npx wrangler pages secret list --project-name risivo-coming-soon

# If not set, add it
npx wrangler pages secret put WEBHOOK_URL --project-name risivo-coming-soon
```

### Issue 2: Auto-deployment not working

**Problem:** Changes pushed to GitHub but not deploying.

**Solution:**
1. Check Cloudflare Dashboard → Your Pages project → **Deployments**
2. Look for failed builds and check error logs
3. Common issues:
   - Build command wrong: Should be `npm run build`
   - Output directory wrong: Should be `dist`
   - Node.js version: Set to `18` or higher

### Issue 3: Custom domain not working

**Problem:** Domain shows error or doesn't load page.

**Solution:**
1. Wait 5-10 minutes after adding domain (DNS propagation)
2. Check SSL certificate status in Cloudflare
3. Clear browser cache and try incognito mode
4. Check DNS records in Cloudflare DNS settings

### Issue 4: Emails not being received by Make.com

**Problem:** Form submits successfully but Make.com doesn't receive data.

**Solution:**
1. Check Make.com scenario is **ON** (activated)
2. Test webhook URL directly with curl:
   ```bash
   curl -X POST https://hook.us1.make.com/your-webhook-url \
     -H "Content-Type: application/json" \
     -d '{"email":"test@example.com","timestamp":"2024-01-01"}'
   ```
3. Check Make.com scenario execution history for errors
4. Verify WEBHOOK_URL secret is correct in Cloudflare

### Issue 5: Build fails with "module not found"

**Problem:** Deployment fails during build.

**Solution:**
```bash
# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Test build locally
npm run build

# If successful, commit and push
git add package-lock.json
git commit -m "fix: Update dependencies"
git push origin main
```

---

## 📊 Monitoring & Analytics

### View Deployment History
1. Cloudflare Dashboard → Your Pages project
2. Click **Deployments** tab
3. See all deployments with status and logs

### View Email Subscriptions
1. Open your Google Sheet
2. See all captured emails with timestamps
3. Export to CSV for import into CRM later

### Make.com Execution History
1. Make.com → Your scenario
2. Click **History** tab
3. See all webhook executions and any errors

---

## 🎯 Quick Command Reference

```bash
# Test locally
npm run dev

# Build for production
npm run build

# Deploy to Cloudflare
npm run deploy

# Add/update environment variable
npx wrangler pages secret put WEBHOOK_URL --project-name risivo-coming-soon

# List environment variables
npx wrangler pages secret list --project-name risivo-coming-soon

# Check Cloudflare authentication
npx wrangler whoami

# Commit and push changes (auto-deploy)
git add .
git commit -m "Your change description"
git push origin main
```

---

## ✅ Deployment Checklist

Before going live:

- [ ] Test form submission locally
- [ ] Configure Make.com webhook
- [ ] Test webhook receives data correctly
- [ ] Set up Google Sheet integration
- [ ] Set up email auto-responder
- [ ] Add WEBHOOK_URL to Cloudflare secrets
- [ ] Deploy to Cloudflare Pages
- [ ] Test production deployment
- [ ] Set up custom domain (www.risivo.com)
- [ ] Verify SSL certificate is active
- [ ] Test form submission on production
- [ ] Verify emails appear in Google Sheet
- [ ] Verify auto-response email is sent
- [ ] Set up auto-deployment (optional but recommended)
- [ ] Add analytics tracking (optional)
- [ ] Test on mobile devices
- [ ] Test in different browsers

---

## 🆘 Need Help?

If you run into issues:

1. Check this guide's troubleshooting section
2. Check Cloudflare deployment logs
3. Check Make.com scenario execution history
4. Review `README.md` for basic setup
5. Check GitHub repository issues

---

**🎉 Congratulations!** Your coming soon page is now live and collecting email subscribers automatically!
