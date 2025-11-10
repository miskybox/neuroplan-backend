@echo off
REM Script para aplicar migración de columnas status a peis
REM Fecha: 07/11/2025

echo.
echo =========================================
echo   Aplicando migración: add-pei-status-columns
echo =========================================
echo.

REM Cargar variables de entorno
if exist .env (
    for /f "tokens=1,2 delims==" %%a in ('findstr /v "^#" .env') do (
        set %%a=%%b
    )
)

REM Construir connection string
set PGPASSWORD=%SUPABASE_SERVICE_ROLE_KEY:~7%
set CONNECTION=postgresql://postgres:Barcelona2025!@db.qlpzzljqbwcnpayjhugz.supabase.co:5432/postgres

echo Conectando a Supabase...
psql "%CONNECTION%" -f migrations\add-pei-status-columns.sql

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ✅ Migración aplicada exitosamente
    echo.
) else (
    echo.
    echo ❌ Error al aplicar migración
    echo.
    exit /b 1
)

pause
