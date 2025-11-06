# Migración al Esquema Normalizado

Este documento explica cómo migrar la base de datos de Supabase al esquema normalizado según el diagrama relacional.

## 📋 Diagrama Relacional

El nuevo esquema sigue esta estructura:

```
persons (id, first_name, last_name)
  ↓
users (id, email, person_id, role_id, center_id)
  ↓
students (id, person_id, center_id, created_by)
  ↓
student_diagnoses (id, student_id, diagnosis_id)
  ↓
peis (id, student_id, created_by, title, summary, diagnosis)
  ↓
activity_logs (id, user_id, entity, entity_id, action, details)
```

### Tablas de Referencia:

- **roles** (id, name)
- **educational_levels** (id, name)
- **centers** (id, name, address, educational_level_id)
- **diagnoses** (id, description)

## 🚀 Opciones de Migración

### Opción 1: Migración con Datos Existentes

Si ya tienes datos en la base de datos y quieres migrarlos:

1. Abre tu proyecto en [Supabase Dashboard](https://app.supabase.com)
2. Ve a **SQL Editor** en el menú lateral
3. Abre el archivo `backend/migrations/normalize-schema.sql`
4. Copia y pega todo el contenido en el SQL Editor
5. Haz clic en **Run** o presiona `Ctrl+Enter`
6. Verifica que la ejecución fue exitosa

**Este script:**

- Crea las nuevas tablas normalizadas
- Migra los datos existentes a la nueva estructura
- Preserva las relaciones entre datos
- Renombra las tablas antiguas como backup (`users_old`, `students_old`, etc.)

### Opción 2: Esquema Limpio (Sin Datos)

Si prefieres empezar desde cero o crear el esquema en una base de datos nueva:

1. Abre tu proyecto en [Supabase Dashboard](https://app.supabase.com)
2. Ve a **SQL Editor** en el menú lateral
3. Abre el archivo `backend/supabase-schema-normalized.sql`
4. Copia y pega todo el contenido en el SQL Editor
5. Haz clic en **Run** o presiona `Ctrl+Enter`
6. Verifica que la ejecución fue exitosa

**Este script:**

- Crea todas las tablas según el diagrama
- Inserta datos iniciales (roles y niveles educativos)
- No incluye migración de datos existentes

## ✅ Verificación

Después de ejecutar cualquiera de los scripts, verifica que todo se creó correctamente:

```sql
-- Verificar tablas
SELECT
    table_name,
    table_type
FROM information_schema.tables
WHERE table_schema = 'public'
AND table_name IN (
    'persons',
    'roles',
    'educational_levels',
    'centers',
    'users',
    'students',
    'diagnoses',
    'student_diagnoses',
    'peis',
    'activity_logs'
)
ORDER BY table_name;

-- Verificar relaciones
SELECT
    tc.table_name,
    kcu.column_name,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
    ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.constraint_column_usage AS ccu
    ON ccu.constraint_name = tc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY'
AND tc.table_schema = 'public'
ORDER BY tc.table_name, kcu.column_name;
```

## 📊 Cambios Principales

### Antes (Esquema Antiguo):

- `users` tenía `first_name`, `last_name`, `role` directamente
- `students` tenía `first_name`, `last_name` directamente
- `peis` tenía muchos campos adicionales (objectives, adaptations, etc.)

### Después (Esquema Normalizado):

- `persons` contiene `first_name` y `last_name`
- `users` referencia `persons`, `roles`, y `centers`
- `students` referencia `persons` y `centers`
- `diagnoses` es una tabla separada con relación many-to-many a través de `student_diagnoses`
- `peis` solo tiene campos básicos: `title`, `summary`, `diagnosis`

## 🔄 Rollback (Si es Necesario)

Si necesitas volver al esquema anterior:

1. Las tablas antiguas están guardadas como backup:
   - `users_old`
   - `students_old`
   - `peis_old`
   - `activity_logs_old`

2. Puedes restaurarlas renombrándolas:

```sql
ALTER TABLE public.users_old RENAME TO users;
ALTER TABLE public.students_old RENAME TO students;
ALTER TABLE public.peis_old RENAME TO peis;
ALTER TABLE public.activity_logs_old RENAME TO activity_logs;
```

**Nota:** Esto eliminará las nuevas tablas normalizadas. Úsalo solo si necesitas revertir completamente.

## 📝 Notas Importantes

1. **Row Level Security (RLS)**: Todas las tablas tienen RLS habilitado. Las políticas están configuradas para permitir acceso básico, pero puedes ajustarlas según tus necesidades.

2. **Triggers**: Se han creado triggers para actualizar automáticamente `updated_at` en las tablas relevantes.

3. **Índices**: Se han creado índices en las columnas más consultadas para mejorar el rendimiento.

4. **Datos Iniciales**: El script limpio inserta roles y niveles educativos básicos. Puedes agregar más según tus necesidades.

## 🆘 Problemas Comunes

### Error: "relation already exists"

- Las tablas ya existen. Puedes usar `DROP TABLE IF EXISTS` antes de crear, pero esto eliminará los datos.

### Error: "foreign key constraint fails"

- Verifica que los datos existentes tengan referencias válidas antes de migrar.

### Error: "policy already exists"

- Las políticas RLS ya existen. El script usa `CREATE POLICY IF NOT EXISTS` en algunos lugares, pero si tienes problemas, elimina las políticas antiguas primero.

## 📞 Soporte

Si encuentras problemas durante la migración, verifica:

1. Que tienes permisos de administrador en Supabase
2. Que no hay restricciones de foreign key que fallen
3. Que los datos existentes son válidos
