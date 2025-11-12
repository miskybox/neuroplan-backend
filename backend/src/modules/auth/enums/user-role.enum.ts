/**
 * Enum para los roles de usuario en el sistema NeuroPlan
 *
 * @see ROLES_AND_PERMISSIONS.md para más detalles sobre permisos
 */
export enum UserRole {
  /**
   * Director del centro educativo
   * - Puede crear, editar y eliminar usuarios
   * - Ver todos los alumnos y sus PEIs
   * - Editar la información del centro
   * - Consultar estadísticas y reportes globales
   */
  DIRECTOR_CENTRO = 'DIRECTOR_CENTRO',

  /**
   * Profesor
   * - Ver todos los alumnos del centro
   * - Crear, editar y consultar PEIs
   * - Añadir observaciones pedagógicas
   */
  PROFESOR = 'PROFESOR',

  /**
   * Tutor
   * - Ver todos los alumnos del centro
   * - Crear, editar y consultar PEIs
   * - Añadir informes y planes de apoyo
   */
  TUTOR = 'TUTOR',

  /**
   * Orientador educativo
   * - Ver todos los alumnos del centro
   * - Crear, editar y consultar PEIs
   * - Subir informes psicopedagógicos y diagnósticos
   * - Recomendar adaptaciones curriculares
   */
  ORIENTADOR = 'ORIENTADOR',

  /**
   * Alumno
   * - Ver su propio PEI y su progreso académico
   */
  ALUMNO = 'ALUMNO',

  /**
   * Padre o tutor legal
   * - Ver el PEI y los avances de su hijo o hija
   * - Consultar observaciones del tutor o del orientador
   */
  PADRE_TUTOR = 'PADRE_TUTOR',
}

/**
 * Roles que tienen permiso para gestionar PEIs de todos los alumnos
 */
export const PEI_MANAGEMENT_ROLES = [
  UserRole.DIRECTOR_CENTRO,
  UserRole.PROFESOR,
  UserRole.TUTOR,
  UserRole.ORIENTADOR,
];

/**
 * Roles que tienen permiso para ver todos los alumnos del centro
 */
export const VIEW_ALL_STUDENTS_ROLES = [
  UserRole.DIRECTOR_CENTRO,
  UserRole.PROFESOR,
  UserRole.TUTOR,
  UserRole.ORIENTADOR,
];

/**
 * Roles que pueden crear/eliminar usuarios
 */
export const USER_MANAGEMENT_ROLES = [
  UserRole.DIRECTOR_CENTRO,
];

/**
 * Roles que tienen acceso limitado (solo sus propios datos)
 */
export const LIMITED_ACCESS_ROLES = [
  UserRole.ALUMNO,
  UserRole.PADRE_TUTOR,
];

/**
 * Roles que pueden subir informes médicos/psicopedagógicos
 */
export const UPLOAD_REPORTS_ROLES = [
  UserRole.DIRECTOR_CENTRO,
  UserRole.TUTOR,
  UserRole.ORIENTADOR,
];

/**
 * Roles que pueden editar la información del centro
 */
export const CENTER_MANAGEMENT_ROLES = [
  UserRole.DIRECTOR_CENTRO,
];

/**
 * Roles que pueden ver estadísticas globales
 */
export const VIEW_STATS_ROLES = [
  UserRole.DIRECTOR_CENTRO,
];
