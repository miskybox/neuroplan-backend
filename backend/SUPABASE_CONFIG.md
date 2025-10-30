# Configuración de Supabase para MVP

## ⚠️ CONFIGURACIÓN CRÍTICA: Desactivar Row-Level Security (RLS)

**PROBLEMA ENCONTRADO**: Si intentas registrar un usuario y obtienes el error:
```
new row violates row-level security policy for table "users"
```

Esto significa que RLS está bloqueando las inserciones. Para solucionarlo:

### Ejecutar en SQL Editor de Supabase:

1. Ve a tu proyecto en https://supabase.com/dashboard
2. Navega a **SQL Editor**
3. Copia y pega el contenido del archivo `backend/scripts/disable-rls-for-mvp.sql`
4. Ejecuta el script

O ejecuta directamente estos comandos:

```sql
-- Desactivar RLS en tablas principales (solo para MVP/desarrollo)
ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.students DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.peis DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.audio_files DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_logs DISABLE ROW LEVEL SECURITY;
```

**IMPORTANTE**: Esto es solo para desarrollo. En producción debes configurar políticas RLS adecuadas.

---

## Desactivar verificación de email

Para permitir el registro sin confirmación de email (modo desarrollo/MVP):

### Opción 1: Desde el Dashboard de Supabase

1. Ve a tu proyecto en https://supabase.com/dashboard
2. Navega a **Authentication** > **Providers** > **Email**
3. Desactiva la opción **"Confirm email"**
4. Guarda los cambios

### Opción 2: Mediante SQL

Ejecuta el siguiente comando en el SQL Editor de Supabase:

```sql
-- Actualizar la configuración de auth para no requerir confirmación de email
UPDATE auth.config
SET
  enable_signup = true,
  enable_confirm_email = false
WHERE TRUE;
```

### Opción 3: Variables de entorno (si usas local)

Si estás usando Supabase local con Docker:

```bash
# En tu archivo .env local de Supabase
GOTRUE_MAILER_AUTOCONFIRM=true
```

## Valores por defecto configurados

El sistema ahora usa estos valores por defecto para nuevos registros:

- **Rol por defecto**: `PROFESOR`
- **Centro por defecto**: `11111111-1111-1111-1111-111111111111` (UUID demo)

### Roles disponibles

- `ADMIN` - Administrador del sistema
- `DIRECTOR_CENTRO` - Director de centro educativo
- `ORIENTADOR` - Orientador educativo
- `PROFESOR` - Profesor (por defecto)
- `ESTUDIANTE_FAMILIA` - Estudiante/Familia

## Verificación

Para verificar que la configuración funciona:

1. Intenta registrar un usuario con un email falso (ej: `test@test.com`)
2. Si el registro es exitoso sin pedir confirmación, la configuración está correcta
3. Deberías poder hacer login inmediatamente después del registro

## Notas de producción

⚠️ **IMPORTANTE**: Antes de pasar a producción:

1. ✅ Reactivar la verificación de email
2. ✅ Configurar templates de email personalizados
3. ✅ Implementar password reset flow
4. ✅ Añadir rate limiting para prevenir spam
5. ✅ Configurar proveedores OAuth (Google, Microsoft, etc.)
6. ✅ Implementar refresh tokens
7. ✅ Activar Row Level Security (RLS) en todas las tablas
