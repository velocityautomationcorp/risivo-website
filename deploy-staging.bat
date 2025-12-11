@echo off
echo ========================================
echo  RISIVO - Deploy to Staging
echo ========================================
echo.

cd /d %~dp0

echo [1/5] Checking out staging branch...
git checkout staging
if errorlevel 1 (
    echo ERROR: Failed to checkout staging branch
    pause
    exit /b 1
)

echo.
echo [2/5] Pulling latest changes...
git pull origin staging
if errorlevel 1 (
    echo WARNING: Failed to pull changes, continuing anyway...
)

echo.
echo [3/5] Building project...
call npm run build
if errorlevel 1 (
    echo ERROR: Build failed
    pause
    exit /b 1
)

echo.
echo [4/5] Deploying to Cloudflare Pages...
call npx wrangler pages deploy dist --project-name risivo-staging --branch staging
if errorlevel 1 (
    echo ERROR: Deployment failed
    pause
    exit /b 1
)

echo.
echo ========================================
echo  Deployment Complete!
echo ========================================
echo.
echo  Staging URL: https://risivo-staging.pages.dev
echo.
echo  Check status at:
echo  https://dash.cloudflare.com/
echo.
echo ========================================
echo.
pause
