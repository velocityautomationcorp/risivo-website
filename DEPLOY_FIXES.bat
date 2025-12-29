@echo off
REM ============================================================================
REM AUTOMATIC DEPLOYMENT SCRIPT - Apply All Fixes
REM ============================================================================

echo.
echo ========================================
echo   RISIVO - AUTOMATED FIX DEPLOYMENT
echo ========================================
echo.
echo This script will:
echo   1. Backup your current files
echo   2. Apply all CSS and page fixes
echo   3. Build the project
echo   4. Prepare for deployment
echo.
pause

REM Create backup directory
echo.
echo Creating backup...
if not exist "backup_before_fix" mkdir backup_before_fix
copy /Y "public\static\risivo-global.css" "backup_before_fix\" >nul 2>&1
copy /Y "src\pages\investor-dashboard-v2.tsx" "backup_before_fix\" >nul 2>&1
copy /Y "src\pages\investor-nda-review.tsx" "backup_before_fix\" >nul 2>&1
echo ✓ Backup created in backup_before_fix\

REM Check if fix files exist
echo.
echo Checking for fix files...
if not exist "FIXED_risivo-global.css" (
    echo ✗ ERROR: FIXED_risivo-global.css not found!
    echo    Please download the fixed files first.
    pause
    exit /b 1
)
if not exist "FIXED_investor-dashboard-v2.tsx" (
    echo ✗ ERROR: FIXED_investor-dashboard-v2.tsx not found!
    echo    Please download the fixed files first.
    pause
    exit /b 1
)
if not exist "FIXED_investor-nda-review.tsx" (
    echo ✗ ERROR: FIXED_investor-nda-review.tsx not found!
    echo    Please download the fixed files first.
    pause
    exit /b 1
)
echo ✓ All fix files found

REM Apply fixes
echo.
echo Applying fixes...
copy /Y "FIXED_risivo-global.css" "public\static\risivo-global.css" >nul 2>&1
copy /Y "FIXED_investor-dashboard-v2.tsx" "src\pages\investor-dashboard-v2.tsx" >nul 2>&1
copy /Y "FIXED_investor-nda-review.tsx" "src\pages\investor-nda-review.tsx" >nul 2>&1
echo ✓ All files updated

REM Verify changes
echo.
echo Verifying changes...
findstr /C:"max-width: 1600px" "public\static\risivo-global.css" >nul 2>&1
if errorlevel 1 (
    echo ✗ ERROR: CSS file not updated correctly
    pause
    exit /b 1
)
echo ✓ CSS container width: 1600px confirmed

findstr /C:"first_name: 'Investor'" "src\pages\investor-nda-review.tsx" >nul 2>&1
if errorlevel 1 (
    echo ✗ ERROR: NDA review page not updated correctly
    pause
    exit /b 1
)
echo ✓ NDA review fix confirmed

echo.
echo ========================================
echo   ✓ ALL FIXES APPLIED SUCCESSFULLY
echo ========================================
echo.
echo Next steps:
echo   1. Run: npm run build
echo   2. Run: npm run deploy:production
echo   3. Test: https://risivo.com/updates/admin/investors
echo   4. Test: https://risivo.com/updates/investor/nda-review
echo.
echo If anything goes wrong, restore from backup_before_fix\
echo.
pause
