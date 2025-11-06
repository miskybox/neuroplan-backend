@echo off
echo ========================================
echo   NEUROPLAN MVP - Deteniendo Servidores
echo ========================================
echo.

echo Deteniendo todos los procesos Node.js...
taskkill /F /IM node.exe 2>nul

if %errorlevel% equ 0 (
    echo ✅ Todos los procesos detenidos
) else (
    echo ⚠ No se encontraron procesos Node.js corriendo
)

echo.
echo Liberando puertos 3001 y 5173...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":3001"') do taskkill /F /PID %%a 2>nul
for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":5173"') do taskkill /F /PID %%a 2>nul

echo ✅ Puertos liberados
echo.
pause










