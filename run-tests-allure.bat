@echo off
echo ========================================
echo   Tests E2E con Allure Report
echo ========================================
echo.

cd frontend

echo [1/3] Limpiando reportes antiguos...
if exist allure-results rmdir /s /q allure-results
if exist allure-report rmdir /s /q allure-report

echo [2/3] Ejecutando tests E2E...
call npm run test:e2e:api

echo.
echo [3/3] Generando y abriendo reporte Allure...
echo.
echo NOTA: Allure necesita Java instalado.
echo Si no tienes Allure CLI instalado, ejecuta:
echo   npm install -g allure-commandline
echo.

where allure >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo Allure CLI encontrado, generando reporte...
    allure serve allure-results
) else (
    echo.
    echo ⚠️  Allure CLI no encontrado.
    echo.
    echo Opciones:
    echo   1. Instalar globalmente: npm install -g allure-commandline
    echo   2. Ver reporte HTML de Playwright: npx playwright show-report
    echo   3. Instalar Allure desde: https://docs.qameta.io/allure/#_installing_a_commandline
    echo.
    echo Abriendo reporte HTML de Playwright...
    npx playwright show-report
)

echo.
pause
