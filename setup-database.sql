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
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'PROFESOR',
    "firstName" VARCHAR(100),
    "lastName" VARCHAR(100),
    "centroId" UUID,
    active BOOLEAN DEFAULT true,
    "createdAt" TIMESTAMP DEFAULT NOW(),
    "updatedAt" TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS "Student" (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "firstName" VARCHAR(100) NOT NULL,
    "lastName" VARCHAR(100) NOT NULL,
    "birthDate" DATE,
    grade VARCHAR(50),
    "parentName" VARCHAR(100),
    "parentEmail" VARCHAR(255),
    "parentPhone" VARCHAR(20),
    school VARCHAR(100),
    "centroId" UUID,
    "createdAt" TIMESTAMP DEFAULT NOW(),
    "updatedAt" TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS "PEI" (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "studentId" UUID REFERENCES "Student"(id),
    "reportId" UUID,
    version INTEGER DEFAULT 1,
    summary TEXT,
    diagnosis TEXT,
    objectives JSONB,
    adaptations JSONB,
    strategies JSONB,
    evaluation JSONB,
    timeline JSONB,
    status VARCHAR(50) DEFAULT 'DRAFT',
    "createdById" UUID REFERENCES "User"(id),
    "createdAt" TIMESTAMP DEFAULT NOW(),
    "updatedAt" TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS "Notification" (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "userId" UUID REFERENCES "User"(id),
    type VARCHAR(100) NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    "senderId" UUID REFERENCES "User"(id),
    read BOOLEAN DEFAULT false,
    "createdAt" TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS "Report" (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "studentId" UUID REFERENCES "Student"(id),
    filename VARCHAR(255) NOT NULL,
    "originalName" VARCHAR(255) NOT NULL,
    "mimeType" VARCHAR(100) NOT NULL,
    size INTEGER NOT NULL,
    path VARCHAR(500) NOT NULL,
    "extractedText" TEXT,
    status VARCHAR(50) DEFAULT 'PENDING',
    "processedAt" TIMESTAMP,
    "createdAt" TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS "AudioFile" (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "peiId" UUID REFERENCES "PEI"(id),
    url VARCHAR(500) NOT NULL,
    duration INTEGER,
    language VARCHAR(10) DEFAULT 'es',
    voice VARCHAR(100),
    "createdAt" TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS "ActivityLog" (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    action VARCHAR(100) NOT NULL,
    entity VARCHAR(50) NOT NULL,
    "entityId" UUID NOT NULL,
    details JSONB,
    "createdAt" TIMESTAMP DEFAULT NOW()
);

-- Insertar usuario admin por defecto
INSERT INTO "User" (email, password, role, "firstName", "lastName") 
VALUES ('admin@neuroplan.com', '$2b$10$rQZ8K9vQZ8K9vQZ8K9vQZ8O', 'ADMIN', 'Admin', 'NeuroPlan')
ON CONFLICT (email) DO NOTHING;

-- Insertar usuario de prueba
INSERT INTO "User" (email, password, role, "firstName", "lastName") 
VALUES ('orientador@neuroplan.com', '$2b$10$rQZ8K9vQZ8K9vQZ8K9vQZ8O', 'ORIENTADOR', 'Orientador', 'Test')
ON CONFLICT (email) DO NOTHING;

-- Mostrar información de conexión
SELECT 'Base de datos configurada correctamente' as status;
SELECT 'Usuario: admin' as usuario;
SELECT 'Password: 1234' as password;
SELECT 'Base de datos: neuroplan' as database;
