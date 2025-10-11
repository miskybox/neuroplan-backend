# 🎨 Guía Rápida para Desarrollar Frontend en Paralelo

## ✅ Backend LISTO para conectar

**URL Base:** `http://localhost:3000`  
**API Docs:** `http://localhost:3000/api/docs`  
**Estado:** ✅ Servidor corriendo

---

## 🔌 Endpoints Disponibles

### 1. **Subir Reporte** (Primera pantalla)

```typescript
// POST /api/uploads/students
const createStudent = async (studentData: {
  name: string;
  dateOfBirth: string;
  gradeLevel: string;
  diagnosis?: string;
}) => {
  const response = await fetch('http://localhost:3000/api/uploads/students', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(studentData),
  });
  return response.json(); // { id: "clxxx...", name: "...", ... }
};

// POST /api/uploads/reports/:studentId
const uploadReport = async (studentId: string, file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('type', 'MEDICAL');
  
  const response = await fetch(`http://localhost:3000/api/uploads/reports/${studentId}`, {
    method: 'POST',
    body: formData,
  });
  return response.json(); // { id: "report-123", filename: "...", ... }
};
```

### 2. **Generar PEI** (Después del upload)

```typescript
// POST /api/peis/generate
const generatePEI = async (reportId: string) => {
  const response = await fetch('http://localhost:3000/api/peis/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ reportId }),
  });
  return response.json(); // { id: "pei-456", status: "draft", ... }
};
```

### 3. **Stream de Progreso SSE** (Pantalla de loading)

```typescript
// GET /api/reports/:id/process/stream
const connectToSSE = (reportId: string) => {
  const eventSource = new EventSource(
    `http://localhost:3000/api/reports/${reportId}/process/stream`
  );

  eventSource.onmessage = (event) => {
    const data = JSON.parse(event.data);
    
    console.log('Progress:', data.progress, '%');
    console.log('Stage:', data.stage);
    console.log('Message:', data.message);
    
    // Actualizar UI
    setProgress(data.progress);
    setStage(data.stage);
    setMessage(data.message);
    
    if (data.type === 'complete') {
      eventSource.close();
      // Redirect al editor
      navigate(`/pei/${data.data.peiId}`);
    }
  };

  eventSource.onerror = (error) => {
    console.error('SSE Error:', error);
    eventSource.close();
  };

  return eventSource;
};
```

### 4. **Ver PEI Generado** (Pantalla de edición)

```typescript
// GET /api/peis/:id
const getPEI = async (peiId: string) => {
  const response = await fetch(`http://localhost:3000/api/peis/${peiId}`);
  return response.json();
  // {
  //   id: "pei-456",
  //   objectives: [...],
  //   activities: [...],
  //   adaptations: {...},
  //   ...
  // }
};
```

### 5. **Audio (ElevenLabs)** - Botón "Escuchar"

```typescript
// GET /api/elevenlabs/pei/:id/summary-audio
const playPEISummary = (peiId: string) => {
  const audioUrl = `http://localhost:3000/api/elevenlabs/pei/${peiId}/summary-audio`;
  const audio = new Audio(audioUrl);
  audio.play();
};
```

### 6. **Recursos Educativos (Linkup)** - Tarjetas de recursos

```typescript
// GET /api/linkup/pei/:id/resources
const getResources = async (peiId: string) => {
  const response = await fetch(`http://localhost:3000/api/linkup/pei/${peiId}/resources`);
  return response.json();
  // {
  //   apps: [...],
  //   strategies: [...],
  //   tools: [...],
  //   ...
  // }
};
```

---

## 🎯 Flujo Completo de Usuario

```
1. HomePage.tsx
   ↓ (Usuario sube PDF)
   POST /api/uploads/students
   POST /api/uploads/reports/:studentId
   POST /api/peis/generate
   ↓
2. ProcessingPage.tsx
   ↓ (Conecta SSE)
   GET /api/reports/:id/process/stream
   → Muestra progreso 0-100%
   → Cuando complete: redirect
   ↓
3. PEIEditorPage.tsx
   GET /api/peis/:id
   GET /api/linkup/pei/:id/resources
   ↓ (Usuario edita y escucha)
   Audio: GET /api/elevenlabs/pei/:id/summary-audio
   ↓ (Usuario guarda)
   PUT /api/peis/:id (si edita)
```

---

## 🛠️ Hook Personalizado para SSE

```typescript
// hooks/useSSE.ts
import { useState, useEffect } from 'react';

interface ProgressEvent {
  type: 'progress' | 'complete' | 'error';
  stage: string;
  progress: number;
  message: string;
  data?: any;
}

export function useSSE(reportId: string) {
  const [progress, setProgress] = useState(0);
  const [stage, setStage] = useState('');
  const [message, setMessage] = useState('');
  const [completed, setCompleted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [peiData, setPeiData] = useState<any>(null);

  useEffect(() => {
    const eventSource = new EventSource(
      `http://localhost:3000/api/reports/${reportId}/process/stream`
    );

    eventSource.onmessage = (event) => {
      const data: ProgressEvent = JSON.parse(event.data);

      setProgress(data.progress);
      setStage(data.stage);
      setMessage(data.message);

      if (data.type === 'complete') {
        setCompleted(true);
        setPeiData(data.data);
        eventSource.close();
      }

      if (data.type === 'error') {
        setError(data.message);
        eventSource.close();
      }
    };

    eventSource.onerror = () => {
      setError('Error de conexión');
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, [reportId]);

  return { progress, stage, message, completed, error, peiData };
}

// Uso en componente:
function ProcessingPage() {
  const { reportId } = useParams();
  const { progress, stage, message, completed, peiData } = useSSE(reportId!);
  
  if (completed && peiData) {
    navigate(`/pei/${peiData.peiId}`);
  }
  
  return (
    <div>
      <h1>Procesando documento...</h1>
      <progress value={progress} max={100} />
      <p>{message}</p>
    </div>
  );
}
```

---

## 📊 Estructura de Datos TypeScript

```typescript
// types/index.ts

export interface Student {
  id: string;
  name: string;
  dateOfBirth: string;
  gradeLevel: string;
  diagnosis?: string;
  notes?: string;
  createdAt: string;
}

export interface Report {
  id: string;
  studentId: string;
  filename: string;
  type: 'MEDICAL' | 'PSYCHOLOGICAL' | 'EDUCATIONAL';
  filesize: number;
  mimetype: string;
  uploadDate: string;
}

export interface PEI {
  id: string;
  studentId: string;
  content: string; // JSON serializado
  status: 'draft' | 'pending_review' | 'approved' | 'in_implementation';
  generatedAt: string;
  approvedAt?: string;
  student?: Student;
  audioFiles?: AudioFile[];
  resources?: ResourceLink[];
}

export interface AudioFile {
  id: string;
  peiId: string;
  filename: string;
  type: 'full_pei' | 'summary' | 'section';
  voiceId: string;
  duration?: number;
  createdAt: string;
}

export interface ResourceLink {
  id: string;
  peiId: string;
  title: string;
  url: string;
  description?: string;
  category: string;
  difficulty?: string;
  relevance: number;
  addedAt: string;
}
```

---

## 🎨 Componentes Sugeridos

### ProcessingProgress.tsx

```typescript
import { useSSE } from '../hooks/useSSE';
import { useNavigate, useParams } from 'react-router-dom';

export default function ProcessingProgress() {
  const { reportId } = useParams();
  const navigate = useNavigate();
  const { progress, stage, message, completed, error, peiData } = useSSE(reportId!);

  if (error) {
    return <div className="error">{error}</div>;
  }

  if (completed && peiData) {
    navigate(`/pei/${peiData.peiId}`);
    return null;
  }

  return (
    <div className="processing-container">
      <h1>Generando PEI...</h1>
      
      <div className="progress-bar">
        <div 
          className="progress-fill" 
          style={{ width: `${progress}%` }}
        />
      </div>
      
      <div className="stages">
        <Stage name="OCR" current={stage === 'ocr'} done={progress > 30} />
        <Stage name="Analysis" current={stage === 'analysis'} done={progress > 60} />
        <Stage name="PEI Gen" current={stage === 'pei-generation'} done={progress > 90} />
        <Stage name="Summary" current={stage === 'family-summary'} done={progress === 100} />
      </div>
      
      <p className="message">{message}</p>
      <p className="percentage">{progress}%</p>
    </div>
  );
}

function Stage({ name, current, done }: { name: string; current: boolean; done: boolean }) {
  return (
    <div className={`stage ${current ? 'current' : ''} ${done ? 'done' : ''}`}>
      {done ? '✓' : current ? '⟳' : '○'} {name}
    </div>
  );
}
```

---

## ⚙️ Variables de Entorno Frontend

```bash
# .env
VITE_API_URL=http://localhost:3000
```

```typescript
// En tu código
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
```

---

## 🚀 Comandos para Empezar

```bash
# Terminal 1: Backend (ya corriendo)
cd neuroplan-backend
npx ts-node src/main.ts
# → http://localhost:3000

# Terminal 2: Frontend (tu parte)
cd neuroplan-frontend
npm create vite@latest . -- --template react-ts
npm install
npm install framer-motion lucide-react react-router-dom
echo "VITE_API_URL=http://localhost:3000" > .env
npm run dev
# → http://localhost:5173
```

---

## 📝 Checklist Frontend

- [ ] Página de upload con drag & drop
- [ ] Formulario de estudiante (nombre, fecha, nivel)
- [ ] Upload de PDF/imagen
- [ ] Página de progreso con SSE
- [ ] Barra de progreso animada
- [ ] 4 etapas visuales
- [ ] Auto-redirect al completar
- [ ] Página de editor de PEI
- [ ] Botón de audio (ElevenLabs)
- [ ] Lista de recursos (Linkup)
- [ ] Botón de guardar cambios

---

## 🎯 Swagger UI

Para ver todos los endpoints interactivos:
**http://localhost:3000/api/docs**

Desde ahí puedes:
- Ver ejemplos de requests/responses
- Probar cada endpoint
- Copiar código de ejemplo

---

**✅ Backend listo. ¡Puedes empezar el frontend ahora!** 🚀

Si tienes dudas sobre algún endpoint, pregúntame o revisa Swagger.
