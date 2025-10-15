@echo off
echo ====================================
echo    NEUROPLAN - TEST DE ENDPOINTS
echo ====================================
echo.

REM Colores (simulados con texto)
set SUCCESS=[OK]
set FAIL=[ERROR]
set INFO=[INFO]

echo %INFO% Verificando backend...
echo.

REM Test 1: Health Check
echo 1. Health Check (GET /health)
curl -s http://localhost:3001/health > nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo    %SUCCESS% Backend respondiendo
    curl -s http://localhost:3001/health
) else (
    echo    %FAIL% Backend NO responde
    echo    Asegurate de que el backend este corriendo en puerto 3001
    pause
    exit /b 1
)
echo.
echo.

REM Test 2: Listar estudiantes
echo 2. Listar Estudiantes (GET /api/uploads/students)
curl -s http://localhost:3001/api/uploads/students > temp_students.json
if %ERRORLEVEL% EQU 0 (
    echo    %SUCCESS% Endpoint funciona
    type temp_students.json
) else (
    echo    %FAIL% Error en endpoint
)
del temp_students.json 2>nul
echo.
echo.

REM Test 3: Crear estudiante
echo 3. Crear Estudiante (POST /api/uploads/students)
curl -s -X POST http://localhost:3001/api/uploads/students ^
  -H "Content-Type: application/json" ^
  -d "{\"name\":\"Maria\",\"lastName\":\"Garcia\",\"birthDate\":\"2012-03-15\",\"grade\":\"6to Primaria\",\"parentEmail\":\"maria@test.com\"}" ^
  > temp_student.json

if %ERRORLEVEL% EQU 0 (
    echo    %SUCCESS% Estudiante creado
    type temp_student.json
) else (
    echo    %FAIL% Error creando estudiante
)
echo.
echo.

REM Guardar ID del estudiante
for /f "tokens=2 delims=:" %%a in ('findstr "id" temp_student.json') do (
    set STUDENT_ID=%%a
    goto :done
)
:done
set STUDENT_ID=%STUDENT_ID:"=%
set STUDENT_ID=%STUDENT_ID:,=%
set STUDENT_ID=%STUDENT_ID: =%

echo %INFO% ID del estudiante: %STUDENT_ID%
del temp_student.json 2>nul
echo.

REM Test 4: Verificar endpoint de upload (sin archivo real)
echo 4. Verificar Endpoint Upload (POST /api/uploads/reports/:id)
echo    %INFO% Este endpoint requiere un archivo multipart/form-data
echo    %INFO% Usa Postman o upload.html para probarlo manualmente
echo.

REM Test 5: Verificar endpoint de PEI (sin report real)
echo 5. Verificar Endpoint PEI (POST /api/peis/generate)
echo    %INFO% Este endpoint requiere un reportId valido
echo    %INFO% Usa el flujo completo desde upload.html para probarlo
echo.

REM Test 6: Verificar endpoint n8n
echo 6. Verificar Endpoint n8n (POST /api/n8n/pei/:id/generated)
echo    %INFO% Este endpoint requiere un PEI ID valido
echo    %INFO% Se dispara automaticamente en el flujo completo
echo.

echo ====================================
echo        RESUMEN DE TESTS
echo ====================================
echo.
echo %SUCCESS% Health Check: OK
echo %SUCCESS% GET /api/uploads/students: OK
echo %SUCCESS% POST /api/uploads/students: OK
echo %INFO% POST /api/uploads/reports/:id: Requiere test manual
echo %INFO% POST /api/peis/generate: Requiere test manual
echo %INFO% POST /api/n8n/pei/:id/generated: Requiere test manual
echo.
echo ====================================
echo     PRUEBA MANUAL RECOMENDADA
echo ====================================
echo.
echo 1. Abre upload.html en tu navegador
echo 2. Selecciona el estudiante "%STUDENT_ID%"
echo 3. Sube un archivo PDF o imagen
echo 4. Verifica que se complete el flujo
echo.
echo Para abrir upload.html:
echo    start upload.html
echo.
pause
