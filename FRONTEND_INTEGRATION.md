# 🔌 Guía de Integración Frontend - NeuroPlan Backend

## 📋 Checklist Backend Listo para Frontend

### ✅ Ya Implementado

- [x] **CORS configurado** para localhost:5173 (Vite) y localhost:3000 (Create React App)
- [x] **Endpoints REST** completos con validación
- [x] **Swagger UI** en `/api/docs` con ejemplos interactivos
- [x] **Health Check** en `/health` y endpoint raíz `/`
- [x] **Manejo de archivos** con Multer (PDF, JPG, PNG hasta 10MB)
- [x] **Validación automática** con DTOs y class-validator
- [x] **Formato JSON** consistente en todas las respuestas
- [x] **Modo Mock** para demos sin API keys reales

### ⚠️ Pendiente para Producción (Opcional para Hackathon)

- [ ] Autenticación JWT (no necesario para demo)
- [ ] Rate limiting (no necesario para demo)
- [ ] Logger estructurado (Winston/Pino)
- [ ] Caché con Redis (optimización futura)

---

## 🌐 Configuración de Conexión

### Base URL

```javascript
const API_BASE_URL = 'http://localhost:3001';
const API_PREFIX = '/api';
```

### Headers Recomendados

```javascript
const headers = {
  'Content-Type': 'application/json',
  // Si implementas auth más adelante:
  // 'Authorization': `Bearer ${token}`
};
```

---

## 📡 Endpoints Principales para el Frontend

### 1. Health Check & Status

#### GET `/` - Verificar servidor

```bash
curl http://localhost:3001
```

**Response:**
```json
{
  "message": "🚀 NeuroPlan Backend API",
  "version": "1.0.0",
  "status": "online",
  "docs": "/api/docs",
  "hackathonMode": true,
  "timestamp": "2025-10-11T15:53:20.000Z"
}
```

#### GET `/health` - Estado del sistema

```bash
curl http://localhost:3001/health
```

**Response:**
```json
{
  "status": "healthy",
  "uptime": 123.45,
  "environment": "development",
  "database": "connected",
  "integrations": {
    "elevenlabs": "mock",
    "linkup": "mock",
    "n8n": "mock"
  },
  "timestamp": "2025-10-11T15:53:20.000Z"
}
```

---

### 2. Gestión de Estudiantes

#### POST `/api/uploads/students` - Crear estudiante

```javascript
// JavaScript/React Example
const createStudent = async (studentData) => {
  const response = await fetch('http://localhost:3001/api/uploads/students', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: 'María González',
      dateOfBirth: '2015-03-15',
      gradeLevel: '3° Primaria',
      diagnosis: 'TDAH + Dislexia',
      notes: 'Requiere adaptaciones curriculares significativas'
    })
  });
  
  return await response.json();
};
```

**Response:**
```json
{
  "id": 1,
  "name": "María González",
  "dateOfBirth": "2015-03-15T00:00:00.000Z",
  "gradeLevel": "3° Primaria",
  "diagnosis": "TDAH + Dislexia",
  "notes": "Requiere adaptaciones curriculares significativas",
  "createdAt": "2025-10-11T15:53:20.000Z",
  "updatedAt": "2025-10-11T15:53:20.000Z"
}
```

#### GET `/api/uploads/students` - Listar estudiantes

```javascript
const getStudents = async () => {
  const response = await fetch('http://localhost:3001/api/uploads/students');
  return await response.json();
};
```

**Response:**
```json
[
  {
    "id": 1,
    "name": "María González",
    "dateOfBirth": "2015-03-15T00:00:00.000Z",
    "gradeLevel": "3° Primaria",
    "diagnosis": "TDAH + Dislexia",
    "_count": {
      "reports": 2,
      "peis": 1
    }
  }
]
```

#### GET `/api/uploads/students/:id` - Detalle de estudiante

```javascript
const getStudent = async (studentId) => {
  const response = await fetch(`http://localhost:3001/api/uploads/students/${studentId}`);
  return await response.json();
};
```

---

### 3. Upload de Reportes

#### POST `/api/uploads/reports/:studentId` - Subir reporte

```javascript
const uploadReport = async (studentId, file) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('type', 'MEDICAL'); // o 'PSYCHOLOGICAL'
  
  const response = await fetch(`http://localhost:3001/api/uploads/reports/${studentId}`, {
    method: 'POST',
    body: formData,
    // NO incluyas Content-Type header, fetch lo manejará automáticamente
  });
  
  return await response.json();
};
```

**Response:**
```json
{
  "id": 1,
  "studentId": 1,
  "filename": "informe_psicopedagogico.pdf",
  "type": "MEDICAL",
  "filesize": 245678,
  "mimetype": "application/pdf",
  "uploadDate": "2025-10-11T15:53:20.000Z"
}
```

**Validaciones:**
- Tamaño máximo: 10MB
- Formatos permitidos: PDF, JPG, PNG
- Field name: `file`

#### GET `/api/uploads/reports/:id/download` - Descargar reporte

```javascript
const downloadReport = (reportId) => {
  window.open(`http://localhost:3001/api/uploads/reports/${reportId}/download`, '_blank');
};
```

---

### 4. Generación de PEIs

#### POST `/api/peis/generate` - Generar PEI desde reporte

```javascript
const generatePEI = async (reportId) => {
  const response = await fetch('http://localhost:3001/api/peis/generate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ reportId })
  });
  
  return await response.json();
};
```

**Response:**
```json
{
  "id": 1,
  "studentId": 1,
  "content": "{\"objetivos\":[...],\"adaptaciones\":[...],\"evaluacion\":{...}}",
  "status": "draft",
  "generatedAt": "2025-10-11T15:53:20.000Z",
  "approvedAt": null,
  "approvedBy": null,
  "student": {
    "id": 1,
    "name": "María González"
  },
  "audioFiles": [],
  "resources": []
}
```

**Estados posibles del PEI:**
- `draft` - Recién generado, pendiente de revisión
- `pending_review` - En revisión por profesionales
- `approved` - Aprobado y listo para implementar
- `in_implementation` - En proceso de aplicación
- `completed` - Completado
- `archived` - Archivado

#### GET `/api/peis` - Listar todos los PEIs

```javascript
const getPEIs = async (status = null) => {
  const url = status 
    ? `http://localhost:3001/api/peis?status=${status}`
    : 'http://localhost:3001/api/peis';
  
  const response = await fetch(url);
  return await response.json();
};
```

#### GET `/api/peis/:id` - Obtener PEI completo

```javascript
const getPEI = async (peiId) => {
  const response = await fetch(`http://localhost:3001/api/peis/${peiId}`);
  return await response.json();
};
```

#### PATCH `/api/peis/:id/status` - Actualizar estado

```javascript
const updatePEIStatus = async (peiId, newStatus) => {
  const response = await fetch(`http://localhost:3001/api/peis/${peiId}/status`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ 
      status: newStatus,
      approvedBy: 'Dra. Ana Martínez' // Opcional
    })
  });
  
  return await response.json();
};
```

#### GET `/api/peis/:id/pdf` - Descargar PEI como PDF

```javascript
const downloadPEIPDF = (peiId) => {
  window.open(`http://localhost:3001/api/peis/${peiId}/pdf`, '_blank');
};
```

---

### 5. ElevenLabs - Text-to-Speech

#### POST `/api/elevenlabs/pei/:id/audio` - Generar audio del PEI

```javascript
const generatePEIAudio = async (peiId) => {
  const response = await fetch(`http://localhost:3001/api/elevenlabs/pei/${peiId}/audio`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      voiceId: 'rachel', // Opcional
      stability: 0.75, // Opcional
      similarityBoost: 0.75 // Opcional
    })
  });
  
  return await response.json();
};
```

**Response:**
```json
{
  "id": 1,
  "peiId": 1,
  "filename": "pei_1_full_1634567890.mp3",
  "type": "full_pei",
  "voiceId": "rachel",
  "duration": 480,
  "createdAt": "2025-10-11T15:53:20.000Z"
}
```

#### GET `/api/elevenlabs/pei/:id/summary-audio` - Audio resumen (3-5 min)

```javascript
const getPEISummaryAudio = async (peiId) => {
  const response = await fetch(`http://localhost:3001/api/elevenlabs/pei/${peiId}/summary-audio`);
  return await response.json();
};
```

#### GET `/api/elevenlabs/voices` - Listar voces disponibles

```javascript
const getVoices = async () => {
  const response = await fetch('http://localhost:3001/api/elevenlabs/voices');
  return await response.json();
};
```

**Response:**
```json
{
  "voices": [
    {
      "voice_id": "rachel",
      "name": "Rachel",
      "category": "premade",
      "labels": { "accent": "american", "age": "young", "gender": "female" }
    },
    {
      "voice_id": "adam",
      "name": "Adam",
      "category": "premade",
      "labels": { "accent": "american", "age": "middle_aged", "gender": "male" }
    }
  ]
}
```

---

### 6. Linkup - Recursos Educativos

#### POST `/api/linkup/search` - Buscar recursos

```javascript
const searchResources = async (query, filters = {}) => {
  const response = await fetch('http://localhost:3001/api/linkup/search', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query,
      filters: {
        subject: 'matemáticas', // Opcional
        gradeLevel: '3° Primaria', // Opcional
        difficulty: 'básico', // Opcional
      },
      limit: 10
    })
  });
  
  return await response.json();
};
```

**Response:**
```json
{
  "query": "ejercicios de matemáticas adaptados",
  "resources": [
    {
      "title": "Ejercicios adaptados de suma y resta",
      "url": "https://example.com/resource1",
      "description": "Material específico para TDAH",
      "category": "matemáticas",
      "difficulty": "básico",
      "rating": 4.5
    }
  ],
  "total": 8
}
```

#### GET `/api/linkup/pei/:id/resources` - Recursos para un PEI

```javascript
const getPEIResources = async (peiId) => {
  const response = await fetch(`http://localhost:3001/api/linkup/pei/${peiId}/resources`);
  return await response.json();
};
```

---

### 7. n8n - Automatización

#### POST `/api/n8n/pei/:id/generated` - Notificar PEI generado

```javascript
const notifyPEIGenerated = async (peiId) => {
  const response = await fetch(`http://localhost:3001/api/n8n/pei/${peiId}/generated`, {
    method: 'POST',
  });
  
  return await response.json();
};
```

#### POST `/api/n8n/pei/:id/approved` - Notificar PEI aprobado

```javascript
const notifyPEIApproved = async (peiId) => {
  const response = await fetch(`http://localhost:3001/api/n8n/pei/${peiId}/approved`, {
    method: 'POST',
  });
  
  return await response.json();
};
```

#### GET `/api/n8n/stats` - Estadísticas de workflows

```javascript
const getWorkflowStats = async () => {
  const response = await fetch('http://localhost:3001/api/n8n/stats');
  return await response.json();
};
```

---

## 🎨 Ejemplo Completo de Flujo Frontend

### Flujo: Crear Estudiante → Subir Reporte → Generar PEI → Generar Audio

```javascript
// components/PEIGenerator.jsx
import React, { useState } from 'react';

const PEIGenerator = () => {
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [studentId, setStudentId] = useState(null);
  const [reportId, setReportId] = useState(null);
  const [peiId, setPeiId] = useState(null);

  // Paso 1: Crear estudiante
  const createStudent = async (formData) => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:3001/api/uploads/students', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      const student = await response.json();
      setStudentId(student.id);
      setCurrentStep(2);
      return student;
    } catch (error) {
      console.error('Error creando estudiante:', error);
    } finally {
      setLoading(false);
    }
  };

  // Paso 2: Subir reporte
  const uploadReport = async (file) => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', 'MEDICAL');
      
      const response = await fetch(`http://localhost:3001/api/uploads/reports/${studentId}`, {
        method: 'POST',
        body: formData
      });
      
      const report = await response.json();
      setReportId(report.id);
      setCurrentStep(3);
      return report;
    } catch (error) {
      console.error('Error subiendo reporte:', error);
    } finally {
      setLoading(false);
    }
  };

  // Paso 3: Generar PEI
  const generatePEI = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:3001/api/peis/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reportId })
      });
      
      const pei = await response.json();
      setPeiId(pei.id);
      setCurrentStep(4);
      
      // Notificar a n8n
      await fetch(`http://localhost:3001/api/n8n/pei/${pei.id}/generated`, {
        method: 'POST'
      });
      
      return pei;
    } catch (error) {
      console.error('Error generando PEI:', error);
    } finally {
      setLoading(false);
    }
  };

  // Paso 4: Generar audio
  const generateAudio = async () => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:3001/api/elevenlabs/pei/${peiId}/audio`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ voiceId: 'rachel' })
      });
      
      const audio = await response.json();
      setCurrentStep(5);
      return audio;
    } catch (error) {
      console.error('Error generando audio:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pei-generator">
      {currentStep === 1 && <StudentForm onSubmit={createStudent} loading={loading} />}
      {currentStep === 2 && <ReportUpload onSubmit={uploadReport} loading={loading} />}
      {currentStep === 3 && <GeneratePEIButton onClick={generatePEI} loading={loading} />}
      {currentStep === 4 && <GenerateAudioButton onClick={generateAudio} loading={loading} />}
      {currentStep === 5 && <PEICompleted peiId={peiId} />}
    </div>
  );
};

export default PEIGenerator;
```

---

## 🛠️ Utilidades Recomendadas para el Frontend

### API Client (axios o fetch wrapper)

```javascript
// services/api.js
const API_BASE_URL = 'http://localhost:3001';

class APIClient {
  constructor(baseURL = API_BASE_URL) {
    this.baseURL = baseURL;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Error en la petición');
      }
      
      return await response.json();
    } catch (error) {
      console.error(`Error en ${endpoint}:`, error);
      throw error;
    }
  }

  get(endpoint) {
    return this.request(endpoint, { method: 'GET' });
  }

  post(endpoint, data) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  patch(endpoint, data) {
    return this.request(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  delete(endpoint) {
    return this.request(endpoint, { method: 'DELETE' });
  }

  // Para archivos
  async uploadFile(endpoint, file, additionalData = {}) {
    const formData = new FormData();
    formData.append('file', file);
    
    Object.entries(additionalData).forEach(([key, value]) => {
      formData.append(key, value);
    });

    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Error subiendo archivo');
    }

    return await response.json();
  }
}

export default new APIClient();
```

### Uso del API Client

```javascript
// Ejemplo de uso
import api from './services/api';

// Crear estudiante
const student = await api.post('/api/uploads/students', {
  name: 'María González',
  dateOfBirth: '2015-03-15',
  gradeLevel: '3° Primaria'
});

// Subir archivo
const report = await api.uploadFile(
  `/api/uploads/reports/${student.id}`,
  fileObject,
  { type: 'MEDICAL' }
);

// Generar PEI
const pei = await api.post('/api/peis/generate', { reportId: report.id });
```

---

## 🔒 Manejo de Errores

### Formato de Errores del Backend

```json
{
  "statusCode": 400,
  "message": "Validation failed",
  "error": "Bad Request"
}
```

### Error Handling en Frontend

```javascript
const handleAPIError = (error) => {
  if (error.response) {
    // Error del servidor (4xx, 5xx)
    switch (error.response.status) {
      case 400:
        return 'Datos inválidos. Por favor, revisa el formulario.';
      case 404:
        return 'Recurso no encontrado.';
      case 413:
        return 'El archivo es demasiado grande (máx. 10MB).';
      case 500:
        return 'Error del servidor. Por favor, inténtalo más tarde.';
      default:
        return 'Ha ocurrido un error inesperado.';
    }
  } else if (error.request) {
    // No hay respuesta del servidor
    return 'No se puede conectar con el servidor. Verifica tu conexión.';
  } else {
    // Error en la configuración
    return error.message;
  }
};
```

---

## 📊 TypeScript Types (Opcional pero Recomendado)

```typescript
// types/api.ts
export interface Student {
  id: number;
  name: string;
  dateOfBirth: string;
  gradeLevel: string;
  diagnosis?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Report {
  id: number;
  studentId: number;
  filename: string;
  type: 'MEDICAL' | 'PSYCHOLOGICAL' | 'EDUCATIONAL';
  filesize: number;
  mimetype: string;
  uploadDate: string;
}

export interface PEI {
  id: number;
  studentId: number;
  content: string; // JSON serializado
  status: 'draft' | 'pending_review' | 'approved' | 'in_implementation' | 'completed' | 'archived';
  generatedAt: string;
  approvedAt?: string;
  approvedBy?: string;
  student?: Student;
  audioFiles?: AudioFile[];
  resources?: ResourceLink[];
}

export interface AudioFile {
  id: number;
  peiId: number;
  filename: string;
  type: 'full_pei' | 'summary' | 'section';
  voiceId: string;
  duration?: number;
  createdAt: string;
}

export interface ResourceLink {
  id: number;
  peiId: number;
  title: string;
  url: string;
  description?: string;
  category: string;
  difficulty?: string;
  addedAt: string;
}
```

---

## ✅ Checklist Final para Conectar Frontend

1. **Verificar Backend Activo**
   ```bash
   curl http://localhost:3001/health
   ```

2. **Configurar Variables de Entorno en Frontend**
   ```env
   VITE_API_URL=http://localhost:3001
   # o para CRA
   REACT_APP_API_URL=http://localhost:3001
   ```

3. **Probar Conexión Básica**
   ```javascript
   fetch('http://localhost:3001/health')
     .then(res => res.json())
     .then(data => console.log('Backend conectado:', data))
     .catch(err => console.error('Error de conexión:', err));
   ```

4. **Implementar Flujo Completo**
   - ✅ Formulario de creación de estudiante
   - ✅ Upload de archivos con drag & drop
   - ✅ Botón de generar PEI con loading state
   - ✅ Visualización del PEI generado
   - ✅ Botón de generar audio
   - ✅ Reproductor de audio
   - ✅ Lista de recursos recomendados

---

## 🎯 Resumen: Lo que tienes vs Lo que necesitas

### ✅ Ya tienes (Backend completo):
- CORS configurado para frontend
- 30+ endpoints REST funcionando
- Validación automática de datos
- Manejo de archivos (PDF, imágenes)
- 4 integraciones de sponsors
- Swagger docs interactivas
- Health checks
- Modo mock para demo

### 🎨 Lo que necesitas crear (Frontend):
1. **Formularios React** para crear estudiantes
2. **Componente de upload** con drag & drop
3. **Botón de generación** con loading states
4. **Visualizador de PEI** (puede ser simple JSON pretty-print)
5. **Reproductor de audio** (elemento `<audio>` de HTML5)
6. **Lista de recursos** con links clickeables
7. **Dashboard** con estadísticas básicas

### 🚀 Opcional para impresionar:
- Animaciones de carga
- Preview de PDFs con react-pdf
- Timeline del progreso del estudiante
- Gráficos de estadísticas con recharts
- Notificaciones toast con react-toastify

---

**¡Tu backend está 100% listo para conectar con cualquier framework frontend! 🎉**
