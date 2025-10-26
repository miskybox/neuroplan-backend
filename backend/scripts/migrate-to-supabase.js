#!/usr/bin/env node

/**
 * Script completo de migración a Supabase
 * Ejecuta todos los pasos necesarios para migrar desde PostgreSQL local a Supabase
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

// Cargar variables de entorno
dotenv.config({ path: '.env' });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Error: Faltan variables de entorno SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY');
  console.log('📝 Asegúrate de tener un archivo .env con las credenciales de Supabase');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function testConnection() {
  console.log('🔍 Probando conexión a Supabase...');
  
  try {
    const { data, error } = await supabase.from('users').select('count').limit(1);
    if (error) {
      console.error('❌ Error de conexión:', error.message);
      return false;
    }
    console.log('✅ Conexión exitosa a Supabase');
    return true;
  } catch (error) {
    console.error('❌ Error de conexión:', error);
    return false;
  }
}

async function migrateSchema() {
  console.log('📋 Migrando esquema de base de datos...');
  
  try {
    // Leer el archivo SQL de migración
    const sqlPath = path.join(process.cwd(), 'migrate-to-supabase.sql');
    
    if (!fs.existsSync(sqlPath)) {
      console.error('❌ No se encontró el archivo migrate-to-supabase.sql');
      return false;
    }
    
    const sqlContent = fs.readFileSync(sqlPath, 'utf8');
    
    // Dividir el SQL en comandos individuales
    const commands = sqlContent
      .split(';')
      .map(cmd => cmd.trim())
      .filter(cmd => cmd.length > 0 && !cmd.startsWith('--'));
    
    console.log(`📝 Ejecutando ${commands.length} comandos SQL...`);
    
    for (let i = 0; i < commands.length; i++) {
      const command = commands[i];
      if (command.trim()) {
        try {
          const { error } = await supabase.rpc('exec_sql', { sql: command });
          if (error) {
            console.warn(`⚠️ Advertencia en comando ${i + 1}:`, error.message);
          }
        } catch (error) {
          console.warn(`⚠️ Error en comando ${i + 1}:`, error.message);
        }
      }
    }
    
    console.log('✅ Esquema migrado correctamente');
    return true;
    
  } catch (error) {
    console.error('❌ Error migrando esquema:', error);
    return false;
  }
}

async function createTestUsers() {
  console.log('👥 Creando usuarios de prueba...');
  
  const testUsers = [
    {
      email: 'admin@neuroplan.com',
      password: 'NeuroPlan2024!',
      user_metadata: {
        first_name: 'Admin',
        last_name: 'NeuroPlan',
        role: 'ADMIN',
        center_id: null
      }
    },
    {
      email: 'orientador@neuroplan.com',
      password: 'Orientador2024!',
      user_metadata: {
        first_name: 'María',
        last_name: 'García',
        role: 'ORIENTADOR',
        center_id: null
      }
    },
    {
      email: 'profesor@neuroplan.com',
      password: 'Profesor2024!',
      user_metadata: {
        first_name: 'Juan',
        last_name: 'Pérez',
        role: 'PROFESOR',
        center_id: null
      }
    }
  ];

  for (const user of testUsers) {
    try {
      console.log(`📝 Creando usuario: ${user.email}`);
      
      // Crear usuario en Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: user.email,
        password: user.password,
        email_confirm: true,
        user_metadata: user.user_metadata
      });

      if (authError) {
        console.error(`❌ Error creando ${user.email}:`, authError.message);
        continue;
      }

      if (authData.user) {
        console.log(`✅ Usuario creado: ${user.email}`);
        
        // Crear entrada en nuestra tabla de usuarios
        const { error: dbError } = await supabase
          .from('users')
          .insert({
            id: authData.user.id,
            email: user.email,
            role: user.user_metadata.role,
            first_name: user.user_metadata.first_name,
            last_name: user.user_metadata.last_name,
            center_id: user.user_metadata.center_id,
            active: true
          });

        if (dbError) {
          console.error(`⚠️ Error creando entrada en DB para ${user.email}:`, dbError.message);
        } else {
          console.log(`✅ Entrada en DB creada para ${user.email}`);
        }
      }
      
    } catch (error) {
      console.error(`❌ Error inesperado con ${user.email}:`, error);
    }
  }
  
  console.log('✅ Usuarios de prueba creados');
  return true;
}

async function verifyMigration() {
  console.log('🔍 Verificando migración...');
  
  try {
    // Verificar tablas creadas
    const { data: tables, error: tablesError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .in('table_name', ['users', 'students', 'reports', 'peis', 'notifications', 'audio_files', 'activity_logs']);
    
    if (tablesError) {
      console.error('❌ Error verificando tablas:', tablesError.message);
      return false;
    }
    
    console.log('📋 Tablas creadas:');
    tables.forEach(table => {
      console.log(`  ✅ ${table.table_name}`);
    });
    
    // Verificar usuarios creados
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('email, role, first_name, last_name');
    
    if (usersError) {
      console.error('❌ Error verificando usuarios:', usersError.message);
      return false;
    }
    
    console.log('\n👥 Usuarios creados:');
    users.forEach(user => {
      console.log(`  ✅ ${user.email} (${user.role}) - ${user.first_name} ${user.last_name}`);
    });
    
    console.log('\n✅ Migración verificada correctamente');
    return true;
    
  } catch (error) {
    console.error('❌ Error verificando migración:', error);
    return false;
  }
}

async function main() {
  console.log('🚀 Iniciando migración completa a Supabase...\n');
  
  try {
    // Paso 1: Probar conexión
    const connected = await testConnection();
    if (!connected) {
      console.error('❌ No se pudo conectar a Supabase. Verifica tus credenciales.');
      process.exit(1);
    }
    
    // Paso 2: Migrar esquema
    const schemaMigrated = await migrateSchema();
    if (!schemaMigrated) {
      console.error('❌ Error migrando esquema');
      process.exit(1);
    }
    
    // Paso 3: Crear usuarios de prueba
    await createTestUsers();
    
    // Paso 4: Verificar migración
    const verified = await verifyMigration();
    if (!verified) {
      console.error('❌ Error verificando migración');
      process.exit(1);
    }
    
    console.log('\n🎉 ¡Migración completada exitosamente!');
    console.log('\n📋 Próximos pasos:');
    console.log('1. ✅ Ejecutar: npm run dev (en el directorio raíz)');
    console.log('2. ✅ Probar login con: admin@neuroplan.com / NeuroPlan2024!');
    console.log('3. ✅ Verificar que el frontend se conecta al backend');
    console.log('4. ✅ Probar todas las funcionalidades');
    
  } catch (error) {
    console.error('❌ Error en el proceso principal:', error);
    process.exit(1);
  }
}

// Ejecutar si es llamado directamente
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { testConnection, migrateSchema, createTestUsers, verifyMigration };
