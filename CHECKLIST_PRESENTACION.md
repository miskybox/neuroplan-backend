# ✅ NeuroPlan - Checklist Pre-Presentación

## 📅 DÍA DE LA PRESENTACIÓN

### 🌅 MAÑANA (Antes de salir de casa)

#### Laptop y Equipamiento
- [ ] **Laptop cargado al 100%**
- [ ] **Cargador en la mochila**
- [ ] **Adaptador HDMI/USB-C** para proyector
- [ ] **Mouse inalámbrico** (backup por si falla el touchpad)
- [ ] **Cable Ethernet** (backup de conexión)
- [ ] **Hotspot móvil activado** (4G/5G con datos suficientes)
- [ ] **Auriculares** (para probar audio)

#### Documentos Físicos
- [ ] **DNI/Identificación**
- [ ] **Tarjeta de presentación** (si tienes)
- [ ] **Notas impresas** (script de presentación)
- [ ] **Backup USB** con documentos

#### Energía Personal
- [ ] **Desayuno completo** ✨
- [ ] **Agua** (llevar botella)
- [ ] **Snacks** (por si acaso)
- [ ] **Café/té** si lo necesitas

---

### 🏢 AL LLEGAR AL VENUE (1 hora antes)

#### Conexión y Setup
- [ ] **Conectar a WiFi del venue**
- [ ] **Probar conexión a internet** (curl, ping)
- [ ] **Activar hotspot móvil** (tenerlo listo por si falla WiFi)
- [ ] **Cargar laptop** mientras sea posible

#### Backend
- [ ] **Iniciar backend** en nueva ventana cmd
  ```bash
  start cmd /k "node -r ts-node/register -r tsconfig-paths/register src/main.ts"
  ```
- [ ] **Verificar health check**
  ```bash
  curl http://localhost:3001/health
  ```
- [ ] **Abrir Swagger docs** (http://localhost:3001/api/docs)

#### Frontend (si aplica)
- [ ] **Frontend corriendo** en puerto 8080
- [ ] **Verificar que carga** (http://localhost:8080)
- [ ] **Probar navegación básica**

#### Verificaciones Críticas
- [ ] **Base de datos poblada** (verificar Ana Pérez existe)
  ```bash
  curl http://localhost:3001/api/uploads/students
  ```
- [ ] **Endpoints responden** (probar 3-4 principales)
- [ ] **Audio funciona** (test con speaker del laptop)
- [ ] **Swagger UI carga** correctamente

---

### 🖥️ SETUP DE PANTALLA (30 minutos antes)

#### Organización de Ventanas
- [ ] **Cerrar pestañas innecesarias** del navegador
- [ ] **Cerrar aplicaciones no usadas**
- [ ] **Modo No Molestar activado** (notifications off)
- [ ] **Cerrar Slack, Discord, WhatsApp Web**

#### Ventanas Clave Abiertas
1. [ ] **Terminal con backend corriendo** (minimizada)
2. [ ] **Swagger docs** (http://localhost:3001/api/docs)
3. [ ] **Health check** (http://localhost:3001/health)
4. [ ] **Frontend** (si aplica)
5. [ ] **Presentación PDF/Markdown** (si tienes slides visuales)

#### Ajustes de Pantalla
- [ ] **Zoom al 125-150%** (para proyector)
- [ ] **Tema claro** (mejor visibilidad en proyector)
- [ ] **Resolución 1920x1080** (compatible con proyector)
- [ ] **Ocultar barra de tareas** (más espacio)

---

### 🎤 ENSAYO FINAL (15 minutos antes)

#### Flujo de Demo
- [ ] **Practicar una vez más** (2-3 minutos)
- [ ] **Cronometrar** con temporizador
- [ ] **Verificar transiciones** entre endpoints

#### Endpoints a Demostrar (orden)
1. [ ] `/health` - Mostrar integrations activas
2. [ ] `/api` - Info de la API con sponsors
3. [ ] `/api/uploads/students` - Mostrar Ana Pérez
4. [ ] `/aws/bedrock/generate-pei` - Generar PEI (si tiempo permite)
5. [ ] `/api/elevenlabs/voices` - Mostrar voces disponibles
6. [ ] `/api/linkup/search` - Buscar recursos
7. [ ] `/api/n8n/stats` - Mostrar estadísticas workflow

#### Plan B (por si algo falla)
- [ ] **Screenshots preparadas** en carpeta
- [ ] **Datos de respuesta JSON** copiados
- [ ] **Explicación verbal** sin demo (último recurso)

---

### ⏰ 5 MINUTOS ANTES DE PRESENTAR

#### Verificación Ultra-Rápida
- [ ] **Backend respondiendo** (curl health)
- [ ] **Batería >50%** (conectar cargador si <50%)
- [ ] **WiFi/Hotspot conectado**
- [ ] **Volumen del laptop al 70%**
- [ ] **Brillo de pantalla al máximo**

#### Mental Check
- [ ] **Respirar profundo** 3 veces 🧘
- [ ] **Repasar primera frase** mentalmente
- [ ] **Sonreír** (libera endorfinas)
- [ ] **Recordar: el código funciona** ✅

---

## 🎬 DURANTE LA PRESENTACIÓN

### Opening (30 segundos)
- [ ] **Presentarse** (nombre + proyecto)
- [ ] **Hook inicial**: "500,000 estudiantes esperan. 4-6 semanas. Hoy, 5 minutos."
- [ ] **Mostrar backend health** (todas las integraciones activas)

### Demo (90 segundos)
- [ ] **Mostrar Swagger** (54 endpoints)
- [ ] **Ejecutar endpoint clave** (generate-pei o similar)
- [ ] **Mostrar respuesta JSON** formateada
- [ ] **Explicar impacto** de cada integración

### Integraciones (60 segundos)
- [ ] **ElevenLabs**: Audio accesible para familias
- [ ] **Linkup**: Recursos verificados
- [ ] **n8n**: Workflow automatizado
- [ ] **AWS**: Infraestructura escalable

### Cierre (30 segundos)
- [ ] **Impacto**: 500K estudiantes, 95% reducción tiempo
- [ ] **Escalabilidad**: España → Iberoamérica
- [ ] **Call to action**: "Educación inclusiva real, hoy"
- [ ] **Agradecer** y abrir a preguntas

---

## ❓ PREGUNTAS FRECUENTES (Preparar respuestas)

### Técnicas

**"¿Por qué NestJS y no Express?"**
> "NestJS nos da estructura enterprise-ready out of the box: módulos, inyección de dependencias, Swagger automático. Ideal para un backend de producción."

**"¿SQLite en producción?"**
> "SQLite es solo para demo. En producción usaríamos PostgreSQL con Prisma. El schema ya está listo para migrar."

**"¿Cómo manejan los datos sensibles?"**
> "Detectamos PHI con AWS Comprehend, encriptamos con AES-256, y somos RGPD compliant. Tenemos auditoría completa."

**"¿Escalabilidad?"**
> "Arquitectura stateless lista para horizontal scaling. AWS Bedrock, ElevenLabs y Linkup son cloud-native. Con load balancer podemos manejar 10K+ requests/min."

### Negocio

**"¿Modelo de monetización?"**
> "Tres vías: B2B (colegios 5-10€/estudiante/mes), B2C (familias 19.99€/mes), B2G (licitaciones públicas). TAM de 60M€/año solo en España."

**"¿Competencia?"**
> "No hay solución con IA generativa + audio + recursos verificados + automatización en España. Additio y Clickedu son ERP generales, no especializados en PEIs con IA."

**"¿Validación con usuarios?"**
> "Para el hackathon, validamos con datos públicos del Ministerio de Educación. Siguiente paso: pilotos con 10 colegios en Q1 2026."

**"¿Expansión internacional?"**
> "España primero (500K estudiantes). Luego Iberoamérica (5M+ estudiantes): México, Argentina, Colombia. Adaptación normativa por país."

### Impacto

**"¿Cómo miden el impacto social?"**
> "KPIs: tiempo de generación (-95%), coste (-90%), estudiantes beneficiados (500K en España), familias con audio accesible (+100% desde 0). Alineado con ODS 4 y 10."

**"¿Qué pasa con la privacidad de los estudiantes?"**
> "RGPD compliant desde el diseño. Consentimiento explícito, derecho al olvido, PHI detection automático. Datos de salud tratados según normativa especial."

**"¿Y los profesores? ¿Se quedan sin trabajo?"**
> "No reemplazamos, aumentamos. Los profesores validan y personalizan los PEIs generados. Les damos una herramienta que les ahorra 10+ horas de trabajo administrativo."

---

## 🚨 PLAN DE CONTINGENCIA

### Si el WiFi falla
1. ✅ Activar hotspot móvil inmediatamente
2. ✅ Continuar con demo offline (endpoints locales)
3. ✅ Explicar verbalmente funcionalidades cloud

### Si el backend se cae
1. ✅ Reiniciar en 10 segundos (comando preparado)
2. ✅ Mientras tanto, mostrar screenshots
3. ✅ Continuar con explicación verbal

### Si el proyector no funciona
1. ✅ Mostrar en pantalla del laptop (zoom mayor)
2. ✅ Invitar a jueces a acercarse
3. ✅ Usar explicación verbal + gestos

### Si se acaba el tiempo
1. ✅ Ir directo al cierre
2. ✅ Mencionar KPIs clave: 500K estudiantes, 95% reducción
3. ✅ "Más detalles en GitHub y docs"

---

## 📊 DATOS CLAVE (Memorizar)

### Cifras de Impacto
- **500,000+** estudiantes neurodivergentes en España
- **4-6 semanas** → **5 minutos** (95% reducción)
- **60M€/año** TAM en España
- **5M+** estudiantes en Iberoamérica

### Endpoints
- **54** endpoints totales
- **20** AWS endpoints
- **5** ElevenLabs endpoints
- **4** Linkup endpoints
- **8** n8n endpoints

### Stack Técnico
- **NestJS** + TypeScript
- **AWS** Bedrock + Textract + Comprehend + S3 + Polly
- **Prisma** ORM + SQLite/PostgreSQL
- **ElevenLabs** + Linkup + n8n

---

## 🎯 OBJETIVOS DE LA PRESENTACIÓN

### Must Have (Imprescindible)
- [ ] **Explicar el problema** claramente
- [ ] **Mostrar el backend funcionando**
- [ ] **Demostrar 1-2 endpoints clave**
- [ ] **Mencionar las 4 integraciones**
- [ ] **Cuantificar el impacto** (500K estudiantes)

### Nice to Have (Deseable)
- [ ] Mostrar JSON response formateado
- [ ] Ejecutar workflow completo
- [ ] Mostrar Swagger docs navegando
- [ ] Mencionar roadmap futuro

### Don't Overdo (No exagerar)
- ❌ Detalles técnicos excesivos (líneas de código)
- ❌ Funcionalidades no implementadas
- ❌ Promesas que no podemos cumplir
- ❌ Criticar a la competencia negativamente

---

## 💬 FRASES CLAVE PRE-MEMORIZADAS

**Apertura:**
> "Buenos días/tardes. Soy [nombre] y esto es NeuroPlan. 500,000 estudiantes en España necesitan PEIs. Hoy tardan 6 semanas. Con nosotros, 5 minutos."

**Demo:**
> "Déjenme mostrárselo en vivo. [Ejecutar endpoint]. Como ven, el backend está funcionando con 54 endpoints, todas las integraciones activas."

**Integraciones:**
> "Usamos ElevenLabs para audio accesible, Linkup para recursos verificados, n8n para automatización, y AWS como infraestructura. Cada integración tiene un propósito claro y un impacto medible."

**Cierre:**
> "NeuroPlan reduce el tiempo 95%, los costes 90%, y alcanza 500,000 estudiantes. De España a Iberoamérica. De semanas a minutos. De teoría a producción. Gracias."

---

## ⏱️ TIMING EXACTO

**Total: 3-5 minutos**

- 0:00-0:30 → Problema e impacto (30s)
- 0:30-2:00 → Demo en vivo (90s)
- 2:00-3:00 → Integraciones y tecnología (60s)
- 3:00-3:30 → Impacto social y escalabilidad (30s)
- 3:30-4:00 → Cierre y call to action (30s)
- 4:00-5:00 → Buffer para preguntas o detalles (60s)

**Usar timer en el móvil** (silenciado pero visible)

---

## 🏅 DESPUÉS DE LA PRESENTACIÓN

### Inmediatamente
- [ ] **Agradecer a los jueces**
- [ ] **Quedarse disponible** para preguntas
- [ ] **Anotar feedback** recibido
- [ ] **Tomar captura** del backend funcionando

### Networking
- [ ] **Hablar con otros participantes**
- [ ] **Intercambiar contactos** con interesados
- [ ] **Tomar fotos** del setup
- [ ] **Grabar video corto** del backend (si permiten)

### Post-Hackathon
- [ ] **Subir a GitHub** todo el código
- [ ] **Actualizar README** con resultados
- [ ] **Tweet/LinkedIn post** con experiencia
- [ ] **Agradecer a sponsors** (ElevenLabs, Linkup, n8n)

---

## 🎊 MENTALIDAD GANADORA

### Recordar
✅ **El código funciona** - 54 endpoints operativos
✅ **El impacto es real** - 500K estudiantes esperan
✅ **La solución es única** - Primera con IA + audio + recursos + automatización
✅ **El equipo está preparado** - Has hecho tu parte

### Mantra Pre-Presentación
> "He construido algo real. Funciona. Tiene impacto. Estoy listo."

### Si ganas
🏆 **Celebrar** con humildad
🏆 **Agradecer** a todos
🏆 **Comprometerse** a desarrollar más

### Si no ganas
💪 **Aprender** del feedback
💪 **Mejorar** el proyecto
💪 **Continuar** desarrollando
💪 **La educación inclusiva vale la pena** independientemente de premios

---

## ✨ MENSAJE FINAL

> **"Respira. Sonríe. Has construido algo increíble. 500,000 estudiantes merecen esta solución. Sal ahí y muéstrales por qué NeuroPlan es el futuro de la educación inclusiva."**

---

**¡MUCHA SUERTE! 🍀🚀🧠**

*Preparado para ganar - Barcelona Hackathon 2025*
