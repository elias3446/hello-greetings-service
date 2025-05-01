
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
import MenuAdmin from "./modulos/admin/MenuAdmin";
import ListaUsuarios from "./modulos/admin/usuarios/ListaUsuarios";
import DetalleUsuario from "./modulos/admin/usuarios/DetalleUsuario";
import ListaReportesAdmin from "./modulos/admin/reportes/ListaReportesAdmin";
import ListaCategorias from "./modulos/admin/categorias/ListaCategorias";
import DetalleCategoria from "./modulos/admin/categorias/DetalleCategoria";
import ListaRoles from "./modulos/admin/roles/ListaRoles";
import ListaEstados from "./modulos/admin/estados/ListaEstados";
import FormularioUsuario from "./modulos/admin/usuarios/FormularioUsuario";
import FormularioCategoria from "./modulos/admin/categorias/FormularioCategoria";
import FormularioRol from "./modulos/admin/roles/FormularioRol";
import FormularioEstado from "./modulos/admin/estados/FormularioEstado";
import DetalleReporteAdmin from "./modulos/admin/reportes/DetalleReporteAdmin";
import FormularioReporteAdmin from "./modulos/admin/reportes/FormularioReporteAdmin";
import DetalleRol from "./modulos/admin/roles/DetalleRol";
import DetalleEstado from "./modulos/admin/estados/DetalleEstado";

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
            <Route path="/admin" element={<MenuAdmin />} />
            
            {/* Rutas de usuarios */}
            <Route path="/admin/usuarios" element={<ListaUsuarios />} />
            <Route path="/admin/usuarios/:id" element={<DetalleUsuario />} />
            <Route path="/admin/usuarios/nuevo" element={<FormularioUsuario modo="crear" />} />
            <Route path="/admin/usuarios/:id/editar" element={<FormularioUsuario modo="editar" />} />
            
            {/* Rutas de reportes admin */}
            <Route path="/admin/reportes" element={<ListaReportesAdmin />} />
            <Route path="/admin/reportes/:id" element={<DetalleReporteAdmin />} />
            <Route path="/admin/reportes/nuevo" element={<FormularioReporteAdmin modo="crear" />} />
            <Route path="/admin/reportes/:id/editar" element={<FormularioReporteAdmin modo="editar" />} />
            
            {/* Rutas de categorías */}
            <Route path="/admin/categorias" element={<ListaCategorias />} />
            <Route path="/admin/categorias/:id" element={<DetalleCategoria />} />
            <Route path="/admin/categorias/nuevo" element={<FormularioCategoria modo="crear" />} />
            <Route path="/admin/categorias/:id/editar" element={<FormularioCategoria modo="editar" />} />
            
            {/* Rutas de roles */}
            <Route path="/admin/roles" element={<ListaRoles />} />
            <Route path="/admin/roles/:id" element={<DetalleRol />} />
            <Route path="/admin/roles/nuevo" element={<FormularioRol modo="crear" />} />
            <Route path="/admin/roles/:id/editar" element={<FormularioRol modo="editar" />} />
            
            {/* Rutas de estados */}
            <Route path="/admin/estados" element={<ListaEstados />} />
            <Route path="/admin/estados/:id" element={<DetalleEstado />} />
            <Route path="/admin/estados/nuevo" element={<FormularioEstado modo="crear" />} />
            <Route path="/admin/estados/:id/editar" element={<FormularioEstado modo="editar" />} />
            
            {/* Ruta 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </TooltipProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
