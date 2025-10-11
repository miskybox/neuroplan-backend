# 🔄 Backend Actual vs Spec Hackathon - Gap Analysis

## ✅ LO QUE YA TIENES (Funcionando)

### Estructura Base
- ✅ NestJS 10 + TypeScript
- ✅ Prisma ORM
- ✅ SQLite database (dev.db)
- ✅ Swagger docs en `/api/docs`
- ✅ CORS configurado para Vite (5173) ✨
- ✅ Validación global con class-validator
- ✅ Módulos organizados

### Módulos Implementados
- ✅ `prisma/` - Database service
- ✅ `peis/` - PEI generation & management
- ✅ `uploads/` - File uploads (PDF/images)
- ✅ `elevenlabs/` - TTS integration ($2000 premio)
- ✅ `linkup/` - Resources search (€500 premio)
- ✅ `n8n/` - Workflow automation (€500+€600 premio)

### Endpoints Existentes

#### Uploads
```
✅ POST /api/uploads/students - Crear estudiante
✅ GET  /api/uploads/students - Listar estudiantes
✅ GET  /api/uploads/students/:id - Detalle estudiante
✅ POST /api/uploads/reports/:studentId - Subir PDF/imagen
✅ GET  /api/uploads/reports/:id/download - Descargar reporte
```

#### PEIs
```
✅ POST  /api/peis/generate - Generar PEI con IA
✅ GET   /api/peis - Listar todos
✅ GET   /api/peis/:id - Ver PEI completo
✅ PATCH /api/peis/:id/status - Cambiar estado
✅ GET   /api/peis/:id/pdf - Descargar como PDF
```

#### ElevenLabs (Sponsor)
```
✅ POST /api/elevenlabs/text-to-speech
✅ POST /api/elevenlabs/pei/:id/audio
✅ GET  /api/elevenlabs/pei/:id/summary-audio
✅ GET  /api/elevenlabs/voices
```

#### Linkup (Sponsor)
```
✅ POST /api/linkup/search - Con tu API key real
✅ GET  /api/linkup/pei/:id/resources
```

#### n8n (Sponsor)
```
✅ POST /api/n8n/pei/:id/generated
✅ POST /api/n8n/pei/:id/approved
✅ GET  /api/n8n/stats
```

---

## ⚠️ GAPS vs SPEC HACKATHON

### 1. **Database: SQLite → PostgreSQL** 🔄

**Actual:**
```prisma
datasource db {
  provider = "sqlite"
  url      = "file:./dev.db"
}
```

**Spec requiere:**
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

**Impacto:** Bajo - SQLite funciona para demo, pero PostgreSQL es mejor para producción

**Acción:** Opcional - Agregar docker-compose.yml para PostgreSQL

---

### 2. **Schema de Base de Datos** 🔄

**Actual:** Modelo enfocado en Student → Report → PEI

**Spec requiere:** 
- `Report` (archivo subido)
- `Analysis` (análisis de Claude)
- `PEI` (plan generado)

**Diferencias:**
```diff
# Tu schema actual:
+ Student model (info del estudiante)
+ Report model (archivos)
+ PEI model (plan completo)
+ AudioFile model (ElevenLabs)
+ ResourceLink model (Linkup)
+ WorkflowExecution model (n8n)

# Spec quiere:
- Report model (similar)
- Analysis model (separado de PEI)
- PEI model (solo estructura del plan)
```

**Impacto:** Bajo - Tu modelo es más completo y funciona mejor

**Acción:** ✅ Mantener tu schema actual (es superior)

---

### 3. **SSE Streaming** ❌ FALTA

**Spec requiere:**
```
GET /api/reports/:id/process/stream
Content-Type: text/event-stream

Events:
- progress (OCR 0-30%)
- progress (Analysis 30-60%)
- progress (PEI Gen 60-90%)
- complete (Done 100%)
```

**Actual:** No implementado

**Impacto:** ALTO - Frontend necesita esto para mostrar progreso

**Acción:** ⚠️ CREAR ENDPOINT SSE

---

### 4. **Endpoint `/api/reports/upload`** 🔄 DIFERENTE

**Spec requiere:**
```
POST /api/reports/upload
→ Subir archivo directamente
→ Crear Report automáticamente
```

**Actual:**
```
POST /api/uploads/students (crear estudiante)
POST /api/uploads/reports/:studentId (subir reporte)
```

**Impacto:** Medio - Frontend espera flujo directo

**Acción:** 🔄 ADAPTAR o documentar flujo actual

---

### 5. **Puerto del Servidor** 🔧

**Spec requiere:** Puerto 3000

**Actual:** Puerto 3001

**Impacto:** Bajo - Fácil de cambiar

**Acción:** 
```env
PORT=3000  # Cambiar en .env
```

---

### 6. **Estructura de Respuestas** 🔄

**Spec espera:**
```json
{
  "report": {...},
  "analysis": {...},
  "pei": {...}
}
```

**Actual:** Respuestas más granulares

**Impacto:** Bajo - Frontend puede adaptarse

**Acción:** ✅ Mantener actual (mejor separación)

---

## 🎯 PLAN DE ACCIÓN INMEDIATO

### Prioridad P0 (Para que frontend funcione)

1. **✅ CORS ya configurado para 5173**
2. **⚠️ Crear endpoint SSE para progreso** ← CRÍTICO
3. **🔧 Cambiar puerto a 3000** ← Rápido
4. **📝 Documentar flujo upload actual** ← 5 minutos

### Prioridad P1 (Nice to have)

5. **🐳 Docker Compose con PostgreSQL** ← Opcional
6. **📊 Adaptar schema si necesario** ← Probablemente no
7. **✨ Mejorar responses para match spec** ← Si hay tiempo

---

## 🚀 COMANDOS INMEDIATOS

### 1. Cambiar puerto a 3000

```bash
# En .env
PORT=3000
```

### 2. Reiniciar servidor

```bash
npx ts-node src/main.ts
```

### 3. Crear endpoint SSE (necesito hacerlo)

---

## 📊 RESUMEN EJECUTIVO

### ✅ Backend está 85% listo para el spec

**Tienes:**
- ✅ Todos los módulos de sponsors
- ✅ CORS para frontend Vite
- ✅ Swagger docs completa
- ✅ Linkup con API real
- ✅ Estructura superior al spec

**Falta:**
- ⚠️ Endpoint SSE para progreso (CRÍTICO)
- 🔧 Puerto 3000 (fácil)
- 📝 Documentación del flujo

**Tiempo estimado para completar:** 30-45 minutos

---

## 🎨 RECOMENDACIÓN

### Opción A: Minimal (15 min)
1. Cambiar puerto a 3000
2. Crear endpoint SSE básico
3. Documentar flujo upload
→ **Frontend puede empezar YA**

### Opción B: Complete (45 min)
1. Todo de Opción A
2. Docker PostgreSQL
3. Adaptar responses
→ **100% spec compliant**

---

## 📝 PARA EL FRONTEND

**Dile a tu compañero de frontend:**

```
El backend está en http://localhost:3001 (cambiaré a 3000)

Endpoints listos:
✅ POST /api/uploads/students - Crear perfil
✅ POST /api/uploads/reports/:studentId - Subir PDF
✅ POST /api/peis/generate - Generar PEI
✅ GET /api/peis/:id - Ver PEI
✅ GET /api/elevenlabs/pei/:id/summary-audio - Audio
✅ GET /api/linkup/pei/:id/resources - Recursos

⚠️ En progreso:
- GET /api/reports/:id/process/stream (SSE)

Swagger: http://localhost:3001/api/docs
```

---

**¿Procedo con Opción A (mínimo) u Opción B (completo)?** 🚀
