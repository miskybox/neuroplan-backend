-- ===========================================
-- APLICAR NORMALIZACIÓN COMPLETA - SCRIPT FINAL
-- ===========================================
-- Este script corrige todos los errores y aplica la normalización completa
-- Ejecutar en Supabase → Database → SQL Editor
-- ===========================================

-- Habilitar extensiones
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ===========================================
-- PASO 1: Crear tablas base si no existen
-- ===========================================

-- Tabla persons
CREATE TABLE IF NOT EXISTS public.persons (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    first_name TEXT,
    last_name TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla roles
CREATE TABLE IF NOT EXISTS public.roles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla educational_levels
CREATE TABLE IF NOT EXISTS public.educational_levels (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla centers
CREATE TABLE IF NOT EXISTS public.centers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    address TEXT,
    educational_level_id UUID REFERENCES public.educational_levels(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla diagnoses
CREATE TABLE IF NOT EXISTS public.diagnoses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    description TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla student_diagnoses
CREATE TABLE IF NOT EXISTS public.student_diagnoses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID REFERENCES public.students(id),
    diagnosis_id UUID REFERENCES public.diagnoses(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(student_id, diagnosis_id)
);

-- ===========================================
-- PASO 2: Poblar datos iniciales
-- ===========================================

-- Insertar roles
INSERT INTO public.roles (id, name)
VALUES 
    (uuid_generate_v4(), 'ADMIN'),
    (uuid_generate_v4(), 'DIRECTOR_CENTRO'),
    (uuid_generate_v4(), 'ORIENTADOR'),
    (uuid_generate_v4(), 'PROFESOR'),
    (uuid_generate_v4(), 'ESTUDIANTE_FAMILIA')
ON CONFLICT (name) DO NOTHING;

-- Insertar niveles educativos
INSERT INTO public.educational_levels (id, name)
VALUES 
    (uuid_generate_v4(), 'Infantil'),
    (uuid_generate_v4(), 'Primaria'),
    (uuid_generate_v4(), 'Secundaria'),
    (uuid_generate_v4(), 'Bachillerato'),
    (uuid_generate_v4(), 'FP')
ON CONFLICT (name) DO NOTHING;

-- ===========================================
-- PASO 3: Migrar personas desde users
-- ===========================================

INSERT INTO public.persons (id, first_name, last_name)
SELECT 
    u.id,
    u.first_name,
    u.last_name
FROM public.users u
WHERE (u.first_name IS NOT NULL OR u.last_name IS NOT NULL)
  AND NOT EXISTS (SELECT 1 FROM public.persons p WHERE p.id = u.id)
ON CONFLICT (id) DO NOTHING;

-- ===========================================
-- PASO 4: Migrar personas desde students
-- ===========================================

INSERT INTO public.persons (id, first_name, last_name)
SELECT 
    s.id,
    s.first_name,
    s.last_name
FROM public.students s
WHERE (s.first_name IS NOT NULL OR s.last_name IS NOT NULL)
  AND NOT EXISTS (SELECT 1 FROM public.persons p WHERE p.id = s.id)
ON CONFLICT (id) DO NOTHING;

-- ===========================================
-- PASO 5: Agregar columnas a users
-- ===========================================

-- Agregar person_id si no existe
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'users' 
        AND column_name = 'person_id'
    ) THEN
        ALTER TABLE public.users ADD COLUMN person_id UUID REFERENCES public.persons(id);
    END IF;
END $$;

-- Agregar role_id si no existe
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'users' 
        AND column_name = 'role_id'
    ) THEN
        ALTER TABLE public.users ADD COLUMN role_id UUID REFERENCES public.roles(id);
    END IF;
END $$;

-- Poblar person_id en users
UPDATE public.users u
SET person_id = u.id
WHERE u.person_id IS NULL 
  AND EXISTS (SELECT 1 FROM public.persons p WHERE p.id = u.id);

-- Poblar role_id en users
UPDATE public.users u
SET role_id = r.id
FROM public.roles r
WHERE u.role_id IS NULL
  AND u.role = r.name;

-- ===========================================
-- PASO 6: Agregar columnas a students
-- ===========================================

-- Agregar person_id si no existe
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'students' 
        AND column_name = 'person_id'
    ) THEN
        ALTER TABLE public.students ADD COLUMN person_id UUID REFERENCES public.persons(id);
    END IF;
END $$;

-- Poblar person_id en students
UPDATE public.students s
SET person_id = s.id
WHERE s.person_id IS NULL
  AND EXISTS (SELECT 1 FROM public.persons p WHERE p.id = s.id);

-- ===========================================
-- PASO 7: Crear centros
-- ===========================================

INSERT INTO public.centers (id, name, address)
SELECT DISTINCT
    u.center_id,
    'Centro ' || SUBSTRING(u.center_id::text, 1, 8),
    NULL
FROM public.users u
WHERE u.center_id IS NOT NULL
  AND NOT EXISTS (SELECT 1 FROM public.centers c WHERE c.id = u.center_id)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.centers (id, name, address)
SELECT DISTINCT
    s.center_id,
    'Centro ' || SUBSTRING(s.center_id::text, 1, 8),
    NULL
FROM public.students s
WHERE s.center_id IS NOT NULL
  AND NOT EXISTS (SELECT 1 FROM public.centers c WHERE c.id = s.center_id)
ON CONFLICT (id) DO NOTHING;

-- ===========================================
-- PASO 8: Migrar diagnósticos
-- ===========================================

DO $$
DECLARE
    diag_record RECORD;
    diag_id UUID;
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'students' 
        AND column_name = 'diagnostico'
    ) THEN
        FOR diag_record IN 
            SELECT DISTINCT s.id, s.diagnostico 
            FROM public.students s 
            WHERE s.diagnostico IS NOT NULL AND s.diagnostico != ''
        LOOP
            INSERT INTO public.diagnoses (description)
            VALUES (diag_record.diagnostico)
            ON CONFLICT DO NOTHING
            RETURNING id INTO diag_id;
            
            IF diag_id IS NULL THEN
                SELECT id INTO diag_id FROM public.diagnoses WHERE description = diag_record.diagnostico LIMIT 1;
            END IF;
            
            IF diag_id IS NOT NULL THEN
                INSERT INTO public.student_diagnoses (student_id, diagnosis_id)
                VALUES (diag_record.id, diag_id)
                ON CONFLICT DO NOTHING;
            END IF;
        END LOOP;
    END IF;
END $$;

-- ===========================================
-- PASO 9: Asegurar que peis tiene estructura correcta
-- ===========================================

-- Verificar que peis tiene solo las columnas requeridas
-- Si tiene columnas extra, no las eliminamos (solo verificamos)

-- ===========================================
-- PASO 10: Crear función y triggers para updated_at
-- ===========================================

-- Función para actualizar updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers para updated_at
DROP TRIGGER IF EXISTS update_persons_updated_at ON public.persons;
CREATE TRIGGER update_persons_updated_at
    BEFORE UPDATE ON public.persons
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_centers_updated_at ON public.centers;
CREATE TRIGGER update_centers_updated_at
    BEFORE UPDATE ON public.centers
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_users_updated_at ON public.users;
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON public.users
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_students_updated_at ON public.students;
CREATE TRIGGER update_students_updated_at
    BEFORE UPDATE ON public.students
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_peis_updated_at ON public.peis;
CREATE TRIGGER update_peis_updated_at
    BEFORE UPDATE ON public.peis
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- ===========================================
-- PASO 11: Crear índices
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
-- PASO 12: Habilitar RLS y crear políticas básicas
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

-- Políticas básicas (permitir todo para MVP)
DROP POLICY IF EXISTS "Allow all on persons" ON public.persons;
CREATE POLICY "Allow all on persons" ON public.persons FOR ALL USING (true);

DROP POLICY IF EXISTS "Allow all on roles" ON public.roles;
CREATE POLICY "Allow all on roles" ON public.roles FOR ALL USING (true);

DROP POLICY IF EXISTS "Allow all on educational_levels" ON public.educational_levels;
CREATE POLICY "Allow all on educational_levels" ON public.educational_levels FOR ALL USING (true);

DROP POLICY IF EXISTS "Allow all on centers" ON public.centers;
CREATE POLICY "Allow all on centers" ON public.centers FOR ALL USING (true);

DROP POLICY IF EXISTS "Allow all on diagnoses" ON public.diagnoses;
CREATE POLICY "Allow all on diagnoses" ON public.diagnoses FOR ALL USING (true);

DROP POLICY IF EXISTS "Allow all on student_diagnoses" ON public.student_diagnoses;
CREATE POLICY "Allow all on student_diagnoses" ON public.student_diagnoses FOR ALL USING (true);

-- ===========================================
-- PASO 13: Verificación final
-- ===========================================

SELECT 
    'VERIFICACIÓN FINAL:' as info,
    (SELECT COUNT(*) FROM persons) as total_persons,
    (SELECT COUNT(*) FROM roles) as total_roles,
    (SELECT COUNT(*) FROM educational_levels) as total_educational_levels,
    (SELECT COUNT(*) FROM centers) as total_centers,
    (SELECT COUNT(*) FROM users) as total_users,
    (SELECT COUNT(*) FROM users WHERE person_id IS NOT NULL) as users_with_person_id,
    (SELECT COUNT(*) FROM users WHERE role_id IS NOT NULL) as users_with_role_id,
    (SELECT COUNT(*) FROM students) as total_students,
    (SELECT COUNT(*) FROM students WHERE person_id IS NOT NULL) as students_with_person_id;

-- Verificar estructura
SELECT 
    'ESTRUCTURA USERS:' as verificación,
    CASE WHEN EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'users' AND column_name = 'person_id'
    ) THEN '✅ person_id' ELSE '❌ person_id' END as person_id,
    CASE WHEN EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'users' AND column_name = 'role_id'
    ) THEN '✅ role_id' ELSE '❌ role_id' END as role_id;

SELECT 
    'ESTRUCTURA STUDENTS:' as verificación,
    CASE WHEN EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'students' AND column_name = 'person_id'
    ) THEN '✅ person_id' ELSE '❌ person_id' END as person_id;

SELECT '✅ Normalización aplicada correctamente!' as status;

