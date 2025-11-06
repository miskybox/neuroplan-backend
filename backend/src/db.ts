import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { Logger } from "@nestjs/common";

const logger = new Logger("Database");

// Configuración de Supabase
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error(
    "Missing Supabase configuration. Please check your environment variables."
  );
}

// Cliente de Supabase con service role key (para operaciones del backend)
export const supabase: SupabaseClient = createClient(
  supabaseUrl,
  supabaseServiceKey,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

// Cliente de Supabase con anon key (para operaciones del frontend)
export const supabaseAnon: SupabaseClient = createClient(
  supabaseUrl,
  process.env.SUPABASE_ANON_KEY || ""
);

// Función para verificar conexión
export async function testSupabaseConnection(): Promise<boolean> {
  try {
    const { error } = await supabase.from("users").select("count").limit(1);
    if (error) {
      const errorStack = error instanceof Error ? error.stack : String(error);
      logger.error("Supabase connection error", errorStack);
      return false;
    }
    logger.log("Supabase connection successful");
    return true;
  } catch (error) {
    const errorStack = error instanceof Error ? error.stack : String(error);
    logger.error("Supabase connection failed", errorStack);
    return false;
  }
}

// Función para obtener usuario por ID (con relaciones)
export async function getUserById(userId: string) {
  const { data, error } = await supabase
    .from("users")
    .select(
      `
      *,
      persons!person_id (
        id,
        first_name,
        last_name
      ),
      roles!role_id (
        id,
        name
      ),
      centers!center_id (
        id,
        name,
        address
      )
    `
    )
    .eq("id", userId)
    .single();

  if (error) {
    const errorStack = error instanceof Error ? error.stack : String(error);
    logger.error("Error getting user", errorStack);
    return null;
  }

  // Transformar datos para compatibilidad con código existente
  if (data) {
    return {
      ...data,
      first_name: data.persons?.first_name || null,
      last_name: data.persons?.last_name || null,
      role: data.roles?.name || null,
    };
  }

  return data;
}

// Función para obtener usuario por email (con relaciones)
export async function getUserByEmail(email: string) {
  const { data, error } = await supabase
    .from("users")
    .select(
      `
      *,
      persons!person_id (
        id,
        first_name,
        last_name
      ),
      roles!role_id (
        id,
        name
      ),
      centers!center_id (
        id,
        name,
        address
      )
    `
    )
    .eq("email", email)
    .single();

  if (error) {
    const errorStack = error instanceof Error ? error.stack : String(error);
    logger.error("Error getting user by email", errorStack);
    return null;
  }

  // Transformar datos para compatibilidad con código existente
  if (data) {
    return {
      ...data,
      first_name: data.persons?.first_name || null,
      last_name: data.persons?.last_name || null,
      role: data.roles?.name || null,
    };
  }

  return data;
}

// Función para crear persona
export async function createPerson(personData: {
  first_name?: string;
  last_name?: string;
}) {
  const { data, error } = await supabase
    .from("persons")
    .insert(personData)
    .select()
    .single();

  if (error) {
    const errorStack = error instanceof Error ? error.stack : String(error);
    logger.error("Error creating person", errorStack);
    throw error;
  }

  return data;
}

// Función para obtener rol por nombre, creándolo si no existe
export async function getRoleByName(roleName: string) {
  // Primero intentar obtener el rol
  const { data, error } = await supabase
    .from("roles")
    .select("*")
    .eq("name", roleName)
    .single();

  // Si el rol existe, retornarlo
  if (data && !error) {
    return data;
  }

  // Si no existe y el error es "not found", intentar crearlo
  if (
    error &&
    (error.code === "PGRST116" || error.message?.includes("No rows"))
  ) {
    logger.warn(`Role '${roleName}' not found, attempting to create it...`);

    const { data: newRole, error: createError } = await supabase
      .from("roles")
      .insert({ name: roleName })
      .select()
      .single();

    if (createError) {
      logger.error(`Error creating role '${roleName}': ${createError.message}`);
      return null;
    }

    logger.log(`Role '${roleName}' created successfully`);
    return newRole;
  }

  // Otro tipo de error
  if (error) {
    const errorStack = error instanceof Error ? error.stack : String(error);
    logger.error("Error getting role", errorStack);
    return null;
  }

  return data;
}

// Función para crear usuario (con esquema normalizado)
export async function createUser(userData: {
  id?: string;
  email: string;
  role: string; // nombre del rol
  first_name?: string;
  last_name?: string;
  center_id?: string | null; // Permitir null
}) {
  // 1. Crear persona primero
  let personId: string | null = null;
  if (userData.first_name || userData.last_name) {
    const person = await createPerson({
      first_name: userData.first_name,
      last_name: userData.last_name,
    });
    personId = person.id;
  }

  // 2. Obtener role_id
  const role = await getRoleByName(userData.role);
  if (!role) {
    const errorMsg = `Role '${userData.role}' not found in database. Available roles must be created first.`;
    logger.error(errorMsg);
    throw new Error(errorMsg);
  }

  // 3. Crear usuario
  const userInsert = {
    id: userData.id,
    email: userData.email,
    person_id: personId,
    role_id: role.id,
    center_id: userData.center_id || null,
  };

  const { data, error } = await supabase
    .from("users")
    .insert(userInsert)
    .select(
      `
      *,
      persons!person_id (
        id,
        first_name,
        last_name
      ),
      roles!role_id (
        id,
        name
      ),
      centers!center_id (
        id,
        name,
        address
      )
    `
    )
    .single();

  if (error) {
    const errorStack = error instanceof Error ? error.stack : String(error);
    logger.error("Error creating user", {
      message: error.message,
      code: error.code,
      details: error.details,
      hint: error.hint,
      stack: errorStack,
    });
    // Crear un error más descriptivo
    const errorMessage = error.message || "Error desconocido al crear usuario";
    const detailedError = new Error(
      `Error al crear usuario en la base de datos: ${errorMessage}`
    );
    (detailedError as any).originalError = error;
    throw detailedError;
  }

  // Transformar datos para compatibilidad
  if (data) {
    return {
      ...data,
      first_name: data.persons?.first_name || null,
      last_name: data.persons?.last_name || null,
      role: data.roles?.name || null,
    };
  }

  return data;
}

// Función para actualizar usuario
export async function updateUser(userId: string, updates: any) {
  const { data, error } = await supabase
    .from("users")
    .update(updates)
    .eq("id", userId)
    .select()
    .single();

  if (error) {
    const errorStack = error instanceof Error ? error.stack : String(error);
    logger.error("Error updating user", errorStack);
    throw error;
  }

  return data;
}

// Función para obtener estudiantes por usuario (con relaciones)
export async function getStudentsByUser(userId: string) {
  const { data, error } = await supabase
    .from("students")
    .select(
      `
      *,
      persons!person_id (
        id,
        first_name,
        last_name
      ),
      centers!center_id (
        id,
        name,
        address
      )
    `
    )
    .eq("created_by", userId)
    .order("created_at", { ascending: false });

  if (error) {
    const errorStack = error instanceof Error ? error.stack : String(error);
    logger.error("Error getting students", errorStack);
    return [];
  }

  // Transformar datos para compatibilidad
  return (data || []).map((student) => ({
    ...student,
    first_name: student.persons?.first_name || null,
    last_name: student.persons?.last_name || null,
  }));
}

// Función para crear estudiante (con esquema normalizado)
export async function createStudent(studentData: {
  first_name: string;
  last_name: string;
  birth_date?: string;
  grade?: string;
  parent_name?: string;
  parent_email?: string;
  parent_phone?: string;
  school?: string;
  center_id?: string;
  created_by: string;
}) {
  // 1. Crear persona primero
  const person = await createPerson({
    first_name: studentData.first_name,
    last_name: studentData.last_name,
  });

  // 2. Crear estudiante con person_id
  const studentInsert = {
    person_id: person.id,
    center_id: studentData.center_id || null,
    created_by: studentData.created_by,
  };

  const { data, error } = await supabase
    .from("students")
    .insert(studentInsert)
    .select(
      `
      *,
      persons!person_id (
        id,
        first_name,
        last_name
      ),
      centers!center_id (
        id,
        name,
        address
      )
    `
    )
    .single();

  if (error) {
    const errorStack = error instanceof Error ? error.stack : String(error);
    logger.error("Error creating student", errorStack);
    throw error;
  }

  // Transformar datos para compatibilidad
  if (data) {
    return {
      ...data,
      first_name: data.persons?.first_name || null,
      last_name: data.persons?.last_name || null,
    };
  }

  return data;
}

// Función para obtener PEIs por estudiante
export async function getPEIsByStudent(studentId: string) {
  const { data, error } = await supabase
    .from("peis")
    .select("*")
    .eq("student_id", studentId)
    .order("created_at", { ascending: false });

  if (error) {
    const errorStack = error instanceof Error ? error.stack : String(error);
    logger.error("Error getting PEIs", errorStack);
    return [];
  }

  return data;
}

// Función para crear PEI (esquema normalizado: solo title, summary, diagnosis)
export async function createPEI(peiData: {
  student_id: string;
  title?: string;
  summary?: string;
  diagnosis?: string;
  created_by: string;
}) {
  const { data, error } = await supabase
    .from("peis")
    .insert({
      student_id: peiData.student_id,
      created_by: peiData.created_by,
      title: peiData.title || null,
      summary: peiData.summary || null,
      diagnosis: peiData.diagnosis || null,
    })
    .select()
    .single();

  if (error) {
    const errorStack = error instanceof Error ? error.stack : String(error);
    logger.error("Error creating PEI", errorStack);
    throw error;
  }

  return data;
}

// Función para crear log de actividad
export async function createActivityLog(logData: {
  action: string;
  entity: string;
  entity_id: string;
  user_id: string;
  details?: any;
}) {
  const { data, error } = await supabase
    .from("activity_logs")
    .insert(logData)
    .select()
    .single();

  if (error) {
    const errorStack = error instanceof Error ? error.stack : String(error);
    logger.error("Error creating activity log", errorStack);
    throw error;
  }

  return data;
}

// Exportar el cliente por defecto
export default supabase;

// Test de conexión a Supabase al arrancar el servidor
if (require.main === module) {
  (async () => {
    try {
      await testSupabaseConnection();
    } catch (error) {
      logger.error("Failed to test connection", error);
    }
  })();
}
