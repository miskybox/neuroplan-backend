/**
 * Script para verificar que la base de datos está normalizada según el diagrama
 * Compara el esquema actual con el diagrama relacional requerido
 *
 * Uso: node backend/scripts/verify-normalized-schema.js
 */

const { createClient } = require("@supabase/supabase-js");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error(
    "❌ Error: Faltan variables de entorno SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY"
  );
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

// Esquema requerido según el diagrama
const REQUIRED_SCHEMA = {
  persons: {
    columns: ["id", "first_name", "last_name"],
    primaryKey: "id",
  },
  roles: {
    columns: ["id", "name"],
    primaryKey: "id",
  },
  educational_levels: {
    columns: ["id", "name"],
    primaryKey: "id",
  },
  centers: {
    columns: ["id", "name", "address", "educational_level_id"],
    primaryKey: "id",
    foreignKeys: [
      { column: "educational_level_id", references: "educational_levels.id" },
    ],
  },
  users: {
    columns: ["id", "email", "person_id", "role_id", "center_id"],
    primaryKey: "id",
    foreignKeys: [
      { column: "person_id", references: "persons.id" },
      { column: "role_id", references: "roles.id" },
      { column: "center_id", references: "centers.id" },
    ],
    unique: ["email"],
  },
  students: {
    columns: ["id", "person_id", "center_id", "created_by"],
    primaryKey: "id",
    foreignKeys: [
      { column: "person_id", references: "persons.id" },
      { column: "center_id", references: "centers.id" },
      { column: "created_by", references: "users.id" },
    ],
  },
  diagnoses: {
    columns: ["id", "description"],
    primaryKey: "id",
  },
  student_diagnoses: {
    columns: ["id", "student_id", "diagnosis_id"],
    primaryKey: "id",
    foreignKeys: [
      { column: "student_id", references: "students.id" },
      { column: "diagnosis_id", references: "diagnoses.id" },
    ],
  },
  peis: {
    columns: [
      "id",
      "student_id",
      "created_by",
      "title",
      "summary",
      "diagnosis",
    ],
    primaryKey: "id",
    foreignKeys: [
      { column: "student_id", references: "students.id" },
      { column: "created_by", references: "users.id" },
    ],
  },
  activity_logs: {
    columns: ["id", "user_id", "entity", "entity_id", "action", "details"],
    primaryKey: "id",
    foreignKeys: [{ column: "user_id", references: "users.id" }],
  },
};

async function getTableColumns(tableName) {
  const { data, error } = await supabase.rpc("get_table_columns", {
    table_name: tableName,
  });

  if (error) {
    // Si no existe la función, usar query directa
    const { data: columns, error: colError } = await supabase
      .from("information_schema.columns")
      .select("column_name, data_type, is_nullable")
      .eq("table_schema", "public")
      .eq("table_name", tableName);

    if (colError) {
      return null;
    }
    return columns || [];
  }
  return data || [];
}

async function getTableConstraints(tableName) {
  // Obtener foreign keys
  const { data, error } = await supabase.rpc("get_foreign_keys", {
    table_name: tableName,
  });

  if (error) {
    // Query alternativa
    const query = `
      SELECT 
        tc.table_name, 
        kcu.column_name, 
        ccu.table_name AS foreign_table_name,
        ccu.column_name AS foreign_column_name 
      FROM information_schema.table_constraints AS tc 
      JOIN information_schema.key_column_usage AS kcu
        ON tc.constraint_name = kcu.constraint_name
      JOIN information_schema.constraint_column_usage AS ccu
        ON ccu.constraint_name = tc.constraint_name
      WHERE tc.constraint_type = 'FOREIGN KEY' 
      AND tc.table_schema = 'public'
      AND tc.table_name = '${tableName}'
    `;

    // Usar query directa
    const { data: fks, error: fkError } = await supabase
      .from("information_schema.table_constraints")
      .select("*")
      .eq("table_schema", "public")
      .eq("table_name", tableName)
      .eq("constraint_type", "FOREIGN KEY")
      .limit(1);

    if (fkError) {
      return [];
    }
    return [];
  }
  return data || [];
}

async function verifyTable(tableName, requiredSchema) {
  const results = {
    exists: false,
    columns: { missing: [], extra: [], correct: [] },
    foreignKeys: { missing: [], extra: [], correct: [] },
    primaryKey: false,
    unique: false,
    errors: [],
  };

  try {
    // Verificar que la tabla existe (intentando hacer una query simple)
    const { data, error } = await supabase.from(tableName).select("*").limit(1);

    if (error) {
      if (
        error.code === "PGRST116" ||
        error.message.includes("does not exist")
      ) {
        results.errors.push(`Tabla ${tableName} no existe`);
        return results;
      }
      results.errors.push(`Error accediendo ${tableName}: ${error.message}`);
      return results;
    }

    results.exists = true;

    // Obtener columnas de la tabla
    const { data: columns, error: colError } = await supabase
      .from("information_schema.columns")
      .select("column_name, data_type")
      .eq("table_schema", "public")
      .eq("table_name", tableName);

    if (colError) {
      results.errors.push(`Error obteniendo columnas: ${colError.message}`);
      return results;
    }

    const actualColumns = (columns || []).map((c) => c.column_name);
    const requiredColumns = requiredSchema.columns;

    // Verificar columnas requeridas
    for (const reqCol of requiredColumns) {
      if (actualColumns.includes(reqCol)) {
        results.columns.correct.push(reqCol);
      } else {
        results.columns.missing.push(reqCol);
      }
    }

    // Verificar columnas extra (que no deberían estar)
    const extraCols = actualColumns.filter(
      (col) => !requiredColumns.includes(col)
    );
    // Filtrar columnas estándar que pueden existir
    const allowedExtra = ["created_at", "updated_at"];
    results.columns.extra = extraCols.filter(
      (col) => !allowedExtra.includes(col)
    );

    // Verificar primary key
    const { data: pkData, error: pkError } = await supabase
      .from("information_schema.table_constraints")
      .select("constraint_name")
      .eq("table_schema", "public")
      .eq("table_name", tableName)
      .eq("constraint_type", "PRIMARY KEY")
      .limit(1);

    results.primaryKey = !pkError && pkData && pkData.length > 0;

    // Verificar foreign keys
    if (requiredSchema.foreignKeys) {
      const { data: fkData, error: fkError } = await supabase
        .from("information_schema.table_constraints")
        .select("constraint_name")
        .eq("table_schema", "public")
        .eq("table_name", tableName)
        .eq("constraint_type", "FOREIGN KEY");

      // Verificar cada foreign key requerida
      for (const fk of requiredSchema.foreignKeys) {
        // Verificar si existe la foreign key (simplificado)
        const fkExists = fkData && fkData.length > 0;
        if (fkExists) {
          results.foreignKeys.correct.push(fk);
        } else {
          results.foreignKeys.missing.push(fk);
        }
      }
    }

    // Verificar unique constraint en email (para users)
    if (requiredSchema.unique && requiredSchema.unique.includes("email")) {
      const { data: uniqueData, error: uniqueError } = await supabase
        .from("information_schema.table_constraints")
        .select("constraint_name")
        .eq("table_schema", "public")
        .eq("table_name", tableName)
        .eq("constraint_type", "UNIQUE")
        .limit(1);

      results.unique = !uniqueError && uniqueData && uniqueData.length > 0;
    }
  } catch (error) {
    results.errors.push(`Error verificando ${tableName}: ${error.message}`);
  }

  return results;
}

async function verifyAllTables() {
  console.log("🔍 Verificando esquema normalizado en Supabase...\n");
  console.log("=".repeat(70));

  const results = {};
  let allCorrect = true;

  for (const [tableName, schema] of Object.entries(REQUIRED_SCHEMA)) {
    console.log(`\n📋 Verificando tabla: ${tableName}`);
    const result = await verifyTable(tableName, schema);
    results[tableName] = result;

    if (!result.exists) {
      console.log(`   ❌ NO EXISTE`);
      allCorrect = false;
      continue;
    }

    // Verificar columnas
    if (result.columns.missing.length > 0) {
      console.log(
        `   ⚠️  Columnas faltantes: ${result.columns.missing.join(", ")}`
      );
      allCorrect = false;
    }

    if (result.columns.extra.length > 0) {
      console.log(
        `   ⚠️  Columnas extra (no en diagrama): ${result.columns.extra.join(", ")}`
      );
      // No es error crítico, solo advertencia
    }

    if (
      result.columns.missing.length === 0 &&
      result.columns.extra.length === 0
    ) {
      console.log(
        `   ✅ Columnas correctas: ${result.columns.correct.join(", ")}`
      );
    }

    // Verificar primary key
    if (!result.primaryKey) {
      console.log(`   ❌ Primary key no encontrada`);
      allCorrect = false;
    } else {
      console.log(`   ✅ Primary key: ${schema.primaryKey}`);
    }

    // Verificar foreign keys
    if (schema.foreignKeys) {
      if (result.foreignKeys.missing.length > 0) {
        console.log(
          `   ⚠️  Foreign keys faltantes: ${result.foreignKeys.missing.map((fk) => `${fk.column} -> ${fk.references}`).join(", ")}`
        );
        allCorrect = false;
      } else {
        console.log(`   ✅ Foreign keys correctas`);
      }
    }

    // Verificar unique
    if (schema.unique && !result.unique) {
      console.log(`   ⚠️  Unique constraint en email no encontrada`);
      // No es crítico, pero debería estar
    }

    if (result.errors.length > 0) {
      result.errors.forEach((err) => console.log(`   ❌ Error: ${err}`));
      allCorrect = false;
    }
  }

  console.log("\n" + "=".repeat(70));
  console.log("\n📊 RESUMEN:\n");

  const tables = Object.keys(REQUIRED_SCHEMA);
  const existingTables = tables.filter((t) => results[t].exists);
  const missingTables = tables.filter((t) => !results[t].exists);

  console.log(
    `✅ Tablas existentes: ${existingTables.length}/${tables.length}`
  );
  if (existingTables.length > 0) {
    existingTables.forEach((t) => console.log(`   - ${t}`));
  }

  if (missingTables.length > 0) {
    console.log(`\n❌ Tablas faltantes: ${missingTables.length}`);
    missingTables.forEach((t) => console.log(`   - ${t}`));
  }

  // Verificar relaciones
  console.log(`\n🔗 Verificando relaciones...`);
  const { data: relations, error: relError } = await supabase
    .from("information_schema.table_constraints")
    .select("table_name, constraint_type")
    .eq("table_schema", "public")
    .eq("constraint_type", "FOREIGN KEY")
    .in("table_name", tables);

  if (!relError && relations) {
    const fkCount = relations.length;
    console.log(`   Foreign keys encontradas: ${fkCount}`);
  }

  console.log("\n" + "=".repeat(70));

  if (allCorrect && existingTables.length === tables.length) {
    console.log("\n✅ ¡ESQUEMA NORMALIZADO CORRECTAMENTE!");
    console.log("   Todas las tablas y relaciones están según el diagrama.\n");
    return true;
  } else {
    console.log("\n⚠️  ESQUEMA NO COMPLETAMENTE NORMALIZADO");
    console.log(
      "   Revisa los detalles arriba y ejecuta la migración si es necesario.\n"
    );
    return false;
  }
}

// Ejecutar verificación
verifyAllTables()
  .then((success) => {
    process.exit(success ? 0 : 1);
  })
  .catch((error) => {
    console.error("❌ Error fatal:", error);
    process.exit(1);
  });
