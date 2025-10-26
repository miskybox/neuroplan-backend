import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Brain, ArrowRight } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin mx-auto" />
          <p className="text-muted-foreground">Verificando autenticación...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="max-w-md mx-auto">
          <Card className="shadow-elegant">
            <CardContent className="pt-6 text-center space-y-6">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                <Brain className="h-8 w-8 text-primary" />
              </div>
              
              <div className="space-y-2">
                <h2 className="text-2xl font-bold">Acceso restringido</h2>
                <p className="text-muted-foreground">
                  Necesitas iniciar sesión para acceder a tu Perfil NeuroAcadémico
                </p>
              </div>
              
              <div className="space-y-3">
                <Link to="/login" state={{ from: location }}>
                  <Button className="w-full bg-gradient-hero">
                    Iniciar sesión
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
                
                <p className="text-sm text-muted-foreground">
                  ¿No tienes cuenta?{' '}
                  <Link to="/registro" className="text-primary hover:underline">
                    Crea tu Perfil NeuroAcadémico
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
