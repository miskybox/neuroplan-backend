import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Brain, 
  Cpu, 
  FileText, 
  Target, 
  BookOpen,
  Zap,
  Shield,
  TrendingUp,
  ArrowRight,
  CheckCircle2,
  Lightbulb,
  BarChart3,
  Settings,
  Eye,
  Download,
  Play,
  RotateCcw,
  Upload,
  AlertCircle,
  Plus
} from "lucide-react";
import { studentsService, peisService, healthService } from "../services/neuroplanApi";
import type { Student, PEI, CreateStudentDTO, GeneratePEIDTO } from "../types/api";
import { toast } from "sonner";
import { useAuth } from "../contexts/AuthContext";
import { BedrockDemo } from "@/components/BedrockDemo";

const PEIEngine = () => {
  const { user } = useAuth(); // Hook para mantener contexto de autenticación
  const [activeTab, setActiveTab] = useState("overview");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [backendConnected, setBackendConnected] = useState(false);
  const [students, setStudents] = useState<Student[]>([]);
  const [peis, setPeis] = useState<PEI[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [studentName, setStudentName] = useState("");
  const [isCreatingStudent, setIsCreatingStudent] = useState(false);
  const [isGeneratingPEI, setIsGeneratingPEI] = useState(false);
  
  // Evitar warning de variable no usada
  console.debug('User context:', user);

  // Verificar conexión con el backend al cargar la página
  useEffect(() => {
    checkBackendConnection();
    loadStudents();
    loadPEIs();
  }, []);

  const checkBackendConnection = async () => {
    try {
      await healthService.check();
      setBackendConnected(true);
      toast.success("Conectado al backend NeuroPlan");
    } catch (error) {
      console.warn("Backend no disponible, usando modo demo:", error);
      setBackendConnected(false);
      toast.info("Ejecutando en modo demo");
    }
  };

  const loadStudents = async () => {
    if (!backendConnected) return;
    
    try {
      const response = await studentsService.getAll();
      setStudents(response.data || []);
    } catch (error) {
      console.error("Error loading students:", error);
    }
  };

  const loadPEIs = async () => {
    if (!backendConnected) return;
    
    try {
      const response = await peisService.getAll();
      setPeis(response.data || []);
    } catch (error) {
      console.error("Error loading PEIs:", error);
    }
  };

  const createStudentAndUploadReport = async () => {
    if (!selectedFile || !studentName.trim()) {
      toast.error("Por favor selecciona un archivo y nombre del estudiante");
      return;
    }

    if (!user?.id) {
      toast.error("Usuario no autenticado");
      return;
    }

    setIsCreatingStudent(true);
    try {
      // Crear estudiante
      const studentData: CreateStudentDTO = {
        name: studentName,
        dateOfBirth: "2010-01-01", // Por ahora fecha por defecto
        gradeLevel: "Primaria",
        diagnosis: "TDAH + Dislexia",
        userId: user.id, // Agregar userId del usuario autenticado
      };

      const studentResponse = await studentsService.create(studentData);
      const newStudent = studentResponse.data;

      // Subir reporte médico
      const reportResponse = await studentsService.uploadReport(newStudent.id, selectedFile);
      
      toast.success("Estudiante creado y reporte subido exitosamente");
      
      // Recargar datos
      await loadStudents();
      
      // Limpiar formulario
      setSelectedFile(null);
      setStudentName("");
      
      return { student: newStudent, report: reportResponse.data };
    } catch (error) {
      console.error("Error creating student:", error);
      toast.error("Error al generar PEI");
      return null;
    } finally {
      setIsCreatingStudent(false);
    }
  };

  const generatePEI = async (reportId: number, studentId: number) => {
    setIsGeneratingPEI(true);
    setIsAnalyzing(true);
    setAnalysisProgress(0);

    try {
      // Simular progreso
      const progressInterval = setInterval(() => {
        setAnalysisProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 500);

      // Generar PEI real - enviar studentId como string
      const generateData: GeneratePEIDTO = { 
        reportId, 
        studentId: String(studentId) 
      };
      
      // DEBUG: Verificar datos antes de enviar
      console.log('🔍 Generando PEI con datos:', generateData);
      console.log('📊 Tipos:', {
        reportId: typeof generateData.reportId,
        studentId: typeof generateData.studentId
      });
      
      await peisService.generate(generateData);
      
      clearInterval(progressInterval);
      setAnalysisProgress(100);
      
      toast.success("PEI generado exitosamente");
      
      // Recargar PEIs
      await loadPEIs();
      
      setTimeout(() => {
        setIsAnalyzing(false);
        setAnalysisProgress(0);
      }, 2000);
      
    } catch (error) {
      console.error("Error generating PEI:", error);
      toast.error("Error al generar PEI");
      setIsAnalyzing(false);
      setAnalysisProgress(0);
    } finally {
      setIsGeneratingPEI(false);
    }
  };

  // Función demo para simular análisis
  const startDemoAnalysis = () => {
    setIsAnalyzing(true);
    setAnalysisProgress(0);
    
    const interval = setInterval(() => {
      setAnalysisProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsAnalyzing(false);
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      toast.info(`Archivo seleccionado: ${file.name}`);
    }
  };

  const handleCreateAndGenerate = async () => {
    if (!backendConnected) {
      startDemoAnalysis();
      toast.info("Ejecutando análisis demo");
      return;
    }

    const result = await createStudentAndUploadReport();
    if (result) {
      await generatePEI(result.report.id, result.student.id);
    }
  };

  // Datos simulados del análisis
  const analysisResults = {
    perfilNeurocognitivo: {
      fortalezas: [
        { nombre: "Memoria Visual", porcentaje: 85, descripcion: "Excelente capacidad para recordar información visual" },
        { nombre: "Pensamiento Lógico", porcentaje: 78, descripcion: "Habilidad destacada en razonamiento matemático" },
        { nombre: "Creatividad", porcentaje: 92, descripcion: "Alto nivel de pensamiento creativo e innovador" },
        { nombre: "Atención Sostenida", porcentaje: 65, descripcion: "Capacidad moderada para mantener la concentración" }
      ],
      areasApoyo: [
        { nombre: "Organización Temporal", nivel: "Alto", descripcion: "Necesita apoyo en gestión del tiempo" },
        { nombre: "Memoria de Trabajo", nivel: "Medio", descripcion: "Apoyo moderado en tareas de memoria" },
        { nombre: "Regulación Emocional", nivel: "Bajo", descripcion: "Buen manejo de las emociones" }
      ],
      preferenciasAprendizaje: [
        { tipo: "Visual", porcentaje: 75, icono: Eye },
        { tipo: "Kinestésico", porcentaje: 60, icono: Zap },
        { tipo: "Auditivo", porcentaje: 45, icono: Play },
        { tipo: "Lectura/Escritura", porcentaje: 55, icono: FileText }
      ]
    },
    recomendaciones: [
      {
        categoria: "Metodología",
        titulo: "Aprendizaje Multimodal",
        descripcion: "Combinar elementos visuales, interactivos y prácticos",
        prioridad: "Alta",
        impacto: "Alto"
      },
      {
        categoria: "Tecnología",
        titulo: "Herramientas Visuales",
        descripcion: "Utilizar mapas mentales, diagramas y simulaciones",
        prioridad: "Alta",
        impacto: "Alto"
      },
      {
        categoria: "Evaluación",
        titulo: "Proyectos Prácticos",
        descripcion: "Evaluar mediante proyectos y presentaciones visuales",
        prioridad: "Media",
        impacto: "Medio"
      }
    ]
  };

  return (
    <div className="min-h-screen bg-muted/30">
      <Header />
      
      <main className="container py-12 lg:py-16">
        {/* Header de la página */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-full bg-gradient-to-r from-primary to-primary-dark flex items-center justify-center">
              <Brain className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-primary to-primary-dark bg-clip-text text-transparent">
                PEI Engine
              </h1>
              <p className="text-lg text-muted-foreground">Motor de Individualización</p>
            </div>
          </div>
          
          <p className="text-xl text-muted-foreground max-w-4xl mx-auto mb-8">
            El PEI Engine es nuestro motor de inteligencia artificial que transforma tu perfil neurocognitivo 
            en un mapa personalizado de aprendizaje, garantizando la máxima eficacia educativa.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={startDemoAnalysis}
              disabled={isAnalyzing}
              size="lg" 
              className="group bg-gradient-hero"
            >
              {isAnalyzing ? (
                <>
                  <RotateCcw className="h-5 w-5 mr-2 animate-spin" />
                  Analizando...
                </>
              ) : (
                <>
                  <Cpu className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform" />
                  Análisis Demo
                </>
              )}
            </Button>
            <Link to="/perfil">
              <Button variant="outline" size="lg" className="group">
                <Target className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform" />
                Ver mi Perfil
              </Button>
            </Link>
            
            <Link to="/generate-pei">
              <Button variant="outline" size="lg" className="group border-2 hover:bg-primary hover:text-white transition-all duration-300">
                <Plus className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform" />
                Generar PEI
              </Button>
            </Link>
          </div>
        </div>

        {/* Estado de conexión del backend */}
        <Card className={`mb-8 ${backendConnected ? 'bg-green-50 border-green-200' : 'bg-yellow-50 border-yellow-200'}`}>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              {backendConnected ? (
                <>
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                  <span className="text-green-800 font-medium">Backend NeuroPlan conectado</span>
                  <Badge variant="outline" className="text-green-700 border-green-300">
                    Tiempo real
                  </Badge>
                </>
              ) : (
                <>
                  <AlertCircle className="h-5 w-5 text-yellow-600" />
                  <span className="text-yellow-800 font-medium">Ejecutando en modo demo</span>
                  <Badge variant="outline" className="text-yellow-700 border-yellow-300">
                    Simulación
                  </Badge>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Sección de backend real */}
        {backendConnected && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-primary" />
                Generador de PEI Conectado
              </CardTitle>
              <CardDescription>
                Sube un reporte médico y genera un PEI personalizado usando el backend real
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label htmlFor="studentName" className="block text-sm font-medium mb-2">Nombre del Estudiante</label>
                    <input
                      id="studentName"
                      type="text"
                      value={studentName}
                      onChange={(e) => setStudentName(e.target.value)}
                      placeholder="Ej: María González"
                      className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                  <div>
                    <label htmlFor="reportFile" className="block text-sm font-medium mb-2">Reporte Médico (PDF)</label>
                    <input
                      id="reportFile"
                      type="file"
                      accept=".pdf,.doc,.docx,.jpg,.png"
                      onChange={handleFileChange}
                      className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary/20"
                    />
                    {selectedFile && (
                      <p className="text-sm text-muted-foreground mt-2">
                        Archivo: {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                      </p>
                    )}
                  </div>
                </div>
                <div className="space-y-4">
                  <h4 className="font-semibold">Proceso de Generación:</h4>
                  <ol className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <span className="w-5 h-5 rounded-full bg-primary text-white text-xs flex items-center justify-center mt-0.5">1</span>
                      <span>Crear perfil del estudiante</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-5 h-5 rounded-full bg-primary text-white text-xs flex items-center justify-center mt-0.5">2</span>
                      <span>Subir y procesar reporte médico</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-5 h-5 rounded-full bg-primary text-white text-xs flex items-center justify-center mt-0.5">3</span>
                      <span>Generar PEI con Claude AI</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-5 h-5 rounded-full bg-primary text-white text-xs flex items-center justify-center mt-0.5">4</span>
                      <span>Disponible para descarga y audio</span>
                    </li>
                  </ol>
                  <Button 
                    onClick={handleCreateAndGenerate}
                    disabled={isCreatingStudent || isGeneratingPEI || !studentName.trim() || !selectedFile}
                    className="w-full"
                  >
                    {isCreatingStudent || isGeneratingPEI ? (
                      <>
                        <RotateCcw className="h-4 w-4 mr-2 animate-spin" />
                        {isCreatingStudent ? "Creando estudiante..." : "Generando PEI..."}
                      </>
                    ) : (
                      <>
                        <Upload className="h-4 w-4 mr-2" />
                        Generar PEI
                      </>
                    )}
                  </Button>
                </div>
              </div>

              {/* Lista de estudiantes */}
              {students.length > 0 && (
                <div className="space-y-4">
                  <h4 className="font-semibold">Estudiantes Registrados ({students.length})</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {students.slice(0, 6).map((student) => (
                      <Card key={student.id} className="hover:shadow-md transition-shadow">
                        <CardContent className="p-4">
                          <h5 className="font-medium">{student.name}</h5>
                          <p className="text-sm text-muted-foreground">{student.gradeLevel}</p>
                          {student.diagnosis && (
                            <Badge variant="outline" className="mt-2 text-xs">
                              {student.diagnosis}
                            </Badge>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {/* Lista de PEIs generados */}
              {peis.length > 0 && (
                <div className="space-y-4">
                  <h4 className="font-semibold">PEIs Generados ({peis.length})</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {peis.slice(0, 4).map((pei) => (
                      <Card key={pei.id} className="hover:shadow-md transition-shadow">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between">
                            <div>
                              <h5 className="font-medium">PEI #{pei.id}</h5>
                              <p className="text-sm text-muted-foreground">
                                Generado: {new Date(pei.generatedAt).toLocaleDateString()}
                              </p>
                              <Badge 
                                variant={pei.status === 'approved' ? 'default' : 'secondary'}
                                className="mt-2"
                              >
                                {pei.status}
                              </Badge>
                            </div>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => window.open(`${import.meta.env.VITE_API_BASE_URL}/peis/${pei.id}/pdf`, '_blank')}
                            >
                              <Download className="h-4 w-4" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Progreso del análisis */}
        {isAnalyzing && (
          <Card className="mb-8">
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Analizando tu Perfil Neurocognitivo</h3>
                  <span className="text-sm text-muted-foreground">{analysisProgress}%</span>
                </div>
                <Progress value={analysisProgress} className="h-2" />
                <p className="text-sm text-muted-foreground">
                  Procesando datos clínicos, preferencias de aprendizaje y fortalezas cognitivas...
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Resultados del análisis */}
        {!isAnalyzing && analysisProgress === 100 && (
          <Card className="mb-8 bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <CheckCircle2 className="h-6 w-6 text-green-600" />
                <h3 className="text-lg font-semibold text-green-800">Análisis Completado</h3>
              </div>
              <p className="text-green-700">
                Tu Perfil NeuroAcadémico ha sido analizado exitosamente. 
                El PEI Engine ha generado recomendaciones personalizadas para optimizar tu aprendizaje.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Tabs principales */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Resumen
            </TabsTrigger>
            <TabsTrigger value="analysis" className="flex items-center gap-2">
              <Brain className="h-4 w-4" />
              Análisis
            </TabsTrigger>
            <TabsTrigger value="recommendations" className="flex items-center gap-2">
              <Lightbulb className="h-4 w-4" />
              Recomendaciones
            </TabsTrigger>
            <TabsTrigger value="technology" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Tecnología
            </TabsTrigger>
          </TabsList>

          {/* Tab: Resumen */}
          <TabsContent value="overview" className="space-y-8">
            {/* Cómo funciona el PEI Engine */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Cpu className="h-5 w-5 text-primary" />
                  ¿Cómo funciona el PEI Engine?
                </CardTitle>
                <CardDescription>
                  Descubre el proceso de análisis e individualización que transforma tu perfil en un plan de aprendizaje personalizado
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="text-center space-y-3">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                      <FileText className="h-6 w-6 text-primary" />
                    </div>
                    <h4 className="font-semibold">1. Recopilación</h4>
                    <p className="text-sm text-muted-foreground">
                      Extrae información de informes clínicos, evaluaciones y preferencias
                    </p>
                  </div>
                  
                  <div className="text-center space-y-3">
                    <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center mx-auto">
                      <Brain className="h-6 w-6 text-secondary" />
                    </div>
                    <h4 className="font-semibold">2. Análisis IA</h4>
                    <p className="text-sm text-muted-foreground">
                      Procesa datos con algoritmos de machine learning especializados
                    </p>
                  </div>
                  
                  <div className="text-center space-y-3">
                    <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mx-auto">
                      <Target className="h-6 w-6 text-accent" />
                    </div>
                    <h4 className="font-semibold">3. Individualización</h4>
                    <p className="text-sm text-muted-foreground">
                      Genera un perfil único adaptado a tus características neurocognitivas
                    </p>
                  </div>
                  
                  <div className="text-center space-y-3">
                    <div className="w-12 h-12 rounded-full bg-success/10 flex items-center justify-center mx-auto">
                      <Zap className="h-6 w-6 text-success" />
                    </div>
                    <h4 className="font-semibold">4. Optimización</h4>
                    <p className="text-sm text-muted-foreground">
                      Ajusta continuamente el plan basado en tu progreso y rendimiento
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Beneficios del PEI Engine */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-primary" />
                    Beneficios Académicos
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium">Aprendizaje Eficaz</h4>
                      <p className="text-sm text-muted-foreground">
                        Metodologías adaptadas a tu estilo de aprendizaje
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium">Progreso Acelerado</h4>
                      <p className="text-sm text-muted-foreground">
                        Avance más rápido con estrategias personalizadas
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium">Retención Mejorada</h4>
                      <p className="text-sm text-muted-foreground">
                        Mayor retención de información a largo plazo
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-primary" />
                    Garantías del Sistema
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium">Privacidad Total</h4>
                      <p className="text-sm text-muted-foreground">
                        Datos protegidos con encriptación de grado militar
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium">Precisión Científica</h4>
                      <p className="text-sm text-muted-foreground">
                        Basado en investigación neurocientífica actualizada
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium">Actualización Continua</h4>
                      <p className="text-sm text-muted-foreground">
                        El perfil se mejora con cada interacción
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Tab: Análisis */}
          <TabsContent value="analysis" className="space-y-8">
            {/* Fortalezas Cognitivas */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5 text-primary" />
                  Fortalezas Cognitivas Identificadas
                </CardTitle>
                <CardDescription>
                  Análisis detallado de tus capacidades cognitivas más desarrolladas
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {analysisResults.perfilNeurocognitivo.fortalezas.map((fortaleza, index) => (
                  <div key={`${fortaleza.nombre}-${index}`} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">{fortaleza.nombre}</h4>
                      <span className="text-sm text-muted-foreground">{fortaleza.porcentaje}%</span>
                    </div>
                    <Progress value={fortaleza.porcentaje} className="h-2" />
                    <p className="text-sm text-muted-foreground">{fortaleza.descripcion}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Áreas de Apoyo */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-primary" />
                  Áreas de Apoyo Identificadas
                </CardTitle>
                <CardDescription>
                  Zonas donde el sistema proporcionará apoyo adicional
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {analysisResults.perfilNeurocognitivo.areasApoyo.map((area, index) => {
                  let bgColorClass = 'bg-green-500';
                  if (area.nivel === 'Alto') bgColorClass = 'bg-red-500';
                  else if (area.nivel === 'Medio') bgColorClass = 'bg-yellow-500';
                  
                  let badgeVariant: any = 'default';
                  if (area.nivel === 'Alto') badgeVariant = 'destructive';
                  else if (area.nivel === 'Medio') badgeVariant = 'secondary';
                  
                  return (
                    <div key={`area-${area.nombre}-${index}`} className="flex items-start gap-3 p-4 rounded-lg bg-muted/50">
                      <div className={`w-3 h-3 rounded-full mt-2 ${bgColorClass}`} />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium">{area.nombre}</h4>
                          <Badge variant={badgeVariant}>
                            {area.nivel}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{area.descripcion}</p>
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            {/* Preferencias de Aprendizaje */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-primary" />
                  Preferencias de Aprendizaje
                </CardTitle>
                <CardDescription>
                  Estilos de aprendizaje identificados y sus porcentajes de efectividad
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {analysisResults.perfilNeurocognitivo.preferenciasAprendizaje.map((preferencia, index) => (
                    <div key={`${preferencia.tipo}-${index}`} className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <preferencia.icono className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium">{preferencia.tipo}</h4>
                          <Progress value={preferencia.porcentaje} className="h-2 mt-1" />
                        </div>
                        <span className="text-sm font-medium">{preferencia.porcentaje}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab: Recomendaciones */}
          <TabsContent value="recommendations" className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {analysisResults.recomendaciones.map((recomendacion, index) => (
                <Card key={`${recomendacion.titulo}-${index}`} className="hover:shadow-glow transition-spring">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <Badge variant="outline" className="mb-2">
                          {recomendacion.categoria}
                        </Badge>
                        <CardTitle className="text-lg">{recomendacion.titulo}</CardTitle>
                      </div>
                      <div className="flex flex-col gap-1">
                        <Badge variant={recomendacion.prioridad === 'Alta' ? 'destructive' : 'secondary'}>
                          {recomendacion.prioridad}
                        </Badge>
                        <Badge variant="outline">
                          {recomendacion.impacto}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="mb-4">
                      {recomendacion.descripcion}
                    </CardDescription>
                    <Button variant="outline" size="sm" className="w-full">
                      <ArrowRight className="h-4 w-4 mr-2" />
                      Implementar
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Plan de Acción */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-primary" />
                  Plan de Acción Personalizado
                </CardTitle>
                <CardDescription>
                  Estrategias específicas basadas en tu análisis neurocognitivo
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-semibold text-primary">Estrategias de Estudio</h4>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5" />
                        <span>Usar mapas mentales para organizar información</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5" />
                        <span>Tomar descansos cada 25 minutos</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5" />
                        <span>Practicar con ejercicios interactivos</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div className="space-y-4">
                    <h4 className="font-semibold text-primary">Herramientas Recomendadas</h4>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5" />
                        <span>Calculadora científica avanzada</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5" />
                        <span>Simulador de laboratorio virtual</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5" />
                        <span>Tutor virtual IA personalizado</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab: Tecnología */}
          <TabsContent value="technology" className="space-y-8">
            {/* Arquitectura del PEI Engine */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5 text-primary" />
                  Arquitectura del PEI Engine
                </CardTitle>
                <CardDescription>
                  Tecnología avanzada que potencia la individualización educativa
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="text-center space-y-3">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                      <Cpu className="h-6 w-6 text-primary" />
                    </div>
                    <h4 className="font-semibold">Machine Learning</h4>
                    <p className="text-sm text-muted-foreground">
                      Algoritmos de IA que aprenden de cada interacción para mejorar la personalización
                    </p>
                  </div>
                  
                  <div className="text-center space-y-3">
                    <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center mx-auto">
                      <FileText className="h-6 w-6 text-secondary" />
                    </div>
                    <h4 className="font-semibold">OCR/NLP</h4>
                    <p className="text-sm text-muted-foreground">
                      Procesamiento de documentos clínicos y académicos con AWS/Runware
                    </p>
                  </div>
                  
                  <div className="text-center space-y-3">
                    <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mx-auto">
                      <Brain className="h-6 w-6 text-accent" />
                    </div>
                    <h4 className="font-semibold">Análisis Neurocognitivo</h4>
                    <p className="text-sm text-muted-foreground">
                      Evaluación especializada de capacidades cognitivas y preferencias
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Características Técnicas */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-primary" />
                    Seguridad y Privacidad
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium">Encriptación End-to-End</h4>
                      <p className="text-sm text-muted-foreground">
                        Todos los datos están protegidos con encriptación AES-256
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium">Cumplimiento GDPR</h4>
                      <p className="text-sm text-muted-foreground">
                        Totalmente compatible con regulaciones de protección de datos
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium">Anonimización</h4>
                      <p className="text-sm text-muted-foreground">
                        Los datos se anonimizan para análisis agregados
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="h-5 w-5 text-primary" />
                    Rendimiento y Escalabilidad
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium">Tiempo Real</h4>
                      <p className="text-sm text-muted-foreground">
                        Análisis y adaptación en tiempo real del contenido
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium">Alta Disponibilidad</h4>
                      <p className="text-sm text-muted-foreground">
                        99.9% de uptime garantizado con redundancia
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium">Escalabilidad</h4>
                      <p className="text-sm text-muted-foreground">
                        Arquitectura cloud que se adapta a la demanda
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* APIs y Integraciones */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5 text-primary" />
                  APIs y Integraciones
                </CardTitle>
                <CardDescription>
                  Conectividad con sistemas externos para una experiencia completa
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 rounded-lg bg-muted/50">
                    <h4 className="font-medium text-sm">AWS Services</h4>
                    <p className="text-xs text-muted-foreground mt-1">OCR, NLP, ML</p>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-muted/50">
                    <h4 className="font-medium text-sm">Runware</h4>
                    <p className="text-xs text-muted-foreground mt-1">Procesamiento IA</p>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-muted/50">
                    <h4 className="font-medium text-sm">Lingo.dev</h4>
                    <p className="text-xs text-muted-foreground mt-1">Modo Pictográfico</p>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-muted/50">
                    <h4 className="font-medium text-sm">n8n/Hookdeck</h4>
                    <p className="text-xs text-muted-foreground mt-1">Automatización</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* AWS Bedrock Demo Integration */}
        <div className="mt-12">
          <BedrockDemo showTitle={true} />
        </div>


        {/* CTA Final */}
        <Card className="mt-12 bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20">
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">¿Listo para experimentar el PEI Engine?</h2>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Descubre cómo nuestro motor de individualización puede transformar tu experiencia de aprendizaje 
              y acelerar tu progreso académico de manera personalizada.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/registro">
                <Button size="lg" className="group bg-gradient-hero">
                  Crear mi Perfil NeuroAcadémico
                  <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link to="/dashboard">
                <Button variant="outline" size="lg" className="group">
                  <TrendingUp className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform" />
                  Ver Dashboard
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </main>
      
      <Footer />
    </div>
  );
};

export default PEIEngine;
