# 🚀 AWS Backend → Frontend Integration Guide

**Para**: Desarrolladores Frontend  
**Fecha**: 11 Octubre 2025  
**Backend URL**: http://localhost:3001

---

## 📋 **¿Qué hace AWS en NeuroPlan?**

AWS proporciona **6 servicios de IA y almacenamiento** que el frontend puede usar para crear PEIs automáticos:

### **1. Amazon Bedrock** 🧠 (LLM - El más importante)
**Qué hace**: Genera PEIs completos usando Claude (modelo de IA de Anthropic)

**Uso principal**: Convertir diagnóstico médico → PEI estructurado

**Endpoint**: `POST /aws/bedrock/generate-pei`

---

### **2. AWS Textract** 📄 (OCR)
**Qué hace**: Extrae texto de PDFs/imágenes de informes médicos

**Uso principal**: Escanear informe psicopedagógico en PDF → texto plano

**Endpoints**:
- `POST /aws/textract/extract-text` - Extraer texto simple
- `POST /aws/textract/analyze-document` - Extraer formularios y tablas

---

### **3. AWS Comprehend Medical** 🏥 (NLP Médico)
**Qué hace**: Detecta entidades médicas (diagnósticos, síntomas, medicamentos)

**Uso principal**: Identificar automáticamente TDAH, dislexia, autismo en texto

**Endpoints**:
- `POST /aws/comprehend/detect-entities` - Detectar diagnósticos
- `POST /aws/comprehend/detect-phi` - Detectar datos sensibles (GDPR)

---

### **4. AWS S3** 💾 (Almacenamiento)
**Qué hace**: Guarda PDFs, imágenes, documentos en la nube

**Uso principal**: Almacenar informes médicos, PEIs generados

**Endpoints**:
- `POST /aws/s3/upload` - Subir archivo
- `GET /aws/s3/signed-url/:key` - Obtener URL temporal de descarga
- `DELETE /aws/s3/delete/:key` - Borrar archivo
- `GET /aws/s3/list/:folder` - Listar archivos en carpeta

---

### **5. AWS Polly** 🔊 (Text-to-Speech)
**Qué hace**: Convierte texto → audio en español

**Uso principal**: Leer el PEI en voz alta para estudiantes con dislexia

**Endpoints**:
- `POST /aws/polly/synthesize` - Generar audio
- `GET /aws/polly/voices` - Listar voces españolas

---

### **6. Amazon Q CLI** 🤖 (Developer Assistant)
**Qué hace**: Asistente IA para desarrolladores (terminal)

**Uso**: Optimizar código, debugging, arquitectura

**Nota**: CLI tool, no API REST

---

## 🎯 **Flujo Completo: Frontend → Backend AWS**

### **Caso de Uso: Generar PEI desde Informe Médico**

```
┌─────────────────────────────────────────────────────────────────┐
│                    FLUJO COMPLETO AWS                           │
└─────────────────────────────────────────────────────────────────┘

1. 📤 Usuario sube PDF del informe médico
   ↓
   Frontend: <input type="file" onChange={handleUpload} />
   ↓
   POST /aws/s3/upload
   Response: { url, key, bucket }

2. 📄 Extraer texto del PDF
   ↓
   Frontend: Enviar file.buffer a Textract
   ↓
   POST /aws/textract/extract-text
   Body: { fileBuffer: base64EncodedFile }
   Response: { 
     text: "INFORME PSICOPEDAGÓGICO...",
     confidence: 0.97,
     words: 387
   }

3. 🏥 Detectar diagnóstico automáticamente
   ↓
   Frontend: Enviar texto extraído
   ↓
   POST /aws/comprehend/detect-entities
   Body: { text: "... dislexia evolutiva moderada ..." }
   Response: {
     conditions: ["DISLEXIA EVOLUTIVA MODERADA"],
     symptoms: ["dificultad lectura", "inversiones letras"],
     medications: []
   }

4. 🧠 Generar PEI con Bedrock
   ↓
   Frontend: Enviar diagnóstico + contexto
   ↓
   POST /aws/bedrock/generate-pei
   Body: {
     diagnosis: "Dislexia evolutiva moderada",
     symptoms: "dificultad en lectoescritura",
     strengths: "razonamiento lógico",
     studentAge: 13,
     grade: "2º ESO"
   }
   Response: {
     pei: {
       objectives: [...],
       adaptations: { mathematics: [...], language: [...] },
       strategies: [...],
       evaluation: {...},
       followUp: {...}
     }
   }

5. 🔊 Generar audio del PEI (accesibilidad)
   ↓
   Frontend: Enviar resumen del PEI
   ↓
   POST /aws/polly/synthesize
   Body: {
     text: "Tu Plan Educativo Individualizado...",
     voiceId: "Lucia"
   }
   Response: {
     url: "https://s3.../audio-123.mp3",
     duration: 45
   }

6. ✅ Mostrar PEI en UI + reproducir audio
```

---

## 💻 **Código Frontend: Ejemplos React**

### **1. Generar PEI (El más importante)**

```tsx
import { useState } from 'react';

interface PEIGenerationRequest {
  diagnosis: string;
  symptoms: string;
  strengths: string;
  studentAge: number;
  grade: string;
}

function GeneratePEIButton() {
  const [loading, setLoading] = useState(false);
  const [pei, setPei] = useState(null);

  const generatePEI = async () => {
    setLoading(true);
    
    try {
      const response = await fetch('http://localhost:3001/aws/bedrock/generate-pei', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          diagnosis: 'Dislexia evolutiva moderada',
          symptoms: 'dificultad en lectoescritura, inversiones de letras',
          strengths: 'razonamiento lógico, expresión oral',
          studentAge: 13,
          grade: '2º ESO'
        })
      });

      const data = await response.json();
      setPei(data.pei);
      
      console.log('✅ PEI generado:', data);
      // Mostrar en UI: data.pei.objectives, data.pei.adaptations, etc.
      
    } catch (error) {
      console.error('❌ Error generando PEI:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button onClick={generatePEI} disabled={loading}>
      {loading ? 'Generando PEI con IA...' : 'Generar PEI Automático'}
    </button>
  );
}
```

**Respuesta esperada**:
```json
{
  "pei": {
    "objectives": [
      {
        "area": "Lectoescritura",
        "objective": "Mejorar precisión lectora en 30% en 6 meses",
        "indicator": "Reducir errores de 15/100 palabras a 10/100",
        "deadline": "Marzo 2026"
      }
    ],
    "adaptations": {
      "mathematics": [
        "Problemas con enunciados simplificados",
        "Tiempo extra en exámenes (50%)"
      ],
      "language": [
        "Evaluación oral preferente",
        "Material con letra grande (14pt)"
      ]
    },
    "strategies": [
      "Programa de conciencia fonológica (3 sesiones/semana)",
      "Uso de text-to-speech en lecturas largas"
    ],
    "evaluation": {
      "frequency": "Trimestral",
      "methods": ["Observación directa", "Pruebas estandarizadas"],
      "indicators": ["Velocidad lectora", "Comprensión", "Ortografía"]
    },
    "followUp": {
      "nextReview": "2026-01-15",
      "responsibles": ["Tutor", "Psicopedagoga", "Familia"],
      "meetingFrequency": "Mensual"
    }
  },
  "generatedAt": "2025-10-11T21:00:00.000Z",
  "confidence": 0.95,
  "model": "anthropic.claude-v2"
}
```

---

### **2. Extraer Texto de PDF**

```tsx
function UploadReport() {
  const [extractedText, setExtractedText] = useState('');

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Convertir a base64
    const reader = new FileReader();
    reader.onload = async () => {
      const base64 = (reader.result as string).split(',')[1];

      try {
        const response = await fetch('http://localhost:3001/aws/textract/extract-text', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            fileBuffer: base64 
          })
        });

        const data = await response.json();
        setExtractedText(data.text);
        
        console.log('📄 Texto extraído:', data.text);
        console.log('🎯 Confianza:', data.confidence);
        console.log('📊 Palabras:', data.words);
        
      } catch (error) {
        console.error('❌ Error extrayendo texto:', error);
      }
    };
    
    reader.readAsDataURL(file);
  };

  return (
    <div>
      <input type="file" accept=".pdf,.png,.jpg" onChange={handleFileUpload} />
      <pre>{extractedText}</pre>
    </div>
  );
}
```

---

### **3. Detectar Diagnóstico Automáticamente**

```tsx
function DetectDiagnosis() {
  const [diagnosis, setDiagnosis] = useState([]);

  const analyzeText = async (text: string) => {
    try {
      const response = await fetch('http://localhost:3001/aws/comprehend/detect-entities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text })
      });

      const data = await response.json();
      setDiagnosis(data.conditions);
      
      console.log('🏥 Diagnósticos detectados:', data.conditions);
      console.log('💊 Medicamentos:', data.medications);
      console.log('🩺 Síntomas:', data.symptoms);
      
    } catch (error) {
      console.error('❌ Error detectando entidades:', error);
    }
  };

  return (
    <div>
      <button onClick={() => analyzeText('Paciente con dislexia evolutiva...')}>
        Detectar Diagnóstico
      </button>
      <ul>
        {diagnosis.map((d, i) => <li key={i}>{d.text}</li>)}
      </ul>
    </div>
  );
}
```

---

### **4. Generar Audio (Text-to-Speech)**

```tsx
function TextToSpeech() {
  const [audioUrl, setAudioUrl] = useState('');

  const generateAudio = async (text: string) => {
    try {
      const response = await fetch('http://localhost:3001/aws/polly/synthesize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text,
          voiceId: 'Lucia' // Voz española femenina
        })
      });

      const data = await response.json();
      setAudioUrl(data.url);
      
      console.log('🔊 Audio generado:', data.url);
      console.log('⏱️ Duración:', data.duration, 'segundos');
      
    } catch (error) {
      console.error('❌ Error generando audio:', error);
    }
  };

  return (
    <div>
      <button onClick={() => generateAudio('Hola, este es tu PEI personalizado...')}>
        🔊 Escuchar PEI
      </button>
      {audioUrl && <audio controls src={audioUrl} />}
    </div>
  );
}
```

---

### **5. Subir Archivo a S3**

```tsx
function UploadToS3() {
  const uploadFile = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('http://localhost:3001/aws/s3/upload', {
        method: 'POST',
        body: formData
      });

      const data = await response.json();
      
      console.log('📦 Archivo subido:', data.url);
      console.log('🔑 Key:', data.key);
      console.log('🪣 Bucket:', data.bucket);
      
      return data.url;
      
    } catch (error) {
      console.error('❌ Error subiendo archivo:', error);
    }
  };

  return (
    <input 
      type="file" 
      onChange={(e) => e.target.files && uploadFile(e.target.files[0])} 
    />
  );
}
```

---

## 📊 **Todos los Endpoints AWS Disponibles**

### **Amazon Bedrock (5 endpoints)**

```typescript
// 1. Generar PEI completo (PRINCIPAL)
POST /aws/bedrock/generate-pei
Body: { diagnosis, symptoms, strengths, studentAge, grade }

// 2. Chat con tutor virtual IA
POST /aws/bedrock/tutor-chat
Body: { studentId, question, context }

// 3. Simplificar contenido educativo
POST /aws/bedrock/simplify-content
Body: { content, targetLevel, subject }

// 4. Invocar Claude directamente
POST /aws/bedrock/invoke
Body: { prompt, maxTokens }

// 5. Listar modelos disponibles
GET /aws/bedrock/models
```

---

### **AWS Textract (4 endpoints)**

```typescript
// 1. Extraer texto de documento
POST /aws/textract/extract-text
Body: { fileBuffer: base64String }

// 2. Analizar documento (formularios + tablas)
POST /aws/textract/analyze-document
Body: { fileBuffer: base64String }

// 3. Analizar informe médico completo
POST /aws/textract/analyze-medical-report
Body: { fileBuffer: base64String }

// 4. Health check
GET /aws/textract/health
```

---

### **AWS Comprehend Medical (3 endpoints)**

```typescript
// 1. Detectar entidades médicas
POST /aws/comprehend/detect-entities
Body: { text: string }

// 2. Detectar datos sensibles (PHI)
POST /aws/comprehend/detect-phi
Body: { text: string }

// 3. Health check
GET /aws/comprehend/health
```

---

### **AWS S3 (5 endpoints)**

```typescript
// 1. Subir archivo
POST /aws/s3/upload
Body: FormData with file

// 2. Obtener URL temporal (expires in 1h)
GET /aws/s3/signed-url/:key
Params: key (file key)

// 3. Borrar archivo
DELETE /aws/s3/delete/:key
Params: key

// 4. Listar archivos en carpeta
GET /aws/s3/list/:folder
Params: folder

// 5. Health check
GET /aws/s3/health
```

---

### **AWS Polly (3 endpoints)**

```typescript
// 1. Generar audio (TTS)
POST /aws/polly/synthesize
Body: { text, voiceId }

// 2. Listar voces españolas
GET /aws/polly/voices

// 3. Health check
GET /aws/polly/health
```

---

## 🎯 **Componente React Completo: Generador PEI**

```tsx
import { useState } from 'react';

interface PEIForm {
  diagnosis: string;
  symptoms: string;
  strengths: string;
  studentAge: number;
  grade: string;
}

export function PEIGenerator() {
  const [form, setForm] = useState<PEIForm>({
    diagnosis: '',
    symptoms: '',
    strengths: '',
    studentAge: 10,
    grade: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [pei, setPei] = useState(null);
  const [audioUrl, setAudioUrl] = useState('');

  // 1. Generar PEI con Bedrock
  const handleGeneratePEI = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:3001/aws/bedrock/generate-pei', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const data = await response.json();
      setPei(data.pei);
      
      // 2. Generar audio del resumen
      await generateAudio(data.pei.summary);
      
    } catch (error) {
      alert('Error generando PEI: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // 3. Generar audio con Polly
  const generateAudio = async (text: string) => {
    try {
      const response = await fetch('http://localhost:3001/aws/polly/synthesize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, voiceId: 'Lucia' })
      });
      const data = await response.json();
      setAudioUrl(data.url);
    } catch (error) {
      console.error('Error generando audio:', error);
    }
  };

  return (
    <div className="pei-generator">
      <h2>🧠 Generador Automático de PEI con AWS Bedrock</h2>
      
      {/* Formulario */}
      <form onSubmit={(e) => { e.preventDefault(); handleGeneratePEI(); }}>
        <input
          placeholder="Diagnóstico (ej: Dislexia evolutiva moderada)"
          value={form.diagnosis}
          onChange={(e) => setForm({...form, diagnosis: e.target.value})}
          required
        />
        
        <textarea
          placeholder="Síntomas observados..."
          value={form.symptoms}
          onChange={(e) => setForm({...form, symptoms: e.target.value})}
          required
        />
        
        <textarea
          placeholder="Fortalezas del estudiante..."
          value={form.strengths}
          onChange={(e) => setForm({...form, strengths: e.target.value})}
          required
        />
        
        <input
          type="number"
          placeholder="Edad"
          value={form.studentAge}
          onChange={(e) => setForm({...form, studentAge: parseInt(e.target.value)})}
          required
        />
        
        <input
          placeholder="Curso (ej: 2º ESO)"
          value={form.grade}
          onChange={(e) => setForm({...form, grade: e.target.value})}
          required
        />
        
        <button type="submit" disabled={loading}>
          {loading ? '⏳ Generando PEI con IA...' : '🚀 Generar PEI Automático'}
        </button>
      </form>

      {/* Resultado */}
      {pei && (
        <div className="pei-result">
          <h3>✅ PEI Generado</h3>
          
          {/* Objetivos */}
          <section>
            <h4>🎯 Objetivos</h4>
            <ul>
              {pei.objectives.map((obj, i) => (
                <li key={i}>
                  <strong>{obj.area}:</strong> {obj.objective}
                  <br />
                  <small>Indicador: {obj.indicator} | Plazo: {obj.deadline}</small>
                </li>
              ))}
            </ul>
          </section>

          {/* Adaptaciones */}
          <section>
            <h4>📚 Adaptaciones Curriculares</h4>
            {Object.entries(pei.adaptations).map(([subject, adaptations]) => (
              <div key={subject}>
                <strong>{subject}:</strong>
                <ul>
                  {adaptations.map((adapt, i) => <li key={i}>{adapt}</li>)}
                </ul>
              </div>
            ))}
          </section>

          {/* Audio */}
          {audioUrl && (
            <section>
              <h4>🔊 Escuchar PEI (Accesibilidad)</h4>
              <audio controls src={audioUrl} />
            </section>
          )}
        </div>
      )}
    </div>
  );
}
```

---

## 🔥 **Tips para el Frontend**

### **1. Manejar Estados de Carga**
```tsx
const [loading, setLoading] = useState(false);
const [error, setError] = useState(null);
const [data, setData] = useState(null);
```

### **2. Mostrar Progreso**
```tsx
if (loading) return <Spinner text="Generando PEI con IA..." />;
if (error) return <Error message={error} />;
if (!data) return <EmptyState />;
```

### **3. Validar Respuestas**
```tsx
const response = await fetch(...);
if (!response.ok) {
  throw new Error(`HTTP ${response.status}: ${response.statusText}`);
}
const data = await response.json();
```

### **4. Cachear Resultados**
```tsx
import { useQuery } from '@tanstack/react-query';

const { data, isLoading } = useQuery({
  queryKey: ['pei', studentId],
  queryFn: () => fetch(...).then(r => r.json())
});
```

---

## 🎯 **Orden Recomendado de Implementación**

### **Fase 1: MVP (Mínimo viable)**
1. ✅ **Generar PEI** (`/aws/bedrock/generate-pei`) ← **PRIORIDAD #1**
2. ✅ **Mostrar PEI** en UI estructurada
3. ✅ **Guardar PEI** en base de datos

### **Fase 2: Automatización**
4. ✅ **Subir informe PDF** (`/aws/s3/upload`)
5. ✅ **Extraer texto** (`/aws/textract/extract-text`)
6. ✅ **Detectar diagnóstico** (`/aws/comprehend/detect-entities`)
7. ✅ **Auto-rellenar formulario** con datos extraídos

### **Fase 3: Accesibilidad**
8. ✅ **Generar audio** (`/aws/polly/synthesize`)
9. ✅ **Reproductor de audio** en UI
10. ✅ **Simplificar contenido** (`/aws/bedrock/simplify-content`)

### **Fase 4: Avanzado**
11. ⏳ **Tutor virtual** (`/aws/bedrock/tutor-chat`)
12. ⏳ **Detección PHI** para GDPR (`/aws/comprehend/detect-phi`)

---

## 📦 **Variables de Entorno Frontend**

```env
REACT_APP_API_URL=http://localhost:3001
REACT_APP_AWS_REGION=eu-west-1

# Optional: Para llamadas directas (no recomendado, usar backend)
# REACT_APP_AWS_ACCESS_KEY_ID=xxx
# REACT_APP_AWS_SECRET_ACCESS_KEY=xxx
```

---

## 🏆 **Resumen Ejecutivo**

### **AWS en NeuroPlan hace 3 cosas**:

1. **🧠 Genera PEIs automáticamente** con Bedrock (Claude)
2. **📄 Extrae datos de informes médicos** con Textract + Comprehend
3. **🔊 Hace accesible el contenido** con Polly (audio) y almacena en S3

### **Endpoint más importante**:
```
POST /aws/bedrock/generate-pei
```
Este genera el PEI completo. El resto son auxiliares.

### **Próximo paso**:
Implementar el componente `PEIGenerator` en React y probarlo con el backend.

---

**¿Preguntas?** Pregunta lo que necesites sobre integración frontend-backend. 🚀
