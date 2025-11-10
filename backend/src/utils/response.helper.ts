/**
 * Response Helper
 * Unifica el formato de respuestas API en todo el backend
 * Evita inconsistencias entre controladores
 */

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  timestamp?: string;
}

export class ResponseHelper {
  /**
   * Crea una respuesta exitosa estándar
   * @param data Datos a retornar
   * @param message Mensaje opcional de éxito
   */
  static success<T>(data: T, message?: string): ApiResponse<T> {
    return {
      success: true,
      data,
      ...(message && { message }),
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Crea una respuesta de error estándar
   * @param error Mensaje de error
   * @param data Datos opcionales (ej: validación parcial)
   */
  static error<T = null>(error: string, data?: T): ApiResponse<T> {
    return {
      success: false,
      error,
      ...(data && { data }),
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Crea una respuesta de lista exitosa
   * @param items Array de items
   * @param total Total de items (para paginación)
   * @param message Mensaje opcional
   */
  static list<T>(
    items: T[],
    total?: number,
    message?: string
  ): ApiResponse<{ items: T[]; total?: number }> {
    return {
      success: true,
      data: {
        items,
        ...(total !== undefined && { total }),
      },
      ...(message && { message }),
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Crea una respuesta de creación exitosa
   * @param data Entidad creada
   * @param message Mensaje opcional
   */
  static created<T>(data: T, message?: string): ApiResponse<T> {
    return ResponseHelper.success(
      data,
      message || "Resource created successfully"
    );
  }

  /**
   * Crea una respuesta de actualización exitosa
   * @param data Entidad actualizada
   * @param message Mensaje opcional
   */
  static updated<T>(data: T, message?: string): ApiResponse<T> {
    return ResponseHelper.success(
      data,
      message || "Resource updated successfully"
    );
  }

  /**
   * Crea una respuesta de eliminación exitosa
   * @param message Mensaje opcional
   */
  static deleted(message?: string): ApiResponse<null> {
    return {
      success: true,
      data: null,
      message: message || "Resource deleted successfully",
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Crea una respuesta de no encontrado
   * @param resource Nombre del recurso no encontrado
   */
  static notFound(resource: string = "Resource"): ApiResponse<null> {
    return ResponseHelper.error(`${resource} not found`);
  }

  /**
   * Crea una respuesta de validación fallida
   * @param errors Errores de validación
   */
  static validationError(errors: string | string[]): ApiResponse<null> {
    const errorMessage = Array.isArray(errors) ? errors.join(", ") : errors;
    return ResponseHelper.error(`Validation failed: ${errorMessage}`);
  }

  /**
   * Crea una respuesta de no autorizado
   * @param message Mensaje opcional
   */
  static unauthorized(
    message: string = "Unauthorized access"
  ): ApiResponse<null> {
    return ResponseHelper.error(message);
  }

  /**
   * Crea una respuesta de prohibido
   * @param message Mensaje opcional
   */
  static forbidden(message: string = "Access forbidden"): ApiResponse<null> {
    return ResponseHelper.error(message);
  }
}
