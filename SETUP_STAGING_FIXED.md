# 🚀 STAGING SETUP - FIXED VERSION

## ⚡ The Issue
The staging branch exists on GitHub but not in your local repository yet.

## ✅ Fixed Setup Commands

### Step 1: Fetch Staging Branch from GitHub
```bash
cd C:\Users\Buzgrowth\Documents\risivo-website

git fetch origin staging

git checkout -b staging origin/staging
```

### Step 2: Now Run the Setup
```bash
npx wrangler pages project create risivo-staging

npm run build

npx wrangler pages deploy dist --project-name risivo-staging --branch staging
```

### Step 3: Set Environment Variable
```bash
npx wrangler pages secret put ENABLE_FULL_SITE --project-name risivo-staging
```
**When prompted, type:** `true`

### Step 4: Redeploy with Variable
```bash
npm run deploy:staging
```

---

## 🎯 All-in-One Copy-Paste (CORRECTED)

Copy and paste this entire block:

```bash
cd C:\Users\Buzgrowth\Documents\risivo-website
git fetch origin staging
git checkout -b staging origin/staging
npx wrangler pages project create risivo-staging
npm run build
npx wrangler pages deploy dist --project-name risivo-staging --branch staging
```

Then run separately:
```bash
npx wrangler pages secret put ENABLE_FULL_SITE --project-name risivo-staging
```
Type: `true` and press Enter

Then:
```bash
npm run deploy:staging
```

---

## 📋 Step-by-Step Explanation

### What Each Command Does:

1. **`git fetch origin staging`**
   - Downloads the staging branch from GitHub
   - Doesn't switch to it yet

2. **`git checkout -b staging origin/staging`**
   - Creates local staging branch
   - Sets it to track the remote staging branch
   - Switches to staging branch

3. **`npx wrangler pages project create risivo-staging`**
   - Creates Cloudflare Pages project named "risivo-staging"

4. **`npm run build`**
   - Builds the website (creates dist/ folder)

5. **`npx wrangler pages deploy dist --project-name risivo-staging --branch staging`**
   - Deploys the built files to Cloudflare

6. **`npx wrangler pages secret put ENABLE_FULL_SITE`**
   - Sets environment variable to show full site

7. **`npm run deploy:staging`**
   - Rebuilds and redeploys with variable active

---

## 🔍 Verify You're on Staging Branch

After step 1 & 2, run:
```bash
git branch
```

You should see:
```
  main
* staging
```

The `*` shows you're on staging branch.

---

## 🐛 Alternative: If Still Having Issues

If the commands above don't work, try this approach:

```bash
cd C:\Users\Buzgrowth\Documents\risivo-website

# See all branches (including remote)
git branch -a

# Fetch everything from GitHub
git fetch --all

# Create and switch to staging branch
git checkout -b staging origin/staging

# Verify you're on staging
git status

# Continue with deployment...
npx wrangler pages project create risivo-staging
npm run build
npx wrangler pages deploy dist --project-name risivo-staging --branch staging
```

---

## ✨ Updated Batch File

I'll update the batch file to handle this automatically.

Save this as `setup-staging-fixed.bat`:

```batch
@echo off
echo ========================================
echo  RISIVO - Initial Staging Setup (FIXED)
echo ========================================
echo.

cd /d %~dp0

echo [1/8] Fetching staging branch from GitHub...
git fetch origin staging
if errorlevel 1 (
    echo ERROR: Failed to fetch staging branch
    pause
    exit /b 1
)

echo.
echo [2/8] Creating and switching to staging branch...
git checkout -b staging origin/staging
if errorlevel 1 (
    echo NOTE: Branch might already exist, trying to checkout...
    git checkout staging
)

echo.
echo [3/8] Verifying we're on staging branch...
git branch
echo.

echo [4/8] Creating Cloudflare Pages project...
call npx wrangler pages project create risivo-staging
if errorlevel 1 (
    echo NOTE: Project might already exist, continuing...
)

echo.
echo [5/8] Building project...
call npm run build
if errorlevel 1 (
    echo ERROR: Build failed
    pause
    exit /b 1
)

echo.
echo [6/8] Initial deployment...
call npx wrangler pages deploy dist --project-name risivo-staging --branch staging
if errorlevel 1 (
    echo ERROR: Deployment failed
    pause
    exit /b 1
)

echo.
echo [7/8] Setting ENABLE_FULL_SITE variable...
echo.
echo When prompted, enter: true
echo.
call npx wrangler pages secret put ENABLE_FULL_SITE --project-name risivo-staging

echo.
echo [8/8] Final deployment with environment variable...
call npm run deploy:staging

echo.
echo ========================================
echo  Setup Complete!
echo ========================================
echo.
echo  Your staging site is ready at:
echo  https://risivo-staging.pages.dev
echo.
echo  To deploy future updates, just run:
echo  deploy-staging.bat
echo.
echo ========================================
echo.
pause
```

---

## 🎯 Summary

The issue was that the staging branch exists on GitHub but not locally yet.

**Solution:** Fetch it first with:
```bash
git fetch origin staging
git checkout -b staging origin/staging
```

Then proceed with the rest of the setup!

---

## ✅ Quick Test

To verify everything is ready:

```bash
cd C:\Users\Buzgrowth\Documents\risivo-website
git fetch origin staging
git checkout -b staging origin/staging
git status
```

Should show:
```
On branch staging
Your branch is up to date with 'origin/staging'.
nothing to commit, working tree clean
```

Now you're ready to deploy! 🚀
