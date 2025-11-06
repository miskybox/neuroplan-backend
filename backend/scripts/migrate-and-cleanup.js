/**
 * Script para ejecutar migración al esquema normalizado y limpiar usuarios de prueba
 * Mantiene solo admin@neuroplan.com
 * 
 * Uso: node backend/scripts/migrate-and-cleanup.js
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Cargar variables de entorno
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Error: Faltan variables de entorno SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY');
  console.error('   Asegúrate de tener un archivo .env en backend/ con estas variables');
  process.exit(1);
}

// Crear cliente de Supabase
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function cleanupTestUsers() {
  console.log('🧹 Limpiando usuarios de prueba...\n');

  try {
    // Obtener todos los usuarios
    const { data: users, error: fetchError } = await supabase
      .from('users')
      .select('id, email, role');

    if (fetchError) {
      console.error('   ⚠️  Error obteniendo usuarios:', fetchError.message);
      console.log('   ℹ️  Continuando con la migración...\n');
      return;
    }

    if (!users || users.length === 0) {
      console.log('   ℹ️  No hay usuarios en la tabla users\n');
      return;
    }

    console.log(`   📊 Usuarios encontrados: ${users.length}`);

    // Filtrar usuarios a eliminar (mantener solo admin@neuroplan.com)
    const usersToDelete = users.filter(u => 
      u.email !== 'admin@neuroplan.com' && 
      !u.email.startsWith('admin@')
    );

    if (usersToDelete.length === 0) {
      console.log('   ✅ No hay usuarios de prueba para eliminar\n');
      return;
    }

    console.log(`   🗑️  Eliminando ${usersToDelete.length} usuarios de prueba...`);

    // Eliminar usuarios uno por uno
    let deletedCount = 0;
    for (const user of usersToDelete) {
      try {
        // Primero eliminar de Supabase Auth (si existe)
        try {
          const { error: authError } = await supabase.auth.admin.deleteUser(user.id);
          if (authError && !authError.message.includes('User not found')) {
            console.log(`   ⚠️  No se pudo eliminar de Auth: ${user.email}`);
          }
        } catch (err) {
          // Ignorar errores de Auth si el usuario no existe
        }

        // Eliminar de la tabla users
        const { error: deleteError } = await supabase
          .from('users')
          .delete()
          .eq('id', user.id);

        if (deleteError) {
          console.log(`   ❌ Error eliminando ${user.email}: ${deleteError.message}`);
        } else {
          console.log(`   ✅ Eliminado: ${user.email}`);
          deletedCount++;
        }
      } catch (error) {
        console.log(`   ❌ Error procesando ${user.email}: ${error.message}`);
      }
    }

    console.log(`\n   ✅ ${deletedCount} usuarios eliminados`);

    // Verificar usuarios restantes
    const { data: remainingUsers } = await supabase
      .from('users')
      .select('id, email, role');

    console.log(`\n   📋 Usuarios restantes: ${remainingUsers?.length || 0}`);
    if (remainingUsers && remainingUsers.length > 0) {
      remainingUsers.forEach(u => {
        console.log(`      - ${u.email} (${u.role || 'sin rol'})`);
      });
    }
    console.log('');

  } catch (error) {
    console.error('   ❌ Error limpiando usuarios:', error.message);
    console.log('   ℹ️  Continuando con la migración...\n');
  }
}

async function generateCompleteSQL() {
  console.log('📄 Preparando script SQL completo...\n');

  try {
    // Leer el script de migración
    const migrationPath = path.join(__dirname, '../migrations/normalize-schema.sql');
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8');

    // Agregar limpieza de usuarios ANTES de la migración
    const cleanupSQL = `
-- ===========================================
-- LIMPIEZA DE USUARIOS DE PRUEBA (ANTES DE MIGRACIÓN)
-- ===========================================
-- Eliminar todos los usuarios excepto admin@neuroplan.com
-- Esto se hace ANTES de la migración para evitar problemas con foreign keys

-- Eliminar usuarios de prueba (mantener solo admin@neuroplan.com)
DELETE FROM public.users 
WHERE email != 'admin@neuroplan.com' 
AND email NOT LIKE 'admin@%';

-- Verificar usuarios restantes
SELECT 
    'Usuarios restantes después de limpieza:' as info,
    COUNT(*) as total
FROM public.users 
WHERE email = 'admin@neuroplan.com' OR email LIKE 'admin@%';
`;

    // Crear script combinado (limpieza primero, luego migración)
    const fullScript = cleanupSQL + '\n\n' + migrationSQL;

    // Guardar script completo
    const outputPath = path.join(__dirname, '../migrations/normalize-schema-with-cleanup.sql');
    fs.writeFileSync(outputPath, fullScript, 'utf8');

    console.log('✅ Script completo creado:');
    console.log(`   ${outputPath}\n`);

    return outputPath;

  } catch (error) {
    console.error('❌ Error generando script SQL:', error);
    throw error;
  }
}

async function tryExecuteWithPsql(sqlFilePath) {
  // Extraer conexión de Supabase URL
  // Supabase URL: https://xxxxx.supabase.co
  // Necesitamos: postgresql://postgres:[password]@db.xxxxx.supabase.co:5432/postgres
  
  const urlMatch = supabaseUrl.match(/https:\/\/([^.]+)\.supabase\.co/);
  if (!urlMatch) {
    return false;
  }

  const projectRef = urlMatch[1];
  const dbPassword = process.env.SUPABASE_DB_PASSWORD;

  if (!dbPassword) {
    console.log('   ℹ️  SUPABASE_DB_PASSWORD no configurado, no se puede ejecutar con psql\n');
    return false;
  }

  const dbUrl = `postgresql://postgres.${projectRef}:${dbPassword}@aws-0-us-west-1.pooler.supabase.com:6543/postgres`;
  
  try {
    console.log('   🔄 Intentando ejecutar con psql...');
    const sql = fs.readFileSync(sqlFilePath, 'utf8');
    
    // Ejecutar con psql
    execSync(`psql "${dbUrl}" -f "${sqlFilePath}"`, {
      stdio: 'inherit',
      encoding: 'utf8'
    });
    
    console.log('   ✅ Migración ejecutada exitosamente con psql\n');
    return true;
  } catch (error) {
    console.log('   ⚠️  Error ejecutando con psql:', error.message);
    return false;
  }
}

async function main() {
  console.log('🚀 Iniciando migración al esquema normalizado\n');
  console.log('='.repeat(60));
  console.log('');

  try {
    // Paso 1: Limpiar usuarios de prueba
    await cleanupTestUsers();

    // Paso 2: Generar script SQL completo
    const sqlFilePath = await generateCompleteSQL();

    // Paso 3: Intentar ejecutar con psql si está disponible
    console.log('📋 Ejecutando migración SQL...\n');
    
    const executed = await tryExecuteWithPsql(sqlFilePath);

    if (!executed) {
      // Si no se puede ejecutar con psql, mostrar instrucciones
      console.log('📋 INSTRUCCIONES PARA EJECUTAR MIGRACIÓN:\n');
      console.log('   1. Abre Supabase Dashboard: https://app.supabase.com');
      console.log('   2. Selecciona tu proyecto');
      console.log('   3. Ve a SQL Editor (menú lateral)');
      console.log('   4. Copia y pega el contenido del archivo:');
      console.log(`      ${sqlFilePath}`);
      console.log('   5. Haz clic en "Run" o presiona Ctrl+Enter\n');
      console.log('   El script ya incluye la limpieza de usuarios.\n');
    }

    console.log('='.repeat(60));
    console.log('✅ Proceso completado');
    console.log('');

  } catch (error) {
    console.error('❌ Error durante la migración:', error);
    process.exit(1);
  }
}

// Ejecutar
main().catch(error => {
  console.error('❌ Error fatal:', error);
  process.exit(1);
});

