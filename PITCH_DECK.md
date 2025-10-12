# 🧠 NeuroPlan - Pitch Deck

---

## SLIDE 1: PORTADA

# 🧠 NeuroPlan
### Educación Inclusiva Impulsada por IA

**Barcelona Hackathon 2025**

*De semanas a minutos: PEIs personalizados para estudiantes neurodivergentes*

---

## SLIDE 2: EL PROBLEMA

# 📊 La Realidad Actual

## 500,000+
### Estudiantes neurodivergentes en España

## 4-6 Semanas
### Tiempo para crear un PEI manualmente

## 70%
### PEIs desactualizados o incompletos

---

## SLIDE 3: NUESTRA SOLUCIÓN

# 💡 NeuroPlan en 5 Minutos

```
📄 Upload → 🤖 IA → 📋 PEI → 🔊 Audio → 📚 Recursos
```

### Automatización Completa del Proceso

1. **Subir** informe médico (PDF)
2. **Extraer** información con AWS Textract
3. **Generar** PEI con AWS Bedrock (Claude AI)
4. **Convertir** a audio con ElevenLabs
5. **Buscar** recursos con Linkup
6. **Notificar** con n8n

---

## SLIDE 4: DEMO EN VIVO

# 🎬 Veamos Cómo Funciona

**Caso: Ana Pérez, 10 años, Dislexia**

**DEMO:** *[Mostrar pantalla]*
- ✅ Upload de informe
- ✅ Generación automática de PEI
- ✅ Audio en español natural
- ✅ Recursos educativos

**Tiempo total: 2 minutos** ⏱️

---

## SLIDE 5: INTEGRACIONES GANADORAS

# 🏆 Stack Multi-Premio

## 🔊 ElevenLabs ($2,000)
- Text-to-speech natural en español
- Accesibilidad para 500K+ familias
- 5 endpoints implementados

## 📚 Linkup (€500)
- Recursos educativos verificados
- Búsqueda inteligente contextual
- 4 endpoints implementados

## ⚙️ n8n (€500 + hosting)
- Workflow completo automatizado
- Notificaciones multicanal
- 8 endpoints implementados

## ☁️ AWS
- Bedrock, Textract, Comprehend
- S3, Polly - 20 endpoints

---

## SLIDE 6: ARQUITECTURA TÉCNICA

# 🛠️ Tecnología de Producción

```
Frontend (React + Vite)
        ↓
Backend (NestJS + TypeScript)
   54 Endpoints REST
        ↓
┌────────┬─────────┬─────────┬─────────┐
│  AWS   │ElevenLabs│ Linkup  │   n8n   │
└────────┴─────────┴─────────┴─────────┘
        ↓
Database (Prisma + SQLite)
```

**✅ 100% Funcional y Testeado**

---

## SLIDE 7: IMPACTO SOCIAL

# 🌍 Norrsken Impact Prize

## Impacto Medible

### 500,000+
**Estudiantes beneficiados en España**

### 95%
**Reducción de tiempo**

### 20+
**Países escalables (Iberoamérica)**

## ODS Objetivos de Desarrollo Sostenible
- 🎯 **ODS 4:** Educación de Calidad
- 🎯 **ODS 10:** Reducción de Desigualdades

---

## SLIDE 8: TRACCIÓN Y MÉTRICAS

# 📈 Estado Actual

## Backend
- ✅ 54 endpoints funcionales
- ✅ Swagger docs completa
- ✅ Base de datos operativa

## Integraciones
- ✅ AWS (20 endpoints)
- ✅ ElevenLabs (5 endpoints)
- ✅ Linkup (4 endpoints)
- ✅ n8n (8 endpoints)

## Seguridad
- ✅ RGPD compliant
- ✅ PHI detection
- ✅ Secret scanning

---

## SLIDE 9: MODELO DE NEGOCIO

# 💼 Escalabilidad y Monetización

## Revenue Streams

### 🏫 B2B (Colegios)
**5-10€/estudiante/mes**

### 👨‍👩‍👧 B2C (Familias)
**19.99€/mes premium**

### 🏛️ B2G (Gobierno)
**Licitaciones públicas**

## TAM (España)
### 60M€/año
*500K estudiantes × 10€/mes × 12*

---

## SLIDE 10: ROADMAP

# 🚀 Próximos Pasos

## Q1 2026 (3 meses)
- Integración sistemas escolares
- App móvil iOS/Android
- Portal educadores

## Q2-Q3 2026 (6-12 meses)
- Expansión 17 CCAA España
- Dashboard de progreso
- IA predictiva v2

## 2027+
- Expansión Iberoamérica
- Marketplace educativo
- Detección temprana IA

---

## SLIDE 11: EQUIPO

# 👥 Equipo NeuroPlan

**Hackathon Barcelona 2025**

**GitHub:** github.com/miskybox/neuroplan-backend

**Tecnologías:**
- Backend: NestJS, TypeScript, Prisma
- Frontend: React, Vite, TailwindCSS
- Cloud: AWS, ElevenLabs, Linkup, n8n

---

## SLIDE 12: CALL TO ACTION

# 🎯 Por Qué NeuroPlan

## ✅ Problema Real
**500K estudiantes esperando solución**

## ✅ Tecnología de Producción
**54 endpoints funcionales hoy**

## ✅ Integraciones Completas
**AWS + ElevenLabs + Linkup + n8n**

## ✅ Impacto Escalable
**España → Iberoamérica → Global**

---

# 🏅 NeuroPlan
## Educación Inclusiva para Todos

> *"No es solo código. Es el futuro de la educación inclusiva, hoy."*

**¡Gracias!** 🚀🧠

---

## BACKUP SLIDES

### SLIDE 13: ENDPOINTS TÉCNICOS

#### AWS Endpoints (20)
```
Bedrock: invoke, generate-pei, simplify-content, tutor-chat, models
Textract: extract, analyze-document
Comprehend: detect-entities, detect-phi
S3: upload, download
Polly: synthesize, voices
Utils: process-report, health
```

#### ElevenLabs Endpoints (5)
```
text-to-speech
pei/:id/audio
pei/:id/summary-audio
pei/:id/audios
voices
```

#### Linkup Endpoints (4)
```
search (POST)
search/:query (GET)
pei/:id/resources (POST/GET)
```

#### n8n Endpoints (8)
```
trigger-workflow
pei/:id/generated, pei/:id/approved
notification, webhook/:action
executions, execution/:id, stats
```

---

### SLIDE 14: CASOS DE USO

#### Caso 1: Dislexia
- Diagnóstico: Dislexia moderada
- PEI: Tiempo extra, materiales visuales
- Audio: Resumen para padres
- Recursos: Métodos multisensoriales

#### Caso 2: TDAH
- Diagnóstico: TDAH combinado
- PEI: Descansos frecuentes, entorno estructurado
- Audio: Estrategias de atención
- Recursos: Técnicas de focalización

#### Caso 3: TEA
- Diagnóstico: TEA nivel 1
- PEI: Rutinas visuales, comunicación alternativa
- Audio: Guía para familias
- Recursos: Pictogramas y SAAC

---

### SLIDE 15: COMPETENCIA

# 🔍 Análisis Competitivo

## Competidores Actuales
- ❌ Orientify: Solo orientación vocacional
- ❌ Additio: Gestión escolar general
- ❌ Clickedu: ERP escolar sin IA

## Ventajas Competitivas NeuroPlan
- ✅ IA generativa especializada en PEIs
- ✅ Accesibilidad con audio natural
- ✅ Recursos educativos verificados
- ✅ Automatización completa
- ✅ Cumplimiento normativo LOMLOE

**Ventaja:** Primera solución integral con IA

---

### SLIDE 16: SEGURIDAD Y PRIVACIDAD

# 🔐 Compliance y Protección

## RGPD Compliant
- Consentimiento explícito
- Derecho al olvido
- Portabilidad de datos

## PHI Protection
- Detección AWS Comprehend
- Encriptación AES-256
- Auditoría completa

## Seguridad
- HTTPS/TLS 1.3
- API key rotation
- GitHub secret scanning
- Rate limiting

---

*Última actualización: 12 Octubre 2025*
