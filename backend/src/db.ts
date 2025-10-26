import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Configuración de Supabase
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Missing Supabase configuration. Please check your environment variables.');
}

// Cliente de Supabase con service role key (para operaciones del backend)
export const supabase: SupabaseClient = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// Cliente de Supabase con anon key (para operaciones del frontend)
export const supabaseAnon: SupabaseClient = createClient(
  supabaseUrl, 
  process.env.SUPABASE_ANON_KEY || ''
);

// Función para verificar conexión
export async function testSupabaseConnection(): Promise<boolean> {
  try {
    const { error } = await supabase.from('users').select('count').limit(1);
    if (error) {
      console.error('Supabase connection error:', error);
      return false;
    }
    console.log('✅ Supabase connection successful');
    return true;
  } catch (error) {
    console.error('Supabase connection failed:', error);
    return false;
  }
}

// Función para obtener usuario por ID
export async function getUserById(userId: string) {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single();
  
  if (error) {
    console.error('Error getting user:', error);
    return null;
  }
  
  return data;
}

// Función para obtener usuario por email
export async function getUserByEmail(email: string) {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('email', email)
    .single();
  
  if (error) {
    console.error('Error getting user by email:', error);
    return null;
  }
  
  return data;
}

// Función para crear usuario
export async function createUser(userData: {
  email: string;
  role: string;
  first_name?: string;
  last_name?: string;
  center_id?: string;
}) {
  const { data, error } = await supabase
    .from('users')
    .insert(userData)
    .select()
    .single();
  
  if (error) {
    console.error('Error creating user:', error);
    throw error;
  }
  
  return data;
}

// Función para actualizar usuario
export async function updateUser(userId: string, updates: any) {
  const { data, error } = await supabase
    .from('users')
    .update(updates)
    .eq('id', userId)
    .select()
    .single();
  
  if (error) {
    console.error('Error updating user:', error);
    throw error;
  }
  
  return data;
}

// Función para obtener estudiantes por usuario
export async function getStudentsByUser(userId: string) {
  const { data, error } = await supabase
    .from('students')
    .select('*')
    .eq('created_by', userId)
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error getting students:', error);
    return [];
  }
  
  return data;
}

// Función para crear estudiante
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
  const { data, error } = await supabase
    .from('students')
    .insert(studentData)
    .select()
    .single();
  
  if (error) {
    console.error('Error creating student:', error);
    throw error;
  }
  
  return data;
}

// Función para obtener PEIs por estudiante
export async function getPEIsByStudent(studentId: string) {
  const { data, error } = await supabase
    .from('peis')
    .select('*')
    .eq('student_id', studentId)
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error getting PEIs:', error);
    return [];
  }
  
  return data;
}

// Función para crear PEI
export async function createPEI(peiData: {
  student_id: string;
  report_id?: string;
  title?: string;
  summary?: string;
  diagnosis?: string;
  objectives?: any;
  adaptations?: any;
  strategies?: any;
  evaluation?: any;
  timeline?: any;
  created_by: string;
}) {
  const { data, error } = await supabase
    .from('peis')
    .insert(peiData)
    .select()
    .single();
  
  if (error) {
    console.error('Error creating PEI:', error);
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
    .from('activity_logs')
    .insert(logData)
    .select()
    .single();
  
  if (error) {
    console.error('Error creating activity log:', error);
    throw error;
  }
  
  return data;
}

// Exportar el cliente por defecto
export default supabase;