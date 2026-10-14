@echo off
title Mage - Background Remover
cd /d "%~dp0"

echo ========================================================
echo     MAGE - MAGIC YOUR IMAGE
echo ========================================================
echo Membuka aplikasi di browser...
echo.

node server.js
if %errorlevel% neq 0 (
    echo.
    echo Node.js tidak terdeteksi atau terjadi kendala.
    pause
)
