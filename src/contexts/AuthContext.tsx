import React, { createContext, useContext, useState, useEffect, ReactNode, useMemo } from 'react';
import { authService } from '../services/neuroplanApi';

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

  // Verificar si hay una sesión guardada al cargar la aplicación
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Verificar si hay un token válido en localStorage
        const savedUser = localStorage.getItem('neuroplan_user');
        const authToken = localStorage.getItem('authToken');
        
        if (savedUser && authToken) {
          const userData = JSON.parse(savedUser);
          setUser(userData);
        }
      } catch (error) {
        console.error('Error checking auth:', error);
        localStorage.removeItem('neuroplan_user');
        localStorage.removeItem('authToken');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      // Intentar login con el backend (si está disponible)
      try {
        const response = await authService.login(email, password);
        
        // Si el backend responde correctamente
        if (response.data.token && response.data.user) {
          localStorage.setItem('authToken', response.data.token);
          setUser(response.data.user);
          localStorage.setItem('neuroplan_user', JSON.stringify(response.data.user));
          return true;
        }
      } catch (backendError) {
        console.warn('Backend auth not available, using mock login:', backendError);
      }
      
      // Fallback: Simulamos login para demo (cuando backend no esté disponible)
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simular datos de usuario para demo
      const userData: User = {
        id: '1',
        email,
        nombre: 'Usuario',
        apellidos: 'Demo',
        perfilNeuroAcademico: {
          nivelActual: 'Bachillerato',
          objetivosAcademicos: 'Acceder a la universidad',
          fortalezas: ['Memoria visual', 'Pensamiento lógico'],
          areasApoyo: ['Atención', 'Organización'],
          preferenciasSensoriales: ['Visual', 'Interactivo']
        }
      };
      
      setUser(userData);
      localStorage.setItem('neuroplan_user', JSON.stringify(userData));
      localStorage.setItem('authToken', 'demo_token_' + Date.now());
      
      return true;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    localStorage.removeItem('neuroplan_user');
  };

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      localStorage.setItem('neuroplan_user', JSON.stringify(updatedUser));
    }
  };

  const value: AuthContextType = useMemo(() => ({
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    updateUser,
  }), [user, isLoading]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
