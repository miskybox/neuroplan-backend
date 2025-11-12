/**
 * Script para crear usuarios de prueba EN AUTH + TABLA USERS
 *
 * Uso:
 *   node scripts/create-test-users-complete.js
 *
 * Crea 5 usuarios en:
 *   1. Supabase Auth (auth.users)
 *   2. Tabla public.users (con rol)
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
    first_name: "Admin",
    last_name: "Sistema",
  },
  {
    email: "orientador@test.com",
    password: "Test123456!",
    role: "ORIENTADOR",
    first_name: "María",
    last_name: "Orientadora",
  },
  {
    email: "profesor@test.com",
    password: "Test123456!",
    role: "PROFESOR",
    first_name: "Carlos",
    last_name: "Profesor",
  },
  {
    email: "director@test.com",
    password: "Test123456!",
    role: "DIRECTOR_CENTRO",
    first_name: "Ana",
    last_name: "Directora",
  },
  {
    email: "familia@test.com",
    password: "Test123456!",
    role: "FAMILIA",
    first_name: "Pedro",
    last_name: "García",
  },
];

function isUserAlreadyRegisteredError(err) {
  if (!err || !err.message) return false;
  const msg = err.message;
  return (
    msg.includes("already registered") ||
    msg.includes("already been registered") ||
    msg.includes("User already registered")
  );
}

async function createOrGetAuthUser(userData) {
  const { data: authData, error: authError } =
    await supabase.auth.admin.createUser({
      email: userData.email,
      password: userData.password,
      email_confirm: true,
      user_metadata: {
        role: userData.role,
        first_name: userData.first_name,
        last_name: userData.last_name,
      },
    });

  if (authError) {
    if (isUserAlreadyRegisteredError(authError)) {
      console.log(`   ⚠️  Auth: ya existe, obteniendo ID...`);
      const { data: existingUsers } = await supabase.auth.admin.listUsers();
      const existingUser = existingUsers?.users?.find(
        (u) => u.email === userData.email
      );
      if (existingUser) {
        console.log(`   ✅ Auth ID: ${existingUser.id}`);
        return existingUser.id;
      }
      throw new Error("Usuario existe pero no se pudo encontrar");
    }
    throw authError;
  }

  console.log(`   ✅ Auth creado: ${authData.user.id}`);
  return authData.user.id;
}

async function upsertDbUser(authUserId, userData) {
  const { data: existingDbUser, error: selectError } = await supabase
    .from("users")
    .select("id, email, role")
    .eq("email", userData.email)
    .maybeSingle();

  if (selectError && selectError.code !== "PGRST116") {
    throw selectError;
  }

  if (existingDbUser) {
    const { error: updateError } = await supabase
      .from("users")
      .update({
        role: userData.role,
        first_name: userData.first_name,
        last_name: userData.last_name,
        updated_at: new Date().toISOString(),
      })
      .eq("email", userData.email);

    if (updateError) {
      throw updateError;
    }

    console.log(`   ✅ BD actualizada (rol: ${userData.role})`);
    return { status: "updated", dbId: existingDbUser.id };
  }

  const { data: newDbUser, error: insertError } = await supabase
    .from("users")
    .insert({
      id: authUserId, // Usar mismo ID que Auth
      email: userData.email,
      role: userData.role,
      first_name: userData.first_name,
      last_name: userData.last_name,
      center_id: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (insertError) {
    throw insertError;
  }

  console.log(`   ✅ BD creada (ID: ${newDbUser.id})`);
  return { status: "created", dbId: newDbUser.id };
}

function printSummaryAndCredentials(results) {
  console.log("📊 Resumen:");
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

  const successCount = results.filter((r) => r.status !== "error").length;
  console.log(
    `\n✅ ${successCount}/${testUsers.length} usuarios configurados correctamente`
  );

  console.log("\n📋 Credenciales de acceso:");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("Email               | Contraseña    | Rol");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  for (const u of testUsers) {
    console.log(`${u.email.padEnd(20)}| Test123456!   | ${u.role}`);
  }
  console.log("\n🧪 Siguiente paso:");
  console.log("   1. Verificar backend corriendo: http://localhost:3001/api");
  console.log("   2. node scripts/test-endpoints-roles.js");
}

async function createTestUsers() {
  console.log("🔧 Creando usuarios completos (Auth + BD)...\n");

  const results = [];

  for (const userData of testUsers) {
    console.log(`📝 Procesando: ${userData.email} (${userData.role})`);
    try {
      const authUserId = await createOrGetAuthUser(userData);
      if (!authUserId) {
        throw new Error("No se pudo obtener Auth ID");
      }

      const dbResult = await upsertDbUser(authUserId, userData);

      results.push({
        email: userData.email,
        status: dbResult.status,
        authId: authUserId,
        dbId: dbResult.dbId,
      });

      console.log("");
    } catch (error) {
      console.error(`   ❌ Error: ${error.message}`);
      results.push({
        email: userData.email,
        status: "error",
        error: error.message,
      });
      console.log("");
    }
  }

  printSummaryAndCredentials(results);
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
