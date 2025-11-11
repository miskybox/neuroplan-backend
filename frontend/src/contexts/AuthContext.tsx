import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useMemo,
} from "react";
import { authService } from "../services/neuroplanApi";
import type { AuthUser } from "../services/neuroplanApi";
import { logger } from "@/utils/logger";

interface User {
  id: string;
  email: string;
  nombre: string;
  apellidos: string;
  perfilNeuroAcademico?: {
    nivelActual: string;
    objetivosAcademicos: string;
    fortalezas: string[];
    areasApoyo: string[];
    preferenciasSensoriales: string[];
  };
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Normaliza el usuario de la API (AuthUser) al modelo interno User
  function mapAuthUserToUser(raw: AuthUser): User {
    return {
      id: String(raw.id),
      email: raw.email,
      nombre: raw.firstName || "",
      apellidos: raw.lastName || "",
      // El backend aún no provee perfilNeuroAcademico; se podrá hidratar luego
    };
  }

  // Verificar si hay una sesión guardada al cargar la aplicación
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Verificar si hay un token válido en localStorage
        const savedUser = localStorage.getItem("neuroplan_user");
        const authToken = localStorage.getItem("authToken");

        if (savedUser && authToken) {
          const userData = JSON.parse(savedUser);
          setUser(userData);
        }
      } catch (error) {
        logger.error("Error checking auth:", error);
        localStorage.removeItem("neuroplan_user");
        localStorage.removeItem("authToken");
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);

    // Timeout de seguridad corto (fallback rápido en dev)
    const safetyTimeout = setTimeout(() => {
      logger.warn("Login timeout (8s) - fallback to demo user");
      // Activamos fallback demo si todavía no hay usuario
      if (!user) {
        const demoUser: User = {
          id: "demo-fallback",
          email,
          nombre: "Usuario",
          apellidos: "Demo",
          perfilNeuroAcademico: {
            nivelActual: "Bachillerato",
            objetivosAcademicos: "Acceder a la universidad",
            fortalezas: ["Memoria visual", "Pensamiento lógico"],
            areasApoyo: ["Atención", "Organización"],
            preferenciasSensoriales: ["Visual", "Interactivo"],
          },
        };
        setUser(demoUser);
        localStorage.setItem("neuroplan_user", JSON.stringify(demoUser));
        localStorage.setItem("authToken", "demo_token_" + Date.now());
      }
      setIsLoading(false);
    }, 8000); // 8 segundos

    try {
      // Intentar login con el backend (si está disponible)
      try {
        const response = await authService.login(email, password);
        // authService.login ya hace .then(res => res.data), así que response es el objeto directo
        const token = response.accessToken || response.token;
        if (token && response.user) {
          const mapped = mapAuthUserToUser(response.user);
          localStorage.setItem("authToken", token);
          setUser(mapped);
          localStorage.setItem("neuroplan_user", JSON.stringify(mapped));
          clearTimeout(safetyTimeout);
          return true;
        }
      } catch (backendError) {
        logger.warn(
          "Backend auth not available, using mock login:",
          backendError
        );
      }

      // Fallback manual sólo si no se logró login y no se activó por timeout
      if (!user) {
        await new Promise((resolve) => setTimeout(resolve, 400));
        const demoUser: User = {
          id: "demo-local",
          email,
          nombre: "Usuario",
          apellidos: "Demo",
          perfilNeuroAcademico: {
            nivelActual: "Bachillerato",
            objetivosAcademicos: "Acceder a la universidad",
            fortalezas: ["Memoria visual", "Pensamiento lógico"],
            areasApoyo: ["Atención", "Organización"],
            preferenciasSensoriales: ["Visual", "Interactivo"],
          },
        };
        setUser(demoUser);
        localStorage.setItem("neuroplan_user", JSON.stringify(demoUser));
        localStorage.setItem("authToken", "demo_token_" + Date.now());
        clearTimeout(safetyTimeout);
        return true;
      }
      clearTimeout(safetyTimeout);
      return !!user;
    } catch (error) {
      logger.error("Login error:", error);
      clearTimeout(safetyTimeout);
      return false;
    } finally {
      clearTimeout(safetyTimeout);
      setIsLoading(false);
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    localStorage.removeItem("neuroplan_user");
    localStorage.removeItem("authToken");
  };

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      localStorage.setItem("neuroplan_user", JSON.stringify(updatedUser));
    }
  };

  const value: AuthContextType = useMemo(
    () => ({
      user,
      isAuthenticated: !!user,
      isLoading,
      login,
      logout,
      updateUser,
    }),
    [user, isLoading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
