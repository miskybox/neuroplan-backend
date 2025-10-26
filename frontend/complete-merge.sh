#!/bin/bash

# Script para completar el merge pendiente

echo "🔍 Verificando estado del repositorio..."
git status

echo ""
echo "📝 Verificando archivos en conflicto..."
git diff --name-only --diff-filter=U

echo ""
echo "✅ Completando el merge..."
git add .

echo ""
echo "💾 Haciendo commit del merge..."
git commit -m "Merge branch 'main' - Fix studentId endpoint from /uploads to /upload"

echo ""
echo "📤 Haciendo push al repositorio..."
git push origin main

echo ""
echo "✅ ¡Merge completado exitosamente!"
git status
