import axios from "axios";

// Dispara un evento global para que la UI muestre mensajes accesibles
function emitApiMessage(detail: {
  type: "error" | "info";
  message: string;
  code?: string;
  status?: number;
}) {
  try {
    globalThis.dispatchEvent(new CustomEvent("api-message", { detail }));
  } catch {
    // silencioso: evita romper en SSR o entornos sin window
  }
}

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
  withCredentials: true,  // ✅ Enviar cookies automáticamente
});

// Interceptor para requests - Ya no necesitamos manejar tokens manualmente
// Las cookies httpOnly se envían automáticamente
api.interceptors.request.use(
  (config) => {
    // Las cookies se envían automáticamente por withCredentials: true
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

// Helper: verifica si la URL es un endpoint protegido de operaciones largas
function isProtectedEndpoint(url: string): boolean {
  return (
    url.includes("/uploads") ||
    url.includes("/pdf-analysis") ||
    url.includes("/generate-pdf-report")
  );
}

// Endpoints de autenticación (no deben redirigir automáticamente en 401)
function isAuthEndpoint(url: string): boolean {
  return url.includes("/auth/");
}

// Helper: maneja errores de red
function handleNetworkError(url: string): {
  userMessage: string;
  code: string;
} {
  if (isProtectedEndpoint(url)) {
    console.error("❌ Error de autenticación en endpoint protegido:", url);
  } else {
    console.warn("⚠️ Error de red - Redirigiendo a login");
    // Ya no necesitamos limpiar localStorage, las cookies se limpian automáticamente
    globalThis.location.href = "/login";
  }
  return {
    userMessage:
      "No se puede conectar con el servidor. Verifica que el backend esté activo.",
    code: "NETWORK_ERROR",
  };
}

// Variable para evitar múltiples refreshes simultáneos
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: any) => void;
}> = [];

const processQueue = (error: any = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve();
    }
  });
  failedQueue = [];
};

// Helper: maneja errores de autenticación con refresh token
async function handleUnauthorizedError(
  url: string,
  userMessage: string,
  code: string,
  status: number,
  originalConfig: any
): Promise<any> {
  // En endpoints de auth dejamos que la UI maneje el error (no redirigir)
  if (isAuthEndpoint(url)) {
    emitApiMessage({ type: "error", message: userMessage, code, status });
    return Promise.reject(new Error(userMessage));
  }

  // Si es un 401 y no es el endpoint de refresh, intentar renovar el token
  if (status === 401 && !url.includes('/auth/refresh')) {
    if (!isRefreshing) {
      isRefreshing = true;

      try {
        // Intentar renovar el access token usando el refresh token
        await api.post('/auth/refresh');

        // Token renovado exitosamente
        isRefreshing = false;
        processQueue();

        // Reintentar la petición original
        return api(originalConfig);
      } catch (refreshError) {
        // Refresh token inválido o expirado, redirigir a login
        isRefreshing = false;
        processQueue(refreshError);

        emitApiMessage({
          type: "error",
          message: "Sesión expirada. Por favor, inicia sesión nuevamente.",
          code: "SESSION_EXPIRED",
          status: 401
        });

        globalThis.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    // Si ya se está refrescando, encolar esta petición
    return new Promise((resolve, reject) => {
      failedQueue.push({ resolve, reject });
    }).then(() => {
      // Una vez refrescado el token, reintentar
      return api(originalConfig);
    }).catch((err) => {
      return Promise.reject(err);
    });
  }

  // Para otros casos de 401, redirigir a login
  if (!isProtectedEndpoint(url)) {
    emitApiMessage({ type: "error", message: userMessage, code, status });
    globalThis.location.href = "/login";
  }

  return Promise.reject(new Error(userMessage));
}

// Helper: mapea código de estado HTTP a mensaje y código de error
function mapStatusToError(
  status: number | undefined,
  backendMessage: string | undefined
): { userMessage: string; code: string } {
  if (status === 400) {
    return {
      code: "BAD_REQUEST",
      userMessage: backendMessage || "Datos inválidos. Revisa el formulario.",
    };
  }
  if (status === 401) {
    return {
      code: "UNAUTHORIZED",
      userMessage: "Sesión no válida o expirada. Inicia sesión nuevamente.",
    };
  }
  if (status === 403) {
    return {
      code: "FORBIDDEN",
      userMessage: "No tienes permisos para realizar esta acción.",
    };
  }
  if (status === 404) {
    return {
      code: "NOT_FOUND",
      userMessage: "Recurso no encontrado.",
    };
  }
  if (status === 409) {
    return {
      code: "CONFLICT",
      userMessage: backendMessage || "Conflicto con datos existentes.",
    };
  }
  if (status === 422) {
    return {
      code: "UNPROCESSABLE",
      userMessage: backendMessage || "Datos enviados no procesables.",
    };
  }
  if (status && status >= 500) {
    return {
      code: "SERVER_ERROR",
      userMessage: "Error interno. Intenta más tarde.",
    };
  }
  return {
    code: "UNKNOWN",
    userMessage: backendMessage || "Ocurrió un error inesperado.",
  };
}

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const url = error.config?.url || "";
    const status = error.response?.status;
    const backendMessage = error.response?.data?.message;
    let userMessage: string;
    let code: string;

    if (error.code === "ERR_NETWORK" || !error.response) {
      const result = handleNetworkError(url);
      userMessage = result.userMessage;
      code = result.code;
    } else if (
      error.code === "ECONNABORTED" ||
      error.message?.includes("timeout")
    ) {
      userMessage =
        "La solicitud excedió el tiempo. Prueba de nuevo o usa un archivo más pequeño.";
      code = "TIMEOUT";
    } else {
      const result = mapStatusToError(status, backendMessage);
      userMessage = result.userMessage;
      code = result.code;

      // Si es un 401, intentar refresh token automáticamente
      if (status === 401) {
        try {
          return await handleUnauthorizedError(url, userMessage, code, status, error.config);
        } catch (refreshError) {
          // Si el refresh falla, continuar con el flujo de error normal
          return Promise.reject(error);
        }
      }
    }

    // Log estructurado (no se reemplaza por logger aún para mantener simplicidad en FE)
    console.error("❌ API Error", {
      status,
      url,
      method: error.config?.method,
      backendMessage,
      mappedMessage: userMessage,
      code,
    });

    // Adjuntar mensaje amigable para capas superiores
    if (!error.response) {
      error.response = { status, data: {} };
    }
    if (!error.response.data) {
      error.response.data = {};
    }
    error.response.data.userMessage = userMessage;
    error.response.data.code = code;

    // Emitir evento global (UI puede mostrar banner/toast accesible)
    emitApiMessage({ type: "error", message: userMessage, code, status });

    return Promise.reject(error);
  }
);

export default api;
