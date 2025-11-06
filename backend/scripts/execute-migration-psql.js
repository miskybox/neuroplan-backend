/**
 * Script para ejecutar migración SQL usando psql
 * Requiere: psql instalado y SUPABASE_DB_PASSWORD en .env
 */

const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });

const supabaseUrl = process.env.SUPABASE_URL;
const dbPassword = process.env.SUPABASE_DB_PASSWORD;

if (!supabaseUrl) {
  console.error("❌ Error: SUPABASE_URL no configurado");
  process.exit(1);
}

// Extraer project reference de la URL
const urlMatch = supabaseUrl.match(/https:\/\/([^.]+)\.supabase\.co/);
if (!urlMatch) {
  console.error("❌ Error: URL de Supabase inválida");
  process.exit(1);
}

const projectRef = urlMatch[1];

// Construir conexión directa a Supabase
// Opción 1: Connection pooler (más confiable)
const dbUrlPooler = `postgresql://postgres.${projectRef}:${dbPassword}@aws-0-us-west-1.pooler.supabase.com:6543/postgres`;

// Opción 2: Direct connection
const dbUrlDirect = `postgresql://postgres.${projectRef}:${dbPassword}@db.${projectRef}.supabase.co:5432/postgres`;

async function executeWithPsql(dbUrl, label) {
  const sqlFile = path.join(
    __dirname,
    "../migrations/normalize-schema-with-cleanup.sql"
  );

  if (!fs.existsSync(sqlFile)) {
    console.error(`❌ Archivo SQL no encontrado: ${sqlFile}`);
    return false;
  }

  try {
    console.log(`\n🔄 Intentando con ${label}...`);
    console.log(`   URL: postgresql://postgres.${projectRef}:***@...`);

    // Ejecutar psql con el archivo SQL
    execSync(`psql "${dbUrl}" -f "${sqlFile}"`, {
      stdio: "inherit",
      encoding: "utf8",
      shell: true,
    });

    console.log(`\n✅ Migración ejecutada exitosamente con ${label}\n`);
    return true;
  } catch (error) {
    console.log(`   ⚠️  Error con ${label}: ${error.message}`);
    return false;
  }
}

async function main() {
  console.log("🚀 Ejecutando migración SQL con psql...\n");
  console.log("=".repeat(60));

  if (!dbPassword) {
    console.log("⚠️  SUPABASE_DB_PASSWORD no configurado en .env");
    console.log("\n📋 Para ejecutar con psql, necesitas:");
    console.log("   1. Obtener la contraseña de la base de datos:");
    console.log("      - Ve a Supabase Dashboard → Settings → Database");
    console.log('      - Copia la contraseña de "Connection string"');
    console.log("   2. Agregar a backend/.env:");
    console.log("      SUPABASE_DB_PASSWORD=tu_password_aqui\n");
    console.log("   O ejecuta manualmente desde Supabase Dashboard:\n");
    console.log("   1. Abre: https://app.supabase.com");
    console.log("   2. Ve a: SQL Editor");
    console.log("   3. Abre el archivo:");
    console.log("      backend/migrations/normalize-schema-with-cleanup.sql");
    console.log("   4. Copia y ejecuta el contenido\n");
    return;
  }

  // Intentar con pooler primero (más confiable)
  const success =
    (await executeWithPsql(dbUrlPooler, "Connection Pooler")) ||
    (await executeWithPsql(dbUrlDirect, "Direct Connection"));

  if (!success) {
    console.log("\n📋 INSTRUCCIONES MANUALES:\n");
    console.log("   1. Abre Supabase Dashboard: https://app.supabase.com");
    console.log("   2. Ve a SQL Editor");
    console.log("   3. Abre el archivo:");
    console.log("      backend/migrations/normalize-schema-with-cleanup.sql");
    console.log("   4. Copia TODO el contenido");
    console.log("   5. Pégalo en el SQL Editor");
    console.log('   6. Haz clic en "Run" o presiona Ctrl+Enter\n');
    console.log("   ✅ Los usuarios de prueba ya fueron eliminados");
    console.log("   ✅ El script SQL está listo para ejecutar\n");
  }

  console.log("=".repeat(60));
}

main().catch((error) => {
  console.error("❌ Error:", error);
  process.exit(1);
});
