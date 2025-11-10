/**
 * Script para crear usuarios de prueba con diferentes roles
 *
 * Uso:
 *   node scripts/create-test-users-roles.js
 *
 * Crea 5 usuarios de prueba:
 *   - admin@test.com (ADMIN)
 *   - orientador@test.com (ORIENTADOR)
 *   - profesor@test.com (PROFESOR)
 *   - director@test.com (DIRECTOR_CENTRO)
 *   - familia@test.com (FAMILIA)
 *
 * Contraseña común: Test123456!
 */

const { createClient } = require("@supabase/supabase-js");
require("dotenv").config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error(
    "❌ Error: SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY requeridas en .env"
  );
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const testUsers = [
  {
    email: "admin@test.com",
    password: "Test123456!",
    role: "ADMIN",
    metadata: {
      first_name: "Admin",
      last_name: "Sistema",
    },
  },
  {
    email: "orientador@test.com",
    password: "Test123456!",
    role: "ORIENTADOR",
    metadata: {
      first_name: "María",
      last_name: "Orientadora",
    },
  },
  {
    email: "profesor@test.com",
    password: "Test123456!",
    role: "PROFESOR",
    metadata: {
      first_name: "Carlos",
      last_name: "Profesor",
    },
  },
  {
    email: "director@test.com",
    password: "Test123456!",
    role: "DIRECTOR_CENTRO",
    metadata: {
      first_name: "Ana",
      last_name: "Directora",
    },
  },
  {
    email: "familia@test.com",
    password: "Test123456!",
    role: "FAMILIA",
    metadata: {
      first_name: "Pedro",
      last_name: "García",
    },
  },
];

async function createTestUsers() {
  console.log("🔧 Creando usuarios de prueba en Supabase...\n");

  const results = [];

  for (const userData of testUsers) {
    try {
      console.log(`📝 Creando: ${userData.email} (${userData.role})`);

      // Crear usuario con Supabase Auth
      const { data: authData, error: authError } =
        await supabase.auth.admin.createUser({
          email: userData.email,
          password: userData.password,
          email_confirm: true,
          user_metadata: {
            role: userData.role,
            ...userData.metadata,
          },
        });

      if (authError) {
        if (authError.message.includes("already registered")) {
          console.log(`   ⚠️  Usuario ya existe, intentando actualizar...`);

          // Buscar usuario existente
          const { data: existingUsers } = await supabase.auth.admin.listUsers();
          const existingUser = existingUsers?.users?.find(
            (u) => u.email === userData.email
          );

          if (existingUser) {
            // Actualizar metadata
            await supabase.auth.admin.updateUserById(existingUser.id, {
              user_metadata: {
                role: userData.role,
                ...userData.metadata,
              },
            });
            console.log(`   ✅ Actualizado: ${userData.email}`);
            results.push({
              email: userData.email,
              status: "updated",
              id: existingUser.id,
            });
          }
        } else {
          throw authError;
        }
      } else {
        console.log(`   ✅ Creado: ${userData.email}`);
        console.log(`   🆔 ID: ${authData.user.id}`);
        results.push({
          email: userData.email,
          status: "created",
          id: authData.user.id,
        });
      }
    } catch (error) {
      console.error(`   ❌ Error con ${userData.email}:`, error.message);
      results.push({
        email: userData.email,
        status: "error",
        error: error.message,
      });
    }
  }

  console.log("\n📊 Resumen:");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  for (const r of results) {
    let icon;
    if (r.status === "created") {
      icon = "✅";
    } else if (r.status === "updated") {
      icon = "🔄";
    } else {
      icon = "❌";
    }
    console.log(`${icon} ${r.email.padEnd(25)} - ${r.status}`);
  }

  console.log("\n📋 Credenciales de acceso:");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("Email               | Contraseña    | Rol");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  for (const u of testUsers) {
    console.log(`${u.email.padEnd(20)}| Test123456!   | ${u.role}`);
  }

  console.log("\n🧪 Siguiente paso:");
  console.log("   node scripts/test-endpoints-roles.js");
}

// Ejecutar
(async () => {
  try {
    await createTestUsers();
    console.log("\n✅ Proceso completado");
    process.exit(0);
  } catch (error) {
    console.error("\n❌ Error fatal:", error);
    process.exit(1);
  }
})();
