import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";
import { AccessibilityPanel } from "@/components/AccessibilityPanel";
import { AccessibilityTrigger } from "@/components/AccessibilityTrigger";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { AuthProvider } from "@/contexts/AuthContext";
import { AccessibilityProvider } from "@/contexts/AccessibilityContext";
import Index from "./pages/Index";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import Dashboard from "./pages/Dashboard";
import Itinerary from "./pages/Itinerary";
import Resources from "./pages/Resources";
import PEIEngine from "./pages/PEIEngine";
import GeneratePEI from "./pages/GeneratePEI";
import PEIResult from "./pages/PEIResult";
import BedrockDemo from "./pages/BedrockDemo";
import WorkflowDemo from "./pages/WorkflowDemo";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <AccessibilityProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/registro" element={<Register />} />
                <Route path="/login" element={<Login />} />
                <Route 
                  path="/dashboard" 
                  element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/perfil" 
                  element={
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/itinerario" 
                  element={
                    <ProtectedRoute>
                      <Itinerary />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/recursos" 
                  element={<Resources />}
                />
                <Route 
                  path="/pei-engine" 
                  element={<PEIEngine />}
                />
                <Route 
                  path="/generate-pei" 
                  element={<GeneratePEI />}
                />
                <Route 
                  path="/pei-result" 
                  element={<PEIResult />}
                />
                <Route 
                  path="/bedrock-demo" 
                  element={<BedrockDemo />}
                />
                <Route 
                  path="/workflow-demo" 
                  element={<WorkflowDemo />}
                />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
            
            {/* Panel de Accesibilidad */}
            <AccessibilityPanel 
              isOpen={isPanelOpen} 
              onClose={() => setIsPanelOpen(false)} 
            />
            
            {/* Botón de Acceso */}
            <AccessibilityTrigger 
              onClick={() => setIsPanelOpen(true)} 
            />
          </TooltipProvider>
        </AccessibilityProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
