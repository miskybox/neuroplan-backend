import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { DatePicker } from "@/components/ui/date-picker";
import { PhoneInput } from "@/components/ui/phone-input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  Brain, 
  FileText, 
  Target, 
  GraduationCap, 
  ArrowRight, 
  ArrowLeft,
  Upload,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface FormData {
  // Información personal
  nombre: string;
  apellidos: string;
  email: string;
  telefono: string;
  fechaNacimiento: string;
  
  // Información académica
  nivelActual: string;
  objetivosAcademicos: string;
  intereses: string[];
  
  // Información neurocognitiva
  diagnostico: string;
  fortalezas: string[];
  areasApoyo: string[];
  preferenciasSensoriales: string[];
  
  // Documentación
  informesClinicos: File | null;
  documentosAcademicos: File | null;
  
  // Configuración de cuenta
  password: string;
  confirmPassword: string;
  terminos: boolean;
  privacidad: boolean;
}

const Register = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { toast } = useToast();
  
  const [formData, setFormData] = useState<FormData>({
    nombre: "",
    apellidos: "",
    email: "",
    telefono: "",
    fechaNacimiento: "",
    nivelActual: "",
    objetivosAcademicos: "",
    intereses: [],
    diagnostico: "",
    fortalezas: [],
    areasApoyo: [],
    preferenciasSensoriales: [],
    informesClinicos: null,
    documentosAcademicos: null,
    password: "",
    confirmPassword: "",
    terminos: false,
    privacidad: false,
  });

  const steps = [
    { id: 1, title: "Información Personal", icon: FileText },
    { id: 2, title: "Perfil Académico", icon: GraduationCap },
    { id: 3, title: "Perfil Neurocognitivo", icon: Brain },
    { id: 4, title: "Documentación", icon: Upload },
    { id: 5, title: "Configuración", icon: Target },
  ];

  const nivelesAcademicos = [
    "ESO (1º-4º)",
    "Bachillerato",
    "FP Básica",
    "FP Grado Medio",
    "FP Grado Superior",
    "Universidad",
    "Otro"
  ];

  const interesesAcademicos = [
    "Ciencias",
    "Tecnología",
    "Arte y Diseño",
    "Humanidades",
    "Ciencias Sociales",
    "Salud",
    "Deportes",
    "Música",
    "Idiomas",
    "Matemáticas"
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

  const handleInputChange = (field: keyof FormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleArrayToggle = (field: keyof FormData, value: string) => {
    setFormData(prev => {
      const currentArray = prev[field] as string[];
      const newArray = currentArray.includes(value)
        ? currentArray.filter(item => item !== value)
        : [...currentArray, value];
      return { ...prev, [field]: newArray };
    });
  };

  const handleFileUpload = (field: keyof FormData, file: File) => {
    setFormData(prev => ({
      ...prev,
      [field]: file
    }));
  };

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    // Validaciones finales
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Error",
        description: "Las contraseñas no coinciden",
        variant: "destructive",
      });
      return;
    }

    if (!formData.terminos || !formData.privacidad) {
      toast({
        title: "Error",
        description: "Debes aceptar los términos y condiciones",
        variant: "destructive",
      });
      return;
    }

    // Aquí iría la lógica para enviar los datos al backend
    console.log("Datos del formulario:", formData);
    
    toast({
      title: "¡Perfil NeuroAcadémico creado!",
      description: "Tu perfil ha sido procesado por nuestro PEI Engine. Recibirás un email con los próximos pasos.",
    });
  };

  const progress = (currentStep / steps.length) * 100;

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nombre">Nombre *</Label>
                <Input
                  id="nombre"
                  value={formData.nombre}
                  onChange={(e) => handleInputChange("nombre", e.target.value)}
                  placeholder="Tu nombre"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="apellidos">Apellidos *</Label>
                <Input
                  id="apellidos"
                  value={formData.apellidos}
                  onChange={(e) => handleInputChange("apellidos", e.target.value)}
                  placeholder="Tus apellidos"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                placeholder="tu@email.com"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <PhoneInput
                label="Teléfono"
                value={formData.telefono}
                onChange={(phone) => handleInputChange("telefono", phone)}
                placeholder="Número de teléfono"
              />
              <DatePicker
                label="Fecha de nacimiento *"
                value={formData.fechaNacimiento}
                onChange={(date) => handleInputChange("fechaNacimiento", date)}
                placeholder="Selecciona tu fecha de nacimiento"
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="nivelActual">Nivel académico actual *</Label>
              <Select value={formData.nivelActual} onValueChange={(value) => handleInputChange("nivelActual", value)}>
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
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="objetivosAcademicos">Objetivos académicos *</Label>
              <Textarea
                id="objetivosAcademicos"
                value={formData.objetivosAcademicos}
                onChange={(e) => handleInputChange("objetivosAcademicos", e.target.value)}
                placeholder="Describe tus objetivos académicos y profesionales..."
                rows={4}
              />
            </div>
            
            <div className="space-y-3">
              <Label>Áreas de interés académico</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {interesesAcademicos.map((interes) => (
                  <div key={interes} className="flex items-center space-x-2">
                    <Checkbox
                      id={interes}
                      checked={formData.intereses.includes(interes)}
                      onCheckedChange={() => handleArrayToggle("intereses", interes)}
                    />
                    <Label htmlFor={interes} className="text-sm">{interes}</Label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="diagnostico">Diagnóstico o información neurocognitiva</Label>
              <Textarea
                id="diagnostico"
                value={formData.diagnostico}
                onChange={(e) => handleInputChange("diagnostico", e.target.value)}
                placeholder="Información sobre diagnóstico, características neurocognitivas, etc. (opcional)"
                rows={3}
              />
            </div>
            
            <div className="space-y-3">
              <Label>Fortalezas cognitivas</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {fortalezasCognitivas.map((fortaleza) => (
                  <div key={fortaleza} className="flex items-center space-x-2">
                    <Checkbox
                      id={fortaleza}
                      checked={formData.fortalezas.includes(fortaleza)}
                      onCheckedChange={() => handleArrayToggle("fortalezas", fortaleza)}
                    />
                    <Label htmlFor={fortaleza} className="text-sm">{fortaleza}</Label>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="space-y-3">
              <Label>Áreas que requieren apoyo</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {areasApoyo.map((area) => (
                  <div key={area} className="flex items-center space-x-2">
                    <Checkbox
                      id={area}
                      checked={formData.areasApoyo.includes(area)}
                      onCheckedChange={() => handleArrayToggle("areasApoyo", area)}
                    />
                    <Label htmlFor={area} className="text-sm">{area}</Label>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="space-y-3">
              <Label>Preferencias de aprendizaje</Label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {preferenciasSensoriales.map((preferencia) => (
                  <div key={preferencia} className="flex items-center space-x-2">
                    <Checkbox
                      id={preferencia}
                      checked={formData.preferenciasSensoriales.includes(preferencia)}
                      onCheckedChange={() => handleArrayToggle("preferenciasSensoriales", preferencia)}
                    />
                    <Label htmlFor={preferencia} className="text-sm">{preferencia}</Label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="informesClinicos">Informes clínicos (opcional)</Label>
                <div className="flex items-center gap-4">
                  <Input
                    id="informesClinicos"
                    type="file"
                    accept=".pdf,.doc,.docx,.jpg,.png"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleFileUpload("informesClinicos", file);
                    }}
                    className="flex-1"
                  />
                  {formData.informesClinicos && (
                    <Badge variant="secondary" className="flex items-center gap-1">
                      <CheckCircle2 className="h-3 w-3" />
                      {formData.informesClinicos.name}
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">
                  Sube informes médicos, psicológicos o educativos que puedan ayudar a crear tu perfil
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="documentosAcademicos">Documentos académicos (opcional)</Label>
                <div className="flex items-center gap-4">
                  <Input
                    id="documentosAcademicos"
                    type="file"
                    accept=".pdf,.doc,.docx,.jpg,.png"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleFileUpload("documentosAcademicos", file);
                    }}
                    className="flex-1"
                  />
                  {formData.documentosAcademicos && (
                    <Badge variant="secondary" className="flex items-center gap-1">
                      <CheckCircle2 className="h-3 w-3" />
                      {formData.documentosAcademicos.name}
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">
                  Certificados, boletines de notas, informes escolares, etc.
                </p>
              </div>
            </div>
            
            <div className="bg-muted/50 p-4 rounded-lg">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-primary mt-0.5" />
                <div className="space-y-2">
                  <h4 className="font-medium">Procesamiento seguro con IA</h4>
                  <p className="text-sm text-muted-foreground">
                    Nuestro PEI Engine utiliza OCR/NLP para extraer información relevante de tus documentos 
                    de forma segura y confidencial. Los datos se procesan localmente y se eliminan después del análisis.
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="password">Contraseña *</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) => handleInputChange("password", e.target.value)}
                  placeholder="Mínimo 8 caracteres"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmar contraseña *</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                  placeholder="Repite tu contraseña"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <Checkbox
                  id="terminos"
                  checked={formData.terminos}
                  onCheckedChange={(checked) => handleInputChange("terminos", checked)}
                />
                <div className="space-y-1">
                  <Label htmlFor="terminos" className="text-sm">
                    Acepto los{" "}
                    <a href="#" className="text-primary hover:underline">
                      términos y condiciones
                    </a>{" "}
                    del servicio *
                  </Label>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <Checkbox
                  id="privacidad"
                  checked={formData.privacidad}
                  onCheckedChange={(checked) => handleInputChange("privacidad", checked)}
                />
                <div className="space-y-1">
                  <Label htmlFor="privacidad" className="text-sm">
                    Acepto la{" "}
                    <a href="#" className="text-primary hover:underline">
                      política de privacidad
                    </a>{" "}
                    y el procesamiento de mis datos *
                  </Label>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container py-12">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center space-y-4 mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium">
              <Brain className="h-4 w-4" />
              <span>PEI Engine - Motor de Individualización</span>
            </div>
            
            <h1 className="text-3xl md:text-4xl font-bold">
              Crea tu{" "}
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Perfil NeuroAcadémico AI
              </span>
            </h1>
            
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Nuestro PEI Engine analizará tu información para crear un itinerario académico 
              personalizado y homologable que se adapte a tus características neurocognitivas.
            </p>
          </div>

          {/* Progress */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Progreso</span>
              <span className="text-sm text-muted-foreground">
                Paso {currentStep} de {steps.length}
              </span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {/* Steps */}
          <div className="flex justify-center mb-8">
            <div className="flex items-center space-x-4">
              {steps.map((step, index) => {
                const StepIcon = step.icon;
                const isActive = currentStep === step.id;
                const isCompleted = currentStep > step.id;
                
                return (
                  <div key={step.id} className="flex items-center">
                    <div className={`
                      flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all
                      ${isActive 
                        ? 'bg-primary border-primary text-primary-foreground' 
                        : isCompleted 
                          ? 'bg-success border-success text-success-foreground' 
                          : 'bg-background border-muted-foreground/30 text-muted-foreground'
                      }
                    `}>
                      {isCompleted ? (
                        <CheckCircle2 className="h-5 w-5" />
                      ) : (
                        <StepIcon className="h-5 w-5" />
                      )}
                    </div>
                    {index < steps.length - 1 && (
                      <div className={`w-8 h-0.5 mx-2 ${
                        isCompleted ? 'bg-success' : 'bg-muted-foreground/30'
                      }`} />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Form Card */}
          <Card className="shadow-elegant">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {React.createElement(steps[currentStep - 1].icon, { className: "h-5 w-5" })}
                {steps[currentStep - 1].title}
              </CardTitle>
              <CardDescription>
                {currentStep === 1 && "Información básica para crear tu perfil"}
                {currentStep === 2 && "Define tus objetivos académicos y áreas de interés"}
                {currentStep === 3 && "Información neurocognitiva para personalización"}
                {currentStep === 4 && "Documentos que ayuden a nuestro PEI Engine"}
                {currentStep === 5 && "Configura tu cuenta y acepta los términos"}
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {renderStepContent()}
              
              {/* Navigation */}
              <div className="flex justify-between pt-6 border-t">
                <Button
                  variant="outline"
                  onClick={prevStep}
                  disabled={currentStep === 1}
                  className="flex items-center gap-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Anterior
                </Button>
                
                {currentStep < steps.length ? (
                  <Button onClick={nextStep} className="flex items-center gap-2">
                    Siguiente
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                ) : (
                  <Button onClick={handleSubmit} className="flex items-center gap-2 bg-gradient-hero">
                    Crear Perfil NeuroAcadémico
                    <Brain className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
          
          {/* Login Link */}
          <div className="text-center mt-6">
            <p className="text-muted-foreground">
              ¿Ya tienes cuenta?{" "}
              <Link 
                to="/login" 
                className="text-primary hover:text-primary/80 font-medium transition-colors"
              >
                Inicia sesión aquí
              </Link>
            </p>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Register;
