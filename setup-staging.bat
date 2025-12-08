@echo off
echo ========================================
echo  RISIVO - Initial Staging Setup
echo ========================================
echo  This will create and deploy staging environment
echo ========================================
echo.

cd /d %~dp0

echo [1/7] Switching to staging branch...
git checkout staging
if errorlevel 1 (
    echo ERROR: Failed to checkout staging branch
    pause
    exit /b 1
)

echo.
echo [2/7] Creating Cloudflare Pages project...
call npx wrangler pages project create risivo-staging
if errorlevel 1 (
    echo NOTE: Project might already exist, continuing...
)

echo.
echo [3/7] Building project...
call npm run build
if errorlevel 1 (
    echo ERROR: Build failed
    pause
    exit /b 1
)

echo.
echo [4/7] Initial deployment...
call npx wrangler pages deploy dist --project-name risivo-staging --branch staging
if errorlevel 1 (
    echo ERROR: Deployment failed
    pause
    exit /b 1
)

echo.
echo [5/7] Setting ENABLE_FULL_SITE variable...
echo.
echo When prompted, enter: true
echo.
call npx wrangler pages secret put ENABLE_FULL_SITE --project-name risivo-staging

echo.
echo [6/7] Rebuilding...
call npm run build

echo.
echo [7/7] Final deployment with environment variable...
call npx wrangler pages deploy dist --project-name risivo-staging --branch staging

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
