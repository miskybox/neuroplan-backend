# ✅ Backend NeuroPlan - Estado Final y Conexión Frontend

## 🎯 Resumen Ejecutivo

**Tu backend está 100% operativo y listo para conectar con el frontend.**

### Estado Actual del Servidor
- ✅ **Corriendo en:** http://localhost:3001
- ✅ **Documentación:** http://localhost:3001/api/docs
- ✅ **Health Check:** http://localhost:3001/health
- ✅ **Base de Datos:** SQLite conectada
- ✅ **Modo:** Development con Mock APIs (perfecto para hackathon)

---

## 🔌 ¿Qué necesitas para conectar el Frontend?

### 1. **CORS - Ya Configurado ✅**

El backend ya acepta peticiones desde:
- `http://localhost:5173` (Vite - React)
- `http://localhost:3000` (Create React App)
- `http://127.0.0.1:5173`
- `http://127.0.0.1:3000`

**No necesitas hacer nada más en el backend.**

### 2. **Endpoints REST - Todos Funcionando ✅**

Tienes **30+ endpoints** completamente documentados:

#### Endpoints Clave para el Frontend:

**Health & Status:**
```
GET  /                    → Info del servidor
GET  /health              → Health check con estado de integraciones
GET  /api                 → Información de la API
```

**Estudiantes:**
```
POST /api/uploads/students          → Crear estudiante
GET  /api/uploads/students          → Listar estudiantes
GET  /api/uploads/students/:id      → Detalle de estudiante
```

**Reportes:**
```
POST /api/uploads/reports/:studentId    → Subir PDF/imagen
GET  /api/uploads/reports/:id/download  → Descargar reporte
```

**PEIs:**
```
POST  /api/peis/generate        → Generar PEI con IA
GET   /api/peis                 → Listar todos
GET   /api/peis/:id             → Ver PEI completo
PATCH /api/peis/:id/status      → Cambiar estado
GET   /api/peis/:id/pdf         → Descargar como PDF
```

**Audio (ElevenLabs):**
```
POST /api/elevenlabs/pei/:id/audio         → Generar audio completo
GET  /api/elevenlabs/pei/:id/summary-audio → Audio resumen (3-5 min)
GET  /api/elevenlabs/voices                → Listar voces
```

**Recursos (Linkup):**
```
POST /api/linkup/search              → Buscar recursos
GET  /api/linkup/pei/:id/resources   → Recursos para un PEI
```

**Automatización (n8n):**
```
POST /api/n8n/pei/:id/generated  → Notificar PEI generado
POST /api/n8n/pei/:id/approved   → Notificar PEI aprobado
GET  /api/n8n/stats              → Estadísticas de workflows
```

### 3. **Documentación Interactiva - Swagger UI ✅**

Abre: http://localhost:3001/api/docs

Desde ahí puedes:
- ✅ Ver todos los endpoints
- ✅ Probar cada endpoint directamente
- ✅ Ver ejemplos de requests/responses
- ✅ Copiar código de ejemplo

### 4. **Validación Automática - Ya Implementada ✅**

El backend valida automáticamente:
- ✅ Tipos de datos correctos
- ✅ Campos requeridos vs opcionales
- ✅ Formatos de archivo (PDF, JPG, PNG)
- ✅ Tamaño de archivos (máx. 10MB)
- ✅ Formato de fechas

**El frontend recibirá errores claros si algo falla.**

---

## 🚀 Cómo Conectar desde el Frontend

### Opción A: Fetch Nativo (Más Simple)

```javascript
// En cualquier componente React
const createStudent = async (studentData) => {
  try {
    const response = await fetch('http://localhost:3001/api/uploads/students', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(studentData)
    });
    
    if (!response.ok) {
      throw new Error('Error creando estudiante');
    }
    
    const student = await response.json();
    console.log('Estudiante creado:', student);
    return student;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};

// Uso:
createStudent({
  name: 'María González',
  dateOfBirth: '2015-03-15',
  gradeLevel: '3° Primaria',
  diagnosis: 'TDAH + Dislexia'
});
```

### Opción B: Axios (Más Robusto)

```bash
# Instalar axios en tu frontend
npm install axios
```

```javascript
// services/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3001',
  timeout: 30000, // 30 segundos para generación de PEIs
  headers: {
    'Content-Type': 'application/json',
  }
});

// Interceptor para manejo de errores
api.interceptors.response.use(
  response => response.data,
  error => {
    if (error.response) {
      console.error('Error del servidor:', error.response.data);
    } else if (error.request) {
      console.error('Sin respuesta del servidor');
    }
    return Promise.reject(error);
  }
);

export default api;

// Uso:
import api from './services/api';

const student = await api.post('/api/uploads/students', {
  name: 'María González',
  dateOfBirth: '2015-03-15',
  gradeLevel: '3° Primaria'
});
```

---

## 📋 Flujo Completo Frontend → Backend

### Escenario: Usuario crea un PEI completo

```javascript
// 1. Crear estudiante
const student = await fetch('http://localhost:3001/api/uploads/students', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'María González',
    dateOfBirth: '2015-03-15',
    gradeLevel: '3° Primaria',
    diagnosis: 'TDAH + Dislexia'
  })
}).then(r => r.json());

console.log('✅ Estudiante creado:', student.id);

// 2. Subir reporte médico (PDF)
const formData = new FormData();
formData.append('file', pdfFile); // pdfFile = archivo del input
formData.append('type', 'MEDICAL');

const report = await fetch(`http://localhost:3001/api/uploads/reports/${student.id}`, {
  method: 'POST',
  body: formData // NO pongas Content-Type header aquí
}).then(r => r.json());

console.log('✅ Reporte subido:', report.id);

// 3. Generar PEI con IA (30-60 segundos)
const pei = await fetch('http://localhost:3001/api/peis/generate', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ reportId: report.id })
}).then(r => r.json());

console.log('✅ PEI generado:', pei.id);

// 4. Generar audio del PEI (ElevenLabs)
const audio = await fetch(`http://localhost:3001/api/elevenlabs/pei/${pei.id}/audio`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ voiceId: 'rachel' })
}).then(r => r.json());

console.log('✅ Audio generado:', audio.filename);

// 5. Buscar recursos educativos (Linkup)
const resources = await fetch(`http://localhost:3001/api/linkup/pei/${pei.id}/resources`)
  .then(r => r.json());

console.log('✅ Recursos encontrados:', resources.length);

// 6. Notificar a n8n
await fetch(`http://localhost:3001/api/n8n/pei/${pei.id}/generated`, {
  method: 'POST'
});

console.log('✅ Notificación enviada');

// 7. ¡Todo listo! Mostrar PEI al usuario
window.location.href = `/pei/${pei.id}`;
```

---

## 🎨 Componentes Frontend Recomendados

### 1. StudentForm.jsx - Crear Estudiante

```jsx
import { useState } from 'react';

export default function StudentForm({ onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    dateOfBirth: '',
    gradeLevel: '',
    diagnosis: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await fetch('http://localhost:3001/api/uploads/students', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      const student = await response.json();
      onSuccess(student);
    } catch (error) {
      alert('Error creando estudiante: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Nombre completo"
        value={formData.name}
        onChange={(e) => setFormData({...formData, name: e.target.value})}
        required
      />
      <input
        type="date"
        value={formData.dateOfBirth}
        onChange={(e) => setFormData({...formData, dateOfBirth: e.target.value})}
        required
      />
      <input
        type="text"
        placeholder="Nivel escolar (ej: 3° Primaria)"
        value={formData.gradeLevel}
        onChange={(e) => setFormData({...formData, gradeLevel: e.target.value})}
        required
      />
      <textarea
        placeholder="Diagnóstico (opcional)"
        value={formData.diagnosis}
        onChange={(e) => setFormData({...formData, diagnosis: e.target.value})}
      />
      <button type="submit" disabled={loading}>
        {loading ? 'Creando...' : 'Crear Estudiante'}
      </button>
    </form>
  );
}
```

### 2. FileUpload.jsx - Subir Reporte

```jsx
import { useState } from 'react';

export default function FileUpload({ studentId, onSuccess }) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    if (!file) return;
    
    setLoading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', 'MEDICAL');
    
    try {
      const response = await fetch(
        `http://localhost:3001/api/uploads/reports/${studentId}`,
        { method: 'POST', body: formData }
      );
      
      const report = await response.json();
      onSuccess(report);
    } catch (error) {
      alert('Error subiendo archivo: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <input
        type="file"
        accept=".pdf,.jpg,.png"
        onChange={(e) => setFile(e.target.files[0])}
      />
      {file && <p>Archivo: {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)</p>}
      <button onClick={handleUpload} disabled={!file || loading}>
        {loading ? 'Subiendo...' : 'Subir Reporte'}
      </button>
    </div>
  );
}
```

### 3. PEIGenerator.jsx - Generar PEI

```jsx
import { useState } from 'react';

export default function PEIGenerator({ reportId, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState('');

  const generatePEI = async () => {
    setLoading(true);
    setProgress('Analizando reporte...');
    
    try {
      const response = await fetch('http://localhost:3001/api/peis/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reportId })
      });
      
      setProgress('Generando objetivos...');
      const pei = await response.json();
      
      setProgress('Completado ✅');
      onSuccess(pei);
    } catch (error) {
      alert('Error generando PEI: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button onClick={generatePEI} disabled={loading}>
        {loading ? '⏳ Generando PEI...' : '🚀 Generar PEI con IA'}
      </button>
      {loading && <p>{progress}</p>}
    </div>
  );
}
```

---

## 🛠️ Herramientas para Desarrollo

### 1. Probar Endpoints sin Frontend

Usa **Postman**, **Insomnia** o directamente **Swagger UI**:
- http://localhost:3001/api/docs (Swagger - Recomendado)

### 2. Ver Base de Datos

```bash
# Instalar Prisma Studio
npx prisma studio
```

Abre una interfaz visual en http://localhost:5555 para ver todos los datos.

### 3. Logs del Backend

Los logs ya están en la terminal donde ejecutaste `npx ts-node src/main.ts`.

Verás:
```
[Nest] 6624  - 11/10/2025, 15:53:20 LOG [RouterExplorer] Mapped {/api/peis/generate, POST}
```

---

## ❌ Manejo de Errores

### Errores Comunes y Soluciones

#### 1. ERR_CONNECTION_REFUSED
**Causa:** Backend no está corriendo  
**Solución:** Ejecuta `npx ts-node src/main.ts` en la carpeta del backend

#### 2. CORS Error
**Causa:** Frontend en puerto diferente a 5173 o 3000  
**Solución:** Ya está configurado, pero si usas otro puerto, edita `src/main.ts`

#### 3. 404 Not Found
**Causa:** URL incorrecta  
**Solución:** Verifica que uses `/api/` en la ruta: `http://localhost:3001/api/peis`

#### 4. 413 Payload Too Large
**Causa:** Archivo mayor a 10MB  
**Solución:** Comprime el PDF o implementa chunked upload

#### 5. 400 Bad Request
**Causa:** Datos faltantes o formato incorrecto  
**Solución:** Revisa el Swagger docs para ver el formato esperado

### Formato de Respuesta de Errores

```json
{
  "statusCode": 400,
  "message": "Validation failed",
  "error": "Bad Request"
}
```

---

## 📊 Variables de Entorno (Opcional)

### En el Frontend (.env en tu proyecto React/Vite)

```env
# Vite (React)
VITE_API_URL=http://localhost:3001

# Create React App
REACT_APP_API_URL=http://localhost:3001
```

### Uso en Frontend

```javascript
// Vite
const API_URL = import.meta.env.VITE_API_URL;

// CRA
const API_URL = process.env.REACT_APP_API_URL;

// Uso
fetch(`${API_URL}/api/uploads/students`, { ... });
```

---

## ✅ Checklist Final: ¿Estás Listo?

### Backend (Ya está todo ✅)
- [x] Servidor corriendo en http://localhost:3001
- [x] CORS configurado para frontend
- [x] Base de datos conectada
- [x] 30+ endpoints funcionando
- [x] Swagger docs disponibles
- [x] Health checks implementados
- [x] Validación automática activa
- [x] Modo mock para demo sin API keys

### Frontend (Lo que necesitas crear)
- [ ] Formulario de estudiantes
- [ ] Componente de upload de archivos
- [ ] Botón de generar PEI
- [ ] Visualizador de PEI (puede ser simple)
- [ ] Reproductor de audio (elemento `<audio>`)
- [ ] Lista de recursos educativos
- [ ] Navegación básica entre vistas

### Demo del Hackathon (Preparación)
- [ ] Datos de ejemplo preparados
- [ ] PDF de reporte médico de prueba
- [ ] Flow completo probado 2-3 veces
- [ ] Screenshots para presentación
- [ ] Pitch de 3 minutos ensayado

---

## 🎯 Qué Más Necesitas para Conectar

### **NADA MÁS EN EL BACKEND** ✅

El backend está **100% completo** para conectar con el frontend.

### Lo que SÍ necesitas en el Frontend:

1. **HTTP Client:** Fetch nativo o axios
2. **State Management:** useState/useReducer (o Redux/Zustand si prefieres)
3. **Routing:** React Router para navegación
4. **UI Components:** Formularios, botones, cards, etc.
5. **File Upload:** Input de tipo file con FormData

### Librerías Recomendadas (Opcional):

```bash
# Si quieres mejorar la UX
npm install react-router-dom axios react-hot-toast

# Si quieres mostrar PDFs
npm install react-pdf

# Si quieres gráficos bonitos
npm install recharts

# Si quieres formularios con validación
npm install react-hook-form zod
```

---

## 🚀 Siguiente Paso Inmediato

### Prueba la Conexión con un Test Simple

Crea un archivo `test-connection.html` en cualquier lugar:

```html
<!DOCTYPE html>
<html>
<head>
  <title>Test NeuroPlan Backend</title>
</head>
<body>
  <h1>Test de Conexión Backend</h1>
  <button onclick="testConnection()">Probar Conexión</button>
  <div id="result"></div>

  <script>
    async function testConnection() {
      const result = document.getElementById('result');
      result.innerHTML = 'Probando...';
      
      try {
        // Test 1: Health check
        const health = await fetch('http://localhost:3001/health').then(r => r.json());
        console.log('Health:', health);
        
        // Test 2: Crear estudiante
        const student = await fetch('http://localhost:3001/api/uploads/students', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: 'Test Usuario',
            dateOfBirth: '2015-01-01',
            gradeLevel: 'Test'
          })
        }).then(r => r.json());
        
        console.log('Student:', student);
        
        result.innerHTML = `
          <h2>✅ Conexión exitosa!</h2>
          <pre>${JSON.stringify({ health, student }, null, 2)}</pre>
        `;
      } catch (error) {
        result.innerHTML = `<h2>❌ Error: ${error.message}</h2>`;
        console.error(error);
      }
    }
  </script>
</body>
</html>
```

Abre ese archivo en el navegador y haz clic en el botón. Si funciona, **tu backend está listo para conectar con React**.

---

## 📞 Documentación de Referencia

1. **Swagger Docs (Principal):** http://localhost:3001/api/docs
2. **Guía de Integración Completa:** `FRONTEND_INTEGRATION.md` (en el proyecto)
3. **Estado del Proyecto:** `PROYECTO_COMPLETO.md`
4. **README Técnico:** `README.md`

---

## 🏆 Resumen Final

### ✅ Tienes TODO lo necesario en el Backend:
- API REST completa (30+ endpoints)
- CORS configurado
- Validación automática
- Manejo de archivos
- 4 integraciones de sponsors
- Documentación interactiva
- Health checks
- Modo mock para demos

### 🎨 Solo necesitas crear el Frontend:
- Componentes React básicos
- Fetch/Axios para hacer requests
- Formularios simples
- Visualización de datos

### 🚀 Para la Demo:
Todo el backend está listo. **Enfócate en crear una UI simple pero funcional** que demuestre el flujo completo:
```
Crear Estudiante → Subir Reporte → Generar PEI → Audio → Recursos
```

**¡Tu backend está espectacular y listo para ganar el hackathon! 🏆**
