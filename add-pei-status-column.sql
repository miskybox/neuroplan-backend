-- ============================================
-- AGREGAR COLUMNA STATUS A TABLA PEIS
-- ============================================
-- Ejecutar en Supabase SQL Editor

-- 1. Agregar columna status con tipo enum
DO $$
BEGIN
  -- Crear tipo enum si no existe
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'pei_status') THEN
    CREATE TYPE pei_status AS ENUM (
      'DRAFT',
      'REVIEW',
      'APPROVED',
      'ACTIVE',
      'ARCHIVED'
    );
  END IF;
END $$;

-- 2. Agregar columna a tabla peis
ALTER TABLE public.peis
ADD COLUMN IF NOT EXISTS status pei_status DEFAULT 'DRAFT';

-- 3. Agregar índice para consultas por status
CREATE INDEX IF NOT EXISTS idx_peis_status
ON public.peis(status);

-- 4. Agregar columna de fecha de aprobación (opcional pero útil)
ALTER TABLE public.peis
ADD COLUMN IF NOT EXISTS approved_at TIMESTAMP WITH TIME ZONE;

-- 5. Agregar columna de usuario que aprueba (opcional)
ALTER TABLE public.peis
ADD COLUMN IF NOT EXISTS approved_by UUID REFERENCES public.users(id);

-- 6. Actualizar PEIs existentes a DRAFT si están NULL
UPDATE public.peis
SET status = 'DRAFT'
WHERE status IS NULL;

-- 7. Verificar resultado
SELECT
  COUNT(*) as total_peis,
  status,
  COUNT(*) * 100.0 / SUM(COUNT(*)) OVER() as percentage
FROM public.peis
GROUP BY status
ORDER BY status;

-- ============================================
-- RESULTADO ESPERADO:
-- Columna 'status' agregada exitosamente
-- Todos los PEIs existentes tienen status 'DRAFT'
-- ============================================
