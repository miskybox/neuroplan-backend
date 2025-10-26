import { GraduationCap } from "lucide-react";
import { Link } from "react-router-dom";

export const Footer = () => {
  return (
    <footer className="border-t border-border/40 bg-muted/30">
      <div className="container py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Logo y descripción */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <div className="rounded-lg bg-gradient-hero p-2 shadow-elegant">
                <GraduationCap className="h-6 w-6 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-primary to-primary-dark bg-clip-text text-transparent">
                NeuroEducar
              </span>
            </div>
            <p className="text-muted-foreground text-sm max-w-md leading-relaxed">
              Plataforma educativa que crea itinerarios personalizados para estudiantes neurodivergentes,
              alineados con el sistema educativo español.
            </p>
          </div>

          {/* Enlaces */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Plataforma</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link to="/perfil" className="hover:text-foreground transition-smooth">
                  Crear perfil
                </Link>
              </li>
              <li>
                <Link to="/itinerario" className="hover:text-foreground transition-smooth">
                  Mi itinerario
                </Link>
              </li>
              <li>
                <Link to="/recursos" className="hover:text-foreground transition-smooth">
                  Recursos
                </Link>
              </li>
            </ul>
          </div>

          {/* Información */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Información</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="#" className="hover:text-foreground transition-smooth">
                  Sobre nosotros
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground transition-smooth">
                  Normativa LOMLOE
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground transition-smooth">
                  Contacto
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-8 border-t border-border/40">
          <p className="text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} NeuroEducar. Educación inclusiva para todos.
          </p>
        </div>
      </div>
    </footer>
  );
};
