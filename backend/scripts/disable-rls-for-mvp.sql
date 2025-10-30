-- ===========================================
-- DESACTIVAR ROW LEVEL SECURITY (RLS) PARA MVP
-- ===========================================
-- IMPORTANTE: Esto es solo para desarrollo/MVP
-- En producción DEBES reactivar RLS y configurar políticas adecuadas

-- Desactivar RLS en tabla users (permite inserciones desde backend)
ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;

-- Desactivar RLS en otras tablas importantes
ALTER TABLE public.students DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.peis DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.audio_files DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_logs DISABLE ROW LEVEL SECURITY;

-- Verificar que RLS está desactivado
SELECT schemaname, tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
AND tablename IN ('users', 'students', 'peis', 'reports', 'notifications', 'audio_files', 'activity_logs');

-- El resultado debería mostrar rowsecurity = false para todas las tablas

-- ===========================================
-- ALTERNATIVA: Configurar políticas RLS (mejor para producción)
-- ===========================================
-- Si prefieres mantener RLS activo con políticas, descomenta lo siguiente:

/*
-- Reactivar RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Política para permitir inserciones desde SERVICE_ROLE
CREATE POLICY "Enable insert for service role"
ON public.users
FOR INSERT
TO service_role
WITH CHECK (true);

-- Política para permitir selects desde SERVICE_ROLE
CREATE POLICY "Enable select for service role"
ON public.users
FOR SELECT
TO service_role
USING (true);

-- Política para permitir updates desde SERVICE_ROLE
CREATE POLICY "Enable update for service role"
ON public.users
FOR UPDATE
TO service_role
USING (true);

-- Repetir para otras tablas según sea necesario
*/

-- ===========================================
-- NOTAS IMPORTANTES
-- ===========================================
-- 1. Este script desactiva completamente RLS para facilitar el desarrollo
-- 2. En producción, debes usar políticas RLS específicas
-- 3. El SERVICE_ROLE_KEY del backend ya tiene permisos de admin
-- 4. Pero RLS puede bloquear incluso a service_role si las políticas no están bien configuradas
