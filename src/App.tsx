import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Help from "./pages/Help";

// Importación de módulos
import Dashboard from "./modulos/dashboard/Dashboard";
import Mapa from "./modulos/mapa/Mapa";
import ListaReportes from "./modulos/reportes/ListaReportes";
import DetalleReporte from "./modulos/reportes/DetalleReporte";
import FormularioReporte from "./modulos/reportes/FormularioReporte";
import { adminRoutes } from "./modulos/admin/admin.routes";

// Create a client
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/help" element={<Help />} />
            
            {/* Rutas de módulos */}
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/mapa" element={<Mapa />} />
            
            {/* Rutas de reportes */}
            <Route path="/reportes" element={<ListaReportes />} />
            <Route path="/reportes/:id" element={<DetalleReporte />} />
            <Route path="/reportes/nuevo" element={<FormularioReporte modo="crear" />} />
            <Route path="/reportes/:id/editar" element={<FormularioReporte modo="editar" />} />
            
            {/* Rutas de administración */}
            {adminRoutes}
            
            {/* Ruta 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </TooltipProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
