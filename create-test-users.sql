-- Insertar usuarios de prueba con contraseñas hasheadas
INSERT INTO users (email, password, role, first_name, last_name) 
VALUES 
  ('admin@neuroplan.com', '$2b$10$rQZ8K9vQZ8K9vQZ8K9vQZ8O', 'ADMIN', 'Admin', 'NeuroPlan'),
  ('orientador@neuroplan.com', '$2b$10$rQZ8K9vQZ8K9vQZ8K9vQZ8O', 'ORIENTADOR', 'Orientador', 'Test'),
  ('profesor@neuroplan.com', '$2b$10$rQZ8K9vQZ8K9vQZ8K9vQZ8O', 'PROFESOR', 'Profesor', 'Test')
ON CONFLICT (email) DO NOTHING;

-- Insertar estudiante de prueba
INSERT INTO students (first_name, last_name, birth_date, grade, parent_name, parent_email, school, created_by)
SELECT 'Juan', 'Pérez', '2010-05-15', '4º Primaria', 'María Pérez', 'maria.perez@email.com', 'Colegio San José', u.id
FROM users u WHERE u.email = 'orientador@neuroplan.com'
ON CONFLICT DO NOTHING;
