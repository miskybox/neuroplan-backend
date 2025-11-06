@echo off
echo ========================================
echo   Iniciando Ollama Service
echo ========================================
echo.

REM Verificar si Ollama ya está corriendo
netstat -ano | findstr ":11434" >nul
if %errorlevel% equ 0 (
    echo ✅ Ollama ya está corriendo en el puerto 11434
    echo.
    pause
    exit /b 0
)

REM Buscar ruta de Ollama
where ollama >nul 2>&1
if %errorlevel% equ 0 (
    echo [1/2] Ollama encontrado en PATH
    set OLLAMA_PATH=ollama.exe
) else (
    if exist "C:\Users\%USERNAME%\AppData\Local\Programs\Ollama\ollama.exe" (
        echo [1/2] Ollama encontrado en ubicación estándar
        set OLLAMA_PATH=C:\Users\%USERNAME%\AppData\Local\Programs\Ollama\ollama.exe
    ) else (
        echo ❌ Ollama no encontrado
        echo.
        echo Por favor instala Ollama desde: https://ollama.com/download
        echo.
        pause
        exit /b 1
    )
)

REM Iniciar Ollama
echo [2/2] Iniciando Ollama...
start "Ollama Service" "%OLLAMA_PATH%" serve

REM Esperar a que inicie
echo   Esperando 5 segundos...
timeout /t 5 /nobreak >nul

REM Verificar que esté corriendo
netstat -ano | findstr ":11434" >nul
if %errorlevel% equ 0 (
    echo ✅ Ollama iniciado correctamente en http://localhost:11434
    echo.
    echo Para verificar modelos instalados:
    echo   ollama list
    echo.
    echo Para instalar el modelo requerido:
    echo   ollama pull llama3.2:3b
) else (
    echo ⚠ Ollama puede estar iniciando, verifica manualmente
    echo   Abre: http://localhost:11434
)

echo.
pause












