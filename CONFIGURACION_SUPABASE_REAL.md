# 🔧 Configuración Supabase - Proyecto Real

## ✅ Estado Actual

**Proyecto Supabase**: YA CREADO  
**Project ID**: `qlpzzljqbwcnpayjhugz`  
**Project URL**: `https://qlpzzljqbwcnpayjhugz.supabase.co`  
**Database Password**: `Barcelona2025!`  
**Conexión Directa**: `postgresql://postgres:Barcelona2025!@db.qlpzzljqbwcnpayjhugz.supabase.co:5432/postgres`

---

## ⚡ ACCIÓN INMEDIATA (15 minutos)

### 1. Obtener API Keys del Dashboard (5 min)

1. Ve a: https://supabase.com/dashboard/project/qlpzzljqbwcnpayjhugz
2. Login con tu cuenta de Supabase
3. Click en **Settings** (icono engranaje en el sidebar izquierdo)
4. Click en **API** en el menú de Settings

**Copiar estas 2 keys:**

```
Project URL: https://qlpzzljqbwcnpayjhugz.supabase.co ✅ (ya lo tenemos)

anon/public key:
eyJ............................ (string largo que comienza con "eyJ")

service_role key:
eyJ............................ (string largo - ¡ESTE ES SECRETO!)
```

### 2. Actualizar `.env` con las Keys Reales (2 min)

**Archivo**: `c:\Users\misky\Desktop\neuroplan-mvp\backend\.env`

**Actualizar estas líneas:**

```bash
# YA ESTÁ ACTUALIZADO ✅
AUTH_MOCK=false

# YA ESTÁ ACTUALIZADO ✅
SUPABASE_URL=https://qlpzzljqbwcnpayjhugz.supabase.co

# ❌ FALTA - Pegar tu anon key real del dashboard
SUPABASE_ANON_KEY=OBTENER_DE_SUPABASE_DASHBOARD

# ❌ FALTA - Pegar tu service_role key real del dashboard
SUPABASE_SERVICE_ROLE_KEY=OBTENER_DE_SUPABASE_DASHBOARD
```

### 3. Verificar Estado de la Base de Datos (3 min)

Verifica si las migraciones ya están aplicadas:

1. Ve a: https://supabase.com/dashboard/project/qlpzzljqbwcnpayjhugz/editor
2. En el **Table Editor**, verifica que existen estas tablas:
   - ✅ `users`
   - ✅ `students`
   - ✅ `peis`
   - ✅ `centers`
   - ✅ `persons`
   - ✅ `roles`
   - ✅ `user_roles`

**Si las tablas NO existen**, ejecuta las migraciones:

```bash
# Ve a SQL Editor en Supabase Dashboard
# Ejecuta el contenido de estos archivos en orden:

1. backend/migrations/normalize-schema.sql
2. backend/migrations/add-pei-status-columns.sql
```

### 4. Verificar/Crear Usuarios de Test (5 min)

**Opción A: Verificar usuarios existentes**

1. Ve a: https://supabase.com/dashboard/project/qlpzzljqbwcnpayjhugz/auth/users
2. Verifica si existen estos 5 usuarios:
   - admin@test.com
   - orientador@test.com
   - profesor@test.com
   - director@test.com
   - familia@test.com

**Opción B: Si NO existen, crearlos**

```bash
cd c:\Users\misky\Desktop\neuroplan-mvp\backend
node scripts/create-test-users-complete.js
```

### 5. Reiniciar Backend y Verificar (2 min)

```bash
cd c:\Users\misky\Desktop\neuroplan-mvp\backend
npm run start:dev
```

**Verificar en los logs:**

```
✅ CORRECTO - Debe mostrar:
[Database] Supabase connection successful ✅
Nest application successfully started

❌ ERROR - Si muestra:
[Database] Supabase connection error
```

---

## 🎯 Resultado Esperado

Después de estos pasos:

1. ✅ Backend conecta a Supabase sin errores
2. ✅ Base de datos con esquema normalizado
3. ✅ 5 usuarios de test con roles asignados
4. ✅ Sistema de autenticación funcional
5. ✅ CRUD de estudiantes operativo
6. ✅ Generación de PEIs habilitada

---

## 🔒 Seguridad

**IMPORTANTE:**

1. **NO commitear** el `.env` con las keys reales al repositorio
2. **Guardar** las keys en un gestor de contraseñas (1Password, Bitwarden)
3. El **service_role key** es SECRETO - tiene acceso total a la BD
4. El **anon key** es público - se usa en el frontend

---

## 🧪 Testing Post-Configuración

Después de configurar, ejecutar:

```bash
# Test 1: Login con los 5 roles
node scripts/test-login-simple.js

# Test 2: Validar permisos CRUD
node scripts/test-endpoints-roles.js
```

**Resultados esperados:**

- ✅ 5 logins exitosos con JWT válido
- ✅ Tokens contienen el rol correcto
- ✅ CRUD funciona según matriz de permisos
- ✅ Rechazos 403 para operaciones no permitidas

---

## 📚 Referencias

- **Dashboard del Proyecto**: https://supabase.com/dashboard/project/qlpzzljqbwcnpayjhugz
- **SQL Editor**: https://supabase.com/dashboard/project/qlpzzljqbwcnpayjhugz/editor
- **Auth Users**: https://supabase.com/dashboard/project/qlpzzljqbwcnpayjhugz/auth/users
- **Database Schema**: https://supabase.com/dashboard/project/qlpzzljqbwcnpayjhugz/database/tables

---

## ❓ Troubleshooting

### Error: "Invalid JWT" o "JWT expired"

```bash
# Verificar que el JWT_SECRET en .env sea el mismo que usaste para crear los tokens
JWT_SECRET=3c0a2b71cbe1f8f8d4b6a1f3c8e7d9a24c5b6d7e8f9a0b1c2d3e4f5a6b7c8d9
```

### Error: "User already exists" al crear usuarios

```bash
# Borrar usuarios existentes desde Supabase Dashboard > Authentication > Users
# O usar el script de cleanup:
node scripts/check-users-roles.js
```

### Error: "Connection timeout"

```bash
# Verificar que las keys en .env sean correctas
# Verificar que el proyecto en Supabase esté activo (no pausado)
```

---

**Última Actualización**: 9 de Noviembre de 2025  
**Proyecto**: qlpzzljqbwcnpayjhugz  
**Estado**: ⏳ Pendiente obtener API keys
