import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Brain, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowRight,
  GraduationCap,
  Sparkles,
  AlertCircle,
  CheckCircle2
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface LoginFormData {
  email: string;
  password: string;
  rememberMe: boolean;
}

const Login = () => {
  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
    rememberMe: false,
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const { toast } = useToast();
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();

  const handleInputChange = (field: keyof LoginFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validaciones básicas
    if (!formData.email || !formData.password) {
      toast({
        title: "Error",
        description: "Por favor, completa todos los campos",
        variant: "destructive",
      });
      return;
    }

    if (!formData.email.includes("@")) {
      toast({
        title: "Error",
        description: "Por favor, introduce un email válido",
        variant: "destructive",
      });
      return;
    }

    // Intentar login usando el contexto
    const success = await login(formData.email, formData.password);
    
    if (success) {
      toast({
        title: "¡Bienvenido de vuelta!",
        description: "Has iniciado sesión correctamente en tu Perfil NeuroAcadémico",
      });
      
      // Redirigir al dashboard
      navigate("/dashboard");
    } else {
      toast({
        title: "Error de autenticación",
        description: "Email o contraseña incorrectos. Inténtalo de nuevo.",
        variant: "destructive",
      });
    }
  };

  const handleForgotPassword = () => {
    toast({
      title: "Recuperación de contraseña",
      description: "Se ha enviado un enlace de recuperación a tu email",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container py-12">
        <div className="max-w-md mx-auto">
          {/* Header */}
          <div className="text-center space-y-4 mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium">
              <Brain className="h-4 w-4" />
              <span>Acceso a tu Perfil NeuroAcadémico</span>
            </div>
            
            <h1 className="text-3xl md:text-4xl font-bold">
              Inicia sesión en{" "}
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                NeuroPlan AI Campus
              </span>
            </h1>
            
            <p className="text-lg text-muted-foreground">
              Accede a tu itinerario personalizado y continúa tu camino hacia la titulación oficial
            </p>
          </div>

          {/* Login Card */}
          <Card className="shadow-elegant">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 rounded-full bg-gradient-hero flex items-center justify-center mb-4">
                <GraduationCap className="h-8 w-8 text-primary-foreground" />
              </div>
              <CardTitle className="text-2xl">Bienvenido de vuelta</CardTitle>
              <CardDescription>
                Inicia sesión para acceder a tu Perfil NeuroAcadémico y continuar tu aprendizaje
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      placeholder="tu@email.com"
                      className="pl-10"
                      disabled={isLoading}
                    />
                  </div>
                </div>
                
                {/* Password */}
                <div className="space-y-2">
                  <Label htmlFor="password">Contraseña</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={(e) => handleInputChange("password", e.target.value)}
                      placeholder="Tu contraseña"
                      className="pl-10 pr-10"
                      disabled={isLoading}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={isLoading}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
                
                {/* Remember me & Forgot password */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="rememberMe"
                      checked={formData.rememberMe}
                      onCheckedChange={(checked) => handleInputChange("rememberMe", checked)}
                      disabled={isLoading}
                    />
                    <Label htmlFor="rememberMe" className="text-sm">
                      Recordarme
                    </Label>
                  </div>
                  
                  <Button
                    type="button"
                    variant="link"
                    size="sm"
                    onClick={handleForgotPassword}
                    disabled={isLoading}
                    className="text-primary hover:text-primary/80"
                  >
                    ¿Olvidaste tu contraseña?
                  </Button>
                </div>
                
                {/* Submit Button */}
                <Button
                  type="submit"
                  className="w-full bg-gradient-hero hover:opacity-90"
                  size="lg"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Iniciando sesión...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      Iniciar sesión
                      <ArrowRight className="h-4 w-4" />
                    </div>
                  )}
                </Button>
              </form>
              
            </CardContent>
          </Card>
          
          {/* Register Link */}
          <div className="text-center mt-6">
            <p className="text-muted-foreground">
              ¿No tienes cuenta?{" "}
              <Link 
                to="/registro" 
                className="text-primary hover:text-primary/80 font-medium transition-colors"
              >
                Crea tu Perfil NeuroAcadémico
              </Link>
            </p>
          </div>
          
          {/* Features Preview */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center space-y-2 p-4 rounded-lg bg-muted/30">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                <Brain className="h-4 w-4 text-primary" />
              </div>
              <h3 className="font-medium text-sm">PEI Engine</h3>
              <p className="text-xs text-muted-foreground">Perfil personalizado</p>
            </div>
            
            <div className="text-center space-y-2 p-4 rounded-lg bg-muted/30">
              <div className="w-8 h-8 rounded-full bg-secondary/10 flex items-center justify-center mx-auto">
                <GraduationCap className="h-4 w-4 text-secondary" />
              </div>
              <h3 className="font-medium text-sm">Learning Engine</h3>
              <p className="text-xs text-muted-foreground">Contenido adaptativo</p>
            </div>
            
            <div className="text-center space-y-2 p-4 rounded-lg bg-muted/30">
              <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center mx-auto">
                <Sparkles className="h-4 w-4 text-accent" />
              </div>
              <h3 className="font-medium text-sm">Compliance Engine</h3>
              <p className="text-xs text-muted-foreground">Titulación oficial</p>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Login;
