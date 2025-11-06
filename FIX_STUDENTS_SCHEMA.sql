-- ==========================================
-- SCRIPT: FIX_STUDENTS_SCHEMA.sql
-- Objetivo: Remover columnas first_name y last_name de students
--          (ya están en persons, solo person_id debe existir)
-- ==========================================

-- Remover columnas first_name y last_name si existen
ALTER TABLE IF EXISTS public.students
DROP COLUMN IF EXISTS first_name CASCADE;

ALTER TABLE IF EXISTS public.students
DROP COLUMN IF EXISTS last_name CASCADE;

-- Remover otras columnas obsoletas del esquema antiguo
ALTER TABLE IF EXISTS public.students
DROP COLUMN IF EXISTS birth_date CASCADE;

ALTER TABLE IF EXISTS public.students
DROP COLUMN IF EXISTS grade CASCADE;

ALTER TABLE IF EXISTS public.students
DROP COLUMN IF EXISTS parent_name CASCADE;

ALTER TABLE IF EXISTS public.students
DROP COLUMN IF EXISTS parent_email CASCADE;

ALTER TABLE IF EXISTS public.students
DROP COLUMN IF EXISTS parent_phone CASCADE;

ALTER TABLE IF EXISTS public.students
DROP COLUMN IF EXISTS school CASCADE;

-- Verificar que las columnas esenciales existan
-- person_id, center_id, created_by, created_at, updated_at

-- Mensaje final
SELECT '✅ SCHEMA STUDENTS NORMALIZADO' as resultado;
SELECT 'Columnas removidas: first_name, last_name, birth_date, grade, parent_name, parent_email, parent_phone, school' as detalle;
SELECT 'Columnas requeridas: id, person_id, center_id, created_by, created_at, updated_at' as schema_final;
