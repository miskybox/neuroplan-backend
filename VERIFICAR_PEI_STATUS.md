# ✅ VERIFICACIÓN PEI STATUS - Post Migration

**Fecha:** 6 de noviembre de 2025  
**Estado:** Migration aplicada exitosamente

---

## 1️⃣ Verificar Columnas en Supabase

Ejecutar en **Supabase SQL Editor**:

```sql
-- Verificar que las columnas existen
SELECT
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'peis'
  AND column_name IN ('status', 'approved_at', 'approved_by')
ORDER BY column_name;
```

**Resultado esperado:**

```
column_name  | data_type                | is_nullable | column_default
-------------|--------------------------|-------------|----------------
approved_at  | timestamp with time zone | YES         | NULL
approved_by  | uuid                     | YES         | NULL
status       | USER-DEFINED             | YES         | 'DRAFT'::pei_status
```

✅ Si ves esto → **Migration correcta**

---

## 2️⃣ Arrancar Backend

```bash
cd backend
npm run start:dev
```

**Verificar en logs:**

```
[Nest] LOG [NestFactory] Starting Nest application...
[Nest] LOG [InstanceLoader] AppModule dependencies initialized
[Nest] LOG [RoutesResolver] PeisController {/api/peis}:
[Nest] LOG   Mapped {/api/peis/:id/status, PATCH} route
```

✅ Backend corriendo en http://localhost:3001

---

## 3️⃣ Crear un PEI de Prueba

### Opción A: Desde Frontend (recomendado)

1. **Arrancar frontend:**

   ```bash
   cd frontend
   npm run dev
   ```

2. **Navegar a:** http://localhost:5173

3. **Hacer login** con usuario de test

4. **Crear un estudiante** (si no existe)

5. **Generar un PEI** para ese estudiante

6. **Copiar el ID del PEI** desde la URL o la respuesta

---

### Opción B: Crear directo en Supabase (más rápido)

```sql
-- Crear un PEI de prueba
INSERT INTO public.peis (id, student_id, created_by, title, summary, diagnosis)
VALUES (
  gen_random_uuid(),  -- Genera UUID automáticamente
  (SELECT id FROM public.students LIMIT 1),  -- Toma primer estudiante
  (SELECT id FROM public.users LIMIT 1),     -- Toma primer usuario
  'PEI de Prueba - Test Status',
  'Este es un PEI de prueba para validar el sistema de estados',
  'Diagnóstico de prueba'
)
RETURNING id, title, status, created_at;
```

**Resultado esperado:**

```
id                                   | title                      | status | created_at
-------------------------------------|----------------------------|--------|---------------------------
550e8400-e29b-41d4-a716-446655440000 | PEI de Prueba - Test Status| DRAFT  | 2025-11-06 10:30:00+00
```

📝 **Copiar el ID** para los siguientes pasos

---

## 4️⃣ Probar Endpoint PATCH /peis/:id/status

### 4.1 Obtener Token JWT

```bash
# Login con usuario de test
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"test@neuroplan.com\",\"password\":\"Test123!\"}"
```

**Respuesta:**

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": { ... }
}
```

📝 **Copiar el access_token**

---

### 4.2 Actualizar Status a REVIEW

```bash
# Reemplazar <TOKEN> y <PEI_ID>
curl -X PATCH http://localhost:3001/api/peis/<PEI_ID>/status \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d "{\"status\":\"REVIEW\"}"
```

**Respuesta esperada:**

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "title": "PEI de Prueba - Test Status",
  "status": "REVIEW", // ✅ Cambió de DRAFT a REVIEW
  "approved_at": null,
  "approved_by": null,
  "updated_at": "2025-11-06T10:35:00.000Z"
}
```

✅ **Status persistió correctamente**

---

### 4.3 Actualizar Status a APPROVED

```bash
curl -X PATCH http://localhost:3001/api/peis/<PEI_ID>/status \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d "{\"status\":\"APPROVED\"}"
```

**Respuesta esperada:**

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "title": "PEI de Prueba - Test Status",
  "status": "APPROVED",
  "approved_at": "2025-11-06T10:36:00.000Z", // ✅ Auto-generado
  "approved_by": "user-uuid-here", // ✅ Usuario actual
  "updated_at": "2025-11-06T10:36:00.000Z"
}
```

✅ **approved_at y approved_by se generaron automáticamente**

---

### 4.4 Verificar Persistencia

```bash
# GET para confirmar que el cambio persiste
curl http://localhost:3001/api/peis/<PEI_ID> \
  -H "Authorization: Bearer <TOKEN>"
```

**Debe devolver el PEI con status APPROVED**

---

### 4.5 Probar Validación de Status Inválido

```bash
curl -X PATCH http://localhost:3001/api/peis/<PEI_ID>/status \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d "{\"status\":\"INVALID_STATUS\"}"
```

**Respuesta esperada (400 Bad Request):**

```json
{
  "statusCode": 400,
  "message": "Estado no válido. Debe ser uno de: DRAFT, REVIEW, APPROVED, ACTIVE, ARCHIVED",
  "error": "Bad Request"
}
```

✅ **Validación funciona correctamente**

---

## 5️⃣ Verificar en Base de Datos

```sql
-- Ver todos los PEIs con sus status
SELECT
    id,
    title,
    status,
    approved_at,
    approved_by,
    created_at,
    updated_at
FROM public.peis
ORDER BY updated_at DESC;
```

**Resultado esperado:**

```
id       | title                       | status   | approved_at             | approved_by | updated_at
---------|-----------------------------| ---------|-------------------------|-------------|-------------------------
550e...  | PEI de Prueba - Test Status | APPROVED | 2025-11-06 10:36:00+00  | user-uuid   | 2025-11-06 10:36:00+00
```

✅ **Status APPROVED persistido en BD con fecha y usuario**

---

## ✅ CHECKLIST DE VERIFICACIÓN

- [ ] Migration aplicada (columnas existen en BD)
- [ ] Backend arranca sin errores
- [ ] PEI de prueba creado con status='DRAFT'
- [ ] PATCH a REVIEW funciona y persiste
- [ ] PATCH a APPROVED genera approved_at/by automáticamente
- [ ] GET confirma que status persiste tras PATCH
- [ ] Validación rechaza status inválidos (400)
- [ ] Verificación en BD muestra datos correctos

---

## 🐛 Troubleshooting

### Error: "column peis.status does not exist"

**Causa:** Migration no se aplicó correctamente  
**Solución:** Volver a ejecutar el SQL del Paso 1

---

### Status se actualiza pero approved_at sigue NULL al APROBAR

**Causa:** El servicio no recibe `approved_by` en el body  
**Verificar:** En `peis.controller.ts` línea ~315:

```typescript
const updatedPei = await this.peisService.updatePEI(id, {
  status: body.status,
  approved_by: body.status === "APPROVED" ? userId : undefined, // ✅ Debe estar
});
```

---

### Error 401 Unauthorized

**Causa:** Token JWT expirado o inválido  
**Solución:** Hacer login de nuevo y obtener nuevo token

---

### Error 404 PEI not found

**Causa:** El ID del PEI no existe  
**Solución:** Verificar ID con:

```sql
SELECT id, title FROM public.peis LIMIT 5;
```

---

## 🎯 SIGUIENTE PASO

Una vez verificado todo → **Ejecutar Tests E2E**

```bash
cd frontend
npm run test:e2e:api
```

Objetivo: **>90% passing** (42+ de 47 tests)

---

**Status de verificación:** ⏳ En progreso...
