#!/usr/bin/env node

/**
 * Script de verificación rápida
 * Verifica que todos los componentes estén funcionando correctamente
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config({ path: '.env' });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Error: Faltan variables de entorno');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function checkSupabaseConnection() {
  console.log('🔍 Verificando conexión a Supabase...');
  
  try {
    const { data, error } = await supabase.from('users').select('count').limit(1);
    if (error) {
      console.error('❌ Error de conexión:', error.message);
      return false;
    }
    console.log('✅ Conexión a Supabase exitosa');
    return true;
  } catch (error) {
    console.error('❌ Error de conexión:', error);
    return false;
  }
}

async function checkTables() {
  console.log('📋 Verificando tablas...');
  
  const expectedTables = ['users', 'students', 'reports', 'peis', 'notifications', 'audio_files', 'activity_logs'];
  
  for (const tableName of expectedTables) {
    try {
      const { data, error } = await supabase.from(tableName).select('count').limit(1);
      if (error) {
        console.error(`❌ Tabla ${tableName} no encontrada:`, error.message);
        return false;
      }
      console.log(`✅ Tabla ${tableName} existe`);
    } catch (error) {
      console.error(`❌ Error verificando tabla ${tableName}:`, error);
      return false;
    }
  }
  
  return true;
}

async function checkUsers() {
  console.log('👥 Verificando usuarios...');
  
  try {
    const { data: users, error } = await supabase
      .from('users')
      .select('email, role, first_name, last_name');
    
    if (error) {
      console.error('❌ Error obteniendo usuarios:', error.message);
      return false;
    }
    
    if (users.length === 0) {
      console.error('❌ No hay usuarios en la base de datos');
      return false;
    }
    
    console.log('✅ Usuarios encontrados:');
    users.forEach(user => {
      console.log(`  - ${user.email} (${user.role}) - ${user.first_name} ${user.last_name}`);
    });
    
    return true;
  } catch (error) {
    console.error('❌ Error verificando usuarios:', error);
    return false;
  }
}

async function checkAuthUsers() {
  console.log('🔐 Verificando usuarios de Supabase Auth...');
  
  try {
    const { data: authUsers, error } = await supabase.auth.admin.listUsers();
    
    if (error) {
      console.error('❌ Error obteniendo usuarios de Auth:', error.message);
      return false;
    }
    
    if (authUsers.users.length === 0) {
      console.error('❌ No hay usuarios en Supabase Auth');
      return false;
    }
    
    console.log('✅ Usuarios de Auth encontrados:');
    authUsers.users.forEach(user => {
      console.log(`  - ${user.email} (${user.user_metadata?.role || 'Sin rol'})`);
    });
    
    return true;
  } catch (error) {
    console.error('❌ Error verificando usuarios de Auth:', error);
    return false;
  }
}

async function testLogin() {
  console.log('🔑 Probando login...');
  
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: 'admin@neuroplan.com',
      password: 'NeuroPlan2024!'
    });
    
    if (error) {
      console.error('❌ Error en login:', error.message);
      return false;
    }
    
    if (data.user) {
      console.log('✅ Login exitoso con admin@neuroplan.com');
      console.log(`  - User ID: ${data.user.id}`);
      console.log(`  - Email: ${data.user.email}`);
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('❌ Error en login:', error);
    return false;
  }
}

async function main() {
  console.log('🚀 Iniciando verificación completa...\n');
  
  const checks = [
    { name: 'Conexión Supabase', fn: checkSupabaseConnection },
    { name: 'Tablas', fn: checkTables },
    { name: 'Usuarios DB', fn: checkUsers },
    { name: 'Usuarios Auth', fn: checkAuthUsers },
    { name: 'Login', fn: testLogin }
  ];
  
  let allPassed = true;
  
  for (const check of checks) {
    console.log(`\n📋 ${check.name}:`);
    const passed = await check.fn();
    if (!passed) {
      allPassed = false;
    }
  }
  
  console.log('\n' + '='.repeat(50));
  
  if (allPassed) {
    console.log('🎉 ¡TODAS LAS VERIFICACIONES PASARON!');
    console.log('\n✅ El sistema está listo para usar');
    console.log('📝 Puedes iniciar el proyecto con: npm run dev');
    console.log('🔑 Usa admin@neuroplan.com / NeuroPlan2024! para login');
  } else {
    console.log('❌ ALGUNAS VERIFICACIONES FALLARON');
    console.log('\n🔧 Revisa los errores anteriores');
    console.log('📝 Ejecuta la migración: node backend/scripts/migrate-to-supabase.js');
  }
  
  console.log('\n' + '='.repeat(50));
}

// Ejecutar si es llamado directamente
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { checkSupabaseConnection, checkTables, checkUsers, checkAuthUsers, testLogin };
