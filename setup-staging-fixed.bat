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
