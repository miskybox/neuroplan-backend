import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BookOpen, 
  Target, 
  Play, 
  CheckCircle2, 
  Clock, 
  Award, 
  FileText, 
  Video,
  Brain,
  TrendingUp,
  Calendar,
  Filter,
  Search,
  ArrowRight,
  Star,
  Users,
  Lightbulb,
  BarChart3,
  GraduationCap,
  Zap
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const Itinerary = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("modulos");
  const [selectedFilter, setSelectedFilter] = useState("todos");

  // Datos simulados del itinerario
  const itineraryData = {
    progresoGeneral: 68,
    tiempoEstimado: 120,
    tiempoDedicado: 45,
    modulosCompletados: 3,
    totalModulos: 8,
    proximaTarea: {
      id: 1,
      titulo: "Matemáticas - Álgebra Lineal",
      descripcion: "Resolver sistemas de ecuaciones lineales",
      tipo: "ejercicio",
      duracion: "45 min",
      dificultad: "media",
      completado: false
    },
    modulos: [
      {
        id: 1,
        titulo: "Fundamentos Matemáticos",
        descripcion: "Base matemática esencial para el nivel académico",
        progreso: 100,
        duracion: "20 horas",
        dificultad: "baja",
        completado: true,
        fechaInicio: "2024-01-01",
        fechaCompletado: "2024-01-15",
        tareas: [
          {
            id: 1,
            titulo: "Operaciones Básicas",
            tipo: "ejercicio",
            completado: true,
            duracion: "30 min",
            puntuacion: 95
          },
          {
            id: 2,
            titulo: "Fracciones y Decimales",
            tipo: "video",
            completado: true,
            duracion: "45 min",
            puntuacion: 88
          },
          {
            id: 3,
            titulo: "Geometría Básica",
            tipo: "lectura",
            completado: true,
            duracion: "60 min",
            puntuacion: 92
          }
        ]
      },
      {
        id: 2,
        titulo: "Álgebra y Ecuaciones",
        descripcion: "Resolución de ecuaciones y sistemas algebraicos",
        progreso: 85,
        duracion: "25 horas",
        dificultad: "media",
        completado: false,
        fechaInicio: "2024-01-16",
        fechaCompletado: null,
        tareas: [
          {
            id: 4,
            titulo: "Ecuaciones de Primer Grado",
            tipo: "ejercicio",
            completado: true,
            duracion: "40 min",
            puntuacion: 90
          },
          {
            id: 5,
            titulo: "Sistemas de Ecuaciones",
            tipo: "video",
            completado: true,
            duracion: "50 min",
            puntuacion: 85
          },
          {
            id: 6,
            titulo: "Ecuaciones Cuadráticas",
            tipo: "ejercicio",
            completado: false,
            duracion: "60 min",
            puntuacion: null
          }
        ]
      },
      {
        id: 3,
        titulo: "Historia Universal",
        descripcion: "Desarrollo histórico desde la antigüedad hasta la modernidad",
        progreso: 60,
        duracion: "30 horas",
        dificultad: "media",
        completado: false,
        fechaInicio: "2024-01-20",
        fechaCompletado: null,
        tareas: [
          {
            id: 7,
            titulo: "Antigüedad Clásica",
            tipo: "lectura",
            completado: true,
            duracion: "90 min",
            puntuacion: 87
          },
          {
            id: 8,
            titulo: "Edad Media",
            tipo: "video",
            completado: true,
            duracion: "75 min",
            puntuacion: 82
          },
          {
            id: 9,
            titulo: "Revolución Industrial",
            tipo: "ejercicio",
            completado: false,
            duracion: "45 min",
            puntuacion: null
          }
        ]
      },
      {
        id: 4,
        titulo: "Ciencias Naturales",
        descripcion: "Biología, química y física básica",
        progreso: 30,
        duracion: "35 horas",
        dificultad: "alta",
        completado: false,
        fechaInicio: "2024-02-01",
        fechaCompletado: null,
        tareas: [
          {
            id: 10,
            titulo: "Célula y Organismos",
            tipo: "video",
            completado: true,
            duracion: "60 min",
            puntuacion: 78
          },
          {
            id: 11,
            titulo: "Genética Mendeliana",
            tipo: "lectura",
            completado: false,
            duracion: "80 min",
            puntuacion: null
          },
          {
            id: 12,
            titulo: "Leyes de Newton",
            tipo: "ejercicio",
            completado: false,
            duracion: "70 min",
            puntuacion: null
          }
        ]
      }
    ],
    recursos: [
      {
        id: 1,
        titulo: "Calculadora Científica",
        tipo: "herramienta",
        descripcion: "Calculadora avanzada para ejercicios matemáticos",
        disponible: true
      },
      {
        id: 2,
        titulo: "Diccionario Técnico",
        tipo: "referencia",
        descripcion: "Glosario de términos científicos y matemáticos",
        disponible: true
      },
      {
        id: 3,
        titulo: "Tutor Virtual IA",
        tipo: "asistente",
        descripcion: "Asistente inteligente para dudas y explicaciones",
        disponible: true
      }
    ]
  };

  const getTipoIcono = (tipo: string) => {
    switch (tipo) {
      case "ejercicio":
        return <Target className="h-4 w-4" />;
      case "lectura":
        return <BookOpen className="h-4 w-4" />;
      case "video":
        return <Play className="h-4 w-4" />;
      case "herramienta":
        return <Zap className="h-4 w-4" />;
      case "referencia":
        return <FileText className="h-4 w-4" />;
      case "asistente":
        return <Brain className="h-4 w-4" />;
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
      case "herramienta":
        return "bg-success/10 text-success border-success/20";
      case "referencia":
        return "bg-muted/10 text-muted-foreground border-muted/20";
      case "asistente":
        return "bg-primary/10 text-primary border-primary/20";
      default:
        return "bg-muted/10 text-muted-foreground border-muted/20";
    }
  };

  const getDificultadColor = (dificultad: string) => {
    switch (dificultad) {
      case "baja":
        return "bg-success/10 text-success border-success/20";
      case "media":
        return "bg-accent/10 text-accent border-accent/20";
      case "alta":
        return "bg-destructive/10 text-destructive border-destructive/20";
      default:
        return "bg-muted/10 text-muted-foreground border-muted/20";
    }
  };

  const modulosFiltrados = selectedFilter === "todos" 
    ? itineraryData.modulos 
    : itineraryData.modulos.filter(modulo => {
        switch (selectedFilter) {
          case "completados":
            return modulo.completado;
          case "en-progreso":
            return !modulo.completado && modulo.progreso > 0;
          case "pendientes":
            return modulo.progreso === 0;
          default:
            return true;
        }
      });

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header del Itinerario */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold">
                  Mi{" "}
                  <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                    Itinerario Educativo
                  </span>
                </h1>
                <p className="text-muted-foreground mt-2">
                  Plan personalizado adaptado a tu Perfil NeuroAcadémico
                </p>
              </div>
              
              <div className="hidden md:flex items-center gap-3">
                <Link to="/dashboard">
                  <Button variant="outline" className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4" />
                    Dashboard
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
                    <p className="text-3xl font-bold text-primary">{itineraryData.progresoGeneral}%</p>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <TrendingUp className="h-6 w-6 text-primary" />
                  </div>
                </div>
                <Progress value={itineraryData.progresoGeneral} className="mt-4 h-2" />
              </CardContent>
            </Card>

            <Card className="hover:shadow-glow transition-spring">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Módulos Completados</p>
                    <p className="text-3xl font-bold text-secondary">{itineraryData.modulosCompletados}/{itineraryData.totalModulos}</p>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center">
                    <BookOpen className="h-6 w-6 text-secondary" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-glow transition-spring">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Tiempo Dedicado</p>
                    <p className="text-3xl font-bold text-accent">{itineraryData.tiempoDedicado}h</p>
                    <p className="text-xs text-muted-foreground">de {itineraryData.tiempoEstimado}h</p>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
                    <Clock className="h-6 w-6 text-accent" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-glow transition-spring">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Próxima Tarea</p>
                    <p className="text-lg font-bold text-success">{itineraryData.proximaTarea.titulo}</p>
                    <p className="text-xs text-muted-foreground">{itineraryData.proximaTarea.duracion}</p>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-success/10 flex items-center justify-center">
                    <Target className="h-6 w-6 text-success" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tabs del Itinerario */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="modulos" className="flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                Módulos
              </TabsTrigger>
              <TabsTrigger value="tareas" className="flex items-center gap-2">
                <Target className="h-4 w-4" />
                Tareas
              </TabsTrigger>
              <TabsTrigger value="recursos" className="flex items-center gap-2">
                <Lightbulb className="h-4 w-4" />
                Recursos
              </TabsTrigger>
            </TabsList>

            {/* Tab: Módulos */}
            <TabsContent value="modulos" className="space-y-6">
              {/* Filtros */}
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Filtrar:</span>
                </div>
                <div className="flex gap-2">
                  {["todos", "completados", "en-progreso", "pendientes"].map((filter) => (
                    <Button
                      key={filter}
                      variant={selectedFilter === filter ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedFilter(filter)}
                    >
                      {filter === "todos" && "Todos"}
                      {filter === "completados" && "Completados"}
                      {filter === "en-progreso" && "En Progreso"}
                      {filter === "pendientes" && "Pendientes"}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Lista de Módulos */}
              <div className="space-y-4">
                {modulosFiltrados.map((modulo) => (
                  <Card key={modulo.id} className="hover:shadow-glow transition-spring">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <CardTitle className="text-xl">{modulo.titulo}</CardTitle>
                            {modulo.completado && (
                              <Badge variant="default" className="flex items-center gap-1">
                                <CheckCircle2 className="h-3 w-3" />
                                Completado
                              </Badge>
                            )}
                            <Badge variant="outline" className={getDificultadColor(modulo.dificultad)}>
                              {modulo.dificultad}
                            </Badge>
                          </div>
                          <CardDescription className="text-base">
                            {modulo.descripcion}
                          </CardDescription>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-primary mb-1">
                            {modulo.progreso}%
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {modulo.duracion}
                          </div>
                        </div>
                      </div>
                      <Progress value={modulo.progreso} className="h-2" />
                    </CardHeader>
                    
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          Inicio: {new Date(modulo.fechaInicio).toLocaleDateString('es-ES')}
                        </div>
                        {modulo.fechaCompletado && (
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Award className="h-4 w-4" />
                            Completado: {new Date(modulo.fechaCompletado).toLocaleDateString('es-ES')}
                          </div>
                        )}
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Users className="h-4 w-4" />
                          {modulo.tareas.length} tareas
                        </div>
                      </div>

                      {/* Tareas del Módulo */}
                      <div className="space-y-2">
                        <h4 className="font-medium text-sm text-muted-foreground">Tareas:</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                          {modulo.tareas.map((tarea) => (
                            <div
                              key={tarea.id}
                              className={`p-3 rounded-lg border transition-spring ${
                                tarea.completado 
                                  ? "bg-success/5 border-success/20" 
                                  : "bg-muted/30 border-border"
                              }`}
                            >
                              <div className="flex items-center gap-2 mb-1">
                                <div className={`p-1 rounded border ${getTipoColor(tarea.tipo)}`}>
                                  {getTipoIcono(tarea.tipo)}
                                </div>
                                <span className="text-sm font-medium">{tarea.titulo}</span>
                                {tarea.completado && (
                                  <CheckCircle2 className="h-3 w-3 text-success" />
                                )}
                              </div>
                              <div className="flex items-center justify-between text-xs text-muted-foreground">
                                <span>{tarea.duracion}</span>
                                {tarea.puntuacion && (
                                  <span className="font-medium">{tarea.puntuacion}%</span>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="flex justify-end mt-4">
                        <Button variant="outline" size="sm">
                          Ver Detalles
                          <ArrowRight className="h-4 w-4 ml-2" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Tab: Tareas */}
            <TabsContent value="tareas" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    Próximas Tareas
                  </CardTitle>
                  <CardDescription>
                    Tareas pendientes organizadas por prioridad
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {itineraryData.modulos.flatMap(modulo => 
                    modulo.tareas.filter(tarea => !tarea.completado)
                  ).slice(0, 6).map((tarea, index) => (
                    <div
                      key={tarea.id}
                      className="flex items-center justify-between p-4 rounded-lg border hover:shadow-elegant transition-spring"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg border ${getTipoColor(tarea.tipo)}`}>
                          {getTipoIcono(tarea.tipo)}
                        </div>
                        <div>
                          <h4 className="font-medium">{tarea.titulo}</h4>
                          <p className="text-sm text-muted-foreground">{tarea.duracion}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          Prioridad {index + 1}
                        </Badge>
                        <Button size="sm">
                          Comenzar
                        </Button>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Tab: Recursos */}
            <TabsContent value="recursos" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {itineraryData.recursos.map((recurso) => (
                  <Card key={recurso.id} className="hover:shadow-glow transition-spring">
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <div className={`p-3 rounded-lg border ${getTipoColor(recurso.tipo)}`}>
                          {getTipoIcono(recurso.tipo)}
                        </div>
                        <div>
                          <CardTitle className="text-lg">{recurso.titulo}</CardTitle>
                          <Badge variant="outline" className="text-xs">
                            {recurso.tipo}
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="mb-4">
                        {recurso.descripcion}
                      </CardDescription>
                      <Button 
                        className="w-full" 
                        variant={recurso.disponible ? "default" : "outline"}
                        disabled={!recurso.disponible}
                      >
                        {recurso.disponible ? "Usar Recurso" : "No Disponible"}
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Itinerary;
