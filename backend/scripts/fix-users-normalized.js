/**
 * Script para corregir usuarios de prueba con el esquema normalizado
 *
 * Este script:
 * 1. Verifica que los usuarios existen en Auth
 * 2. Crea/obtiene person_id en la tabla persons
 * 3. Obtiene role_id de la tabla roles
 * 4. Actualiza la tabla users con person_id y role_id correctos
 */

require("dotenv").config();
const { createClient } = require("@supabase/supabase-js");

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
  {
    email: "e2e-test@neuroplan.com",
    password: "E2eTest2024!",
    role: "ORIENTADOR",
    first_name: "E2E",
    last_name: "Test User",
  },
];

async function getOrCreatePerson(firstName, lastName) {
  // Primero intentar encontrar la persona existente
  const { data: existing, error: selectErr } = await supabase
    .from("persons")
    .select("id")
    .eq("first_name", firstName)
    .eq("last_name", lastName)
    .maybeSingle();

  if (selectErr && selectErr.code !== "PGRST116") {
    throw selectErr;
  }

  if (existing) {
    return existing.id;
  }

  // Si no existe, crearla
  const { data: newPerson, error: insertErr } = await supabase
    .from("persons")
    .insert({ first_name: firstName, last_name: lastName })
    .select("id")
    .single();

  if (insertErr) {
    throw insertErr;
  }

  return newPerson.id;
}

async function getRoleId(roleName) {
  const { data, error } = await supabase
    .from("roles")
    .select("id")
    .eq("name", roleName)
    .single();

  if (error) {
    throw new Error(
      `Role ${roleName} no encontrado en la tabla roles: ${error.message}`
    );
  }

  return data.id;
}

async function fixUser(userData) {
  console.log(`\n📧 Procesando: ${userData.email}`);
  try {
    // 1. Verificar Auth
    const { data: authList } = await supabase.auth.admin.listUsers();
    const authUser = authList.users.find((u) => u.email === userData.email);
    if (authUser) {
      console.log(`   ✅ Auth OK: ${authUser.id}`);
    } else {
      console.log("   ❌ Usuario no existe en Auth, creando...");
      const { data: newAuth, error: authErr } =
        await supabase.auth.admin.createUser({
          email: userData.email,
          password: userData.password,
          email_confirm: true,
        });
      if (authErr) throw authErr;
      console.log(`   ✅ Creado en Auth: ${newAuth.user.id}`);
    }

    // 2. Obtener/crear person_id
    const personId = await getOrCreatePerson(
      userData.first_name,
      userData.last_name
    );
    console.log(`   ✅ Person ID: ${personId}`);

    // 3. Obtener role_id
    const roleId = await getRoleId(userData.role);
    console.log(`   ✅ Role ID: ${roleId}`);

    // 4. Actualizar usuario en la tabla users
    const authId =
      authUser?.id ||
      (await supabase.auth.admin.listUsers()).data.users.find(
        (u) => u.email === userData.email
      ).id;
    const { error: updateErr } = await supabase
      .from("users")
      .update({
        person_id: personId,
        role_id: roleId,
        updated_at: new Date().toISOString(),
      })
      .eq("email", userData.email);

    if (updateErr) {
      throw updateErr;
    }

    console.log(`   ✅ Usuario actualizado en DB`);
  } catch (error) {
    console.error(`   ❌ Error: ${error.message}`);
  }
}

async function main() {
  console.log("🔧 Corrigiendo usuarios con esquema normalizado...\n");

  for (const user of testUsers) {
    await fixUser(user);
  }

  console.log("\n✅ Proceso completado\n");
  console.log(
    "📝 Verificación: ejecutar test de login para confirmar que los roles funcionan"
  );
  process.exit(0);
}

main().catch((error) => {
  console.error("\n❌ Error fatal:", error);
  process.exit(1);
});
