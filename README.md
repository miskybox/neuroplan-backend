# NeuroPlan - Sistema de Gestión de Planes Educativos Individualizados (PEI)

## 🎯 Descripción

**NeuroPlan** es una plataforma SaaS que automatiza la creación y gestión de **Planes Educativos Individualizados (PEI)** para estudiantes con necesidades educativas especiales (NEE), utilizando **IA generativa** para reducir hasta un 85% el tiempo de trabajo administrativo.

### 🏆 Impacto y ROI

- **Ahorro de tiempo:** De 2-3 horas/PEI → 15-20 minutos
- **ROI para Barcelona:** €800.000 anuales (8.000 estudiantes NEE)
- **Target:** Ayuntamientos, consorcios educativos, colegios privados

---

## 🚀 Stack Tecnológico

### Backend
- **Framework:** NestJS + TypeScript
- **Base de datos:** PostgreSQL 17
- **ORM:** Prisma 5.22.0
- **Autenticación:** JWT

### Integraciones IA
- **AWS Bedrock:** Claude 3.5 Sonnet (generación de PEIs)
- **ElevenLabs:** Text-to-Speech multilingual
- **Linkup:** Deep search para recursos educativos
- **n8n:** Automatización de workflows
- **Vonage:** Comunicación SMS/WhatsApp/Video

---

## 📦 Instalación

### Requisitos previos
- Node.js 18+ 
- PostgreSQL 17 (instalado y corriendo)
- npm o yarn

### 1. Clonar repositorio
```bash
git clone <tu-repositorio>
cd neuroplan-backend
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Configurar variables de entorno

Crea un archivo `.env` en la raíz:

```env
# Database
DATABASE_URL="postgresql://postgres@localhost:5432/neuroplan?schema=public"

# Server
PORT=3001
NODE_ENV=development

# JWT
JWT_SECRET=your-secret-key-change-in-production

# AWS Bedrock (Claude)
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your-aws-key
AWS_SECRET_ACCESS_KEY=your-aws-secret

# ElevenLabs
ELEVENLABS_API_KEY=your-elevenlabs-key

# Linkup
LINKUP_API_KEY=your-linkup-key

# n8n
N8N_WEBHOOK_URL=https://your-n8n-instance.app.n8n.cloud/webhook/

# Vonage (opcional - para producción)
VONAGE_API_KEY=your-vonage-key
VONAGE_API_SECRET=your-vonage-secret
VONAGE_APPLICATION_ID=your-app-id
VONAGE_PRIVATE_KEY_PATH=./private.key
```

### 4. Crear base de datos en PostgreSQL

```sql
-- Conectar a PostgreSQL
psql -U postgres

-- Crear base de datos
CREATE DATABASE neuroplan;
\q
```

### 5. Ejecutar migraciones

```bash
npx prisma migrate deploy
npx prisma generate
```

### 6. (Opcional) Seed de datos de prueba

```bash
npx prisma db seed
```

---

## 🏃 Ejecutar el proyecto

### Modo desarrollo
```bash
npm run start:dev
```

### Modo producción
```bash
npm run build
npm run start:prod
```

### Verificar que funciona
Abre tu navegador en: http://localhost:3001/health

Deberías ver:
```json
{
  "status": "healthy",
  "database": "connected",
  "uptime": 123.45,
  "integrations": {
    "elevenlabs": "configured",
    "linkup": "configured",
    "n8n": "configured"
  }
}
```

---

## 📡 Endpoints principales

### Salud del sistema
```
GET /health
```

### Estudiantes
```
POST /api/students - Crear estudiante
GET /api/students/:id - Obtener estudiante
GET /api/students - Listar estudiantes
```

### Informes y PEIs
```
POST /api/uploads/reports/:studentId - Subir informe (PDF/JPG/PNG, max 10MB)
POST /api/pei/generate/:studentId - Generar PEI con IA
GET /api/pei/:studentId - Obtener PEI
```

### Audio (ElevenLabs)
```
POST /api/audio/generate - Generar audio de PEI
GET /api/audio/:id - Obtener audio generado
```

### Recursos educativos (Linkup)
```
POST /api/resources/search - Buscar recursos con IA
```

### Comunicación (Vonage)
```
POST /api/vonage/send-sms - Enviar SMS
POST /api/vonage/send-whatsapp - Enviar WhatsApp
POST /api/vonage/create-video-session - Crear sesión de videollamada
```

---

## 🗄️ Modelo de datos (Prisma)

### Entidades principales
- **Student:** Datos del estudiante
- **Report:** Informes subidos (PDF/imágenes)
- **PEI:** Planes educativos generados
- **AudioFile:** Audios generados con ElevenLabs
- **ResourceLink:** Enlaces a recursos educativos
- **WorkflowExecution:** Logs de workflows n8n
- **ActivityLog:** Auditoría de acciones

Ver esquema completo en `prisma/schema.prisma`

---

## 🧪 Testing

```bash
# Tests unitarios
npm run test

# Tests e2e
npm run test:e2e

# Cobertura
npm run test:cov
```

---

## 🚢 Despliegue a producción

### Opción 1: Railway.app (~$5-10/mes)
1. Crear cuenta en railway.app
2. Conectar repositorio GitHub
3. Añadir PostgreSQL plugin
4. Configurar variables de entorno
5. Deploy automático

### Opción 2: Render.com (~$7/mes + $15 DB)
1. Crear cuenta en render.com
2. New Web Service → GitHub repo
3. Build: `npm install && npx prisma generate`
4. Start: `npm run start:prod`
5. Añadir PostgreSQL database ($15/mes)

### Variables de entorno de producción
Asegúrate de configurar:
- `NODE_ENV=production`
- `DATABASE_URL` con conexión PostgreSQL en la nube
- Todas las API keys de los patrocinadores
- `JWT_SECRET` seguro (32+ caracteres aleatorios)

---

## 📊 Arquitectura del sistema

```
┌─────────────────┐
│   Frontend      │ (React/Next.js - repositorio separado)
│   (puerto 3000) │
└────────┬────────┘
         │
         ▼
┌─────────────────────────────────────────┐
│   Backend NestJS (puerto 3001)          │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │  Controllers (REST API)         │   │
│  └──────────┬──────────────────────┘   │
│             │                           │
│  ┌──────────▼──────────────────────┐   │
│  │  Services (Lógica de negocio)  │   │
│  └──────────┬──────────────────────┘   │
│             │                           │
│  ┌──────────▼──────────────────────┐   │
│  │  Prisma ORM                     │   │
│  └──────────┬──────────────────────┘   │
└─────────────┼───────────────────────────┘
              │
              ▼
   ┌──────────────────────┐
   │  PostgreSQL 17       │
   │  (neuroplan DB)      │
   └──────────────────────┘

   Integraciones externas:
   ├─ AWS Bedrock (Claude 3.5)
   ├─ ElevenLabs (TTS)
   ├─ Linkup (Search)
   ├─ n8n (Workflows)
   └─ Vonage (Comunicación)
```

---

## 🎯 Roadmap MVP (4-8 semanas)

### Fase 1: Core (2 semanas)
- [x] Migración a PostgreSQL
- [x] API endpoints básicos
- [ ] Dashboard frontend
- [ ] Autenticación JWT

### Fase 2: IA (2 semanas)
- [x] Generación PEI con Claude
- [x] Text-to-Speech ElevenLabs
- [x] Búsqueda de recursos Linkup
- [ ] Mejora prompts basada en feedback

### Fase 3: Producción (2 semanas)
- [ ] Deploy a Railway/Render
- [ ] Backups automáticos
- [ ] Monitoreo y logs (Sentry/LogRocket)
- [ ] Documentación API (Swagger)

### Fase 4: Piloto (2 semanas)
- [ ] 5 colegios piloto
- [ ] Capacitación docentes
- [ ] Recolección feedback
- [ ] Iteración rápida

---

## 🏛️ Clientes objetivo

### 1. Ayuntamiento de Barcelona
- **Target:** 8.000 estudiantes NEE
- **ROI:** €800.000/año
- **Presupuesto:** €50K-80K implementación inicial

### 2. Consorcio de Educación de Barcelona
- **Target:** Gestiona TODOS los colegios públicos
- **ROI:** Escala a nivel ciudad
- **Modelo:** Licitación pública

### 3. Colegios privados (SaaS)
- **Pricing:** €99-599/mes según tamaño
- **Target:** 50-500 estudiantes
- **Modalidad:** Suscripción mensual

### 4. Asociaciones NEE
- **Modelo:** Partnerships estratégicos
- **Beneficio:** Acceso a red de centros educativos

---

## 📄 Licencia

Copyright © 2025 NeuroPlan. Todos los derechos reservados.

---

## 👨‍💻 Equipo

Desarrollado con ❤️ por el equipo NeuroPlan

---

## 🔧 Troubleshooting

### Error: "Can't reach database server"
- Verifica que PostgreSQL esté corriendo: `pg_isready`
- Comprueba el `DATABASE_URL` en `.env`
- Prueba conexión: `psql -U postgres -d neuroplan`

### Error: "Prisma Client not generated"
```bash
npx prisma generate
```

### Error: "Port 3001 already in use"
```bash
# Windows
netstat -ano | findstr :3001
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:3001 | xargs kill -9
```

### Limpiar y regenerar base de datos
```bash
npx prisma migrate reset --force
npx prisma generate
npm run start:dev
```