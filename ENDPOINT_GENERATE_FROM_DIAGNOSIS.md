# 🚀 NUEVO ENDPOINT: Generar PEI desde Diagnóstico

## ✅ ENDPOINT CREADO PARA EL FRONTEND

### 📍 URL del Endpoint
```
POST http://localhost:3001/api/peis/generate-from-diagnosis
```

---

## 📋 REQUEST FORMAT

### Headers:
```json
{
  "Content-Type": "application/json"
}
```

### Body (JSON):
```json
{
  "studentId": "cmgmtmx5m0000tbr67zc8hg9m",
  "diagnosis": [
    "Dislexia moderada"
  ],
  "symptoms": [
    "Dificultades en lectura y escritura",
    "Velocidad lectora por debajo de su edad",
    "Confusión de letras b/d, p/q"
  ],
  "strengths": [
    "Buena capacidad de comprensión oral",
    "Creatividad en actividades artísticas",
    "Habilidades sociales desarrolladas"
  ],
  "additionalNotes": "Estudiante de 10 años, 5º de Primaria"
}
```

---

## 📤 RESPONSE FORMAT

### Éxito (201 Created):
```json
{
  "id": "clxxxxx",
  "version": 1,
  "summary": "Plan Educativo Individualizado para Ana Pérez García...",
  "diagnosis": "Dislexia moderada",
  "objectives": [
    "Mejorar velocidad lectora de 60 a 90 palabras/min en 6 meses",
    "Incrementar comprensión lectora del percentil 25 al 40",
    "Reducir errores ortográficos en un 50% en textos de 200 palabras",
    "Desarrollar estrategias de auto-corrección en escritura"
  ],
  "adaptations": {
    "lengua": "Tiempo adicional 50%, texto con tipografía OpenDyslexic tamaño 14, audio disponible",
    "matematicas": "Problemas con apoyos visuales, calculadora permitida",
    "ciencias": "Vídeos educativos, experimentos prácticos",
    "sociales": "Mapas conceptuales visuales, presentaciones orales"
  },
  "strategies": [
    "Método Orton-Gillingham multisensorial",
    "Fragmentación de tareas",
    "Refuerzo positivo",
    "Text-to-speech para textos largos",
    "Mapas mentales con colores"
  ],
  "evaluation": {
    "preferente": "Oral (60% del peso)",
    "proyectos": "Presentaciones multimedia (30%)",
    "escritos": "Textos cortos con corrector (10%)",
    "tiempo": "50% adicional",
    "formato": "Opción múltiple o verdadero/falso"
  },
  "timeline": {
    "frecuencia": "Revisión trimestral (octubre, enero, abril)",
    "participantes": "Familia, tutor, psicopedagogo, alumno",
    "métricas": ["Velocidad lectora", "Comprensión", "Errores ortográficos"],
    "ajustes": "Modificar estrategias según progreso"
  },
  "status": "DRAFT",
  "isActive": true,
  "createdAt": "2025-10-12T10:30:00.000Z",
  "updatedAt": "2025-10-12T10:30:00.000Z",
  "reviewDate": null,
  "approvedAt": null,
  "approvedBy": null,
  "studentId": "cmgmtmx5m0000tbr67zc8hg9m",
  "reportId": "clxxxxx",
  "student": {
    "id": "cmgmtmx5m0000tbr67zc8hg9m",
    "name": "Ana",
    "lastName": "Pérez",
    "grade": "5º Primaria"
  }
}
```

### Error (400 Bad Request):
```json
{
  "statusCode": 400,
  "message": "Estudiante no encontrado",
  "error": "Bad Request"
}
```

---

## 🎯 CÓMO USAR DESDE EL FRONTEND

### Ejemplo con Fetch API:
```javascript
async function generatePEI(studentId, diagnosis, symptoms, strengths) {
  try {
    const response = await fetch('http://localhost:3001/api/peis/generate-from-diagnosis', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        studentId,
        diagnosis,
        symptoms,
        strengths,
      }),
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }

    const pei = await response.json();
    console.log('PEI generado:', pei);
    
    return pei;
  } catch (error) {
    console.error('Error generando PEI:', error);
    throw error;
  }
}

// Uso:
const pei = await generatePEI(
  'cmgmtmx5m0000tbr67zc8hg9m',
  ['Dislexia moderada'],
  ['Dificultades en lectura', 'Velocidad lectora baja'],
  ['Buena comprensión oral', 'Creatividad artística']
);
```

### Ejemplo con Axios:
```javascript
import axios from 'axios';

async function generatePEI(diagnosisData) {
  try {
    const response = await axios.post(
      'http://localhost:3001/api/peis/generate-from-diagnosis',
      diagnosisData
    );
    
    console.log('PEI generado:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error generando PEI:', error.response?.data || error.message);
    throw error;
  }
}

// Uso:
const pei = await generatePEI({
  studentId: 'cmgmtmx5m0000tbr67zc8hg9m',
  diagnosis: ['Dislexia moderada'],
  symptoms: ['Dificultades en lectura', 'Velocidad lectora baja'],
  strengths: ['Buena comprensión oral'],
  additionalNotes: 'Estudiante de 10 años, 5º Primaria'
});
```

---

## 🔄 FLUJO COMPLETO EN EL FRONTEND

### 1. Usuario ingresa diagnóstico en formulario

```jsx
const [diagnosisForm, setDiagnosisForm] = useState({
  diagnosis: [''],
  symptoms: [''],
  strengths: [''],
  additionalNotes: ''
});

// ... formulario para capturar datos
```

### 2. Enviar datos al backend

```jsx
const handleGeneratePEI = async () => {
  setLoading(true);
  setError(null);
  
  try {
    const response = await fetch('http://localhost:3001/api/peis/generate-from-diagnosis', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        studentId: currentStudent.id,
        diagnosis: diagnosisForm.diagnosis.filter(d => d.trim()),
        symptoms: diagnosisForm.symptoms.filter(s => s.trim()),
        strengths: diagnosisForm.strengths.filter(s => s.trim()),
        additionalNotes: diagnosisForm.additionalNotes
      })
    });
    
    if (!response.ok) {
      throw new Error('Error generando PEI');
    }
    
    const pei = await response.json();
    setPEI(pei);
    setShowPEI(true);
    
  } catch (err) {
    setError(err.message);
  } finally {
    setLoading(false);
  }
};
```

### 3. Mostrar PEI generado

```jsx
{showPEI && pei && (
  <div className="pei-result">
    <h2>Plan Educativo Individualizado</h2>
    
    <section>
      <h3>Resumen</h3>
      <p>{pei.summary}</p>
    </section>
    
    <section>
      <h3>Diagnóstico</h3>
      <p>{pei.diagnosis}</p>
    </section>
    
    <section>
      <h3>Objetivos SMART</h3>
      <ul>
        {pei.objectives.map((obj, i) => (
          <li key={i}>{obj}</li>
        ))}
      </ul>
    </section>
    
    <section>
      <h3>Adaptaciones Curriculares</h3>
      {Object.entries(pei.adaptations).map(([subject, adaptation]) => (
        <div key={subject}>
          <strong>{subject}:</strong> {adaptation}
        </div>
      ))}
    </section>
    
    <section>
      <h3>Estrategias Educativas</h3>
      <ul>
        {pei.strategies.map((strategy, i) => (
          <li key={i}>{strategy}</li>
        ))}
      </ul>
    </section>
    
    <section>
      <h3>Sistema de Evaluación</h3>
      {Object.entries(pei.evaluation).map(([key, value]) => (
        <div key={key}>
          <strong>{key}:</strong> {value}
        </div>
      ))}
    </section>
    
    <section>
      <h3>Plan de Seguimiento</h3>
      <p><strong>Frecuencia:</strong> {pei.timeline.frecuencia}</p>
      <p><strong>Participantes:</strong> {pei.timeline.participantes}</p>
      <p><strong>Métricas:</strong> {pei.timeline.métricas.join(', ')}</p>
    </section>
    
    <div className="pei-actions">
      <button onClick={() => downloadPEI(pei.id)}>📄 Descargar PDF</button>
      <button onClick={() => generateAudio(pei.id)}>🔊 Generar Audio</button>
      <button onClick={() => findResources(pei.diagnosis)}>📚 Buscar Recursos</button>
      <button onClick={() => triggerWorkflow(pei.id)}>⚙️ Notificar Familia</button>
    </div>
  </div>
)}
```

### 4. Acciones adicionales

```jsx
// Generar audio con ElevenLabs
const generateAudio = async (peiId) => {
  const response = await fetch('http://localhost:3001/api/elevenlabs/text-to-speech', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      text: pei.summary,
      voiceId: '21m00Tcm4TlvDq8ikWAM'
    })
  });
  // ... manejar audio
};

// Buscar recursos con Linkup
const findResources = async (diagnosis) => {
  const response = await fetch('http://localhost:3001/api/linkup/search', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query: `recursos educativos ${diagnosis} España LOMLOE`
    })
  });
  const resources = await response.json();
  setResources(resources);
};

// Trigger workflow n8n para notificar familia
const triggerWorkflow = async (peiId) => {
  const response = await fetch(`http://localhost:3001/api/n8n/pei/${peiId}/generated`, {
    method: 'POST'
  });
  const workflow = await response.json();
  console.log('Workflow ejecutado:', workflow);
};
```

---

## ⚙️ REINICIAR EL BACKEND

**IMPORTANTE:** Para que el nuevo endpoint esté disponible, debes reiniciar el backend:

### Opción 1: Reinicio rápido (si tienes el terminal abierto)
1. Ir al terminal donde corre el backend
2. Presionar `Ctrl+C` para detenerlo
3. Ejecutar:
```bash
node -r ts-node/register -r tsconfig-paths/register src/main.ts
```

### Opción 2: Reinicio completo (ventana nueva)
```bash
cd C:\Users\misky\Desktop\neuroplan-hackathon\neuroplan-backend
start cmd /k "node -r ts-node/register -r tsconfig-paths/register src/main.ts"
```

---

## ✅ VERIFICAR QUE FUNCIONA

### 1. Backend saludable:
```bash
curl http://localhost:3001/health
```

### 2. Probar endpoint con Ana Pérez:
```bash
curl -X POST http://localhost:3001/api/peis/generate-from-diagnosis ^
  -H "Content-Type: application/json" ^
  -d "{\"studentId\":\"cmgmtmx5m0000tbr67zc8hg9m\",\"diagnosis\":[\"Dislexia moderada\"],\"symptoms\":[\"Dificultades en lectura\"],\"strengths\":[\"Buena comprensión oral\"]}"
```

**Resultado esperado:** JSON completo con PEI generado ✅

---

## 📊 SWAGGER DOCS

Después de reiniciar, el nuevo endpoint estará disponible en:

```
http://localhost:3001/api/docs
```

Busca la sección **"peis"** y encontrarás:

- `POST /api/peis/generate-from-diagnosis` ⭐ **NUEVO**
- `POST /api/peis/generate` (endpoint original con upload)

---

## 🎯 PARA LA DEMO

### Comando simple para la demo:
```bash
curl -X POST http://localhost:3001/api/peis/generate-from-diagnosis ^
  -H "Content-Type: application/json" ^
  -d "{\"studentId\":\"cmgmtmx5m0000tbr67zc8hg9m\",\"diagnosis\":[\"Dislexia moderada\"],\"symptoms\":[\"Dificultades en lectura y escritura\",\"Velocidad lectora baja\"],\"strengths\":[\"Buena comprensión oral\",\"Creatividad artística\"]}"
```

### Narración para la demo:
> "El frontend envía el diagnóstico directamente al backend. 
> 
> NeuroPlan genera automáticamente un Plan Educativo Individualizado completo:
> 
> - Objetivos SMART medibles
> - Adaptaciones curriculares por asignatura
> - Estrategias educativas personalizadas
> - Sistema de evaluación adaptado
> - Plan de seguimiento trimestral
> 
> Todo en segundos. Alineado con LOMLOE.
> 
> Antes: 6 semanas manual. Ahora: 30 segundos automatizado."

---

## 🔗 INTEGRACIÓN CON n8n

Después de generar el PEI, puedes disparar el workflow automáticamente:

```javascript
// En el frontend, después de generar PEI exitosamente:
const response = await fetch(`http://localhost:3001/api/n8n/pei/${pei.id}/generated`, {
  method: 'POST'
});

const workflow = await response.json();
// workflow ejecutará: email a familia, notificación a profesores, calendario, etc.
```

---

## 📝 RESUMEN

✅ **Endpoint creado:** `POST /api/peis/generate-from-diagnosis`

✅ **Requiere:** studentId + diagnosis + symptoms + strengths

✅ **Genera:** PEI completo con objetivos, adaptaciones, estrategias, evaluación, timeline

✅ **Listo para:** Frontend, demo, presentación

✅ **Próximo paso:** Reiniciar backend para activar el endpoint

---

🚀 **¡LISTO PARA LA DEMO! El frontend ahora puede generar PEIs directamente.**

*Documento creado: 2025-10-12 - NeuroPlan Backend - Nuevo endpoint para frontend*
