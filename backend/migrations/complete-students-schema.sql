-- Script para completar el esquema de la tabla students
-- Añade las columnas que faltan para coincidir con el StudentDto y los tests E2E

-- 1. Añadir columna 'name' (nombre completo del estudiante)
-- Esta columna servirá como nombre completo alternativo a first_name + last_name
ALTER TABLE students
ADD COLUMN IF NOT EXISTS name VARCHAR(200);

-- 2. Añadir columna 'email' (email del estudiante)
-- Útil para estudiantes mayores o contacto directo
ALTER TABLE students
ADD COLUMN IF NOT EXISTS email VARCHAR(255);

-- 3. Añadir columna 'curso' (grado/nivel educativo)
ALTER TABLE students
ADD COLUMN IF NOT EXISTS curso VARCHAR(100);

-- 4. Añadir columna 'edad' (edad del estudiante)
ALTER TABLE students
ADD COLUMN IF NOT EXISTS edad INTEGER;

-- 5. Añadir columna 'diagnostico' (diagnóstico educativo/médico)
ALTER TABLE students
ADD COLUMN IF NOT EXISTS diagnostico TEXT;

-- 6. Añadir columna 'necesidades_especiales' (array de necesidades)
ALTER TABLE students
ADD COLUMN IF NOT EXISTS necesidades_especiales TEXT[];

-- 7. Añadir comentarios para documentación
COMMENT ON COLUMN students.name IS 'Nombre completo del estudiante (alternativo a first_name + last_name)';
COMMENT ON COLUMN students.email IS 'Email del estudiante (opcional, para contacto directo)';
COMMENT ON COLUMN students.curso IS 'Curso o grado educativo del estudiante (ej: 5º Primaria, 2º ESO)';
COMMENT ON COLUMN students.edad IS 'Edad del estudiante en años';
COMMENT ON COLUMN students.diagnostico IS 'Diagnóstico educativo, médico o psicopedagógico (ej: TDAH, Dislexia)';
COMMENT ON COLUMN students.necesidades_especiales IS 'Array de necesidades especiales o adaptaciones requeridas';

-- 8. Crear índices para mejorar consultas
CREATE INDEX IF NOT EXISTS idx_students_name ON students(name);
CREATE INDEX IF NOT EXISTS idx_students_email ON students(email);
CREATE INDEX IF NOT EXISTS idx_students_curso ON students(curso);
CREATE INDEX IF NOT EXISTS idx_students_edad ON students(edad);

-- 9. Verificar cambios
SELECT 
    column_name, 
    data_type, 
    is_nullable,
    column_default,
    col_description('students'::regclass, ordinal_position) as description
FROM information_schema.columns
WHERE table_name = 'students'
ORDER BY ordinal_position;
