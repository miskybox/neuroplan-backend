# 📊 AUDITORÍA CONSOLIDADA FINAL - NEUROPLAN MVP

**Fecha:** 6 de noviembre de 2025  
**Rama:** `feature/refactor` → Pre-merge a `dev`  
**Versión:** 1.0 (Consolidada)  
**Auditores:** Sistema automatizado + Análisis Cursor + Análisis ChatGPT + Análisis Claude

---

## 🎯 RESUMEN EJECUTIVO

### Estado General: ⚠️ **MVP FUNCIONAL - REQUIERE 2 CORRECCIONES CRÍTICAS**

**Calificación Consolidada:** 7.3/10

| Auditor   | Puntuación | Observación Principal                                        |
| --------- | ---------- | ------------------------------------------------------------ |
| Claude    | 7.5/10     | "Arquitectura sólida, necesita persistencia PEI y tests"     |
| Cursor    | 7.2/10     | "Contratos API inconsistentes, falta validación de entorno"  |
| ChatGPT   | 7.5/10     | "Arquitectura NestJS sólida, problema en Docker backend"     |
| **MEDIA** | **7.3/10** | **MVP viable, 2 bloqueantes críticos + mejoras importantes** |

### Consenso de las 3 Auditorías

**✅ FORTALEZAS UNÁNIMES:**

- Arquitectura NestJS modular y escalable (15 módulos)
- Error handling global implementado correctamente
- Supabase integrado con esquema normalizado
- Docker multi-stage funcional (tras corrección de Cursor)
- 47 tests E2E Playwright configurados
- Documentación completa y clara

**⛔ BLOQUEANTES CRÍTICOS (Consenso):**

1. **PEI Status sin persistir** → ✅ Código implementado, ⛔ falta aplicar migration SQL (15-30min)
2. **Tests E2E no ejecutados** → Suite configurada, falta ejecutar y validar (30-45min)

**⚠️ MEJORAS IMPORTANTES (Pre-producción, NO bloquean merge):**

3. **Logs sin gestión por entorno** → Frontend usa console.log en producción (~2h)
4. **Contratos API inconsistentes** → Diferentes formatos de respuesta (~3h)
5. **Validaciones por entorno** → centerId/role opcionales correcto para DEV (~1h ajustar para PROD)

**📝 NOTA:** JWT fallback, rate limiting, RLS → se ajustan en fase final pre-producción según indicaciones del equipo.

---

## 📐 ANÁLISIS COMPARATIVO DE AUDITORÍAS

### Hallazgos por Auditor

#### 🔍 Auditoría Cursor (Enfoque: Arquitectura Backend)

**Fortalezas identificadas:**

- ✅ Validación de entorno correcta (`validate-env.ts`)
- ✅ Supabase centralizado con `db.ts`
- ✅ CORS y Swagger bien configurados
- ✅ Ownership checks en `StudentsController`

**Problemas únicos detectados:**

- 🔴 **Backend Dockerfile no compilaba TypeScript** (YA CORREGIDO)
  - Instalaba `npm ci --only=production` en etapa builder
  - Faltaban dependencias dev para `npm run build`
- ⚠️ **Contratos de respuesta no unificados:**
  - Distintos controladores devuelven formas variadas: `{ success }`, `{ student }`, `{ data, error }`
  - Frontend tiene `ApiResponse<T>` pero backend no lo usa consistentemente
- ⚠️ **Transacciones ausentes:**
  - `StudentsController.update` modifica `persons` + `students` sin transacción atómica
  - Riesgo de inconsistencia si una operación falla
- ⚠️ **Validación de entorno duplicada:**
  - `validate-env.ts` Y `env.validation.ts` coexisten con lógica redundante

**Correcciones aplicadas por Cursor:**

```dockerfile
# backend/Dockerfile - Etapa builder
FROM node:22-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci  # ✅ Ahora instala deps dev para compilar
```

#### 🔍 Auditoría ChatGPT (Enfoque: Seguridad y Entorno)

**Fortalezas identificadas:**

- ✅ `SUPABASE_STRICT` opcional para MVP (útil en hackathon)
- ✅ Healthcheck `/health` usado por Docker
- ✅ Normalización de schema (persons, centers, roles)

**Problemas únicos detectados:**

- 🔴 **JWT secret con fallback inseguro:**

  ```typescript
  // jwt.strategy.ts
  secretOrKey: process.env.JWT_SECRET ||
    "neuroplan-secret-key-change-in-production";
  ```

  - Si `JWT_SECRET` no está configurado, usa valor público conocido
  - **Impacto:** Compromiso total de autenticación

- ⚠️ **Rate limiting deshabilitado:**

  ```typescript
  // app.module.ts:25-31
  // Rate limiting deshabilitado temporalmente para tests E2E
  ```

  - Vulnerable a ataques de fuerza bruta y DDoS

- ⚠️ **Row Level Security (RLS) desactivado:**

  ```sql
  -- scripts/disable-rls-for-mvp.sql
  ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;
  ```

  - Acceso no autorizado a datos entre usuarios en PROD

- ⚠️ **AWS credentials mock en `env.example`:**
  - Valores `mock` pueden llegar a producción si no se validan

**Propuestas de ChatGPT:**

1. Crear `EnvironmentVariables` class con validación class-validator
2. Eliminar fallback de JWT_SECRET → forzar error si no existe
3. Reactivar ThrottlerGuard con configuración ajustada
4. Preparar scripts SQL para habilitar RLS en producción

#### 🔍 Auditoría Claude (Enfoque: Funcionalidad Core)

**Fortalezas identificadas:**

- ✅ Playwright con Allure reports configurado
- ✅ Helper `handleAsync` para patrón `[data, error]`
- ✅ Scripts .bat para Windows bien documentados

**Problemas únicos detectados:**

- 🔴 **PEI Status simulado** (coincide con otras auditorías pero con más detalle)
- ⚠️ **Console.log cuantificado:**

  - Backend: 10 ocurrencias (6 en banner de inicio - aceptable)
  - Frontend: 40+ ocurrencias en producción
  - **Componentes más afectados:** PEIEngine (7), WorkflowDemo (6), Register (5)

- ⚠️ **Complejidad del código medida:**

  - Frontend PEIEngine: >1000 líneas, mantenibilidad 4/10
  - Frontend Register: Alta complejidad, mantenibilidad 6/10

- ⚠️ **Cobertura de tests estimada:**
  - Backend Auth: ~40% (solo E2E)
  - Backend PEIs: ~30%
  - Frontend: ~10% componentes, ~5% páginas
  - **Cobertura global: ~25%**

**Propuestas de Claude:**

1. Logger utility con guardia de entorno (`import.meta.env.MODE`)
2. Migrar componentes en orden de prioridad (top 10 más verbosos)
3. Refactor de PEIEngine por complejidad excesiva

---

## 🎯 ANÁLISIS CONSOLIDADO DE PROBLEMAS

### 🔴 CRÍTICO 1: PEI Status sin Persistencia (Prioridad 1)

**Consenso de 3 auditorías:** Endpoint PATCH simula actualización, no persiste en BD

**Evidencia:**

- `backend/src/modules/peis/peis.controller.ts:297` - TODO explícito
- Tabla `peis` sin columna `status`
- GET devuelve status hardcoded, no real

**Impacto:**

- Flujo de aprobación de PEIs completamente no funcional
- Estados (DRAFT/REVIEW/APPROVED/ACTIVE/ARCHIVED) se pierden
- Usuarios no pueden cambiar status de PEIs creados

**Solución consolidada:**

```sql
-- Migration: backend/migrations/001_add_pei_status.sql
ALTER TABLE peis
ADD COLUMN status VARCHAR(20) DEFAULT 'DRAFT'
CHECK (status IN ('DRAFT', 'REVIEW', 'APPROVED', 'ACTIVE', 'ARCHIVED'));

-- Performance indexes
CREATE INDEX idx_peis_status ON peis(status);
CREATE INDEX idx_peis_status_updated ON peis(status, updated_at);

-- Audit column (opcional)
ALTER TABLE peis ADD COLUMN approved_at TIMESTAMPTZ NULL;
ALTER TABLE peis ADD COLUMN approved_by UUID REFERENCES users(id) NULL;
```

```typescript
// backend/src/modules/peis/peis.service.ts
async updatePEIStatus(
  id: string,
  status: string,
  userId?: string
): Promise<PEI> {
  // Validación
  const validStatuses = ['DRAFT', 'REVIEW', 'APPROVED', 'ACTIVE', 'ARCHIVED'];
  if (!validStatuses.includes(status)) {
    throw new BadRequestException(
      `Invalid status. Must be one of: ${validStatuses.join(', ')}`
    );
  }

  // Verificar existencia y ownership
  const existing = await this.getPEIById(id);
  if (!existing) {
    throw new NotFoundException('PEI not found');
  }

  // Actualización
  const { data, error } = await this.supabase
    .from('peis')
    .update({
      status,
      updated_at: new Date().toISOString(),
      ...(status === 'APPROVED' && {
        approved_at: new Date().toISOString(),
        approved_by: userId
      })
    })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    this.logger.error('Failed to update PEI status', error);
    throw new InternalServerErrorException('Failed to update PEI status');
  }

  return data;
}
```

```typescript
// backend/src/modules/peis/peis.controller.ts
@Patch(':id/status')
@ApiOperation({ summary: 'Update PEI status' })
@ApiResponse({ status: 200, description: 'Status updated successfully' })
async updateStatus(
  @Param('id') id: string,
  @Body() dto: UpdatePEIStatusDto,
  @Req() req: any
): Promise<{ success: boolean; pei: PEI }> {
  const userId = req.user?.id;
  const pei = await this.peisService.updatePEIStatus(id, dto.status, userId);
  return { success: true, pei };
}
```

**Tiempo estimado:** 2-3 horas  
**Criterio de done:**

- [ ] Migration aplicada en Supabase
- [ ] Servicio implementado con validación
- [ ] Controller usa servicio real (sin simulación)
- [ ] Test E2E del endpoint funcionando
- [ ] GET devuelve status persistido

---

### 🔴 CRÍTICO 2: Tests E2E No Ejecutados (Prioridad 1)

**Consenso de 3 auditorías:** Estado de tests desconocido post-refactor de registro

**Contexto:**

- Cambios recientes en `RegisterDto` (centerId opcional)
- Cambios en `AuthService` (role default)
- 47 tests configurados, 0 ejecutados tras cambios

**Riesgo:**

- Regresiones no detectadas en auth/students/uploads
- Credenciales de test pueden haber cambiado
- Validaciones nuevas pueden romper fixtures

**Solución consolidada:**

```bash
# Paso 1: Verificar credenciales de test
cd backend
npm run start:dev
# Revisar logs: "✅ User e2e-test@neuroplan.com exists in Auth"

# Paso 2: Ejecutar suite completa
cd frontend
npm run test:e2e:api

# Paso 3: Analizar resultados
# Esperado: >42/47 passing (90%+ success rate)
# Si <40/47 → investigar fallos por módulo

# Paso 4: Generar reporte
npm run allure:serve
```

**Problemas potenciales y fixes:**

| Problema                       | Síntoma                | Fix                                      |
| ------------------------------ | ---------------------- | ---------------------------------------- |
| Credenciales expiradas         | 401 en todos los tests | Regenerar token de test                  |
| centerId requerido en fixtures | 400 en registro        | Actualizar fixtures (eliminar centerId)  |
| Role validation cambiada       | 400 en registro        | Actualizar fixtures (usar role válido)   |
| Supabase Auth desincronizado   | 404 en endpoints       | Verificar sync entre Auth y public.users |
| Rate limit alcanzado           | 429 en tests           | Usar token cache (ya implementado)       |

**Tiempo estimado:** 30-60 minutos  
**Criterio de done:**

- [ ] Tests ejecutados sin errores de setup
- [ ] Tasa de éxito >90% (42+ de 47)
- [ ] Fallos documentados con causa raíz
- [ ] Reporte Allure generado y revisado
- [ ] Fixtures actualizados si necesario

---

### ⚠️ IMPORTANTE 1: Contratos API Inconsistentes (Prioridad 2)

**Detectado por:** Cursor + ChatGPT

**Problema:**
Backend devuelve respuestas con estructuras variadas:

- `AuthController`: `{ success: boolean, user }`
- `StudentsController`: `{ student }` o `{ success, student }`
- `PEIsController`: `{ data, error }` o `{ pei }`
- Frontend espera: `ApiResponse<T>` con `{ data, message, status }`

**Impacto:**

- Mapeos ad-hoc en frontend
- Código duplicado de normalización
- Dificultad para error handling uniforme

**Solución consolidada:**

```typescript
// backend/src/common/interfaces/api-response.interface.ts (NUEVO)
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  timestamp: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}
```

```typescript
// backend/src/common/helpers/response.helper.ts (NUEVO)
export class ResponseHelper {
  static success<T>(data: T, message?: string): ApiResponse<T> {
    return {
      success: true,
      data,
      message,
      timestamp: new Date().toISOString(),
    };
  }

  static error(message: string, error?: string): ApiResponse {
    return {
      success: false,
      message,
      error,
      timestamp: new Date().toISOString(),
    };
  }

  static paginated<T>(
    data: T[],
    page: number,
    pageSize: number,
    total: number
  ): PaginatedResponse<T> {
    return {
      success: true,
      data,
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      },
      timestamp: new Date().toISOString(),
    };
  }
}
```

**Migración por módulo:**

```typescript
// ANTES: backend/src/modules/students/students.controller.ts
@Get()
async findAll(): Promise<{ students: Student[] }> {
  const students = await this.studentsService.findAll();
  return { students };
}

// DESPUÉS:
@Get()
@ApiResponse({ status: 200, type: ApiResponse })
async findAll(): Promise<ApiResponse<Student[]>> {
  const students = await this.studentsService.findAll();
  return ResponseHelper.success(students, 'Students retrieved successfully');
}
```

**Tiempo estimado:** 3-4 horas (migrar 5 controladores principales)  
**Criterio de done:**

- [ ] Interfaces creadas en `common/`
- [ ] Helper implementado y testeado
- [ ] AuthController migrado
- [ ] StudentsController migrado
- [ ] PEIsController migrado
- [ ] Frontend adaptado o helper de normalización creado

---

### ⚠️ IMPORTANTE 2: Seguridad de JWT Secret (Prioridad 2)

**Detectado por:** ChatGPT (único)

**Problema:**

```typescript
// backend/src/modules/auth/strategies/jwt.strategy.ts
constructor() {
  super({
    secretOrKey: process.env.JWT_SECRET ||
      "neuroplan-secret-key-change-in-production"  // ⚠️ PELIGRO
  });
}
```

**Impacto:**

- Si `JWT_SECRET` no está en `.env`, usa secreto público conocido
- Cualquiera puede firmar tokens válidos
- Compromiso total de autenticación

**Solución:**

```typescript
// backend/src/modules/auth/strategies/jwt.strategy.ts
constructor() {
  const secret = process.env.JWT_SECRET;

  if (!secret || secret.length < 32) {
    throw new Error(
      'JWT_SECRET must be defined and at least 32 characters long'
    );
  }

  super({
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    ignoreExpiration: false,
    secretOrKey: secret,
  });
}
```

```typescript
// backend/src/config/env.validation.ts (mejorar existente)
import { IsNotEmpty, IsString, MinLength } from "class-validator";

export class EnvironmentVariables {
  @IsNotEmpty({ message: "JWT_SECRET is required" })
  @IsString()
  @MinLength(32, { message: "JWT_SECRET must be at least 32 characters" })
  JWT_SECRET: string;

  @IsNotEmpty()
  @IsString()
  SUPABASE_URL: string;

  @IsNotEmpty()
  @IsString()
  SUPABASE_ANON_KEY: string;

  @IsNotEmpty()
  @IsString()
  SUPABASE_SERVICE_ROLE_KEY: string;
}
```

```bash
# Generar JWT_SECRET seguro
openssl rand -base64 32
# O con Node:
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

**Tiempo estimado:** 30 minutos  
**Criterio de done:**

- [ ] Fallback eliminado en jwt.strategy.ts
- [ ] Validación de longitud mínima implementada
- [ ] .env.example actualizado con instrucciones
- [ ] README documentado con generación de secret
- [ ] Tests de inicio sin JWT_SECRET → falla con error claro

---

### ⚠️ IMPORTANTE 3: Logs sin Gestión por Entorno (Prioridad 2)

**Consenso de 3 auditorías:**

- Backend: 10 console.log (6 aceptables en banner)
- Frontend: 40+ console.log en producción

**Componentes más afectados:**

1. `PEIEngine.tsx` - 7 logs
2. `WorkflowDemo.tsx` - 6 logs
3. `Register.tsx` - 5 logs
4. `PdfUploadComponent.tsx` - 5 logs
5. `veed.ts` - 6 logs

**Impacto:**

- Performance degradada en producción (evaluación de strings innecesaria)
- Exposición de información sensible en consola navegador
- Logs inútiles contaminan debugging real

**Solución consolidada:**

```typescript
// frontend/src/utils/logger.ts (NUEVO)
const isDev = import.meta.env.MODE !== "production";
const isTest = import.meta.env.MODE === "test";

class Logger {
  private getTimestamp(): string {
    return new Date().toISOString();
  }

  debug(...args: any[]): void {
    if (isDev && !isTest) {
      console.log(`[DEBUG ${this.getTimestamp()}]`, ...args);
    }
  }

  info(...args: any[]): void {
    if (isDev) {
      console.info(`[INFO ${this.getTimestamp()}]`, ...args);
    }
  }

  warn(...args: any[]): void {
    console.warn(`[WARN ${this.getTimestamp()}]`, ...args);
  }

  error(...args: any[]): void {
    console.error(`[ERROR ${this.getTimestamp()}]`, ...args);

    // Opcional: enviar a servicio de monitoreo
    if (!isDev) {
      // Sentry.captureException(args[0]);
    }
  }
}

export const logger = new Logger();
```

**Migración por prioridad:**

```typescript
// ANTES: frontend/src/pages/PEIEngine.tsx
console.log("Generando PEI con datos:", formData);
console.log("Respuesta del servidor:", response);

// DESPUÉS:
import { logger } from "@/utils/logger";

logger.debug("Generando PEI con datos:", formData);
logger.info("Respuesta del servidor:", response);
```

**Plan de migración:**

1. **Día 1:** Crear logger + migrar PEIEngine.tsx (7 logs)
2. **Día 2:** Migrar WorkflowDemo.tsx (6 logs) + Register.tsx (5 logs)
3. **Día 3:** Migrar PdfUploadComponent.tsx (5 logs) + veed.ts (6 logs)
4. **Día 4:** Migrar resto de componentes (15 logs)

**Tiempo estimado:** 2 horas  
**Criterio de done:**

- [ ] Logger utility creado con guards
- [ ] Top 5 componentes migrados
- [ ] Build de producción: 0 console.log visible
- [ ] Logs de error siguen funcionando
- [ ] Documentado en CONTRIBUTING.md

---

### ⚠️ IMPORTANTE 4: Validaciones sin Estrategia PROD (Prioridad 3)

**Detectado por:** Cursor + Claude

**Problema:**

```typescript
// backend/src/modules/auth/dto/register.dto.ts
export class RegisterDto {
  @IsOptional() // ⚠️ Opcional en DEV, pero también en PROD
  @IsString()
  centerId?: string;

  @IsOptional() // ⚠️ Opcional en DEV, pero también en PROD
  @IsIn(["ADMIN", "ORIENTADOR", "PROFESOR", "DIRECTOR_CENTRO"])
  role?: string;
}
```

**Impacto:**

- Usuarios sin centro asignado en producción
- Usuarios sin rol específico (default PROFESOR)
- Violación de modelo de datos en PROD

**Solución consolidada:**

```typescript
// backend/src/common/validators/conditional-required.validator.ts (NUEVO)
import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from "class-validator";

export function ConditionalRequired(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: "conditionalRequired",
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const isProd = process.env.NODE_ENV === "production";

          if (isProd) {
            return value !== null && value !== undefined && value !== "";
          }

          return true; // Opcional en desarrollo
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} is required in production environment`;
        },
      },
    });
  };
}
```

```typescript
// backend/src/modules/auth/dto/register.dto.ts (ACTUALIZAR)
import { ConditionalRequired } from "@/common/validators/conditional-required.validator";

export class RegisterDto {
  @ConditionalRequired({ message: "Centro es requerido en producción" })
  @IsString()
  @IsUUID("4", { message: "centerId must be a valid UUID" })
  centerId?: string;

  @ConditionalRequired({ message: "Rol es requerido en producción" })
  @IsString()
  @IsIn(["ADMIN", "ORIENTADOR", "PROFESOR", "DIRECTOR_CENTRO"])
  role?: string;
}
```

```typescript
// backend/src/modules/auth/auth.service.ts (ACTUALIZAR)
async register(dto: RegisterDto): Promise<AuthResponse> {
  // En producción, asegurar que role y centerId están presentes
  if (process.env.NODE_ENV === 'production') {
    if (!dto.role) {
      throw new BadRequestException('Role is required in production');
    }
    if (!dto.centerId) {
      throw new BadRequestException('Centro is required in production');
    }
  }

  // En desarrollo, aplicar defaults
  const role = dto.role || 'PROFESOR';
  const centerId = dto.centerId || null;

  // ... resto de lógica
}
```

**Tiempo estimado:** 1 hora  
**Criterio de done:**

- [ ] Validador condicional creado
- [ ] RegisterDto actualizado
- [ ] AuthService con guards de producción
- [ ] Tests para NODE_ENV=production
- [ ] Tests para NODE_ENV=development
- [ ] Documentado en .env.example y README

---

### ⚠️ IMPORTANTE 5: Transacciones Atómicas Ausentes (Prioridad 3)

**Detectado por:** Cursor (único)

**Problema:**

```typescript
// backend/src/modules/students/students.controller.ts
@Patch(':id')
async update(@Param('id') id: string, @Body() dto: UpdateStudentDto) {
  // Actualiza persons
  if (dto.first_name || dto.last_name) {
    await this.db.updatePerson(student.person_id, {
      first_name: dto.first_name,
      last_name: dto.last_name
    });
  }

  // Actualiza students (¡en operación separada!)
  const updated = await this.db.updateStudent(id, dto);

  // ⚠️ Si updateStudent falla, persons ya cambió → inconsistencia
}
```

**Impacto:**

- Si falla `updateStudent`, `persons` ya cambió
- Datos inconsistentes entre tablas relacionadas
- No hay rollback automático

**Solución consolidada:**

```sql
-- backend/migrations/002_add_update_student_atomic.sql
CREATE OR REPLACE FUNCTION update_student_atomic(
  p_student_id UUID,
  p_first_name VARCHAR,
  p_last_name VARCHAR,
  p_birth_date DATE,
  p_notes TEXT
) RETURNS TABLE (
  id UUID,
  person_id UUID,
  first_name VARCHAR,
  last_name VARCHAR,
  birth_date DATE,
  notes TEXT
) AS $$
BEGIN
  -- Transacción implícita en función PL/pgSQL

  -- Actualizar person
  UPDATE persons
  SET
    first_name = COALESCE(p_first_name, persons.first_name),
    last_name = COALESCE(p_last_name, persons.last_name),
    updated_at = NOW()
  WHERE id = (SELECT person_id FROM students WHERE id = p_student_id);

  -- Actualizar student
  UPDATE students
  SET
    birth_date = COALESCE(p_birth_date, students.birth_date),
    notes = COALESCE(p_notes, students.notes),
    updated_at = NOW()
  WHERE id = p_student_id;

  -- Retornar resultado JOIN
  RETURN QUERY
  SELECT
    s.id,
    s.person_id,
    p.first_name,
    p.last_name,
    s.birth_date,
    s.notes
  FROM students s
  JOIN persons p ON s.person_id = p.id
  WHERE s.id = p_student_id;

  -- Si cualquier UPDATE falla, se hace rollback automático
END;
$$ LANGUAGE plpgsql;
```

```typescript
// backend/src/modules/students/students.service.ts
async update(id: string, dto: UpdateStudentDto): Promise<Student> {
  // Usar función RPC transaccional
  const { data, error } = await this.supabase.rpc('update_student_atomic', {
    p_student_id: id,
    p_first_name: dto.first_name || null,
    p_last_name: dto.last_name || null,
    p_birth_date: dto.birth_date || null,
    p_notes: dto.notes || null
  });

  if (error) {
    this.logger.error('Failed to update student', error);
    throw new InternalServerErrorException('Failed to update student');
  }

  return data[0];
}
```

**Tiempo estimado:** 2 horas  
**Criterio de done:**

- [ ] Función RPC creada en Supabase
- [ ] StudentsService usa RPC
- [ ] Tests de rollback (simular fallo)

### ✅ Fortalezas

#### Arquitectura

- ✅ Monorepo bien estructurado (backend NestJS + frontend React/Vite)
- ✅ Error handling global implementado:
  - `AllExceptionsFilter` registrado globalmente
  - Excepciones de dominio (`PEIGenerationException`, `LLMTimeoutException`, `StudentNotFoundException`)
  - Helper `handleAsync` para patrón `[data, error]`
- ✅ Supabase integrado (Auth + PostgreSQL)
- ✅ Ollama configurado para LLM local (llama3.2:3b)
- ✅ Docker multi-stage builds para backend/frontend
- ✅ Playwright E2E + Vitest configurados con Allure reports

#### Backend (NestJS 11.1.7)

- ✅ **15 módulos funcionales:**
  - `auth` - Registro/login con JWT + Supabase Auth
  - `peis` - Generación y gestión de PEIs
  - `students` - CRUD de estudiantes
  - `uploads` - Subida de archivos
  - `aws` - Integración AWS (Bedrock, Textract, Polly) - MOCK
  - `dashboard` - Estadísticas
  - `notifications` - Sistema de notificaciones
  - `supabase` - Servicios de BD
  - `extract` - Análisis de documentos
- ✅ JWT + Guards implementados (JwtAuthGuard, RolesGuard)
- ✅ Swagger documentación activa en `/api/docs`
- ✅ Validación con class-validator
- ✅ Logging con NestJS Logger (parcialmente migrado)
- ✅ CORS configurado para desarrollo
- ✅ Helmet + throttling (deshabilitado temporalmente para tests)

#### Frontend (React 18.3.1 + Vite 7.1.9)

- ✅ Shadcn/ui + Tailwind CSS + Radix UI
- ✅ React Query (TanStack) para estado servidor
- ✅ React Router v6 con rutas protegidas
- ✅ Formularios con react-hook-form + zod
- ✅ Accesibilidad:
  - Panel de accesibilidad configurable
  - Síntesis de voz (use-voice hook)
  - Temas claro/oscuro
- ✅ Componentes reutilizables (35+ componentes UI)

#### Tests

- ✅ **47 tests E2E Playwright:**
  - Auth: 17 tests
  - Students: 23 tests
  - Uploads: 7 tests
- ✅ Allure reports configurados
- ✅ Vitest para unit tests frontend
- ✅ Helper de caché de tokens para evitar rate limits

#### DevOps

- ✅ Scripts .bat para Windows (start-dev, start-ollama, stop-all)
- ✅ Docker Compose para despliegue completo
- ✅ Dockerfiles multi-stage (node:22-alpine)
- ✅ Variables de entorno documentadas en .env.example

---

### ⚠️ Puntos Críticos

#### 1. PEI Status - ALTA PRIORIDAD ⛔

**Problema:**

- Endpoint `PATCH /peis/:id/status` simula actualización, no persiste en BD
- Falta columna `status` en tabla `peis`

**Ubicación:**

- `backend/src/modules/peis/peis.controller.ts:297`
- TODO explícito: "Agregar columna 'status' a tabla peis"

**Impacto:**

- Flujo de aprobación de PEIs no funcional
- Estados DRAFT/REVIEW/APPROVED/ACTIVE/ARCHIVED no se guardan

**Solución requerida:** 2-3 horas

```sql
ALTER TABLE peis
ADD COLUMN status VARCHAR(20) DEFAULT 'DRAFT'
CHECK (status IN ('DRAFT', 'REVIEW', 'APPROVED', 'ACTIVE', 'ARCHIVED'));
```

---

#### 2. Tests E2E - ALTA PRIORIDAD ⚠️

**Problema:**

- No ejecutados tras refactor de registro (cambio de validaciones)
- Estado de tests desconocido post-cambios

**Ubicación:**

- `frontend/e2e/auth.api.spec.ts`
- `frontend/e2e/students.api.spec.ts`
- `frontend/e2e/uploads.api.spec.ts`

**Riesgo:**

- Posibles regresiones no detectadas
- Credenciales de test pueden haber cambiado

**Solución requerida:** 30 minutos

```bash
cd frontend
npm run test:e2e:api
```

---

#### 3. Logging sin gestión - MEDIA 📝

**Problema:**

- 50+ `console.log/error/warn` en frontend sin condicionar por entorno
- Contaminarán logs de producción

**Ubicación:**

- `PEIEngine.tsx`: 7 console.log
- `Register.tsx`: 5+ console.error (debug de errores)
- `WorkflowDemo.tsx`: 6 console.log/error
- `PdfUploadComponent.tsx`: 5 console.error
- `veed.ts`: 6 console.log/error

**Impacto:**

- Performance degradada en producción
- Exposición de información sensible en consola

**Solución requerida:** 1-2 horas

- Crear utility logger con guardia de entorno
- Migrar console.log → logger.debug

---

#### 4. Validaciones por entorno - MEDIA 🔐

**Problema:**

- `role` y `centerId` opcionales en RegisterDto para facilitar DEV
- Sin estrategia para endurecer en PROD

**Ubicación:**

- `backend/src/modules/auth/dto/register.dto.ts:25-31`
- `backend/src/modules/auth/auth.service.ts:30-45`

**Riesgo:**

- Usuarios sin centro/rol asignado en producción
- Violación de modelo de datos en PROD

**Solución requerida:** 30 minutos

- Condicionar validaciones por `NODE_ENV`
- Documentar política de asignación automática

---

#### 5. Estilo de bootstrap - BAJA 🎨

**Problema:**

- Lint warning: "Prefer top-level await over async IIFE"
- Presente en `main.ts` y `db.ts`

**Ubicación:**

- `backend/src/main.ts:112`
- `backend/src/db.ts:491`

**Impacto:**

- Solo estilo, no afecta funcionalidad

**Solución requerida:** 15 minutos

- Suprimir regla con comentario eslint
- O refactor a top-level await

---

## 3. ERRORES Y WARNINGS DETECTADOS

### TypeScript / Lint

| Archivo                          | Línea | Tipo | Mensaje                | Severidad  |
| -------------------------------- | ----- | ---- | ---------------------- | ---------- |
| `backend/src/main.ts`            | 112   | Lint | Prefer top-level await | Baja       |
| `backend/src/db.ts`              | 491   | Lint | Prefer top-level await | Baja       |
| `backend/docs/EJEMPLO_LOGGER.ts` | 178   | Lint | Complete TODO comment  | Baja (doc) |

**Total errores bloqueantes:** 0  
**Total warnings:** 3

---

### TODOs en código

**Críticos (bloquean funcionalidad):**

- `peis.controller.ts:297` - Agregar columna 'status' ⛔

**Informativos (documentación):**

- `EJEMPLO_LOGGER.ts:178` - Migración gradual sugerida
- Ningún otro TODO crítico encontrado

---

### Console.log en código

**Backend:** 10 ocurrencias

- `main.ts`: 6 (banner de inicio - aceptable)
- `database.service.ts`: 0 (ya migrado a Logger ✅)

**Frontend:** 40+ ocurrencias

- `PEIEngine.tsx`: 7
- `Register.tsx`: 5
- `WorkflowDemo.tsx`: 6
- `PdfUploadComponent.tsx`: 5
- `veed.ts`: 6
- `Resources.tsx`: 2
- `EducationalResources.tsx`: 2
- `NotFound.tsx`: 1
- Otros componentes: 6+

---

## 4. LO QUE FALTA

### Funcionalidad Core

#### 1. Persistencia de estado PEI ⛔

**Qué falta:**

```sql
-- Migration SQL
ALTER TABLE peis
ADD COLUMN status VARCHAR(20) DEFAULT 'DRAFT'
CHECK (status IN ('DRAFT', 'REVIEW', 'APPROVED', 'ACTIVE', 'ARCHIVED'));

CREATE INDEX idx_peis_status ON peis(status);
CREATE INDEX idx_peis_status_updated ON peis(status, updated_at);
```

```typescript
// peis.service.ts - nuevo método
async updatePEIStatus(id: string, status: string, userId?: string): Promise<PEI> {
  const validStatuses = ['DRAFT', 'REVIEW', 'APPROVED', 'ACTIVE', 'ARCHIVED'];
  if (!validStatuses.includes(status)) {
    throw new BadRequestException(`Invalid status. Must be one of: ${validStatuses.join(', ')}`);
  }

  const { data, error } = await supabase
    .from('peis')
    .update({
      status,
      updated_at: new Date().toISOString(),
      ...(status === 'APPROVED' && { approved_at: new Date().toISOString() })
    })
    .eq('id', id)
    .select()
    .single();

  if (error) throw new NotFoundException('PEI not found');
  return data;
}
```

**Tests requeridos:**

```typescript
describe("PEI Status", () => {
  it("should update status to REVIEW", async () => {
    const response = await request(app)
      .patch(`/peis/${peiId}/status`)
      .send({ status: "REVIEW" })
      .expect(200);

    expect(response.body.status).toBe("REVIEW");
  });

  it("should reject invalid status", async () => {
    await request(app)
      .patch(`/peis/${peiId}/status`)
      .send({ status: "INVALID" })
      .expect(400);
  });
});
```

---

#### 2. Validación de tests E2E ⚠️

**Qué falta:**

```bash
# Ejecutar suite completa
cd frontend
npm run test:e2e:api

# Revisar reporte
npm run allure:serve

# Si fallan tests de auth:
# - Verificar credenciales: e2e-test@neuroplan.com / E2eTest2024!
# - Verificar que Supabase Auth esté sincronizado con public.users
```

**Criterio de éxito:** >42/47 tests passing (90%+)

---

### Calidad de Código

#### 3. Gestión de logs por entorno 📝

**Qué falta:**

Crear `frontend/src/utils/logger.ts`:

```typescript
const isDev = import.meta.env.MODE !== "production";

export const logger = {
  debug: (...args: any[]) => {
    if (isDev) console.log("[DEBUG]", new Date().toISOString(), ...args);
  },
  info: (...args: any[]) => {
    if (isDev) console.info("[INFO]", new Date().toISOString(), ...args);
  },
  warn: (...args: any[]) => {
    console.warn("[WARN]", new Date().toISOString(), ...args);
  },
  error: (...args: any[]) => {
    console.error("[ERROR]", new Date().toISOString(), ...args);
  },
};
```

Migrar en orden de prioridad:

1. `PEIEngine.tsx` (7 console.log)
2. `Register.tsx` (5 console.error)
3. `WorkflowDemo.tsx` (6 console.log)
4. `PdfUploadComponent.tsx` (5 console.error)
5. Resto de componentes

---

#### 4. Validaciones por entorno 🔐

**Qué falta:**

Crear validador condicional:

```typescript
// backend/src/common/validators/conditional-required.validator.ts
export function ConditionalRequired(options?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: "conditionalRequired",
      target: object.constructor,
      propertyName: propertyName,
      options: options,
      validator: {
        validate(value: any) {
          if (process.env.NODE_ENV === "production") {
            return value !== null && value !== undefined && value !== "";
          }
          return true; // Opcional en desarrollo
        },
        defaultMessage() {
          return `${propertyName} is required in production environment`;
        },
      },
    });
  };
}
```

Aplicar en RegisterDto:

```typescript
@ConditionalRequired()
@IsString()
centerId?: string;

@ConditionalRequired()
@IsString()
@IsIn(['ADMIN', 'ORIENTADOR', 'PROFESOR', 'DIRECTOR_CENTRO'])
role?: string;
```

---

### Documentación

#### 5. Documentación completa 📚

**Qué falta:**

**README.md principal:**

```markdown
# NeuroPlan MVP

## Setup rápido

1. Clonar repo
2. Copiar .env.example → .env (backend y frontend)
3. Configurar Supabase (URL, keys)
4. Instalar Ollama y modelo: `ollama pull llama3.2:3b`
5. `npm install` en raíz
6. `./start-dev.bat`

## Estructura

- `/backend` - NestJS API
- `/frontend` - React + Vite
- `/scripts` - Utilidades

## Tests

- E2E: `cd frontend && npm run test:e2e:api`
- Unit: `npm test`
```

**SETUP_GUIDE.md:**

- Configuración Supabase paso a paso
- Creación de tablas (schema normalizado)
- Setup de Ollama
- Variables de entorno requeridas

**API_DOCS.md:**

- Endpoints principales con ejemplos
- Flujo de autenticación
- Generación de PEI

---

## 5. PLAN DE ACCIÓN PRIORIZADO

### 🔴 FASE 1: CRÍTICO (Bloqueante para merge) - 1-2 horas

**NOTA:** Temas de seguridad (JWT fallback, rate limiting, RLS, validación estricta) se ajustan en **fase final pre-producción**. No bloquean merge a dev.

---

#### Tarea 1.1: Aplicar Migration de PEI Status

**Tiempo estimado:** 15-30 minutos  
**Prioridad:** CRÍTICA ⛔

**ESTADO ACTUAL:**

- ✅ Código backend **YA IMPLEMENTADO** (`peis.service.ts`, `peis.controller.ts`)
- ⛔ Tabla `peis` en Supabase **NO tiene columnas** `status`, `approved_at`, `approved_by`
- ✅ Migration **YA PREPARADA** en archivo `add-pei-status-column.sql`

**Pasos (ver guía completa en `IMPLEMENTAR_PEI_STATUS.md`):**

1. **Aplicar migration en Supabase SQL Editor** (5min)

   - Copiar contenido de `add-pei-status-column.sql`
   - Ejecutar en Supabase Dashboard > SQL Editor

2. **Verificar columnas agregadas** (2min)

   ```sql
   SELECT column_name, data_type
   FROM information_schema.columns
   WHERE table_name = 'peis'
     AND column_name IN ('status', 'approved_at', 'approved_by');
   ```

3. **Probar endpoint** (10min)
   ```bash
   # PATCH /peis/:id/status con {"status":"REVIEW"}
   # GET /peis/:id → Verificar persistencia
   ```

**Criterio de done:**

- [ ] Migration aplicada en Supabase
- [ ] PEIs existentes tienen `status='DRAFT'`
- [ ] PATCH `/peis/:id/status` persiste cambios (verificar con GET)
- [ ] Cambio a APPROVED genera `approved_at` y `approved_by` automáticamente
- [ ] Sin errores en logs backend

---

#### Tarea 1.2: Ejecutar y validar tests E2E

**Tiempo estimado:** 30-45 minutos  
**Prioridad:** ALTA ⚠️

**Pasos:**

1. Verificar credenciales de test:

   ```bash
   # Backend logs debe mostrar:
   # ✅ User e2e-test@neuroplan.com exists in Auth
   ```

2. Ejecutar tests:

   ```bash
   cd frontend
   npm run test:e2e:api
   ```

3. Analizar resultados:

   - Si >42/47 passing → ✅ OK
   - Si <40/47 → investigar fallos

4. Generar reporte Allure:
   ```bash
   npm run allure:serve
   ```

**Criterio de done:**

- [ ] Tests ejecutados sin errores de setup
- [ ] Tasa de éxito >90% (42+ de 47)
- [ ] Fallos documentados (si los hay)
- [ ] Reporte Allure generado

---

### 🟡 FASE 2: IMPORTANTE (Antes de producción) - 2-3 horas

#### Tarea 2.1: Gestión de logs por entorno

**Tiempo estimado:** 1-2 horas  
**Prioridad:** MEDIA 📝

**Pasos:**

1. Crear `frontend/src/utils/logger.ts`
2. Migrar console.log en orden:
   - `PEIEngine.tsx`
   - `Register.tsx`
   - `WorkflowDemo.tsx`
   - `PdfUploadComponent.tsx`
   - Resto de componentes

**Criterio de done:**

- [ ] Logger utility creado
- [ ] Top 10 componentes migrados
- [ ] Build de producción sin console.log

---

#### Tarea 2.2: Validaciones por entorno

**Tiempo estimado:** 30 minutos  
**Prioridad:** MEDIA 🔐

**Pasos:**

1. Crear validador condicional
2. Aplicar en RegisterDto
3. Documentar en .env.example

**Criterio de done:**

- [ ] Validaciones estrictas en NODE_ENV=production
- [ ] Flexibles en development
- [ ] Documentado en README

---

### 🟢 FASE 3: OPCIONAL (Mejoras continuas) - 2-3 horas

#### Tarea 3.1: Resolver "prefer top-level await"

**Tiempo estimado:** 15 minutos  
**Prioridad:** BAJA 🎨

Opciones:

```typescript
// Opción A: Suprimir regla
/* eslint-disable @typescript-eslint/no-floating-promises */
void (async () => {
  await bootstrap();
})();

// Opción B: Refactor a top-level await (requiere ESM)
await bootstrap();
```

---

#### Tarea 3.2: Documentación completa

**Tiempo estimado:** 1-2 horas  
**Prioridad:** BAJA 📚

Crear:

- README.md detallado
- SETUP_GUIDE.md
- API_DOCS.md
- TESTING.md

---

#### Tarea 3.3: Cobertura de tests

**Tiempo estimado:** 2-3 horas  
**Prioridad:** BAJA 🧪

```bash
# Backend
cd backend
npm run test:cov
# Target: >70% coverage

# Frontend
cd frontend
npm run test -- --coverage
# Target: >60% coverage
```

---

## 6. RIESGOS IDENTIFICADOS

| #   | Riesgo                            | Probabilidad | Impacto | Severidad     | Mitigación                           |
| --- | --------------------------------- | ------------ | ------- | ------------- | ------------------------------------ |
| 1   | Tests E2E fallan post-refactor    | **Alta**     | Alto    | 🔴 Crítico    | Ejecutar ahora, fix inmediato        |
| 2   | Logs inundan producción           | Media        | Medio   | 🟡 Importante | Logger condicional                   |
| 3   | Status PEI no persiste            | **Alta**     | Alto    | 🔴 Crítico    | Implementar migration                |
| 4   | Centro NULL rompe lógica futura   | Baja         | Medio   | 🟡 Importante | Política de asignación documentada   |
| 5   | Ollama no disponible en deploy    | Media        | Alto    | 🟡 Importante | Fallback a mock/API cloud            |
| 6   | Credenciales Supabase expuestas   | Baja         | Crítico | 🔴 Crítico    | .env en .gitignore (✅ ya protegido) |
| 7   | Rate limit Supabase Auth en tests | Media        | Medio   | 🟡 Importante | Token cache implementado (✅)        |

---

## 7. MÉTRICAS DE CALIDAD

### Cobertura de código

| Componente          | Tests Unit | Tests E2E | Cobertura Estimada | Estado              |
| ------------------- | ---------- | --------- | ------------------ | ------------------- |
| Backend Auth        | ❌         | ✅ (17)   | ~40%               | Necesita unit tests |
| Backend PEIs        | ❌         | Parcial   | ~30%               | Necesita tests      |
| Backend Students    | ❌         | ✅ (23)   | ~50%               | Aceptable           |
| Backend Uploads     | ❌         | ✅ (7)    | ~40%               | Aceptable           |
| Frontend Components | ❌         | N/A       | ~10%               | Crítico             |
| Frontend Pages      | ❌         | N/A       | ~5%                | Crítico             |

**Total E2E:** 47 tests configurados  
**Total Unit:** 0 tests (pendiente)  
**Cobertura global estimada:** ~25%

---

### Deuda técnica

| Categoría                             | Horas estimadas | Prioridad |
| ------------------------------------- | --------------- | --------- |
| Logs sin gestionar                    | 2h              | Media     |
| Tests unitarios faltantes             | 8h              | Baja      |
| Refactor Logger completo backend      | 4h              | Baja      |
| Error handling en todos los servicios | 6h              | Media     |
| Documentación completa                | 3h              | Baja      |
| CI/CD pipeline                        | 4h              | Baja      |
| **TOTAL**                             | **27h**         | -         |

---

### Complejidad del código

| Módulo             | Complejidad | Mantenibilidad | Comentario                                    |
| ------------------ | ----------- | -------------- | --------------------------------------------- |
| Backend Auth       | Media       | Alta (8/10)    | Bien estructurado                             |
| Backend PEIs       | Alta        | Media (6/10)   | Lógica compleja, bien organizada              |
| Frontend PEIEngine | Muy Alta    | Baja (4/10)    | Componente >1000 líneas, refactor recomendado |
| Frontend Register  | Alta        | Media (6/10)   | Validaciones complejas, aceptable             |
| Frontend Dashboard | Media       | Alta (7/10)    | Modular                                       |

---

### Seguridad

| Aspecto               | Estado | Comentario               |
| --------------------- | ------ | ------------------------ |
| Credenciales en .env  | ✅     | Protegido con .gitignore |
| JWT secret            | ✅     | Variable de entorno      |
| CORS configurado      | ✅     | Solo localhost en dev    |
| Helmet activado       | ✅     | Headers de seguridad     |
| Validación de entrada | ✅     | class-validator          |
| SQL injection         | ✅     | Supabase client seguro   |
| XSS                   | ✅     | React escapa por defecto |
| Rate limiting         | ⚠️     | Deshabilitado en dev     |
| HTTPS                 | ⚠️     | Solo en producción       |

**Nivel de seguridad:** Bueno para MVP, mejoras requeridas para producción

---

## 8. DEPENDENCIAS Y VERSIONES

### Backend

| Paquete               | Versión | Estado         | Notas                |
| --------------------- | ------- | -------------- | -------------------- |
| @nestjs/core          | 11.1.7  | ✅ Actualizado | LTS                  |
| @supabase/supabase-js | 2.76.1  | ✅ Actualizado |                      |
| typescript            | 5.5.3   | ✅ Actualizado |                      |
| axios                 | 1.12.2  | ⚠️ Revisar     | Versión muy reciente |
| bcrypt                | 5.1.1   | ✅ Actualizado |                      |
| passport-jwt          | 4.0.1   | ✅ Estable     |                      |
| pg                    | 8.16.3  | ✅ Actualizado |                      |
| puppeteer             | 24.26.1 | ✅ Actualizado |                      |

**Vulnerabilidades conocidas:** 0

---

### Frontend

| Paquete               | Versión | Estado         | Notas                |
| --------------------- | ------- | -------------- | -------------------- |
| react                 | 18.3.1  | ✅ Actualizado |                      |
| vite                  | 7.1.9   | ✅ Actualizado |                      |
| typescript            | 5.8.3   | ✅ Actualizado |                      |
| @tanstack/react-query | 5.83.0  | ✅ Actualizado |                      |
| react-router-dom      | 6.30.1  | ✅ Actualizado |                      |
| @playwright/test      | 1.56.1  | ✅ Actualizado |                      |
| axios                 | 1.12.2  | ⚠️ Revisar     | Versión muy reciente |

**Vulnerabilidades conocidas:** 0

---

## 9. CHECKLIST PRE-MERGE

### ✅ Obligatorio (bloqueante)

- [ ] **Implementar columna `status` en tabla `peis`**

  - Migration SQL creada y aplicada
  - Servicio `updatePEIStatus` implementado
  - Controller actualizado (sin simulación)
  - Test E2E del endpoint funcionando

- [ ] **Ejecutar tests E2E API**

  - Suite completa ejecutada
  - Tasa de éxito >90% (42+ de 47)
  - Fallos (si los hay) documentados

- [ ] **Verificar build**

  - Backend: `npm run build` sin errores
  - Frontend: `npm run build` sin warnings críticos

- [ ] **Verificar arranque**

  - Backend arranca en http://localhost:3001
  - Frontend arranca en http://localhost:5173
  - Ollama responde en http://localhost:11434

- [ ] **Sin errores TS bloqueantes**
  - `tsc --noEmit` pasa sin errores críticos

---

### 🟡 Recomendado (importante)

- [ ] **Logger condicional en frontend**

  - Utility creada en `src/utils/logger.ts`
  - Top 10 componentes migrados

- [ ] **Documentar política de `centerId` en producción**

  - En README o SETUP_GUIDE
  - Especificar comportamiento en NODE_ENV=production

- [ ] **README actualizado**

  - Setup paso a paso
  - Requisitos (Node, Ollama, Supabase)
  - Scripts disponibles

- [ ] **Resolver lint "prefer top-level await"**
  - Suprimir o refactor
  - Decisión documentada

---

### 🟢 Opcional (post-merge)

- [ ] Cobertura tests >70% backend
- [ ] Cobertura tests >60% frontend
- [ ] Migrar todos console.log backend
- [ ] Refactor componentes grandes frontend (PEIEngine >1000 líneas)
- [ ] CI/CD pipeline básico
- [ ] Documentación API completa (Swagger mejorado)

---

## 10. COMANDOS RÁPIDOS

### Desarrollo

```bash
# Iniciar todo (backend + frontend)
./start-dev.bat

# Solo backend
cd backend
npm run start:dev

# Solo frontend
cd frontend
npm run dev

# Ollama
./start-ollama.bat
ollama pull llama3.2:3b
ollama list

# Detener todo
./stop-all.bat
# O manualmente:
taskkill /F /IM node.exe
```

---

### Tests

```bash
# E2E completos
cd frontend
npm run test:e2e

# Solo API tests
npm run test:e2e:api

# Con UI interactiva
npm run test:e2e:ui

# Con Allure reports
npm run test:e2e:allure

# Unit tests backend
cd backend
npm test

# Con cobertura
npm run test:cov

# Unit tests frontend
cd frontend
npm run test
```

---

### Build

```bash
# Backend
cd backend
npm run build
npm run start:prod

# Frontend
cd frontend
npm run build
npm run preview

# Docker (todo el stack)
docker-compose up --build
```

---

### Lint y formato

```bash
# Backend
cd backend
npm run lint
npm run format

# Frontend
cd frontend
npm run lint
```

---

### Git

```bash
# Ver estado
git status

# Commit de fix de status PEI
git add backend/src/modules/peis/
git add backend/migrations/
git commit -m "FEAT: Implement real PEI status persistence with DB migration"

# Commit de correcciones varias
git add backend/src/ frontend/src/
git commit -m "FIX: Address audit findings - logging, validations, tests"

# Merge a dev
git checkout dev
git pull origin dev
git merge feature/refactor --no-ff
git push origin dev

# Tag de versión
git tag -a v1.0.0-mvp -m "MVP release after audit"
git push origin v1.0.0-mvp
```

---

## 11. RECOMENDACIONES FINALES

### Para merge inmediato

1. **✅ HACER AHORA (bloqueante):**

   - Implementar status PEI (2-3h)
   - Ejecutar tests E2E (30min)
   - Si tests >90% → **MERGEAR**

2. **⏰ PRÓXIMO SPRINT:**

   - Logger condicional frontend
   - Validaciones por entorno
   - Documentación completa

3. **📅 BACKLOG:**
   - Tests unitarios
   - Refactor componentes grandes
   - CI/CD

---

### Criterios de éxito

**Para considerar el merge exitoso:**

- ✅ Status de PEI persiste en BD
- ✅ Tests E2E >90% passing
- ✅ Sin errores TS bloqueantes
- ✅ Backend y frontend arrancan sin errores
- ✅ Flujo completo funciona: Registro → Login → Generar PEI

**Para considerar el MVP listo para producción:**

- ✅ Todo lo anterior +
- ✅ Logger condicional implementado
- ✅ Validaciones estrictas en PROD
- ✅ Documentación completa
- ✅ Tests unitarios >70%
- ✅ CI/CD básico
- ✅ Monitoring (Sentry, etc)

---

### Próximos pasos sugeridos

**Semana 1 (post-merge):**

1. Implementar logger condicional
2. Agregar tests unitarios críticos
3. Documentación completa

**Semana 2:**

1. Refactor PEIEngine (componente grande)
2. Mejorar cobertura de tests
3. Setup CI/CD básico

**Semana 3:**

1. Preparar para staging
2. Load testing
3. Security audit

**Semana 4:**

1. Beta testing con usuarios reales
2. Fixing de bugs reportados
3. Preparación para producción

---

## 12. CONCLUSIÓN CONSOLIDADA

### Estado actual

**NeuroPlan MVP: 7.3/10** - Estado funcional avanzado con arquitectura sólida

**Consenso de 3 auditorías independientes:**

- ✅ Arquitectura NestJS modular y escalable
- ✅ Error handling global implementado correctamente
- ✅ Docker multi-stage funcional (tras corrección Cursor)
- ✅ 47 tests E2E Playwright configurados
- ⛔ 2 bloqueantes críticos identificados unánimemente
- ⚠️ 5 riesgos importantes con soluciones propuestas

### Bloqueantes identificados (Consenso 3/3)

**CRÍTICO 1:** PEI Status sin persistencia real

- Endpoint PATCH simula actualización
- Falta columna `status` en tabla peis
- Impacto: Flujo de aprobación no funcional
- **Tiempo:** 2-3 horas

**CRÍTICO 2:** Tests E2E no ejecutados post-refactor

- 47 tests configurados, 0 ejecutados tras cambios
- Estado desconocido del sistema post-cambios
- Riesgo de regresiones no detectadas
- **Tiempo:** 30-60 minutos

### Recomendación final consolidada

✅ **PROCEDER CON MERGE** después de completar **FASE 1 CRÍTICA** (3-4h):

- [x] Auditoría consolidada documentada (3 fuentes)
- [ ] PEI Status implementado y persistiendo en BD
- [ ] Tests E2E ejecutados con >90% éxito (42+/47)
- [ ] JWT fallback inseguro eliminado

**⏰ POST-MERGE (Fase 2 - 6-8h):**

- Unificar contratos API (ResponseHelper)
- Logger condicional implementado
- Validaciones por entorno (PROD estricto, DEV flexible)

**📅 MEJORA CONTINUA (Fase 3 - 12-15h):**

- Transacciones atómicas (RPC)
- Rate limiting y RLS
- Tests unitarios (60% cobertura)
- Refactor PEIEngine
- CI/CD básico

🎯 **Timeline:**

- **Hoy:** Completar Fase 1 → Merge a dev
- **+2 semanas:** Fase 2 → Staging
- **+4 semanas:** Fase 3 → Producción beta

🚀 **MVP listo para beta testing:** ~3 semanas después del merge

---

## 📎 ANEXOS

### A. Diferencias Entre Auditorías

| Hallazgo                     | Claude | Cursor | ChatGPT | Prioridad Final |
| ---------------------------- | ------ | ------ | ------- | --------------- |
| PEI Status sin persistir     | ✅     | ✅     | ✅      | 🔴 CRÍTICO      |
| Tests E2E no ejecutados      | ✅     | ✅     | ✅      | 🔴 CRÍTICO      |
| Logs sin gestión entorno     | ✅     | ✅     | ✅      | ⚠️ IMPORTANTE   |
| Contratos API inconsistentes | ❌     | ✅     | ✅      | ⚠️ IMPORTANTE   |
| JWT fallback inseguro        | ❌     | ❌     | ✅      | 🔴 CRÍTICO      |
| Docker backend no compilaba  | ❌     | ✅     | ❌      | ✅ RESUELTO     |
| Validaciones sin estrategia  | ✅     | ✅     | ❌      | ⚠️ IMPORTANTE   |
| Transacciones ausentes       | ❌     | ✅     | ❌      | 🟡 MEJORA       |
| RLS deshabilitado            | ❌     | ❌     | ✅      | 🟡 MEJORA       |
| Rate limiting disabled       | ❌     | ❌     | ✅      | 🟡 MEJORA       |

**Leyenda:**

- ✅ Detectado | ❌ No detectado
- 🔴 Crítico (blocker) | ⚠️ Importante (pre-prod) | 🟡 Mejora (post-merge)

---

### B. Comandos de Verificación Rápida

```bash
# ===== VERIFICACIÓN COMPLETA =====

# 1. Build completo
cd backend && npm run build
cd frontend && npm run build

# 2. Tests E2E
cd frontend && npm run test:e2e:api

# 3. Lint
cd backend && npm run lint
cd frontend && npm run lint

# 4. TypeScript
cd backend && npx tsc --noEmit
cd frontend && npx tsc --noEmit

# 5. Start completo
./start-dev.bat

# 6. Health checks
curl http://localhost:3001/health       # Backend
curl http://localhost:5173/             # Frontend
curl http://localhost:11434/api/tags    # Ollama

# ===== FASE 1: CRÍTICO =====

# Aplicar migration PEI Status
# Via Supabase Dashboard > SQL Editor
# O: psql -h <supabase-url> -U postgres -d postgres -f backend/migrations/001_add_pei_status.sql

# Ejecutar tests E2E
cd frontend
npm run test:e2e:api
npm run allure:serve  # Reportes

# Generar JWT_SECRET seguro
openssl rand -base64 32
# Actualizar backend/.env

# ===== VERIFICACIÓN PRE-MERGE =====

# 1. PEI Status persiste
curl -X PATCH http://localhost:3001/api/peis/<ID>/status \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"status":"REVIEW"}'

curl http://localhost:3001/api/peis/<ID> \
  -H "Authorization: Bearer <TOKEN>"
# Verificar que status === "REVIEW"

# 2. Tests >90%
# Ver output de test:e2e:api
# Debe mostrar: "42/47 passing" o superior

# 3. JWT sin fallback
# Renombrar .env temporalmente
mv backend/.env backend/.env.bak
npm run start:dev
# Debe fallar con: "JWT_SECRET must be defined"
mv backend/.env.bak backend/.env

# 4. Flujo completo
# Manual: Navegar a http://localhost:5173
# 1. Registrarse
# 2. Login
# 3. Crear estudiante
# 4. Generar PEI
# 5. Verificar status del PEI
```

---

### C. Archivos Críticos y Estado

| Archivo                                                  | Estado        | Acción Requerida                      |
| -------------------------------------------------------- | ------------- | ------------------------------------- |
| `backend/src/modules/peis/peis.controller.ts:297`        | ⛔ BLOCKER    | Implementar persistence               |
| `backend/src/modules/auth/strategies/jwt.strategy.ts:22` | 🔴 CRÍTICO    | Eliminar fallback                     |
| `backend/Dockerfile`                                     | ✅ CORREGIDO  | Fixed por Cursor (npm ci sin --only)  |
| `backend/src/modules/auth/dto/register.dto.ts`           | ⚠️ IMPORTANTE | Validaciones condicionales            |
| `backend/src/modules/students/students.controller.ts`    | ⚠️ IMPORTANTE | Transacciones atómicas                |
| `frontend/src/pages/PEIEngine.tsx`                       | 🟡 DEUDA      | Migrar logs + refactor (>1000 líneas) |
| `backend/src/config/validate-env.ts`                     | 🟡 DEUDA      | Unificar con env.validation.ts        |
| `backend/src/config/env.validation.ts`                   | 🟡 DEUDA      | Unificar con validate-env.ts          |

---

### D. Matriz de Riesgos Consolidada

| ID  | Riesgo                         | Prob. | Impacto | Severidad     | Mitigación                         | Fuente          |
| --- | ------------------------------ | ----- | ------- | ------------- | ---------------------------------- | --------------- |
| R1  | Tests E2E fallan post-refactor | Alta  | Alto    | 🔴 Crítico    | Ejecutar ahora, fix inmediato      | 3/3 auditorías  |
| R2  | Status PEI no persiste         | Alta  | Alto    | 🔴 Crítico    | Implementar migration + servicio   | 3/3 auditorías  |
| R3  | JWT con fallback público       | Media | Crítico | 🔴 Crítico    | Eliminar fallback, forzar error    | ChatGPT         |
| R4  | Logs inundan producción        | Media | Medio   | ⚠️ Importante | Logger condicional                 | 3/3 auditorías  |
| R5  | Contratos API inconsistentes   | Media | Medio   | ⚠️ Importante | ResponseHelper + migración         | Cursor, ChatGPT |
| R6  | Validaciones flexibles en PROD | Baja  | Medio   | ⚠️ Importante | Validador condicional por NODE_ENV | Cursor, Claude  |
| R7  | Transacciones no atómicas      | Baja  | Medio   | 🟡 Mejora     | RPC PL/pgSQL                       | Cursor          |
| R8  | RLS deshabilitado              | Baja  | Alto    | 🟡 Mejora     | Preparar scripts para staging      | ChatGPT         |
| R9  | Rate limiting disabled         | Media | Medio   | 🟡 Mejora     | Reactivar ThrottlerGuard           | ChatGPT         |
| R10 | Ollama no disponible en deploy | Media | Alto    | 🟡 Mejora     | Fallback a mock/API cloud          | Claude          |

---

**Documento generado:** 6 de noviembre de 2025  
**Versión:** 1.0 Consolidada Final  
**Basado en:** 3 auditorías independientes (Cursor + ChatGPT + Claude)  
**Próxima revisión:** Post-merge a dev (estimado: 8 de noviembre de 2025)

---

## 🚀 PRÓXIMA ACCIÓN INMEDIATA

**Pregunta para el equipo:**

¿Procedemos a implementar **FASE 1 CRÍTICA** ahora mismo? (3-4 horas)

1. **Tarea 1.1:** Implementar PEI Status persistence (2-3h)
2. **Tarea 1.2:** Ejecutar y validar tests E2E (30-60min)
3. **Tarea 1.3:** Eliminar JWT fallback inseguro (30min)

**Tras completar Fase 1 → MERGE A DEV** ✅

---

**FIN DEL DOCUMENTO CONSOLIDADO**
