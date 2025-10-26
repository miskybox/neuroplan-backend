import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";

const benefits = [
  "Titulación oficial homologada garantizada",
  "Currículo LOMLOE, FP, CRUE-MECES adaptado",
  "Pasaporte Educativo Inteligente (PEI)",
  "Validación curricular estricta con IA",
];

export const CTA = () => {
  return (
    <section className="py-20 lg:py-32 relative overflow-hidden">
      {/* Fondo con gradiente */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary via-secondary to-accent opacity-10" />
      
      <div className="container relative">
        <div className="max-w-4xl mx-auto">
          <div className="rounded-3xl bg-gradient-hero p-12 lg:p-16 shadow-glow text-center space-y-8 animate-in fade-in zoom-in duration-1000">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white">
              Obtén tu titulación oficial homologada
            </h2>
            
            <p className="text-lg text-white/90 max-w-2xl mx-auto">
              Transforma tus características neurocognitivas en el motor de tu éxito académico con NeuroPlan AI Campus
            </p>

            {/* Beneficios */}
            <div className="grid sm:grid-cols-2 gap-4 text-left max-w-2xl mx-auto">
              {benefits.map((benefit, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 text-white/95"
                >
                  <CheckCircle2 className="h-5 w-5 text-success-foreground flex-shrink-0 mt-0.5" />
                  <span className="text-sm font-medium">{benefit}</span>
                </div>
              ))}
            </div>

            {/* Botones */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Link to="/registro">
                <Button
                  variant="secondary"
                  size="xl"
                  className="group bg-white text-primary hover:bg-white/90 shadow-elegant"
                >
                  Crear mi Perfil NeuroAcadémico
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>

            {/* Nota */}
            <p className="text-sm text-white/80 pt-4">
              Titulación oficial garantizada · Validación curricular LOMLOE compliant
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
