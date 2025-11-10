@echo off
echo ========================================
echo    Arrancando NeuroPlan MVP
echo ========================================
echo.

REM Matar procesos existentes
echo [1/5] Limpiando procesos anteriores...
taskkill /F /IM node.exe >nul 2>&1
timeout /t 2 /nobreak >nul

REM Arrancar Ollama
echo [2/5] Arrancando Ollama...
start /B ollama serve
timeout /t 3 /nobreak >nul

REM Arrancar Backend
echo [3/5] Arrancando Backend...
start "NeuroPlan Backend" cmd /k "cd /d c:\Users\misky\Desktop\neuroplan-mvp\backend && npm run start:dev"
timeout /t 15 /nobreak

REM Arrancar Frontend
echo [4/5] Arrancando Frontend...
start "NeuroPlan Frontend" cmd /k "cd /d c:\Users\misky\Desktop\neuroplan-mvp\frontend && npm run dev"
timeout /t 5 /nobreak
timeout /t 5 /nobreak

REM Verificar servicios
echo [5/5] Verificando servicios...
echo.
curl -s http://localhost:11434/api/tags | findstr "models" >nul && echo [OK] Ollama corriendo || echo [ERROR] Ollama no responde
curl -s http://localhost:3001/api/health | findstr "healthy" >nul && echo [OK] Backend corriendo || echo [ERROR] Backend no responde  
timeout /t 2 /nobreak >nul
curl -s -I http://localhost:5173 | findstr "HTTP" >nul && echo [OK] Frontend corriendo || echo [ERROR] Frontend no responde

echo.
echo ========================================
echo URLs:
echo   Frontend: http://localhost:5173
echo   Backend:  http://localhost:3001/api
echo   Swagger:  http://localhost:3001/api/docs
echo ========================================
echo.
pause
