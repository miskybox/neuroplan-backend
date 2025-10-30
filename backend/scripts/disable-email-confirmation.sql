-- Script para desactivar la confirmación de email en Supabase
-- Ejecutar este script en el SQL Editor de Supabase Dashboard

-- IMPORTANTE: Este script es solo para desarrollo/MVP
-- En producción, debes mantener la confirmación de email activada

-- Nota: La configuración de email confirmation se maneja principalmente
-- desde el Dashboard de Supabase en Authentication > Providers > Email
-- Este script es de referencia para entender la estructura

-- Para verificar la configuración actual de auth:
SELECT * FROM auth.config;

-- Alternativamente, puedes verificar usuarios existentes:
SELECT
  id,
  email,
  email_confirmed_at,
  created_at,
  confirmation_sent_at
FROM auth.users
ORDER BY created_at DESC
LIMIT 10;

-- INSTRUCCIONES PARA DESACTIVAR CONFIRMACIÓN:
-- 1. Ve a https://supabase.com/dashboard
-- 2. Selecciona tu proyecto
-- 3. Navega a: Authentication > Providers > Email
-- 4. Desactiva "Confirm email"
-- 5. Guarda cambios

-- Si necesitas confirmar manualmente un usuario existente:
-- UPDATE auth.users
-- SET email_confirmed_at = NOW()
-- WHERE email = 'tu-email@example.com';
