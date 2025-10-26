import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Brain, Sparkles, FileText, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { bedrockService, healthService } from '../services/neuroplanApi';
import { toast } from 'sonner';

interface BedrockDemoProps {
  showTitle?: boolean;
}

export const BedrockDemo: React.FC<BedrockDemoProps> = ({ showTitle = true }) => {
  const [backendConnected, setBackendConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [models, setModels] = useState<any[]>([]);
  const [simplifiedText, setSimplifiedText] = useState('');
  const [generatedPEI, setGeneratedPEI] = useState<any>(null);

  // Form states
  const [textToSimplify, setTextToSimplify] = useState(
    'El proceso de fotosíntesis es un mecanismo bioquímico mediante el cual las plantas convierten la energía lumínica en energía química.'
  );
  const [targetLevel, setTargetLevel] = useState('elementary');
  
  const [peiData, setPeiData] = useState({
    studentName: 'Ana Perez',
    gradeLevel: '5th grade',
    diagnosis: ['Dyslexia'],
    symptoms: ['Reading difficulty', 'Slow decoding'],
    strengths: ['High motivation', 'Family support']
  });

  useEffect(() => {
    checkConnection();
  }, []);

  const checkConnection = async () => {
    try {
      await healthService.check();
      setBackendConnected(true);
      toast.success('Conectado al backend AWS Bedrock');
    } catch (error) {
      setBackendConnected(false);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      toast.warning('Backend no disponible - Modo demo: ' + errorMessage);
    }
  };

  const loadModels = async () => {
    setIsLoading(true);
    try {
      const response = await bedrockService.getModels();
      setModels(response.data || []);
      toast.success(`${response.data.length} modelos cargados`);
    } catch (error: any) {
      toast.error('Error al cargar modelos: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSimplifyContent = async () => {
    if (!textToSimplify.trim()) {
      toast.error('Por favor ingresa un texto para simplificar');
      return;
    }

    setIsLoading(true);
    try {
      const response = await bedrockService.simplifyContent({
        text: textToSimplify,
        targetLevel
      });
      
      setSimplifiedText(response.data.simplifiedText || response.data.result || JSON.stringify(response.data, null, 2));
      toast.success('Texto simplificado exitosamente');
    } catch (error: any) {
      toast.error('Error al simplificar: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGeneratePEI = async () => {
    if (!peiData.studentName.trim()) {
      toast.error('Por favor ingresa el nombre del estudiante');
      return;
    }

    setIsLoading(true);
    try {
      const response = await bedrockService.generatePEI(peiData);
      
      setGeneratedPEI(response.data);
      toast.success('PEI generado exitosamente con AWS Bedrock');
    } catch (error: any) {
      toast.error('Error al generar PEI: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {showTitle && (
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold flex items-center gap-2">
              <Brain className="h-8 w-8 text-primary" />
              AWS Bedrock Demo
            </h2>
            <p className="text-muted-foreground mt-2">
              Generación de PEIs y simplificación de contenido con IA
            </p>
          </div>
          <Badge variant={backendConnected ? "default" : "secondary"}>
            {backendConnected ? '✅ Conectado' : '⚠️ Demo'}
          </Badge>
        </div>
      )}

      <Tabs defaultValue="models" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="models">
            <Sparkles className="h-4 w-4 mr-2" />
            Modelos
          </TabsTrigger>
          <TabsTrigger value="simplify">
            <FileText className="h-4 w-4 mr-2" />
            Simplificar
          </TabsTrigger>
          <TabsTrigger value="pei">
            <Brain className="h-4 w-4 mr-2" />
            Generar PEI
          </TabsTrigger>
        </TabsList>

        {/* Tab: Modelos */}
        <TabsContent value="models" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Modelos Disponibles</CardTitle>
              <CardDescription>
                Lista de modelos de AWS Bedrock configurados para NeuroPlan
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={loadModels} 
                disabled={isLoading || !backendConnected}
                className="mb-4"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Cargando...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 mr-2" />
                    Cargar Modelos
                  </>
                )}
              </Button>

              {models.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {models.map((model, index) => (
                    <Card key={`${model.name || model.modelId}-${index}`} className="border-2">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="font-semibold">{model.name || model.modelId}</h4>
                            <p className="text-sm text-muted-foreground">
                              {model.provider || 'AWS Bedrock'}
                            </p>
                            {model.status && (
                              <Badge variant="outline" className="mt-2">
                                {model.status}
                              </Badge>
                            )}
                          </div>
                          <CheckCircle2 className="h-5 w-5 text-green-600" />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab: Simplificar Contenido */}
        <TabsContent value="simplify" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Simplificación de Contenido</CardTitle>
              <CardDescription>
                Adapta textos complejos al nivel de comprensión del estudiante
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label htmlFor="textToSimplify" className="block text-sm font-medium mb-2">
                  Texto Original
                </label>
                <textarea
                  id="textToSimplify"
                  value={textToSimplify}
                  onChange={(e) => setTextToSimplify(e.target.value)}
                  className="w-full p-3 border rounded-lg min-h-[100px]"
                  placeholder="Ingresa el texto a simplificar..."
                />
              </div>

              <div>
                <label htmlFor="targetLevel" className="block text-sm font-medium mb-2">
                  Nivel de Simplificación
                </label>
                <select
                  id="targetLevel"
                  value={targetLevel}
                  onChange={(e) => setTargetLevel(e.target.value)}
                  className="w-full p-3 border rounded-lg"
                >
                  <option value="elementary">Primaria</option>
                  <option value="middle">Secundaria</option>
                  <option value="simple">Simple</option>
                </select>
              </div>

              <Button 
                onClick={handleSimplifyContent}
                disabled={isLoading || !backendConnected}
                className="w-full"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Simplificando...
                  </>
                ) : (
                  <>
                    <FileText className="h-4 w-4 mr-2" />
                    Simplificar Texto
                  </>
                )}
              </Button>

              {simplifiedText && (
                <Card className="bg-green-50 border-green-200">
                  <CardContent className="p-4">
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <CheckCircle2 className="h-5 w-5 text-green-600" />
                      Texto Simplificado
                    </h4>
                    <p className="text-sm whitespace-pre-wrap">{simplifiedText}</p>
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab: Generar PEI */}
        <TabsContent value="pei" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Generación de PEI con AWS Bedrock</CardTitle>
              <CardDescription>
                Crea un Plan Educativo Individualizado completo y personalizado
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="peiStudentName" className="block text-sm font-medium mb-2">
                    Nombre del Estudiante
                  </label>
                  <input
                    id="peiStudentName"
                    type="text"
                    value={peiData.studentName}
                    onChange={(e) => setPeiData({ ...peiData, studentName: e.target.value })}
                    className="w-full p-3 border rounded-lg"
                    placeholder="Ej: Ana Perez"
                  />
                </div>

                <div>
                  <label htmlFor="peiGradeLevel" className="block text-sm font-medium mb-2">
                    Nivel Escolar
                  </label>
                  <input
                    id="peiGradeLevel"
                    type="text"
                    value={peiData.gradeLevel}
                    onChange={(e) => setPeiData({ ...peiData, gradeLevel: e.target.value })}
                    className="w-full p-3 border rounded-lg"
                    placeholder="Ej: 5th grade"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="peiDiagnosis" className="block text-sm font-medium mb-2">
                  Diagnóstico (separado por comas)
                </label>
                <input
                  id="peiDiagnosis"
                  type="text"
                  value={peiData.diagnosis.join(', ')}
                  onChange={(e) => setPeiData({ 
                    ...peiData, 
                    diagnosis: e.target.value.split(',').map(s => s.trim()) 
                  })}
                  className="w-full p-3 border rounded-lg"
                  placeholder="Ej: Dyslexia, ADHD"
                />
              </div>

              <div>
                <label htmlFor="peiSymptoms" className="block text-sm font-medium mb-2">
                  Síntomas (separado por comas)
                </label>
                <input
                  id="peiSymptoms"
                  type="text"
                  value={peiData.symptoms.join(', ')}
                  onChange={(e) => setPeiData({ 
                    ...peiData, 
                    symptoms: e.target.value.split(',').map(s => s.trim()) 
                  })}
                  className="w-full p-3 border rounded-lg"
                  placeholder="Ej: Reading difficulty, Slow decoding"
                />
              </div>

              <div>
                <label htmlFor="peiStrengths" className="block text-sm font-medium mb-2">
                  Fortalezas (separado por comas)
                </label>
                <input
                  id="peiStrengths"
                  type="text"
                  value={peiData.strengths.join(', ')}
                  onChange={(e) => setPeiData({ 
                    ...peiData, 
                    strengths: e.target.value.split(',').map(s => s.trim()) 
                  })}
                  className="w-full p-3 border rounded-lg"
                  placeholder="Ej: High motivation, Family support"
                />
              </div>

              <Button 
                onClick={handleGeneratePEI}
                disabled={isLoading || !backendConnected}
                className="w-full"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Generando PEI...
                  </>
                ) : (
                  <>
                    <Brain className="h-4 w-4 mr-2" />
                    Generar PEI Completo
                  </>
                )}
              </Button>

              {generatedPEI && (
                <Card className="bg-blue-50 border-blue-200">
                  <CardContent className="p-4">
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <CheckCircle2 className="h-5 w-5 text-blue-600" />
                      PEI Generado Exitosamente
                    </h4>
                    <div className="space-y-2 text-sm">
                      <pre className="bg-white p-4 rounded-lg overflow-x-auto max-h-[400px]">
                        {JSON.stringify(generatedPEI, null, 2)}
                      </pre>
                    </div>
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {!backendConnected && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
              <div>
                <h4 className="font-semibold text-yellow-900">Modo Demo</h4>
                <p className="text-sm text-yellow-800">
                  El backend no está disponible. Asegúrate de que esté ejecutándose en{' '}
                  <code className="mx-1 px-2 py-1 bg-yellow-100 rounded">http://localhost:3001</code>{' '}
                  para probar las funcionalidades reales.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};