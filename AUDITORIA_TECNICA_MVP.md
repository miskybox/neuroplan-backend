# 🔍 AUDITORÍA TÉCNICA - NEUROPLAN MVP

**Fecha:** 13 de enero de 2025  
**Auditor:** GitHub Copilot (Análisis de código completo)  
**Objetivo:** Evaluar el proyecto para transformarlo en un **MVP profesional y escalable** para presentar al Ayuntamiento de Barcelona

---

## 📋 RESUMEN EJECUTIVO

### 🎯 Situación Actual
- **Contexto Original:** Proyecto desarrollado para hackathon con múltiples integraciones de patrocinadores
- **Estado Técnico:** Funcional pero orientado a demo/pitch, no a producción
- **Deuda Técnica:** Alta (código orientado a mostrar integración de sponsors)
- **Seguridad:** Insuficiente para datos sensibles (NEE, datos médicos, RGPD)

### ✅ Fortalezas Identificadas
1. **Arquitectura base sólida:** NestJS + PostgreSQL + Prisma
2. **Modelo de datos bien diseñado:** 7 tablas relacionadas correctamente
3. **Endpoints funcionales:** API REST documentada con Swagger
4. **Flujo core completo:** Upload → Extracción → Análisis → Generación PEI

### ❌ Problemas Críticos
1. **Sobre-integración:** 8 módulos de terceros (AWS, ElevenLabs, Linkup, n8n, Vonage) innecesarios
2. **Seguridad inexistente:** Sin autenticación, sin autorización, sin encriptación
3. **Código de hackathon:** Comentarios orientados a jueces, mock modes, endpoints demo
4. **Sin RGPD:** Manejo de datos sensibles sin cumplimiento normativo
5. **Escalabilidad limitada:** Sin multi-tenancy, sin roles, sin auditoría

---

## 🏗️ ARQUITECTURA ACTUAL

### Módulos Implementados (8)

| Módulo | Propósito | Estado | Decisión |
|--------|-----------|--------|----------|
| **prisma** | ORM + Database | ✅ Core | **MANTENER** |
| **uploads** | Gestión archivos/estudiantes | ✅ Core | **MANTENER** |
| **peis** | Generación de PEIs | ✅ Core | **MANTENER** |
| **aws** | 5 servicios AWS (Bedrock, Textract...) | ⚠️ Sponsor | **SIMPLIFICAR** |
| **elevenlabs** | Text-to-Speech | ⚠️ Sponsor | **ELIMINAR** |
| **linkup** | Búsqueda recursos | ⚠️ Sponsor | **ELIMINAR** |
| **n8n** | Automatización workflows | ⚠️ Sponsor | **ELIMINAR** |
| **vonage** | SMS/WhatsApp/Video | ⚠️ Sponsor | **ELIMINAR** |

### Análisis de Dependencias

```
src/
├── modules/
│   ├── prisma/         ✅ CORE - Database access
│   ├── uploads/        ✅ CORE - File management
│   ├── peis/           ✅ CORE - Business logic
│   │
│   ├── aws/            ⚠️ SPONSOR - 20 endpoints, solo 2-3 útiles
│   ├── elevenlabs/     ❌ SPONSOR - Accesibilidad nice-to-have
│   ├── linkup/         ❌ SPONSOR - Recursos externos no críticos
│   ├── n8n/            ❌ SPONSOR - Orquestación innecesaria
│   └── vonage/         ❌ SPONSOR - Comunicación no prioritaria
```

---

## 🚨 PROBLEMAS CRÍTICOS DETALLADOS

### 1. **SEGURIDAD: CRÍTICO 🔴**

#### Ausencias graves:
```typescript
// ❌ NO HAY autenticación en ningún endpoint
@Get('api/students')
async getStudents() {
  return this.uploadsService.getStudents();
  // CUALQUIERA puede ver todos los estudiantes
}

// ❌ NO HAY autorización por roles
@Post('api/peis/generate')
async generatePEI(@Body() data: GeneratePEIDto) {
  // CUALQUIERA puede generar PEIs
}

// ❌ NO HAY encriptación de datos sensibles
model Student {
  parentEmail   String?  // Email en texto plano
  parentPhone   String?  // Teléfono en texto plano
}

// ❌ NO HAY rate limiting
// Un atacante puede hacer 1000 requests/segundo

// ❌ NO HAY validación de input
@Body() data: any  // Acepta CUALQUIER cosa
```

#### Riesgos:
- **RGPD violation:** Datos médicos sin protección
- **Data breach:** Estudiantes expuestos públicamente
- **DDoS attack:** Sin límite de peticiones
- **SQL injection:** Sin validación de inputs (aunque Prisma protege parcialmente)
- **XSS attacks:** Sin sanitización de outputs

---

### 2. **SOBRE-INTEGRACIÓN: ALTO 🟡**

#### Análisis de módulos sponsor:

**AWS Module (aws/):**
```typescript
// 5 servicios, 20 endpoints
// ÚTILES (2):
✅ Bedrock (Claude AI) - Generación de PEIs
✅ Textract (OCR) - Extracción de PDFs

// INNECESARIOS (3):
❌ Comprehend - Redundante con Claude
❌ S3 - Sistema de archivos local suficiente para MVP
❌ Polly - Duplicado con ElevenLabs
```

**Recomendación:** Mantener solo **AWS Bedrock** (Claude AI), eliminar resto.

**ElevenLabs Module:**
```typescript
// 5 endpoints para text-to-speech
// PROBLEMA: Dependencia externa cara (~$330/mes para uso real)
// SOLUCIÓN MVP: API nativa del navegador (Web Speech API) gratis
```

**Recomendación:** **ELIMINAR.** Reemplazar con Web Speech API en frontend.

**Linkup Module:**
```typescript
// 4 endpoints para búsqueda de recursos
// PROBLEMA: Requiere API key, datos externos no controlados
// SOLUCIÓN MVP: Base de datos propia de recursos curados
```

**Recomendación:** **ELIMINAR.** Crear tabla Resources en DB con recursos propios.

**n8n Module:**
```typescript
// 8 endpoints para orquestación
// PROBLEMA: Complejidad innecesaria, dependencia externa
// SOLUCIÓN MVP: Eventos internos de NestJS (EventEmitter)
```

**Recomendación:** **ELIMINAR.** Usar sistema de eventos interno.

**Vonage Module:**
```typescript
// 5 endpoints para SMS/WhatsApp/Video
// PROBLEMA: Coste elevado, no prioritario para MVP
// SOLUCIÓN MVP: Emails con Nodemailer (gratis)
```

**Recomendación:** **ELIMINAR.** Usar email estándar.

---

### 3. **CÓDIGO DE HACKATHON: MEDIO 🟡**

#### Ejemplos encontrados:

```typescript
// app.controller.ts - Línea 86
getApiInfo() {
  return {
    hackathon: {
      event: 'Barcelona Hackathon 2025',
      sponsors: ['ElevenLabs', 'Linkup', 'n8n', 'Norrsken'],
      targetPrizes: ['$2000', '€500', '€500 + €600/año', 'Membership'],
    },
  };
}
// ❌ Info de hackathon en producción

// app.controller.ts - Línea 67
integrations: {
  elevenlabs: process.env.ELEVENLABS_API_KEY?.startsWith('sk-') ? 'configured' : 'mock',
  linkup: process.env.LINKUP_API_KEY ? 'configured' : 'mock',
  n8n: process.env.N8N_WEBHOOK_URL?.startsWith('https://') && !process.env.N8N_WEBHOOK_URL.includes('tu-instancia') ? 'configured' : 'mock',
}
// ❌ Mock modes en producción

// peis.controller.ts - Comentarios
"**Premio ElevenLabs ($2000)**"
"Para el hackathon: muestra integración completa"
// ❌ Referencias a premios en documentación API
```

---

### 4. **RGPD & CUMPLIMIENTO: CRÍTICO 🔴**

#### Requisitos NO cumplidos:

```
❌ Consentimiento explícito para datos médicos
❌ Derecho al olvido (GDPR Art. 17)
❌ Derecho a la portabilidad (GDPR Art. 20)
❌ Encriptación de datos en reposo
❌ Encriptación de datos en tránsito (parcial, HTTPS no forzado)
❌ Registro de accesos y auditoría
❌ Tiempo de retención de datos definido
❌ Notificación de brechas de seguridad (72h)
❌ DPO (Data Protection Officer) designado
❌ Privacy Policy visible
❌ Terms of Service aceptados
```

#### Datos sensibles sin proteger:

```typescript
model Report {
  extractedText String?  // Diagnósticos médicos en texto plano
  ocrText       String?  // Información psicopedagógica sin encriptar
}

model PEI {
  diagnosis   String  // NEE identificadas sin protección
  summary     String  // Datos personales del estudiante
}

model Student {
  parentEmail   String?  // Datos de contacto expuestos
  parentPhone   String?
}
```

---

### 5. **ESCALABILIDAD: MEDIO 🟡**

#### Problemas arquitecturales:

```typescript
// ❌ Sin multi-tenancy
// Todos los colegios comparten datos sin segregación

// ❌ Sin roles ni permisos
// No hay diferencia entre admin, profesor, familia

// ❌ Sin paginación en listas
@Get('api/students')
async getStudents() {
  return this.prisma.student.findMany(); // Devuelve TODOS
}

// ❌ Sin caching
// Cada request regenera todo desde BD

// ❌ Sin rate limiting
// Sin protección contra abuso

// ❌ Archivos en disco local
// uploads/ folder - no escalable en cloud
```

---

## 📊 ANÁLISIS CUANTITATIVO

### Líneas de código por módulo

```
src/modules/
├── prisma/         ~150 líneas  ✅ CORE
├── uploads/        ~350 líneas  ✅ CORE
├── peis/           ~400 líneas  ✅ CORE
├── aws/            ~1200 líneas ⚠️ 80% eliminar
├── elevenlabs/     ~450 líneas  ❌ 100% eliminar
├── linkup/         ~300 líneas  ❌ 100% eliminar
├── n8n/            ~500 líneas  ❌ 100% eliminar
└── vonage/         ~400 líneas  ❌ 100% eliminar

TOTAL: ~3,750 líneas
MANTENER: ~900 líneas (24%)
ELIMINAR: ~2,850 líneas (76%)
```

### Endpoints por módulo

```
/health             1  ✅ CORE
/api/students       5  ✅ CORE
/api/uploads        6  ✅ CORE
/api/peis           4  ✅ CORE
/aws/*              20 ⚠️ Reducir a 2-3
/api/elevenlabs/*   5  ❌ ELIMINAR
/api/linkup/*       4  ❌ ELIMINAR
/api/n8n/*          8  ❌ ELIMINAR
/api/vonage/*       5  ❌ ELIMINAR

TOTAL: 58 endpoints
MANTENER: 18 endpoints (31%)
ELIMINAR: 40 endpoints (69%)
```

### Dependencias externas

```json
{
  "dependencies": {
    // ✅ CORE - Necesarias
    "@nestjs/common": "^10.0.0",
    "@nestjs/core": "^10.0.0",
    "@nestjs/platform-express": "^10.0.0",
    "@nestjs/swagger": "^7.1.0",
    "@prisma/client": "^5.22.0",
    "prisma": "^5.22.0",
    
    // ⚠️ AWS - Reducir
    "@aws-sdk/client-bedrock-runtime": "^3.x",  // ✅ MANTENER
    "@aws-sdk/client-textract": "^3.x",         // ⚠️ EVALUAR
    "@aws-sdk/client-comprehend": "^3.x",       // ❌ ELIMINAR
    "@aws-sdk/client-s3": "^3.x",               // ❌ ELIMINAR
    "@aws-sdk/client-polly": "^3.x",            // ❌ ELIMINAR
    
    // ❌ SPONSORS - Eliminar
    "axios": "^1.x",  // Para llamadas a APIs externas
    "form-data": "^4.x",
    
    // ✅ AÑADIR - Seguridad
    "@nestjs/passport": "FALTA",
    "@nestjs/jwt": "FALTA",
    "bcrypt": "FALTA",
    "helmet": "FALTA",
    "express-rate-limit": "FALTA",
    "class-validator": "FALTA",
    "class-transformer": "FALTA"
  }
}
```

---

## 🎯 RECOMENDACIONES PRIORITARIAS

### 🔴 CRÍTICO (Semana 1-2)

#### 1. **Implementar Autenticación & Autorización**
```bash
Prioridad: MÁXIMA
Tiempo estimado: 40-60 horas
Dependencias: @nestjs/passport, @nestjs/jwt, bcrypt
```

**Requisitos:**
- Login con email/password
- JWT tokens con refresh
- 5 roles: ADMIN, ORIENTADOR, PROFESOR, FAMILIA, DIRECTOR_CENTRO
- Guards en todos los endpoints
- Row Level Security en Prisma

#### 2. **Seguridad Básica**
```bash
Prioridad: MÁXIMA
Tiempo estimado: 20-30 horas
Dependencias: helmet, express-rate-limit, class-validator
```

**Requisitos:**
- Helmet.js (headers de seguridad)
- Rate limiting (100 req/15min por IP)
- Validación de inputs (class-validator)
- Sanitización de outputs
- HTTPS forzado en producción

#### 3. **Cumplimiento RGPD**
```bash
Prioridad: MÁXIMA
Tiempo estimado: 30-40 horas
Dependencias: Legal review necesaria
```

**Requisitos:**
- Consentimientos explícitos
- Encriptación de datos sensibles
- Auditoría de accesos (ActivityLog mejorado)
- Privacy Policy + Terms of Service
- Endpoint para exportar/eliminar datos

---

### 🟡 IMPORTANTE (Semana 3-4)

#### 4. **Limpieza de Código**
```bash
Prioridad: ALTA
Tiempo estimado: 15-20 horas
```

**Tareas:**
- Eliminar módulos: elevenlabs, linkup, n8n, vonage
- Simplificar AWS module (solo Bedrock + Textract si necesario)
- Eliminar referencias a hackathon
- Eliminar mock modes
- Actualizar documentación Swagger

#### 5. **Multi-tenancy & Roles**
```bash
Prioridad: ALTA
Tiempo estimado: 25-35 horas
```

**Requisitos:**
- Modelo School/Organization
- Segregación de datos por colegio
- Permisos granulares por rol
- Dashboard específico por rol

#### 6. **Mejoras de Escalabilidad**
```bash
Prioridad: ALTA
Tiempo estimado: 20-25 horas
```

**Tareas:**
- Paginación en todas las listas
- Caching con Redis
- File storage en S3/Azure (no disco local)
- Database indexing
- Query optimization

---

### 🟢 DESEADO (Semana 5-8)

#### 7. **Características Adicionales**
- Notificaciones por email (Nodemailer)
- Exportar PEI a PDF profesional
- Versionado de PEIs
- Workflow de aprobación
- Dashboard con métricas
- Logs centralizados (Winston + ELK)

#### 8. **Testing & CI/CD**
- Tests unitarios (>80% coverage)
- Tests E2E
- GitHub Actions pipeline
- Automated deployment

#### 9. **Monitoreo & Observabilidad**
- Sentry (error tracking)
- DataDog/NewRelic (APM)
- Health checks avanzados
- Alertas automáticas

---

## 💰 ANÁLISIS DE COSTES

### Costes Actuales (Hackathon)

```
AWS Bedrock (Claude):    ~$100-300/mes (según uso)
ElevenLabs:              ~$330/mes (plan Creator)
Linkup:                  ~€50/mes
n8n hosting:             ~€20/mes
Vonage:                  ~$40/mes

TOTAL MENSUAL: ~$540-740/mes (~€500-680/mes)
ANUAL: ~€6,000-8,000/año
```

### Costes MVP Propuesto

```
AWS Bedrock (Claude):    ~$100-300/mes ✅ (necesario para IA)
PostgreSQL (Railway):    $7-15/mes ✅
Hosting (Railway):       $5-10/mes ✅
Email (SendGrid free):   $0 ✅
Storage (S3):            ~$5/mes ✅

TOTAL MENSUAL: ~$117-330/mes (~€110-310/mes)
ANUAL: ~€1,320-3,720/año

AHORRO: €4,680-4,280/año (70% de reducción)
```

---

## 📈 PLAN DE REFACTORIZACIÓN

### Fase 1: SEGURIDAD (2 semanas)
```
Semana 1:
- [ ] Implementar autenticación (JWT)
- [ ] Añadir roles y permisos
- [ ] Guards en todos los endpoints
- [ ] Helmet + Rate limiting

Semana 2:
- [ ] Validación de inputs (class-validator)
- [ ] Encriptación de datos sensibles
- [ ] RGPD: consentimientos + privacy policy
- [ ] Auditoría de accesos mejorada
```

### Fase 2: LIMPIEZA (1-2 semanas)
```
Semana 3:
- [ ] Eliminar módulos: elevenlabs, linkup, n8n, vonage
- [ ] Simplificar AWS module
- [ ] Eliminar código de hackathon
- [ ] Actualizar documentación

Semana 4 (opcional):
- [ ] Refactorizar arquitectura
- [ ] Mejorar naming conventions
- [ ] Añadir tests unitarios
```

### Fase 3: ESCALABILIDAD (2 semanas)
```
Semana 5:
- [ ] Implementar multi-tenancy (School model)
- [ ] Segregación de datos por colegio
- [ ] Paginación en listas
- [ ] Caching con Redis

Semana 6:
- [ ] File storage en S3/Azure
- [ ] Database indexing
- [ ] Query optimization
- [ ] Dashboard por rol
```

### Fase 4: FEATURES MVP (2-3 semanas)
```
Semana 7-8:
- [ ] Notificaciones por email
- [ ] Exportar PEI a PDF
- [ ] Workflow de aprobación
- [ ] Métricas y analytics

Semana 9 (opcional):
- [ ] Tests E2E
- [ ] CI/CD pipeline
- [ ] Monitoreo con Sentry
```

---

## ✅ ARQUITECTURA MVP RECOMENDADA

### Stack Definitivo

```typescript
// Backend
Framework: NestJS (TypeScript)
Database: PostgreSQL 17
ORM: Prisma
Auth: Passport + JWT
Validation: class-validator + class-transformer
Security: Helmet + express-rate-limit
IA: AWS Bedrock (Claude 3.5 Sonnet)
OCR: AWS Textract (opcional, evaluar PDFParse primero)

// Frontend (separado)
Framework: Next.js 14 (App Router)
UI: Tailwind CSS + shadcn/ui
State: React Query + Zustand
Auth: NextAuth.js

// Infrastructure
Hosting: Railway.app o Render.com
Database: Railway PostgreSQL
Storage: AWS S3 o Azure Blob
Email: SendGrid (free tier)
Monitoring: Sentry (free tier)
```

### Módulos Finales

```
src/
├── modules/
│   ├── auth/           ✅ NUEVO - JWT, roles, guards
│   ├── users/          ✅ NUEVO - Gestión de usuarios
│   ├── schools/        ✅ NUEVO - Multi-tenancy
│   ├── students/       ✅ Refactorizar desde uploads
│   ├── reports/        ✅ Refactorizar desde uploads
│   ├── peis/           ✅ Core business logic
│   ├── ai/             ✅ Renombrar desde aws (solo Bedrock)
│   ├── notifications/  ✅ NUEVO - Email con Nodemailer
│   └── prisma/         ✅ Database access
│
├── common/
│   ├── guards/         ✅ NUEVO - Auth guards
│   ├── decorators/     ✅ NUEVO - Role decorators
│   ├── interceptors/   ✅ Logging, transform
│   ├── filters/        ✅ NUEVO - Exception filters
│   └── validators/     ✅ NUEVO - Custom validators
│
└── config/             ✅ Environment config
```

---

## 🎓 BUENAS PRÁCTICAS A IMPLEMENTAR

### 1. **Clean Architecture**
```
- Separación de capas (Controller → Service → Repository)
- Inyección de dependencias
- Principio de responsabilidad única
- Interfaces para abstracción
```

### 2. **Security First**
```
- Never trust user input
- Sanitize all outputs
- Use parameterized queries (Prisma lo hace)
- Encrypt sensitive data at rest
- Use HTTPS everywhere
- Implement CSRF protection
```

### 3. **Error Handling**
```typescript
// ✅ HACER
throw new BadRequestException({
  message: 'Validation failed',
  errors: validationErrors,
  timestamp: new Date().toISOString(),
  path: request.url
});

// ❌ NO HACER
throw new Error('Something broke');
```

### 4. **Logging**
```typescript
// ✅ HACER
this.logger.log('PEI generated', {
  peiId,
  studentId,
  duration: endTime - startTime,
  userId: req.user.id
});

// ❌ NO HACER
console.log('PEI created');
```

### 5. **Documentation**
```
- Swagger para API (ya implementado)
- JSDoc para funciones complejas
- README actualizado
- Architecture Decision Records (ADR)
```

---

## 📊 MÉTRICAS DE ÉXITO

### Antes (Hackathon)
```
Líneas de código: ~3,750
Módulos: 8
Endpoints: 58
Dependencias externas: 8 APIs
Coste mensual: €500-680
Seguridad: ❌ Inexistente
RGPD: ❌ No cumple
Tests: ❌ 0%
Multi-tenancy: ❌ No
Tiempo de desarrollo: 3 días (hackathon)
```

### Después (MVP Profesional)
```
Líneas de código: ~2,500 (limpio)
Módulos: 9 (bien estructurados)
Endpoints: 25-30 (necesarios)
Dependencias externas: 1-2 APIs (Claude + OCR opcional)
Coste mensual: €110-310 (70% reducción)
Seguridad: ✅ Producción-ready
RGPD: ✅ Cumple
Tests: ✅ >80% coverage
Multi-tenancy: ✅ Sí
Tiempo de refactor: 6-8 semanas
```

---

## 🚀 CONCLUSIONES & PRÓXIMOS PASOS

### Conclusión General

El proyecto **tiene una base sólida** (NestJS + PostgreSQL + Prisma) pero está **contaminado por el contexto de hackathon**. El 76% del código actual es **eliminable o reemplazable**, lo que es **positivo** porque significa que el 24% restante (el core) está bien hecho.

### Riesgos si NO se refactoriza

1. **RGPD violation** → Multas de hasta €20M o 4% facturación anual
2. **Data breach** → Pérdida de confianza, demandas legales
3. **Inescalabilidad** → No soporta >100 colegios simultáneos
4. **Costes excesivos** → €6K-8K/año innecesarios
5. **Rechazo del Ayuntamiento** → Sin seguridad = proyecto descartado

### Decisión Recomendada

**REFACTORIZAR COMPLETAMENTE** siguiendo este plan de 6-8 semanas:

```
Semana 1-2:  Seguridad (CRÍTICO)
Semana 3-4:  Limpieza + Multi-tenancy (IMPORTANTE)
Semana 5-6:  Escalabilidad (IMPORTANTE)
Semana 7-8:  Features MVP (DESEABLE)
```

### Próxima Acción Inmediata

**¿Qué hacemos ahora?**

1. **OPCIÓN A - REFACTOR COMPLETO** (Recomendado)
   - Creo rama `mvp-refactor`
   - Implemento autenticación + seguridad (Semana 1-2)
   - Elimino módulos innecesarios
   - Tiempo: 2 meses para MVP profesional

2. **OPCIÓN B - QUICK WINS SOLO** (Rápido pero incompleto)
   - Elimino módulos sponsor inmediatamente (2-3 días)
   - Añado autenticación básica (1 semana)
   - Resto queda pendiente
   - Tiempo: 2 semanas, pero NO production-ready

3. **OPCIÓN C - SEGUIR ASÍ** (NO recomendado)
   - Proyecto queda como demo de hackathon
   - No presentable al Ayuntamiento
   - Alto riesgo legal (RGPD)

---

**¿Qué opción prefieres que ejecutemos?** 

Mi recomendación es **OPCIÓN A** para tener un MVP profesional en 6-8 semanas que realmente puedas presentar al Ayuntamiento con confianza.

