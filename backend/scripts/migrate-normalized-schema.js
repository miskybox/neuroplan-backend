/**
 * Script para ejecutar migración al esquema normalizado desde terminal
 * y limpiar usuarios de prueba (mantener solo admin@neuroplan.com)
 *
 * Uso: node backend/scripts/migrate-normalized-schema.js
 */

const { createClient } = require("@supabase/supabase-js");
const fs = require("fs");
const path = require("path");

// Cargar variables de entorno
require("dotenv").config({ path: path.join(__dirname, "../.env") });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error(
    "❌ Error: Faltan variables de entorno SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY"
  );
  console.error(
    "   Asegúrate de tener un archivo .env en backend/ con estas variables"
  );
  process.exit(1);
}

// Crear cliente de Supabase
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

async function executeSQL(sql) {
  // Supabase no tiene un método directo para ejecutar SQL arbitrario
  // Necesitamos usar el REST API directamente
  const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec_sql`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: supabaseServiceKey,
      Authorization: `Bearer ${supabaseServiceKey}`,
    },
    body: JSON.stringify({ sql }),
  });

  if (!response.ok) {
    throw new Error(`Error ejecutando SQL: ${response.statusText}`);
  }

  return response.json();
}

async function runMigration() {
  console.log("🚀 Iniciando migración al esquema normalizado...\n");

  try {
    // Leer el script de migración
    const migrationPath = path.join(
      __dirname,
      "../migrations/normalize-schema.sql"
    );
    const migrationSQL = fs.readFileSync(migrationPath, "utf8");

    console.log("📄 Leyendo script de migración...");
    console.log(`   Archivo: ${migrationPath}\n`);

    // Dividir el script en comandos individuales
    // Nota: Supabase no permite ejecutar múltiples comandos a la vez directamente
    // Necesitamos usar el SQL Editor API o ejecutar comandos uno por uno

    console.log("⚠️  Nota: Supabase requiere ejecutar SQL desde el Dashboard");
    console.log("   Creando script SQL completo con limpieza de usuarios...\n");

    // Leer script de migración y agregar limpieza de usuarios
    const cleanupSQL = `
-- ===========================================
-- LIMPIEZA DE USUARIOS DE PRUEBA
-- ===========================================
-- Eliminar todos los usuarios excepto admin@neuroplan.com

-- Primero, eliminar usuarios de la tabla users (excepto admin)
DELETE FROM public.users 
WHERE email != 'admin@neuroplan.com' 
AND email NOT LIKE 'admin@%';

-- También eliminar de Supabase Auth (si es necesario)
-- Nota: Esto requiere usar la API de Auth de Supabase

-- Verificar usuarios restantes
SELECT id, email, role 
FROM public.users 
ORDER BY email;
`;

    // Crear script combinado
    const fullScript = migrationSQL + "\n\n" + cleanupSQL;

    // Guardar script completo
    const outputPath = path.join(
      __dirname,
      "../migrations/normalize-schema-with-cleanup.sql"
    );
    fs.writeFileSync(outputPath, fullScript, "utf8");

    console.log("✅ Script completo creado:");
    console.log(`   ${outputPath}\n`);

    console.log("📋 PRÓXIMOS PASOS:");
    console.log("   1. Abre Supabase Dashboard: https://app.supabase.com");
    console.log("   2. Ve a SQL Editor");
    console.log("   3. Copia y pega el contenido del archivo:");
    console.log(`      ${outputPath}`);
    console.log("   4. Ejecuta el script (Ctrl+Enter)\n");

    // Intentar limpiar usuarios directamente usando la API
    console.log("🧹 Limpiando usuarios de prueba...");
    await cleanupTestUsers();

    console.log(
      "\n✅ Migración preparada. Sigue los pasos arriba para ejecutarla en Supabase."
    );
  } catch (error) {
    console.error("❌ Error durante la migración:", error);
    process.exit(1);
  }
}

async function cleanupTestUsers() {
  try {
    // Obtener todos los usuarios
    const { data: users, error: fetchError } = await supabase
      .from("users")
      .select("id, email, role");

    if (fetchError) {
      console.error("   ⚠️  Error obteniendo usuarios:", fetchError.message);
      return;
    }

    if (!users || users.length === 0) {
      console.log("   ℹ️  No hay usuarios en la tabla users");
      return;
    }

    console.log(`   📊 Usuarios encontrados: ${users.length}`);

    // Filtrar usuarios a eliminar (mantener solo admin@neuroplan.com)
    const usersToDelete = users.filter(
      (u) => u.email !== "admin@neuroplan.com" && !u.email.startsWith("admin@")
    );

    if (usersToDelete.length === 0) {
      console.log("   ✅ No hay usuarios de prueba para eliminar");
      return;
    }

    console.log(
      `   🗑️  Eliminando ${usersToDelete.length} usuarios de prueba...`
    );

    // Eliminar usuarios uno por uno
    for (const user of usersToDelete) {
      // Primero eliminar de Supabase Auth (si existe)
      try {
        const { error: authError } = await supabase.auth.admin.deleteUser(
          user.id
        );
        if (authError && !authError.message.includes("User not found")) {
          console.log(
            `   ⚠️  No se pudo eliminar de Auth: ${user.email} - ${authError.message}`
          );
        }
      } catch (err) {
        // Ignorar errores de Auth si el usuario no existe
      }

      // Eliminar de la tabla users
      const { error: deleteError } = await supabase
        .from("users")
        .delete()
        .eq("id", user.id);

      if (deleteError) {
        console.log(
          `   ❌ Error eliminando ${user.email}: ${deleteError.message}`
        );
      } else {
        console.log(`   ✅ Eliminado: ${user.email}`);
      }
    }

    // Verificar usuarios restantes
    const { data: remainingUsers } = await supabase
      .from("users")
      .select("id, email, role");

    console.log(`\n   📋 Usuarios restantes: ${remainingUsers?.length || 0}`);
    if (remainingUsers && remainingUsers.length > 0) {
      remainingUsers.forEach((u) => {
        console.log(`      - ${u.email} (${u.role || "sin rol"})`);
      });
    }
  } catch (error) {
    console.error("   ❌ Error limpiando usuarios:", error.message);
  }
}

// Ejecutar migración
runMigration().catch((error) => {
  console.error("❌ Error fatal:", error);
  process.exit(1);
});
