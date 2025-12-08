# ⚡ Ultra-Fast Staging Setup (2 Minutes via Command Line)

## 🚀 One-Command Setup

Open Command Prompt and run these commands:

```bash
cd C:\Users\Buzgrowth\Documents\risivo-website

# Switch to staging branch
git checkout staging

# Create Cloudflare Pages project for staging
npx wrangler pages project create risivo-staging

# Build the project
npm run build

# Deploy to staging
npx wrangler pages deploy dist --project-name risivo-staging --branch staging

# Set environment variable
npx wrangler pages secret put ENABLE_FULL_SITE --project-name risivo-staging
```

When prompted for `ENABLE_FULL_SITE`, type: **`true`**

That's it! 🎉

## 📋 Step-by-Step Breakdown

### Step 1: Navigate to Project (5 seconds)
```bash
cd C:\Users\Buzgrowth\Documents\risivo-website
```

### Step 2: Switch to Staging Branch (5 seconds)
```bash
git checkout staging
```

You should see: `Switched to branch 'staging'`

### Step 3: Create Cloudflare Project (10 seconds)
```bash
npx wrangler pages project create risivo-staging
```

**Expected output:**
```
✔ Successfully created the 'risivo-staging' project.
```

### Step 4: Build the Project (30 seconds)
```bash
npm run build
```

**Expected output:**
```
vite v6.3.5 building for production...
✓ built in 2.34s
```

### Step 5: Deploy to Cloudflare (20 seconds)
```bash
npx wrangler pages deploy dist --project-name risivo-staging --branch staging
```

**Expected output:**
```
🌍 Uploading...
✨ Success! Uploaded 5 files
✨ Deployment complete!
   https://risivo-staging.pages.dev
```

### Step 6: Set Environment Variable (10 seconds)
```bash
npx wrangler pages secret put ENABLE_FULL_SITE --project-name risivo-staging
```

**When prompted, enter:** `true`

**Expected output:**
```
✨ Success! Uploaded secret ENABLE_FULL_SITE
```

### Step 7: Redeploy with Variable (20 seconds)
```bash
npm run build
npx wrangler pages deploy dist --project-name risivo-staging --branch staging
```

This redeploys with the environment variable active.

## 🎯 Your Staging URL

After completion, visit:
```
https://risivo-staging.pages.dev
```

You should see the **full marketing website** with the complete homepage!

## 🔍 Verify Setup

### Check Environment Variable is Set:
```bash
npx wrangler pages secret list --project-name risivo-staging
```

Should show:
```
ENABLE_FULL_SITE
```

### Check Health Endpoint:
Visit in browser or use curl:
```bash
curl https://risivo-staging.pages.dev/api/health
```

Should return:
```json
{
  "status": "ok",
  "environment": "staging",
  "fullSiteEnabled": true,
  "webhookConfigured": false,
  "timestamp": "..."
}
```

## 🔄 Quick Deploy Script (For Future Updates)

Save this as `deploy-staging.bat` in your project root:

```batch
@echo off
echo ========================================
echo  Deploying to Staging
echo ========================================
echo.

cd C:\Users\Buzgrowth\Documents\risivo-website
git checkout staging
git pull origin staging

echo.
echo Building project...
call npm run build

echo.
echo Deploying to Cloudflare...
call npx wrangler pages deploy dist --project-name risivo-staging --branch staging

echo.
echo ========================================
echo  Deployment Complete!
echo ========================================
echo  URL: https://risivo-staging.pages.dev
echo ========================================
pause
```

Then just double-click `deploy-staging.bat` to deploy!

## 📱 Alternative: One-Line Deploy

After initial setup, deploy with one command:
```bash
npm run deploy:staging
```

(This uses the script we added to package.json)

## 🐛 Troubleshooting

### Error: "Not logged in"
**Fix:**
```bash
npx wrangler login
```
This opens browser to authenticate.

### Error: "Project already exists"
**Fix:**
```bash
# Just deploy, skip project creation
npm run build
npx wrangler pages deploy dist --project-name risivo-staging --branch staging
```

### Error: "Unauthorized"
**Fix:**
```bash
# Re-authenticate
npx wrangler logout
npx wrangler login
```

### Can't find project
**Fix:**
```bash
# List all your projects
npx wrangler pages project list
```

### Build fails
**Fix:**
```bash
# Reinstall dependencies
npm install
npm run build
```

## ⚙️ Optional: Set Webhook URL for Staging

If you want email capture to work on staging too:

```bash
npx wrangler pages secret put WEBHOOK_URL --project-name risivo-staging
```

When prompted, paste your Make.com webhook URL.

Then redeploy:
```bash
npm run deploy:staging
```

## 🎨 What You'll See

Once deployed, your staging site will have:

✅ Complete homepage with all sections
✅ Navigation with dropdown menus  
✅ Footer with newsletter signup
✅ Responsive design (try mobile!)
✅ Smooth animations
✅ Working /api/health endpoint

## 🔄 Future Workflow

### Make changes and deploy:
```bash
cd C:\Users\Buzgrowth\Documents\risivo-website
git checkout staging

# Make your changes to files...

git add .
git commit -m "feat: Add new feature"
git push origin staging

# Deploy
npm run deploy:staging
```

### Or use the batch file:
```bash
deploy-staging.bat
```

## 📊 Compare: Dashboard vs Command Line

| Task | Dashboard | Command Line |
|------|-----------|--------------|
| Create project | Click 5+ times | One command |
| Deploy | Auto on push | One command |
| Set variables | Click through UI | One command |
| Check status | Navigate pages | One command |
| Total time | 5-10 minutes | 2 minutes |

## 🎯 Summary

**Total time**: ~2 minutes (plus build/deploy time)

**Commands used**:
1. `git checkout staging`
2. `npx wrangler pages project create risivo-staging`
3. `npm run build`
4. `npx wrangler pages deploy dist --project-name risivo-staging --branch staging`
5. `npx wrangler pages secret put ENABLE_FULL_SITE --project-name risivo-staging` (enter `true`)
6. `npm run deploy:staging` (redeploy with variable)

**Result**: Live staging site at https://risivo-staging.pages.dev

---

**Ready to go even faster?** Just run:
```bash
npm run deploy:staging
```

(Builds and deploys in one command!)
