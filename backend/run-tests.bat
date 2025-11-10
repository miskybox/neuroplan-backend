@echo off
echo ======================================
echo  TESTS AUTOMATIZADOS - NEUROPLAN MVP
echo ======================================
echo.

REM Matar procesos node existentes
echo [1/4] Limpiando procesos anteriores...
taskkill /F /IM node.exe 2>nul
timeout /t 2 /nobreak >nul

REM Iniciar backend en segundo plano
echo [2/4] Iniciando backend...
cd /d "%~dp0"
start /B cmd /c "npm run start:dev > backend-output.log 2>&1"

REM Esperar a que el backend esté listo
echo [3/4] Esperando a que el backend este listo (15 segundos)...
timeout /t 15 /nobreak >nul

REM Ejecutar tests
echo [4/4] Ejecutando tests...
echo.
node scripts\test-complete-flow.js

REM Mantener ventana abierta
echo.
echo Presiona cualquier tecla para cerrar y detener el backend...
pause >nul

REM Limpiar al salir
taskkill /F /IM node.exe 2>nul
