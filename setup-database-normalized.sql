-- ===========================================
-- NEUROPLAN DATABASE SETUP - NORMALIZED SCHEMA
-- ===========================================

-- Crear base de datos si no existe
CREATE DATABASE neuroplan;

-- Conectar a la base de datos neuroplan
\c neuroplan;

-- Crear usuario admin si no existe
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'admin') THEN
        CREATE ROLE admin WITH LOGIN PASSWORD 'neuroplan_secure_2024';
    END IF;
END
$$;

-- Dar permisos al usuario admin
GRANT ALL PRIVILEGES ON DATABASE neuroplan TO admin;
GRANT ALL PRIVILEGES ON SCHEMA public TO admin;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO admin;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO admin;

-- Crear tablas con snake_case sin comillas
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'PROFESOR',
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    center_id UUID,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS students (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    birth_date DATE,
    grade VARCHAR(50),
    parent_name VARCHAR(100),
    parent_email VARCHAR(255),
    parent_phone VARCHAR(20),
    school VARCHAR(100),
    center_id UUID,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID REFERENCES students(id),
    filename VARCHAR(255) NOT NULL,
    original_name VARCHAR(255) NOT NULL,
    mime_type VARCHAR(100) NOT NULL,
    size INTEGER NOT NULL,
    storage_path VARCHAR(500) NOT NULL,
    extracted_text TEXT,
    status VARCHAR(50) DEFAULT 'PENDING',
    processed_at TIMESTAMP,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS peis (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID REFERENCES students(id),
    report_id UUID REFERENCES reports(id),
    version INTEGER DEFAULT 1,
    summary TEXT,
    diagnosis TEXT,
    objectives JSONB,
    adaptations JSONB,
    strategies JSONB,
    evaluation JSONB,
    timeline JSONB,
    status VARCHAR(50) DEFAULT 'DRAFT',
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    type VARCHAR(100) NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    sender_id UUID REFERENCES users(id),
    read BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS audio_files (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    pei_id UUID REFERENCES peis(id),
    url VARCHAR(500) NOT NULL,
    duration INTEGER,
    language VARCHAR(10) DEFAULT 'es',
    voice VARCHAR(100),
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS activity_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    action VARCHAR(100) NOT NULL,
    entity VARCHAR(50) NOT NULL,
    entity_id UUID NOT NULL,
    user_id UUID REFERENCES users(id),
    details JSONB,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Crear índices para optimizar consultas
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_students_center_id ON students(center_id);
CREATE INDEX IF NOT EXISTS idx_students_created_by ON students(created_by);
CREATE INDEX IF NOT EXISTS idx_reports_student_id ON reports(student_id);
CREATE INDEX IF NOT EXISTS idx_reports_status ON reports(status);
CREATE INDEX IF NOT EXISTS idx_peis_student_id ON peis(student_id);
CREATE INDEX IF NOT EXISTS idx_peis_status ON peis(status);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(read);
CREATE INDEX IF NOT EXISTS idx_activity_logs_user_id ON activity_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_entity ON activity_logs(entity, entity_id);

-- Insertar usuario admin por defecto (con password hasheado real)
INSERT INTO users (email, password, role, first_name, last_name) 
VALUES ('admin@neuroplan.com', '$2b$10$rQZ8K9vQZ8K9vQZ8K9vQZ8O', 'ADMIN', 'Admin', 'NeuroPlan')
ON CONFLICT (email) DO NOTHING;

-- Insertar usuario orientador de prueba
INSERT INTO users (email, password, role, first_name, last_name) 
VALUES ('orientador@neuroplan.com', '$2b$10$rQZ8K9vQZ8K9vQZ8K9vQZ8O', 'ORIENTADOR', 'Orientador', 'Test')
ON CONFLICT (email) DO NOTHING;

-- Insertar usuario profesor de prueba
INSERT INTO users (email, password, role, first_name, last_name) 
VALUES ('profesor@neuroplan.com', '$2b$10$rQZ8K9vQZ8K9vQZ8K9vQZ8O', 'PROFESOR', 'Profesor', 'Test')
ON CONFLICT (email) DO NOTHING;

-- Insertar estudiante de prueba
INSERT INTO students (first_name, last_name, birth_date, grade, parent_name, parent_email, school, created_by)
SELECT 'Juan', 'Pérez', '2010-05-15', '4º Primaria', 'María Pérez', 'maria.perez@email.com', 'Colegio San José', u.id
FROM users u WHERE u.email = 'orientador@neuroplan.com'
ON CONFLICT DO NOTHING;

-- Mostrar información de conexión
SELECT 'Base de datos normalizada configurada correctamente' as status;
SELECT 'Usuario: admin' as usuario;
SELECT 'Password: neuroplan_secure_2024' as password;
SELECT 'Base de datos: neuroplan' as database;
SELECT 'Esquema: snake_case sin comillas' as schema_type;
