import { createClient } from "@supabase/supabase-js";
import "dotenv/config";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

console.log("🔍 Verificando esquema de tabla peis...\n");

try {
  // Obtener estructura de la tabla mediante una consulta a information_schema
  const { error } = await supabase.rpc("get_peis_columns");

  if (error) {
    console.log("⚠️  RPC no disponible, intentando método alternativo...\n");

    // Método alternativo: hacer un SELECT simple y ver qué columnas retorna
    const { data: sampleData, error: selectError } = await supabase
      .from("peis")
      .select("*")
      .limit(1)
      .single();

    if (selectError && selectError.code !== "PGRST116") {
      // PGRST116 = no rows
      throw selectError;
    }

    if (sampleData) {
      const columns = Object.keys(sampleData);
      console.log("✅ Columnas encontradas en tabla peis:");
      for (const col of columns) {
        console.log(`   - ${col}`);
      }

      // Verificar columnas críticas
      const requiredColumns = ["status", "approved_at", "approved_by"];
      const missingColumns = requiredColumns.filter(
        (col) => !columns.includes(col)
      );

      if (missingColumns.length > 0) {
        console.log("\n❌ FALTAN COLUMNAS:");
        for (const col of missingColumns) {
          console.log(`   - ${col}`);
        }
        console.log("\n📝 Ejecuta esta migración:\n");
        console.log("ALTER TABLE peis");
        console.log(
          "  ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'DRAFT'"
        );
        console.log(
          "    CHECK (status IN ('DRAFT', 'REVIEW', 'APPROVED', 'ACTIVE', 'ARCHIVED')),"
        );
        console.log("  ADD COLUMN IF NOT EXISTS approved_at TIMESTAMPTZ,");
        console.log(
          "  ADD COLUMN IF NOT EXISTS approved_by UUID REFERENCES users(id);"
        );
      } else {
        console.log("\n✅ Todas las columnas necesarias están presentes!");
      }
    } else {
      console.log(
        "⚠️  Tabla vacía, no se pueden verificar columnas sin datos."
      );
      console.log(
        "💡 Crea un PEI de prueba primero o ejecuta la migración preventivamente."
      );
    }
  }
} catch (err) {
  console.error("❌ Error:", err.message);
  process.exit(1);
}
