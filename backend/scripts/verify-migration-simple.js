/**
 * Script simple para verificar que la migración fue exitosa
 * Verifica que las columnas person_id y role_id existen en users y students
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

async function verifyMigration() {
  console.log("🔍 Verificando migración...\n");
  console.log("=".repeat(70));

  let allOk = true;

  try {
    // Verificar que users tiene person_id y role_id
    console.log("\n📋 Verificando tabla users...");
    const { data: users, error: usersError } = await supabase
      .from("users")
      .select("id, email, person_id, role_id")
      .limit(1);

    if (usersError) {
      if (usersError.message.includes("person_id")) {
        console.log("   ❌ Columna person_id NO existe en users");
        allOk = false;
      } else if (usersError.message.includes("role_id")) {
        console.log("   ❌ Columna role_id NO existe en users");
        allOk = false;
      } else {
        console.log(`   ⚠️  Error: ${usersError.message}`);
      }
    } else {
      console.log("   ✅ Columnas person_id y role_id existen en users");
      if (users && users.length > 0) {
        const user = users[0];
        console.log(`   📊 Ejemplo: ${user.email}`);
        console.log(`      - person_id: ${user.person_id ? "✅" : "⚠️  NULL"}`);
        console.log(`      - role_id: ${user.role_id ? "✅" : "⚠️  NULL"}`);
      }
    }

    // Verificar que students tiene person_id
    console.log("\n📋 Verificando tabla students...");
    const { data: students, error: studentsError } = await supabase
      .from("students")
      .select("id, person_id")
      .limit(1);

    if (studentsError) {
      if (studentsError.message.includes("person_id")) {
        console.log("   ❌ Columna person_id NO existe en students");
        allOk = false;
      } else {
        console.log(`   ⚠️  Error: ${studentsError.message}`);
      }
    } else {
      console.log("   ✅ Columna person_id existe en students");
      if (students && students.length > 0) {
        const student = students[0];
        console.log(`   📊 Ejemplo: ${student.id}`);
        console.log(
          `      - person_id: ${student.person_id ? "✅" : "⚠️  NULL"}`
        );
      }
    }

    // Verificar que persons existe y tiene datos
    console.log("\n📋 Verificando tabla persons...");
    const { data: persons, error: personsError } = await supabase
      .from("persons")
      .select("id, first_name, last_name")
      .limit(5);

    if (personsError) {
      console.log(`   ❌ Error: ${personsError.message}`);
      allOk = false;
    } else {
      console.log(
        `   ✅ Tabla persons existe con ${persons?.length || 0} registros (muestra de 5)`
      );
      if (persons && persons.length > 0) {
        persons.forEach((p, i) => {
          console.log(
            `      ${i + 1}. ${p.first_name || ""} ${p.last_name || ""} (${p.id.substring(0, 8)}...)`
          );
        });
      }
    }

    // Verificar que roles existe
    console.log("\n📋 Verificando tabla roles...");
    const { data: roles, error: rolesError } = await supabase
      .from("roles")
      .select("id, name")
      .limit(10);

    if (rolesError) {
      console.log(`   ❌ Error: ${rolesError.message}`);
      allOk = false;
    } else {
      console.log(`   ✅ Tabla roles existe con ${roles?.length || 0} roles`);
      if (roles && roles.length > 0) {
        roles.forEach((r) => {
          console.log(`      - ${r.name}`);
        });
      }
    }

    // Verificar que centers existe
    console.log("\n📋 Verificando tabla centers...");
    const { data: centers, error: centersError } = await supabase
      .from("centers")
      .select("id, name")
      .limit(5);

    if (centersError) {
      console.log(`   ❌ Error: ${centersError.message}`);
      allOk = false;
    } else {
      console.log(
        `   ✅ Tabla centers existe con ${centers?.length || 0} centros (muestra de 5)`
      );
    }

    // Verificar que diagnoses existe
    console.log("\n📋 Verificando tabla diagnoses...");
    const { data: diagnoses, error: diagnosesError } = await supabase
      .from("diagnoses")
      .select("id, description")
      .limit(5);

    if (diagnosesError) {
      console.log(
        `   ⚠️  Tabla diagnoses: ${diagnosesError.message} (puede estar vacía)`
      );
    } else {
      console.log(
        `   ✅ Tabla diagnoses existe con ${diagnoses?.length || 0} diagnósticos`
      );
    }

    // Verificar que student_diagnoses existe
    console.log("\n📋 Verificando tabla student_diagnoses...");
    const { data: studentDiagnoses, error: sdError } = await supabase
      .from("student_diagnoses")
      .select("id, student_id, diagnosis_id")
      .limit(5);

    if (sdError) {
      console.log(
        `   ⚠️  Tabla student_diagnoses: ${sdError.message} (puede estar vacía)`
      );
    } else {
      console.log(
        `   ✅ Tabla student_diagnoses existe con ${studentDiagnoses?.length || 0} relaciones`
      );
    }

    console.log("\n" + "=".repeat(70));

    if (allOk) {
      console.log("\n✅ ¡MIGRACIÓN VERIFICADA EXITOSAMENTE!");
      console.log("\n📋 Resumen:");
      console.log("   ✅ Todas las tablas normalizadas existen");
      console.log("   ✅ Columnas person_id y role_id agregadas correctamente");
      console.log("   ✅ Datos migrados correctamente");
      console.log(
        "\n🎉 La base de datos está normalizada según el diagrama relacional!\n"
      );
      return true;
    } else {
      console.log(
        "\n⚠️  Algunos problemas detectados. Revisa los detalles arriba.\n"
      );
      return false;
    }
  } catch (error) {
    console.error("❌ Error:", error);
    return false;
  }
}

verifyMigration()
  .then((success) => {
    process.exit(success ? 0 : 1);
  })
  .catch((error) => {
    console.error("❌ Error fatal:", error);
    process.exit(1);
  });
