# ⛔ IMPLEMENTAR PEI STATUS - GUÍA RÁPIDA

**Fecha:** 6 de noviembre de 2025  
**Tarea:** Agregar persistencia real de status en PEIs  
**Tiempo estimado:** 15-30 minutos

---

## 📊 ESTADO ACTUAL

### ✅ Código Backend - YA IMPLEMENTADO

El código del servicio y controller **YA está listo**:

- **Controller:** `backend/src/modules/peis/peis.controller.ts:290`

  - Endpoint `PATCH /peis/:id/status` implementado
  - Validación de status válidos
  - Manejo de errores correcto

- **Service:** `backend/src/modules/peis/peis.service.ts:122`
  - Método `updatePEI()` acepta `status` y `approved_by`
  - Actualiza automáticamente `approved_at` cuando status = 'APPROVED'
  - Persiste cambios en Supabase

### ⛔ Problema: Columnas Faltantes en BD

La tabla `peis` en Supabase **NO tiene las columnas**:

- `status` (enum: DRAFT, REVIEW, APPROVED, ACTIVE, ARCHIVED)
- `approved_at` (timestamp)
- `approved_by` (UUID ref a users)

**Resultado:** Los updates fallan silenciosamente o dan error de columna inexistente.

---

## 🚀 SOLUCIÓN: APLICAR MIGRATION

### Paso 1: Verificar Schema Actual (5 min)

```sql
-- Ejecutar en Supabase SQL Editor
SELECT
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'peis'
ORDER BY ordinal_position;
```

**Esperado:** NO debe aparecer columna `status`

---

### Paso 2: Aplicar Migration de Status (5 min)

Ya existe el archivo preparado: `add-pei-status-column.sql`

**Ejecutar en Supabase Dashboard > SQL Editor:**

```sql
-- ============================================
-- AGREGAR COLUMNA STATUS A TABLA PEIS
-- ============================================

-- 1. Crear tipo enum si no existe
DO $$
BEGIN
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

-- 4. Agregar columna de fecha de aprobación
ALTER TABLE public.peis
ADD COLUMN IF NOT EXISTS approved_at TIMESTAMP WITH TIME ZONE;

-- 5. Agregar columna de usuario que aprueba
ALTER TABLE public.peis
ADD COLUMN IF NOT EXISTS approved_by UUID REFERENCES public.users(id);

-- 6. Actualizar PEIs existentes a DRAFT
UPDATE public.peis
SET status = 'DRAFT'
WHERE status IS NULL;
```

**Resultado esperado:**

```
✅ Type 'pei_status' created
✅ Column 'status' added to peis
✅ Index 'idx_peis_status' created
✅ Column 'approved_at' added
✅ Column 'approved_by' added
✅ X rows updated (PEIs existentes ahora tienen status='DRAFT')
```

---

### Paso 3: Verificar Migration Aplicada (2 min)

```sql
-- Verificar columnas agregadas
SELECT
    column_name,
    data_type
FROM information_schema.columns
WHERE table_name = 'peis'
  AND column_name IN ('status', 'approved_at', 'approved_by');

-- Verificar datos actualizados
SELECT
    id,
    title,
    status,
    approved_at,
    approved_by,
    created_at
FROM public.peis
LIMIT 5;
```

**Esperado:**

```
column_name  | data_type
-------------+--------------------------
status       | USER-DEFINED (pei_status)
approved_at  | timestamp with time zone
approved_by  | uuid

id         | title           | status | approved_at | approved_by
-----------|-----------------|--------|-------------|------------
uuid-123   | PEI Juan Pérez  | DRAFT  | NULL        | NULL
uuid-456   | PEI María López | DRAFT  | NULL        | NULL
```

---

### Paso 4: Probar Endpoint (5 min)

#### 4.1 Arrancar backend

```bash
cd backend
npm run start:dev
```

#### 4.2 Generar token de prueba

```bash
# Login en Supabase con usuario de test
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@neuroplan.com","password":"Test123!"}'

# Copiar el token de la respuesta
```

#### 4.3 Actualizar status de un PEI

```bash
# Obtener ID de un PEI existente
curl http://localhost:3001/api/peis \
  -H "Authorization: Bearer <TU_TOKEN>"

# Actualizar status a REVIEW
curl -X PATCH http://localhost:3001/api/peis/<PEI_ID>/status \
  -H "Authorization: Bearer <TU_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"status":"REVIEW"}'

# Verificar cambio persistido
curl http://localhost:3001/api/peis/<PEI_ID> \
  -H "Authorization: Bearer <TU_TOKEN>"
```

**Respuesta esperada:**

```json
{
  "id": "uuid-123",
  "title": "PEI Juan Pérez",
  "status": "REVIEW", // ✅ Cambió de DRAFT a REVIEW
  "approved_at": null,
  "approved_by": null,
  "updated_at": "2025-11-06T10:30:00.000Z"
}
```

#### 4.4 Probar cambio a APPROVED

```bash
curl -X PATCH http://localhost:3001/api/peis/<PEI_ID>/status \
  -H "Authorization: Bearer <TU_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"status":"APPROVED"}'
```

**Respuesta esperada:**

```json
{
  "id": "uuid-123",
  "title": "PEI Juan Pérez",
  "status": "APPROVED",
  "approved_at": "2025-11-06T10:32:00.000Z", // ✅ Auto-generado
  "approved_by": "user-uuid", // ✅ Usuario actual
  "updated_at": "2025-11-06T10:32:00.000Z"
}
```

---

## ✅ CRITERIOS DE DONE

- [ ] Migration SQL ejecutada en Supabase
- [ ] Columnas `status`, `approved_at`, `approved_by` existen en tabla `peis`
- [ ] PEIs existentes tienen `status = 'DRAFT'`
- [ ] Endpoint PATCH `/peis/:id/status` persiste cambios (verificar con GET)
- [ ] Cambio a APPROVED genera automáticamente `approved_at` y `approved_by`
- [ ] No hay errores en logs del backend al actualizar status

---

## 🐛 TROUBLESHOOTING

### Error: "column peis.status does not exist"

**Causa:** Migration no aplicada  
**Solución:** Ejecutar Paso 2 completo

### Error: "invalid input value for enum pei_status"

**Causa:** Valor de status no válido  
**Solución:** Verificar que status sea uno de: DRAFT, REVIEW, APPROVED, ACTIVE, ARCHIVED

### Status se actualiza pero no persiste

**Causa:** Transacción de Supabase falló silenciosamente  
**Solución:**

```typescript
// Revisar logs del backend
// En peis.service.ts línea ~150, verificar:
console.log("Update data:", updateData);
console.log("Supabase response:", data, error);
```

### approved_at no se genera automáticamente

**Causa:** Lógica en servicio no se ejecuta  
**Solución:** Verificar que `updates.approved_by` esté presente en la llamada

---

## 📝 NOTAS IMPORTANTES

1. **Seguridad:** No nos preocupamos por validaciones estrictas ahora (fase MVP)
2. **RLS:** Deshabilitado para desarrollo, se ajusta en fase final
3. **Transacciones:** Update simple por ahora, optimizar después si necesario
4. **Frontend:** No requiere cambios, ya espera campo `status` en respuesta

---

## 🎯 SIGUIENTE TAREA

Tras completar esto: **⛔ Ejecutar Tests E2E**

```bash
cd frontend
npm run test:e2e:api
```

Esperamos >90% passing (42+ de 47 tests)

---

**Tiempo total estimado:** 15-30 minutos  
**Complejidad:** BAJA (solo aplicar SQL, código ya implementado)
