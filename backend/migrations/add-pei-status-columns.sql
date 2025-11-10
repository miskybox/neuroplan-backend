-- =========================================
-- Migración: Agregar columnas de estado a tabla peis
-- Fecha: 07/11/2025
-- Descripción: Agrega status, approved_at, approved_by
-- =========================================

BEGIN;

-- Agregar columna status con valores válidos
ALTER TABLE peis 
  ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'DRAFT'
    CHECK (status IN ('DRAFT', 'REVIEW', 'APPROVED', 'ACTIVE', 'ARCHIVED'));

-- Agregar columna approved_at (timestamp de aprobación)
ALTER TABLE peis 
  ADD COLUMN IF NOT EXISTS approved_at TIMESTAMPTZ;

-- Agregar columna approved_by (usuario que aprobó)
ALTER TABLE peis 
  ADD COLUMN IF NOT EXISTS approved_by UUID REFERENCES users(id);

-- Crear índice para consultas por status
CREATE INDEX IF NOT EXISTS idx_peis_status ON peis(status);

-- Crear índice para consultas por aprobador
CREATE INDEX IF NOT EXISTS idx_peis_approved_by ON peis(approved_by);

COMMIT;

-- Verificación
SELECT 
  column_name, 
  data_type, 
  column_default,
  is_nullable
FROM information_schema.columns 
WHERE table_name = 'peis' 
  AND column_name IN ('status', 'approved_at', 'approved_by')
ORDER BY ordinal_position;
