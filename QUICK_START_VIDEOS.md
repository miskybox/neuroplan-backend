# 🚀 Quick Start: Probar api.video Integration

## ✅ Configuración Completada

Las credenciales de **api.video sandbox** ya están configuradas en `backend/.env`:

```bash
API_VIDEO_URL=https://sandbox.api.video
API_VIDEO_KEY=IG1t61YlHNKt1vdG0YYrEKEgfgJsp0K8ZTFurTwoMPG
VIDEOS_MOCK=false
```

## 🧪 Cómo Probar

### 1. Reiniciar el Backend

```bash
cd backend
npm run start:dev
```

Verás en los logs:

```
✅ api.video configurado: https://sandbox.api.video (key present)
```

### 2. Probar Endpoint desde Frontend

El frontend ya está configurado para llamar a `/api/videos`. Simplemente:

```typescript
import { videosService } from "@/services/veed";

// Listar todos los videos
const videos = await videosService.getVideos();
console.log(videos);

// Buscar videos
const searchResults = await videosService.getVideos({
  search: "tutorial",
});

// Obtener video específico
const video = await videosService.getVideoById("vi123abc");
```

### 3. Probar con Swagger

1. Ve a http://localhost:3001/api
2. Busca la sección **videos**
3. Endpoints disponibles:
   - `GET /api/videos` - Listar videos con filtros
   - `GET /api/videos/:id` - Obtener video específico

### 4. Probar con cURL

```bash
# Listar videos
curl -X GET "http://localhost:3001/api/videos" \
  -H "Authorization: Bearer tu_token_jwt"

# Buscar videos
curl -X GET "http://localhost:3001/api/videos?search=tutorial" \
  -H "Authorization: Bearer tu_token_jwt"

# Obtener video específico
curl -X GET "http://localhost:3001/api/videos/vi123abc" \
  -H "Authorization: Bearer tu_token_jwt"
```

## 📹 Subir Videos a api.video

### Opción 1: Dashboard Web

1. Ve a https://sandbox.api.video
2. Login con tus credenciales
3. Sube videos manualmente
4. Añade tags importantes:
   - `subject:Matemáticas`
   - `level:ESO`
   - `year:3º ESO`

### Opción 2: CLI (Recomendado)

```bash
# Instalar CLI
npm install -g @api.video/nodejs-client

# Subir video con tags
node -e "
const ApiVideoClient = require('@api.video/nodejs-client');
const client = new ApiVideoClient({
  apiKey: 'IG1t61YlHNKt1vdG0YYrEKEgfgJsp0K8ZTFurTwoMPG',
  baseUri: 'https://sandbox.api.video'
});

client.videos.create({
  title: 'Introducción a las Ecuaciones',
  description: 'Tutorial de matemáticas para 3º ESO',
  tags: ['subject:Matemáticas', 'level:ESO', 'year:3º ESO', 'ecuaciones', 'álgebra']
}).then(video => {
  console.log('Video creado:', video.videoId);
  console.log('Sube el archivo en:', video.assets.iframe);
});
"
```

### Opción 3: Upload Directo desde App

```bash
# Ejemplo con Node.js
node backend/scripts/upload-video-example.js
```

## 🎯 Estructura de Tags para Filtros

Para que los filtros del frontend funcionen correctamente, usa estos tags:

```javascript
{
  tags: [
    'subject:Matemáticas',   // Materia (requerido para filtro subject)
    'level:ESO',             // Nivel educativo (requerido para filtro level)
    'year:3º ESO',           // Curso específico (opcional)
    'ecuaciones',            // Tags libres para búsqueda
    'álgebra',
    'segundo grado'
  ],
  metadata: {
    instructor: 'Prof. Ana Martínez'  // Instructor (opcional)
  }
}
```

## 📊 Respuesta del API

El backend transforma las respuestas de api.video al formato `Video`:

```json
{
  "success": true,
  "data": [
    {
      "id": "vi123abc456def",
      "title": "Introducción a las Ecuaciones",
      "description": "Tutorial de matemáticas",
      "url": "https://vod.api.video/vod/vi123abc456def/mp4/source.mp4",
      "thumbnail": "https://vod.api.video/vod/vi123abc456def/thumbnail.jpg",
      "duration": 1200,
      "subject": "Matemáticas",
      "level": "ESO",
      "year": "3º ESO",
      "progress": 0,
      "views": 0,
      "likes": 0,
      "rating": 0,
      "subtitles": false,
      "transcript": "",
      "tags": ["ecuaciones", "álgebra", "segundo grado"],
      "createdAt": "2025-11-06T10:30:00.000Z",
      "instructor": "Prof. Ana Martínez"
    }
  ],
  "message": "1 videos encontrados",
  "timestamp": "2025-11-06T12:00:00.000Z"
}
```

## 🔄 Fallback a Mock Data

Si api.video falla o la API key no está configurada, el sistema automáticamente usa mock data:

```bash
# Forzar mock data (útil para tests sin conexión)
VIDEOS_MOCK=true
```

Verás en los logs:

```
⚠️  API_VIDEO_KEY no configurada - usando datos mock para videos
```

## 🐛 Troubleshooting

### Error: "API_VIDEO_KEY no configurada"

✅ Solución: Verifica que `backend/.env` tenga:

```bash
API_VIDEO_KEY=IG1t61YlHNKt1vdG0YYrEKEgfgJsp0K8ZTFurTwoMPG
```

### Error: 401 Unauthorized

✅ Solución: Verifica que la API key sea correcta y que uses sandbox URL:

```bash
API_VIDEO_URL=https://sandbox.api.video
```

### Videos no aparecen

✅ Solución:

1. Verifica que los videos existan en https://sandbox.api.video
2. Revisa los logs del backend para ver si hay errores
3. Prueba con Swagger/cURL para descartar problemas del frontend

### Filtros no funcionan

✅ Solución: Verifica que los videos tengan tags con el formato correcto:

- `subject:Matemáticas` (no solo `Matemáticas`)
- `level:ESO` (no solo `ESO`)

## 📝 Próximos Pasos

1. ✅ Backend configurado con api.video sandbox
2. ✅ Frontend listo para consumir API
3. ⏳ Subir videos de prueba con tags apropiados
4. ⏳ Probar filtros desde el frontend
5. ⏳ Implementar persistencia de progress/likes en backend

## 🔗 Referencias Útiles

- **Dashboard Sandbox**: https://sandbox.api.video
- **Dashboard Producción**: https://dashboard.api.video
- **Documentación API**: https://docs.api.video/reference
- **Node.js SDK**: https://github.com/apivideo/api.video-nodejs-client
- **Pricing**: https://api.video/pricing (tier gratuito: 10GB + 100GB/mes)
