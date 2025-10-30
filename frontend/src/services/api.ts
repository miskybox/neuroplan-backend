import axios from 'axios';

// Normaliza la base URL para asegurar el sufijo /api
function getNormalizedBaseUrl(): string {
  const raw = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001').replace(/\/+$/, '');
  return raw.endsWith('/api') ? raw : `${raw}/api`;
}

// Configuración base de axios
const api = axios.create({
  baseURL: getNormalizedBaseUrl(),
  timeout: Number.parseInt(import.meta.env.VITE_API_TIMEOUT || '10000'),
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para requests (agregar token si existe)
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    let errorMessage = 'Unknown error';
    if (error instanceof Error) {
      return Promise.reject(error);
    }
    if (typeof error === 'string') {
      errorMessage = error;
    } else if (error?.message) {
      errorMessage = error.message;
    }
    return Promise.reject(new Error(errorMessage));
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expirado o inválido
      localStorage.removeItem('authToken');
      globalThis.location.href = '/login';
    }
    let errorMessage = 'Unknown error';
    if (error instanceof Error) {
      return Promise.reject(error);
    }
    if (typeof error === 'string') {
      errorMessage = error;
    } else if (error?.message) {
      errorMessage = error.message;
    }
    return Promise.reject(new Error(errorMessage));
  }
);

export default api;