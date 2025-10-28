import { PdfUploadComponent } from '@/components/PdfUploadComponent';

export function PdfAnalysisPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Análisis de PDFs con IA</h1>
          <p className="text-gray-600">
            Sube documentos PDF para obtener análisis inteligente con Ollama
          </p>
        </div>
        
        <PdfUploadComponent />
      </div>
    </div>
  );
}

export default PdfAnalysisPage;



