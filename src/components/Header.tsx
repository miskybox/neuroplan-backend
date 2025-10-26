import { Button } from "@/components/ui/button";
import { GraduationCap, Menu, User, LogOut, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const Header = () => {
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link to={isAuthenticated ? "/dashboard" : "/"} className="flex items-center gap-2 transition-smooth hover:opacity-80">
          <div className="rounded-lg bg-gradient-hero p-2 shadow-elegant">
            <GraduationCap className="h-6 w-6 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-primary to-primary-dark bg-clip-text text-transparent">
            NeuroPlan AI Campus
          </span>
        </Link>

                <nav className="hidden md:flex items-center gap-6">
                  <Link to="/" className="text-sm font-medium text-foreground/80 hover:text-foreground transition-smooth">
                    Inicio
                  </Link>
                  <Link to="/pei-engine" className="text-sm font-medium text-foreground/80 hover:text-foreground transition-smooth">
                    PEI Engine
                  </Link>
                  <Link to="/perfil" className="text-sm font-medium text-foreground/80 hover:text-foreground transition-smooth">
                    Perfil
                  </Link>
                  <Link to="/itinerario" className="text-sm font-medium text-foreground/80 hover:text-foreground transition-smooth">
                    Itinerario
                  </Link>
                  <Link to="/recursos" className="text-sm font-medium text-foreground/80 hover:text-foreground transition-smooth">
                    Recursos
                  </Link>
                </nav>

        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="hidden md:inline-flex">
                    <User className="h-4 w-4 mr-2" />
                    {user?.nombre} {user?.apellidos}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link to="/dashboard" className="flex items-center">
                      <TrendingUp className="h-4 w-4 mr-2" />
                      Dashboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/perfil" className="flex items-center">
                      <User className="h-4 w-4 mr-2" />
                      Mi Perfil NeuroAcadémico
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/itinerario" className="flex items-center">
                      <GraduationCap className="h-4 w-4 mr-2" />
                      Mi Itinerario
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout} className="text-destructive">
                    <LogOut className="h-4 w-4 mr-2" />
                    Cerrar sesión
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button variant="ghost" size="sm" className="hidden md:inline-flex">
                  Iniciar sesión
                </Button>
              </Link>
              <Link to="/registro">
                <Button variant="hero" size="sm" className="hidden md:inline-flex">
                  Crear Perfil NeuroAcadémico
                </Button>
              </Link>
            </>
          )}
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
};
