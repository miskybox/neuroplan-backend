import axios from "axios";

// Normaliza la base URL para asegurar el sufijo /api
function getNormalizedBaseUrl(): string {
  const raw = (
    import.meta.env.VITE_API_BASE_URL || "http://localhost:3001"
  ).replace(/\/+$/, "");
  return raw.endsWith("/api") ? raw : `${raw}/api`;
}

// Configuración base de axios
const api = axios.create({
  baseURL: getNormalizedBaseUrl(),
  timeout: Number.parseInt(import.meta.env.VITE_API_TIMEOUT || "60000"), // 60 segundos para análisis con IA
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor para requests (agregar token si existe)
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    let errorMessage = "Unknown error";
    if (error instanceof Error) {
      return Promise.reject(error);
    }
    if (typeof error === "string") {
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
    // Log detallado de errores para debugging
    console.error("❌ API Error:", {
      status: error.response?.status,
      url: error.config?.url,
      method: error.config?.method,
      message: error.response?.data?.message || error.message,
    });

    // Manejo especial de errores 401 (Unauthorized)
    if (error.response?.status === 401) {
      const url = error.config?.url || "";

      // NO hacer logout en endpoints de uploads, análisis o generación
      const isProtectedEndpoint =
        url.includes("/uploads") ||
        url.includes("/pdf-analysis") ||
        url.includes("/generate-pdf-report");

      if (!isProtectedEndpoint) {
        console.warn("⚠️ Token inválido o expirado - Redirigiendo a login");
        localStorage.removeItem("authToken");
        globalThis.location.href = "/login";
      } else {
        console.error("❌ Error de autenticación en endpoint protegido:", url);
      }
    }

    // Manejo de errores de red (timeout, sin conexión)
    if (error.code === "ECONNABORTED" || error.message.includes("timeout")) {
      console.error("⏱️ Timeout - La petición tardó demasiado");
      error.message =
        "La petición tardó demasiado. Intenta con un archivo más pequeño.";
    } else if (error.code === "ERR_NETWORK" || !error.response) {
      console.error("🌐 Error de red - Backend no responde");
      error.message =
        "No se puede conectar con el servidor. Verifica que el backend esté corriendo.";
    }

    return Promise.reject(error);
  }
);

export default api;
