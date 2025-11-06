/**
 * Script para aplicar la normalización de BD paso a paso
 * Ejecuta la migración usando la API de Supabase
 * 
 * Uso: node backend/scripts/apply-normalization.js
 */

const { createClient } = require("@supabase/supabase-js");
const fs = require("fs");
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

// Función para ejecutar SQL usando RPC o función personalizada
async function executeSQL(sql) {
  try {
    // Intentar usar función RPC si existe
    const { data, error } = await supabase.rpc("exec_sql", { sql });
    
    if (error) {
      // Si no existe la función, necesitamos usar otro método
      throw new Error(`No se puede ejecutar SQL directamente: ${error.message}`);
    }
    
    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
}

// Ejecutar pasos de migración usando operaciones de la API
async function applyNormalization() {
  console.log("🚀 Aplicando normalización de base de datos...\n");
  console.log("=".repeat(70));

  try {
    // PASO 1: Verificar y crear roles si no existen
    console.log("\n📋 Paso 1: Creando roles...");
    const roles = ["ADMIN", "DIRECTOR_CENTRO", "ORIENTADOR", "PROFESOR", "ESTUDIANTE_FAMILIA"];
    
    for (const roleName of roles) {
      const { data: existing } = await supabase
        .from("roles")
        .select("id")
        .eq("name", roleName)
        .single();

      if (!existing) {
        const { error } = await supabase
          .from("roles")
          .insert({ name: roleName });

        if (error && !error.message.includes("duplicate")) {
          console.log(`   ⚠️  Error creando rol ${roleName}: ${error.message}`);
        } else {
          console.log(`   ✅ Rol creado: ${roleName}`);
        }
      } else {
        console.log(`   ℹ️  Rol ya existe: ${roleName}`);
      }
    }

    // PASO 2: Crear niveles educativos
    console.log("\n📋 Paso 2: Creando niveles educativos...");
    const levels = ["Infantil", "Primaria", "Secundaria", "Bachillerato", "FP"];

    for (const levelName of levels) {
      const { data: existing } = await supabase
        .from("educational_levels")
        .select("id")
        .eq("name", levelName)
        .single();

      if (!existing) {
        const { error } = await supabase
          .from("educational_levels")
          .insert({ name: levelName });

        if (error && !error.message.includes("duplicate")) {
          console.log(`   ⚠️  Error creando nivel ${levelName}: ${error.message}`);
        } else {
          console.log(`   ✅ Nivel creado: ${levelName}`);
        }
      } else {
        console.log(`   ℹ️  Nivel ya existe: ${levelName}`);
      }
    }

    // PASO 3: Migrar usuarios a persons y actualizar users
    console.log("\n📋 Paso 3: Migrando usuarios a persons...");
    
    // Obtener todos los usuarios actuales
    const { data: users, error: usersError } = await supabase
      .from("users")
      .select("*");

    if (usersError) {
      console.log(`   ❌ Error obteniendo usuarios: ${usersError.message}`);
      return;
    }

    console.log(`   📊 Usuarios encontrados: ${users?.length || 0}`);

    if (users && users.length > 0) {
      for (const user of users) {
        // Crear persona si tiene first_name o last_name
        if (user.first_name || user.last_name) {
          // Verificar si ya existe persona con este ID
          const { data: existingPerson } = await supabase
            .from("persons")
            .select("id")
            .eq("id", user.id)
            .single();

          if (!existingPerson) {
            const { error: personError } = await supabase
              .from("persons")
              .insert({
                id: user.id,
                first_name: user.first_name || null,
                last_name: user.last_name || null,
              });

            if (personError) {
              console.log(`   ⚠️  Error creando persona para ${user.email}: ${personError.message}`);
            } else {
              console.log(`   ✅ Persona creada para: ${user.email}`);
            }
          }
        }

        // Obtener role_id
        let roleId = null;
        if (user.role) {
          const { data: role } = await supabase
            .from("roles")
            .select("id")
            .eq("name", user.role)
            .single();

          if (role) {
            roleId = role.id;
          }
        }

        // Actualizar usuario con person_id y role_id
        // Primero verificar si ya tiene estos campos
        const { data: currentUser } = await supabase
          .from("users")
          .select("person_id, role_id")
          .eq("id", user.id)
          .single();

        if (!currentUser?.person_id || !currentUser?.role_id) {
          const updateData = {};
          if (user.first_name || user.last_name) {
            updateData.person_id = user.id; // Mismo ID que la persona
          }
          if (roleId) {
            updateData.role_id = roleId;
          }

          if (Object.keys(updateData).length > 0) {
            const { error: updateError } = await supabase
              .from("users")
              .update(updateData)
              .eq("id", user.id);

            if (updateError) {
              console.log(`   ⚠️  Error actualizando usuario ${user.email}: ${updateError.message}`);
            } else {
              console.log(`   ✅ Usuario actualizado: ${user.email}`);
            }
          }
        }
      }
    }

    // PASO 4: Migrar estudiantes a persons y actualizar students
    console.log("\n📋 Paso 4: Migrando estudiantes a persons...");
    
    const { data: students, error: studentsError } = await supabase
      .from("students")
      .select("*");

    if (studentsError) {
      console.log(`   ❌ Error obteniendo estudiantes: ${studentsError.message}`);
    } else {
      console.log(`   📊 Estudiantes encontrados: ${students?.length || 0}`);

      if (students && students.length > 0) {
        for (const student of students) {
          // Crear persona si tiene first_name o last_name
          if (student.first_name || student.last_name) {
            // Verificar si ya existe persona
            const { data: existingPerson } = await supabase
              .from("persons")
              .select("id")
              .eq("id", student.id)
              .single();

            if (!existingPerson) {
              const { error: personError } = await supabase
                .from("persons")
                .insert({
                  id: student.id,
                  first_name: student.first_name || null,
                  last_name: student.last_name || null,
                });

              if (personError) {
                console.log(`   ⚠️  Error creando persona para estudiante: ${personError.message}`);
              }
            }

            // Actualizar student con person_id
            const { data: currentStudent } = await supabase
              .from("students")
              .select("person_id")
              .eq("id", student.id)
              .single();

            if (!currentStudent?.person_id) {
              const { error: updateError } = await supabase
                .from("students")
                .update({ person_id: student.id })
                .eq("id", student.id);

              if (updateError) {
                console.log(`   ⚠️  Error actualizando estudiante: ${updateError.message}`);
              }
            }
          }
        }
      }
    }

    // PASO 5: Crear centros desde center_id existentes
    console.log("\n📋 Paso 5: Creando centros...");
    
    // Obtener center_ids únicos de users
    const { data: userCenters } = await supabase
      .from("users")
      .select("center_id")
      .not("center_id", "is", null);

    // Obtener center_ids únicos de students
    const { data: studentCenters } = await supabase
      .from("students")
      .select("center_id")
      .not("center_id", "is", null);

    const allCenterIds = [
      ...new Set([
        ...(userCenters?.map(u => u.center_id) || []),
        ...(studentCenters?.map(s => s.center_id) || []),
      ]),
    ];

    for (const centerId of allCenterIds) {
      const { data: existing } = await supabase
        .from("centers")
        .select("id")
        .eq("id", centerId)
        .single();

      if (!existing) {
        const { error } = await supabase
          .from("centers")
          .insert({
            id: centerId,
            name: `Centro ${centerId}`,
            address: null,
          });

        if (error && !error.message.includes("duplicate")) {
          console.log(`   ⚠️  Error creando centro: ${error.message}`);
        } else {
          console.log(`   ✅ Centro creado: ${centerId}`);
        }
      }
    }

    console.log("\n" + "=".repeat(70));
    console.log("\n✅ Normalización aplicada paso a paso");
    console.log("\n⚠️  NOTA: Algunos cambios requieren SQL directo:");
    console.log("   - Eliminar columnas antiguas (first_name, last_name, role de users)");
    console.log("   - Eliminar columnas antiguas de students");
    console.log("   - Crear constraints y foreign keys");
    console.log("\n📋 Para completar la migración:");
    console.log("   1. Ejecuta: backend/migrations/normalize-schema-with-cleanup.sql");
    console.log("   2. En Supabase Dashboard → SQL Editor\n");

  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
}

// Ejecutar
applyNormalization().catch((error) => {
  console.error("❌ Error fatal:", error);
  process.exit(1);
});

