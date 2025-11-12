# CAMBIOS IMPLEMENTADOS - Sistema de Autenticación Seguro

**Fecha**: 12 de Noviembre de 2025
**Estado**: ✅ Backend completo | ⚠️ Frontend parcial

---

## ✅ COMPLETADO EN BACKEND

### 1. Mock Store con bcrypt
**Archivo**: `backend/src/modules/auth/mock-auth.store.ts`

✅ Las contraseñas ahora se hashean con bcrypt
✅ Método `create()` es asíncrono y hashea contraseñas
✅ Método `validatePassword()` para verificar contraseñas
✅ Usuario de prueba E2E con contraseña hasheada

**Antes**:
```typescript
password: 'E2eTest2024!',  // ❌ Texto plano
```

**Después**:
```typescript
passwordHash: await bcrypt.hash('E2eTest2024!', 10),  // ✅ Hasheado
```

---

### 2. Sistema de Refresh Tokens
**Archivo**: `backend/src/modules/auth/auth.service.ts`

✅ Access Token (corta duración: 15 minutos)
✅ Refresh Token (larga duración: 7 días)
✅ Validación de refresh tokens
✅ Revocación de tokens en logout
✅ Store en memoria para tokens (producción: usar Redis)

**Métodos agregados**:
- `generateAccessToken()` - Genera access token de 15 minutos
- `generateRefreshToken()` - Genera refresh token de 7 días
- `generateTokenPair()` - Genera ambos tokens
- `validateRefreshToken()` - Valida refresh token
- `revokeRefreshToken()` - Revoca token en logout
- `refresh()` - Renueva access token con refresh token

---

### 3. Cookies httpOnly
**Archivo**: `backend/src/modules/auth/auth.controller.ts`

✅ Access token en cookie httpOnly
✅ Refresh token en cookie httpOnly
✅ Configuración de cookies seguras (secure en producción)
✅ SameSite=strict para protección CSRF

**Endpoints actualizados**:
- `POST /api/auth/register` - Establece cookies
- `POST /api/auth/login` - Establece cookies
- `POST /api/auth/refresh` - Renueva access token
- `POST /api/auth/logout` - Limpia cookies y revoca refresh token

**Configuración de cookies**:
```typescript
res.cookie('accessToken', accessToken, {
  httpOnly: true,  // ✅ No accesible desde JavaScript
  secure: isProduction,  // ✅ Solo HTTPS en producción
  sameSite: 'strict',  // ✅ Protección CSRF
  maxAge: 15 * 60 * 1000,  // 15 minutos
});
```

---

### 4. JWT Strategy Actualizado
**Archivo**: `backend/src/modules/auth/strategies/jwt.strategy.ts`

✅ Extrae tokens de cookies O del header Authorization
✅ Compatibilidad con ambos métodos (transición suave)

**Extractor de tokens**:
```typescript
jwtFromRequest: ExtractJwt.fromExtractors([
  (request: Request) => {
    // Intentar obtener de cookie primero
    let token = request?.cookies?.['accessToken'];

    // Si no está en cookie, intentar obtener del header
    if (!token && request?.headers?.authorization) {
      const authHeader = request.headers.authorization;
      if (authHeader.startsWith('Bearer ')) {
        token = authHeader.substring(7);
      }
    }

    return token;
  },
]),
```

---

### 5. CORS y Cookie Parser
**Archivo**: `backend/src/main.ts`

✅ Middleware cookie-parser instalado
✅ CORS con credentials habilitado
✅ Headers permitidos configurados

**Configuración CORS**:
```typescript
app.use(cookieParser());

app.enableCors({
  origin: origins,
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,  // ✅ Permitir cookies
  allowedHeaders: ['Content-Type', 'Authorization'],
});
```

---

## ⚠️ PENDIENTE EN FRONTEND

### 1. Actualizar AuthContext
**Archivo**: `frontend/src/contexts/AuthContext.tsx`

**Cambios necesarios**:
```typescript
// ❌ ELIMINAR todas las referencias a localStorage:
localStorage.removeItem("authToken");
localStorage.removeItem("neuroplan_user");
localStorage.setItem("authToken", token);
localStorage.setItem("neuroplan_user", JSON.stringify(user));

// ✅ REEMPLAZAR con:
// Las cookies se manejan automáticamente por el backend
// Solo mantener el estado del usuario en memoria
```

**Métodos a actualizar**:
- `checkAuth()` - Verificar sesión llamando a `/api/auth/me`
- `login()` - Ya no guardar token, solo user info
- `register()` - Ya no guardar token, solo user info
- `logout()` - Llamar a `/api/auth/logout` para limpiar cookies
- `updateUser()` - Solo actualizar estado en memoria

---

### 2. Servicio de API
**Archivo**: `frontend/src/services/api.ts`

✅ `withCredentials: true` configurado
✅ Interceptor de refresh token implementado
✅ Cola de peticiones durante refresh
⚠️ Necesita testing

**Flujo de refresh automático**:
1. Petición recibe 401
2. Se intenta refresh del access token
3. Si el refresh es exitoso, se reintenta la petición original
4. Si el refresh falla, se redirige a login

---

### 3. Servicio neuroplanApi
**Archivo**: `frontend/src/services/neuroplanApi.ts`

**Métodos a actualizar**:
```typescript
// ❌ ELIMINAR:
export const setAuthToken = (token: string) => {
  localStorage.setItem('authToken', token);
};

// ❌ ELIMINAR:
export const clearAuthToken = () => {
  localStorage.removeItem('authToken');
};

// ✅ AGREGAR:
export const logout = async () => {
  await api.post('/auth/logout');
  // Las cookies se limpian automáticamente en el backend
};
```

---

## 🎯 PRÓXIMOS PASOS PARA COMPLETAR

### Paso 1: Actualizar AuthContext (30 min)
```bash
# Editar frontend/src/contexts/AuthContext.tsx
```

**Tareas**:
1. Eliminar todas las referencias a `localStorage.setItem('authToken')`
2. Eliminar `localStorage.getItem('authToken')`
3. Modificar `checkAuth()` para llamar a `/api/auth/me`
4. Modificar `logout()` para llamar a `/api/auth/logout`
5. Mantener solo `user` en el estado (no token)

### Paso 2: Limpiar neuroplanApi (15 min)
```bash
# Editar frontend/src/services/neuroplanApi.ts
```

**Tareas**:
1. Eliminar métodos `setAuthToken()` y `clearAuthToken()`
2. Actualizar método `login()` para no manejar tokens
3. Actualizar método `register()` para no manejar tokens
4. Agregar método `logout()` que llame a `/api/auth/logout`

### Paso 3: Testing (30 min)
1. Reiniciar backend y frontend
2. Probar registro completo
3. Probar login
4. Verificar que las cookies se establecen (DevTools > Application > Cookies)
5. Probar refresh automático (esperar 15 minutos o modificar expiración)
6. Probar logout

---

## 🔧 COMANDOS PARA TESTING

### Iniciar servicios
```bash
# Terminal 1 - Backend
cd backend
npm run start:dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

### Verificar cookies en el navegador
1. Abrir DevTools (F12)
2. Application > Cookies > http://localhost:5173
3. Deberías ver:
   - `accessToken` (httpOnly: true, Max-Age: 900)
   - `refreshToken` (httpOnly: true, Max-Age: 604800)

### Probar endpoints con curl
```bash
# 1. Login y guardar cookies
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test1234!"}' \
  -c cookies.txt \
  -v

# 2. Acceder a endpoint protegido usando cookies
curl -X GET http://localhost:3001/api/auth/me \
  -b cookies.txt \
  -v

# 3. Refresh token
curl -X POST http://localhost:3001/api/auth/refresh \
  -b cookies.txt \
  -c cookies.txt \
  -v

# 4. Logout
curl -X POST http://localhost:3001/api/auth/logout \
  -b cookies.txt \
  -v
```

---

## 📋 CHECKLIST DE VERIFICACIÓN

### Backend
- [x] bcrypt instalado y funcionando
- [x] Contraseñas hasheadas en Mock Store
- [x] Access token generado (15 min)
- [x] Refresh token generado (7 días)
- [x] Endpoint `/auth/refresh` implementado
- [x] Endpoint `/auth/logout` implementado
- [x] Cookies httpOnly configuradas
- [x] CORS con credentials habilitado
- [x] cookie-parser instalado
- [x] JWT Strategy extrae tokens de cookies

### Frontend
- [x] `withCredentials: true` en axios
- [x] Interceptor de refresh token implementado
- [ ] localStorage eliminado de AuthContext
- [ ] localStorage eliminado de neuroplanApi
- [ ] Testing completo del flujo de auth

---

## 🔐 SEGURIDAD MEJORADA

### Antes
❌ Tokens en localStorage (vulnerable a XSS)
❌ Contraseñas en texto plano (Mock Store)
❌ Sin mecanismo de refresh
❌ Tokens de larga duración (24h)
❌ Sin revocación de tokens

### Después
✅ Tokens en httpOnly cookies (inmune a XSS)
✅ Contraseñas hasheadas con bcrypt
✅ Refresh tokens implementado
✅ Access token de corta duración (15 min)
✅ Refresh token de duración media (7 días)
✅ Revocación de tokens en logout
✅ Refresh automático transparente para el usuario

---

## 🚀 MEJORAS FUTURAS (Producción)

### Sistema de Refresh Tokens en Producción
Actualmente los refresh tokens se guardan en memoria (Map). Para producción:

```typescript
// backend/src/modules/auth/auth.service.ts

// Opción 1: Redis
import { RedisService } from '@nestjs/redis';

private async generateRefreshToken(userId: string): Promise<string> {
  const refreshToken = this.jwtService.sign({ sub: userId, type: 'refresh' }, { expiresIn: '7d' });

  // Guardar en Redis con TTL de 7 días
  await this.redisService.set(
    `refresh_token:${refreshToken}`,
    userId,
    'EX',
    7 * 24 * 60 * 60
  );

  return refreshToken;
}

// Opción 2: Base de datos
import { supabase } from '../../db';

private async generateRefreshToken(userId: string): Promise<string> {
  const refreshToken = this.jwtService.sign({ sub: userId, type: 'refresh' }, { expiresIn: '7d' });

  // Guardar en tabla refresh_tokens
  await supabase.from('refresh_tokens').insert({
    token: refreshToken,
    user_id: userId,
    expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  });

  return refreshToken;
}
```

### Tabla de Refresh Tokens (Supabase)
```sql
CREATE TABLE refresh_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  token TEXT UNIQUE NOT NULL,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  revoked BOOLEAN DEFAULT FALSE
);

CREATE INDEX idx_refresh_tokens_token ON refresh_tokens(token);
CREATE INDEX idx_refresh_tokens_user_id ON refresh_tokens(user_id);
CREATE INDEX idx_refresh_tokens_expires_at ON refresh_tokens(expires_at);

-- Limpiar tokens expirados automáticamente
CREATE OR REPLACE FUNCTION delete_expired_refresh_tokens()
RETURNS void AS $$
BEGIN
  DELETE FROM refresh_tokens WHERE expires_at < NOW();
END;
$$ LANGUAGE plpgsql;

-- Ejecutar cada hora
SELECT cron.schedule('delete-expired-tokens', '0 * * * *', 'SELECT delete_expired_refresh_tokens()');
```

### Rate Limiting por Usuario
```typescript
// backend/src/modules/auth/auth.controller.ts
import { ThrottlerGuard } from '@nestjs/throttler';

@UseGuards(ThrottlerGuard)
@Throttle({ default: { limit: 5, ttl: 60000 } })  // 5 refreshes por minuto
@Post('refresh')
async refresh(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
  // ...
}
```

---

## 📚 DOCUMENTACIÓN ADICIONAL

### Flujo de Autenticación Completo

```
1. Usuario → POST /auth/login
   ↓
2. Backend valida credenciales
   ↓
3. Backend genera access + refresh tokens
   ↓
4. Backend envía cookies httpOnly
   ↓
5. Usuario guarda solo user info (no tokens)
   ↓
6. Cada petición envía cookies automáticamente
   ↓
7. Cuando access token expira (15 min):
   - Frontend recibe 401
   - Frontend llama a /auth/refresh automáticamente
   - Backend valida refresh token
   - Backend genera nuevo access token
   - Backend envía nueva cookie
   - Frontend reintenta petición original
   ↓
8. Cuando refresh token expira (7 días):
   - Frontend recibe 401
   - Refresh falla
   - Redirige a /login
```

### Estructura de Tokens

**Access Token Payload**:
```json
{
  "sub": "user-uuid",
  "email": "user@example.com",
  "rol": "PROFESOR",
  "centroId": "center-uuid",
  "iat": 1699876543,
  "exp": 1699877443  // 15 minutos después
}
```

**Refresh Token Payload**:
```json
{
  "sub": "user-uuid",
  "type": "refresh",
  "iat": 1699876543,
  "exp": 1700481343  // 7 días después
}
```

---

## 🐛 TROUBLESHOOTING

### Las cookies no se establecen
**Problema**: Cookies no aparecen en DevTools
**Solución**:
1. Verificar que CORS tiene `credentials: true`
2. Verificar que frontend usa `withCredentials: true`
3. Verificar que `cookie-parser` está instalado
4. Verificar que no hay error en el backend

### 401 en todas las peticiones
**Problema**: Siempre recibo 401
**Solución**:
1. Verificar que las cookies se están enviando (Network tab)
2. Verificar que el JWT Strategy lee de cookies
3. Verificar que el access token no ha expirado
4. Verificar que el refresh funciona

### Refresh loop infinito
**Problema**: Se llama a /refresh continuamente
**Solución**:
1. Verificar que `isRefreshing` funciona correctamente
2. Verificar que no se intenta refresh del endpoint /refresh
3. Verificar que la cola `failedQueue` se procesa correctamente

---

**FIN DEL DOCUMENTO**
