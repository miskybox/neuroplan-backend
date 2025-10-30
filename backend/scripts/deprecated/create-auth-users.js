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

// Usuarios de prueba para crear en Supabase Auth
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

async function createUsersInAuth() {
  console.log('👥 Creando usuarios en Supabase Auth...\n');

  for (const user of testUsers) {
    try {
      console.log(`📝 Creando usuario: ${user.email}`);
      
      // Crear usuario en Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: user.email,
        password: user.password,
        email_confirm: true, // Confirmar email automáticamente
        user_metadata: user.user_metadata
      });

      if (authError) {
        console.error(`❌ Error creando ${user.email}:`, authError.message);
        continue;
      }

      if (authData.user) {
        console.log(`✅ Usuario creado en Auth: ${user.email} (ID: ${authData.user.id})`);
        
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
      
      console.log(''); // Línea en blanco para separar
      
    } catch (error) {
      console.error(`❌ Error inesperado con ${user.email}:`, error);
    }
  }
}

async function verifyUsers() {
  console.log('🔍 Verificando usuarios creados...\n');
  
  try {
    // Obtener usuarios de Supabase Auth
    const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();
    
    if (authError) {
      console.error('❌ Error obteniendo usuarios de Auth:', authError.message);
      return;
    }

    console.log('👥 Usuarios en Supabase Auth:');
    authUsers.users.forEach(user => {
      console.log(`  - ${user.email} (${user.user_metadata?.role || 'Sin rol'})`);
    });

    // Obtener usuarios de nuestra tabla
    const { data: dbUsers, error: dbError } = await supabase
      .from('users')
      .select('email, role, first_name, last_name');

    if (dbError) {
      console.error('❌ Error obteniendo usuarios de DB:', dbError.message);
      return;
    }

    console.log('\n🗄️ Usuarios en tabla users:');
    dbUsers.forEach(user => {
      console.log(`  - ${user.email} (${user.role}) - ${user.first_name} ${user.last_name}`);
    });

  } catch (error) {
    console.error('❌ Error verificando usuarios:', error);
  }
}

async function testLogin() {
  console.log('🔑 Probando login...\n');
  
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
      console.log(`  - Role: ${data.user.user_metadata?.role || 'Sin rol'}`);
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('❌ Error en login:', error);
    return false;
  }
}

async function main() {
  console.log('🚀 Iniciando creación de usuarios en Supabase Auth...\n');
  
  try {
    // Paso 1: Crear usuarios en Auth
    await createUsersInAuth();
    
    // Paso 2: Verificar usuarios
    await verifyUsers();
    
    // Paso 3: Probar login
    const loginSuccess = await testLogin();
    
    console.log('\n' + '='.repeat(50));
    
    if (loginSuccess) {
      console.log('🎉 ¡Usuarios creados exitosamente!');
      console.log('\n📋 Credenciales de prueba:');
      console.log('  - admin@neuroplan.com / NeuroPlan2024!');
      console.log('  - orientador@neuroplan.com / Orientador2024!');
      console.log('  - profesor@neuroplan.com / Profesor2024!');
      console.log('\n✅ Puedes probar el login en el frontend');
    } else {
      console.log('❌ Error en el proceso de creación de usuarios');
    }
    
  } catch (error) {
    console.error('❌ Error en el proceso principal:', error);
  }
}

main().catch(console.error);
