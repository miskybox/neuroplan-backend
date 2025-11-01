import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { FileText, Upload, CheckCircle, AlertCircle, Download } from 'lucide-react';
import { useApiRequest } from '../hooks/useApiRequest';

interface PdfAnalysisResult {
  studentId: string;
  analysisType: string;
  extractedText: string;
  analysis: {
    summary: string;
    recommendations: string[];
    keyPoints: string[];
    confidence: number;
  };
  fileInfo: {
    name: string;
    size: number;
    type: string;
  };
  timestamp: string;
  // Indica si la respuesta proviene del análisis básico sin IA (fallback)
  fallback?: boolean;
}

export function PdfUploadComponent() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [analysisResult, setAnalysisResult] = useState<PdfAnalysisResult | null>(null);
  const [analysisType, setAnalysisType] = useState('general');
  const [testingConnection, setTestingConnection] = useState(false);

  // El hook ahora compone http://localhost:3001/api + endpoint
  const { execute: analyzePdf, loading, error } = useApiRequest('/uploads/pdf-analysis');
  const { execute: generatePdf, loading: generatingPdf } = useApiRequest('/uploads/generate-pdf-report');

  const onDrop = (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file?.type === 'application/pdf') {
      setSelectedFile(file);
      setAnalysisResult(null);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    multiple: false,
  });

  const handleAnalyze = async () => {
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('analysisType', analysisType);

    try {
      const result = await analyzePdf<{ success: boolean; analysis: PdfAnalysisResult; message: string }>(formData);
      if (result.success && (result.data as any).analysis) {
        const payload = (result.data as any).analysis;
        setAnalysisResult(payload);
      } else {
        const errorMsg = (result.data as any)?.message || 'Respuesta inesperada del servidor';
        console.error('Respuesta inesperada:', result.data);
        throw new Error(errorMsg);
      }
    } catch (err: any) {
      console.error('Error analyzing PDF:', err);
      const errorMsg = err?.message || 'Error al analizar el PDF. Verifica que el backend esté corriendo.';
      throw new Error(errorMsg);
    }
  };

  const handleDownloadPdf = async () => {
    if (!analysisResult) return;

    try {
      const result = await generatePdf<{ success: boolean; pdfBuffer: string; filename?: string }>({
        analysisData: analysisResult, // ✅ el hook lo serializa a JSON
      });

      const base64 = (result.data as any).pdfBuffer;
      if (!base64) throw new Error('pdfBuffer no presente en la respuesta');

      // Convertir base64 a Blob y descargar
      const byteCharacters = atob(base64);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.codePointAt(i) ?? 0;
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: 'application/pdf' });

      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = (result.data as any).filename || 'informe.pdf';
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Error generating PDF:', err);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleTestConnection = async () => {
    setTestingConnection(true);
    try {
      const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';
      const url = `${baseUrl.replace(/\/+$/, '')}/api/uploads/test`;
      
      const response = await fetch(url);
      const data = await response.json();
      
      if (response.ok && data.success) {
        alert('✅ Conexión exitosa con el backend');
      } else {
        alert('❌ Error: ' + (data.message || 'No se pudo conectar'));
      }
    } catch (err: any) {
      console.error('Error testing connection:', err);
      alert('❌ Error de conexión: ' + (err?.message || 'Verifica que el backend esté corriendo en http://localhost:3001'));
    } finally {
      setTestingConnection(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Análisis de PDF con IA
          </CardTitle>
          <CardDescription>
            Sube un PDF para analizarlo con Ollama y obtener recomendaciones educativas
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
              isDragActive ? 'border-primary bg-primary/5' : 'border-gray-300 hover:border-gray-400'
            }`}
          >
            <input {...getInputProps()} />
            <Upload className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            {isDragActive ? (
              <p className="text-lg">Suelta el archivo PDF aquí...</p>
            ) : (
              <div>
                <p className="text-lg mb-2">Arrastra un PDF aquí o haz clic para seleccionar</p>
                <p className="text-sm text-gray-500">Solo archivos PDF</p>
              </div>
            )}
          </div>

          {selectedFile && (
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <FileText className="h-8 w-8 text-red-500" />
                <div>
                  <p className="font-medium">{selectedFile.name}</p>
                  <p className="text-sm text-gray-500">{formatFileSize(selectedFile.size)}</p>
                </div>
              </div>
              <Badge variant="secondary">PDF</Badge>
            </div>
          )}

          <div className="space-y-2">
            <label htmlFor="analysisTypeSelect" className="text-sm font-medium">Tipo de Análisis</label>
            <select
              id="analysisTypeSelect"
              value={analysisType}
              onChange={(e) => setAnalysisType(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="general">Análisis General</option>
              <option value="educational">Análisis Educativo</option>
              <option value="psychological">Análisis Psicológico</option>
              <option value="medical">Análisis Médico</option>
            </select>
          </div>

          <div className="flex gap-2">
            <Button onClick={handleTestConnection} disabled={testingConnection} variant="outline" className="flex-1">
              {testingConnection ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600 mr-2" />
                  Probando...
                </>
              ) : (
                'Probar Conexión'
              )}
            </Button>
            <Button 
              onClick={async () => {
                try {
                  await handleAnalyze();
                } catch (err: any) {
                  // El error ya se maneja en useApiRequest y se muestra en el Alert
                  console.error('Error en handleAnalyze:', err);
                }
              }} 
              disabled={!selectedFile || loading} 
              className="flex-1" 
              size="lg"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Analizando...
                </>
              ) : (
                <>
                  <FileText className="h-4 w-4 mr-2" />
                  Analizar PDF
                </>
              )}
            </Button>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription> Error al analizar el PDF: {error} </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {analysisResult && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                Resultado del Análisis
              </CardTitle>
              <div className="flex gap-2">
                {analysisResult?.fallback && (
                  <span className="px-2 py-1 text-xs rounded bg-yellow-100 text-yellow-800 border border-yellow-200">
                    Análisis básico sin IA (Ollama no disponible)
                  </span>
                )}
                <Button onClick={handleDownloadPdf} variant="outline" size="sm" disabled={generatingPdf}>
                  {generatingPdf ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600 mr-2" />
                      Generando...
                    </>
                  ) : (
                    <>
                      <Download className="h-4 w-4 mr-2" />
                      Descargar PDF
                    </>
                  )}
                </Button>
              </div>
            </div>
            <CardDescription>
              Análisis completado el {new Date(analysisResult.timestamp).toLocaleString()}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="font-semibold mb-2">Resumen</h3>
              <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">{analysisResult.analysis.summary}</p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Puntos Clave</h3>
              <ul className="space-y-1">
                {analysisResult.analysis.keyPoints.map((point, index) => (
                  <li key={`${point}-${index}`} className="flex items-start gap-2">
                    <span className="text-primary font-bold">{index + 1}.</span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Recomendaciones</h3>
              <ul className="space-y-2">
                {analysisResult.analysis.recommendations.map((rec, i) => (
                  <li key={`${rec}-${i}`} className="flex items-start gap-2 p-2 bg-blue-50 rounded-lg">
                    <CheckCircle className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex items-center gap-4">
              <span className="font-semibold">Confianza del Análisis:</span>
              <div className="flex items-center gap-2">
                <Progress value={analysisResult.analysis.confidence * 100} className="w-32" />
                <span className="text-sm font-medium">
                  {Math.round(analysisResult.analysis.confidence * 100)}%
                </span>
              </div>
            </div>

            <div className="pt-4 border-t">
              <h3 className="font-semibold mb-2">Información del Archivo</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div><span className="font-medium">Nombre:</span> {analysisResult.fileInfo.name}</div>
                <div><span className="font-medium">Tamaño:</span> {formatFileSize(analysisResult.fileInfo.size)}</div>
                <div><span className="font-medium">Tipo:</span> {analysisResult.fileInfo.type}</div>
                <div><span className="font-medium">Análisis:</span> {analysisResult.analysisType}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default PdfUploadComponent;