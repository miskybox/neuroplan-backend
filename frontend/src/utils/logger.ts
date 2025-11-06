/**
 * Logger utility con guards de entorno
 * - En desarrollo: todos los niveles (debug, info, warn, error)
 * - En producción: solo warn y error
 *
 * Uso:
 * import { logger } from '@/utils/logger';
 * logger.debug('Mensaje de debug');
 * logger.info('Información general');
 * logger.warn('Advertencia');
 * logger.error('Error', error);
 */

const isDevelopment =
  import.meta.env.MODE === "development" || import.meta.env.DEV;

export const logger = {
  /**
   * Debug: Solo en desarrollo
   * Usar para información muy detallada durante desarrollo
   */
  debug: (...args: any[]): void => {
    if (isDevelopment) {
      console.log("[DEBUG]", ...args);
    }
  },

  /**
   * Info: Solo en desarrollo
   * Usar para información general del flujo de la aplicación
   */
  info: (...args: any[]): void => {
    if (isDevelopment) {
      console.log("[INFO]", ...args);
    }
  },

  /**
   * Warn: Siempre visible
   * Usar para advertencias que deben ser visibles incluso en producción
   */
  warn: (...args: any[]): void => {
    console.warn("[WARN]", ...args);
  },

  /**
   * Error: Siempre visible
   * Usar para errores que deben ser visibles incluso en producción
   */
  error: (...args: any[]): void => {
    console.error("[ERROR]", ...args);
  },
};
