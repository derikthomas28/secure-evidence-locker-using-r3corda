<<<<<<< HEAD
@echo off
echo ===============================================================
echo    SECURELOCK Legal-Tech Ecosystem - Launcher
echo ===============================================================
echo.

echo [1/2] Starting Python AI Service (Port 5000)...
start "AI-Service" cmd /k "cd /d %~dp0services\ai-storage && python app.py"
echo    AI Service launching...

echo.
echo [2/2] Starting React Frontend Dashboard (Port 5173)...
cd /d %~dp0frontend

if not exist "node_modules" (
    echo    Installing frontend dependencies (first run)...
    call npm install
)

echo.
echo ===============================================================
echo    SYSTEM READY!
echo    Dashboard:   http://localhost:5173
echo    AI Service:  http://localhost:5000
echo ===============================================================
echo.

npm run dev
=======
@echo off
echo ===============================================================
echo    SECURELOCK Legal-Tech Ecosystem - Launcher
echo ===============================================================
echo.

echo [1/2] Starting Python AI Service (Port 5000)...
start "AI-Service" cmd /k "cd /d %~dp0services\ai-storage && python app.py"
echo    AI Service launching...

echo.
echo [2/2] Starting React Frontend Dashboard (Port 5173)...
cd /d %~dp0frontend

if not exist "node_modules" (
    echo    Installing frontend dependencies (first run)...
    call npm install
)

echo.
echo ===============================================================
echo    SYSTEM READY!
echo    Dashboard:   http://localhost:5173
echo    AI Service:  http://localhost:5000
echo ===============================================================
echo.

npm run dev
>>>>>>> d2165740c73ef4c6d4a2639a12e4eddbb03146c0
