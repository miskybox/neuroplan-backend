@echo off
echo ========================================
echo   Ejecutando Tests E2E de API
echo ========================================
echo.

cd frontend
npm run test:e2e:api

echo.
echo ========================================
echo   Tests completados
echo ========================================
pause
