# 📚 NeuroPlan - Índice de Documentación

## 🎯 Documentos para la Presentación del Hackathon

### 📋 Documentos Principales (Leer primero)

1. **[README.md](README.md)**
   - Descripción general del proyecto
   - Stack tecnológico
   - Integraciones de sponsors
   - Quick start

2. **[PRESENTACION_HACKATHON.md](PRESENTACION_HACKATHON.md)**
   - Presentación completa y detallada
   - Estrategia multi-premio
   - Script de 5 minutos
   - Datos técnicos y de negocio

3. **[CHECKLIST_PRESENTACION.md](CHECKLIST_PRESENTACION.md)** ⭐ CRÍTICO
   - Checklist día de la presentación
   - Setup de pantalla
   - Plan de contingencia
   - Respuestas a preguntas frecuentes

---

### 🎤 Para la Demo

4. **[DEMO_GUIDE.md](DEMO_GUIDE.md)**
   - Endpoints clave para demostrar
   - Flujo de demo de 2 minutos
   - Comandos curl preparados
   - Frases impactantes

5. **[PITCH_DECK.md](PITCH_DECK.md)**
   - 16 slides estructuradas
   - Mensajes clave por slide
   - Formato visual para presentar

---

### 📊 Datos de Respaldo

6. **[DATOS_ESTADISTICAS.md](DATOS_ESTADISTICAS.md)**
   - Cifras con fuentes oficiales
   - Análisis de mercado TAM/SAM/SOM
   - Datos de impacto social
   - Referencias bibliográficas

---

### 🔧 Documentación Técnica

7. **[AWS_INTEGRATION_GUIDE.md](AWS_INTEGRATION_GUIDE.md)**
   - Integración AWS completa
   - Bedrock, Textract, Comprehend, S3, Polly
   - 20 endpoints documentados

8. **[N8N_WORKFLOWS_GUIDE.md](N8N_WORKFLOWS_GUIDE.md)**
   - Workflows de automatización
   - 8 endpoints n8n
   - Configuración de webhooks

9. **[SECURITY_INCIDENT_REPORT.md](SECURITY_INCIDENT_REPORT.md)**
   - Incidente de seguridad documentado
   - API key rotation
   - Lecciones aprendidas

---

## 🗂️ Estructura de Carpetas

```
neuroplan-backend/
├── 📄 README.md                      # Inicio
├── 🎯 PRESENTACION_HACKATHON.md      # Presentación completa
├── ✅ CHECKLIST_PRESENTACION.md      # Día D
├── 🎬 DEMO_GUIDE.md                  # Demo práctica
├── 🎤 PITCH_DECK.md                  # Slides
├── 📊 DATOS_ESTADISTICAS.md          # Respaldo
├── 🔧 AWS_INTEGRATION_GUIDE.md       # AWS técnico
├── ⚙️ N8N_WORKFLOWS_GUIDE.md         # n8n técnico
├── 🔐 SECURITY_INCIDENT_REPORT.md    # Seguridad
│
├── src/                               # Código fuente
├── prisma/                            # Base de datos
├── docs/                              # (vacía, todo movido a raíz)
└── node_modules/                      # Dependencias
```

---

## 🎯 Orden de Lectura Recomendado

### La noche antes del hackathon:
1. ✅ **CHECKLIST_PRESENTACION.md** (15 min)
2. 📊 **DATOS_ESTADISTICAS.md** - Memorizar cifras clave (10 min)
3. 🎤 **PITCH_DECK.md** - Repasar slides (10 min)

### 1 hora antes de presentar:
4. 🎬 **DEMO_GUIDE.md** - Practicar demo (15 min)
5. 🎯 **PRESENTACION_HACKATHON.md** - Repasar script final (5 min)

### Durante la presentación:
- Tener **DEMO_GUIDE.md** abierto (endpoints y comandos)
- Tener **PITCH_DECK.md** visible (estructura)

### Para preguntas técnicas:
- **AWS_INTEGRATION_GUIDE.md** (detalles AWS)
- **N8N_WORKFLOWS_GUIDE.md** (detalles n8n)
- **README.md** (overview general)

---

## 📈 Cifras Clave a Memorizar

- **500,000+** estudiantes neurodivergentes en España
- **95%** reducción de tiempo (6 semanas → 5 minutos)
- **54** endpoints funcionales
- **60M€/año** TAM en España
- **4 integraciones** de sponsors (AWS, ElevenLabs, Linkup, n8n)

---

## 🏆 Premios del Hackathon

1. **🔊 ElevenLabs** - $2,000 USD (5 endpoints)
2. **📚 Linkup** - €500 (4 endpoints)
3. **⚙️ n8n** - €500 + €600/año hosting (8 endpoints)
4. **🌍 Norrsken** - Flex membership (impacto social)

---

## 🚀 URLs Importantes

- **Backend:** http://localhost:3001
- **API Docs:** http://localhost:3001/api/docs
- **Health Check:** http://localhost:3001/health
- **GitHub:** https://github.com/miskybox/neuroplan-backend

---

## ✅ Estado del Proyecto

- ✅ Backend 100% funcional (54 endpoints)
- ✅ Base de datos con datos demo (Ana Pérez)
- ✅ Todas las integraciones operativas
- ✅ Documentación completa
- ✅ Swagger docs configurado
- ✅ Seguridad implementada (RGPD, PHI detection)
- ✅ Código limpio (sin warnings)

---

## 📞 Soporte

Si algo falla durante la demo:
1. Ver **CHECKLIST_PRESENTACION.md** → Plan de Contingencia
2. Reiniciar backend: `start cmd /k "node -r ts-node/register -r tsconfig-paths/register src/main.ts"`
3. Verificar health: `curl http://localhost:3001/health`

---

**¡Buena suerte en el hackathon! 🍀🚀🧠**

*Última actualización: 12 de Octubre 2025*
