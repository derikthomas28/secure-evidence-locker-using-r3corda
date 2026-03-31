@echo off
title Secure Evidence Locker - Unified Launcher
color 0B
echo.
echo  ====================================================
echo    SECURE EVIDENCE LOCKER // SYSTEM STARTUP
echo  ====================================================
echo    This script will launch the AI Backend and UI.
echo.

set "ROOT=%~dp0"

echo  [1/2] Launching Python AI Backend...
start "AI-Backend" cmd /k "cd /d "%ROOT%services\ai-storage" && python app.py"

echo  [2/2] Launching React UI Dashboard...
start "React-Frontend" cmd /k "cd /d "%ROOT%frontend" && npm run dev"

echo.
echo  ====================================================
echo    SYSTEM INITIALIZING!
echo    Frontend: http://localhost:5173
echo    Backend:  http://localhost:5000
echo    Password: secure2026 (for all roles)
echo  ====================================================
echo.
pause
