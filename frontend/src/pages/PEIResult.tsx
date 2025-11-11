import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Download, ArrowLeft } from "lucide-react";
import { logger } from "@/utils/logger";
import { ApiMessageBanner } from "@/components/ApiMessageBanner";

const PEIResult = () => {
  const navigate = useNavigate();
  const liveRegionRef = useRef<HTMLDivElement | null>(null);
  const [infoMessage, setInfoMessage] = useState<string | null>(null);

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
        {
          area: "Memoria Visual",
          score: 85,
          description: "Excelente capacidad para recordar información visual",
        },
        {
          area: "Pensamiento Lógico",
          score: 78,
          description: "Buena capacidad de razonamiento matemático",
        },
        {
          area: "Creatividad",
          score: 92,
          description: "Alta capacidad creativa y artística",
        },
        {
          area: "Atención Sostenida",
          score: 65,
          description: "Capacidad moderada de concentración",
        },
      ],
      challenges: [
        {
          area: "Velocidad de Procesamiento",
          score: 45,
          description: "Necesita más tiempo para procesar información",
        },
        {
          area: "Memoria de Trabajo",
          score: 52,
          description: "Dificultades con tareas que requieren múltiples pasos",
        },
      ],
      recommendations: [
        "Usar ayudas visuales y mapas mentales",
        "Permitir tiempo extra para exámenes",
        "Dividir tareas complejas en pasos más pequeños",
        "Fomentar el uso de tecnología asistiva",
      ],
    },

    // Itinerario Personalizado
    personalizedItinerary: {
      subjects: [
        {
          name: "Matemáticas",
          level: "Adaptado",
          adaptations: [
            "Calculadora permitida",
            "Tiempo extra",
            "Ejercicios visuales",
          ],
          progress: 75,
        },
        {
          name: "Lengua Castellana",
          level: "Estándar",
          adaptations: ["Lectura asistida", "Dictado por voz"],
          progress: 85,
        },
        {
          name: "Ciencias Naturales",
          level: "Adaptado",
          adaptations: ["Experimentos virtuales", "Resúmenes visuales"],
          progress: 70,
        },
        {
          name: "Historia",
          level: "Estándar",
          adaptations: ["Líneas de tiempo interactivas"],
          progress: 80,
        },
      ],
      totalProgress: 77,
    },

    // Adaptaciones Curriculares
    curricularAdaptations: {
      general: [
        "Tiempo extra del 25% en evaluaciones",
        "Uso de tecnología asistiva",
        "Materiales en formato digital",
        "Evaluación continua y formativa",
      ],
      specific: [
        "Matemáticas: Calculadora científica permitida",
        "Lengua: Software de lectura asistida",
        "Ciencias: Laboratorios virtuales",
        "Historia: Mapas interactivos y líneas de tiempo",
      ],
    },

    // Metas y Objetivos
    goals: [
      {
        id: 1,
        title: "Mejorar velocidad de procesamiento",
        description:
          "Aumentar la velocidad de resolución de problemas matemáticos",
        target: "3 meses",
        progress: 60,
        status: "en_progress",
      },
      {
        id: 2,
        title: "Desarrollar estrategias de memoria",
        description: "Implementar técnicas de memorización visual",
        target: "2 meses",
        progress: 80,
        status: "en_progress",
      },
      {
        id: 3,
        title: "Fortalecer atención sostenida",
        description: "Aumentar el tiempo de concentración en tareas",
        target: "4 meses",
        progress: 45,
        status: "en_progress",
      },
    ],

    // Documentos y Certificaciones
    documents: [
      {
        name: "PEI Completo",
        type: "PDF",
        size: "2.3 MB",
        date: "2024-01-15",
      },
      {
        name: "Informe Neurocognitivo",
        type: "PDF",
        size: "1.8 MB",
        date: "2024-01-15",
      },
      {
        name: "Itinerario Personalizado",
        type: "PDF",
        size: "1.2 MB",
        date: "2024-01-15",
      },
    ],
  });

  const handleDownload = (documentName: string) => {
    // Simular descarga
    logger.debug(`Descargando: ${documentName}`);
    setInfoMessage(`Descargando "${documentName}"...`);
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

  // Eliminada getScoreColor (no usada). Si se muestran puntuaciones en el futuro, reintroducir con mapeo de colores.

  // Gestionar mensajes accesibles (aria-live + foco para lectores de pantalla)
  useEffect(() => {
    if (infoMessage) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      // Enfocar la región viva brevemente
      setTimeout(() => {
        liveRegionRef.current?.focus();
      }, 80);
      const t = setTimeout(() => setInfoMessage(null), 3000);
      return () => clearTimeout(t);
    }
  }, [infoMessage]);

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="container mx-auto px-4 py-12">
        {/* Región de mensajes accesibles */}
        {infoMessage && (
          <div
            ref={liveRegionRef}
            tabIndex={-1}
            aria-live="polite"
            aria-atomic="true"
          >
            <ApiMessageBanner
              type="success"
              message={infoMessage}
              autoDismissMs={3000}
            />
          </div>
        )}
        {/* Navegación rápida */}
        <nav aria-label="Secciones del PEI" className="max-w-4xl mx-auto mb-8">
          <ul className="flex flex-wrap gap-4 text-sm">
            <li>
              <a href="#info" className="text-primary hover:underline">
                Información
              </a>
            </li>
            <li>
              <a href="#docs" className="text-primary hover:underline">
                Documentos
              </a>
            </li>
          </ul>
        </nav>
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            PEI Generado
          </h1>

          <p className="text-lg text-gray-600 mb-4">
            Pasaporte Educativo Inteligente - {peiData.studentName}
          </p>

          <div
            id="info"
            className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm"
          >
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Información del PEI
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-medium text-gray-700 mb-2">
                  Datos del Estudiante
                </h3>
                <p className="text-gray-600">Nombre: {peiData.studentName}</p>
                <p className="text-gray-600">Grado: {peiData.grade}</p>
                <p className="text-gray-600">ID PEI: {peiData.id}</p>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-700 mb-2">
                  Estado del PEI
                </h3>
                <p className="text-gray-600 inline-flex items-center gap-2">
                  <span>Estado:</span>{" "}
                  <span
                    className={`px-2 py-1 text-sm rounded border ${getStatusColor(
                      peiData.status
                    )}`}
                    aria-label={`Estado del PEI: ${
                      peiData.status === "active" ? "Activo" : "Inactivo"
                    }`}
                  >
                    {peiData.status === "active" ? "Activo" : "Inactivo"}
                  </span>
                </p>
                <p className="text-gray-600">
                  Generado:{" "}
                  {new Date(peiData.generatedDate).toLocaleDateString()}
                </p>
                <p className="text-gray-600">
                  Válido hasta:{" "}
                  {new Date(peiData.validUntil).toLocaleDateString()}
                </p>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <h3 className="text-lg font-medium text-gray-700 mb-4">
                Acciones
              </h3>
              <div className="flex gap-4">
                <Button
                  onClick={() => navigate(-1)}
                  variant="outline"
                  className="flex items-center gap-2"
                  aria-label="Volver a la página anterior"
                >
                  <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                  Volver
                </Button>

                <Button
                  onClick={() => handleDownload(peiData.id)}
                  className="flex items-center gap-2"
                  aria-label={`Descargar PEI ${peiData.id}`}
                >
                  <Download className="h-4 w-4" aria-hidden="true" />
                  Descargar PEI
                </Button>
              </div>
            </div>
          </div>
          {/* Documentos */}
          <section
            id="docs"
            aria-labelledby="docs-title"
            className="mt-10 bg-white border border-gray-200 rounded-lg p-6 shadow-sm"
          >
            <h2
              id="docs-title"
              className="text-2xl font-semibold text-gray-800 mb-4"
            >
              Documentos disponibles
            </h2>
            <ul className="divide-y divide-gray-200">
              {peiData.documents.map((doc) => (
                <li
                  key={`${doc.name}-${doc.date}`}
                  className="py-4 flex items-center justify-between"
                >
                  <div className="space-y-0.5">
                    <p className="text-gray-900 font-medium">{doc.name}</p>
                    <p className="text-gray-500 text-sm">
                      {doc.type} · {doc.size} ·{" "}
                      {new Date(doc.date).toLocaleDateString()}
                    </p>
                  </div>
                  <Button
                    onClick={() => handleDownload(doc.name)}
                    className="flex items-center gap-2"
                    aria-label={`Descargar ${doc.name} (${doc.type})`}
                  >
                    <Download className="h-4 w-4" aria-hidden="true" />
                    Descargar
                  </Button>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PEIResult;
