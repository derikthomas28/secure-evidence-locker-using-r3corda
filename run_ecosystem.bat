@echo off
title Secure Legal Vault - Boot Sequence
color 0B
echo.
echo  ====================================================
echo    SECURE LEGAL VAULT // BOOT SEQUENCE
echo  ====================================================
echo.

:: Get the directory where the bat file lives
set "ROOT=%~dp0"

echo  [1/3] Starting AI Backend (Port 5000)...
start "AI-Backend" cmd /k "cd /d "%ROOT%services\ai-storage" && pip install -r requirements.txt 2>nul && python app.py"

echo  [2/3] Starting Mock Blockchain Ledger (Port 10050)...
start "Mock-Blockchain" cmd /k "cd /d "%ROOT%services\ai-storage" && python mock_blockchain.py"

echo  [3/3] Starting React Frontend (Port 5173)...
start "React-Frontend" cmd /k "cd /d "%ROOT%frontend" && npm install --silent 2>nul && npm run dev"

echo.
echo  ====================================================
echo    SYSTEM IS BOOTING!
echo    Backend AI:      http://localhost:5000
echo    Mock Ledger:     http://localhost:10050
echo    Frontend:        http://localhost:5173
echo  ====================================================
echo.
echo  Login Credentials (password for all: secure2026):
echo    officer_vault   - Police Officer
echo    forensic_lab    - Forensic Analyst
echo    honorable_justice - Judge
echo    citizen_view    - Public Citizen
echo    dev_support     - Developer
echo.
echo  You may close this window now.
echo.
pause
