# ⚡ QUICK START - Activar Supabase (15 min)

## ✅ Lo que YA tienes

- ✅ Proyecto Supabase: `qlpzzljqbwcnpayjhugz`
- ✅ URL configurada en `.env`: `https://qlpzzljqbwcnpayjhugz.supabase.co`
- ✅ AUTH_MOCK cambiado a `false`
- ✅ Base de datos con migraciones aplicadas

## ❌ Lo que FALTA (solo 2 pasos)

### 1. Copiar API Keys (5 min)

Ve a: https://supabase.com/dashboard/project/qlpzzljqbwcnpayjhugz/settings/api

**Busca estas 2 secciones:**

```
Project API keys
├─ anon public     → eyJhbG........... (copiar esto)
└─ service_role    → eyJhbG........... (copiar esto - ES SECRETO)
```

### 2. Pegar en `.env` (2 min)

**Archivo**: `backend\.env`

```bash
# Reemplaza estas 2 líneas:
SUPABASE_ANON_KEY=eyJhbG...........    # ← pegar anon key
SUPABASE_SERVICE_ROLE_KEY=eyJhbG..... # ← pegar service_role key
```

### 3. Reiniciar backend (1 min)

```bash
cd backend
npm run start:dev
```

**Verificar que aparezca:**

```
✅ [Database] Supabase connection successful
✅ Nest application successfully started
```

---

## 🧪 Validar que funciona

```bash
# Test login con los 5 roles
node scripts\test-login-simple.js
```

**Resultado esperado:**

```
✅ Login exitoso (ADMIN): admin@test.com
✅ Login exitoso (ORIENTADOR): orientador@test.com
✅ Login exitoso (PROFESOR): profesor@test.com
✅ Login exitoso (DIRECTOR_CENTRO): director@test.com
✅ Login exitoso (FAMILIA): familia@test.com
```

---

## 🎉 ¡Listo!

Con esos 2 pasos (copiar-pegar 2 keys), el proyecto completo se activa:

- ✅ Login/registro funcional
- ✅ CRUD de estudiantes
- ✅ Generación de PEIs
- ✅ Sistema de roles validado

---

**Link directo a API Keys**: https://supabase.com/dashboard/project/qlpzzljqbwcnpayjhugz/settings/api
