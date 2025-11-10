# 🎥 Videos Module - api.video Integration

## Overview

El módulo de videos integra **api.video** (alternativa gratuita a VEED) para gestionar videos educativos. El sistema funciona con datos mock por defecto y se puede conectar a api.video cuando estés listo.

## Arquitectura

```
Frontend (veed.ts)
    ↓ HTTP GET /api/videos
Backend (videos.controller.ts)
    ↓ videos.service.ts
    ↓ (si API_VIDEO_KEY existe)
api.video REST API
    ↓ (si no existe o falla)
Mock Data (5 videos de ejemplo)
```

## ✅ Configuración Completada

Las credenciales de **api.video sandbox** ya están configuradas en `backend/.env`:

```bash
API_VIDEO_URL=https://sandbox.api.video
API_VIDEO_KEY=IG1t61YlHNKt1vdG0YYrEKEgfgJsp0K8ZTFurTwoMPG
VIDEOS_MOCK=false
```

### Para empezar a usar:

1. **Reinicia el backend**:
   ```bash
   cd backend
   npm run start:dev
   ```
2. **Verifica los logs**:

   ```
   ✅ api.video configurado: https://sandbox.api.video (key present)
   ```

3. **¡Listo!** El sistema ahora conecta con api.video sandbox automáticamente.

Ver guía completa en: `QUICK_START_VIDEOS.md`

---

## Uso Actual (Mock Data)

El sistema **ya funciona** con datos mock. No necesitas configurar nada para desarrollo.

```typescript
import { videosService } from "@/services/veed";

// Listar videos con filtros
const videos = await videosService.getVideos({
  subject: "Matemáticas",
  level: "ESO",
  search: "ecuaciones",
});

// Obtener video específico
const video = await videosService.getVideoById("1");

// Progreso (almacenado localmente)
await videosService.updateVideoProgress("1", 75);
const progress = videosService.getVideoProgress("1");

// Likes (almacenado localmente)
await videosService.toggleVideoLike("1");
const liked = videosService.isVideoLiked("1");
```

## Configuración api.video (Opcional)

### 1. Crear cuenta gratuita

1. Ve a https://api.video
2. Registra cuenta gratuita (10 GB almacenamiento, 100 GB transferencia/mes)
3. Ve a **Dashboard > API Keys**
4. Copia tu **API Key**

### 2. Configurar backend

Añade a `backend/.env`:

```bash
# Videos con api.video (opcional - usa mock si no existe)
API_VIDEO_KEY=tu_api_key_aqui
VIDEOS_MOCK=false  # Opcional: fuerza mock incluso con API_KEY
```

### 3. Subir videos (opcional)

```bash
# Instala el CLI de api.video
npm install -g @api.video/api.video-cli

# Autentica
api.video auth

# Sube un video
api.video upload mi-video-educativo.mp4 \
  --title "Introducción a las Ecuaciones" \
  --description "Tutorial de matemáticas" \
  --tags subject:Matemáticas level:ESO year:3º\ ESO
```

**⚠️ Tags importantes para filtros:**

- `subject:Matemáticas` - Para filtrar por materia
- `level:ESO` - Para filtrar por nivel
- `year:3º ESO` - Para mostrar curso específico
- Otros tags sin prefijo se usan para búsqueda general

### 4. Metadata para instructor

```json
{
  "metadata": {
    "instructor": "Prof. Ana Martínez"
  }
}
```

## API Endpoints

### Backend

```
GET /api/videos
  Query params:
    - subject: string (ej. "Matemáticas")
    - level: string (ej. "ESO")
    - search: string (búsqueda en título/descripción/tags)

  Response: ApiResponse<Video[]>

GET /api/videos/:id
  Response: ApiResponse<Video>
```

### Frontend Service

```typescript
// Service singleton (mantiene compatibilidad)
import { veedService } from "@/services/veed";
// O el nuevo nombre
import { videosService } from "@/services/veed";

// Ambos son el mismo objeto
veedService === videosService; // true
```

## Estructura Video

```typescript
interface Video {
  id: string;
  title: string;
  description: string;
  url: string; // MP4 o HLS
  thumbnail: string;
  duration: number; // segundos
  subject: string; // de tag subject:*
  level: string; // de tag level:*
  year: string; // de tag year:*
  progress: number; // 0-100 (localStorage)
  views: number; // de api.video stats
  likes: number; // localStorage (MVP)
  rating: number; // mock data
  subtitles: boolean; // mock data
  transcript: string; // mock data
  tags: string[]; // tags sin prefijo
  createdAt: Date;
  instructor: string; // de metadata.instructor
}
```

## Fallback Strategy

El servicio usa una estrategia de degradación gradual:

1. **API_VIDEO_KEY configurada** → Llama a api.video
2. **API falla o sin KEY** → Usa mock data automáticamente
3. **Mock siempre disponible** → Nunca falla la app

```typescript
// videos.service.ts
private readonly useMockData =
  !this.apiVideoKey ||
  process.env.VIDEOS_MOCK === 'true';
```

## Ventajas de esta Arquitectura

### ✅ Para el MVP

- **Sin dependencias externas**: Funciona con mock data
- **Sin configuración requerida**: Plug & play
- **Sin costos**: Mock data es gratis

### ✅ Para Producción

- **Escalable**: api.video maneja transcoding, CDN, streaming
- **Tier gratuito generoso**: 10 GB almacenamiento, 100 GB/mes
- **API RESTful simple**: Fácil integración
- **Sin vendor lock-in**: Interfaz `Video` abstrae el proveedor

### ✅ Alternativas Futuras

Si necesitas cambiar de proveedor (Cloudflare Stream, Mux, etc.):

1. Cambia solo `videos.service.ts`
2. Frontend y controller no se tocan
3. Interface `Video` se mantiene

## Migración desde VEED

✅ **Completado:**

- ❌ `VITE_VEED_API_KEY` eliminado (inseguro en frontend)
- ✅ `API_VIDEO_KEY` en backend (seguro)
- ✅ Mock data como fallback
- ✅ Compatibilidad backward: `veedService` sigue existiendo
- ✅ ResponseHelper integrado en controller
- ✅ Types unificados (id: string en lugar de number)

## Próximos Pasos (Opcional)

### Para usar api.video real:

1. ☐ Crear cuenta en https://api.video
2. ☐ Copiar API Key a `backend/.env`
3. ☐ Subir videos con tags apropiados
4. ☐ Testar endpoints con Postman/Swagger

### Para persistir progress/likes:

1. ☐ Crear tabla `video_interactions` en Supabase
2. ☐ Añadir endpoints POST `/api/videos/:id/progress`
3. ☐ Añadir endpoints POST `/api/videos/:id/like`
4. ☐ Actualizar frontend service para usar backend

### Para transcripts reales:

1. ☐ api.video soporta captions/subtitles
2. ☐ Mapear `v.assets.captions` a `transcript`
3. ☐ O integrar servicio de transcripción (AWS Transcribe, AssemblyAI)

## Referencias

- **api.video Docs**: https://docs.api.video
- **API Reference**: https://docs.api.video/reference/api
- **CLI Docs**: https://github.com/apivideo/api.video-cli
- **Node.js SDK**: https://github.com/apivideo/api.video-nodejs-client

## Notas de Seguridad

⚠️ **NUNCA expongas API_VIDEO_KEY al frontend**

- ✅ Backend: `process.env.API_VIDEO_KEY`
- ❌ Frontend: `import.meta.env.VITE_API_VIDEO_KEY` (peligroso)

✅ **Buenas prácticas:**

- API Key en backend `.env`
- Frontend llama a tu backend (`/api/videos`)
- Backend hace proxy a api.video
- Rate limiting en tu backend (no implementado aún)
