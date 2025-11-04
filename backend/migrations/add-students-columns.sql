-- Script para actualizar el esquema de la tabla students en Supabase
-- Añade las columnas que faltan para los tests E2E

-- 1. Añadir columna 'curso' (grado/nivel educativo)
ALTER TABLE students
ADD COLUMN IF NOT EXISTS curso VARCHAR(100);

-- 2. Añadir columna 'edad' (edad del estudiante)
ALTER TABLE students
ADD COLUMN IF NOT EXISTS edad INTEGER;

-- 3. Añadir columna 'diagnostico' (diagnóstico educativo/médico)
ALTER TABLE students
ADD COLUMN IF NOT EXISTS diagnostico TEXT;

-- 4. Añadir columna 'necesidadesEspeciales' (array de necesidades)
ALTER TABLE students
ADD COLUMN IF NOT EXISTS necesidades_especiales TEXT[];

-- 5. Añadir comentarios para documentación
COMMENT ON COLUMN students.curso IS 'Curso o grado educativo del estudiante (ej: 5º Primaria, 2º ESO)';
COMMENT ON COLUMN students.edad IS 'Edad del estudiante en años';
COMMENT ON COLUMN students.diagnostico IS 'Diagnóstico educativo, médico o psicopedagógico (ej: TDAH, Dislexia)';
COMMENT ON COLUMN students.necesidades_especiales IS 'Array de necesidades especiales o adaptaciones requeridas';

-- 6. Crear índices para mejorar consultas
CREATE INDEX IF NOT EXISTS idx_students_curso ON students(curso);
CREATE INDEX IF NOT EXISTS idx_students_edad ON students(edad);

-- 7. Verificar cambios
SELECT 
    column_name, 
    data_type, 
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_name = 'students'
ORDER BY ordinal_position;
