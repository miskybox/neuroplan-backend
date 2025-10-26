import { Card } from "@/components/ui/card";
import { FileText, Brain, BookOpen, Award } from "lucide-react";

const steps = [
  {
    number: "01",
    icon: FileText,
    title: "Perfil NeuroAcadémico AI",
    description: "OCR/NLP extrae diagnósticos clínicos y Test Adaptativo IA mapea fortalezas cognitivas, intereses y preferencias sensoriales.",
  },
  {
    number: "02",
    icon: Brain,
    title: "Motor de Individualización",
    description: "El PEI Engine crea tu fuente de verdad académica, recomendando el itinerario más eficaz y homologable (ESO, FP, Universidad).",
  },
  {
    number: "03",
    icon: BookOpen,
    title: "Contenido Adaptativo",
    description: "Learning Engine fragmenta el currículo oficial y lo convierte a multimedia con interfaz dinámica y Tutor Virtual sin alucinaciones.",
  },
  {
    number: "04",
    icon: Award,
    title: "Pasaporte Educativo",
    description: "Compliance Engine genera automáticamente tu PEI digital verificable para solicitar la titulación oficial homologada.",
  },
];

export const HowItWorks = () => {
  return (
    <section className="py-20 lg:py-32">
      <div className="container">
        <div className="text-center space-y-4 mb-16 animate-in fade-in slide-in-from-bottom duration-1000">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold">
            ¿Cómo{" "}
            <span className="bg-gradient-to-r from-secondary to-accent bg-clip-text text-transparent">
              funciona?
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            De tu perfil neurocognitivo a tu titulación oficial homologada en 4 pasos
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div
              key={index}
              className="relative animate-in fade-in slide-in-from-bottom duration-700"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              {/* Línea conectora (oculta en móvil y en el último elemento) */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-16 left-full w-full h-0.5 bg-gradient-to-r from-primary/50 to-transparent -translate-x-1/2 z-0" />
              )}

              <Card className="relative p-6 space-y-4 hover:shadow-glow transition-spring cursor-pointer group z-10 bg-gradient-card">
                {/* Número */}
                <div className="absolute -top-4 -right-4 w-12 h-12 rounded-full bg-gradient-hero flex items-center justify-center text-white font-bold text-lg shadow-glow">
                  {step.number}
                </div>

                {/* Icono */}
                <div className="inline-flex p-4 rounded-xl bg-gradient-to-br from-primary to-primary-dark shadow-elegant group-hover:scale-110 transition-spring">
                  <step.icon className="h-8 w-8 text-white" />
                </div>

                {/* Contenido */}
                <h3 className="text-xl font-bold group-hover:text-primary transition-smooth">
                  {step.title}
                </h3>
                
                <p className="text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
