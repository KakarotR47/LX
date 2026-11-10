@echo off
title SA Brothers Vendors POS - Windows Desktop Launcher
color 0A
cls

echo ====================================================================
echo           SA BROTHERS VENDORS - POINT OF SALE DESKTOP
echo             Court Stamp Vendors & Legal Paper Specialist
echo ====================================================================
echo.
echo [1/3] Checking environment & local server status...

:: Check if server is running on port 3000
netstat -ano | findstr :3000 >nul
if %ERRORLEVEL% EQU 0 (
    echo [OK] Shop POS Server is already active on port 3000.
) else (
    echo [INFO] Starting Local Shop POS Server in background...
    if exist "server.ts" (
        start /b npm run dev
    ) else if exist "server.js" (
        start /b node server.js
    ) else (
        echo [INFO] Connecting to local shop instance...
    )
    timeout /t 2 /nobreak >nul
)

echo [2/3] Creating Windows Desktop Shortcut...
set SHORTCUT_SCRIPT=%TEMP%\CreatePOSShortcut.vbs
echo Set oWS = WScript.CreateObject("WScript.Shell") > "%SHORTCUT_SCRIPT%"
echo sLinkFile = oWS.SpecialFolders("Desktop") ^& "\SA Brothers Vendors POS.lnk" >> "%SHORTCUT_SCRIPT%"
echo Set oLink = oWS.CreateShortcut(sLinkFile) >> "%SHORTCUT_SCRIPT%"
echo oLink.TargetPath = "msedge.exe" >> "%SHORTCUT_SCRIPT%"
echo oLink.Arguments = "--app=http://localhost:3000" >> "%SHORTCUT_SCRIPT%"
echo oLink.Description = "SA Brothers Vendors POS & Inventory Manager" >> "%SHORTCUT_SCRIPT%"
echo oLink.WindowStyle = 1 >> "%SHORTCUT_SCRIPT%"
echo oLink.Save >> "%SHORTCUT_SCRIPT%"
cscript //nologo "%SHORTCUT_SCRIPT%"
del "%SHORTCUT_SCRIPT%"
echo [OK] Windows Desktop Shortcut placed on your Desktop!

echo [3/3] Launching SA Brothers POS in Native Windows App Window...
:: Attempt to launch in Microsoft Edge app mode (standard on Windows 10 & 11)
where msedge >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    start msedge --app="http://localhost:3000" --window-size=1400,900
    goto DONE
)

:: Fallback to Google Chrome app mode
where chrome >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    start chrome --app="http://localhost:3000" --window-size=1400,900
    goto DONE
)

:: Default browser fallback
start http://localhost:3000

:DONE
echo.
echo ====================================================================
echo [SUCCESS] POS software is running in standalone Windows Desktop mode!
echo ====================================================================
timeout /t 3 /nobreak >nul
exit
