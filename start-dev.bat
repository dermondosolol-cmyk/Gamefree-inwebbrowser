@echo off
REM Nebula Gaming - Local Development Server Startup Script (Windows)
REM Starts the trusted local development server on localhost:8000

echo.
echo 🎮 Nebula Gaming - Starting Local Development Server
echo ======================================================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Error: Node.js is not installed
    echo    Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

REM Check if npm is installed
where npm >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Error: npm is not installed
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
for /f "tokens=*" %%i in ('npm --version') do set NPM_VERSION=%%i

echo ✅ Node.js %NODE_VERSION% detected
echo ✅ npm %NPM_VERSION% detected
echo.

REM Check if node_modules exists
if not exist "node_modules" (
    echo 📦 Installing dependencies...
    call npm install
    echo ✅ Dependencies installed
    echo.
)

REM Check if server.js exists
if not exist "server.js" (
    echo ❌ Error: server.js not found
    pause
    exit /b 1
)

REM Kill any process using port 8000
for /f "tokens=5" %%a in ('netstat -anob ^| find "8000"') do (
    taskkill /PID %%a /F >nul 2>&1
)

echo.
echo 🚀 Starting development server...
echo.

REM Start the server
node server.js
pause
