@echo off
echo ========================================
echo   NEUROPLAN MVP - Iniciando Servidores
echo ========================================
echo.

REM Matar procesos Node.js anteriores
echo [1/4] Deteniendo procesos anteriores...
taskkill /F /IM node.exe 2>nul
timeout /t 1 /nobreak >nul
echo   ✓ Procesos detenidos
echo.

REM Verificar que los puertos estén libres
echo [2/4] Verificando puertos...
netstat -ano | findstr ":3001" >nul
if %errorlevel% equ 0 (
    echo   ⚠ Puerto 3001 en uso, intentando liberar...
    for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":3001"') do taskkill /F /PID %%a 2>nul
)
netstat -ano | findstr ":5173" >nul
if %errorlevel% equ 0 (
    echo   ⚠ Puerto 5173 en uso, intentando liberar...
    for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":5173"') do taskkill /F /PID %%a 2>nul
)
timeout /t 1 /nobreak >nul
echo   ✓ Puertos verificados
echo.

REM Compilar backend
echo [3/4] Compilando backend...
cd backend
call npm run build
if %errorlevel% neq 0 (
    echo   ❌ Error compilando backend
    pause
    exit /b 1
)
cd ..
echo   ✓ Backend compilado
echo.

REM Iniciar servidores
echo [4/4] Iniciando servidores...
echo.
echo   🚀 Backend: http://localhost:3001/api
echo   🚀 Frontend: http://localhost:5173
echo.
echo   Presiona Ctrl+C para detener todos los servidores
echo.

REM Iniciar backend en nueva ventana
start "NeuroPlan Backend" cmd /k "cd backend && npm run start:dev"

REM Esperar un poco para que el backend inicie
timeout /t 3 /nobreak >nul

REM Iniciar frontend en nueva ventana
start "NeuroPlan Frontend" cmd /k "cd frontend && npm run dev"

echo.
echo ✅ Servidores iniciados en ventanas separadas
echo.
echo Para detener todo, cierra las ventanas o ejecuta: taskkill /F /IM node.exe
echo.
pause



