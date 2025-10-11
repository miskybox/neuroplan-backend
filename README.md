# 🧠 NEUROPLAN BACKEND

Backend para la generación automática de Planes Educativos Individualizados (PEIs) con Inteligencia Artificial.

## 🚀 Hackathon Barcelona 2025 - Multi-Premio Strategy

Este proyecto está diseñado para ganar múltiples premios en el hackathon:

- **🟣 ElevenLabs** ($2000 - 6 meses Scale): Texto a voz para PEIs accesibles
- **🟣 Linkup** (€500 cash): Búsqueda verificada de recursos educativos
- **🟣 n8n** (€500 + €600/año): Automatización de workflows educativos
- **🟣 Norrsken** (Flex membership): Impacto social en educación inclusiva

## 🎯 Funcionalidades Core

### 📄 Procesamiento Inteligente
- Upload de informes médicos/psicopedagógicos (PDF/imagen)
- Extracción automática con OCR
- Análisis con Claude AI para identificar NEE

### 🤖 Generación de PEIs
- PEIs personalizados en tiempo real
- Objetivos SMART específicos
- Adaptaciones curriculares automáticas
- Seguimiento y evaluación continua

### 🔊 Accesibilidad Total (ElevenLabs)
- Conversión texto-a-voz de PEIs
- Resúmenes hablados para familias
- Múltiples voces naturales en español

### 📚 Recursos Verificados (Linkup)
- Búsqueda en tiempo real de recursos educativos
- Apps, estrategias y herramientas recomendadas
- Información actualizada sin alucinaciones

### ⚙️ Automatización (n8n)
- Workflows automáticos: generación → notificación → seguimiento
- Integración con sistemas educativos
- Alertas y recordatorios automáticos

## 🛠️ Stack Tecnológico

- **Framework**: NestJS + TypeScript
- **Base de datos**: Prisma + SQLite (dev) / PostgreSQL (prod)
- **IA**: Claude AI (Anthropic)
- **Procesamiento**: PDF-parse + OCR
- **APIs**: ElevenLabs, Linkup, n8n webhooks
- **Cloud**: AWS (Lambda/EC2)

## 🚀 Quick Start

### Instalación
```bash
# Instalar dependencias
npm install

# Configurar base de datos
npm run prisma:generate
npm run prisma:push

# Iniciar en desarrollo
npm run start:dev
```

### Variables de Entorno
```bash
# Copia .env.example a .env y configura:
DATABASE_URL="file:./dev.db"
CLAUDE_API_KEY="tu_claude_key"
ELEVENLABS_API_KEY="tu_elevenlabs_key"
LINKUP_API_KEY="tu_linkup_key"
N8N_WEBHOOK_URL="https://tu-n8n.app/webhook/neuroplan"
```

## 📡 Endpoints Principales

### PEIs
- `POST /api/peis/upload` - Subir informe y generar PEI
- `GET /api/peis/:id` - Obtener PEI específico
- `GET /api/peis/:id/pdf` - Descargar PEI en PDF

### ElevenLabs (Audio)
- `GET /api/elevenlabs/pei/:id/summary-audio` - Audio del resumen
- `POST /api/elevenlabs/text-to-speech` - Convertir texto a audio

### Linkup (Recursos)
- `GET /api/linkup/pei/:id/resources` - Recursos para PEI específico
- `GET /api/linkup/search/:query` - Búsqueda libre de recursos

### n8n (Automatización)
- `POST /api/n8n/trigger-workflow` - Disparar workflow
- `POST /api/n8n/webhook/:action` - Webhooks entrantes

## 🎨 Arquitectura

```
src/
├── modules/
│   ├── peis/          # Core PEI generation
│   ├── elevenlabs/    # Text-to-speech
│   ├── linkup/        # Educational resources
│   ├── n8n/           # Workflow automation
│   └── uploads/       # File processing
├── common/
│   ├── guards/        # Auth & validation
│   ├── interceptors/  # Logging & transform
│   └── decorators/    # Custom decorators
├── config/            # Environment configuration
└── prisma/           # Database schema
```

## 🎤 Demo Flow

1. **Upload** informe (PDF/imagen) → `/api/peis/upload`
2. **Procesamiento** automático con Claude AI
3. **Generación** PEI personalizado en ~30 segundos
4. **Audio** disponible vía ElevenLabs para accesibilidad
5. **Recursos** educativos automáticos vía Linkup
6. **Workflow** n8n dispara notificaciones y seguimiento

## 🏆 Impacto Social

- **800,000** estudiantes con NEE en España
- **3 semanas → 3 minutos**: Reducción dramática de tiempo
- **€300 → €10**: Coste 30x menor
- **100% personalizado**: Cada PEI único por estudiante
- **Accesibilidad total**: Audio, multiidioma, familias incluidas

## 🔗 Integraciones Ganadoras

### ElevenLabs Integration
```typescript
// Audio de resumen automático
const audioBuffer = await this.elevenLabsService.textToSpeech(
  pei.summary,
  'es' // Español natural
);
```

### Linkup Integration  
```typescript
// Recursos verificados en tiempo real
const resources = await this.linkupService.searchEducationalResources(
  pei.studentNeeds,
  pei.grade
);
```

### n8n Integration
```typescript
// Workflow automático
await this.n8nService.triggerWorkflow('pei-generated', {
  studentId,
  peiId,
  parentEmail
});
```

## 📈 Métricas de Éxito

- **Performance**: PEI generado en <60 segundos
- **Precisión**: >95% extracción correcta de datos
- **Accesibilidad**: Audio claro en <10 segundos
- **Recursos**: >50 recursos por consulta
- **Automatización**: 0 intervención manual

## 🌟 Próximos Pasos

- **AWS deployment** con escalabilidad automática  
- **Integración Fire TV** (Vega OS) para aulas
- **WhatsApp** notifications (Vonage)
- **Modelo propio** entrenado en PEIs españoles

---

**Desarrollado con ❤️ para la educación inclusiva**

*Hackathon Barcelona 2025 - Team NeuroPlan*