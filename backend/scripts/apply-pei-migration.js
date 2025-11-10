const { createClient } = require("@supabase/supabase-js");
const fs = require("node:fs");
require("dotenv").config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function applyMigration() {
  console.log("📝 Aplicando migración add-pei-status-columns...\n");

  try {
    // Leer SQL de migración
    const sql = fs.readFileSync(
      "./migrations/add-pei-status-columns.sql",
      "utf8"
    );

    // Extraer comandos individuales (ignorando BEGIN/COMMIT para Supabase)
    const commands = [
      // Columna status
      `ALTER TABLE peis ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'DRAFT' CHECK (status IN ('DRAFT', 'REVIEW', 'APPROVED', 'ACTIVE', 'ARCHIVED'))`,

      // Columna approved_at
      `ALTER TABLE peis ADD COLUMN IF NOT EXISTS approved_at TIMESTAMPTZ`,

      // Columna approved_by
      `ALTER TABLE peis ADD COLUMN IF NOT EXISTS approved_by UUID REFERENCES users(id)`,

      // Índice status
      `CREATE INDEX IF NOT EXISTS idx_peis_status ON peis(status)`,

      // Índice approved_by
      `CREATE INDEX IF NOT EXISTS idx_peis_approved_by ON peis(approved_by)`,
    ];

    // Ejecutar cada comando
    for (const [index, command] of commands.entries()) {
      console.log(`Ejecutando comando ${index + 1}/${commands.length}...`);

      const { error } = await supabase.rpc("exec_sql", { sql_query: command });

      if (error && !error.message.includes("already exists")) {
        console.error(`❌ Error en comando ${index + 1}:`, error.message);

        // Intentar método alternativo usando una consulta simple
        console.log("   Intentando método directo...");
        try {
          await executeDirectSQL(command);
          console.log("   ✅ Ejecutado con método directo");
        } catch (directError) {
          console.error(
            "   ❌ También falló método directo:",
            directError.message
          );
        }
      } else {
        console.log(`   ✅ Comando ${index + 1} aplicado`);
      }
    }

    console.log("\n🔍 Verificando columnas...\n");

    // Verificar que las columnas existan
    const { data, error: selectError } = await supabase
      .from("peis")
      .select("id, status, approved_at, approved_by")
      .limit(1);

    if (selectError) {
      console.log(
        "⚠️  No se pudo verificar (puede ser que la tabla esté vacía)"
      );
      console.log("   Mensaje:", selectError.message);

      if (
        selectError.message.includes("column") &&
        selectError.message.includes("does not exist")
      ) {
        console.log("\n❌ Las columnas AÚN NO EXISTEN en la base de datos.");
        console.log(
          "📋 Debes ejecutar la migración manualmente desde Supabase Dashboard:"
        );
        console.log(
          "\n1. Ve a https://supabase.com/dashboard/project/qlpzzljqbwcnpayjhugz"
        );
        console.log("2. SQL Editor → New Query");
        console.log("3. Pega este SQL:\n");
        console.log(
          "ALTER TABLE peis ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'DRAFT';"
        );
        console.log(
          "ALTER TABLE peis ADD COLUMN IF NOT EXISTS approved_at TIMESTAMPTZ;"
        );
        console.log(
          "ALTER TABLE peis ADD COLUMN IF NOT EXISTS approved_by UUID REFERENCES users(id);"
        );
        console.log("\n4. Ejecuta (Run)");
      }
    } else {
      console.log("✅ MIGRACIÓN EXITOSA - Columnas verificadas:");
      console.log("   - status");
      console.log("   - approved_at");
      console.log("   - approved_by");
    }
  } catch (err) {
    console.error("\n❌ Error general:", err.message);
    console.log("\n📋 INSTRUCCIONES MANUALES:");
    console.log("Ve a Supabase Dashboard y ejecuta:");
    console.log(
      "\nALTER TABLE peis ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'DRAFT';"
    );
    console.log(
      "ALTER TABLE peis ADD COLUMN IF NOT EXISTS approved_at TIMESTAMPTZ;"
    );
    console.log("ALTER TABLE peis ADD COLUMN IF NOT EXISTS approved_by UUID;");
  }
}

// Método alternativo (no funcionará sin extensión pg_plan adecuada)
async function executeDirectSQL(sql) {
  // Placeholder - Supabase cliente no soporta DDL directo
  throw new Error("DDL no soportado por cliente Supabase");
}

applyMigration();
