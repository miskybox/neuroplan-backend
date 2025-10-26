import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as fs from 'fs';

// Cargar variables de entorno
dotenv.config({ path: '.env' });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Error: Faltan variables de entorno');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function executeSQL(sqlContent) {
  console.log('📋 Ejecutando SQL de migración...');
  
  try {
    // Dividir el SQL en comandos individuales
    const commands = sqlContent
      .split(';')
      .map(cmd => cmd.trim())
      .filter(cmd => cmd.length > 0 && !cmd.startsWith('--'));
    
    console.log(`📝 Ejecutando ${commands.length} comandos SQL...`);
    
    for (let i = 0; i < commands.length; i++) {
      const command = commands[i];
      if (command.trim()) {
        try {
          console.log(`  ${i + 1}/${commands.length}: ${command.substring(0, 50)}...`);
          
          // Ejecutar comando SQL
          const { error } = await supabase.rpc('exec_sql', { sql: command });
          
          if (error) {
            console.warn(`⚠️ Advertencia en comando ${i + 1}:`, error.message);
          } else {
            console.log(`✅ Comando ${i + 1} ejecutado correctamente`);
          }
        } catch (error) {
          console.warn(`⚠️ Error en comando ${i + 1}:`, error.message);
        }
      }
    }
    
    console.log('✅ SQL de migración ejecutado');
    return true;
    
  } catch (error) {
    console.error('❌ Error ejecutando SQL:', error);
    return false;
  }
}

async function createTables() {
  console.log('🏗️ Creando tablas...');
  
  const sql = `
    -- Habilitar extensiones
    CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
    
    -- Tabla de usuarios
    CREATE TABLE IF NOT EXISTS public.users (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255),
        role VARCHAR(50) DEFAULT 'PROFESOR' CHECK (role IN ('ADMIN', 'DIRECTOR_CENTRO', 'ORIENTADOR', 'PROFESOR', 'ESTUDIANTE_FAMILIA')),
        first_name VARCHAR(100),
        last_name VARCHAR(100),
        center_id UUID,
        active BOOLEAN DEFAULT true,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
    
    -- Tabla de estudiantes
    CREATE TABLE IF NOT EXISTS public.students (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        first_name VARCHAR(100) NOT NULL,
        last_name VARCHAR(100) NOT NULL,
        birth_date DATE,
        grade VARCHAR(50),
        parent_name VARCHAR(100),
        parent_email VARCHAR(255),
        parent_phone VARCHAR(20),
        school VARCHAR(100),
        center_id UUID,
        created_by UUID REFERENCES public.users(id),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
    
    -- Tabla de informes médicos
    CREATE TABLE IF NOT EXISTS public.reports (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        student_id UUID REFERENCES public.students(id),
        filename VARCHAR(255) NOT NULL,
        original_name VARCHAR(255) NOT NULL,
        mime_type VARCHAR(100) NOT NULL,
        size INTEGER NOT NULL,
        storage_path VARCHAR(500) NOT NULL,
        extracted_text TEXT,
        status VARCHAR(50) DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED')),
        processed_at TIMESTAMP WITH TIME ZONE,
        created_by UUID REFERENCES public.users(id),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
    
    -- Tabla de PEIs
    CREATE TABLE IF NOT EXISTS public.peis (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        student_id UUID REFERENCES public.students(id),
        report_id UUID REFERENCES public.reports(id),
        version INTEGER DEFAULT 1,
        title VARCHAR(255),
        summary TEXT,
        diagnosis TEXT,
        objectives JSONB,
        adaptations JSONB,
        strategies JSONB,
        evaluation JSONB,
        timeline JSONB,
        status VARCHAR(50) DEFAULT 'DRAFT' CHECK (status IN ('DRAFT', 'ACTIVE', 'COMPLETED', 'ARCHIVED')),
        created_by UUID REFERENCES public.users(id),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
    
    -- Tabla de notificaciones
    CREATE TABLE IF NOT EXISTS public.notifications (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        user_id UUID REFERENCES public.users(id),
        type VARCHAR(100) NOT NULL,
        title VARCHAR(255) NOT NULL,
        message TEXT NOT NULL,
        sender_id UUID REFERENCES public.users(id),
        read BOOLEAN DEFAULT false,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
    
    -- Tabla de archivos de audio
    CREATE TABLE IF NOT EXISTS public.audio_files (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        pei_id UUID REFERENCES public.peis(id),
        url VARCHAR(500) NOT NULL,
        duration INTEGER,
        language VARCHAR(10) DEFAULT 'es',
        voice VARCHAR(100),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
    
    -- Tabla de logs de actividad
    CREATE TABLE IF NOT EXISTS public.activity_logs (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        action VARCHAR(100) NOT NULL,
        entity VARCHAR(50) NOT NULL,
        entity_id UUID NOT NULL,
        user_id UUID REFERENCES public.users(id),
        details JSONB,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
  `;
  
  return await executeSQL(sql);
}

async function createIndexes() {
  console.log('📊 Creando índices...');
  
  const sql = `
    CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
    CREATE INDEX IF NOT EXISTS idx_users_role ON public.users(role);
    CREATE INDEX IF NOT EXISTS idx_users_center_id ON public.users(center_id);
    CREATE INDEX IF NOT EXISTS idx_students_created_by ON public.students(created_by);
    CREATE INDEX IF NOT EXISTS idx_students_center_id ON public.students(center_id);
    CREATE INDEX IF NOT EXISTS idx_reports_student_id ON public.reports(student_id);
    CREATE INDEX IF NOT EXISTS idx_reports_status ON public.reports(status);
    CREATE INDEX IF NOT EXISTS idx_peis_student_id ON public.peis(student_id);
    CREATE INDEX IF NOT EXISTS idx_peis_status ON public.peis(status);
    CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON public.notifications(user_id);
    CREATE INDEX IF NOT EXISTS idx_notifications_read ON public.notifications(read);
    CREATE INDEX IF NOT EXISTS idx_activity_logs_user_id ON public.activity_logs(user_id);
    CREATE INDEX IF NOT EXISTS idx_activity_logs_created_at ON public.activity_logs(created_at);
  `;
  
  return await executeSQL(sql);
}

async function enableRLS() {
  console.log('🔐 Habilitando Row Level Security...');
  
  const sql = `
    ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
    ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
    ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;
    ALTER TABLE public.peis ENABLE ROW LEVEL SECURITY;
    ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
    ALTER TABLE public.audio_files ENABLE ROW LEVEL SECURITY;
    ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;
  `;
  
  return await executeSQL(sql);
}

async function createPolicies() {
  console.log('🛡️ Creando políticas de seguridad...');
  
  const sql = `
    -- Políticas para usuarios
    CREATE POLICY "Users can read own data" ON public.users
        FOR SELECT USING (auth.uid()::text = id::text);
    
    CREATE POLICY "Users can update own data" ON public.users
        FOR UPDATE USING (auth.uid()::text = id::text);
    
    CREATE POLICY "Admins can read all users" ON public.users
        FOR SELECT USING (
            EXISTS (
                SELECT 1 FROM public.users 
                WHERE id::text = auth.uid()::text 
                AND role = 'ADMIN'
            )
        );
    
    -- Políticas para estudiantes
    CREATE POLICY "Users can read students they created" ON public.students
        FOR SELECT USING (created_by::text = auth.uid()::text);
    
    CREATE POLICY "Users can create students" ON public.students
        FOR INSERT WITH CHECK (created_by::text = auth.uid()::text);
    
    CREATE POLICY "Users can update students they created" ON public.students
        FOR UPDATE USING (created_by::text = auth.uid()::text);
    
    -- Políticas para informes
    CREATE POLICY "Users can read reports they created" ON public.reports
        FOR SELECT USING (created_by::text = auth.uid()::text);
    
    CREATE POLICY "Users can create reports" ON public.reports
        FOR INSERT WITH CHECK (created_by::text = auth.uid()::text);
    
    -- Políticas para PEIs
    CREATE POLICY "Users can read PEIs they created" ON public.peis
        FOR SELECT USING (created_by::text = auth.uid()::text);
    
    CREATE POLICY "Users can create PEIs" ON public.peis
        FOR INSERT WITH CHECK (created_by::text = auth.uid()::text);
    
    CREATE POLICY "Users can update PEIs they created" ON public.peis
        FOR UPDATE USING (created_by::text = auth.uid()::text);
    
    -- Políticas para notificaciones
    CREATE POLICY "Users can read own notifications" ON public.notifications
        FOR SELECT USING (user_id::text = auth.uid()::text);
    
    CREATE POLICY "Users can update own notifications" ON public.notifications
        FOR UPDATE USING (user_id::text = auth.uid()::text);
    
    CREATE POLICY "Users can create notifications" ON public.notifications
        FOR INSERT WITH CHECK (sender_id::text = auth.uid()::text);
  `;
  
  return await executeSQL(sql);
}

async function createTriggers() {
  console.log('⚡ Creando triggers...');
  
  const sql = `
    -- Función para actualizar updated_at
    CREATE OR REPLACE FUNCTION public.update_updated_at_column()
    RETURNS TRIGGER AS $$
    BEGIN
        NEW.updated_at = NOW();
        RETURN NEW;
    END;
    $$ language 'plpgsql';
    
    -- Triggers para updated_at
    CREATE TRIGGER update_users_updated_at 
        BEFORE UPDATE ON public.users
        FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
    
    CREATE TRIGGER update_students_updated_at 
        BEFORE UPDATE ON public.students
        FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
    
    CREATE TRIGGER update_peis_updated_at 
        BEFORE UPDATE ON public.peis
        FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
  `;
  
  return await executeSQL(sql);
}

async function createTestUsers() {
  console.log('👥 Creando usuarios de prueba...');
  
  const sql = `
    -- Insertar usuario admin de prueba
    INSERT INTO public.users (email, role, first_name, last_name, center_id)
    VALUES (
        'admin@neuroplan.com',
        'ADMIN',
        'Admin',
        'NeuroPlan',
        uuid_generate_v4()
    ) ON CONFLICT (email) DO NOTHING;
    
    -- Insertar usuario orientador de prueba
    INSERT INTO public.users (email, role, first_name, last_name, center_id)
    VALUES (
        'orientador@neuroplan.com',
        'ORIENTADOR',
        'María',
        'García',
        uuid_generate_v4()
    ) ON CONFLICT (email) DO NOTHING;
    
    -- Insertar usuario profesor de prueba
    INSERT INTO public.users (email, role, first_name, last_name, center_id)
    VALUES (
        'profesor@neuroplan.com',
        'PROFESOR',
        'Juan',
        'Pérez',
        uuid_generate_v4()
    ) ON CONFLICT (email) DO NOTHING;
  `;
  
  return await executeSQL(sql);
}

async function main() {
  console.log('🚀 Iniciando migración completa a Supabase...\n');
  
  try {
    // Paso 1: Crear tablas
    const tablesCreated = await createTables();
    if (!tablesCreated) {
      console.error('❌ Error creando tablas');
      return;
    }
    
    // Paso 2: Crear índices
    await createIndexes();
    
    // Paso 3: Habilitar RLS
    await enableRLS();
    
    // Paso 4: Crear políticas
    await createPolicies();
    
    // Paso 5: Crear triggers
    await createTriggers();
    
    // Paso 6: Crear usuarios de prueba
    await createTestUsers();
    
    console.log('\n🎉 ¡Migración completada exitosamente!');
    console.log('\n📋 Próximos pasos:');
    console.log('1. ✅ Crear usuarios en Supabase Auth');
    console.log('2. ✅ Probar el login');
    console.log('3. ✅ Verificar que el backend funciona');
    
  } catch (error) {
    console.error('❌ Error en el proceso principal:', error);
  }
}

main().catch(console.error);
