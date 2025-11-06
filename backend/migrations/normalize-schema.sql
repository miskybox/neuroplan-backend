-- ===========================================
-- NEUROPLAN NORMALIZED SCHEMA MIGRATION
-- ===========================================
-- Este script normaliza la base de datos según el diagrama relacional
-- Ejecutar en Supabase → Database → SQL Editor
--
-- IMPORTANTE: Este script migra los datos existentes a la nueva estructura normalizada
-- ===========================================

-- Habilitar extensiones
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ===========================================
-- PASO 1: CREAR NUEVAS TABLAS NORMALIZADAS
-- ===========================================

-- Tabla de personas (base para usuarios y estudiantes)
CREATE TABLE IF NOT EXISTS public.persons (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    first_name TEXT,
    last_name TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de roles
CREATE TABLE IF NOT EXISTS public.roles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de niveles educativos
CREATE TABLE IF NOT EXISTS public.educational_levels (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de centros
CREATE TABLE IF NOT EXISTS public.centers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    address TEXT,
    educational_level_id UUID REFERENCES public.educational_levels(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de diagnósticos
CREATE TABLE IF NOT EXISTS public.diagnoses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    description TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===========================================
-- PASO 2: MIGRAR DATOS EXISTENTES
-- ===========================================

-- Insertar roles desde los roles existentes en users
INSERT INTO public.roles (id, name)
SELECT DISTINCT 
    uuid_generate_v4(),
    role
FROM public.users
WHERE role IS NOT NULL
ON CONFLICT (name) DO NOTHING;

-- Insertar niveles educativos básicos (si no existen)
INSERT INTO public.educational_levels (id, name)
VALUES 
    (uuid_generate_v4(), 'Infantil'),
    (uuid_generate_v4(), 'Primaria'),
    (uuid_generate_v4(), 'Secundaria'),
    (uuid_generate_v4(), 'Bachillerato'),
    (uuid_generate_v4(), 'FP')
ON CONFLICT (name) DO NOTHING;

-- Migrar personas desde usuarios existentes
INSERT INTO public.persons (id, first_name, last_name)
SELECT 
    id,
    first_name,
    last_name
FROM public.users
WHERE first_name IS NOT NULL OR last_name IS NOT NULL
ON CONFLICT (id) DO NOTHING;

-- Migrar personas desde estudiantes existentes
INSERT INTO public.persons (id, first_name, last_name)
SELECT 
    id,
    first_name,
    last_name
FROM public.students
WHERE first_name IS NOT NULL OR last_name IS NOT NULL
ON CONFLICT (id) DO NOTHING;

-- Crear centros desde los center_id existentes (si no existen)
INSERT INTO public.centers (id, name, address)
SELECT DISTINCT
    center_id,
    'Centro ' || center_id::text,
    NULL
FROM public.users
WHERE center_id IS NOT NULL
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.centers (id, name, address)
SELECT DISTINCT
    center_id,
    'Centro ' || center_id::text,
    NULL
FROM public.students
WHERE center_id IS NOT NULL
ON CONFLICT (id) DO NOTHING;

-- ===========================================
-- PASO 3: CREAR TABLAS CON RELACIONES NORMALIZADAS
-- ===========================================

-- Tabla de usuarios normalizada
CREATE TABLE IF NOT EXISTS public.users_new (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    person_id UUID REFERENCES public.persons(id),
    role_id UUID REFERENCES public.roles(id),
    center_id UUID REFERENCES public.centers(id),
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Migrar usuarios a la nueva estructura
INSERT INTO public.users_new (id, email, person_id, role_id, center_id, active, created_at, updated_at)
SELECT 
    u.id,
    u.email,
    p.id as person_id,
    r.id as role_id,
    u.center_id,
    COALESCE(u.active, true),
    COALESCE(u.created_at, NOW()),
    COALESCE(u.updated_at, NOW())
FROM public.users u
LEFT JOIN public.persons p ON p.id = u.id
LEFT JOIN public.roles r ON r.name = u.role
ON CONFLICT (email) DO NOTHING;

-- Tabla de estudiantes normalizada
CREATE TABLE IF NOT EXISTS public.students_new (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    person_id UUID REFERENCES public.persons(id),
    center_id UUID REFERENCES public.centers(id),
    created_by UUID REFERENCES public.users_new(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Migrar estudiantes a la nueva estructura
INSERT INTO public.students_new (id, person_id, center_id, created_by, created_at, updated_at)
SELECT 
    s.id,
    p.id as person_id,
    s.center_id,
    s.created_by,
    COALESCE(s.created_at, NOW()),
    COALESCE(s.updated_at, NOW())
FROM public.students s
LEFT JOIN public.persons p ON p.id = s.id
ON CONFLICT (id) DO NOTHING;

-- Tabla de diagnósticos de estudiantes (junction table)
CREATE TABLE IF NOT EXISTS public.student_diagnoses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID REFERENCES public.students_new(id),
    diagnosis_id UUID REFERENCES public.diagnoses(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Migrar diagnósticos desde la columna diagnostico de students (si existe)
DO $$
DECLARE
    diag_record RECORD;
    diag_id UUID;
    student_person_id UUID;
BEGIN
    -- Verificar si la columna diagnostico existe
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'students' AND column_name = 'diagnostico'
    ) THEN
        FOR diag_record IN 
            SELECT DISTINCT s.id, s.diagnostico 
            FROM public.students s 
            WHERE s.diagnostico IS NOT NULL AND s.diagnostico != ''
        LOOP
            -- Crear o obtener diagnóstico
            INSERT INTO public.diagnoses (description)
            VALUES (diag_record.diagnostico)
            ON CONFLICT DO NOTHING
            RETURNING id INTO diag_id;
            
            IF diag_id IS NULL THEN
                SELECT id INTO diag_id FROM public.diagnoses WHERE description = diag_record.diagnostico;
            END IF;
            
            -- Obtener el student_id de la nueva tabla (el id se mantiene igual)
            SELECT id INTO student_person_id FROM public.students_new WHERE id = diag_record.id;
            
            IF student_person_id IS NOT NULL AND diag_id IS NOT NULL THEN
                INSERT INTO public.student_diagnoses (student_id, diagnosis_id)
                VALUES (student_person_id, diag_id)
                ON CONFLICT DO NOTHING;
            END IF;
        END LOOP;
    END IF;
END $$;

-- Tabla de PEIs simplificada
CREATE TABLE IF NOT EXISTS public.peis_new (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID REFERENCES public.students_new(id),
    created_by UUID REFERENCES public.users_new(id),
    title TEXT,
    summary TEXT,
    diagnosis TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Migrar PEIs a la nueva estructura (solo campos básicos)
INSERT INTO public.peis_new (id, student_id, created_by, title, summary, diagnosis, created_at, updated_at)
SELECT 
    p.id,
    sn.id as student_id,
    p.created_by,
    p.title,
    p.summary,
    p.diagnosis,
    COALESCE(p.created_at, NOW()),
    COALESCE(p.updated_at, NOW())
FROM public.peis p
LEFT JOIN public.students_new sn ON sn.id = p.student_id
WHERE sn.id IS NOT NULL
ON CONFLICT (id) DO NOTHING;

-- Tabla de logs de actividad (ajustada al diagrama)
CREATE TABLE IF NOT EXISTS public.activity_logs_new (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users_new(id),
    entity TEXT,
    entity_id UUID,
    action TEXT,
    details JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Migrar logs de actividad
INSERT INTO public.activity_logs_new (id, user_id, entity, entity_id, action, details, created_at)
SELECT 
    al.id,
    al.user_id,
    al.entity,
    al.entity_id,
    al.action,
    al.details,
    COALESCE(al.created_at, NOW())
FROM public.activity_logs al
WHERE al.user_id IN (SELECT id FROM public.users_new)
ON CONFLICT (id) DO NOTHING;

-- ===========================================
-- PASO 4: REEMPLAZAR TABLAS ANTIGUAS
-- ===========================================

-- Eliminar políticas RLS de las tablas antiguas
DROP POLICY IF EXISTS "Users can read own data" ON public.users;
DROP POLICY IF EXISTS "Users can update own data" ON public.users;
DROP POLICY IF EXISTS "Admins can read all users" ON public.users;
DROP POLICY IF EXISTS "Users can read students they created" ON public.students;
DROP POLICY IF EXISTS "Users can create students" ON public.students;
DROP POLICY IF EXISTS "Users can update students they created" ON public.students;
DROP POLICY IF EXISTS "Users can read PEIs they created" ON public.peis;
DROP POLICY IF EXISTS "Users can create PEIs" ON public.peis;
DROP POLICY IF EXISTS "Users can update PEIs they created" ON public.peis;
DROP POLICY IF EXISTS "Users can read own notifications" ON public.notifications;
DROP POLICY IF EXISTS "Users can update own notifications" ON public.notifications;
DROP POLICY IF EXISTS "Users can create notifications" ON public.notifications;

-- Eliminar triggers antiguos
DROP TRIGGER IF EXISTS update_users_updated_at ON public.users;
DROP TRIGGER IF EXISTS update_students_updated_at ON public.students;
DROP TRIGGER IF EXISTS update_peis_updated_at ON public.peis;

-- Renombrar tablas antiguas como backup
ALTER TABLE IF EXISTS public.users RENAME TO users_old;
ALTER TABLE IF EXISTS public.students RENAME TO students_old;
ALTER TABLE IF EXISTS public.peis RENAME TO peis_old;
ALTER TABLE IF EXISTS public.activity_logs RENAME TO activity_logs_old;

-- Renombrar tablas nuevas
ALTER TABLE public.users_new RENAME TO users;
ALTER TABLE public.students_new RENAME TO students;
ALTER TABLE public.peis_new RENAME TO peis;
ALTER TABLE public.activity_logs_new RENAME TO activity_logs;

-- ===========================================
-- PASO 5: CREAR ÍNDICES
-- ===========================================

CREATE INDEX IF NOT EXISTS idx_persons_name ON public.persons(first_name, last_name);
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_users_person_id ON public.users(person_id);
CREATE INDEX IF NOT EXISTS idx_users_role_id ON public.users(role_id);
CREATE INDEX IF NOT EXISTS idx_users_center_id ON public.users(center_id);
CREATE INDEX IF NOT EXISTS idx_students_person_id ON public.students(person_id);
CREATE INDEX IF NOT EXISTS idx_students_center_id ON public.students(center_id);
CREATE INDEX IF NOT EXISTS idx_students_created_by ON public.students(created_by);
CREATE INDEX IF NOT EXISTS idx_centers_educational_level_id ON public.centers(educational_level_id);
CREATE INDEX IF NOT EXISTS idx_student_diagnoses_student_id ON public.student_diagnoses(student_id);
CREATE INDEX IF NOT EXISTS idx_student_diagnoses_diagnosis_id ON public.student_diagnoses(diagnosis_id);
CREATE INDEX IF NOT EXISTS idx_peis_student_id ON public.peis(student_id);
CREATE INDEX IF NOT EXISTS idx_peis_created_by ON public.peis(created_by);
CREATE INDEX IF NOT EXISTS idx_activity_logs_user_id ON public.activity_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_entity ON public.activity_logs(entity, entity_id);

-- ===========================================
-- PASO 6: HABILITAR ROW LEVEL SECURITY
-- ===========================================

ALTER TABLE public.persons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.educational_levels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.centers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.diagnoses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_diagnoses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.peis ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;

-- ===========================================
-- PASO 7: CREAR POLÍTICAS DE SEGURIDAD
-- ===========================================

-- Políticas para persons
CREATE POLICY "Users can read persons" ON public.persons
    FOR SELECT USING (true);

-- Políticas para roles
CREATE POLICY "Users can read roles" ON public.roles
    FOR SELECT USING (true);

-- Políticas para educational_levels
CREATE POLICY "Users can read educational_levels" ON public.educational_levels
    FOR SELECT USING (true);

-- Políticas para centers
CREATE POLICY "Users can read centers" ON public.centers
    FOR SELECT USING (true);

-- Políticas para users
CREATE POLICY "Users can read own data" ON public.users
    FOR SELECT USING (auth.uid()::text = id::text);

CREATE POLICY "Users can update own data" ON public.users
    FOR UPDATE USING (auth.uid()::text = id::text);

CREATE POLICY "Users can read all users" ON public.users
    FOR SELECT USING (true);

-- Políticas para students
CREATE POLICY "Users can read students they created" ON public.students
    FOR SELECT USING (created_by::text = auth.uid()::text);

CREATE POLICY "Users can create students" ON public.students
    FOR INSERT WITH CHECK (created_by::text = auth.uid()::text);

CREATE POLICY "Users can update students they created" ON public.students
    FOR UPDATE USING (created_by::text = auth.uid()::text);

-- Políticas para diagnoses
CREATE POLICY "Users can read diagnoses" ON public.diagnoses
    FOR SELECT USING (true);

-- Políticas para student_diagnoses
CREATE POLICY "Users can read student_diagnoses" ON public.student_diagnoses
    FOR SELECT USING (true);

CREATE POLICY "Users can create student_diagnoses" ON public.student_diagnoses
    FOR INSERT WITH CHECK (true);

-- Políticas para peis
CREATE POLICY "Users can read PEIs they created" ON public.peis
    FOR SELECT USING (created_by::text = auth.uid()::text);

CREATE POLICY "Users can create PEIs" ON public.peis
    FOR INSERT WITH CHECK (created_by::text = auth.uid()::text);

CREATE POLICY "Users can update PEIs they created" ON public.peis
    FOR UPDATE USING (created_by::text = auth.uid()::text);

-- Políticas para activity_logs
CREATE POLICY "Users can read own activity logs" ON public.activity_logs
    FOR SELECT USING (user_id::text = auth.uid()::text);

CREATE POLICY "Users can create activity logs" ON public.activity_logs
    FOR INSERT WITH CHECK (user_id::text = auth.uid()::text);

-- ===========================================
-- PASO 8: CREAR TRIGGERS
-- ===========================================

-- Función para actualizar updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para updated_at
CREATE TRIGGER update_persons_updated_at 
    BEFORE UPDATE ON public.persons
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_users_updated_at 
    BEFORE UPDATE ON public.users
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_centers_updated_at 
    BEFORE UPDATE ON public.centers
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_students_updated_at 
    BEFORE UPDATE ON public.students
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_peis_updated_at 
    BEFORE UPDATE ON public.peis
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ===========================================
-- PASO 9: VERIFICACIÓN
-- ===========================================

-- Verificar que las tablas se crearon correctamente
SELECT 
    table_name,
    table_type
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN (
    'persons', 
    'roles', 
    'educational_levels', 
    'centers', 
    'users', 
    'students', 
    'diagnoses', 
    'student_diagnoses', 
    'peis', 
    'activity_logs'
)
ORDER BY table_name;

-- Verificar relaciones
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
AND tc.table_name IN (
    'persons', 
    'roles', 
    'educational_levels', 
    'centers', 
    'users', 
    'students', 
    'diagnoses', 
    'student_diagnoses', 
    'peis', 
    'activity_logs'
)
ORDER BY tc.table_name, kcu.column_name;

SELECT 'NeuroPlan normalized schema migration completed successfully!' as status;

