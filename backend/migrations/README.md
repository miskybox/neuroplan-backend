# Migraciones de Base de Datos

## 📋 Migraciones Disponibles

### 1. `add-students-columns.sql`

**Fecha**: 2025-11-03  
**Descripción**: Añade columnas adicionales a la tabla `students` para soportar tests E2E y funcionalidades completas.

**Columnas añadidas**:

- `curso` (VARCHAR): Curso o grado educativo (ej: "5º Primaria", "2º ESO")
- `edad` (INTEGER): Edad del estudiante en años
- `diagnostico` (TEXT): Diagnóstico educativo/médico (ej: "TDAH", "Dislexia")
- `necesidades_especiales` (TEXT[]): Array de necesidades especiales

**Índices creados**:

- `idx_students_curso`: Índice en columna `curso`
- `idx_students_edad`: Índice en columna `edad`

---

## 🚀 Cómo Aplicar Migraciones

### Opción 1: Dashboard de Supabase (Recomendado)

1. Abre tu proyecto en [Supabase Dashboard](https://app.supabase.com)
2. Ve a **SQL Editor** en el menú lateral
3. Crea una nueva query
4. Copia y pega el contenido de `add-students-columns.sql`
5. Haz clic en **Run** o presiona `Ctrl+Enter`
6. Verifica que la ejecución fue exitosa (sin errores)

### Opción 2: Script Windows (.bat)

```cmd
cd backend\migrations
set SUPABASE_URL=https://your-project.supabase.co
set SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
apply-migration.bat add-students-columns.sql
```

El script mostrará el contenido del archivo SQL para que lo copies al Dashboard.

### Opción 3: Script Bash (Linux/Mac)

```bash
cd backend/migrations
export SUPABASE_URL='https://your-project.supabase.co'
export SUPABASE_SERVICE_ROLE_KEY='your-service-role-key'
./apply-migration.sh add-students-columns.sql
```

### Opción 4: Supabase CLI

```bash
# Instalar Supabase CLI si no lo tienes
npm install -g supabase

# Inicializar proyecto local (primera vez)
supabase init

# Aplicar migración
supabase db push
```

---

## ✅ Verificar Migración

Después de aplicar la migración, verifica que las columnas existen:

```sql
SELECT
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_name = 'students'
ORDER BY ordinal_position;
```

Deberías ver las nuevas columnas:

- `curso` (character varying)
- `edad` (integer)
- `diagnostico` (text)
- `necesidades_especiales` (ARRAY)

---

## 🔄 Rollback (Deshacer Migración)

Si necesitas revertir la migración:

```sql
-- Eliminar columnas añadidas
ALTER TABLE students DROP COLUMN IF EXISTS curso;
ALTER TABLE students DROP COLUMN IF EXISTS edad;
ALTER TABLE students DROP COLUMN IF EXISTS diagnostico;
ALTER TABLE students DROP COLUMN IF EXISTS necesidades_especiales;

-- Eliminar índices
DROP INDEX IF EXISTS idx_students_curso;
DROP INDEX IF EXISTS idx_students_edad;
```

---

## 📝 Notas Importantes

1. **Backup**: Siempre haz backup de tu base de datos antes de aplicar migraciones en producción
2. **Testing**: Prueba las migraciones primero en un ambiente de desarrollo/staging
3. **Compatibilidad**: Estas migraciones usan `IF NOT EXISTS` para ser idempotentes (puedes ejecutarlas múltiples veces sin error)
4. **RLS**: Las políticas de Row Level Security (RLS) existentes se mantienen intactas

---

## 🐛 Troubleshooting

### Error: "permission denied for table students"

- Asegúrate de usar la `service_role_key`, no la `anon_key`
- Verifica que tu usuario tiene permisos de ALTER TABLE

### Error: "column already exists"

- La migración usa `IF NOT EXISTS`, así que este error no debería ocurrir
- Si ocurre, verifica manualmente qué columnas ya existen

### Error: "relation students does not exist"

- La tabla `students` no existe en tu base de datos
- Ejecuta primero el script de creación de la tabla: `setup-database-normalized.sql`

---

## 📚 Recursos

- [Supabase SQL Editor](https://supabase.com/docs/guides/database/overview#the-sql-editor)
- [Supabase Migrations](https://supabase.com/docs/guides/cli/local-development#database-migrations)
- [PostgreSQL ALTER TABLE](https://www.postgresql.org/docs/current/sql-altertable.html)
