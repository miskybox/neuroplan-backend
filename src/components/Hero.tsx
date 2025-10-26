import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import heroImage from "@/assets/hero-education.jpg";

export const Hero = () => {
  return (
    <section className="relative overflow-hidden">
      {/* Fondo con gradiente */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5" />
      
      <div className="container relative">
        <div className="grid lg:grid-cols-2 gap-12 items-center py-20 lg:py-32">
          {/* Contenido */}
          <div className="space-y-8 animate-in fade-in slide-in-from-left duration-1000">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium shadow-elegant">
              <Sparkles className="h-4 w-4" />
              <span>Hiper-personalización académica con IA</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
              NeuroPlan AI Campus:{" "}
              <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                Titulación oficial
              </span>{" "}
              para estudiantes neurodivergentes
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl leading-relaxed">
              Transformamos las características neurocognitivas en el motor del aprendizaje. 
              Currículo oficial español (LOMLOE, FP, CRUE-MECES) adaptado con IA para garantizar 
              tu titulación homologada.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/registro">
                <Button variant="hero" size="xl" className="group">
                  Crear mi Perfil NeuroAcadémico
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>

            {/* Estadísticas */}
            <div className="grid grid-cols-3 gap-6 pt-8">
              <div className="space-y-1">
                <div className="text-3xl font-bold text-primary">100%</div>
                <div className="text-sm text-muted-foreground">Titulaciones oficiales</div>
              </div>
              <div className="space-y-1">
                <div className="text-3xl font-bold text-secondary">3</div>
                <div className="text-sm text-muted-foreground">Motores IA</div>
              </div>
              <div className="space-y-1">
                <div className="text-3xl font-bold text-accent">LOMLOE</div>
                <div className="text-sm text-muted-foreground">Compliant</div>
              </div>
            </div>
          </div>

          {/* Imagen */}
          <div className="relative animate-in fade-in slide-in-from-right duration-1000 delay-300">
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-secondary/20 rounded-3xl blur-3xl" />
            <img
              src={heroImage}
              alt="Estudiantes colaborando en un ambiente educativo inclusivo"
              className="relative rounded-3xl shadow-glow w-full h-auto object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
};
