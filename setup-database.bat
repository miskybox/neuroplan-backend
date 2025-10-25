@echo off
echo ===========================================
echo NEUROPLAN DATABASE SETUP
echo ===========================================

echo.
echo Configurando base de datos PostgreSQL...
echo.

REM Verificar si PostgreSQL está instalado
psql --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: PostgreSQL no está instalado o no está en el PATH
    echo Por favor instala PostgreSQL desde: https://www.postgresql.org/download/
    pause
    exit /b 1
)

echo PostgreSQL encontrado. Configurando base de datos...

REM Crear base de datos y usuario
echo.
echo 1. Creando base de datos 'neuroplan'...
psql -U postgres -c "CREATE DATABASE neuroplan;" 2>nul

echo.
echo 2. Creando usuario 'admin'...
psql -U postgres -c "CREATE USER admin WITH PASSWORD '1234';" 2>nul

echo.
echo 3. Otorgando permisos...
psql -U postgres -c "GRANT ALL PRIVILEGES ON DATABASE neuroplan TO admin;"

echo.
echo 4. Ejecutando script de configuración...
psql -U admin -d neuroplan -f setup-database.sql

echo.
echo ===========================================
echo CONFIGURACIÓN COMPLETADA
echo ===========================================
echo.
echo Base de datos: neuroplan
echo Usuario: admin
echo Password: 1234
echo Host: localhost
echo Puerto: 5432
echo.
echo URL de conexión: postgresql://admin:1234@localhost:5432/neuroplan
echo.
echo Para probar la conexión:
echo psql -U admin -d neuroplan
echo.
pause
