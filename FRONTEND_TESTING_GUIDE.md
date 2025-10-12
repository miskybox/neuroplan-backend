# 🎯 NeuroPlan Frontend - Guía de Pruebas

## 🚀 ¿Qué puedo probar desde el Frontend?

### ✅ CON BACKEND INICIADO (Funcionalidad Completa)

#### 1. **Workflow n8n** 🔄
**Endpoint:** `POST /api/n8n/trigger-workflow`

**Desde el Frontend puedes:**
- ✅ Disparar workflows automáticos
- ✅ Ver notificaciones generadas
- ✅ Simular proceso completo: PEI → Notificación → Email

**Ejemplo de prueba:**
```javascript
// El frontend enviaría algo como:
{
  "workflowId": "pei-generation",
  "data": {
    "studentId": "cmgmtmx5m0000tbr67zc8hg9m",
    "action": "notify_parents",
    "email": "juan.perez@example.com"
  }
}
```

**Resultado esperado:**
- Email/SMS enviado a los padres
- Notificación en Telegram (si configurado)
- Log de ejecución en base de datos

---

#### 2. **AWS Bedrock (Generación de PEI)** 🤖
**Endpoint:** `POST /aws/bedrock/generate-pei`

**Desde el Frontend puedes:**
- ✅ Generar PEI automático con IA
- ✅ Ver objetivos SMART personalizados
- ✅ Obtener adaptaciones curriculares
- ✅ Estrategias educativas específicas

**Ejemplo de prueba:**
```javascript
{
  "diagnosis": "Dislexia moderada",
  "age": 10,
  "grade": "5º Primaria",
  "context": "Estudiante con dificultades en lectura y escritura"
}
```

**Resultado esperado:**
```json
{
  "pei": {
    "objetivos": ["Mejorar velocidad lectora", "Reducir errores ortográficos"],
    "adaptaciones": {
      "lengua": "Tiempo extra en exámenes",
      "matemáticas": "Apoyo visual con pictogramas"
    },
    "estrategias": ["Método multisensorial", "Refuerzo positivo"],
    "evaluacion": "Preferentemente oral"
  }
}
```

---

#### 3. **AWS Textract (Extraer texto de PDFs)** 📄
**Endpoint:** `POST /aws/textract/extract`

**Desde el Frontend puedes:**
- ✅ Subir informe médico en PDF
- ✅ Extraer texto automáticamente
- ✅ Ver diagnóstico detectado

**Ejemplo de prueba:**
- Upload de archivo PDF
- El backend extrae: "Diagnóstico: Dislexia. Recomendaciones: apoyo especializado..."

---

#### 4. **ElevenLabs (Audio)** 🔊
**Endpoint:** `POST /api/elevenlabs/text-to-speech`

**Desde el Frontend puedes:**
- ✅ Convertir PEI a audio
- ✅ Escuchar resumen del plan educativo
- ✅ Descargar archivo MP3

**Ejemplo de prueba:**
```javascript
{
  "text": "Resumen del PEI de Ana: La estudiante necesita apoyo en lectura...",
  "voiceId": "21m00Tcm4TlvDq8ikWAM" // Voz femenina en español
}
```

**Resultado esperado:**
- Audio en español natural
- Archivo descargable
- Duración aprox. 30-60 segundos

---

#### 5. **Linkup (Recursos Educativos)** 📚
**Endpoint:** `POST /api/linkup/search`

**Desde el Frontend puedes:**
- ✅ Buscar recursos educativos
- ✅ Ver fuentes verificadas
- ✅ Filtrar por diagnóstico

**Ejemplo de prueba:**
```javascript
{
  "query": "recursos educativos dislexia primaria LOMLOE",
  "depth": "standard"
}
```

**Resultado esperado:**
```json
{
  "results": [
    {
      "title": "Guía LOMLOE para Dislexia",
      "url": "https://educacion.gob.es/dislexia",
      "source": "Ministerio de Educación",
      "verified": true
    }
  ]
}
```

---

#### 6. **Gestión de Estudiantes** 👨‍🎓
**Endpoint:** `GET /api/uploads/students`

**Desde el Frontend puedes:**
- ✅ Ver lista de estudiantes
- ✅ Ver informes asociados
- ✅ Ver PEIs generados

**Datos demo disponibles:**
- **Ana Pérez** (10 años, Dislexia, 5º Primaria)
- Con informe médico procesado
- Con PEI activo

---

### ❌ SIN BACKEND (Modo Demo)

Cuando el backend no está corriendo, el frontend muestra:
- 🔴 **"Modo Demo"** en la interfaz
- 🔴 Datos estáticos precargados
- 🔴 Botones deshabilitados
- 🔴 No se pueden hacer requests reales

---

## 🚀 Cómo Iniciar el Backend

### Opción 1: Desde la Terminal de Backend
```bash
# En la carpeta neuroplan-backend
node -r ts-node/register -r tsconfig-paths/register src/main.ts
```

### Opción 2: Nueva Ventana (Recomendado)
```bash
start cmd /k "node -r ts-node/register -r tsconfig-paths/register src/main.ts"
```

### Verificar que funciona:
```bash
curl http://localhost:3001/health
```

**Respuesta esperada:**
```json
{
  "status": "healthy",
  "uptime": 123.45,
  "environment": "development",
  "database": "connected",
  "integrations": {
    "elevenlabs": "mock",
    "linkup": "configured",
    "n8n": "configured"
  }
}
```

---

## 🎬 Flujo de Demo Completo (Con Backend)

### Escenario: Generar PEI para Ana Pérez

#### Paso 1: Ver Estudiante
```
GET /api/uploads/students
→ Ver datos de Ana Pérez
```

#### Paso 2: Generar PEI con IA
```
POST /aws/bedrock/generate-pei
→ Claude AI genera PEI personalizado
```

#### Paso 3: Convertir a Audio
```
POST /api/elevenlabs/text-to-speech
→ Audio en español natural
```

#### Paso 4: Buscar Recursos
```
POST /api/linkup/search
→ Materiales educativos para dislexia
```

#### Paso 5: Notificar Familia
```
POST /api/n8n/trigger-workflow
→ Email/SMS a padres automáticamente
```

**Tiempo total:** 2-3 minutos ⏱️

---

## 🔍 Endpoints Más Importantes para Demo

### Para Impresionar a los Jueces:

1. **`/aws/bedrock/generate-pei`** 
   - Muestra la IA en acción
   - Genera PEI completo en segundos

2. **`/api/elevenlabs/text-to-speech`**
   - Demuestra accesibilidad
   - Audio natural en español

3. **`/api/linkup/search`**
   - Recursos verificados
   - Fuentes oficiales

4. **`/api/n8n/trigger-workflow`**
   - Automatización completa
   - Notificaciones automáticas

5. **`/health`**
   - Mostrar todas las integraciones activas
   - Estado del sistema

---

## 🎯 Qué Mostrar en Cada Premio

### 🔊 ElevenLabs Prize
**Enfoque:** Accesibilidad con audio
```
1. Generar PEI
2. Convertir a audio con /api/elevenlabs/text-to-speech
3. Reproducir audio natural
4. Destacar: "500K familias ahora pueden ESCUCHAR los PEIs"
```

### 📚 Linkup Prize
**Enfoque:** Recursos verificados
```
1. Buscar con /api/linkup/search
2. Mostrar fuentes oficiales (educacion.gob.es)
3. Filtrar por diagnóstico
4. Destacar: "Recursos de calidad, verificados"
```

### ⚙️ n8n Prize
**Enfoque:** Automatización
```
1. Ejecutar workflow con /api/n8n/trigger-workflow
2. Mostrar log de ejecución
3. Explicar: Textract → Comprehend → Bedrock → ElevenLabs → Linkup → Email
4. Destacar: "Sin intervención humana"
```

### 🌍 Norrsken Impact
**Enfoque:** Impacto social
```
1. Mostrar flujo completo
2. Comparar: 6 semanas → 5 minutos
3. Mencionar: 500K estudiantes beneficiados
4. Destacar: ODS 4 + ODS 10
```

---

## 📊 Datos de Prueba Disponibles

### Estudiante Demo: Ana Pérez
```json
{
  "id": "cmgmtmx5m0000tbr67zc8hg9m",
  "name": "Ana",
  "lastName": "Pérez",
  "birthDate": "2015-05-20",
  "grade": "5º Primaria",
  "school": "CEIP Hackathon",
  "diagnosis": "Dislexia",
  "parentEmail": "juan.perez@example.com"
}
```

### Informe Médico
```json
{
  "id": "cmgmtmx5x0002tbr6p2ho00gu",
  "extractedText": "Diagnóstico: Dislexia. Síntomas: dificultad lectora.",
  "status": "COMPLETED"
}
```

### PEI Generado
```json
{
  "id": "cmgmtmx610004tbr6l6lmbkuj",
  "diagnosis": "Dislexia",
  "objectives": ["Mejorar velocidad lectora", "Reducir errores ortográficos"],
  "status": "ACTIVE"
}
```

---

## 🚨 Troubleshooting

### Backend no responde
```bash
# 1. Verificar puerto
netstat -ano | findstr :3001

# 2. Si hay proceso, matarlo
taskkill /F /PID <PID>

# 3. Reiniciar
start cmd /k "node -r ts-node/register -r tsconfig-paths/register src/main.ts"
```

### Frontend en "Modo Demo"
- ✅ Verificar que backend esté en http://localhost:3001
- ✅ Probar: `curl http://localhost:3001/health`
- ✅ Recargar página del frontend (F5)

### Errores CORS
- ✅ Backend permite: localhost:8080, localhost:5173, localhost:3000
- ✅ Verificar que frontend esté en uno de esos puertos

---

## 📚 Más Información

- **Swagger Docs:** http://localhost:3001/api/docs
- **Health Check:** http://localhost:3001/health
- **Estudiantes Demo:** http://localhost:3001/api/uploads/students

---

## ✅ Checklist Pre-Demo

- [ ] Backend corriendo en puerto 3001
- [ ] Frontend accesible (puerto 8080)
- [ ] Swagger docs cargando
- [ ] Health check responde "healthy"
- [ ] Base de datos con Ana Pérez
- [ ] Audio del laptop funciona
- [ ] Internet conectado (para Linkup)

---

**¡Con el backend iniciado puedes probar TODO! 🚀**

*Guía actualizada - 12 Octubre 2025*
