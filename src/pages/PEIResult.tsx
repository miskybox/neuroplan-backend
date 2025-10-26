import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { 
  Download, 
  ArrowLeft
} from "lucide-react";

const PEIResult = () => {
  const navigate = useNavigate();
  
  // Datos del PEI (en una implementación real, estos vendrían de la API)
  const [peiData] = useState({
    id: "PEI-2024-001",
    studentName: "María González López",
    grade: "4º ESO",
    generatedDate: "2024-01-15",
    validUntil: "2025-01-15",
    status: "active",
    
    // Perfil Neurocognitivo
    neurocognitiveProfile: {
      strengths: [
        { area: "Memoria Visual", score: 85, description: "Excelente capacidad para recordar información visual" },
        { area: "Pensamiento Lógico", score: 78, description: "Buena capacidad de razonamiento matemático" },
        { area: "Creatividad", score: 92, description: "Alta capacidad creativa y artística" },
        { area: "Atención Sostenida", score: 65, description: "Capacidad moderada de concentración" }
      ],
      challenges: [
        { area: "Velocidad de Procesamiento", score: 45, description: "Necesita más tiempo para procesar información" },
        { area: "Memoria de Trabajo", score: 52, description: "Dificultades con tareas que requieren múltiples pasos" }
      ],
      recommendations: [
        "Usar ayudas visuales y mapas mentales",
        "Permitir tiempo extra para exámenes",
        "Dividir tareas complejas en pasos más pequeños",
        "Fomentar el uso de tecnología asistiva"
      ]
    },
    
    // Itinerario Personalizado
    personalizedItinerary: {
      subjects: [
        {
          name: "Matemáticas",
          level: "Adaptado",
          adaptations: ["Calculadora permitida", "Tiempo extra", "Ejercicios visuales"],
          progress: 75
        },
        {
          name: "Lengua Castellana",
          level: "Estándar",
          adaptations: ["Lectura asistida", "Dictado por voz"],
          progress: 85
        },
        {
          name: "Ciencias Naturales",
          level: "Adaptado",
          adaptations: ["Experimentos virtuales", "Resúmenes visuales"],
          progress: 70
        },
        {
          name: "Historia",
          level: "Estándar",
          adaptations: ["Líneas de tiempo interactivas"],
          progress: 80
        }
      ],
      totalProgress: 77
    },
    
    // Adaptaciones Curriculares
    curricularAdaptations: {
      general: [
        "Tiempo extra del 25% en evaluaciones",
        "Uso de tecnología asistiva",
        "Materiales en formato digital",
        "Evaluación continua y formativa"
      ],
      specific: [
        "Matemáticas: Calculadora científica permitida",
        "Lengua: Software de lectura asistida",
        "Ciencias: Laboratorios virtuales",
        "Historia: Mapas interactivos y líneas de tiempo"
      ]
    },
    
    // Metas y Objetivos
    goals: [
      {
        id: 1,
        title: "Mejorar velocidad de procesamiento",
        description: "Aumentar la velocidad de resolución de problemas matemáticos",
        target: "3 meses",
        progress: 60,
        status: "en_progress"
      },
      {
        id: 2,
        title: "Desarrollar estrategias de memoria",
        description: "Implementar técnicas de memorización visual",
        target: "2 meses",
        progress: 80,
        status: "en_progress"
      },
      {
        id: 3,
        title: "Fortalecer atención sostenida",
        description: "Aumentar el tiempo de concentración en tareas",
        target: "4 meses",
        progress: 45,
        status: "en_progress"
      }
    ],
    
    // Documentos y Certificaciones
    documents: [
      {
        name: "PEI Completo",
        type: "PDF",
        size: "2.3 MB",
        date: "2024-01-15"
      },
      {
        name: "Informe Neurocognitivo",
        type: "PDF",
        size: "1.8 MB",
        date: "2024-01-15"
      },
      {
        name: "Itinerario Personalizado",
        type: "PDF",
        size: "1.2 MB",
        date: "2024-01-15"
      }
    ]
  });

  const handleDownload = (documentName: string) => {
    // Simular descarga
    console.log(`Descargando: ${documentName}`);
  };

  const handleShare = () => {
    // Simular compartir
    console.log("Compartiendo PEI");
  };

  const handlePrint = () => {
    window.print();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 border-green-200";
      case "expired":
        return "bg-red-100 text-red-800 border-red-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main className="container mx-auto px-4 py-12">
        {/* Contenido simple y visible */}
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            PEI Generado
          </h1>
          
          <p className="text-lg text-gray-600 mb-8">
            Pasaporte Educativo Inteligente - {peiData.studentName}
          </p>
          
          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Información del PEI
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-medium text-gray-700 mb-2">Datos del Estudiante</h3>
                <p className="text-gray-600">Nombre: {peiData.studentName}</p>
                <p className="text-gray-600">Grado: {peiData.grade}</p>
                <p className="text-gray-600">ID PEI: {peiData.id}</p>
              </div>
              
              <div>
                <h3 className="text-lg font-medium text-gray-700 mb-2">Estado del PEI</h3>
                <p className="text-gray-600">Estado: {peiData.status === "active" ? "Activo" : "Inactivo"}</p>
                <p className="text-gray-600">Generado: {new Date(peiData.generatedDate).toLocaleDateString()}</p>
                <p className="text-gray-600">Válido hasta: {new Date(peiData.validUntil).toLocaleDateString()}</p>
              </div>
            </div>
            
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h3 className="text-lg font-medium text-gray-700 mb-4">Acciones</h3>
              <div className="flex gap-4">
                <Button 
                  onClick={() => navigate(-1)}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Volver
                </Button>
                
                <Button 
                  onClick={handleDownload}
                  className="flex items-center gap-2"
                >
                  <Download className="h-4 w-4" />
                  Descargar PEI
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default PEIResult;
