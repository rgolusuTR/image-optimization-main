@echo off
echo ========================================
echo GitHub Repository Creation and Deployment
echo ========================================
echo.
echo Step 1: Creating GitHub Repository
echo Please follow these steps in your browser:
echo.
echo 1. Open: https://github.com/new
echo 2. Repository name: image-optimization-main
echo 3. Description: A powerful Next.js web application for image optimization
echo 4. Choose: Public
echo 5. DO NOT check any initialization options
echo 6. Click "Create repository"
echo.
pause
echo.
echo Step 2: Pushing code to GitHub
echo.
cd /d "%~dp0"
git push -u origin main
echo.
if %ERRORLEVEL% EQU 0 (
    echo ========================================
    echo SUCCESS! Code pushed to GitHub
    echo ========================================
    echo.
    echo Repository URL: https://github.com/rgolusuTR/image-optimization-main
    echo.
    echo Next: Deploy to Vercel
    echo 1. Go to: https://vercel.com/new
    echo 2. Import your GitHub repository
    echo 3. Click Deploy
    echo.
) else (
    echo ========================================
    echo ERROR: Failed to push to GitHub
    echo ========================================
    echo.
    echo Please ensure:
    echo 1. You created the repository on GitHub
    echo 2. Repository name is: image-optimization-main
    echo 3. You have proper GitHub credentials configured
    echo.
)
pause