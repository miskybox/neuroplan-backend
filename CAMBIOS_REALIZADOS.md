# Cambios Realizados en NeuroPlan MVP

Fecha: 30 de octubre de 2025

## Resumen

Se ha configurado el sistema de autenticación para permitir registro sin verificación de email, se han configurado valores por defecto para MVP, y se ha limpiado el código eliminando archivos duplicados.

---

## 1. Configuración de valores por defecto para registro

### Frontend: `frontend/src/pages/Register.tsx`

**Cambio realizado (líneas 212-221):**

```typescript
// ANTES:
const userData = {
  firstName: formData.nombre,
  lastName: formData.apellidos,
  email: formData.email,
  password: formData.password,
  role: "ADMIN",
  centerId: "CENTRO_DEMO"
};

// DESPUÉS:
const userData = {
  firstName: formData.nombre,
  lastName: formData.apellidos,
  email: formData.email,
  password: formData.password,
  role: "PROFESOR", // Rol por defecto para MVP
  centerId: "11111111-1111-1111-1111-111111111111" // Centro demo con UUID válido
};
```

**Razón del cambio:**
- El backend requiere un UUID válido para `centerId`
- "CENTRO_DEMO" no es un UUID válido y causaba errores
- Ahora usa el UUID demo configurado en el backend: `11111111-1111-1111-1111-111111111111`
- Se cambió el rol por defecto de "ADMIN" a "PROFESOR" (más apropiado para usuarios normales)

---

## 2. Desactivar verificación de email en Supabase Auth

### Backend: `backend/src/modules/auth/auth.service.ts`

**Cambio realizado (líneas 38-51):**

```typescript
// ANTES:
const { data: authData, error: authError } = await supabase.auth.signUp({
  email: dto.email,
  password: dto.password,
  options: {
    data: {
      first_name: dto.firstName,
      last_name: dto.lastName,
      role,
      center_id: centerId,
    }
  }
});

// DESPUÉS:
const { data: authData, error: authError } = await supabase.auth.signUp({
  email: dto.email,
  password: dto.password,
  options: {
    emailRedirectTo: undefined, // No redirigir a confirmación
    data: {
      first_name: dto.firstName,
      last_name: dto.lastName,
      role,
      center_id: centerId,
    }
  }
});
```

**Razón del cambio:**
- Permite registrar usuarios sin necesidad de confirmar el email
- Útil para desarrollo y MVP
- Se agregó comentario explicativo

**Nota importante**: También necesitas desactivar la confirmación de email desde el Dashboard de Supabase:
1. Authentication > Providers > Email
2. Desactivar "Confirm email"

---

## 3. Eliminación de archivos duplicados

### 3.1. Módulo Supabase duplicado

**Eliminado:**
```
backend/src/supabase/
├── supabase.module.ts
└── supabase.service.ts
```

**Mantener:**
```
backend/src/modules/supabase/
├── supabase.module.ts
└── supabase.service.ts
```

**Archivos actualizados para usar la ruta correcta:**

1. **`backend/src/render/render.module.ts`** (línea 3):
   ```typescript
   // ANTES: import { SupabaseModule } from '../supabase/supabase.module';
   // DESPUÉS: import { SupabaseModule } from '../modules/supabase/supabase.module';
   ```

2. **`backend/src/render/render.service.ts`** (línea 6):
   ```typescript
   // ANTES: import { SupabaseService } from '../supabase/supabase.service';
   // DESPUÉS: import { SupabaseService } from '../modules/supabase/supabase.service';
   ```

---

### 3.2. Scripts antiguos movidos

**Scripts movidos a `backend/scripts/deprecated/`:**

```
backend/scripts/deprecated/
├── create-auth-users.js
├── create-users.js
├── debug-auth.js
├── execute-sql.js
├── generate-test-token.js
├── migrate-schema.js
├── setup-sqlite-database.js
├── test-connection.js
└── test-connections.js
```

**Razón:** Estos son scripts antiguos de desarrollo/testing que ya no se usan en el flujo principal.

---

### 3.3. Archivos temporales eliminados

**Eliminado:**
- `backend/.env.temp` - Archivo temporal innecesario

---

## 4. Nuevos archivos de documentación creados

### 4.1. `backend/.env.example`

Plantilla de variables de entorno con todas las configuraciones necesarias.

**Uso:**
```bash
cp .env.example .env
# Editar .env con tus credenciales reales
```

---

### 4.2. `backend/SUPABASE_CONFIG.md`

Documentación completa sobre cómo configurar Supabase para el proyecto:

- Cómo desactivar verificación de email
- Valores por defecto configurados
- Roles disponibles
- Instrucciones para verificar configuración
- Notas para producción

---

### 4.3. `backend/scripts/disable-email-confirmation.sql`

Script SQL de referencia para verificar configuración de auth en Supabase.

**Nota:** La configuración se hace principalmente desde el Dashboard, este script es para referencia.

---

### 4.4. `README.md` (actualizado)

README completo del proyecto con:

- Descripción de tecnologías
- Estructura del proyecto
- Instrucciones de configuración paso a paso
- Cómo ejecutar el proyecto
- Funcionalidades implementadas
- Valores por defecto del MVP
- Troubleshooting
- Roadmap para producción

---

## 5. Resumen de archivos modificados

### Archivos modificados:
1. ✅ `frontend/src/pages/Register.tsx` - Valores por defecto
2. ✅ `backend/src/modules/auth/auth.service.ts` - Email sin confirmación
3. ✅ `backend/src/render/render.module.ts` - Importación correcta
4. ✅ `backend/src/render/render.service.ts` - Importación correcta
5. ✅ `README.md` - Documentación completa

### Archivos nuevos:
1. ✅ `backend/.env.example` - Plantilla de variables
2. ✅ `backend/SUPABASE_CONFIG.md` - Documentación Supabase
3. ✅ `backend/scripts/disable-email-confirmation.sql` - Script SQL
4. ✅ `CAMBIOS_REALIZADOS.md` - Este archivo

### Archivos eliminados:
1. ✅ `backend/src/supabase/` - Carpeta duplicada (eliminada)
2. ✅ `backend/.env.temp` - Archivo temporal (eliminado)
3. ✅ Scripts antiguos movidos a `deprecated/`

---

## 6. Valores por defecto configurados (MVP)

| Configuración | Valor |
|--------------|-------|
| **Rol por defecto** | `PROFESOR` |
| **Centro por defecto** | `11111111-1111-1111-1111-111111111111` |
| **Email confirmation** | Desactivada |
| **JWT expiration** | 24 horas |

---

## 7. Pasos siguientes

### Configuración manual requerida en Supabase:

1. **Desactivar confirmación de email:**
   - Ve a: Authentication > Providers > Email
   - Desactiva: "Confirm email"
   - Guarda cambios

2. **Verificar que el schema está ejecutado:**
   - Ve a: SQL Editor
   - Ejecuta: `backend/supabase-schema-complete.sql`

### Para probar el registro:

1. Inicia el backend: `cd backend && npm run start:dev`
2. Inicia el frontend: `cd frontend && npm run dev`
3. Ve a: http://localhost:5173/register
4. Registra un usuario con cualquier email (puede ser falso como `test@test.com`)
5. Deberías poder hacer login inmediatamente sin confirmar el email

---

## 8. Notas importantes

### Para desarrollo/MVP:
- ✅ Email falsos funcionan (ej: `test@test.com`)
- ✅ No se envían emails de confirmación
- ✅ Registro y login inmediatos
- ✅ Todos los usuarios tienen rol PROFESOR por defecto

### Antes de producción:
- ⚠️ Reactivar verificación de email
- ⚠️ Configurar templates de email
- ⚠️ Implementar password reset
- ⚠️ Añadir rate limiting
- ⚠️ Configurar OAuth providers
- ⚠️ Implementar refresh tokens

---

## 9. Troubleshooting

### Si encuentras errores al registrar:

1. **Error: "El email ya está registrado"**
   - Elimina el usuario desde Supabase Dashboard (Authentication > Users)
   - O usa un email diferente

2. **Error: "Invalid UUID for centerId"**
   - Verifica que el frontend usa: `11111111-1111-1111-1111-111111111111`
   - Este cambio ya está aplicado

3. **Error: "Email confirmation required"**
   - Verifica que desactivaste la confirmación en Supabase Dashboard
   - Authentication > Providers > Email > Desactivar "Confirm email"

---

## Contacto

Para cualquier duda sobre estos cambios, revisa:
- `README.md` - Documentación general
- `backend/SUPABASE_CONFIG.md` - Configuración de Supabase
- `backend/.env.example` - Variables de entorno
