@echo off
echo 🚀 Setting up Inventory Management System...
echo ============================================

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js first.
    echo    Visit: https://nodejs.org/
    pause
    exit /b 1
)

echo ✅ Node.js found
node --version

REM Navigate to backend directory
cd backend

echo 📦 Installing backend dependencies...
npm install

if %errorlevel% equ 0 (
    echo ✅ Backend dependencies installed successfully!
) else (
    echo ❌ Failed to install backend dependencies
    pause
    exit /b 1
)

echo.
echo 🎉 Setup completed successfully!
echo.
echo 📋 Next steps:
echo 1. cd backend
echo 2. npm start
echo 3. Open http://localhost:3000 in your browser
echo.
echo 🔑 Login credentials:
echo    Admin: admin / admin123
echo    User:  user / user123
echo.
echo Happy coding! 🚀
pause
