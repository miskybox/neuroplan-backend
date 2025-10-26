import { Card } from "@/components/ui/card";
import { Brain, BookOpen, Shield, Cpu, FileText, Award } from "lucide-react";
import { useNavigate } from "react-router-dom";
import learningPathIcon from "@/assets/learning-path-icon.png";

const features = [
  {
    icon: Brain,
    title: "PEI Engine - Motor de Individualización",
    description: "Perfil NeuroAcadémico AI que extrae diagnósticos clínicos con OCR/NLP y mapea fortalezas cognitivas para crear el itinerario académico más eficaz y homologable.",
    gradient: "from-primary to-primary-dark",
  },
  {
    icon: BookOpen,
    title: "Learning Engine - Motor de Contenido Adaptativo",
    description: "Currículo oficial español (LOMLOE, FP, CRUE-MECES) fragmentado y convertido a multimedia. Interfaz dinámica con Modo Pictográfico y Tutor Virtual sin alucinaciones.",
    gradient: "from-secondary to-success",
  },
  {
    icon: Shield,
    title: "Compliance Engine - Motor de Cumplimiento Curricular",
    description: "Trazabilidad completa del progreso académico. Generación automática del Pasaporte Educativo Inteligente (PEI) para solicitar titulación oficial homologada.",
    gradient: "from-accent to-destructive",
  },
  {
    icon: Cpu,
    title: "Adaptación Automatizada",
    description: "Transformación del temario a formatos multimedia (Veed.io, ElevenLabs) con evaluación adaptada por voz o proyectos, manteniendo equivalencia curricular.",
    gradient: "from-primary-light to-secondary",
  },
  {
    icon: FileText,
    title: "Pasaporte Educativo Inteligente",
    description: "Documento digital verificable que registra adaptaciones y créditos cumplidos. Prueba oficial para solicitar expedición de título homologado ante autoridades educativas.",
    gradient: "from-secondary to-accent",
  },
  {
    icon: Award,
    title: "Titulación Oficial Garantizada",
    description: "Validación curricular estricta que asegura competencias equivalentes al currículo oficial. Reconocimiento legal completo para estudiantes neurodivergentes.",
    gradient: "from-accent to-primary",
  },
];

export const Features = () => {
  const navigate = useNavigate();

  const handleCardClick = (index: number) => {
    switch (index) {
      case 0: // PEI Engine
        navigate('/pei-engine');
        break;
      case 1: // Learning Engine
        navigate('/recursos');
        break;
      case 2: // Compliance Engine
        navigate('/itinerario');
        break;
      default:
        // Otras tarjetas no tienen navegación específica
        break;
    }
  };

  return (
    <section className="py-20 lg:py-32 bg-muted/30">
      <div className="container">
        <div className="text-center space-y-4 mb-16 animate-in fade-in slide-in-from-bottom duration-1000">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold">
            Los 3 motores que{" "}
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              transforman
            </span>{" "}
            tu educación
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Hiper-personalización académica con validación curricular estricta para garantizar tu titulación oficial
          </p>
        </div>

        {/* Imagen central */}
        <div className="flex justify-center mb-16 animate-in fade-in zoom-in duration-1000 delay-300">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/30 via-secondary/30 to-accent/30 rounded-full blur-3xl animate-pulse" />
            <img
              src={learningPathIcon}
              alt="Itinerario de aprendizaje personalizado"
              className="relative w-64 h-64 object-contain drop-shadow-2xl"
            />
          </div>
        </div>

        {/* Grid de características */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="p-6 space-y-4 hover:shadow-glow transition-spring cursor-pointer group animate-in fade-in slide-in-from-bottom duration-700"
              style={{ animationDelay: `${index * 100}ms` }}
              onClick={() => handleCardClick(index)}
            >
              <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${feature.gradient} shadow-elegant`}>
                <feature.icon className="h-6 w-6 text-white" />
              </div>
              
              <h3 className="text-xl font-bold group-hover:text-primary transition-smooth">
                {feature.title}
              </h3>
              
              <p className="text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
