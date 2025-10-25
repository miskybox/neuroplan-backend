@echo off
echo ===========================================
echo APLICANDO ESQUEMA NORMALIZADO A NEUROPLAN
echo ===========================================

echo.
echo 1. Eliminando tablas existentes...
psql -U postgres -d neuroplan -c "DROP TABLE IF EXISTS \"AudioFile\" CASCADE;"
psql -U postgres -d neuroplan -c "DROP TABLE IF EXISTS \"Report\" CASCADE;"
psql -U postgres -d neuroplan -c "DROP TABLE IF EXISTS \"PEI\" CASCADE;"
psql -U postgres -d neuroplan -c "DROP TABLE IF EXISTS \"Notification\" CASCADE;"
psql -U postgres -d neuroplan -c "DROP TABLE IF EXISTS \"Student\" CASCADE;"
psql -U postgres -d neuroplan -c "DROP TABLE IF EXISTS \"User\" CASCADE;"
psql -U postgres -d neuroplan -c "DROP TABLE IF EXISTS \"ActivityLog\" CASCADE;"

echo.
echo 2. Aplicando esquema normalizado...
psql -U postgres -d neuroplan -f setup-database-normalized.sql

echo.
echo 3. Verificando tablas creadas...
psql -U postgres -d neuroplan -c "\dt"

echo.
echo 4. Verificando usuarios creados...
psql -U postgres -d neuroplan -c "SELECT email, role, first_name, last_name FROM users;"

echo.
echo ===========================================
echo ESQUEMA NORMALIZADO APLICADO CORRECTAMENTE
echo ===========================================
echo.
echo Credenciales actualizadas:
echo - Usuario: admin
echo - Password: neuroplan_secure_2024
echo - Base de datos: neuroplan
echo - Esquema: snake_case sin comillas
echo.
pause
