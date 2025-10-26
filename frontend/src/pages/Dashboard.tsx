import React from "react";
import { Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Brain, 
  BookOpen, 
  Target, 
  TrendingUp, 
  Clock, 
  Award, 
  FileText, 
  Play,
  CheckCircle2,
  Calendar,
  Star,
  ArrowRight,
  GraduationCap,
  Users,
  Lightbulb,
  BarChart3,
  Zap
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const Dashboard = () => {
  const { user } = useAuth();

  // Datos simulados del dashboard
  const dashboardData = {
    progresoGeneral: 68,
    tiempoEstudio: 24,
    logrosCompletados: 12,
    proximasTareas: [
      {
        id: 1,
        titulo: "Matemáticas - Álgebra Lineal",
        descripcion: "Resolver sistemas de ecuaciones lineales",
        fecha: "2024-01-15",
        tipo: "ejercicio",
        completado: false
      },
      {
        id: 2,
        titulo: "Historia - Revolución Industrial",
        descripcion: "Análisis de causas y consecuencias",
        fecha: "2024-01-16",
        tipo: "lectura",
        completado: false
      },
      {
        id: 3,
        titulo: "Biología - Genética Mendeliana",
        descripcion: "Estudio de herencia genética",
        fecha: "2024-01-17",
        tipo: "video",
        completado: true
      }
    ],
    logrosRecientes: [
      {
        id: 1,
        titulo: "Primera Semana Completa",
        descripcion: "Completaste 7 días consecutivos de estudio",
        fecha: "2024-01-10",
        icono: "🏆"
      },
      {
        id: 2,
        titulo: "Matemático en Progreso",
        descripcion: "Resolviste 50 ejercicios de álgebra",
        fecha: "2024-01-08",
        icono: "🧮"
      },
      {
        id: 3,
        titulo: "Lector Avanzado",
        descripcion: "Completaste 5 lecturas de historia",
        fecha: "2024-01-05",
        icono: "📚"
      }
    ],
    estadisticas: {
      tiempoTotal: 156,
      ejerciciosCompletados: 89,
      lecturasCompletadas: 23,
      videosVistos: 45
    }
  };

  const getTipoIcono = (tipo: string) => {
    switch (tipo) {
      case "ejercicio":
        return <Target className="h-4 w-4" />;
      case "lectura":
        return <BookOpen className="h-4 w-4" />;
      case "video":
        return <Play className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const getTipoColor = (tipo: string) => {
    switch (tipo) {
      case "ejercicio":
        return "bg-primary/10 text-primary border-primary/20";
      case "lectura":
        return "bg-secondary/10 text-secondary border-secondary/20";
      case "video":
        return "bg-accent/10 text-accent border-accent/20";
      default:
        return "bg-muted/10 text-muted-foreground border-muted/20";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header del Dashboard */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold">
                  ¡Hola, {user?.nombre}! 👋
                </h1>
                <p className="text-muted-foreground mt-2">
                  Bienvenido a tu centro de aprendizaje personalizado
                </p>
              </div>
              
              <div className="hidden md:flex items-center gap-3">
                <Link to="/perfil">
                  <Button variant="outline" className="flex items-center gap-2">
                    <Brain className="h-4 w-4" />
                    Mi Perfil
                  </Button>
                </Link>
                <Button className="flex items-center gap-2 bg-gradient-hero">
                  <Play className="h-4 w-4" />
                  Continuar Estudiando
                </Button>
              </div>
            </div>
          </div>

          {/* Métricas Principales */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="hover:shadow-glow transition-spring">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Progreso General</p>
                    <p className="text-3xl font-bold text-primary">{dashboardData.progresoGeneral}%</p>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <TrendingUp className="h-6 w-6 text-primary" />
                  </div>
                </div>
                <Progress value={dashboardData.progresoGeneral} className="mt-4 h-2" />
              </CardContent>
            </Card>

            <Card className="hover:shadow-glow transition-spring">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Tiempo de Estudio</p>
                    <p className="text-3xl font-bold text-secondary">{dashboardData.tiempoEstudio}h</p>
                    <p className="text-xs text-muted-foreground">Esta semana</p>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center">
                    <Clock className="h-6 w-6 text-secondary" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-glow transition-spring">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Logros</p>
                    <p className="text-3xl font-bold text-accent">{dashboardData.logrosCompletados}</p>
                    <p className="text-xs text-muted-foreground">Completados</p>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
                    <Award className="h-6 w-6 text-accent" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-glow transition-spring">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Nivel Actual</p>
                    <p className="text-lg font-bold text-success">{user?.perfilNeuroAcademico?.nivelActual}</p>
                    <p className="text-xs text-muted-foreground">Tu nivel</p>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-success/10 flex items-center justify-center">
                    <GraduationCap className="h-6 w-6 text-success" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Contenido Principal */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Columna Principal */}
            <div className="lg:col-span-2 space-y-8">
              {/* Próximas Tareas */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Próximas Tareas
                  </CardTitle>
                  <CardDescription>
                    Tu itinerario personalizado para los próximos días
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {dashboardData.proximasTareas.map((tarea) => (
                    <div
                      key={tarea.id}
                      className={`p-4 rounded-lg border transition-spring hover:shadow-elegant ${
                        tarea.completado 
                          ? "bg-success/5 border-success/20" 
                          : "bg-muted/30 border-border"
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3 flex-1">
                          <div className={`p-2 rounded-lg border ${getTipoColor(tarea.tipo)}`}>
                            {getTipoIcono(tarea.tipo)}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-medium">{tarea.titulo}</h4>
                              {tarea.completado && (
                                <CheckCircle2 className="h-4 w-4 text-success" />
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">
                              {tarea.descripcion}
                            </p>
                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {new Date(tarea.fecha).toLocaleDateString('es-ES')}
                              </span>
                              <Badge variant="outline" className="text-xs">
                                {tarea.tipo}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <Button
                          variant={tarea.completado ? "outline" : "default"}
                          size="sm"
                          className="ml-4"
                        >
                          {tarea.completado ? "Revisar" : "Comenzar"}
                        </Button>
                      </div>
                    </div>
                  ))}
                  
                  <div className="pt-4 border-t">
                    <Link to="/itinerario">
                      <Button variant="outline" className="w-full">
                        Ver Itinerario Completo
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>

              {/* Estadísticas Detalladas */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Estadísticas de Aprendizaje
                  </CardTitle>
                  <CardDescription>
                    Tu progreso detallado en diferentes áreas
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary mb-1">
                        {dashboardData.estadisticas.tiempoTotal}h
                      </div>
                      <p className="text-sm text-muted-foreground">Tiempo Total</p>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-secondary mb-1">
                        {dashboardData.estadisticas.ejerciciosCompletados}
                      </div>
                      <p className="text-sm text-muted-foreground">Ejercicios</p>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-accent mb-1">
                        {dashboardData.estadisticas.lecturasCompletadas}
                      </div>
                      <p className="text-sm text-muted-foreground">Lecturas</p>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-success mb-1">
                        {dashboardData.estadisticas.videosVistos}
                      </div>
                      <p className="text-sm text-muted-foreground">Videos</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-8">
              {/* Logros Recientes */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Star className="h-5 w-5" />
                    Logros Recientes
                  </CardTitle>
                  <CardDescription>
                    Celebra tus éxitos
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {dashboardData.logrosRecientes.map((logro) => (
                    <div key={logro.id} className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
                      <div className="text-2xl">{logro.icono}</div>
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">{logro.titulo}</h4>
                        <p className="text-xs text-muted-foreground mb-1">
                          {logro.descripcion}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(logro.fecha).toLocaleDateString('es-ES')}
                        </p>
                      </div>
                    </div>
                  ))}
                  
                  <Button variant="outline" size="sm" className="w-full">
                    Ver Todos los Logros
                  </Button>
                </CardContent>
              </Card>

              {/* Accesos Rápidos */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="h-5 w-5" />
                    Accesos Rápidos
                  </CardTitle>
                  <CardDescription>
                    Navegación rápida a funciones principales
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Link to="/perfil">
                    <Button variant="outline" className="w-full justify-start">
                      <Brain className="h-4 w-4 mr-2" />
                      Mi Perfil NeuroAcadémico
                    </Button>
                  </Link>
                  
                  <Button variant="outline" className="w-full justify-start">
                    <BookOpen className="h-4 w-4 mr-2" />
                    Recursos Educativos
                  </Button>
                  
                  <Button variant="outline" className="w-full justify-start">
                    <FileText className="h-4 w-4 mr-2" />
                    Pasaporte Educativo
                  </Button>
                  
                  <Button variant="outline" className="w-full justify-start">
                    <Users className="h-4 w-4 mr-2" />
                    Tutor Virtual
                  </Button>
                </CardContent>
              </Card>

              {/* Motivación Diaria */}
              <Card className="bg-gradient-hero text-white">
                <CardContent className="p-6">
                  <div className="text-center space-y-4">
                    <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center mx-auto">
                      <Lightbulb className="h-8 w-8" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg mb-2">¡Sigue así!</h3>
                      <p className="text-white/90 text-sm">
                        Cada día de estudio te acerca más a tu titulación oficial. 
                        Tu dedicación es la clave del éxito.
                      </p>
                    </div>
                    <Button variant="secondary" size="sm" className="bg-white text-primary hover:bg-white/90">
                      Motivarme
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Dashboard;
