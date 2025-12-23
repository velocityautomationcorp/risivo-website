@echo off
REM Save this patch content to ALL_CODE_FIXES.patch first, then run this script

echo ========================================
echo   APPLYING ALL CODE FIXES
echo ========================================
echo.

REM Check if patch file exists
if not exist "ALL_CODE_FIXES.patch" (
    echo ERROR: ALL_CODE_FIXES.patch not found!
    echo.
    echo Please create the file first by copying the patch content.
    pause
    exit /b 1
)

echo Creating backup...
if not exist "backup" mkdir backup
copy /Y "public\static\risivo-global.css" "backup\" >nul 2>&1
copy /Y "src\pages\investor-dashboard-v2.tsx" "backup\" >nul 2>&1
copy /Y "src\pages\investor-nda-review.tsx" "backup\" >nul 2>&1
echo Backup created in backup\
echo.

echo Applying patch...
git apply ALL_CODE_FIXES.patch

if errorlevel 1 (
    echo.
    echo ERROR: Patch failed to apply!
    echo This might be because your files have been modified.
    echo.
    echo Restoring from backup...
    copy /Y "backup\*.*" .
    pause
    exit /b 1
)

echo.
echo ========================================
echo   SUCCESS! All fixes applied
echo ========================================
echo.
echo Next steps:
echo   1. npm run build
echo   2. npm run deploy:production
echo.
pause
