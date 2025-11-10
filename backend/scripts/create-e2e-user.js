require("dotenv").config();
const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY requeridas en .env");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const email = "e2e-test@neuroplan.com";
const password = "E2eTest2024!";
const userData = {
  role: "ORIENTADOR",
  firstName: "E2E",
  lastName: "Test User",
  centerId: null,
};

async function main() {
  console.log("Creando/actualizando usuario E2E en Supabase Auth...");

  try {
    // Intentar crear
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        role: userData.role,
        first_name: userData.firstName,
        last_name: userData.lastName,
      },
    });

    let authId;
    if (error) {
      // Si ya existe (mensajes pueden variar), buscar y actualizar password
      const msg = error.message || "";
      if (
        msg.includes("already registered") ||
        msg.includes("already been registered") ||
        error.status === 422
      ) {
        console.log("Usuario ya existe en Auth, buscando...");
        const { data: list } = await supabase.auth.admin.listUsers();
        const existing = list.users.find((u) => u.email === email);
        if (!existing) throw new Error("Usuario existe pero no se encontró");
        authId = existing.id;
        const { error: updErr } = await supabase.auth.admin.updateUserById(
          authId,
          {
            password,
          }
        );
        if (updErr) throw updErr;
        console.log("Password actualizado en Auth");
      } else {
        throw error;
      }
    } else {
      authId = data.user.id;
      console.log("Usuario creado en Auth con ID:", authId);
    }

    // Upsert en tabla users
    const { data: existing, error: selectErr } = await supabase
      .from("users")
      .select("id")
      .eq("email", email)
      .maybeSingle();

    if (selectErr && selectErr.code !== "PGRST116") throw selectErr;

    if (existing) {
      // Si ID diferente, actualizar
      if (existing.id !== authId) {
        const { error: updateErr } = await supabase
          .from("users")
          .update({ id: authId })
          .eq("email", email);
        if (updateErr) throw updateErr;
        console.log("ID del usuario en tabla users actualizado");
      } else {
        console.log("Usuario ya sincronizado en tabla users");
      }
    } else {
      const { error: insertErr } = await supabase.from("users").insert({
        id: authId,
        email,
        role: userData.role,
        first_name: userData.firstName,
        last_name: userData.lastName,
        center_id: userData.centerId,
        active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });
      if (insertErr) throw insertErr;
      console.log("Usuario insertado en tabla users");
    }

    console.log("\n✅ Usuario E2E listo: %s / %s", email, password);
    process.exit(0);
  } catch (err) {
    console.error("Error creando usuario E2E:", err.message || err);
    process.exit(1);
  }
}

main();
