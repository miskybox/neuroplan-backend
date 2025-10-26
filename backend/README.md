# 🧠 NeuroPlan AI Campus - Backend API

> **Sistema backend para la plataforma educativa con IA que personaliza el aprendizaje para estudiantes neurodivergentes, alineada con LOMLOE**


## 🎯 Descripción

Backend API REST desarrollado con **NestJS** que proporciona servicios de autenticación, gestión de estudiantes, generación de PEIs con IA, y procesamiento de documentos médicos mediante AWS Bedrock y Textract.

---

## 📌 Estado Actual del Proyecto

> ⚠️ **IMPORTANTE**: Este proyecto está en fase de **MVP (Minimum Viable Product)** y actualmente en proceso de **refactorización técnica** para mejorar la arquitectura, seguridad y escalabilidad.

### ✅ Módulos Implementados (MVP v0.1)

| Módulo | Estado | Descripción |
|--------|--------|-------------|
| 🔐 **Auth Module** | ✅ Funcional | JWT, RBAC, registro/login |
| 👥 **Users Module** | ✅ Funcional | CRUD usuarios, roles, perfiles |
| 🎓 **Students Module** | ✅ Funcional | Gestión de estudiantes y perfiles |
| 📄 **PEI Module** | 🔄 En refactorización | Generación de PEIs con Claude AI |
| ☁️ **AWS Integration** | ✅ Funcional | Bedrock (Claude) + Textract |
| 📊 **Reports Module** | 🔄 En desarrollo | Informes médicos y seguimiento |
| 🏫 **Centros Module** | ⏳ Pendiente | Multi-tenancy para centros |
| 📚 **Temarios Module** | ⏳ Pendiente | Gestión de currículo LOMLOE |

### 🔄 Fase de Refactorización (En Progreso)
- **Arquitectura**: Implementación de CQRS y Event Sourcing
- **Seguridad**: Mejora de validaciones y sanitización
- **Performance**: Optimización de queries y caché
- **Testing**: Incremento de cobertura (objetivo: 85%)
- **Documentación**: API docs con Swagger/OpenAPI

---

## 🛠️ Stack Tecnológico

### Core
- **NestJS 10** (Framework Node.js)
- **TypeScript 5.8**
- **Node.js 18+**

### Base de Datos
- **PostgreSQL 15** (Base de datos principal)
- **Prisma ORM** (Gestión de modelos y migraciones)
- **Redis** (Cache y sesiones - opcional)

### Inteligencia Artificial
- **AWS Bedrock** (Claude 3.5 Sonnet para generación de PEIs)
- **AWS Textract** (Extracción de texto de documentos médicos)

### Autenticación & Seguridad
- **JWT** (JSON Web Tokens)
- **Passport.js** (Estrategias de autenticación)
- **bcrypt** (Hashing de contraseñas)
- **class-validator** + **class-transformer** (Validación de DTOs)

### Herramientas de Desarrollo
- **ESLint** + **Prettier** (Calidad de código)
- **Jest** (Testing unitario e integración)
- **Swagger/OpenAPI** (Documentación automática)
- **Docker** + **Docker Compose** (Contenedorización)

---

## 🚀 Instalación y Configuración

### Prerequisitos
```bash
Node.js >= 18.0.0
npm >= 9.0.0
PostgreSQL >= 15
```

### 1. Clonar el repositorio
```bash
git clone [REPOSITORY_URL]
cd neuroplan-backend
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Configurar variables de entorno
```bash
cp .env.example .env
```

Editar `.env` con tu configuración:
```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/neuroplan?schema=public"

# JWT
JWT_SECRET=your-super-secret-key-change-in-production
JWT_EXPIRATION=7d

# AWS Credentials (para Bedrock y Textract)
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key

# Server
PORT=3001
NODE_ENV=development

# Frontend URL (CORS)
FRONTEND_URL=http://localhost:5173
```

> 🔒 **Seguridad**: Nunca commitear el archivo `.env` con credenciales reales. Usar `.env.example` como plantilla.

### 4. Configurar base de datos
```bash
# Crear base de datos
createdb neuroplan

# Ejecutar migraciones
npx prisma migrate dev

# Generar cliente Prisma
npx prisma generate

# (Opcional) Seed con datos de prueba
npm run seed
```

### 5. Ejecutar en desarrollo
```bash
npm run start:dev
```

El servidor estará disponible en: `http://localhost:3001`

---

## 📡 API Endpoints

### 🔐 Autenticación (`/auth`)

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| POST | `/auth/register` | Registro de nuevo usuario | No |
| POST | `/auth/login` | Inicio de sesión | No |
| GET | `/auth/me` | Obtener perfil usuario actual | Sí |
| POST | `/auth/refresh` | Renovar access token | Sí |
| POST | `/auth/logout` | Cerrar sesión | Sí |

### 👥 Usuarios (`/users`)

| Método | Endpoint | Descripción | Rol Requerido |
|--------|----------|-------------|---------------|
| GET | `/users` | Listar usuarios | ADMIN |
| GET | `/users/:id` | Obtener usuario | ADMIN |
| PATCH | `/users/:id` | Actualizar usuario | ADMIN, Owner |
| DELETE | `/users/:id` | Eliminar usuario | ADMIN |
| GET | `/users/:id/students` | Estudiantes asignados | ORIENTADOR+ |

### 🎓 Estudiantes (`/students`)

| Método | Endpoint | Descripción | Rol Requerido |
|--------|----------|-------------|---------------|
| POST | `/students` | Crear estudiante | ORIENTADOR+ |
| GET | `/students` | Listar estudiantes | PROFESOR+ |
| GET | `/students/:id` | Obtener estudiante | PROFESOR+ |
| PATCH | `/students/:id` | Actualizar estudiante | ORIENTADOR+ |
| DELETE | `/students/:id` | Eliminar estudiante | ADMIN |
| POST | `/students/:id/reports` | Subir informe médico | ORIENTADOR+ |

### 📄 PEIs (`/peis`)

| Método | Endpoint | Descripción | Rol Requerido |
|--------|----------|-------------|---------------|
| POST | `/peis/generate` | Generar PEI con IA | ORIENTADOR+ |
| GET | `/peis` | Listar PEIs | PROFESOR+ |
| GET | `/peis/:id` | Obtener PEI | PROFESOR+ |
| PATCH | `/peis/:id` | Actualizar PEI | ORIENTADOR+ |
| DELETE | `/peis/:id` | Eliminar PEI | ADMIN |
| GET | `/peis/:id/pdf` | Descargar PDF | PROFESOR+ |

### ☁️ AWS Services (`/aws`)

| Método | Endpoint | Descripción | Rol Requerido |
|--------|----------|-------------|---------------|
| POST | `/aws/bedrock/generate-pei` | Generar PEI con Claude | ORIENTADOR+ |
| POST | `/aws/bedrock/simplify-content` | Simplificar contenido | PROFESOR+ |
| POST | `/aws/textract/extract` | Extraer texto de documento | ORIENTADOR+ |

### 🏥 Health Check

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| GET | `/health` | Estado del servidor | No |
| GET | `/health/db` | Estado de base de datos | No |
| GET | `/health/aws` | Estado servicios AWS | No |

---

## 👥 Sistema de Roles (RBAC)

### Jerarquía de Roles
```
ADMIN
  └── DIRECTOR_CENTRO
      └── ORIENTADOR
          └── PROFESOR
              └── ESTUDIANTE_FAMILIA
```

### Permisos por Rol

| Acción | ADMIN | DIRECTOR | ORIENTADOR | PROFESOR | FAMILIA |
|--------|-------|----------|------------|----------|---------|
| Ver todos los estudiantes | ✅ | ✅ | ✅ | ✅ | ❌ |
| Crear PEIs | ✅ | ❌ | ✅ | ❌ | ❌ |
| Editar PEIs | ✅ | ❌ | ✅ | ❌ | ❌ |
| Ver PEIs | ✅ | ✅ | ✅ | ✅ | ✅* |
| Subir informes médicos | ✅ | ❌ | ✅ | ❌ | ❌ |
| Gestionar usuarios | ✅ | ✅** | ❌ | ❌ | ❌ |

*Solo su propio PEI  
**Solo usuarios de su centro

---

## 📁 Estructura del Proyecto

```
neuroplan-backend/
├── src/
│   ├── auth/                 # Módulo de autenticación
│   │   ├── dto/             # Data Transfer Objects
│   │   ├── guards/          # Guards de autenticación
│   │   ├── strategies/      # Passport strategies
│   │   └── auth.service.ts
│   ├── users/               # Módulo de usuarios
│   │   ├── dto/
│   │   ├── entities/
│   │   └── users.service.ts
│   ├── students/            # Módulo de estudiantes
│   │   ├── dto/
│   │   ├── entities/
│   │   └── students.service.ts
│   ├── peis/                # Módulo de PEIs
│   │   ├── dto/
│   │   ├── entities/
│   │   └── peis.service.ts
│   ├── aws/                 # Integración AWS
│   │   ├── bedrock/        # Claude AI
│   │   └── textract/       # OCR documentos
│   ├── common/              # Utilidades compartidas
│   │   ├── decorators/     # Decoradores personalizados
│   │   ├── filters/        # Exception filters
│   │   ├── guards/         # Guards globales
│   │   ├── interceptors/   # Interceptors
│   │   └── pipes/          # Validation pipes
│   ├── config/              # Configuración
│   │   ├── database.config.ts
│   │   ├── aws.config.ts
│   │   └── jwt.config.ts
│   └── main.ts              # Entry point
├── prisma/
│   ├── schema.prisma        # Modelo de datos
│   ├── migrations/          # Migraciones
│   └── seed.ts              # Datos iniciales
├── test/                    # Tests E2E
├── .env.example             # Template variables de entorno
├── docker-compose.yml       # Contenedores Docker
├── package.json
└── tsconfig.json
```

---

## 🗄️ Modelo de Datos (Prisma)

### Entidades Principales

```prisma
model User {
  id          String   @id @default(uuid())
  email       String   @unique
  password    String
  name        String
  role        Role     @default(PROFESOR)
  centroId    String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  students    Student[]
  peis        PEI[]
}

model Student {
  id              String   @id @default(uuid())
  name            String
  dateOfBirth     DateTime
  diagnosis       String[]
  learningStyle   String?
  accessibility   Json?
  
  userId          String
  user            User     @relation(fields: [userId], references: [id])
  
  peis            PEI[]
  reports         Report[]
}

model PEI {
  id              String   @id @default(uuid())
  title           String
  content         Json
  status          PEIStatus @default(DRAFT)
  generatedBy     String   // "AI" | "MANUAL"
  
  studentId       String
  student         Student  @relation(fields: [studentId], references: [id])
  
  createdById     String
  createdBy       User     @relation(fields: [createdById], references: [id])
  
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
}

enum Role {
  ADMIN
  DIRECTOR_CENTRO
  ORIENTADOR
  PROFESOR
  ESTUDIANTE_FAMILIA
}

enum PEIStatus {
  DRAFT
  ACTIVE
  COMPLETED
  ARCHIVED
}
```

---

## 🧪 Testing

### Ejecutar Tests
```bash
# Tests unitarios
npm run test

# Tests e2e
npm run test:e2e

# Coverage
npm run test:cov

# Watch mode
npm run test:watch
```

### Estructura de Tests
```
test/
├── unit/
│   ├── auth.service.spec.ts
│   ├── users.service.spec.ts
│   └── peis.service.spec.ts
├── integration/
│   ├── auth.controller.spec.ts
│   └── peis.controller.spec.ts
└── e2e/
    ├── auth.e2e-spec.ts
    └── peis.e2e-spec.ts
```

### Métricas Actuales
- **Cobertura**: 68% (objetivo: 85%)
- **Tests implementados**: 47 pruebas
- **Tasa de éxito**: 91.5%

---

## 🐳 Docker

### Desarrollo con Docker Compose
```bash
# Levantar servicios
docker-compose up -d

# Ver logs
docker-compose logs -f

# Detener servicios
docker-compose down
```

### Servicios incluidos:
- **PostgreSQL** (puerto 5432)
- **Redis** (puerto 6379)
- **Backend API** (puerto 3001)
- **Adminer** (puerto 8080) - GUI para PostgreSQL

---

## 🔐 Seguridad

### Implementaciones de Seguridad

#### ✅ Autenticación y Autorización
- JWT con refresh tokens
- RBAC (Role-Based Access Control)
- Password hashing con bcrypt (salt rounds: 10)
- Rate limiting (100 requests/15min por IP)

#### ✅ Validación de Datos
- DTOs con class-validator
- Sanitización de inputs
- Validación de tipos con TypeScript
- Whitelist en todas las peticiones

#### ✅ Protección API
- CORS configurado
- Helmet (headers de seguridad)
- CSRF protection
- SQL injection prevention (Prisma ORM)

#### 🔄 En Desarrollo
- 2FA (Autenticación de dos factores)
- Logs de auditoría
- Encriptación de datos sensibles en BD
- Rate limiting por usuario

### Variables de Entorno Sensibles

> ⚠️ **CRÍTICO**: Nunca exponer estas variables en repositorios públicos

```env
# ❌ NUNCA COMMITEAR
JWT_SECRET=
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
DATABASE_URL=

# ✅ Usar servicios de secretos en producción
# AWS Secrets Manager, Azure Key Vault, HashiCorp Vault
```

---

## 📊 Roadmap del Proyecto

### 🎯 Fase 1: MVP Core (En Progreso - 70%)
- [x] Sistema de autenticación JWT
- [x] RBAC con 5 roles
- [x] CRUD de usuarios y estudiantes
- [x] Integración AWS Bedrock (Claude)
- [x] Integración AWS Textract
- [x] Generación básica de PEIs
- [ ] Exportación PDF de PEIs
- [ ] Sistema de notificaciones
- [ ] Logs de auditoría

### 🚀 Fase 2: Refactorización (Q1 2025)
- [ ] Implementación de CQRS
- [ ] Event Sourcing para PEIs
- [ ] Caché con Redis
- [ ] Optimización de queries
- [ ] Cobertura de tests al 85%
- [ ] Documentación Swagger completa

### 📈 Fase 3: Escalabilidad (Q2 2025)
- [ ] Microservicios (separar módulos)
- [ ] Message Queue (RabbitMQ/SQS)
- [ ] GraphQL API
- [ ] WebSockets para tiempo real
- [ ] Multi-tenancy completo
- [ ] Métricas y monitoring (Prometheus)

---

## 📚 Documentación Adicional

- 📖 [Guía de Desarrollo](./docs/DEVELOPMENT.md)
- 🏗️ [Arquitectura del Sistema](./docs/ARCHITECTURE.md)
- 🔌 [API Reference (Swagger)](http://localhost:3001/api/docs)
- 🗄️ [Modelo de Datos](./docs/DATABASE.md)
- 🔐 [Guía de Seguridad](./docs/SECURITY.md)
- 🧪 [Testing Guidelines](./docs/TESTING.md)
- 🐳 [Docker Setup](./docs/DOCKER.md)

---

## 🤝 Contribuir al Proyecto

> ⚠️ **Proyecto Privado**: Actualmente en fase MVP. Contribuciones por invitación.

### Para desarrolladores autorizados:

1. **Fork** del repositorio
2. Crear rama feature: `git checkout -b feature/nueva-funcionalidad`
3. Commit cambios: `git commit -m 'feat: nueva funcionalidad'`
4. Push a la rama: `git push origin feature/nueva-funcionalidad`
5. Crear **Pull Request**

### Convenciones de Código
- **Commits**: [Conventional Commits](https://www.conventionalcommits.org/)
  - `feat:` Nueva funcionalidad
  - `fix:` Corrección de bugs
  - `docs:` Documentación
  - `refactor:` Refactorización de código
  - `test:` Tests
  - `chore:` Tareas de mantenimiento
- **Ramas**: `feature/`, `bugfix/`, `hotfix/`, `refactor/`
- **TypeScript estricto**: Sin `any` (usar `unknown` si es necesario)
- **Tests obligatorios**: Para nuevas features

### Code Review Checklist
- [ ] Tests unitarios añadidos
- [ ] DTOs validados
- [ ] Documentación actualizada
- [ ] Sin errores de ESLint
- [ ] Migraciones de BD incluidas (si aplica)
- [ ] Variables de entorno documentadas

---

## 🐛 Reporte de Bugs

Para reportar issues o bugs:

1. Verificar que no exista un issue similar
2. Crear nuevo issue con el template proporcionado
3. Incluir:
   - Versión de Node.js y npm
   - Sistema operativo
   - Pasos para reproducir
   - Comportamiento esperado vs actual
   - Logs relevantes

---

## 📄 Licencia

**Propiedad Privada** - Todos los derechos reservados.

Este software es confidencial y solo puede ser utilizado por personal autorizado del proyecto NeuroPlan AI Campus.

---

## 👨‍💻 Equipo de Desarrollo

**NeuroPlan AI Campus Team**

- **Mariana Marín** - Desarrollo Full Stack
- **Eva Sisalli Guzmán** - Desarrollo Full Stack

---

## 📞 Soporte Técnico

Para consultas técnicas o problemas:

- 📧 Email: [e.sisalli@yahoo.com]
-


---

## 🌟 Agradecimientos

Desarrollado con ❤️ para la **educación inclusiva** en España.

*Alineado con LOMLOE y comprometidos con la accesibilidad universal.*

---

## 🔗 Enlaces Relacionados

- [Frontend Repository](../neuroplan-frontend)
- [Documentación Técnica](./docs/)
- [Changelog](./CHANGELOG.md)

---

**Última actualización**: Octubre 2025  
**Versión**: MVP v0.1 (Alpha)  
**Estado**: 🔄 En desarrollo activo

---

<div align="center">

**[🏠 Volver al Inicio](#-neuroplan-ai-campus---backend-api)** • **[📖 Documentación](./docs/)** • **[🐛 Issues](./issues/)**

</div>
