# NeuroPlan MVP

Plataforma de individualización educativa con IA para estudiantes con necesidades especiales.

## Tecnologías

### Backend
- **NestJS** - Framework Node.js con TypeScript
- **Supabase** - Base de datos PostgreSQL + Auth
- **Ollama** - LLM local (Llama 3.2:3b)
- **JWT** - Autenticación con tokens

### Frontend
- **React + Vite** - UI moderna y rápida
- **TypeScript** - Tipado estático
- **Tailwind CSS** - Estilos utility-first
- **Shadcn/UI** - Componentes de interfaz

## Estructura del Proyecto

```
neuroplan-mvp/
├── backend/          # API NestJS
│   ├── src/
│   │   ├── modules/  # Módulos de la aplicación
│   │   │   ├── auth/         # Autenticación
│   │   │   ├── students/     # Gestión de estudiantes
│   │   │   ├── peis/         # Motor PEI
│   │   │   ├── uploads/      # Análisis de documentos
│   │   │   └── ...
│   │   ├── db.ts            # Configuración Supabase
│   │   └── main.ts          # Punto de entrada
│   ├── scripts/             # Scripts de utilidad
│   └── .env                 # Variables de entorno (NO commitear)
│
└── frontend/        # React App
    ├── src/
    │   ├── pages/           # Páginas
    │   ├── components/      # Componentes UI
    │   ├── contexts/        # Contextos React
    │   ├── services/        # Servicios API
    │   └── hooks/           # Custom hooks
    └── .env                 # Variables de entorno frontend
```

## Configuración Inicial

### 1. Clonar el repositorio

```bash
git clone <tu-repo>
cd neuroplan-mvp
```

### 2. Backend

```bash
cd backend
npm install

# Copiar archivo de variables de entorno
cp .env.example .env

# Editar .env con tus credenciales de Supabase
```

### 3. Frontend

```bash
cd frontend
npm install

# Copiar archivo de variables de entorno (si existe)
```

### 4. Configurar Supabase

#### a) Crear proyecto en Supabase

1. Ve a https://supabase.com y crea un nuevo proyecto
2. Copia las credenciales:
   - **Project URL** → `SUPABASE_URL`
   - **Anon Key** → `SUPABASE_ANON_KEY`
   - **Service Role Key** → `SUPABASE_SERVICE_ROLE_KEY`

#### b) Ejecutar schema de base de datos

1. Ve al **SQL Editor** en tu proyecto Supabase
2. Copia el contenido de `backend/supabase-schema-complete.sql`
3. Ejecuta el script

#### c) Desactivar confirmación de email (solo para MVP/desarrollo)

1. Ve a **Authentication** > **Providers** > **Email**
2. Desactiva la opción **"Confirm email"**
3. Guarda los cambios

**Nota**: Esto permite registrar usuarios sin enviar emails de confirmación. Es útil para desarrollo, pero **debes reactivarlo en producción**.

Ver más detalles en: `backend/SUPABASE_CONFIG.md`

### 5. Configurar Ollama (opcional pero recomendado)

```bash
# Instalar Ollama
# Windows: Descargar de https://ollama.com
# Linux/Mac: curl -fsSL https://ollama.com/install.sh | sh

# Descargar modelo
ollama pull llama3.2:3b

# Verificar que funciona
ollama run llama3.2:3b "Hola"
```

## Ejecutar el proyecto

### Backend

```bash
cd backend
npm run start:dev
```

El backend estará disponible en: **http://localhost:3001**

### Frontend

```bash
cd frontend
npm run dev
```

El frontend estará disponible en: **http://localhost:5173**

## Funcionalidades

### Autenticación
- ✅ Registro de usuarios con valores por defecto
- ✅ Login/Logout con JWT
- ✅ Rutas protegidas
- ✅ Control de acceso basado en roles

**Roles disponibles:**
- `ADMIN` - Administrador del sistema
- `DIRECTOR_CENTRO` - Director de centro educativo
- `ORIENTADOR` - Orientador educativo
- `PROFESOR` - Profesor (rol por defecto en MVP)
- `ESTUDIANTE_FAMILIA` - Estudiante/Familia

### PEI Engine
- Generación automática de Planes Educativos Individualizados
- Análisis de documentos con Ollama
- Personalización basada en perfil neurocognitivo

### Gestión de Estudiantes
- Crear y gestionar perfiles de estudiantes
- Historial académico
- Documentación clínica y educativa

### Dashboard
- Vista general de estadísticas
- Acceso rápido a funcionalidades
- Panel de notificaciones

## Valores por defecto (MVP)

Para facilitar el desarrollo, el sistema usa estos valores por defecto:

- **Rol por defecto**: `PROFESOR`
- **Centro por defecto**: `11111111-1111-1111-1111-111111111111` (UUID demo)
- **Email confirmation**: Desactivada (configurable en Supabase)

Esto significa que puedes registrarte con cualquier email (incluso falso) y empezar a usar la aplicación inmediatamente.

## Análisis de PDF

El análisis de PDFs con Ollama está disponible en:

- **Frontend**: http://localhost:5173/pdf-analysis
- **Backend**: http://localhost:3001/uploads/analyze-pdf

## Variables de entorno

### Backend (.env)

```env
# Servidor
PORT=3001
NODE_ENV=development
ALLOWED_ORIGINS=http://localhost:5173

# Supabase
SUPABASE_URL=https://tu-proyecto.supabase.co
SUPABASE_ANON_KEY=tu_anon_key
SUPABASE_SERVICE_ROLE_KEY=tu_service_role_key
SUPABASE_STRICT=false

# JWT
JWT_SECRET=tu_jwt_secret_muy_largo_y_secreto
JWT_EXPIRES_IN=24h

# Ollama
OLLAMA_URL=http://localhost:11434
OLLAMA_MODEL=llama3.2:3b
```

Ver `.env.example` para la plantilla completa.

## Troubleshooting

### Error: "El email ya está registrado"
Si ya registraste un usuario, puedes:
1. Intentar hacer login con ese email
2. O eliminarlo desde el panel de Supabase (Authentication > Users)

### Error: "Supabase connection failed"
Verifica que:
1. Las credenciales en `.env` son correctas
2. Tu proyecto Supabase está activo
3. El schema de base de datos está ejecutado

### Error: "Ollama no responde"
Verifica que:
1. Ollama está instalado y corriendo
2. El modelo está descargado: `ollama pull llama3.2:3b`
3. El puerto 11434 está disponible

### Error al hacer login después de registro
Asegúrate de haber desactivado la confirmación de email en Supabase (ver sección de configuración).

## Archivos eliminados/reorganizados

En la limpieza del proyecto:

- ✅ Eliminado módulo duplicado: `backend/src/supabase/` (usar `backend/src/modules/supabase/`)
- ✅ Scripts antiguos movidos a: `backend/scripts/deprecated/`
- ✅ Eliminado archivo temporal: `.env.temp`
- ✅ Creado `.env.example` como plantilla

## Roadmap (Producción)

Antes de pasar a producción:

- [ ] Reactivar verificación de email
- [ ] Configurar templates de email personalizados
- [ ] Implementar password reset flow
- [ ] Añadir rate limiting
- [ ] Configurar proveedores OAuth (Google, Microsoft)
- [ ] Implementar refresh tokens
- [ ] Activar Row Level Security (RLS) en todas las tablas
- [ ] Configurar AWS Bedrock/Textract para mejor análisis de documentos
- [ ] Implementar sistema de notificaciones por email
- [ ] Tests end-to-end
- [ ] CI/CD pipeline

## Documentación adicional

- **Configuración de Supabase**: `backend/SUPABASE_CONFIG.md`
- **Schema de base de datos**: `backend/supabase-schema-complete.sql`
- **Scripts SQL**: `backend/scripts/`

## Licencia

Proyecto privado - Todos los derechos reservados
