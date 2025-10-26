# 🚀 QUICK START - TESTING EN 5 MINUTOS

## ✅ FRONTEND CORRIENDO
```
URL: http://localhost:8080/
```

---

## 🎯 TEST RÁPIDO #1: SUBIR INFORME Y GENERAR PEI

### ⏱️ Tiempo: 2 minutos

### 📝 **PASO 1**: Crear archivo de prueba

Crea `informe_test.txt`:

```
INFORME MÉDICO

Nombre: María López
Edad: 9 años
Diagnóstico: Dislexia

Síntomas:
- Dificultad de lectura
- Inversión de letras (b/d)
- Lectura lenta

Recomendaciones:
- Fuente adaptada
- Tiempo extra en exámenes
- Material visual
```

---

### 📤 **PASO 2**: Subir informe

```
1. Ve a: http://localhost:8080/pei-engine
2. Tab "Crear Estudiante"
3. Nombre: María López
4. Edad: 9
5. Grado: 4° Primaria
6. Diagnóstico: Dislexia
7. Seleccionar archivo: informe_test.txt
8. Click "Crear Estudiante"
9. ✅ Ver toast: "Estudiante creado"
```

---

### 🧠 **PASO 3**: Generar PEI

```
1. Tab "Generar PEI"
2. Seleccionar: María López
3. Click "Generar PEI con IA"
4. Esperar barra de progreso (30-60 seg)
5. ✅ Ver PEI completo generado!
```

---

### 📥 **PASO 4**: Descargar PDF

```
1. Click "📥 Descargar PDF"
2. ✅ Archivo descargado: PEI_Maria_Lopez_2025.pdf
```

---

## 🎯 TEST RÁPIDO #2: AWS BEDROCK - SIMPLIFICAR TEXTO

### ⏱️ Tiempo: 1 minuto

```
1. Ve a: http://localhost:8080/bedrock-demo
2. Tab "Simplificar Contenido"
3. Pega este texto:

   "La fotosíntesis es un proceso bioquímico 
   mediante el cual las plantas convierten 
   energía lumínica en energía química."

4. Nivel: Elementary
5. Click "Simplificar Contenido"
6. ✅ Ver texto simplificado:
   
   "Las plantas usan la luz del sol 
   para hacer su comida. Esto se llama 
   fotosíntesis."
```

---

## 🎯 TEST RÁPIDO #3: GENERAR AUDIO

### ⏱️ Tiempo: 1 minuto

```
1. En el PEI de María López
2. Click "🎙️ Generar Audio del PEI"
3. Esperar 30-60 segundos
4. ✅ Reproducir audio generado
5. Click "📥 Download" para descargar MP3
```

---

## 🎯 TEST RÁPIDO #4: N8N WORKFLOW

### ⏱️ Tiempo: 1 minuto

```
1. Ve a: http://localhost:8080/workflow-demo
2. Workflow: "Enviar Reporte por Email"
3. Email: test@example.com
4. Estudiante: María López
5. PEI ID: 1
6. Click "Ejecutar Workflow"
7. ✅ Ver: "Workflow ejecutado exitosamente"
```

---

## 📊 ENDPOINTS PARA TESTING MANUAL

### Con cURL o Postman:

#### 1. Health Check
```bash
curl http://localhost:3001/health
```

#### 2. Crear Estudiante
```bash
curl -X POST http://localhost:3001/uploads/students \
  -F "name=María López" \
  -F "age=9" \
  -F "gradeLevel=4° Primaria" \
  -F "diagnosis=Dislexia" \
  -F "file=@informe_test.txt"
```

#### 3. Generar PEI
```bash
curl -X POST http://localhost:3001/peis/generate \
  -H "Content-Type: application/json" \
  -d '{"studentId": 1, "reportId": 1}'
```

#### 4. Simplificar Contenido
```bash
curl -X POST http://localhost:3001/bedrock/simplify-content \
  -H "Content-Type: application/json" \
  -d '{
    "text": "La fotosíntesis es un proceso...",
    "targetLevel": "elementary"
  }'
```

#### 5. Generar Audio
```bash
curl -X POST http://localhost:3001/elevenlabs/pei/1/audio
```

#### 6. Ejecutar Workflow
```bash
curl -X POST http://localhost:3001/n8n/trigger \
  -H "Content-Type: application/json" \
  -d '{
    "workflowId": "send-report-email",
    "data": {
      "recipientEmail": "test@example.com",
      "studentName": "María López",
      "peiId": 1
    }
  }'
```

---

## 🔍 VERIFICAR BACKEND

### Backend debe estar corriendo en puerto 3001:

```bash
# Health Check
curl http://localhost:3001/health

# Respuesta esperada:
{
  "status": "ok",
  "services": {
    "database": { "status": "up" },
    "bedrock": { "status": "up" },
    "elevenlabs": { "status": "up" },
    "n8n": { "status": "up" }
  }
}
```

### Si backend NO está corriendo:

```bash
cd neuroplan-backend
npm run start:dev
```

---

## ✅ CHECKLIST DE 5 MINUTOS

- [ ] ✅ Frontend: http://localhost:8080/ (verde)
- [ ] ✅ Backend: http://localhost:3001/health (responde)
- [ ] ✅ Crear estudiante con informe
- [ ] ✅ Generar PEI
- [ ] ✅ Simplificar contenido
- [ ] ✅ Generar audio
- [ ] ✅ Ejecutar workflow

---

## 🎨 BONUS: PROBAR ACCESIBILIDAD

```
1. Click en botón ♿ (arriba derecha)
2. Activar "🔍 Lupa"
3. Pasar mouse por elementos → se agrandan
4. Activar "📏 Guía de Lectura" → línea roja
5. Activar "🌙 Alto Contraste" → colores fuertes
6. Desactivar todo → vuelve a la normalidad
7. Recargar página → todo limpio ✅
```

---

## 🐛 SI ALGO FALLA

### Error: "Backend no disponible"
```bash
# Iniciar backend:
cd ../neuroplan-backend
npm run start:dev
```

### Error: "AWS Bedrock no configurado"
```
Revisar archivo .env del backend:
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=...
AWS_SECRET_ACCESS_KEY=...
```

### Error: "ElevenLabs no responde"
```
Revisar .env del backend:
ELEVENLABS_API_KEY=...
```

---

## 📞 COMANDOS ÚTILES

### Limpiar caché frontend:
```
F12 → Console:
localStorage.clear();
location.reload();
```

### Ver logs backend:
```bash
# En terminal donde corre el backend
# Verás todos los requests y errores
```

### Reiniciar todo:
```bash
# Terminal 1 - Backend
Ctrl+C
npm run start:dev

# Terminal 2 - Frontend
Ctrl+C
npm run dev
```

---

**Estado**: ✅ LISTO PARA TESTING
**Frontend**: http://localhost:8080/
**Backend**: http://localhost:3001/

**Documentación completa**: Ver `GUIA_TESTING_PRACTICA.md`
