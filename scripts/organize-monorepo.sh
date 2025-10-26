#!/bin/bash

echo "========================================"
echo "ORGANIZANDO MONOREPO NEUROPLAN MVP"
echo "========================================"
echo

# Verificar que estamos en la raíz del proyecto
if [ ! -f "package.json" ]; then
    echo "ERROR: No se encuentra package.json en la raíz"
    echo "Asegúrate de ejecutar este script desde la raíz del monorepo"
    exit 1
fi

echo "[1/5] Creando estructura de carpetas..."
mkdir -p frontend backend scripts

echo "[2/5] Moviendo archivos del frontend a frontend/..."
# Mover archivos del frontend a su carpeta
[ -f "index.html" ] && mv "index.html" "frontend/"
[ -d "src" ] && mv "src" "frontend/"
[ -d "public" ] && mv "public" "frontend/"
[ -f "vite.config.ts" ] && mv "vite.config.ts" "frontend/"
[ -f "vitest.config.ts" ] && mv "vitest.config.ts" "frontend/"
[ -f "tailwind.config.ts" ] && mv "tailwind.config.ts" "frontend/"
[ -f "postcss.config.js" ] && mv "postcss.config.js" "frontend/"
[ -f "eslint.config.js" ] && mv "eslint.config.js" "frontend/"
[ -f "components.json" ] && mv "components.json" "frontend/"
[ -f "tsconfig.app.json" ] && mv "tsconfig.app.json" "frontend/"
[ -f "tsconfig.node.json" ] && mv "tsconfig.node.json" "frontend/"
[ -f "serve.js" ] && mv "serve.js" "frontend/"
[ -f "test.html" ] && mv "test.html" "frontend/"

echo "[3/5] Reorganizando archivos .env..."
# Mover .env de la raíz a frontend/ si contiene variables VITE_
if [ -f ".env" ]; then
    if grep -q "VITE_" ".env"; then
        mv ".env" "frontend/.env"
        echo ".env movido a frontend/"
    else
        echo ".env de la raíz no contiene variables VITE_, manteniendo en raíz"
    fi
fi

echo "[4/5] Creando package.json del monorepo en la raíz..."
cat > package.json << 'EOF'
{
  "name": "neuroplan-mvp",
  "version": "1.0.0",
  "description": "NeuroPlan AI Campus - Monorepo MVP",
  "private": true,
  "scripts": {
    "dev": "concurrently \"npm run dev:frontend\" \"npm run dev:backend\"",
    "dev:frontend": "cd frontend && npm run dev",
    "dev:backend": "cd backend && npm run start:dev",
    "build": "npm run build:frontend && npm run build:backend",
    "build:frontend": "cd frontend && npm run build",
    "build:backend": "cd backend && npm run build",
    "test": "npm run test:frontend && npm run test:backend",
    "test:frontend": "cd frontend && npm run test",
    "test:backend": "cd backend && npm run test",
    "lint": "npm run lint:frontend && npm run lint:backend",
    "lint:frontend": "cd frontend && npm run lint",
    "lint:backend": "cd backend && npm run lint"
  },
  "devDependencies": {
    "concurrently": "^8.2.2"
  },
  "engines": {
    "node": ">=18.0.0",
    "npm": ">=9.0.0"
  }
}
EOF

echo "[5/5] Actualizando .gitignore..."
if [ ! -f ".gitignore" ]; then
    cat > .gitignore << 'EOF'
# Dependencies
node_modules/

# Environment variables
.env
.env.*
frontend/.env
backend/.env

# Build outputs
dist/
build/

# Logs
*.log
logs/
EOF
    echo ".gitignore creado"
else
    echo ".gitignore ya existe, no se modificará"
fi

echo
echo "========================================"
echo "ORGANIZACIÓN COMPLETADA"
echo "========================================"
echo
echo "Estructura creada:"
echo "neuroplan-mvp/"
echo "├── frontend/          # Proyecto React/Vite"
echo "├── backend/           # Proyecto NestJS"
echo "├── scripts/           # Scripts de utilidad"
echo "├── package.json       # Scripts del monorepo"
echo "└── .gitignore         # Archivos ignorados"
echo
echo "Próximos pasos:"
echo "1. cd frontend && npm install"
echo "2. cd ../backend && npm install"
echo "3. cd .. && npm install"
echo "4. npm run dev"
echo
