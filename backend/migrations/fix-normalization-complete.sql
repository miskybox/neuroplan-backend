-- ===========================================
-- CORRECCIÓN Y COMPLETAR NORMALIZACIÓN
-- ===========================================
-- Este script corrige los errores detectados y completa la normalización
-- Ejecutar en Supabase → Database → SQL Editor
-- ===========================================

-- Habilitar extensiones
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ===========================================
-- PASO 1: Asegurar que tablas base existen y tienen datos
-- ===========================================

-- Insertar roles si no existen
INSERT INTO public.roles (id, name)
VALUES 
    (uuid_generate_v4(), 'ADMIN'),
    (uuid_generate_v4(), 'DIRECTOR_CENTRO'),
    (uuid_generate_v4(), 'ORIENTADOR'),
    (uuid_generate_v4(), 'PROFESOR'),
    (uuid_generate_v4(), 'ESTUDIANTE_FAMILIA')
ON CONFLICT (name) DO NOTHING;

-- Insertar niveles educativos si no existen
INSERT INTO public.educational_levels (id, name)
VALUES 
    (uuid_generate_v4(), 'Infantil'),
    (uuid_generate_v4(), 'Primaria'),
    (uuid_generate_v4(), 'Secundaria'),
    (uuid_generate_v4(), 'Bachillerato'),
    (uuid_generate_v4(), 'FP')
ON CONFLICT (name) DO NOTHING;

-- ===========================================
-- PASO 2: Migrar personas desde usuarios
-- ===========================================

-- Crear personas desde usuarios existentes
INSERT INTO public.persons (id, first_name, last_name)
SELECT 
    u.id,
    u.first_name,
    u.last_name
FROM public.users u
WHERE (u.first_name IS NOT NULL OR u.last_name IS NOT NULL)
  AND NOT EXISTS (SELECT 1 FROM public.persons p WHERE p.id = u.id)
ON CONFLICT (id) DO NOTHING;

-- Crear personas desde estudiantes existentes
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
-- PASO 3: Agregar columnas faltantes a users
-- ===========================================

-- Agregar person_id a users si no existe
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

-- Agregar role_id a users si no existe
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
-- PASO 4: Agregar columnas faltantes a students
-- ===========================================

-- Agregar person_id a students si no existe
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
-- PASO 5: Crear centros desde center_id existentes
-- ===========================================

-- Crear centros desde users
INSERT INTO public.centers (id, name, address)
SELECT DISTINCT
    u.center_id,
    'Centro ' || SUBSTRING(u.center_id::text, 1, 8),
    NULL
FROM public.users u
WHERE u.center_id IS NOT NULL
  AND NOT EXISTS (SELECT 1 FROM public.centers c WHERE c.id = u.center_id)
ON CONFLICT (id) DO NOTHING;

-- Crear centros desde students
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
-- PASO 6: Migrar diagnósticos desde students.diagnostico
-- ===========================================

-- Migrar diagnósticos si existe la columna diagnostico
DO $$
DECLARE
    diag_record RECORD;
    diag_id UUID;
    student_id_val UUID;
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
            -- Crear o obtener diagnóstico
            INSERT INTO public.diagnoses (description)
            VALUES (diag_record.diagnostico)
            ON CONFLICT DO NOTHING
            RETURNING id INTO diag_id;
            
            IF diag_id IS NULL THEN
                SELECT id INTO diag_id FROM public.diagnoses WHERE description = diag_record.diagnostico LIMIT 1;
            END IF;
            
            -- Crear relación en student_diagnoses
            IF diag_id IS NOT NULL THEN
                INSERT INTO public.student_diagnoses (student_id, diagnosis_id)
                VALUES (diag_record.id, diag_id)
                ON CONFLICT DO NOTHING;
            END IF;
        END LOOP;
    END IF;
END $$;

-- ===========================================
-- PASO 7: Crear índices si no existen
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
-- PASO 8: Verificación
-- ===========================================

-- Verificar estructura de users
SELECT 
    'ESTRUCTURA USERS:' as verificación,
    CASE WHEN EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'users' AND column_name = 'person_id'
    ) THEN '✅ person_id existe' ELSE '❌ person_id NO existe' END as person_id,
    CASE WHEN EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'users' AND column_name = 'role_id'
    ) THEN '✅ role_id existe' ELSE '❌ role_id NO existe' END as role_id,
    CASE WHEN EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'users' AND column_name = 'first_name'
    ) THEN '⚠️  first_name todavía existe' ELSE '✅ first_name eliminado' END as first_name_status;

-- Verificar estructura de students
SELECT 
    'ESTRUCTURA STUDENTS:' as verificación,
    CASE WHEN EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'students' AND column_name = 'person_id'
    ) THEN '✅ person_id existe' ELSE '❌ person_id NO existe' END as person_id,
    CASE WHEN EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'students' AND column_name = 'first_name'
    ) THEN '⚠️  first_name todavía existe' ELSE '✅ first_name eliminado' END as first_name_status;

-- Contar registros
SELECT 
    'CONTEO DE REGISTROS:' as info,
    (SELECT COUNT(*) FROM persons) as persons,
    (SELECT COUNT(*) FROM roles) as roles,
    (SELECT COUNT(*) FROM educational_levels) as educational_levels,
    (SELECT COUNT(*) FROM centers) as centers,
    (SELECT COUNT(*) FROM users) as users,
    (SELECT COUNT(*) FROM students) as students,
    (SELECT COUNT(*) FROM diagnoses) as diagnoses,
    (SELECT COUNT(*) FROM student_diagnoses) as student_diagnoses,
    (SELECT COUNT(*) FROM peis) as peis,
    (SELECT COUNT(*) FROM activity_logs) as activity_logs;

-- Verificar relaciones (foreign keys)
SELECT 
    'RELACIONES (FOREIGN KEYS):' as info,
    COUNT(*) as total_foreign_keys
FROM information_schema.table_constraints 
WHERE constraint_type = 'FOREIGN KEY' 
AND table_schema = 'public'
AND table_name IN ('users', 'students', 'centers', 'student_diagnoses', 'peis', 'activity_logs');

SELECT '✅ Normalización completada!' as status;

