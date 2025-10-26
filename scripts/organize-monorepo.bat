@echo off
echo ========================================
echo ORGANIZANDO MONOREPO NEUROPLAN MVP
echo ========================================
echo.

REM Verificar que estamos en la raíz del proyecto
if not exist "package.json" (
    echo ERROR: No se encuentra package.json en la raíz
    echo Asegúrate de ejecutar este script desde la raíz del monorepo
    pause
    exit /b 1
)

echo [1/5] Creando estructura de carpetas...
if not exist "frontend" mkdir frontend
if not exist "backend" mkdir backend
if not exist "scripts" mkdir scripts

echo [2/5] Moviendo archivos del frontend a frontend/...
REM Mover archivos del frontend a su carpeta
if exist "index.html" move "index.html" "frontend\"
if exist "src" move "src" "frontend\"
if exist "public" move "public" "frontend\"
if exist "vite.config.ts" move "vite.config.ts" "frontend\"
if exist "vitest.config.ts" move "vitest.config.ts" "frontend\"
if exist "tailwind.config.ts" move "tailwind.config.ts" "frontend\"
if exist "postcss.config.js" move "postcss.config.js" "frontend\"
if exist "eslint.config.js" move "eslint.config.js" "frontend\"
if exist "components.json" move "components.json" "frontend\"
if exist "tsconfig.app.json" move "tsconfig.app.json" "frontend\"
if exist "tsconfig.node.json" move "tsconfig.node.json" "frontend\"
if exist "serve.js" move "serve.js" "frontend\"
if exist "test.html" move "test.html" "frontend\"

echo [3/5] Reorganizando archivos .env...
REM Mover .env de la raíz a frontend/ si contiene variables VITE_
if exist ".env" (
    findstr /C:"VITE_" ".env" >nul
    if %errorlevel% == 0 (
        move ".env" "frontend\.env"
        echo .env movido a frontend/
    ) else (
        echo .env de la raíz no contiene variables VITE_, manteniendo en raíz
    )
)

echo [4/5] Creando package.json del monorepo en la raíz...
(
echo {
echo   "name": "neuroplan-mvp",
echo   "version": "1.0.0",
echo   "description": "NeuroPlan AI Campus - Monorepo MVP",
echo   "private": true,
echo   "scripts": {
echo     "dev": "concurrently \"npm run dev:frontend\" \"npm run dev:backend\"",
echo     "dev:frontend": "cd frontend && npm run dev",
echo     "dev:backend": "cd backend && npm run start:dev",
echo     "build": "npm run build:frontend && npm run build:backend",
echo     "build:frontend": "cd frontend && npm run build",
echo     "build:backend": "cd backend && npm run build",
echo     "test": "npm run test:frontend && npm run test:backend",
echo     "test:frontend": "cd frontend && npm run test",
echo     "test:backend": "cd backend && npm run test",
echo     "lint": "npm run lint:frontend && npm run lint:backend",
echo     "lint:frontend": "cd frontend && npm run lint",
echo     "lint:backend": "cd backend && npm run lint"
echo   },
echo   "devDependencies": {
echo     "concurrently": "^8.2.2"
echo   },
echo   "engines": {
echo     "node": ">=18.0.0",
echo     "npm": ">=9.0.0"
echo   }
echo }
) > package.json

echo [5/5] Actualizando .gitignore...
if not exist ".gitignore" (
    echo # Dependencies > .gitignore
    echo node_modules/ >> .gitignore
    echo.
    echo # Environment variables >> .gitignore
    echo .env >> .gitignore
    echo .env.* >> .gitignore
    echo frontend/.env >> .gitignore
    echo backend/.env >> .gitignore
    echo.
    echo # Build outputs >> .gitignore
    echo dist/ >> .gitignore
    echo build/ >> .gitignore
    echo.
    echo # Logs >> .gitignore
    echo *.log >> .gitignore
    echo logs/ >> .gitignore
) else (
    echo .gitignore ya existe, no se modificará
)

echo.
echo ========================================
echo ORGANIZACIÓN COMPLETADA
echo ========================================
echo.
echo Estructura creada:
echo neuroplan-mvp/
echo ├── frontend/          # Proyecto React/Vite
echo ├── backend/           # Proyecto NestJS
echo ├── scripts/           # Scripts de utilidad
echo ├── package.json       # Scripts del monorepo
echo └── .gitignore         # Archivos ignorados
echo.
echo Próximos pasos:
echo 1. cd frontend && npm install
echo 2. cd ../backend && npm install
echo 3. cd .. && npm install
echo 4. npm run dev
echo.
pause
