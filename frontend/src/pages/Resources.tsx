import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BookOpen, 
  Calculator, 
  Brain, 
  Video, 
  FileText, 
  Search,
  Filter,
  Star,
  Download,
  ExternalLink,
  Play,
  Eye,
  Clock,
  Users,
  Award,
  Lightbulb,
  Zap,
  Target,
  TrendingUp,
  ArrowRight,
  CheckCircle2,
  Bookmark,
  Share2
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const Resources = () => {
  const { user, isLoading, isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState("herramientas");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("todos");

  console.log("Resources component - isLoading:", isLoading, "isAuthenticated:", isAuthenticated, "user:", user);

  // Versión simplificada para debuggear
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container py-12">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Recursos Educativos</h1>
          <p className="text-muted-foreground mb-8">
            Herramientas, materiales y tutorías adaptadas a tu Perfil NeuroAcadémico
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="h-5 w-5" />
                  Herramientas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Calculadoras, simuladores y herramientas de apoyo
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Materiales
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Bibliotecas, videos y ejercicios adaptativos
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Tutorías
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Sesiones individuales y grupos de estudio
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Resources;