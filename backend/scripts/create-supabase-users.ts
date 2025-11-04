#!/usr/bin/env node

/**
 * Script para crear usuarios en Supabase Auth
 * Ejecutar después de migrar el esquema de base de datos
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config({ path: '.env' });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Error: Faltan variables de entorno SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase: SupabaseClient = createClient(supabaseUrl, supabaseServiceKey);

interface TestUser {
  email: string;
  password: string;
  user_metadata: {
    first_name: string;
    last_name: string;
    role: string;
    center_id: string | null;
  };
}

// Usuarios de prueba para crear
const testUsers: TestUser[] = [
  {
    email: 'admin@neuroplan.com',
    password: 'NeuroPlan2024!',
    user_metadata: {
      first_name: 'Admin',
      last_name: 'NeuroPlan',
      role: 'ADMIN',
      center_id: null,
    },
  },
  {
    email: 'orientador@neuroplan.com',
    password: 'Orientador2024!',
    user_metadata: {
      first_name: 'María',
      last_name: 'García',
      role: 'ORIENTADOR',
      center_id: null,
    },
  },
  {
    email: 'profesor@neuroplan.com',
    password: 'Profesor2024!',
    user_metadata: {
      first_name: 'Juan',
      last_name: 'Pérez',
      role: 'PROFESOR',
      center_id: null,
    },
  },
  {
    email: 'director@neuroplan.com',
    password: 'Director2024!',
    user_metadata: {
      first_name: 'Ana',
      last_name: 'Martínez',
      role: 'DIRECTOR_CENTRO',
      center_id: null,
    },
  },
];

async function createUsers(): Promise<void> {
  console.log('🚀 Creando usuarios en Supabase Auth...\n');

  for (const user of testUsers) {
    try {
      console.log(`📝 Creando usuario: ${user.email}`);

      // Crear usuario en Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: user.email,
        password: user.password,
        email_confirm: true, // Confirmar email automáticamente
        user_metadata: user.user_metadata,
      });

      if (authError) {
        console.error(`❌ Error creando ${user.email}:`, authError.message);
        continue;
      }

      if (authData.user) {
        console.log(`✅ Usuario creado: ${user.email} (ID: ${authData.user.id})`);

        // Crear entrada en nuestra tabla de usuarios
        const { error: dbError } = await supabase.from('users').insert({
          id: authData.user.id,
          email: user.email,
          role: user.user_metadata.role,
          first_name: user.user_metadata.first_name,
          last_name: user.user_metadata.last_name,
          center_id: user.user_metadata.center_id,
          active: true,
        });

        if (dbError) {
          console.error(`⚠️ Error creando entrada en DB para ${user.email}:`, dbError.message);
        } else {
          console.log(`✅ Entrada en DB creada para ${user.email}`);
        }
      }

      console.log(''); // Línea en blanco para separar
    } catch (error) {
      console.error(`❌ Error inesperado con ${user.email}:`, error);
    }
  }
}

async function verifyUsers(): Promise<void> {
  console.log('🔍 Verificando usuarios creados...\n');

  try {
    // Obtener usuarios de Supabase Auth
    const { data: authUsersData, error: authError } = await supabase.auth.admin.listUsers();

    if (authError) {
      console.error('❌ Error obteniendo usuarios de Auth:', authError.message);
      return;
    }

    console.log('👥 Usuarios en Supabase Auth:');
    for (const user of authUsersData.users) {
      console.log(`  - ${user.email} (${user.user_metadata?.role || 'Sin rol'})`);
    }

    // Obtener usuarios de nuestra tabla
    const { data: dbUsers, error: dbError } = await supabase
      .from('users')
      .select('email, role, first_name, last_name');

    if (dbError) {
      console.error('❌ Error obteniendo usuarios de DB:', dbError.message);
      return;
    }

    console.log('\n🗄️ Usuarios en tabla users:');
    if (dbUsers) {
      for (const user of dbUsers) {
        console.log(`  - ${user.email} (${user.role}) - ${user.first_name} ${user.last_name}`);
      }
    }
  } catch (error) {
    console.error('❌ Error verificando usuarios:', error);
  }
}

// Ejecutar si es llamado directamente
if (require.main === module) {
  try {
    await createUsers();
    await verifyUsers();

    console.log('\n🎉 Proceso completado!');
    console.log('\n📋 Próximos pasos:');
    console.log('1. Ejecutar el script de migración SQL en Supabase');
    console.log('2. Probar el login con los usuarios creados');
    console.log('3. Verificar que el backend se conecta correctamente');
  } catch (error) {
    console.error('❌ Error en el proceso principal:', error);
    process.exit(1);
  }
}

export { createUsers, verifyUsers };
