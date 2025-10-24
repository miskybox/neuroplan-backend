-- ===========================================
-- NEUROPLAN DATABASE SETUP
-- ===========================================

-- Crear base de datos si no existe
CREATE DATABASE neuroplan;

-- Conectar a la base de datos neuroplan
\c neuroplan;

-- Crear usuario admin si no existe
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'admin') THEN
        CREATE ROLE admin WITH LOGIN PASSWORD '1234';
    END IF;
END
$$;

-- Dar permisos al usuario admin
GRANT ALL PRIVILEGES ON DATABASE neuroplan TO admin;
GRANT ALL PRIVILEGES ON SCHEMA public TO admin;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO admin;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO admin;

-- Crear tablas básicas
CREATE TABLE IF NOT EXISTS "User" (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'PROFESOR',
    nombre VARCHAR(100),
    apellidos VARCHAR(100),
    activo BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS "Student" (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    apellidos VARCHAR(100) NOT NULL,
    fecha_nacimiento DATE,
    curso VARCHAR(50),
    centro_id INTEGER,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS "PEI" (
    id SERIAL PRIMARY KEY,
    student_id INTEGER REFERENCES "Student"(id),
    version INTEGER DEFAULT 1,
    summary TEXT,
    diagnosis TEXT,
    objectives JSONB,
    adaptations JSONB,
    status VARCHAR(50) DEFAULT 'DRAFT',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS "Notification" (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES "User"(id),
    type VARCHAR(100) NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    sender_id INTEGER REFERENCES "User"(id),
    read BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS "AudioFile" (
    id SERIAL PRIMARY KEY,
    pei_id INTEGER REFERENCES "PEI"(id),
    url VARCHAR(500) NOT NULL,
    duration INTEGER,
    language VARCHAR(10) DEFAULT 'es',
    voice VARCHAR(100),
    created_at TIMESTAMP DEFAULT NOW()
);

-- Insertar usuario admin por defecto
INSERT INTO "User" (email, password, role, nombre, apellidos) 
VALUES ('admin@neuroplan.com', '$2b$10$rQZ8K9vQZ8K9vQZ8K9vQZ8O', 'ADMIN', 'Admin', 'NeuroPlan')
ON CONFLICT (email) DO NOTHING;

-- Insertar usuario de prueba
INSERT INTO "User" (email, password, role, nombre, apellidos) 
VALUES ('orientador@neuroplan.com', '$2b$10$rQZ8K9vQZ8K9vQZ8K9vQZ8O', 'ORIENTADOR', 'Orientador', 'Test')
ON CONFLICT (email) DO NOTHING;

-- Mostrar información de conexión
SELECT 'Base de datos configurada correctamente' as status;
SELECT 'Usuario: admin' as usuario;
SELECT 'Password: 1234' as password;
SELECT 'Base de datos: neuroplan' as database;
