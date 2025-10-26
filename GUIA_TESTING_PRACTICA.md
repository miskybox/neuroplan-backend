# 🧪 GUÍA PRÁCTICA DE TESTING - NEUROPLAN

## 📋 TESTING PASO A PASO CON EJEMPLOS REALES

---

## 🎯 PREREQUISITOS

### 1. **Backend corriendo**
```bash
# Terminal 1: Backend
cd neuroplan-backend
npm run start:dev
# Debe mostrar: Server running on http://localhost:3001
```

### 2. **Frontend corriendo**
```bash
# Terminal 2: Frontend
cd neuroplan-frontend
npm run dev
# Debe mostrar: http://localhost:8080
```

### 3. **Verificar Conexión**
```
Abrir navegador: http://localhost:8080/pei-engine
Ver badge superior: "✅ Backend Conectado" (verde)
Si aparece rojo: Backend no está corriendo
```

---

## 📄 TEST 1: SUBIR INFORME MÉDICO

### **Objetivo**: Crear estudiante y subir reporte médico PDF

---

### **Paso 1: Crear archivo de prueba**

Crea un archivo llamado `informe_ana.txt` con este contenido:

```
INFORME MÉDICO - EVALUACIÓN PSICOPEDAGÓGICA

Nombre del Paciente: Ana Pérez García
Edad: 10 años
Fecha de Evaluación: 1 de octubre de 2025

DIAGNÓSTICO:
- Dislexia del desarrollo (F81.0)
- Trastorno específico del aprendizaje de la lectura

SÍNTOMAS OBSERVADOS:
1. Dificultad significativa en la decodificación de palabras
2. Inversión frecuente de letras (b/d, p/q)
3. Lectura lenta y vacilante
4. Baja comprensión lectora
5. Dificultad para seguir instrucciones escritas

FORTALEZAS IDENTIFICADAS:
- Alta motivación para aprender
- Excelente comprensión oral
- Habilidades matemáticas superiores a la media
- Fuerte apoyo familiar
- Buena integración social

RECOMENDACIONES:
1. Uso de fuente OpenDyslexic o similar
2. Material de lectura con apoyo visual
3. Tiempo adicional en evaluaciones (50% más)
4. Permitir exámenes orales como alternativa
5. Uso de audiolibros y material audiovisual
6. Sesiones de refuerzo con especialista (2 veces/semana)

MEDICACIÓN: No requiere
SEGUIMIENTO: Evaluación trimestral

Fecha: 1/10/2025
Firmado: Dr. Carlos Martínez
Psicopedagogo Clínico
Colegiado N° 12345
```

Guarda este archivo como `informe_ana.txt` (o conviértelo a PDF).

---

### **Paso 2: Ir a PEI Engine**

```
URL: http://localhost:8080/pei-engine
```

---

### **Paso 3: Crear Estudiante**

1. **Click en tab "Crear Estudiante"** (lado izquierdo)

2. **Llenar formulario**:
   ```
   Nombre del estudiante: Ana Pérez
   Edad: 10
   Grado: 5° Primaria
   Diagnóstico: Dislexia
   Notas adicionales: (opcional)
   ```

3. **Seleccionar archivo**:
   - Click en "Seleccionar archivo" o arrastrar
   - Elegir: `informe_ana.txt` o `informe_ana.pdf`

4. **Click "Crear Estudiante"**

5. **Verificar resultado**:
   ```
   ✅ Toast verde: "Estudiante creado exitosamente"
   ✅ Aparece en lista de estudiantes
   ```

---

### **Endpoint usado**:
```http
POST http://localhost:3001/uploads/students

Content-Type: multipart/form-data

Body:
{
  "name": "Ana Pérez",
  "age": 10,
  "gradeLevel": "5° Primaria",
  "diagnosis": "Dislexia",
  "file": [archivo binario]
}

Response:
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Ana Pérez",
    "age": 10,
    "gradeLevel": "5° Primaria",
    "diagnosis": "Dislexia",
    "reportId": 1,
    "createdAt": "2025-10-12T..."
  }
}
```

---

### **Probar con cURL** (opcional):

```bash
curl -X POST http://localhost:3001/uploads/students \
  -F "name=Ana Pérez" \
  -F "age=10" \
  -F "gradeLevel=5° Primaria" \
  -F "diagnosis=Dislexia" \
  -F "file=@informe_ana.txt"
```

---

## 🧠 TEST 2: GENERAR PEI DESDE REPORTE

### **Objetivo**: Analizar el informe y generar PEI automáticamente

---

### **Paso 1: Ir a "Generar PEI"**

1. En `/pei-engine`
2. Click en tab **"Generar PEI"**

---

### **Paso 2: Seleccionar estudiante**

1. Desplegable: Seleccionar **"Ana Pérez"**
2. Verás sus datos cargados

---

### **Paso 3: Generar PEI**

1. **Click "Generar PEI con IA"**

2. **Observar progreso**:
   ```
   [=====     ] 20% - Extrayendo texto del reporte...
   [==========] 40% - Analizando con IA Bedrock...
   [===============] 60% - Generando objetivos...
   [====================] 80% - Creando adaptaciones...
   [=========================] 100% - ¡PEI generado!
   ```

3. **Ver resultado**:
   ```
   PLAN EDUCATIVO INDIVIDUALIZADO
   
   Estudiante: Ana Pérez
   Edad: 10 años
   Diagnóstico: Dislexia del desarrollo
   
   OBJETIVOS ESPECÍFICOS:
   1. Mejorar velocidad lectora en 30% este trimestre
   2. Aumentar comprensión lectora a nivel de 4° grado
   3. Reducir errores de inversión de letras en 50%
   
   ADAPTACIONES CURRICULARES:
   - Uso de fuente OpenDyslexic en todo material escrito
   - Tiempo adicional en evaluaciones: +50%
   - Material con apoyo visual abundante
   - Audiolibros disponibles para todos los textos
   
   METODOLOGÍA:
   - Lectura en voz alta con apoyo
   - Técnicas multisensoriales
   - Software educativo especializado
   - Sesiones de refuerzo 2x/semana
   
   EVALUACIÓN:
   - Exámenes orales permitidos
   - Formato adaptado con más espacio
   - Uso de imágenes de apoyo
   - Evaluación continua vs exámenes únicos
   
   RECURSOS RECOMENDADOS:
   - OpenDyslexic Font
   - Audible/Audiolibros
   - Khan Academy Kids
   - Material Montessori de lectura
   ```

---

### **Endpoint usado**:

```http
POST http://localhost:3001/peis/generate

Content-Type: application/json

Body:
{
  "studentId": 1,
  "reportId": 1
}

Response:
{
  "success": true,
  "data": {
    "id": 1,
    "studentId": 1,
    "content": {
      "objectives": [...],
      "adaptations": [...],
      "methodology": [...],
      "evaluation": [...],
      "resources": [...]
    },
    "status": "draft",
    "generatedBy": "bedrock-claude3",
    "createdAt": "2025-10-12T..."
  }
}
```

---

### **Probar con cURL**:

```bash
curl -X POST http://localhost:3001/peis/generate \
  -H "Content-Type: application/json" \
  -d '{
    "studentId": 1,
    "reportId": 1
  }'
```

---

### **Paso 4: Descargar PEI**

1. **Click "📥 Descargar PDF"**
2. Se descarga archivo: `PEI_Ana_Perez_2025.pdf`

---

### **Endpoint usado**:

```http
GET http://localhost:3001/peis/1/pdf

Response:
Content-Type: application/pdf
Content-Disposition: attachment; filename="PEI_Ana_Perez_2025.pdf"

[PDF Binary Data]
```

---

## 🤖 TEST 3: AWS BEDROCK - SIMPLIFICAR CONTENIDO

### **Objetivo**: Usar IA para simplificar texto educativo

---

### **Paso 1: Ir a Bedrock Demo**

```
URL: http://localhost:8080/bedrock-demo
```

---

### **Paso 2: Tab "Simplificar Contenido"**

---

### **Paso 3: Ingresar texto complejo**

Copia este texto en el campo:

```
El proceso de fotosíntesis es un mecanismo bioquímico fundamental 
mediante el cual las plantas, algas y algunas bacterias convierten 
la energía electromagnética lumínica proveniente del sol en energía 
química almacenada en moléculas orgánicas de glucosa, utilizando 
como reactivos dióxido de carbono atmosférico y agua, liberando 
como subproducto oxígeno molecular a la atmósfera.
```

---

### **Paso 4: Seleccionar nivel**

- **Elementary** (6-10 años)
- **Middle School** (11-14 años)
- **High School** (15-18 años)

Elegir: **Elementary**

---

### **Paso 5: Click "Simplificar Contenido"**

---

### **Paso 6: Ver resultado**

```
TEXTO SIMPLIFICADO (Elementary):

Las plantas usan la luz del sol para hacer su propia comida. 
Este proceso se llama fotosíntesis.

Las plantas toman:
- Luz del sol ☀️
- Agua del suelo 💧
- Aire (dióxido de carbono) 🌬️

Y hacen:
- Azúcar para crecer 🍬
- Oxígeno para respirar 🌱

Es como cocinar usando la luz del sol como fuego.
```

---

### **Endpoint usado**:

```http
POST http://localhost:3001/bedrock/simplify-content

Content-Type: application/json

Body:
{
  "text": "El proceso de fotosíntesis es un mecanismo...",
  "targetLevel": "elementary"
}

Response:
{
  "success": true,
  "data": {
    "originalText": "El proceso de fotosíntesis...",
    "simplifiedText": "Las plantas usan la luz del sol...",
    "targetLevel": "elementary",
    "model": "anthropic.claude-3-sonnet-20240229-v1:0",
    "tokensUsed": 145
  }
}
```

---

### **Probar con cURL**:

```bash
curl -X POST http://localhost:3001/bedrock/simplify-content \
  -H "Content-Type: application/json" \
  -d '{
    "text": "El proceso de fotosíntesis es un mecanismo bioquímico...",
    "targetLevel": "elementary"
  }'
```

---

## 🤖 TEST 4: GENERAR PEI CON AWS BEDROCK

### **Objetivo**: Generar PEI desde formulario (sin reporte)

---

### **Paso 1: Ir a Bedrock Demo**

```
URL: http://localhost:8080/bedrock-demo
Tab: "Generar PEI"
```

---

### **Paso 2: Llenar formulario**

```
Nombre del estudiante: Carlos Rodríguez
Nivel educativo: 4° Primaria
Diagnóstico (separados por coma): TDAH, Discalculia
Síntomas: 
- Dificultad para concentrarse más de 10 minutos
- Problemas con operaciones matemáticas básicas
- Inquietud motora constante
- Olvida instrucciones frecuentemente

Fortalezas:
- Muy creativo en arte
- Excelente memoria visual
- Gran habilidad social
- Le encanta construir cosas
```

---

### **Paso 3: Click "Generar PEI con IA"**

---

### **Paso 4: Ver resultado**

```json
{
  "student": {
    "name": "Carlos Rodríguez",
    "gradeLevel": "4° Primaria",
    "diagnosis": ["TDAH", "Discalculia"]
  },
  "objectives": [
    {
      "area": "Atención",
      "goal": "Mantener concentración en tareas académicas por 20 minutos",
      "timeline": "Trimestre 1"
    },
    {
      "area": "Matemáticas",
      "goal": "Dominar sumas y restas básicas con material concreto",
      "timeline": "Trimestre 1"
    }
  ],
  "adaptations": [
    {
      "type": "Ambiental",
      "description": "Asiento cerca del profesor, lejos de ventanas"
    },
    {
      "type": "Metodológica",
      "description": "Instrucciones cortas y visuales"
    },
    {
      "type": "Evaluación",
      "description": "Exámenes divididos en sesiones cortas"
    }
  ],
  "strategies": [
    "Pausas activas cada 15 minutos",
    "Uso de manipulativos para matemáticas",
    "Timers visuales para tareas",
    "Recompensas inmediatas por logros"
  ]
}
```

---

### **Endpoint usado**:

```http
POST http://localhost:3001/bedrock/generate-pei

Content-Type: application/json

Body:
{
  "studentName": "Carlos Rodríguez",
  "gradeLevel": "4° Primaria",
  "diagnosis": ["TDAH", "Discalculia"],
  "symptoms": [
    "Dificultad para concentrarse más de 10 minutos",
    "Problemas con operaciones matemáticas básicas"
  ],
  "strengths": [
    "Muy creativo en arte",
    "Excelente memoria visual"
  ]
}

Response:
{
  "success": true,
  "data": {
    "pei": { ... },
    "model": "anthropic.claude-3-sonnet-20240229-v1:0",
    "generatedAt": "2025-10-12T..."
  }
}
```

---

## 🎙️ TEST 5: GENERAR AUDIO DEL PEI

### **Objetivo**: Convertir PEI a audio con ElevenLabs

---

### **Paso 1: Tener PEI generado** (Test 2)

---

### **Paso 2: En vista de PEI**

```
Ubicación: /pei-engine
Ver PEI de "Ana Pérez"
```

---

### **Paso 3: Click "🎙️ Generar Audio del PEI"**

---

### **Paso 4: Esperar generación**

```
⏳ Generando audio... (30-60 segundos)
```

---

### **Paso 5: Reproducir audio**

```
🎧 [▶️ Play] [⏸️ Pause] [📥 Download]
Duración: ~5 minutos
```

---

### **Endpoint usado**:

```http
POST http://localhost:3001/elevenlabs/pei/1/audio

Response:
{
  "success": true,
  "data": {
    "audioFileId": 1,
    "url": "http://localhost:3001/files/audio/pei_1_audio.mp3",
    "duration": 305,
    "voiceId": "21m00Tcm4TlvDq8ikWAM",
    "charactersUsed": 2456,
    "createdAt": "2025-10-12T..."
  }
}
```

---

### **Probar con cURL**:

```bash
# Generar audio
curl -X POST http://localhost:3001/elevenlabs/pei/1/audio

# Descargar audio
curl -O http://localhost:3001/files/audio/pei_1_audio.mp3
```

---

## 🔄 TEST 6: N8N WORKFLOW - ENVIAR EMAIL

### **Objetivo**: Automatizar envío de reporte por email

---

### **Paso 1: Ir a Workflow Demo**

```
URL: http://localhost:8080/workflow-demo
```

---

### **Paso 2: Seleccionar workflow**

```
Workflow: "Enviar Reporte por Email"
```

---

### **Paso 3: Llenar datos**

```
Email destinatario: padre@example.com
Estudiante: Ana Pérez
ID del PEI: 1
Mensaje personalizado: "Estimados padres, adjunto el PEI actualizado de Ana."
```

---

### **Paso 4: Click "Ejecutar Workflow"**

---

### **Paso 5: Ver resultado**

```
✅ Workflow ejecutado exitosamente
📧 Email enviado a: padre@example.com
📎 Adjunto: PEI_Ana_Perez_2025.pdf
⏱️ Tiempo de ejecución: 2.3s
🆔 Execution ID: wf-exec-12345
```

---

### **Endpoint usado**:

```http
POST http://localhost:3001/n8n/trigger

Content-Type: application/json

Body:
{
  "workflowId": "send-report-email",
  "data": {
    "recipientEmail": "padre@example.com",
    "studentName": "Ana Pérez",
    "peiId": 1,
    "message": "Estimados padres, adjunto el PEI actualizado de Ana."
  }
}

Response:
{
  "success": true,
  "data": {
    "executionId": "wf-exec-12345",
    "status": "success",
    "startedAt": "2025-10-12T10:30:00Z",
    "finishedAt": "2025-10-12T10:30:02Z",
    "data": {
      "emailSent": true,
      "messageId": "msg-abc123"
    }
  }
}
```

---

## 🔍 TEST 7: BUSCAR RECURSOS EDUCATIVOS

### **Objetivo**: Buscar recursos para dislexia

---

### **Paso 1: Ir a Recursos**

```
URL: http://localhost:8080/recursos
```

---

### **Paso 2: Búsqueda**

```
Query: "recursos educativos para dislexia primaria"
Filtros: 
  - Nivel: Primaria
  - Tipo: Material digital
```

---

### **Paso 3: Ver resultados**

```
📚 Resultados encontrados: 15

1. OpenDyslexic Font
   Tipo: Fuente
   Descripción: Fuente especialmente diseñada para dislexia
   URL: https://opendyslexic.org/
   
2. Dyslexia Quest
   Tipo: Juego educativo
   Plataforma: iOS/Android
   Descripción: Juego para practicar lectura
   
3. Material Montessori Lectura
   Tipo: Actividades
   Edad: 6-10 años
   PDF descargable
```

---

### **Endpoint usado**:

```http
POST http://localhost:3001/linkup/search

Content-Type: application/json

Body:
{
  "query": "recursos educativos para dislexia primaria",
  "maxResults": 15
}

Response:
{
  "success": true,
  "data": [
    {
      "title": "OpenDyslexic Font",
      "url": "https://opendyslexic.org/",
      "description": "Fuente especialmente diseñada...",
      "type": "font",
      "relevanceScore": 0.95
    },
    ...
  ]
}
```

---

## 🧪 TEST 8: HEALTH CHECK - VERIFICAR SERVICIOS

### **Objetivo**: Verificar que todos los servicios están funcionando

---

### **Endpoint de Health**:

```http
GET http://localhost:3001/health

Response:
{
  "status": "ok",
  "timestamp": "2025-10-12T10:30:00.000Z",
  "services": {
    "database": {
      "status": "up",
      "responseTime": "5ms"
    },
    "bedrock": {
      "status": "up",
      "region": "us-east-1",
      "models": ["claude-3-sonnet", "llama-3-70b"]
    },
    "elevenlabs": {
      "status": "up",
      "charactersRemaining": 98542,
      "voicesAvailable": 12
    },
    "n8n": {
      "status": "up",
      "url": "http://localhost:5678",
      "activeWorkflows": 3
    }
  }
}
```

---

### **Probar con cURL**:

```bash
curl http://localhost:3001/health | jq
```

---

## 📊 RESUMEN DE ENDPOINTS

| Funcionalidad | Método | Endpoint | Body Required |
|---------------|--------|----------|---------------|
| **Crear Estudiante** | POST | `/uploads/students` | FormData |
| **Generar PEI** | POST | `/peis/generate` | `{ studentId, reportId }` |
| **Descargar PEI PDF** | GET | `/peis/:id/pdf` | - |
| **Simplificar Contenido** | POST | `/bedrock/simplify-content` | `{ text, targetLevel }` |
| **Generar PEI Bedrock** | POST | `/bedrock/generate-pei` | `{ studentName, diagnosis, ... }` |
| **Generar Audio PEI** | POST | `/elevenlabs/pei/:id/audio` | - |
| **Texto a Audio** | POST | `/elevenlabs/text-to-speech` | `{ text, voiceId }` |
| **Buscar Recursos** | POST | `/linkup/search` | `{ query, maxResults }` |
| **Ejecutar Workflow** | POST | `/n8n/trigger` | `{ workflowId, data }` |
| **Health Check** | GET | `/health` | - |

---

## 🎯 CHECKLIST COMPLETO

### Backend:
- [ ] ✅ Backend corriendo en puerto 3001
- [ ] ✅ Base de datos conectada
- [ ] ✅ AWS Bedrock configurado
- [ ] ✅ ElevenLabs API key activa
- [ ] ✅ N8N corriendo en puerto 5678

### Tests:
- [ ] ✅ Subir informe médico
- [ ] ✅ Generar PEI desde reporte
- [ ] ✅ Descargar PEI en PDF
- [ ] ✅ Simplificar contenido con Bedrock
- [ ] ✅ Generar PEI con formulario
- [ ] ✅ Generar audio del PEI
- [ ] ✅ Ejecutar workflow N8N
- [ ] ✅ Buscar recursos educativos
- [ ] ✅ Health check respondiendo

---

## 🐛 TROUBLESHOOTING

### Error: "Backend no disponible"
```bash
# Verificar que backend está corriendo
curl http://localhost:3001/health

# Si no responde, iniciar backend:
cd neuroplan-backend
npm run start:dev
```

### Error: "AWS Bedrock no configurado"
```bash
# Verificar variables de entorno
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=tu_key
AWS_SECRET_ACCESS_KEY=tu_secret
```

### Error: "ElevenLabs API key inválida"
```bash
# Verificar en .env del backend
ELEVENLABS_API_KEY=tu_api_key
```

---

## 📞 SOPORTE

Si algo falla:

1. **Ver logs del backend**:
   ```bash
   # Terminal del backend mostrará errores
   ```

2. **Ver consola del navegador**:
   ```
   F12 → Console
   Buscar errores en rojo
   ```

3. **Verificar network**:
   ```
   F12 → Network
   Ver requests fallidos
   ```

---

**Estado**: ✅ LISTO PARA TESTING
**Última actualización**: 12 octubre 2025
