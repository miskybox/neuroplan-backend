import { useState } from 'react';

type ExecResponse<T> = { success: boolean; data: T };

// Normaliza la base para que termine exactamente en /api
function getBaseApi(): string {
  const raw = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001').replace(/\/\/+$/, '');
  return raw.endsWith('/api') ? raw : `${raw}/api`;
}

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

  const url = `${getBaseApi()}${endpoint}`; // ej: http://localhost:3001/api/uploads/pdf-analysis

      // Agregar token de autenticación si existe
      const token = localStorage.getItem('authToken');
      if (token && !(headers as any)['Authorization']) {
        (headers as any)['Authorization'] = `Bearer ${token}`;
      }

      const res = await fetch(url, {
        method: options?.method || 'POST',
        body,
        headers,
      });

      if (!res.ok) {
        let errorMessage = 'Error en la petición';
        try {
          const errorData = await res.json();
          errorMessage = errorData.message || errorData.error || errorMessage;
        } catch {
          errorMessage = `Error ${res.status}: ${res.statusText}`;
        }
        setError(errorMessage);
        throw new Error(errorMessage);
      }

      const contentType = res.headers.get('content-type') || '';
      const parsed = contentType.includes('application/json') ? await res.json() : await res.text();

      return { success: res.ok, data: parsed as T };
    } catch (err: any) {
      const msg = err?.message || 'Error de red';
      setError(msg);
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  }

  return { loading, error, execute };
};
