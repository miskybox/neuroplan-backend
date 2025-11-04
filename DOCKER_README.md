# NeuroPlan MVP - Docker Setup

## 🐳 Quick Start

### Desarrollo Local (sin Docker)

```bash
# Backend
cd backend
npm install
npm run dev

# Frontend
cd frontend
npm install
npm run dev

# Ollama (instalar localmente o usar Docker)
ollama serve
```

### Con Docker Compose

#### 1. Configurar variables de entorno

Crear archivo `.env` en la raíz del proyecto:

```env
# JWT
JWT_SECRET=your-super-secret-jwt-key-change-in-production

# Supabase
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Opcional: PostgreSQL local (si no usas Supabase)
DATABASE_URL=postgresql://neuroplan:neuroplan_password@postgres:5432/neuroplan_dev
```

#### 2. Levantar todos los servicios

```bash
# Construir e iniciar
docker-compose up --build

# En segundo plano
docker-compose up -d --build

# Ver logs
docker-compose logs -f
```

#### 3. Acceder a los servicios

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3001/api
- **Swagger Docs**: http://localhost:3001/api/docs
- **Health Check**: http://localhost:3001/api/health
- **Ollama**: http://localhost:11434

#### 4. Descargar modelo Ollama (primera vez)

```bash
# Entrar al contenedor de Ollama
docker exec -it neuroplan-ollama bash

# Descargar modelo
ollama pull llama3.2:3b

# Verificar
ollama list
```

## 📦 Servicios Incluidos

### 1. **PostgreSQL** (Desarrollo)

- Puerto: 5432
- Usuario: `neuroplan`
- Password: `neuroplan_password_change_in_prod`
- Base de datos: `neuroplan_dev`
- Volumen persistente: `postgres_data`

### 2. **Ollama** (LLM)

- Puerto: 11434
- Modelos recomendados: `llama3.2:3b`, `mistral`
- Volumen persistente: `ollama_data`

### 3. **Backend** (NestJS)

- Puerto: 3001
- Documentación: `/api/docs`
- Health check: `/api/health`
- Hot reload en desarrollo

### 4. **Frontend** (React + Vite)

- Puerto: 5173 (dev) / 80 (prod)
- Nginx en producción
- Proxy API configurado

### 5. **Nginx** (Opcional - Perfil `production`)

- Puerto: 80 (HTTP), 443 (HTTPS)
- Reverse proxy para backend y frontend
- Solo se inicia con: `docker-compose --profile production up`

## 🔧 Comandos Útiles

```bash
# Ver estado de contenedores
docker-compose ps

# Reiniciar un servicio específico
docker-compose restart backend

# Ver logs de un servicio
docker-compose logs -f backend

# Ejecutar comando en contenedor
docker-compose exec backend npm run test

# Detener todos los servicios
docker-compose down

# Detener y eliminar volúmenes
docker-compose down -v

# Reconstruir un servicio específico
docker-compose up -d --build backend
```

## 🏗️ Arquitectura

```
┌─────────────┐
│   Nginx     │  Puerto 80/443 (opcional)
└──────┬──────┘
       │
   ┌───┴────────────────┐
   │                    │
┌──▼───────┐    ┌──────▼───┐
│ Frontend │    │  Backend │  Puerto 3001
│  (React) │    │ (NestJS) │
└──────────┘    └─────┬────┘
   Puerto 5173        │
                  ┌───┴────────────┐
                  │                │
            ┌─────▼─────┐   ┌─────▼─────┐
            │ PostgreSQL│   │  Ollama   │
            │           │   │   (LLM)   │
            └───────────┘   └───────────┘
             Puerto 5432     Puerto 11434
```

## 🚀 Despliegue en Producción

### Con Nginx reverse proxy:

```bash
docker-compose --profile production up -d
```

### Variables de entorno requeridas:

- `JWT_SECRET`: Generar con `openssl rand -base64 32`
- `SUPABASE_*`: Obtener de tu proyecto Supabase
- `DATABASE_URL`: Si usas PostgreSQL local en vez de Supabase

### Recomendaciones:

1. **SSL/TLS**: Configurar certificados en `nginx/ssl/`
2. **Secrets**: Usar Docker Secrets o variables de entorno seguras
3. **Backups**: Configurar backup automático de volúmenes
4. **Monitoring**: Integrar Prometheus + Grafana
5. **Logs**: Centralizar logs con ELK Stack o similar

## 🧪 Testing

```bash
# Tests del backend
docker-compose exec backend npm test

# Tests con coverage
docker-compose exec backend npm run test:cov

# Tests del frontend
docker-compose exec frontend npm test
```

## 🐛 Troubleshooting

### Ollama no responde

```bash
# Verificar que el contenedor está corriendo
docker-compose ps ollama

# Ver logs
docker-compose logs ollama

# Reiniciar
docker-compose restart ollama
```

### Backend no conecta a PostgreSQL

```bash
# Verificar health check
docker-compose ps postgres

# Probar conexión
docker-compose exec postgres psql -U neuroplan -d neuroplan_dev -c "\dt"
```

### Frontend no carga

```bash
# Verificar build
docker-compose logs frontend

# Reconstruir
docker-compose up -d --build frontend
```

## 📝 Notas

- **Desarrollo**: Usar `npm run dev` directamente sin Docker para hot reload óptimo
- **Producción**: Usar Docker Compose con perfil `production`
- **Ollama**: Primera ejecución tarda ~2-5 min en descargar modelo
- **PostgreSQL**: Solo para desarrollo local; en producción usar Supabase

## 🔐 Seguridad

- [ ] Cambiar contraseñas por defecto
- [ ] Generar JWT_SECRET seguro
- [ ] Configurar HTTPS con certificados válidos
- [ ] Implementar rate limiting (ya configurado en backend)
- [ ] Revisar políticas RLS en Supabase
- [ ] Actualizar dependencias regularmente: `npm audit fix`

## 📚 Documentación Adicional

- [NestJS Docker](https://docs.nestjs.com/recipes/docker)
- [Vite Production](https://vitejs.dev/guide/build.html)
- [Ollama Docker](https://ollama.com/download)
- [Docker Compose Reference](https://docs.docker.com/compose/compose-file/)
