@echo off
title SA Brothers Vendors POS - Windows Launcher
color 0B
cls

echo ====================================================================
echo           SA BROTHERS VENDORS - POINT OF SALE (WINDOWS)
echo ====================================================================
echo.

cd /d "%~dp0"

:: 1. If native Windows desktop app exists, run it directly!
if exist "release\SA_Brothers_Vendors_POS-win32-x64\SA_Brothers_Vendors_POS.exe" (
    echo [OK] Found native Windows desktop application!
    echo [INFO] Opening SA Brothers Vendors POS window...
    start "" "release\SA_Brothers_Vendors_POS-win32-x64\SA_Brothers_Vendors_POS.exe"
    exit /b 0
)

if exist "SA_Brothers_Vendors_POS_Setup.exe" (
    echo [OK] Found SA_Brothers_Vendors_POS_Setup.exe!
    echo [INFO] Launching native Windows POS application...
    start "" "SA_Brothers_Vendors_POS_Setup.exe"
    exit /b 0
)

if exist "SA_Brothers_Vendors_POS.exe" (
    echo [OK] Found SA_Brothers_Vendors_POS.exe!
    echo [INFO] Launching native Windows POS application...
    start "" "SA_Brothers_Vendors_POS.exe"
    exit /b 0
)

if exist "dist\SA_Brothers_Vendors_POS.exe" (
    echo [OK] Found dist\SA_Brothers_Vendors_POS.exe!
    echo [INFO] Launching native Windows POS application...
    start "" "dist\SA_Brothers_Vendors_POS.exe"
    exit /b 0
)

if exist "build\SA_Brothers_Vendors_POS.exe" (
    echo [OK] Found build\SA_Brothers_Vendors_POS.exe!
    echo [INFO] Launching native Windows POS application...
    start "" "build\SA_Brothers_Vendors_POS.exe"
    exit /b 0
)

:: 2. Fallback: Launch using Node/tsx if exe is not present
echo [INFO] SA_Brothers_Vendors_POS.exe not detected in current folder.
echo [INFO] Checking Node.js environment...

where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Neither SA_Brothers_Vendors_POS.exe nor Node.js was found.
    echo Please make sure SA_Brothers_Vendors_POS.exe is in this folder.
    pause
    exit /b 1
)

echo [INFO] Starting POS development server...
start /b cmd /c "npm run dev"
timeout /t 3 /nobreak >nul

:: Launch Edge or Chrome in app mode
where msedge >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    start msedge --app="http://localhost:3000"
    exit /b 0
)

where chrome >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    start chrome --app="http://localhost:3000"
    exit /b 0
)

start "" "http://localhost:3000"
exit /b 0
