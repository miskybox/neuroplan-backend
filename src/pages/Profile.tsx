import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Brain, 
  User, 
  GraduationCap, 
  Target, 
  Edit3, 
  Save, 
  X,
  CheckCircle2,
  Clock,
  Award,
  BookOpen,
  TrendingUp,
  FileText,
  Settings,
  Eye,
  EyeOff,
  FileCheck
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

const Profile = () => {
  const { user, updateUser } = useAuth();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [showSensitiveData, setShowSensitiveData] = useState(false);
  
  const [editData, setEditData] = useState({
    nombre: user?.nombre || "",
    apellidos: user?.apellidos || "",
    email: user?.email || "",
    telefono: "",
    fechaNacimiento: "",
    nivelActual: user?.perfilNeuroAcademico?.nivelActual || "",
    objetivosAcademicos: user?.perfilNeuroAcademico?.objetivosAcademicos || "",
    fortalezas: user?.perfilNeuroAcademico?.fortalezas || [],
    areasApoyo: user?.perfilNeuroAcademico?.areasApoyo || [],
    preferenciasSensoriales: user?.perfilNeuroAcademico?.preferenciasSensoriales || [],
  });

  const nivelesAcademicos = [
    "ESO (1º-4º)",
    "Bachillerato",
    "FP Básica",
    "FP Grado Medio",
    "FP Grado Superior",
    "Universidad",
    "Otro"
  ];

  const fortalezasCognitivas = [
    "Memoria visual",
    "Memoria auditiva",
    "Pensamiento lógico",
    "Creatividad",
    "Atención al detalle",
    "Pensamiento abstracto",
    "Habilidades espaciales",
    "Comunicación verbal",
    "Trabajo en equipo",
    "Liderazgo"
  ];

  const areasApoyo = [
    "Lectura",
    "Escritura",
    "Matemáticas",
    "Atención",
    "Organización",
    "Memoria",
    "Comunicación social",
    "Regulación emocional",
    "Motricidad fina",
    "Procesamiento sensorial"
  ];

  const preferenciasSensoriales = [
    "Visual",
    "Auditivo",
    "Kinestésico",
    "Lectura/escritura",
    "Multimedia",
    "Interactivo",
    "Estructurado",
    "Flexible"
  ];

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    // Actualizar el usuario con los nuevos datos
    updateUser({
      nombre: editData.nombre,
      apellidos: editData.apellidos,
      email: editData.email,
      perfilNeuroAcademico: {
        nivelActual: editData.nivelActual,
        objetivosAcademicos: editData.objetivosAcademicos,
        fortalezas: editData.fortalezas,
        areasApoyo: editData.areasApoyo,
        preferenciasSensoriales: editData.preferenciasSensoriales,
      }
    });

    setIsEditing(false);
    toast({
      title: "Perfil actualizado",
      description: "Tu Perfil NeuroAcadémico ha sido actualizado correctamente",
    });
  };

  const handleCancel = () => {
    setEditData({
      nombre: user?.nombre || "",
      apellidos: user?.apellidos || "",
      email: user?.email || "",
      telefono: "",
      fechaNacimiento: "",
      nivelActual: user?.perfilNeuroAcademico?.nivelActual || "",
      objetivosAcademicos: user?.perfilNeuroAcademico?.objetivosAcademicos || "",
      fortalezas: user?.perfilNeuroAcademico?.fortalezas || [],
      areasApoyo: user?.perfilNeuroAcademico?.areasApoyo || [],
      preferenciasSensoriales: user?.perfilNeuroAcademico?.preferenciasSensoriales || [],
    });
    setIsEditing(false);
  };

  const handleArrayToggle = (field: string, value: string) => {
    setEditData(prev => {
      const currentArray = prev[field as keyof typeof prev] as string[];
      const newArray = currentArray.includes(value)
        ? currentArray.filter(item => item !== value)
        : [...currentArray, value];
      return { ...prev, [field]: newArray };
    });
  };

  const progressValue = 75; // Simular progreso del perfil

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header del Perfil */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold">
                  Mi{" "}
                  <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                    Perfil NeuroAcadémico
                  </span>
                </h1>
                <p className="text-muted-foreground mt-2">
                  Gestiona tu información personal y académica para optimizar tu aprendizaje
                </p>
              </div>
              
              <div className="flex items-center gap-3">
                {isEditing ? (
                  <>
                    <Button variant="outline" onClick={handleCancel} className="flex items-center gap-2">
                      <X className="h-4 w-4" />
                      Cancelar
                    </Button>
                    <Button onClick={handleSave} className="flex items-center gap-2 bg-gradient-hero">
                      <Save className="h-4 w-4" />
                      Guardar
                    </Button>
                  </>
                ) : (
                  <Button onClick={handleEdit} className="flex items-center gap-2">
                    <Edit3 className="h-4 w-4" />
                    Editar perfil
                  </Button>
                )}
              </div>
            </div>

            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Completitud del perfil</span>
                <span className="text-sm text-muted-foreground">{progressValue}%</span>
              </div>
              <Progress value={progressValue} className="h-2" />
            </div>
          </div>

          {/* Tabs del Perfil */}
          <Tabs defaultValue="personal" className="space-y-6">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="personal" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Personal
              </TabsTrigger>
              <TabsTrigger value="neurocognitivo" className="flex items-center gap-2">
                <Brain className="h-4 w-4" />
                Neurocognitivo
              </TabsTrigger>
              <TabsTrigger value="academico" className="flex items-center gap-2">
                <GraduationCap className="h-4 w-4" />
                Académico
              </TabsTrigger>
              <TabsTrigger value="progreso" className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Progreso
              </TabsTrigger>
              <TabsTrigger value="pei" className="flex items-center gap-2">
                <FileCheck className="h-4 w-4" />
                PEI
              </TabsTrigger>
            </TabsList>

            {/* Tab: Información Personal */}
            <TabsContent value="personal" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Información Personal
                  </CardTitle>
                  <CardDescription>
                    Datos básicos de tu perfil de usuario
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="nombre">Nombre</Label>
                      {isEditing ? (
                        <Input
                          id="nombre"
                          value={editData.nombre}
                          onChange={(e) => setEditData(prev => ({ ...prev, nombre: e.target.value }))}
                        />
                      ) : (
                        <div className="p-3 bg-muted/50 rounded-md">{user.nombre}</div>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="apellidos">Apellidos</Label>
                      {isEditing ? (
                        <Input
                          id="apellidos"
                          value={editData.apellidos}
                          onChange={(e) => setEditData(prev => ({ ...prev, apellidos: e.target.value }))}
                        />
                      ) : (
                        <div className="p-3 bg-muted/50 rounded-md">{user.apellidos}</div>
                      )}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    {isEditing ? (
                      <Input
                        id="email"
                        type="email"
                        value={editData.email}
                        onChange={(e) => setEditData(prev => ({ ...prev, email: e.target.value }))}
                      />
                    ) : (
                      <div className="p-3 bg-muted/50 rounded-md">{user.email}</div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Tab: Perfil Neurocognitivo */}
            <TabsContent value="neurocognitivo" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Fortalezas Cognitivas */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Brain className="h-5 w-5" />
                      Fortalezas Cognitivas
                    </CardTitle>
                    <CardDescription>
                      Áreas donde destacas naturalmente
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {isEditing ? (
                      <div className="space-y-2">
                        {fortalezasCognitivas.map((fortaleza) => (
                          <div key={fortaleza} className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              id={fortaleza}
                              checked={editData.fortalezas.includes(fortaleza)}
                              onChange={() => handleArrayToggle("fortalezas", fortaleza)}
                              className="rounded"
                            />
                            <Label htmlFor={fortaleza} className="text-sm">{fortaleza}</Label>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        {user.perfilNeuroAcademico?.fortalezas.map((fortaleza) => (
                          <Badge key={fortaleza} variant="secondary" className="flex items-center gap-1">
                            <CheckCircle2 className="h-3 w-3" />
                            {fortaleza}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Áreas de Apoyo */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="h-5 w-5" />
                      Áreas de Apoyo
                    </CardTitle>
                    <CardDescription>
                      Áreas donde necesitas apoyo adicional
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {isEditing ? (
                      <div className="space-y-2">
                        {areasApoyo.map((area) => (
                          <div key={area} className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              id={area}
                              checked={editData.areasApoyo.includes(area)}
                              onChange={() => handleArrayToggle("areasApoyo", area)}
                              className="rounded"
                            />
                            <Label htmlFor={area} className="text-sm">{area}</Label>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        {user.perfilNeuroAcademico?.areasApoyo.map((area) => (
                          <Badge key={area} variant="outline" className="flex items-center gap-1">
                            <Target className="h-3 w-3" />
                            {area}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Preferencias de Aprendizaje */}
                <Card className="lg:col-span-2">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BookOpen className="h-5 w-5" />
                      Preferencias de Aprendizaje
                    </CardTitle>
                    <CardDescription>
                      Estilos de aprendizaje que mejor se adaptan a ti
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {isEditing ? (
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                        {preferenciasSensoriales.map((preferencia) => (
                          <div key={preferencia} className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              id={preferencia}
                              checked={editData.preferenciasSensoriales.includes(preferencia)}
                              onChange={() => handleArrayToggle("preferenciasSensoriales", preferencia)}
                              className="rounded"
                            />
                            <Label htmlFor={preferencia} className="text-sm">{preferencia}</Label>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        {user.perfilNeuroAcademico?.preferenciasSensoriales.map((preferencia) => (
                          <Badge key={preferencia} variant="default" className="flex items-center gap-1">
                            <BookOpen className="h-3 w-3" />
                            {preferencia}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Tab: Información Académica */}
            <TabsContent value="academico" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <GraduationCap className="h-5 w-5" />
                    Información Académica
                  </CardTitle>
                  <CardDescription>
                    Tu situación académica actual y objetivos
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="nivelActual">Nivel académico actual</Label>
                    {isEditing ? (
                      <Select value={editData.nivelActual} onValueChange={(value) => setEditData(prev => ({ ...prev, nivelActual: value }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona tu nivel actual" />
                        </SelectTrigger>
                        <SelectContent>
                          {nivelesAcademicos.map((nivel) => (
                            <SelectItem key={nivel} value={nivel}>
                              {nivel}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      <div className="p-3 bg-muted/50 rounded-md flex items-center gap-2">
                        <GraduationCap className="h-4 w-4 text-primary" />
                        {user.perfilNeuroAcademico?.nivelActual}
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="objetivosAcademicos">Objetivos académicos</Label>
                    {isEditing ? (
                      <Textarea
                        id="objetivosAcademicos"
                        value={editData.objetivosAcademicos}
                        onChange={(e) => setEditData(prev => ({ ...prev, objetivosAcademicos: e.target.value }))}
                        placeholder="Describe tus objetivos académicos y profesionales..."
                        rows={4}
                      />
                    ) : (
                      <div className="p-3 bg-muted/50 rounded-md">
                        {user.perfilNeuroAcademico?.objetivosAcademicos}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Tab: Progreso */}
            <TabsContent value="progreso" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Clock className="h-5 w-5" />
                      Tiempo de Estudio
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-primary">24h</div>
                    <p className="text-sm text-muted-foreground">Esta semana</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Award className="h-5 w-5" />
                      Logros
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-secondary">12</div>
                    <p className="text-sm text-muted-foreground">Completados</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5" />
                      Progreso
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-accent">68%</div>
                    <p className="text-sm text-muted-foreground">Del itinerario</p>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Pasaporte Educativo Inteligente (PEI)
                  </CardTitle>
                  <CardDescription>
                    Tu documento digital verificable para la titulación oficial
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <FileText className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h4 className="font-medium">PEI Digital</h4>
                          <p className="text-sm text-muted-foreground">Documento verificable</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        Ver documento
                      </Button>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center p-3 bg-muted/30 rounded-lg">
                        <div className="text-lg font-bold text-primary">LOMLOE</div>
                        <div className="text-xs text-muted-foreground">Compliant</div>
                      </div>
                      <div className="text-center p-3 bg-muted/30 rounded-lg">
                        <div className="text-lg font-bold text-secondary">CRUE</div>
                        <div className="text-xs text-muted-foreground">Validado</div>
                      </div>
                      <div className="text-center p-3 bg-muted/30 rounded-lg">
                        <div className="text-lg font-bold text-accent">MECES</div>
                        <div className="text-xs text-muted-foreground">Alineado</div>
                      </div>
                      <div className="text-center p-3 bg-muted/30 rounded-lg">
                        <div className="text-lg font-bold text-success">100%</div>
                        <div className="text-xs text-muted-foreground">Titulación</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Tab: PEI */}
            <TabsContent value="pei" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileCheck className="h-5 w-5" />
                    Pasaporte Educativo Inteligente
                  </CardTitle>
                  <CardDescription>
                    Accede a tu PEI generado y gestiona tu perfil educativo
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card className="border-primary/20">
                      <CardHeader>
                        <CardTitle className="text-lg">Ver PEI Generado</CardTitle>
                        <CardDescription>
                          Accede a tu Pasaporte Educativo Inteligente actual
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Link to="/pei-result">
                          <Button className="w-full bg-gradient-hero">
                            <FileCheck className="h-4 w-4 mr-2" />
                            Ver mi PEI
                          </Button>
                        </Link>
                      </CardContent>
                    </Card>

                    <Card className="border-secondary/20">
                      <CardHeader>
                        <CardTitle className="text-lg">Generar Nuevo PEI</CardTitle>
                        <CardDescription>
                          Crea un nuevo PEI basado en tu perfil actual
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Link to="/generate-pei">
                          <Button variant="outline" className="w-full">
                            <Target className="h-4 w-4 mr-2" />
                            Generar PEI
                          </Button>
                        </Link>
                      </CardContent>
                    </Card>
                  </div>

                  <Card>
                    <CardHeader>
                      <CardTitle>Información del PEI</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="text-center p-4 bg-muted/50 rounded-lg">
                          <div className="text-2xl font-bold text-primary">1</div>
                          <div className="text-sm text-muted-foreground">PEI Activo</div>
                        </div>
                        <div className="text-center p-4 bg-muted/50 rounded-lg">
                          <div className="text-2xl font-bold text-primary">2024</div>
                          <div className="text-sm text-muted-foreground">Año de Generación</div>
                        </div>
                        <div className="text-center p-4 bg-muted/50 rounded-lg">
                          <div className="text-2xl font-bold text-primary">365</div>
                          <div className="text-sm text-muted-foreground">Días de Validez</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Profile;
