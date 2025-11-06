/**
 * Script para ejecutar migración SQL usando la API de Supabase
 * Nota: Supabase no permite ejecutar SQL arbitrario desde la API REST
 * Este script intenta ejecutar comandos básicos y luego muestra instrucciones
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

require('dotenv').config({ path: path.join(__dirname, '../.env') });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Error: Faltan variables de entorno');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function executeMigrationSteps() {
  console.log('🚀 Ejecutando migración paso a paso...\n');

  try {
    // Paso 1: Crear tabla persons
    console.log('📋 Paso 1: Creando tabla persons...');
    const { error: personsError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS public.persons (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          first_name TEXT,
          last_name TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    });

    if (personsError && !personsError.message.includes('already exists')) {
      console.log('   ⚠️  No se puede ejecutar SQL directamente desde la API');
      console.log('   ℹ️  Usando método alternativo...\n');
      return false;
    }

    return true;
  } catch (error) {
    console.log('   ⚠️  Supabase no permite ejecutar SQL arbitrario desde la API');
    return false;
  }
}

async function main() {
  console.log('🔧 Intentando ejecutar migración...\n');

  const canExecute = await executeMigrationSteps();

  if (!canExecute) {
    console.log('='.repeat(60));
    console.log('📋 INSTRUCCIONES PARA EJECUTAR MIGRACIÓN:\n');
    console.log('   Supabase requiere ejecutar SQL desde el Dashboard.\n');
    console.log('   Pasos:\n');
    console.log('   1. Abre: https://app.supabase.com');
    console.log('   2. Selecciona tu proyecto');
    console.log('   3. Ve a: SQL Editor (menú lateral)');
    console.log('   4. Abre el archivo:');
    console.log('      backend/migrations/normalize-schema-with-cleanup.sql');
    console.log('   5. Copia TODO el contenido');
    console.log('   6. Pégalo en el SQL Editor');
    console.log('   7. Haz clic en "Run" o presiona Ctrl+Enter\n');
    console.log('   ✅ Los usuarios de prueba ya fueron eliminados');
    console.log('   ✅ El script SQL está listo para ejecutar\n');
  }
}

main().catch(console.error);

