
import { useState } from 'react';

type ExecResponse<T> = { success: boolean; data: T };

const API_BASE = import.meta.env.VITE_API_BASE_URL?.replace(/\/+$/, '') || 'http://localhost:3001';
const API_PREFIX = '/api'; // Restauramos el prefijo /api ya que el backend lo usa

export const useApiRequest = (endpoint: string) => {
  const [loading, setLoading] = useState(false);
  const [error, setError]   = useState<string | null>(null);

  /**
   * Permite enviar JSON, FormData o texto plano.
   * Uso:
   *   const { execute } = useApiRequest('/uploads/pdf-analysis');
   *   await execute(formData)                       // FormData
   *   await execute({ foo: 'bar' })                // JSON
   *   await execute('texto plano', { method: 'POST' })
   */
  async function execute<T = any>(
    bodyOrOptions?: FormData | BodyInit | object,
    options?: RequestInit
  ): Promise<ExecResponse<T>> {
    setLoading(true);
    setError(null);

    try {
      let body: BodyInit | undefined;
      let headers: HeadersInit = options?.headers || {};

      if (bodyOrOptions instanceof FormData) {
        body = bodyOrOptions; // el navegador setea el boundary
      } else if (typeof bodyOrOptions === 'object' && bodyOrOptions !== null) {
        body = JSON.stringify(bodyOrOptions);
        headers = { 'Content-Type': 'application/json', ...headers };
      } else if (typeof bodyOrOptions === 'string') {
        body = bodyOrOptions;
      }

      const url = `${API_BASE}${API_PREFIX}${endpoint}`; // ej: http://localhost:3001/api/uploads/pdf-analysis

      const res = await fetch(url, {
        method: options?.method || 'POST',
        body,
        headers,
      });

      const contentType = res.headers.get('content-type') || '';
      const parsed = contentType.includes('application/json') ? await res.json() : await res.text();

      return { success: res.ok, data: parsed as T };
    } catch (err: any) {
      setError(err?.message || 'Error de red');
      throw err;
    } finally {
      setLoading(false);
    }
  }

  return { loading, error, execute };
};
