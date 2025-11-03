import { useState } from 'react';
import api from '@/services/api';
import { AxiosRequestConfig, AxiosError } from 'axios';

type ExecResponse<T> = { success: boolean; data: T };

export const useApiRequest = (endpoint: string) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Ejecuta una petición HTTP usando axios
   *
   * @param bodyOrOptions - Datos para POST/PUT (puede ser FormData o JSON)
   * @param config - Configuración adicional de axios (opcional)
   * @returns Respuesta con { success, data }
   */
  async function execute<T = any>(
    bodyOrOptions?: any,
    config?: AxiosRequestConfig
  ): Promise<ExecResponse<T>> {
    setLoading(true);
    setError(null);

    try {
      const method = config?.method || 'POST';
      let response;

      // Determinar si es FormData o JSON
      if (bodyOrOptions instanceof FormData) {
        response = await api.request<T>({
          url: endpoint,
          method,
          data: bodyOrOptions,
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          ...config,
        });
      } else {
        response = await api.request<T>({
          url: endpoint,
          method,
          data: bodyOrOptions,
          ...config,
        });
      }

      return { success: true, data: response.data };
    } catch (err) {
      const axiosError = err as AxiosError;
      const errorMessage =
        (axiosError.response?.data as any)?.message ||
        axiosError.message ||
        'Error en la petición';

      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }

  return { loading, error, execute };
};
