/**
 * Script para corregir errores y aplicar normalización completa
 * Usa la API de Supabase para aplicar cambios paso a paso
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

async function fixAndNormalize() {
  console.log("🔧 Corrigiendo y aplicando normalización...\n");
  console.log("=".repeat(70));

  try {
    // PASO 1: Asegurar que roles existen
    console.log("\n📋 Paso 1: Creando roles...");
    const roles = ["ADMIN", "DIRECTOR_CENTRO", "ORIENTADOR", "PROFESOR", "ESTUDIANTE_FAMILIA"];
    
    for (const roleName of roles) {
      const { data: existing } = await supabase
        .from("roles")
        .select("id")
        .eq("name", roleName)
        .maybeSingle();

      if (!existing) {
        const { error } = await supabase
          .from("roles")
          .insert({ name: roleName });

        if (error && !error.message.includes("duplicate") && !error.message.includes("unique")) {
          console.log(`   ⚠️  ${roleName}: ${error.message}`);
        } else {
          console.log(`   ✅ ${roleName}`);
        }
      } else {
        console.log(`   ℹ️  ${roleName} (ya existe)`);
      }
    }

    // PASO 2: Asegurar que niveles educativos existen
    console.log("\n📋 Paso 2: Creando niveles educativos...");
    const levels = ["Infantil", "Primaria", "Secundaria", "Bachillerato", "FP"];

    for (const levelName of levels) {
      const { data: existing } = await supabase
        .from("educational_levels")
        .select("id")
        .eq("name", levelName)
        .maybeSingle();

      if (!existing) {
        const { error } = await supabase
          .from("educational_levels")
          .insert({ name: levelName });

        if (error && !error.message.includes("duplicate") && !error.message.includes("unique")) {
          console.log(`   ⚠️  ${levelName}: ${error.message}`);
        } else {
          console.log(`   ✅ ${levelName}`);
        }
      } else {
        console.log(`   ℹ️  ${levelName} (ya existe)`);
      }
    }

    // PASO 3: Migrar usuarios - crear persons y actualizar users
    console.log("\n📋 Paso 3: Migrando usuarios...");
    
    const { data: users, error: usersError } = await supabase
      .from("users")
      .select("*");

    if (usersError) {
      console.log(`   ❌ Error: ${usersError.message}`);
    } else {
      console.log(`   📊 ${users?.length || 0} usuarios encontrados`);

      let migrated = 0;
      for (const user of users || []) {
        try {
          // Crear persona
          if (user.first_name || user.last_name) {
            const { error: personError } = await supabase
              .from("persons")
              .upsert({
                id: user.id,
                first_name: user.first_name || null,
                last_name: user.last_name || null,
              }, {
                onConflict: "id"
              });

            if (personError && !personError.message.includes("duplicate")) {
              console.log(`   ⚠️  Persona para ${user.email}: ${personError.message}`);
            }
          }

          // Obtener role_id
          let roleId = null;
          if (user.role) {
            const { data: role } = await supabase
              .from("roles")
              .select("id")
              .eq("name", user.role)
              .maybeSingle();

            if (role) {
              roleId = role.id;
            }
          }

          // Actualizar usuario con person_id y role_id
          const updateData = {};
          if (user.first_name || user.last_name) {
            updateData.person_id = user.id;
          }
          if (roleId) {
            updateData.role_id = roleId;
          }

          // Solo actualizar si hay cambios y no tiene estos campos
          const needsUpdate = Object.keys(updateData).length > 0;
          
          if (needsUpdate) {
            // Verificar estructura actual
            const { data: current } = await supabase
              .from("users")
              .select("person_id, role_id")
              .eq("id", user.id)
              .maybeSingle();

            const shouldUpdate = !current?.person_id || !current?.role_id;
            
            if (shouldUpdate) {
              const { error: updateError } = await supabase
                .from("users")
                .update(updateData)
                .eq("id", user.id);

              if (updateError) {
                // Si falla porque la columna no existe, necesitamos SQL
                if (updateError.message.includes("column") && updateError.message.includes("does not exist")) {
                  console.log(`   ⚠️  ${user.email}: Necesita agregar columnas person_id/role_id (requiere SQL)`);
                } else {
                  console.log(`   ⚠️  ${user.email}: ${updateError.message}`);
                }
              } else {
                migrated++;
              }
            }
          }
        } catch (error) {
          console.log(`   ⚠️  Error procesando ${user.email}: ${error.message}`);
        }
      }
      console.log(`   ✅ ${migrated} usuarios actualizados`);
    }

    // PASO 4: Migrar estudiantes
    console.log("\n📋 Paso 4: Migrando estudiantes...");
    
    const { data: students, error: studentsError } = await supabase
      .from("students")
      .select("*");

    if (studentsError) {
      console.log(`   ❌ Error: ${studentsError.message}`);
    } else {
      console.log(`   📊 ${students?.length || 0} estudiantes encontrados`);

      let migrated = 0;
      for (const student of students || []) {
        try {
          // Crear persona
          if (student.first_name || student.last_name) {
            const { error: personError } = await supabase
              .from("persons")
              .upsert({
                id: student.id,
                first_name: student.first_name || null,
                last_name: student.last_name || null,
              }, {
                onConflict: "id"
              });

            if (personError && !personError.message.includes("duplicate")) {
              // Ignorar errores de duplicado
            }

            // Actualizar student con person_id
            const { data: current } = await supabase
              .from("students")
              .select("person_id")
              .eq("id", student.id)
              .maybeSingle();

            if (!current?.person_id) {
              const { error: updateError } = await supabase
                .from("students")
                .update({ person_id: student.id })
                .eq("id", student.id);

              if (updateError) {
                if (updateError.message.includes("column") && updateError.message.includes("does not exist")) {
                  // Necesita SQL para agregar columna
                } else {
                  console.log(`   ⚠️  Estudiante ${student.id}: ${updateError.message}`);
                }
              } else {
                migrated++;
              }
            }
          }
        } catch (error) {
          // Ignorar errores individuales
        }
      }
      console.log(`   ✅ ${migrated} estudiantes actualizados`);
    }

    // PASO 5: Crear centros
    console.log("\n📋 Paso 5: Creando centros...");
    
    const { data: userCenters } = await supabase
      .from("users")
      .select("center_id")
      .not("center_id", "is", null);

    const { data: studentCenters } = await supabase
      .from("students")
      .select("center_id")
      .not("center_id", "is", null);

    const allCenterIds = [
      ...new Set([
        ...(userCenters?.map((u) => u.center_id).filter(Boolean) || []),
        ...(studentCenters?.map((s) => s.center_id).filter(Boolean) || []),
      ]),
    ];

    let centersCreated = 0;
    for (const centerId of allCenterIds) {
      const { data: existing } = await supabase
        .from("centers")
        .select("id")
        .eq("id", centerId)
        .maybeSingle();

      if (!existing) {
        const { error } = await supabase
          .from("centers")
          .insert({
            id: centerId,
            name: `Centro ${centerId.substring(0, 8)}`,
            address: null,
          });

        if (error && !error.message.includes("duplicate")) {
          console.log(`   ⚠️  Centro ${centerId}: ${error.message}`);
        } else {
          centersCreated++;
        }
      }
    }
    console.log(`   ✅ ${centersCreated} centros creados`);

    console.log("\n" + "=".repeat(70));
    console.log("\n✅ Migración parcial completada");
    console.log("\n⚠️  IMPORTANTE: Algunos cambios requieren SQL directo");
    console.log("   - Agregar columnas person_id, role_id a users (si no existen)");
    console.log("   - Agregar columna person_id a students (si no existe)");
    console.log("   - Eliminar columnas antiguas (opcional pero recomendado)");
    console.log("\n📋 Ejecutar SQL completo:");
    console.log("   backend/migrations/normalize-schema-with-cleanup.sql");
    console.log("   En Supabase Dashboard → SQL Editor\n");

  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
}

fixAndNormalize().catch((error) => {
  console.error("❌ Error fatal:", error);
  process.exit(1);
});

