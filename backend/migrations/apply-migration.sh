#!/bin/bash

# Script para aplicar migración SQL a Supabase
# Uso: ./apply-migration.sh [migration-file]

set -e

MIGRATION_FILE="${1:-backend/migrations/add-students-columns.sql}"
SUPABASE_URL="${SUPABASE_URL}"
SUPABASE_SERVICE_ROLE_KEY="${SUPABASE_SERVICE_ROLE_KEY}"

if [ -z "$SUPABASE_URL" ] || [ -z "$SUPABASE_SERVICE_ROLE_KEY" ]; then
    echo "❌ Error: Variables de entorno SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY son requeridas"
    echo "Uso:"
    echo "  export SUPABASE_URL='https://your-project.supabase.co'"
    echo "  export SUPABASE_SERVICE_ROLE_KEY='your-service-role-key'"
    echo "  ./apply-migration.sh [migration-file]"
    exit 1
fi

if [ ! -f "$MIGRATION_FILE" ]; then
    echo "❌ Error: Archivo de migración no encontrado: $MIGRATION_FILE"
    exit 1
fi

echo "🔍 Aplicando migración: $MIGRATION_FILE"
echo "📡 Servidor: $SUPABASE_URL"

# Leer el archivo SQL
SQL_CONTENT=$(cat "$MIGRATION_FILE")

# Ejecutar con curl
RESPONSE=$(curl -s -X POST \
    "${SUPABASE_URL}/rest/v1/rpc/exec_sql" \
    -H "apikey: ${SUPABASE_SERVICE_ROLE_KEY}" \
    -H "Authorization: Bearer ${SUPABASE_SERVICE_ROLE_KEY}" \
    -H "Content-Type: application/json" \
    -d "{\"query\": $(jq -Rs . <<< "$SQL_CONTENT")}")

echo "✅ Migración aplicada exitosamente"
echo "📋 Respuesta: $RESPONSE"
