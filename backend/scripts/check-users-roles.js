/**
 * Script para verificar los roles de los usuarios de test
 */

const { createClient } = require("@supabase/supabase-js");
const path = require("node:path");
require("dotenv").config({ path: path.join(__dirname, "..", ".env") });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // Correcto: SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error(
    "❌ Faltan variables de entorno SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY"
  );
  console.error(`SUPABASE_URL: ${supabaseUrl ? "✅" : "❌"}`);
  console.error(
    `SUPABASE_SERVICE_ROLE_KEY: ${supabaseServiceKey ? "✅" : "❌"}`
  );
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function checkUsersRoles() {
  console.log("🔍 Verificando roles de usuarios de test\n");

  const testEmails = [
    "admin@test.com",
    "orientador@test.com",
    "profesor@test.com",
    "director@test.com",
    "familia@test.com",
  ];

  const { data: users, error } = await supabase
    .from("users")
    .select("id, email, role, first_name, last_name")
    .in("email", testEmails)
    .order("email");

  if (error) {
    console.error("❌ Error al consultar usuarios:", error);
    process.exit(1);
  }

  if (!users || users.length === 0) {
    console.log("⚠️  No se encontraron usuarios de test");
    process.exit(0);
  }

  console.log(`✅ Encontrados ${users.length} usuarios de test:\n`);

  for (const user of users) {
    console.log(`📧 ${user.email}`);
    console.log(`   ID: ${user.id}`);
    console.log(`   Rol: ${user.role || "❌ NULL"}`);
    console.log(`   Nombre: ${user.first_name} ${user.last_name}`);
    console.log("");
  }

  // Detectar problemas
  const usersWithoutRole = users.filter((u) => !u.role);
  if (usersWithoutRole.length > 0) {
    console.log("⚠️  PROBLEMA DETECTADO:");
    console.log(`   ${usersWithoutRole.length} usuarios sin rol asignado`);
    console.log(
      "   Ejecutar: node scripts/create-test-users-complete.js para corregir"
    );
  } else {
    console.log("✅ Todos los usuarios tienen rol asignado");
  }
}

(async () => {
  try {
    await checkUsersRoles();
  } catch (error) {
    console.error("❌ Error fatal:", error);
    process.exit(1);
  }
})();
