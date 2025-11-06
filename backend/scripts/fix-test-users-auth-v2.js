/**
 * Script para arreglar usuarios de test en Supabase
 *
 * PROBLEMA IDENTIFICADO:
 * - Los usuarios existen en la tabla "users" de PostgreSQL
 * - Pero NO existen en Supabase Auth (auth.users)
 * - El campo "password" está NULL en la tabla users
 * - Los tests intentan hacer login pero Auth no encuentra el usuario
 *
 * SOLUCIÓN:
 * 1. Crear usuarios en Supabase Auth con signUp
 * 2. Actualizar el UUID en la tabla users para que coincida
 * 3. Confirmar email automáticamente
 */

require("dotenv").config();
const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error(
    "❌ Error: SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY deben estar en .env"
  );
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

// Usuarios de test necesarios para E2E
const TEST_USERS = [
  {
    email: "admin@neuroplan.com",
    password: "NeuroPlan2024!",
    userData: {
      role: "ADMIN",
      firstName: "Admin",
      lastName: "NeuroPlan",
      centerId: "d863f99c-5a75-4e4d-8cb9-8f12c64eacac",
    },
  },
  {
    email: "e2e-test@neuroplan.com",
    password: "E2eTest2024!",
    userData: {
      role: "ORIENTADOR",
      firstName: "E2E",
      lastName: "Test User",
      centerId: "d863f99c-5a75-4e4d-8cb9-8f12c64eacac",
    },
  },
];

/**
 * Verifica si el usuario existe en Auth
 */
async function checkAuthUser(email) {
  try {
    const { data, error } = await supabase.auth.admin.listUsers();
    if (error) throw error;

    const user = data.users.find((u) => u.email === email);
    return user || null;
  } catch (error) {
    console.error(`❌ Error checking auth user ${email}:`, error.message);
    return null;
  }
}

/**
 * Verifica si el usuario existe en la tabla users
 */
async function checkDbUser(email) {
  try {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .single();

    if (error && error.code !== "PGRST116") {
      // PGRST116 = no rows returned
      throw error;
    }

    return data || null;
  } catch (error) {
    console.error(`❌ Error checking DB user ${email}:`, error.message);
    return null;
  }
}

/**
 * Crea o actualiza usuario en Supabase Auth
 */
async function createOrUpdateAuthUser(email, password) {
  try {
    // Intentar crear usuario
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Confirmar email automáticamente
      user_metadata: {
        created_by: "fix-test-users-auth.js",
        created_at: new Date().toISOString(),
      },
    });

    if (error) {
      // Si ya existe, intentar actualizar
      if (
        error.message.includes("already registered") ||
        error.status === 422
      ) {
        console.log(
          `⚠️  Usuario ${email} ya existe en Auth, actualizando password...`
        );

        // Obtener usuario existente
        const authUser = await checkAuthUser(email);
        if (!authUser) {
          throw new Error(
            "Usuario no encontrado en Auth después de error de duplicado"
          );
        }

        // Actualizar password
        const { error: updateError } = await supabase.auth.admin.updateUserById(
          authUser.id,
          { password }
        );

        if (updateError) throw updateError;

        console.log(`✅ Password actualizado para ${email}`);
        return { authId: authUser.id, created: false };
      }
      throw error;
    }

    console.log(`✅ Usuario ${email} creado en Auth con ID: ${data.user.id}`);
    return { authId: data.user.id, created: true };
  } catch (error) {
    console.error(
      `❌ Error creando/actualizando usuario ${email}:`,
      error.message
    );
    throw error;
  }
}

/**
 * Crea o actualiza usuario en la tabla users
 */
async function createOrUpdateDbUser(authId, email, userData) {
  try {
    const dbUser = await checkDbUser(email);

    if (dbUser) {
      // Actualizar ID para que coincida con Auth
      if (dbUser.id !== authId) {
        console.log(
          `⚠️  Usuario ${email} tiene ID diferente en DB, actualizando...`
        );

        const { error } = await supabase
          .from("users")
          .update({ id: authId })
          .eq("email", email);

        if (error) throw error;
      }

      console.log(`✅ Usuario ${email} sincronizado en DB`);
      return { existed: true };
    }

    // Crear nuevo registro
    const { error } = await supabase.from("users").insert({
      id: authId,
      email,
      role: userData.role,
      first_name: userData.firstName,
      last_name: userData.lastName,
      center_id: userData.centerId,
      active: true,
    });

    if (error) throw error;

    console.log(`✅ Usuario ${email} creado en DB con ID: ${authId}`);
    return { existed: false };
  } catch (error) {
    console.error(
      `❌ Error creando/actualizando usuario en DB ${email}:`,
      error.message
    );
    throw error;
  }
}

/**
 * Proceso principal
 */
async function main() {
  console.log("🔧 Iniciando corrección de usuarios de test...\n");

  for (const user of TEST_USERS) {
    console.log(`\n📧 Procesando: ${user.email}`);
    console.log("═".repeat(60));

    try {
      // 1. Verificar estado actual
      const authUser = await checkAuthUser(user.email);
      const dbUser = await checkDbUser(user.email);

      console.log(`Auth: ${authUser ? "✅ Existe" : "❌ No existe"}`);
      console.log(`DB:   ${dbUser ? "✅ Existe" : "❌ No existe"}`);

      // 2. Crear/actualizar en Auth
      const { authId } = await createOrUpdateAuthUser(
        user.email,
        user.password
      );

      // 3. Crear/actualizar en DB
      await createOrUpdateDbUser(authId, user.email, user.userData);

      console.log(`\n✅ Usuario ${user.email} listo para tests`);
    } catch (error) {
      console.error(`\n❌ Error procesando ${user.email}:`, error.message);
    }
  }

  console.log("\n" + "═".repeat(60));
  console.log("✅ Proceso completado");
  console.log("\n📝 Próximos pasos:");
  console.log("   1. cd ../frontend");
  console.log("   2. npm run test:e2e:api");
  console.log("   3. Verificar que los tests de autenticación pasen\n");
}

// Ejecutar con top-level await
try {
  await main();
  process.exit(0);
} catch (error) {
  console.error("\n❌ Error fatal:", error);
  process.exit(1);
}
