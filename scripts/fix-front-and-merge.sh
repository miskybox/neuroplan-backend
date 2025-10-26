#!/usr/bin/env bash
set -euo pipefail

echo "🚀 NeuroPlan MVP – Organización de monorepo (solo estructura, sin fetch/subtree externos)"

# 0) Requisitos
git rev-parse --is-inside-work-tree >/dev/null 2>&1 || { echo "❌ No estás dentro de un repo Git"; exit 1; }

current_branch=$(git rev-parse --abbrev-ref HEAD)
echo "🔎 Rama actual: $current_branch"

# 1) Cambia a dev (crea desde main si no existe)
if ! git show-ref --verify --quiet refs/heads/dev; then
  echo "ℹ️ No existe rama 'dev'. Creándola desde 'main'..."
  git checkout main
  git pull --ff-only || true
  git checkout -b dev
  git push -u origin dev || true
else
  git checkout dev
fi

# 2) Mover proyecto Vite desde raíz a frontend/
mkdir -p frontend

move_if_exists() {
  local p="$1"
  if [ -e "$p" ]; then
    echo "↪️  git mv $p frontend/"
    git mv "$p" frontend/ || true
  fi
}

echo "📦 Moviendo archivos típicos de Vite a frontend/ (si existen en raíz)"
move_if_exists index.html
move_if_exists src
move_if_exists public
move_if_exists vite.config.ts
move_if_exists vite.config.js
move_if_exists vitest.config.ts
move_if_exists tailwind.config.ts
move_if_exists postcss.config.js
move_if_exists eslint.config.js
move_if_exists components.json
move_if_exists tsconfig.json
move_if_exists tsconfig.node.json
move_if_exists package.json
move_if_exists package-lock.json
move_if_exists yarn.lock
move_if_exists pnpm-lock.yaml
move_if_exists README_CONSOLIDADO.md
move_if_exists serve.js
move_if_exists test.html

# 3) Mover .env de raíz a frontend/.env si existe y no hay conflicto
if [ -f ".env" ] && [ ! -f "frontend/.env" ]; then
  echo "🔐 Moviendo .env de raíz a frontend/.env"
  git mv .env frontend/.env || true
fi

# 4) Asegurar .gitignore
echo "🧹 Asegurando .gitignore en raíz"
if ! grep -qE '(^|/)frontend/.env' .gitignore 2>/dev/null; then
  cat >> .gitignore <<'IGN'
# envs
.env
.env.*
frontend/.env
backend/.env
# node
node_modules/
frontend/node_modules/
backend/node_modules/
# dist/build
dist/
IGN
fi

git add . || true
git commit -m "refactor: move frontend project into frontend/ and fix env locations" || true

# 5) package.json en raíz con scripts del monorepo
if [ ! -f package.json ]; then
  echo "🛠️  Creando package.json en raíz para scripts del monorepo"
  npm init -y >/dev/null 2>&1 || true
fi

# añade concurrently y scripts
node - <<'JS'
const fs = require('fs');
const pkg = JSON.parse(fs.readFileSync('package.json','utf8'));
pkg.name = pkg.name || 'neuroplan-mvp';
pkg.private = true;
pkg.scripts = Object.assign({}, pkg.scripts, {
  "dev": "concurrently -k \"npm:dev:backend\" \"npm:dev:frontend\"",
  "dev:frontend": "npm --prefix frontend run dev",
  "dev:backend": "npm --prefix backend run start:dev",
  "build": "npm --prefix frontend run build && npm --prefix backend run build"
});
pkg.devDependencies = Object.assign({}, pkg.devDependencies, { "concurrently": "^9.0.0" });
fs.writeFileSync('package.json', JSON.stringify(pkg,null,2));
console.log("✅ package.json actualizado");
JS

git add package.json || true
git commit -m "chore: add monorepo root scripts (concurrently)" || true

# 6) (Opcional) Traer rama remota del frontend original (comentado)
# echo "🌐 Fetch de np_front"
# git fetch np_front
# echo "🔀 Merge de np_front/feature/Review en frontend/ (subtree pull)"
# git subtree pull --prefix=frontend np_front feature/Review --squash

# 7) (Opcional) Traer backend con subtree (comentado)
# git fetch np_back
# git subtree add --prefix=backend np_back dev --squash


git status
echo "✅ Listo. Si hay conflictos, resuélvelos en 'frontend/' y haz commit."
echo "👉 Recomendación: npm --prefix frontend install && npm --prefix backend install"
