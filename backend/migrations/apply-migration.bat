@echo off
REM Script para aplicar migración SQL a Supabase desde Windows
REM Uso: apply-migration.bat [migration-file]

setlocal enabledelayedexpansion

set MIGRATION_FILE=%~1
if "%MIGRATION_FILE%"=="" set MIGRATION_FILE=migrations\add-students-columns.sql

if not exist "%MIGRATION_FILE%" (
    echo ❌ Error: Archivo de migración no encontrado: %MIGRATION_FILE%
    exit /b 1
)

if "%SUPABASE_URL%"=="" (
    echo ❌ Error: Variable SUPABASE_URL no está configurada
    echo.
    echo Uso:
    echo   set SUPABASE_URL=https://your-project.supabase.co
    echo   set SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
    echo   apply-migration.bat [migration-file]
    exit /b 1
)

if "%SUPABASE_SERVICE_ROLE_KEY%"=="" (
    echo ❌ Error: Variable SUPABASE_SERVICE_ROLE_KEY no está configurada
    exit /b 1
)

echo 🔍 Aplicando migración: %MIGRATION_FILE%
echo 📡 Servidor: %SUPABASE_URL%
echo.

REM Nota: Esta migración debe aplicarse manualmente en el Dashboard de Supabase
echo ℹ️  Para aplicar esta migración:
echo.
echo 1. Abre el Dashboard de Supabase: %SUPABASE_URL%
echo 2. Ve a SQL Editor
echo 3. Copia y pega el contenido de: %MIGRATION_FILE%
echo 4. Ejecuta el script SQL
echo.
echo 📋 Contenido del archivo de migración:
echo =====================================
type "%MIGRATION_FILE%"
echo =====================================
echo.
echo ✅ Revisa el contenido y aplícalo en el Dashboard de Supabase

endlocal
