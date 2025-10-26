import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Upload, 
  FileText, 
  GraduationCap, 
  Brain, 
  CheckCircle, 
  AlertCircle,
  Download,
  Eye,
  Loader2
} from "lucide-react";

const GeneratePEI = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedGrade, setSelectedGrade] = useState<string>("");
  const [additionalNotes, setAdditionalNotes] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [peiGenerated, setPeiGenerated] = useState(false);
  const [error, setError] = useState<string>("");

  const grades = [
    { value: "infantil-3", label: "Educación Infantil 3 años" },
    { value: "infantil-4", label: "Educación Infantil 4 años" },
    { value: "infantil-5", label: "Educación Infantil 5 años" },
    { value: "primaria-1", label: "1º Primaria" },
    { value: "primaria-2", label: "2º Primaria" },
    { value: "primaria-3", label: "3º Primaria" },
    { value: "primaria-4", label: "4º Primaria" },
    { value: "primaria-5", label: "5º Primaria" },
    { value: "primaria-6", label: "6º Primaria" },
    { value: "secundaria-1", label: "1º ESO" },
    { value: "secundaria-2", label: "2º ESO" },
    { value: "secundaria-3", label: "3º ESO" },
    { value: "secundaria-4", label: "4º ESO" },
    { value: "bachillerato-1", label: "1º Bachillerato" },
    { value: "bachillerato-2", label: "2º Bachillerato" },
    { value: "fp-basica", label: "FP Básica" },
    { value: "fp-grado-medio", label: "FP Grado Medio" },
    { value: "fp-grado-superior", label: "FP Grado Superior" },
    { value: "universidad", label: "Universidad" }
  ];

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validar tipo de archivo
      const allowedTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'image/jpeg',
        'image/png',
        'image/tiff'
      ];
      
      if (!allowedTypes.includes(file.type)) {
        setError("Tipo de archivo no válido. Solo se permiten PDF, Word, JPEG, PNG o TIFF.");
        return;
      }
      
      // Validar tamaño (máximo 10MB)
      if (file.size > 10 * 1024 * 1024) {
        setError("El archivo es demasiado grande. Máximo 10MB.");
        return;
      }
      
      setSelectedFile(file);
      setError("");
    }
  };

  const handleGeneratePEI = async () => {
    if (!selectedFile || !selectedGrade) {
      setError("Por favor, selecciona un archivo y un grado a cursar.");
      return;
    }

    setIsProcessing(true);
    setProgress(0);
    setError("");

    try {
      // Simular procesamiento con progreso
      const steps = [
        "Subiendo archivo...",
        "Extrayendo texto con OCR...",
        "Analizando contenido...",
        "Generando perfil neuroacadémico...",
        "Creando itinerario personalizado...",
        "Generando PEI..."
      ];

      for (let i = 0; i < steps.length; i++) {
        setProgress((i + 1) * (100 / steps.length));
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      setPeiGenerated(true);
    } catch (err) {
      setError("Error al procesar el archivo. Por favor, inténtalo de nuevo.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownloadPEI = () => {
    // Simular descarga del PEI
    const link = document.createElement('a');
    link.href = '#';
    link.download = 'PEI_Generado.pdf';
    link.click();
  };

  const handlePreviewPEI = () => {
    // Simular vista previa del PEI
    window.open('#', '_blank');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Header />
      
      <main className="container mx-auto px-4 py-12">
        {/* Header de la página */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-primary to-secondary shadow-lg">
              <Brain className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Generar PEI
            </h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Sube el informe clínico y selecciona el grado a cursar para generar automáticamente tu Pasaporte Educativo Inteligente
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {!peiGenerated ? (
            <Card className="p-8 bg-white/80 backdrop-blur-sm border-0 shadow-xl">
              <div className="space-y-8">
                {/* Sección de subida de archivo */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3 mb-4">
                    <Upload className="h-6 w-6 text-primary" />
                    <h2 className="text-2xl font-bold">1. Subir Informe Clínico</h2>
                  </div>
                  
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-primary transition-colors">
                    <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <div className="space-y-2">
                      <p className="text-lg font-medium">Arrastra tu archivo aquí o haz clic para seleccionar</p>
                      <p className="text-sm text-muted-foreground">
                        Formatos soportados: PDF, Word, JPEG, PNG, TIFF (máximo 10MB)
                      </p>
                    </div>
                    
                    <Input
                      type="file"
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.tiff"
                      onChange={handleFileChange}
                      className="mt-4"
                    />
                    
                    {selectedFile && (
                      <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
                        <div className="flex items-center gap-2 text-green-700">
                          <CheckCircle className="h-5 w-5" />
                          <span className="font-medium">Archivo seleccionado:</span>
                        </div>
                        <p className="text-sm text-green-600 mt-1">{selectedFile.name}</p>
                        <p className="text-xs text-green-500">
                          Tamaño: {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Sección de selección de grado */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3 mb-4">
                    <GraduationCap className="h-6 w-6 text-primary" />
                    <h2 className="text-2xl font-bold">2. Seleccionar Grado a Cursar</h2>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="grade">Grado/Nivel Educativo</Label>
                    <Select value={selectedGrade} onValueChange={setSelectedGrade}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Selecciona el grado que vas a cursar" />
                      </SelectTrigger>
                      <SelectContent>
                        {grades.map((grade) => (
                          <SelectItem key={grade.value} value={grade.value}>
                            {grade.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Sección de notas adicionales */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3 mb-4">
                    <FileText className="h-6 w-6 text-primary" />
                    <h2 className="text-2xl font-bold">3. Notas Adicionales (Opcional)</h2>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="notes">Información adicional</Label>
                    <Textarea
                      id="notes"
                      placeholder="Agrega cualquier información adicional que consideres relevante para la generación del PEI..."
                      value={additionalNotes}
                      onChange={(e) => setAdditionalNotes(e.target.value)}
                      rows={4}
                    />
                  </div>
                </div>

                {/* Error message */}
                {error && (
                  <Alert className="border-red-200 bg-red-50">
                    <AlertCircle className="h-4 w-4 text-red-600" />
                    <AlertDescription className="text-red-700">
                      {error}
                    </AlertDescription>
                  </Alert>
                )}

                {/* Botón de generación */}
                <div className="pt-6">
                  <Button
                    onClick={handleGeneratePEI}
                    disabled={!selectedFile || !selectedGrade || isProcessing}
                    className="w-full bg-gradient-to-r from-primary to-secondary hover:from-primary-dark hover:to-secondary-dark text-white py-4 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                        Generando PEI...
                      </>
                    ) : (
                      <>
                        <Brain className="h-5 w-5 mr-2" />
                        Generar PEI
                      </>
                    )}
                  </Button>
                </div>

                {/* Barra de progreso */}
                {isProcessing && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Procesando...</span>
                      <span>{Math.round(progress)}%</span>
                    </div>
                    <Progress value={progress} className="h-2" />
                  </div>
                )}
              </div>
            </Card>
          ) : (
            /* Resultado del PEI generado */
            <Card className="p-8 bg-white/80 backdrop-blur-sm border-0 shadow-xl">
              <div className="text-center space-y-6">
                <div className="flex items-center justify-center gap-3 mb-4">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-green-500 to-green-600 shadow-lg">
                    <CheckCircle className="h-8 w-8 text-white" />
                  </div>
                  <h2 className="text-3xl font-bold text-green-600">¡PEI Generado Exitosamente!</h2>
                </div>
                
                <p className="text-lg text-muted-foreground">
                  Tu Pasaporte Educativo Inteligente ha sido creado y está listo para descargar.
                </p>
                
                <div className="grid md:grid-cols-2 gap-4 max-w-md mx-auto">
                  <Button
                    onClick={handleDownloadPEI}
                    className="bg-gradient-to-r from-primary to-secondary hover:from-primary-dark hover:to-secondary-dark text-white py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <Download className="h-5 w-5 mr-2" />
                    Descargar PEI
                  </Button>
                  
                  <Button
                    onClick={handlePreviewPEI}
                    variant="outline"
                    className="py-3 rounded-xl border-2 hover:bg-gray-50 transition-all duration-300"
                  >
                    <Eye className="h-5 w-5 mr-2" />
                    Vista Previa
                  </Button>
                </div>
                
                <div className="pt-6">
                  <Button
                    onClick={() => {
                      setPeiGenerated(false);
                      setSelectedFile(null);
                      setSelectedGrade("");
                      setAdditionalNotes("");
                      setProgress(0);
                      setError("");
                    }}
                    variant="outline"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Generar Nuevo PEI
                  </Button>
                </div>
              </div>
            </Card>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default GeneratePEI;
