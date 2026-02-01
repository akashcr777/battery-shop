@echo off
REM Setup script for Windows
REM Creates image folders automatically

echo.
echo ========================================
echo   Image Folder Setup Script
echo ========================================
echo.

REM Check if Node.js is available
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org
    pause
    exit /b 1
)

REM Run the setup script
node setup-images.js

echo.
echo Press any key to exit...
pause >nul
