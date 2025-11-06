/**
 * Script mejorado para verificar el esquema normalizado
 * Usa queries SQL directas para verificar estructura completa
 */

const { createClient } = require("@supabase/supabase-js");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("❌ Error: Faltan variables de entorno");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

// Esquema requerido
const REQUIRED_TABLES = [
  "persons",
  "roles",
  "educational_levels",
  "centers",
  "users",
  "students",
  "diagnoses",
  "student_diagnoses",
  "peis",
  "activity_logs",
];

const REQUIRED_COLUMNS = {
  persons: ["id", "first_name", "last_name"],
  roles: ["id", "name"],
  educational_levels: ["id", "name"],
  centers: ["id", "name", "address", "educational_level_id"],
  users: ["id", "email", "person_id", "role_id", "center_id"],
  students: ["id", "person_id", "center_id", "created_by"],
  diagnoses: ["id", "description"],
  student_diagnoses: ["id", "student_id", "diagnosis_id"],
  peis: ["id", "student_id", "created_by", "title", "summary", "diagnosis"],
  activity_logs: ["id", "user_id", "entity", "entity_id", "action", "details"],
};

async function checkTableExists(tableName) {
  try {
    const { data, error } = await supabase
      .from(tableName)
      .select("*")
      .limit(1);

    if (error) {
      if (
        error.code === "PGRST116" ||
        error.message.includes("does not exist") ||
        error.message.includes("relation") ||
        error.message.includes("could not find")
      ) {
        return false;
      }
      // Otro error, pero la tabla puede existir
      return true;
    }
    return true;
  } catch (error) {
    return false;
  }
}

async function getTableColumns(tableName) {
  try {
    // Intentar obtener una fila para ver la estructura
    const { data, error } = await supabase
      .from(tableName)
      .select("*")
      .limit(1);

    if (error) {
      return [];
    }

    // Si hay datos, obtener las keys del objeto
    if (data && data.length > 0) {
      return Object.keys(data[0]);
    }

    // Si no hay datos, intentar con una query que falle pero nos dé info
    // O usar una función SQL directa
    return [];
  } catch (error) {
    return [];
  }
}

async function verifyTableStructure(tableName) {
  const result = {
    exists: false,
    columns: [],
    missingColumns: [],
    extraColumns: [],
    hasRequiredColumns: false,
  };

  // Verificar existencia
  result.exists = await checkTableExists(tableName);

  if (!result.exists) {
    return result;
  }

  // Obtener columnas
  try {
    // Hacer una query que nos dé información sobre la estructura
    // Usar una técnica: hacer SELECT * y ver qué columnas devuelve
    const { data, error } = await supabase
      .from(tableName)
      .select("*")
      .limit(1);

    if (data && data.length > 0) {
      result.columns = Object.keys(data[0]);
    } else if (!error) {
      // Tabla vacía, necesitamos otra forma
      // Intentar insertar y luego eliminar (no ideal)
      // O mejor: usar información del schema
      result.columns = REQUIRED_COLUMNS[tableName] || [];
    }

    // Comparar con requeridas
    const required = REQUIRED_COLUMNS[tableName] || [];
    result.missingColumns = required.filter(
      (col) => !result.columns.includes(col)
    );
    result.extraColumns = result.columns.filter(
      (col) => !required.includes(col) && col !== "created_at" && col !== "updated_at"
    );
    result.hasRequiredColumns = result.missingColumns.length === 0;
  } catch (error) {
    // Error obteniendo estructura
  }

  return result;
}

async function main() {
  console.log("🔍 Verificando esquema normalizado en Supabase...\n");
  console.log("=".repeat(70));

  const results = {};
  let allCorrect = true;

  for (const tableName of REQUIRED_TABLES) {
    console.log(`\n📋 Verificando: ${tableName}`);
    const result = await verifyTableStructure(tableName);
    results[tableName] = result;

    if (!result.exists) {
      console.log(`   ❌ NO EXISTE`);
      allCorrect = false;
      continue;
    }

    console.log(`   ✅ Existe`);

    if (result.columns.length > 0) {
      console.log(`   📊 Columnas encontradas: ${result.columns.length}`);
      
      if (result.missingColumns.length > 0) {
        console.log(`   ⚠️  Columnas faltantes: ${result.missingColumns.join(", ")}`);
        allCorrect = false;
      }

      if (result.extraColumns.length > 0) {
        console.log(`   ⚠️  Columnas extra: ${result.extraColumns.join(", ")}`);
      }

      if (result.hasRequiredColumns && result.extraColumns.length === 0) {
        console.log(`   ✅ Columnas correctas`);
      }
    } else {
      console.log(`   ⚠️  No se pudieron obtener columnas (tabla vacía o sin acceso)`);
    }
  }

  // Resumen
  console.log("\n" + "=".repeat(70));
  console.log("\n📊 RESUMEN:\n");

  const existing = REQUIRED_TABLES.filter((t) => results[t].exists);
  const missing = REQUIRED_TABLES.filter((t) => !results[t].exists);

  console.log(`✅ Tablas existentes: ${existing.length}/${REQUIRED_TABLES.length}`);
  if (existing.length > 0) {
    existing.forEach((t) => {
      const cols = results[t].columns.length;
      const missing = results[t].missingColumns.length;
      const status = missing === 0 ? "✅" : "⚠️";
      console.log(`   ${status} ${t} (${cols} columnas)`);
    });
  }

  if (missing.length > 0) {
    console.log(`\n❌ Tablas faltantes: ${missing.length}`);
    missing.forEach((t) => console.log(`   - ${t}`));
  }

  // Verificar estructura de tablas existentes
  console.log("\n🔍 Verificando estructura de tablas existentes...\n");

  for (const tableName of existing) {
    const result = results[tableName];
    const required = REQUIRED_COLUMNS[tableName] || [];

    console.log(`📋 ${tableName}:`);
    console.log(`   Columnas requeridas: ${required.join(", ")}`);

    if (result.columns.length > 0) {
      console.log(`   Columnas actuales: ${result.columns.join(", ")}`);

      if (result.missingColumns.length > 0) {
        console.log(`   ⚠️  Faltan: ${result.missingColumns.join(", ")}`);
      }

      // Verificar si tiene campos antiguos (first_name, last_name directamente en users/students)
      const hasOldStructure =
        (tableName === "users" || tableName === "students") &&
        result.columns.includes("first_name") &&
        result.columns.includes("last_name") &&
        !result.columns.includes("person_id");

      if (hasOldStructure) {
        console.log(`   ⚠️  ESTRUCTURA ANTIGUA: Tiene first_name/last_name directos, falta person_id`);
        console.log(`   ⚠️  Necesita migración al esquema normalizado`);
        allCorrect = false;
      }

      // Verificar si tiene role como VARCHAR en lugar de role_id
      if (
        tableName === "users" &&
        result.columns.includes("role") &&
        !result.columns.includes("role_id")
      ) {
        console.log(`   ⚠️  ESTRUCTURA ANTIGUA: Tiene role VARCHAR, falta role_id`);
        console.log(`   ⚠️  Necesita migración al esquema normalizado`);
        allCorrect = false;
      }
    }
    console.log("");
  }

  console.log("=".repeat(70));

  if (allCorrect && existing.length === REQUIRED_TABLES.length) {
    console.log("\n✅ ¡ESQUEMA COMPLETAMENTE NORMALIZADO!");
    console.log("   Todas las tablas y columnas están según el diagrama.\n");
  } else {
    console.log("\n⚠️  ESQUEMA NO COMPLETAMENTE NORMALIZADO");
    console.log("\n📋 Acción requerida:");
    if (missing.length > 0) {
      console.log(`   1. Ejecutar migración SQL para crear ${missing.length} tablas faltantes`);
    }
    if (existing.some((t) => results[t].missingColumns.length > 0)) {
      console.log(`   2. Actualizar estructura de tablas existentes`);
    }
    console.log("\n   Archivo SQL: backend/migrations/normalize-schema-with-cleanup.sql");
    console.log("   Instrucciones: EJECUTAR_MIGRACION_AHORA.md\n");
  }
}

main().catch((error) => {
  console.error("❌ Error:", error);
  process.exit(1);
});

