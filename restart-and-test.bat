@echo off
echo ========================================
echo   Reiniciando Backend + Tests E2E
echo ========================================
echo.

echo [1/3] Deteniendo backend...
taskkill /F /IM node.exe >nul 2>&1

echo [2/3] Iniciando backend en background...
cd backend
start /B npm run start:dev

echo Esperando 5 segundos para que el backend inicie...
timeout /t 5 /nobreak >nul

echo [3/3] Ejecutando tests E2E...
cd ..\frontend
npm run test:e2e:api

echo.
echo ========================================
echo   Proceso completado
echo ========================================
pause
