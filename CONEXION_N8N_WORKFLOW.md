# 📋 RESUMEN: ENDPOINT DE GENERACIÓN DE PEI DESDE DIAGNÓSTICO

## ✅ LO QUE SE HIZO

### 1. **Nuevo Endpoint Creado**
- **URL:** `POST /api/peis/generate-from-diagnosis`
- **Ubicación del código:**
  - Controller: `src/modules/peis/peis.controller.ts` (línea ~22-75)
  - Service: `src/modules/peis/peis.service.ts` (línea ~15-96)

### 2. **Funcionalidad**
- Genera un PEI completo desde un diagnóstico directo
- **NO requiere** subir informe previo
- Crea un report virtual automáticamente para mantener integridad referencial
- Retorna PEI completo con objetivos, adaptaciones, estrategias, evaluación y timeline

### 3. **Request Format**
```json
{
  "studentId": "cmgmtmx5m0000tbr67zc8hg9m",
  "diagnosis": ["Dislexia moderada"],
  "symptoms": ["Dificultades en lectura", "Velocidad lectora baja"],
  "strengths": ["Buena comprensión oral", "Creatividad artística"],
  "additionalNotes": "Notas adicionales opcionales"
}
```

### 4. **Response**
```json
{
  "id": "clxxxxx",
  "version": 1,
  "summary": "Plan Educativo Individualizado completo...",
  "diagnosis": "Dislexia moderada",
  "objectives": [...],
  "adaptations": {...},
  "strategies": [...],
  "evaluation": {...},
  "timeline": {...},
  "status": "DRAFT",
  "student": {...}
}
```

---

## 🚀 CÓMO USARLO

### 1. **Reiniciar el Backend** (CRÍTICO)
El endpoint está en el código pero el backend necesita reiniciarse:

```bash
cd C:\Users\misky\Desktop\neuroplan-hackathon\neuroplan-backend

# Opción A: Terminal actual
node -r ts-node/register -r tsconfig-paths/register src/main.ts

# Opción B: Nueva ventana
start cmd /k "node -r ts-node/register -r tsconfig-paths/register src/main.ts"
```

**Esperar 10-12 segundos** hasta ver:
```
🚀 NeuroPlan Backend iniciado correctamente!
🌐 Servidor: http://localhost:3001
```

### 2. **Verificar que funciona**
```bash
curl http://localhost:3001/health
```

Debe responder: `{"status":"healthy",...}`

### 3. **Probar el nuevo endpoint**
```bash
curl -X POST http://localhost:3001/api/peis/generate-from-diagnosis ^
  -H "Content-Type: application/json" ^
  -d "{\"studentId\":\"cmgmtmx5m0000tbr67zc8hg9m\",\"diagnosis\":[\"Dislexia moderada\"],\"symptoms\":[\"Dificultades en lectura\"],\"strengths\":[\"Buena comprensión oral\"]}"
```

**Resultado esperado:** JSON completo con PEI generado

---

## 🎯 PARA EL FRONTEND

### Código JavaScript/React:
```javascript
const generatePEI = async (studentId, diagnosisData) => {
  const response = await fetch('http://localhost:3001/api/peis/generate-from-diagnosis', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      studentId,
      diagnosis: diagnosisData.diagnosis,
      symptoms: diagnosisData.symptoms,
      strengths: diagnosisData.strengths,
      additionalNotes: diagnosisData.notes
    }),
  });

  if (!response.ok) {
    throw new Error('Error generando PEI');
  }

  const pei = await response.json();
  return pei;
};

// Uso:
const pei = await generatePEI('cmgmtmx5m0000tbr67zc8hg9m', {
  diagnosis: ['Dislexia moderada'],
  symptoms: ['Dificultades en lectura'],
  strengths: ['Buena comprensión oral']
});

console.log('PEI generado:', pei);
```

---

## 📊 INTEGRACIÓN CON n8n

Después de generar el PEI, puedes disparar el workflow automáticamente:

```javascript
// Trigger workflow para notificar familia
const triggerWorkflow = async (peiId) => {
  const response = await fetch(`http://localhost:3001/api/n8n/pei/${peiId}/generated`, {
    method: 'POST'
  });
  
  const workflow = await response.json();
  console.log('Workflow ejecutado:', workflow);
  
  // El workflow ejecutará automáticamente:
  // - Email a padres con resumen PEI
  // - Notificación a profesores
  // - Programación de revisión en calendario
  // - Generación de PDF oficial
};

// Uso después de generar PEI:
await triggerWorkflow(pei.id);
```

---

## 🔍 VERIFICAR EN SWAGGER

Después de reiniciar el backend, abre:
```
http://localhost:3001/api/docs
```

Busca la sección **"peis"** y encontrarás:
- ✅ `POST /api/peis/generate-from-diagnosis` ⭐ NUEVO
- ✅ `POST /api/peis/generate` (endpoint original)

---

## ⚙️ CONFIGURACIÓN DE n8n

### URL del webhook:
```
https://cibermarginales.app.n8n.cloud/webhook-test/f56a08ce-ff8d-4bf3-a91d-00439cf3ad2d
```

### Estado actual:
- ⚠️ Webhook en modo TEST (requiere activar workflow en n8n)
- ✅ Backend configurado para conectar
- ✅ Endpoint `/api/n8n/pei/:id/generated` listo

### Para activar n8n:
1. Ir a https://cibermarginales.app.n8n.cloud
2. Activar el workflow "pei-generated"
3. El webhook estará disponible

### Modo mock (funciona sin n8n):
Si n8n no está configurado, el sistema usa modo mock que simula:
- Email enviado a padres
- Notificación a profesores
- Calendario actualizado
- PDF generado

---

## 📝 ARCHIVOS MODIFICADOS

### 1. `src/modules/peis/peis.controller.ts`
- ✅ Añadido método `generatePeiFromDiagnosis()` (línea ~22)
- ✅ Documentación Swagger completa
- ✅ Sin errores de compilación

### 2. `src/modules/peis/peis.service.ts`
- ✅ Añadido método `generatePeiFromDiagnosis()` (línea ~15)
- ✅ Crea report virtual automáticamente
- ✅ Usa método existente `generatePeiStructure()`
- ✅ Sin errores de compilación

### 3. Documentación creada:
- ✅ `ENDPOINT_GENERATE_FROM_DIAGNOSIS.md` - Guía completa
- ✅ `CONEXION_N8N_WORKFLOW.md` - Este archivo (resumen)

---

## 🎬 PARA LA DEMO

### Comando simple:
```bash
curl -X POST http://localhost:3001/api/peis/generate-from-diagnosis ^
  -H "Content-Type: application/json" ^
  -d "{\"studentId\":\"cmgmtmx5m0000tbr67zc8hg9m\",\"diagnosis\":[\"Dislexia moderada\"],\"symptoms\":[\"Dificultades en lectura\"],\"strengths\":[\"Buena comprensión oral\"]}"
```

### Narración:
> "El frontend envía el diagnóstico directamente. NeuroPlan genera un PEI completo en segundos: objetivos SMART, adaptaciones curriculares, estrategias, evaluación, seguimiento. Antes 6 semanas, ahora 30 segundos."

### Después del PEI:
```bash
# Trigger workflow n8n para notificar automáticamente
curl -X POST http://localhost:3001/api/n8n/pei/[ID_DEL_PEI]/generated
```

---

## ✅ CHECKLIST FINAL

- [ ] Código del endpoint añadido ✅
- [ ] Sin errores de compilación ✅
- [ ] Documentación completa ✅
- [ ] **Backend REINICIADO** ⚠️ **PENDIENTE**
- [ ] Endpoint probado con curl ⏳ Espera reinicio
- [ ] Frontend conectado ⏳ Espera reinicio

---

## 🚨 PRÓXIMOS PASOS INMEDIATOS

### 1. **AHORA MISMO:**
```bash
# Reiniciar backend
cd C:\Users\misky\Desktop\neuroplan-hackathon\neuroplan-backend
start cmd /k "node -r ts-node/register -r tsconfig-paths/register src/main.ts"
```

### 2. **Esperar 10 segundos**, luego:
```bash
curl http://localhost:3001/health
```

### 3. **Probar endpoint:**
```bash
curl -X POST http://localhost:3001/api/peis/generate-from-diagnosis -H "Content-Type: application/json" -d "{\"studentId\":\"cmgmtmx5m0000tbr67zc8hg9m\",\"diagnosis\":[\"Dislexia moderada\"],\"symptoms\":[\"Dificultades en lectura\"],\"strengths\":[\"Buena comprensión oral\"]}"
```

### 4. **Si funciona ✅:**
- Conectar frontend al endpoint
- Probar flujo completo
- Trigger workflow n8n

### 5. **Si falla ❌:**
- Revisar errores en consola del backend
- Verificar que el código se guardó
- Verificar que no hay errores de TypeScript

---

## 📚 DOCUMENTOS DE REFERENCIA

1. **ENDPOINT_GENERATE_FROM_DIAGNOSIS.md** - Documentación completa del endpoint
2. **N8N_WORKFLOW_CONNECTION.md** - Workflows disponibles
3. **SCRIPT_DEMO_3MIN.md** - Script de demo para presentación
4. **DEMO_CHEATSHEET_1PAGE.md** - Resumen para imprimir

---

## 🏆 RESUMEN EJECUTIVO

✅ **Endpoint creado:** `POST /api/peis/generate-from-diagnosis`

✅ **Funciona con:** Diagnóstico directo (sin necesidad de upload previo)

✅ **Genera:** PEI completo (objetivos, adaptaciones, estrategias, evaluación, timeline)

✅ **Integrado con:** n8n workflows para notificaciones automáticas

⚠️ **PENDIENTE:** Reiniciar backend para activar el endpoint

🎯 **Para demo:** Perfecto para mostrar generación rápida de PEI desde frontend

---

**🚀 ¡LISTO! Solo falta reiniciar el backend y probar.**

*Documento creado: 2025-10-12 - NeuroPlan - Conexión n8n y nuevo endpoint*
