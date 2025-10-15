# 📋 API Endpoints Documentation - NeuroPlan Backend

## 🔐 Configuración de Autenticación

**Base URL:** `http://localhost:3001`  
**🔒 IMPORTANTE:** Todos los endpoints están protegidos por JWT excepto los de autenticación

### Headers requeridos para endpoints protegidos:
```javascript
{
  "Authorization": "Bearer <jwt_token>",
  "Content-Type": "application/json"
}
```

### Roles del sistema y permisos:
- `ADMIN` - Acceso completo al sistema y gestión de usuarios
- `ORIENTADOR` - Creación/edición de PEIs, gestión de estudiantes, subida de informes
- `PROFESOR` - Consulta de PEIs y seguimiento (solo lectura)
- `DIRECTOR_CENTRO` - Vista global del centro educativo (solo lectura)

---

## 🔑 Autenticación (Auth Module) - ENDPOINTS PÚBLICOS

### `POST /auth/register`
**🌐 PÚBLICO - Registro de nuevo usuario**

```javascript
// Body
{
  "email": "usuario@email.com",
  "password": "password123",
  "nombre": "Juan",
  "apellidos": "Pérez García",
  "rol": "ORIENTADOR", // ADMIN | ORIENTADOR | PROFESOR | DIRECTOR_CENTRO
  "centroId": "centro_id_opcional"
}

// Response 201
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "clxxx123",
    "email": "usuario@email.com",
    "nombre": "Juan",
    "apellidos": "Pérez García",
    "rol": "ORIENTADOR",
    "centro": { "id": "clyyy456", "nombre": "CEIP Cervantes" }
  }
}
```

### `POST /auth/login`
**🌐 PÚBLICO - Inicio de sesión**

```javascript
// Body
{
  "email": "usuario@email.com",
  "password": "password123"
}

// Response 200
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "clxxx123",
    "email": "usuario@email.com",
    "nombre": "Juan",
    "apellidos": "Pérez García",
    "rol": "ORIENTADOR",
    "centro": { "id": "clyyy456", "nombre": "CEIP Cervantes" }
  }
}
```

### `GET /auth/profile`
**🔒 PROTEGIDO - Obtener perfil del usuario autenticado**  
**Roles permitidos:** TODOS los autenticados

```javascript
// Headers: Authorization: Bearer <token>

// Response 200
{
  "id": "clxxx123",
  "email": "usuario@email.com",
  "nombre": "Juan",
  "apellidos": "Pérez García",
  "rol": "ORIENTADOR",
  "centro": {
    "id": "clyyy456",
    "nombre": "CEIP Cervantes",
    "direccion": "Calle Mayor 123"
  }
}
```

---

## 📚 Gestión de PEIs (PEIs Module)

### `POST /api/peis/generate`
**🔒 PROTEGIDO - Generar nuevo PEI**  
**Roles permitidos:** `ADMIN`, `ORIENTADOR`

```javascript
// Headers: Authorization: Bearer <token>
// Body
{
  "reporteId": "reporte_id_123",
  "studentId": "student_id_456",
  "configuracion": {
    "tipoAnalisis": "completo", // completo | basico
    "incluirActividades": true,
    "incluirAdaptaciones": true
  }
}

// Response 201
{
  "id": "clxxx123",
  "version": 1,
  "estado": "DRAFT",
  "student": {
    "id": "clyyy456",
    "nombre": "María",
    "apellidos": "García López"
  },
  "resumen": "Estudiante con TDAH que requiere adaptaciones específicas...",
  "objetivos": [
    {
      "area": "Atención",
      "objetivo": "Mejorar la concentración en tareas de 15 minutos",
      "actividades": ["Técnicas de respiración", "Descansos programados"]
    }
  ],
  "adaptaciones": [
    {
      "tipo": "Metodológica",
      "descripcion": "Instrucciones paso a paso con apoyo visual"
    }
  ],
  "creadoPor": "usuario_id_789",
  "fechaCreacion": "2025-01-11T14:30:00.000Z"
}
```

### `GET /api/peis`
**🔒 PROTEGIDO - Listar PEIs del usuario**  
**Roles permitidos:** `ADMIN`, `ORIENTADOR`, `PROFESOR`, `DIRECTOR_CENTRO`

```javascript
// Headers: Authorization: Bearer <token>
// Query params: ?page=1&limit=10&estado=ACTIVE

// Response 200
{
  "peis": [
    {
      "id": "clxxx123",
      "version": 1,
      "estado": "ACTIVE",
      "student": {
        "nombre": "María",
        "apellidos": "García López",
        "curso": "6º Primaria"
      },
      "fechaCreacion": "2025-01-11T14:30:00.000Z",
      "ultimaModificacion": "2025-01-11T16:45:00.000Z"
    }
  ],
  "total": 25,
  "page": 1,
  "limit": 10
}
```

### `GET /api/peis/:id`
**🔒 PROTEGIDO - Obtener PEI específico**  
**Roles permitidos:** `ADMIN`, `ORIENTADOR`, `PROFESOR`, `DIRECTOR_CENTRO`

```javascript
// Headers: Authorization: Bearer <token>

// Response 200
{
  "id": "clxxx123",
  "version": 1,
  "estado": "ACTIVE",
  "student": {
    "id": "clyyy456",
    "nombre": "María",
    "apellidos": "García López",
    "fechaNacimiento": "2012-03-15",
    "curso": "6º Primaria"
  },
  "resumen": "Estudiante con TDAH que requiere adaptaciones específicas...",
  "objetivos": [
    {
      "id": "obj1",
      "area": "Atención",
      "objetivo": "Mejorar la concentración en tareas de 15 minutos",
      "plazoEjecucion": "3 meses",
      "criteriosEvaluacion": ["Mantiene atención 10 min", "Completa tareas"],
      "actividades": [
        {
          "descripcion": "Técnicas de respiración",
          "frecuencia": "Diaria",
          "responsable": "Tutor"
        }
      ]
    }
  ],
  "adaptaciones": [
    {
      "tipo": "Metodológica",
      "area": "Instrucciones",
      "descripcion": "Instrucciones paso a paso con apoyo visual",
      "recursos": ["Pictogramas", "Checklist visual"]
    }
  ],
  "seguimiento": {
    "fechaRevision": "2025-04-11",
    "observaciones": "Progreso positivo en atención",
    "proximaEvaluacion": "2025-02-11"
  },
  "creadoPor": {
    "nombre": "Juan Pérez",
    "rol": "ORIENTADOR"
  },
  "fechaCreacion": "2025-01-11T14:30:00.000Z"
}
```

### `PUT /api/peis/:id`
**🔒 PROTEGIDO - Actualizar PEI**  
**Roles permitidos:** `ADMIN`, `ORIENTADOR`

```javascript
// Headers: Authorization: Bearer <token>
// Body (campos opcionales para actualizar)
{
  "resumen": "Resumen actualizado...",
  "objetivos": [...], // Array completo de objetivos
  "adaptaciones": [...], // Array completo de adaptaciones
  "estado": "ACTIVE" // DRAFT | ACTIVE | ARCHIVED
}

// Response 200
{
  "id": "clxxx123",
  "message": "PEI actualizado correctamente",
  "version": 2, // Se incrementa automáticamente
  "ultimaModificacion": "2025-01-11T16:45:00.000Z"
}
```

### `DELETE /api/peis/:id`
**🔒 PROTEGIDO - Eliminar PEI**  
**Roles permitidos:** `ADMIN`, `ORIENTADOR`

```javascript
// Headers: Authorization: Bearer <token>

// Response 200
{
  "message": "PEI eliminado correctamente",
  "id": "clxxx123"
}
```

---

## 📁 Gestión de Uploads y Estudiantes (Uploads Module)

### `POST /api/uploads/students`
**🔒 PROTEGIDO - Crear nuevo estudiante**  
**Roles permitidos:** `ADMIN`, `ORIENTADOR`

```javascript
// Headers: Authorization: Bearer <token>
// Body
{
  "nombre": "María",
  "apellidos": "García López",
  "fechaNacimiento": "2012-03-15",
  "curso": "6º Primaria",
  "nombrePadre": "Ana López",
  "emailPadre": "ana.lopez@email.com",
  "colegio": "CEIP Cervantes",
  "observaciones": "Diagnóstico previo de TDAH"
}

// Response 201
{
  "id": "clxxx123",
  "nombre": "María",
  "apellidos": "García López",
  "fechaNacimiento": "2012-03-15T00:00:00.000Z",
  "curso": "6º Primaria",
  "nombrePadre": "Ana López",
  "emailPadre": "ana.lopez@email.com",
  "colegio": "CEIP Cervantes",
  "fechaCreacion": "2025-01-11T14:30:00.000Z",
  "centroId": "centro_usuario_logueado"
}
```

### `GET /api/uploads/students`
**🔒 PROTEGIDO - Listar estudiantes del centro**  
**Roles permitidos:** `ADMIN`, `ORIENTADOR`, `PROFESOR`, `DIRECTOR_CENTRO`

```javascript
// Headers: Authorization: Bearer <token>

// Response 200
[
  {
    "id": "clxxx123",
    "nombre": "María",
    "apellidos": "García López",
    "curso": "6º Primaria",
    "colegio": "CEIP Cervantes",
    "fechaCreacion": "2025-01-11T14:30:00.000Z",
    "reportes": [
      {
        "id": "clyyy456",
        "nombreOriginal": "informe_maria_tdah.pdf",
        "estado": "COMPLETED",
        "fechaSubida": "2025-01-11T14:35:00.000Z"
      }
    ],
    "peis": [
      {
        "id": "clzzz789",
        "version": 1,
        "estado": "ACTIVE",
        "fechaCreacion": "2025-01-11T14:40:00.000Z"
      }
    ]
  }
]
```

### `GET /api/uploads/students/:id`
**🔒 PROTEGIDO - Obtener estudiante específico**  
**Roles permitidos:** `ADMIN`, `ORIENTADOR`, `PROFESOR`, `DIRECTOR_CENTRO`

```javascript
// Headers: Authorization: Bearer <token>

// Response 200
{
  "id": "clxxx123",
  "nombre": "María",
  "apellidos": "García López",
  "fechaNacimiento": "2012-03-15T00:00:00.000Z",
  "curso": "6º Primaria",
  "nombrePadre": "Ana López",
  "emailPadre": "ana.lopez@email.com",
  "colegio": "CEIP Cervantes",
  "observaciones": "Diagnóstico previo de TDAH",
  "fechaCreacion": "2025-01-11T14:30:00.000Z",
  "reportes": [...], // Lista completa de reportes
  "peis": [...], // Lista completa de PEIs
  "audios": [...], // Audios de accesibilidad
  "recursos": [...] // Recursos adicionales
}
```

### `POST /api/uploads/reports/:studentId`
**🔒 PROTEGIDO - Subir informe de estudiante**  
**Roles permitidos:** `ADMIN`, `ORIENTADOR`

```javascript
// Headers: 
// Authorization: Bearer <token>
// Content-Type: multipart/form-data

// Form Data
{
  "file": File, // PDF, JPG, JPEG, PNG (máx. 10MB)
}

// Response 201
{
  "id": "clxxx123",
  "nombreArchivo": "1697028123456-abc123.pdf",
  "nombreOriginal": "informe_maria_tdah.pdf",
  "tipoMime": "application/pdf",
  "tamaño": 2048576,
  "estado": "PENDING", // PENDING | PROCESSING | COMPLETED | ERROR
  "fechaSubida": "2025-01-11T14:30:00.000Z",
  "studentId": "clyyy456"
}
```

### `POST /api/uploads/reports` (FormData)
**🔒 PROTEGIDO - Subir informe con studentId en FormData**  
**Roles permitidos:** `ADMIN`, `ORIENTADOR`

```javascript
// Headers: 
// Authorization: Bearer <token>
// Content-Type: multipart/form-data

// Form Data
{
  "file": File, // PDF, JPG, JPEG, PNG (máx. 10MB)
  "studentId": "clyyy456" // ID del estudiante como string
}

// Response 201 - Mismo formato que endpoint anterior
```

### `GET /api/uploads/reports/:id`
**🔒 PROTEGIDO - Obtener metadatos de informe**  
**Roles permitidos:** `ADMIN`, `ORIENTADOR`, `PROFESOR`

```javascript
// Headers: Authorization: Bearer <token>

// Response 200
{
  "id": "clxxx123",
  "nombreArchivo": "1697028123456-abc123.pdf",
  "nombreOriginal": "informe_maria_tdah.pdf",
  "tipoMime": "application/pdf",
  "tamaño": 2048576,
  "estado": "COMPLETED",
  "fechaSubida": "2025-01-11T14:30:00.000Z",
  "textoExtraido": "Texto del documento...",
  "analisisIA": "Análisis generado por Claude...",
  "student": {
    "id": "clyyy456",
    "nombre": "María García López"
  }
}
```

### `GET /api/uploads/reports/:id/download`
**🔒 PROTEGIDO - Descargar archivo de informe**  
**Roles permitidos:** `ADMIN`, `ORIENTADOR`, `PROFESOR`

```javascript
// Headers: Authorization: Bearer <token>

// Response 200 - Binary file
// Headers de respuesta:
{
  "Content-Type": "application/pdf",
  "Content-Disposition": "attachment; filename=\"informe_maria_tdah.pdf\"",
  "Content-Length": "2048576"
}
```

---

## 📊 Streaming y Reportes (Reports Module)

### `GET /api/reports/:id/process/stream`
**🔒 PROTEGIDO - Stream de progreso SSE (Server-Sent Events)**  
**Roles permitidos:** `ADMIN`, `ORIENTADOR`

```javascript
// Headers: Authorization: Bearer <token>

// Response: text/event-stream
// Eventos enviados:
{
  "type": "progress",
  "stage": "ocr", // ocr | analysis | pei-generation | family-summary
  "progress": 25,
  "message": "🔍 Extrayendo texto del documento..."
}

{
  "type": "complete",
  "stage": "done",
  "progress": 100,
  "message": "✅ Proceso completado",
  "data": {
    "reportId": "clxxx123",
    "peiId": "clyyy456"
  }
}
```

**Uso desde frontend:**
```javascript
// Conectar al stream
const eventSource = new EventSource('http://localhost:3001/api/reports/123/process/stream', {
  headers: {
    'Authorization': 'Bearer ' + token
  }
});

// Escuchar eventos
eventSource.onmessage = (event) => {
  const data = JSON.parse(event.data);
  
  if (data.type === 'progress') {
    updateProgressBar(data.progress);
    showMessage(data.message);
  }
  
  if (data.type === 'complete') {
    eventSource.close();
    redirectToPEI(data.data.peiId);
  }
};

// Manejar errores
eventSource.onerror = (error) => {
  console.error('Error en el stream:', error);
  eventSource.close();
};
```

---

## ☁️ Servicios AWS (AWS Module)

### `POST /aws/generate-presigned-url`
**🔒 PROTEGIDO - Generar URL firmada para S3**  
**Roles permitidos:** TODOS los autenticados

```javascript
// Headers: Authorization: Bearer <token>
// Body
{
  "fileName": "informe-estudiante.pdf",
  "fileType": "application/pdf",
  "folder": "reports" // reports | audios | resources
}

// Response 200
{
  "uploadUrl": "https://s3.amazonaws.com/bucket/path/to/file?signature=...",
  "fileKey": "reports/2025/01/11/unique-filename.pdf",
  "expiresIn": 3600
}
```

### `POST /aws/upload`
**🔒 PROTEGIDO - Upload directo a S3**  
**Roles permitidos:** `ADMIN`, `ORIENTADOR`

```javascript
// Headers: 
// Authorization: Bearer <token>
// Content-Type: multipart/form-data

// Form Data
{
  "file": File,
  "folder": "reports" // reports | audios | resources
}

// Response 200
{
  "fileUrl": "https://s3.amazonaws.com/bucket/path/to/file.pdf",
  "fileKey": "reports/2025/01/11/unique-filename.pdf",
  "size": 2048576
}
```

### `POST /aws/bedrock/generate-pei`
**🔒 PROTEGIDO - Generar PEI con Claude AI**  
**Roles permitidos:** `ADMIN`, `ORIENTADOR`

### `POST /aws/process-report`
**🔒 PROTEGIDO - Procesamiento completo de informe**  
**Roles permitidos:** `ADMIN`, `ORIENTADOR`

### Otros endpoints AWS disponibles:
- `/aws/bedrock/invoke` - Invocar Claude AI
- `/aws/bedrock/simplify-content` - Simplificar contenido 
- `/aws/bedrock/tutor-chat` - Chat educativo
- `/aws/textract/extract` - Extraer texto de documentos
- `/aws/textract/analyze-document` - Análisis avanzado
- `/aws/comprehend/detect-entities` - Detectar entidades
- `/aws/comprehend/detect-phi` - Detectar información sensible
- `/aws/polly/synthesize` - Síntesis de voz

---

## 🔧 Endpoints Públicos

### `GET /`
**🌐 PÚBLICO - Health check de la aplicación**

```javascript
// Response 200
{
  "message": "NeuroPlan Backend API",
  "version": "1.0.0",
  "status": "OK",
  "timestamp": "2025-01-11T14:30:00.000Z"
}
```

---

## ✅ RESUMEN DE CONEXIÓN FRONTEND

### 🟢 Estado de la Conexión
- **✅ CORS configurado** para `localhost:5173` y `localhost:3000`
- **✅ Server corriendo** en `http://localhost:3001`
- **✅ Autenticación JWT** implementada con guards
- **✅ Roles y permisos** aplicados a todos los endpoints
- **✅ Swagger documentation** disponible en `/api`

### 🔧 Para conectar desde el frontend:

```javascript
// 1. Configurar la base URL
const API_BASE_URL = 'http://localhost:3001';

// 2. Login y obtener token
const login = async (email, password) => {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  const data = await response.json();
  localStorage.setItem('token', data.access_token);
  return data;
};

// 3. Configurar interceptor para requests autenticados
const apiRequest = async (url, options = {}) => {
  const token = localStorage.getItem('token');
  return fetch(`${API_BASE_URL}${url}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      ...options.headers
    },
    credentials: 'include' // Para CORS con credenciales
  });
};

// 4. Ejemplo de uso
const getStudents = async () => {
  const response = await apiRequest('/api/uploads/students');
  return response.json();
};
```

### 📋 Endpoints críticos para el frontend:
1. **Autenticación:** `/auth/login`, `/auth/profile`
2. **Estudiantes:** `/api/uploads/students`, `/api/uploads/students/:id`
3. **Informes:** `/api/uploads/reports/:studentId` (upload)
4. **PEIs:** `/api/peis/generate`, `/api/peis/:id`
5. **Progreso:** `/api/reports/:id/process/stream` (SSE)

---

## 🚀 Configuración CORS

La API está configurada para permitir conexiones desde:
- `http://localhost:5173` (Vite dev server)
- `http://localhost:3000` (React dev server)

```javascript
// Configuración automática
{
  "origin": ["http://localhost:5173", "http://localhost:3000"],
  "credentials": true,
  "methods": ["GET", "POST", "PUT", "DELETE", "PATCH"],
  "allowedHeaders": ["Content-Type", "Authorization"]
}
```

---

## 📖 Documentación Swagger

**URL:** `http://localhost:3001/api`

La documentación interactiva está disponible con:
- Todos los endpoints documentados
- Esquemas de request/response
- Autenticación JWT integrada
- Ejemplos de uso
- Testing directo desde la interfaz

---

## 🔐 Manejo de Errores

### Códigos de estado comunes:
- `200` - Éxito
- `201` - Creado correctamente  
- `400` - Datos inválidos
- `401` - No autorizado (token inválido/faltante)
- `403` - Prohibido (sin permisos para el rol)
- `404` - Recurso no encontrado
- `500` - Error interno del servidor

### Formato de errores:
```javascript
{
  "statusCode": 400,
  "message": "Descripción del error",
  "error": "Bad Request",
  "timestamp": "2025-01-11T14:30:00.000Z",
  "path": "/api/endpoint"
}
```

---

## 🧪 Usuarios de Prueba (Demo Data)

Los siguientes usuarios están disponibles después de ejecutar el seeder:

```javascript
// ADMIN
{
  "email": "admin@neuroplan.demo",
  "password": "demo123",
  "role": "ADMIN"
}

// ORIENTADOR  
{
  "email": "orientador@neuroplan.demo", 
  "password": "demo123",
  "role": "ORIENTADOR"
}

// PROFESOR
{
  "email": "profesor@neuroplan.demo",
  "password": "demo123", 
  "role": "PROFESOR"
}

// DIRECTOR_CENTRO
{
  "email": "director@neuroplan.demo",
  "password": "demo123",
  "role": "DIRECTOR_CENTRO"
}
```

---

**📅 Última actualización:** 11 de Enero, 2025  
**🔗 Base URL:** http://localhost:3001  
**📋 Swagger Docs:** http://localhost:3001/api