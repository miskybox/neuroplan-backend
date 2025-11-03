# Auditoría técnica integral y plan de acción

Fecha: 2025-11-03
Repositorio: neuroplan-mvp
Rama: feature/clean-code
Entorno: Windows (cmd.exe), local dev

## Resumen ejecutivo

El proyecto está bien encaminado: arquitectura clara (NestJS + React/Vite + Supabase), endpoints principales definidos (auth, students, uploads/PEI), y flujos clave (registro/login y análisis PDF con fallback) funcionando a nivel básico. Los riesgos principales se concentran en: seguridad (uso de service role, falta de RLS y guards), consistencia del cliente HTTP en el front, robustez de los endpoints de uploads/LLM y ausencia de pruebas/CI.

Acciones prioritarias (quick wins, 1-3 días):
- Proteger /uploads y /students con JwtAuthGuard + rate limiting; derivar userId desde el JWT.
- Unificar cliente HTTP en frontend (axios) y retirar duplicación con useApiRequest.
- Añadir /api/auth/me y usarlo para restaurar sesión en AuthContext.
- Cambiar generate-pdf-report a respuesta application/pdf (stream) y descarga blob en el front.
- Documentar API con Swagger básico y health/ready consistentes.

Impacto esperado: reducción de errores 4xx/5xx en front, cierre de brechas de seguridad obvias, UX más estable y base sólida para pruebas y CI.

---

## Arquitectura y estado actual

- Backend: NestJS 11 (TypeScript), global prefix /api, helmet, class-validator; módulos auth, students, uploads (pdf-analysis/report/models), peis; Supabase (Auth + DB); Ollama opcional con fallback; scripts de dev con `nest start --watch`.
- Frontend: React + Vite + TS; Tailwind + shadcn/ui; axios base /api; AuthContext; Register/Login; componente de subida PDF con badge de fallback.
- Infra: Puertos 3001 (backend), 5173/5174 (frontend), 11434 (Ollama); CORS permite 5173/5174; .env por app; algunos scripts y SQL en backend.

---

## Hallazgos por área

### 1) Seguridad y secretos
- backend/src/db.ts
  - Se crea cliente Supabase con service role key (correcto en backend), pero:
    - No hay separación clara de operaciones privilegiadas vs. de usuario.
    - testSupabaseConnection lee tabla `users` directamente; conviene un endpoint health que no exponga detalles y un check de conectividad más neutro.
  - Falta masking de errores: actualmente se loguean errores de Supabase completos (riesgo de exponer metadatos sensibles en logs).
- Falta JwtAuthGuard en endpoints sensibles (/uploads, /students, /peis) y throttling en operaciones pesadas (pdf-analysis).
- Política CORS abierta a dev; no hay lista de dominios para prod.
- No hay RLS activas/validadas en Supabase para tablas `students`, `peis`, `activity_logs`.

Recomendaciones:
- Aplicar JwtAuthGuard + `@UseGuards` en controladores sensibles y @Throttler para rate limiting.
- Implementar RLS (Row Level Security) en Supabase y policies por usuario (created_by).
- Centralizar manejo de errores con un filtro global (HttpExceptionFilter) que omita detalles internos.
- Definir CORS por entorno (dev vs prod) y validar cabeceras permitidas.

### 2) Autenticación y sesión
- Endpoints auth (register/login) están; falta `GET /api/auth/me` para bootstrap de sesión en frontend.
- AuthContext limpia correctamente el token en logout, pero no restaura estado desde /auth/me al cargar.

Recomendaciones:
- Añadir /auth/me que devuelva el usuario; en el front, llamar al iniciar la app para restaurar sesión segura.
- Estandarizar el almacenamiento de tokens (localStorage) y manejo de expiración/refresh.

### 3) Modelo de datos y RLS (Supabase)
- Tablas `users`, `students`, `peis`, `activity_logs`; se usa `created_by` para ownership.
- No se observan índices explícitos ni políticas documentadas.

Recomendaciones:
- Índices: `students(created_by, created_at)`, `peis(student_id, created_at)`, `activity_logs(user_id, created_at)`.
- RLS policies típicas:
  - users: self-read/update (o gestionado por servicio).
  - students: usuario puede SELECT/INSERT/UPDATE/DELETE donde `created_by = auth.uid()`.
  - peis: similar, join con students del mismo usuario.
  - activity_logs: SELECT propio; INSERT por backend con service role.
- Generar tipos a partir del esquema (supabase gen types) para tipar el cliente.

### 4) Calidad del backend (NestJS)
- `db.ts`: IIFE de test al final (side effect) en arranque; preferible `onModuleInit` o un check en `main.ts`.
- Falta separación clara de servicios que usan service role para tareas privilegiadas.
- Uploads: almacenamiento `memoryStorage` sin límites estrictos; validar tamaño y mimetype; proteger con auth/roles.
- PDF analysis: integra con Ollama con fallback; falta timeout y circuit breaker más robustos, y logs con requestId.
- Generación de PDF: responde base64; UX mejor con streaming application/pdf + Content-Disposition.

Recomendaciones:
- Mover test de conexión a un servicio de HealthModule; exponer `/api/health` y `/api/ready`.
- Añadir `nestjs/throttler` en `uploads` (p.ej. 5 req/min/usuario).
- Validar tamaño máx (p.ej. 10MB) y rechazar tipos no PDF antes de parsear.
- Cambiar generate-pdf-report a stream/buffer y ajustar front.
- Añadir pino/logger central con correlación (requestId) y niveles.

### 5) Calidad del frontend (React/Vite)
- axios client en `src/services/api.ts` normalizado a /api (bien). Existe duplicación con `useApiRequest` que también normaliza /api.
- Register.tsx fue corregido (form semantics, tipos password, onSubmit).
- Falta bootstrap de sesión (/auth/me) y unificación de capa HTTP.

Recomendaciones:
- Eliminar `useApiRequest` o re-implementarlo como wrapper sobre axios para peticiones especiales (upload progress) manteniendo un solo origen de verdad.
- Manejar errores estandarizados: toasts con mensajes amigables y mapeo de códigos.
- Descarga de PDFs como blob con `Content-Type: application/pdf`.

### 6) Accesibilidad y UX
- Hay hojas de estilo de accesibilidad y un panel; bien encaminado.
- Mejorar foco, skip links, roles ARIA en formularios y lector de pantalla en feedback (éxito/error).

Recomendaciones:
- Añadir pruebas ligeras de accesibilidad (axe) y checklist WCAG AA para pantallas clave.

### 7) Observabilidad y logging
- Logs existen pero sin estructura estándar ni requestId; no hay métricas.

Recomendaciones:
- pino-http o morgan con requestId; métricas básicas (Prometheus) y endpoint `/metrics` opcional.
- Estructurar logs para PDF/LLM con campos: userId, size, duration, model, fallback.

### 8) Documentación y DX
- README presentes; falta Swagger/OpenAPI y guía de entornos.
- Scripts de dev correctos (nest watch); faltan scripts para lint/test.

Recomendaciones:
- Añadir Swagger en `/api/docs` con esquemas (Auth, Students, Uploads, PEIs).
- Documentar variables de entorno (env.example) por app y matrix por entorno (dev/staging/prod).

### 9) Pruebas y CI/CD
- No hay unit/e2e configuradas ni pipeline.

Recomendaciones:
- Unit (backend): AuthService (mock Supabase), PdfAnalysisService (mock pdf-parse y Ollama).
- E2E: supertest para register/login y pdf-analysis.
- CI: GitHub Actions para lint, build y test (front/back) con cache.

### 10) Docker y despliegue
- No hay Dockerfiles ni compose; Ollama local.

Recomendaciones:
- Dockerfiles para front y back; docker-compose con servicio Ollama (o bandera para desactivar) y base de datos si aplica; variables mediante `.env`.
- ADR de migración a Bedrock (AWS) con costos y límites.

---

## Riesgos clave y mitigación

- Exposición indebida por falta de guards/RLS: Mitigar con JwtAuthGuard + RLS + policies; validar por tests.
- Abuso de endpoints de análisis PDF: Limitar tamaño y tasa; monitorear duración y rechazar formatos no válidos.
- Estado de sesión inconsistente en front: Implementar /auth/me y bootstrap; unificar cliente HTTP.
- Ausencia de pruebas y CI: Introducir pruebas mínimas y pipeline; impedir regresiones.

---

## Plan de acción por fases

### Fase 0 – Quick Wins (1-3 días)
1) Seguridad inmediata
- Añadir JwtAuthGuard a /uploads (excepto test) y /students.
- Implementar `@Throttle(5, 60)` en pdf-analysis.
- Validar MAX_FILE_SIZE y mimetype en upload.
Criterio de aceptación: Peticiones sin JWT a /uploads reciben 401; payloads >10MB o no-PDF reciben 400; logs reflejan rechazos.

2) Sesión y cliente HTTP
- Crear GET /api/auth/me; AuthContext llama al iniciar.
- Unificar capa HTTP en axios; retirar duplicación de useApiRequest.
Criterio: Al recargar, el usuario autenticado aparece sin relogin; no hay /api/api ni Network Error.

3) PDF streaming
- Cambiar generate-pdf-report a `application/pdf` y descarga blob en front.
Criterio: Descargar PDF sin base64; Content-Disposition correcto con nombre de archivo.

4) Swagger y health
- Añadir Swagger básico y `/api/health`/`/api/ready` consistentes.
Criterio: `/api/docs` operativo con esquemas y ejemplos; health devuelve 200 y ready verifica dependencias.

### Fase 1 – Semana 1-2
- RLS y policies Supabase; índices.
- Logger estructurado con requestId (pino-http) y mejor manejo de errores global.
- Pruebas unitarias mínimas (AuthService, PdfAnalysisService) y e2e básicas.
- GitHub Actions (lint/build/test) para front/back.
Criterios: Tests >60% cobertura en servicios core; pipeline verde.

### Fase 2 – Semana 3-4
- Dockerfiles y docker-compose (backend, frontend, Ollama opcional).
- Observabilidad: métricas básicas y dashboards simples.
- Accesibilidad: integrar axe en CI y resolver issues prioritarios.
- Documentación: guías de despliegue, variables por entorno, ADR Bedrock vs Ollama.
Criterios: `docker compose up` levanta todo; métricas disponibles; accesibilidad sin errores críticos.

### Fase 3 – Consolidación
- TS strict en back y front; eliminar `any` innecesarios; ESLint unificado.
- Endpoint PEIs consolidado con documentación y pruebas.
- Endurecer CORS por entorno; rotar claves Supabase si hubo exposición.
Criterios: Compila con strict; Swagger completo; escaneo de seguridad básico sin hallazgos críticos.

---

## Detalle por archivo sensible

- `backend/src/db.ts`
  - Dividir clientes (service vs user) y encapsular funciones privilegiadas.
  - Quitar IIFE de test; mover a HealthModule.
  - Tipar respuestas con tipos generados de Supabase.
  - Centralizar logs de errores con censura de detalles.

- `backend/src/modules/uploads/*`
  - Añadir JwtAuthGuard y Throttler; validar archivo antes de parsear.
  - Manejo de tiempo de espera para llamadas a LLM y fallback etiquetado.

- `frontend/src/services/api.ts` y `frontend/src/hooks/useApiRequest.ts`
  - Unificar en axios (un solo cliente). `useApiRequest` puede ser helper fino (opcional) o eliminarse.

- `frontend/src/pages/Register.tsx`
  - Correcto tras la corrección. Añadir mensajes de error consistentes de servidor y validaciones mínimas en cliente.

---

## Métricas y KPIs sugeridos
- Tasa de error 4xx/5xx por endpoint (objetivo <1%).
- Tiempo medio de análisis PDF (p50/p95) y ratio de fallbacks.
- Cobertura de tests backend (>60%) y frontend (>40%) inicial.
- TTFB endpoints críticos (health, auth, students).

---

## Quality gates (estado actual estimado)
- Build: Desconocido (no ejecutado en esta sesión) → Proponer pipeline que ejecute `npm run build` en front/back.
- Lint/Typecheck: Desconocido → Añadir scripts y ejecución en CI.
- Tests: No configurados → Implementar mínimos en Fase 1.

---

## Próximos pasos recomendados
1) Aplicar guards + throttling + validaciones en uploads/students.
2) Implementar /auth/me y bootstrap de sesión en el front.
3) Unificar cliente HTTP; retirar duplicación.
4) Migrar PDF a streaming y actualizar descarga en el front.
5) Añadir Swagger básico y health/ready.
6) Iniciar RLS e índices; preparar fixtures y tipos generados.
7) Crear pruebas mínimas y pipeline CI.

Si necesitas, puedo empezar por el primer bloque (guards/throttling/streaming PDF) y dejarte una PR lista para probar en tu entorno.