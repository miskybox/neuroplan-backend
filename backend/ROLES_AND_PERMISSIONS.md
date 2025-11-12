# Roles y Permisos - NeuroPlan MVP

## Roles Disponibles

### 1. DIRECTOR_CENTRO (Director del centro)
**Descripción**: Supervisa y gestiona todo el centro educativo.

**Permisos**:
- ✅ Crear, editar y eliminar usuarios
- ✅ Ver todos los alumnos y sus PEIs
- ✅ Editar la información del centro
- ✅ Consultar estadísticas y reportes globales

**Restricciones**:
- ❌ No puede gestionar otros centros

---

### 2. PROFESOR
**Descripción**: Acompaña el proceso de aprendizaje y colabora en los PEIs.

**Permisos**:
- ✅ Ver todos los alumnos del centro
- ✅ Crear, editar y consultar PEIs
- ✅ Añadir observaciones pedagógicas

**Restricciones**:
- ❌ No puede crear ni eliminar usuarios
- ❌ No puede editar la información del centro

---

### 3. TUTOR
**Descripción**: Coordina el seguimiento académico y los PEIs de los alumnos.

**Permisos**:
- ✅ Ver todos los alumnos del centro
- ✅ Crear, editar y consultar PEIs
- ✅ Añadir informes y planes de apoyo

**Restricciones**:
- ❌ No puede crear ni eliminar usuarios
- ❌ No puede modificar la información del centro

---

### 4. ORIENTADOR (Orientador educativo)
**Descripción**: Realiza valoraciones psicopedagógicas y orienta el itinerario educativo.

**Permisos**:
- ✅ Ver todos los alumnos del centro
- ✅ Crear, editar y consultar PEIs
- ✅ Subir informes psicopedagógicos y diagnósticos
- ✅ Recomendar adaptaciones curriculares

**Restricciones**:
- ❌ No puede crear ni eliminar usuarios
- ❌ No puede modificar la información del centro

---

### 5. ALUMNO
**Descripción**: Consulta su propio plan educativo individual.

**Permisos**:
- ✅ Ver su propio PEI y su progreso académico

**Restricciones**:
- ❌ No puede editar información
- ❌ No puede ver datos de otros alumnos

---

### 6. PADRE_TUTOR (Padres o tutores legales)
**Descripción**: Acompañan el progreso educativo y emocional de su hijo o hija.

**Permisos**:
- ✅ Ver el PEI y los avances de su hijo o hija
- ✅ Consultar observaciones del tutor o del orientador

**Restricciones**:
- ❌ No pueden editar información
- ❌ No pueden ver otros alumnos

---

## Matriz de Permisos

| Permiso | DIRECTOR_CENTRO | PROFESOR | TUTOR | ORIENTADOR | ALUMNO | PADRE_TUTOR |
|---------|----------------|----------|-------|------------|--------|-------------|
| Crear usuarios | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Editar usuarios | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Eliminar usuarios | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Ver todos los alumnos | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ |
| Ver su propio PEI | N/A | N/A | N/A | N/A | ✅ | ✅ |
| Crear PEIs | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ |
| Editar PEIs | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ |
| Ver PEIs | ✅ | ✅ | ✅ | ✅ | ✅ (propio) | ✅ (de su hijo) |
| Añadir observaciones | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ |
| Subir informes | ✅ | ❌ | ✅ | ✅ | ❌ | ❌ |
| Editar info del centro | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Ver estadísticas | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |

---

## Implementación en el Código

### Constantes de Roles

```typescript
export enum UserRole {
  DIRECTOR_CENTRO = 'DIRECTOR_CENTRO',
  PROFESOR = 'PROFESOR',
  TUTOR = 'TUTOR',
  ORIENTADOR = 'ORIENTADOR',
  ALUMNO = 'ALUMNO',
  PADRE_TUTOR = 'PADRE_TUTOR',
}
```

### Uso de Decoradores

```typescript
import { Roles } from '@/modules/auth/decorators/roles.decorator';

@Roles('DIRECTOR_CENTRO')
@Post('users')
createUser() {
  // Solo accesible para DIRECTOR_CENTRO
}

@Roles('PROFESOR', 'TUTOR', 'ORIENTADOR')
@Get('peis')
getAllPEIs() {
  // Accesible para profesores, tutores y orientadores
}
```

---

## Migración de Roles Antiguos

| Rol Antiguo | Rol Nuevo |
|-------------|-----------|
| ADMIN | DIRECTOR_CENTRO |
| ORIENTADOR | ORIENTADOR |
| PROFESOR | PROFESOR |

---

## Notas de Implementación

1. **Director del Centro**: Es el único que puede gestionar usuarios y modificar la configuración del centro.
2. **Profesor, Tutor, Orientador**: Tienen permisos similares sobre PEIs pero con diferentes enfoques (pedagógico, coordinación, psicopedagógico).
3. **Alumno y Padre/Tutor**: Solo tienen acceso de lectura a sus propios datos o los de sus hijos.
4. **Gestión de Centros**: Un director solo puede gestionar su propio centro, no otros centros.

---

## Base de Datos

Los roles se almacenan en la columna `role` de la tabla `users` como tipo ENUM:

```sql
CREATE TYPE user_role AS ENUM (
  'DIRECTOR_CENTRO',
  'PROFESOR',
  'TUTOR',
  'ORIENTADOR',
  'ALUMNO',
  'PADRE_TUTOR'
);
```
