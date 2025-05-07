import { Route } from 'react-router-dom';
import MenuAdmin from './MenuAdmin';

// Importar componentes de usuarios
import ListaUsuarios from './usuarios/ListaUsuarios';
import DetalleUsuario from './usuarios/DetalleUsuario';
import FormularioUsuario from './usuarios/FormularioUsuario';

// Importar componentes de reportes
import ListaReportesAdmin from './reportes/ListaReportesAdmin';
import DetalleReporteAdmin from './reportes/DetalleReporteAdmin';
import FormularioReporteAdmin from './reportes/FormularioReporteAdmin';

// Importar componentes de categorías
import ListaCategorias from './categorias/ListaCategorias';
import DetalleCategoria from './categorias/DetalleCategoria';
import FormularioCategoria from './categorias/FormularioCategoria';

// Importar componentes de roles
import ListaRoles from './roles/ListaRoles';
import DetalleRol from './roles/DetalleRol';
import FormularioRol from './roles/FormularioRol';

// Importar componentes de estados
import ListaEstados from './estados/ListaEstados';
import DetalleEstado from './estados/DetalleEstado';
import FormularioEstado from './estados/FormularioEstado';

// Importar componentes de carga masiva
import CargaMasiva from './cargaMasiva/CargaMasiva';

export const adminRoutes = (
  <Route path="/admin" element={<MenuAdmin />}>
    {/* Rutas de usuarios */}
    <Route index element={<ListaUsuarios />} />
    <Route path="usuarios" element={<ListaUsuarios />} />
    <Route path="usuarios/:id" element={<DetalleUsuario />} />
    <Route path="usuarios/nuevo" element={<FormularioUsuario modo="crear" />} />
    <Route path="usuarios/:id/editar" element={<FormularioUsuario modo="editar" />} />
    
    {/* Rutas de reportes admin */}
    <Route path="reportes" element={<ListaReportesAdmin />} />
    <Route path="reportes/:id" element={<DetalleReporteAdmin />} />
    <Route path="reportes/nuevo" element={<FormularioReporteAdmin modo="crear" />} />
    <Route path="reportes/:id/editar" element={<FormularioReporteAdmin modo="editar" />} />
    
    {/* Rutas de categorías */}
    <Route path="categorias" element={<ListaCategorias />} />
    <Route path="categorias/:id" element={<DetalleCategoria />} />
    <Route path="categorias/nuevo" element={<FormularioCategoria modo="crear" />} />
    <Route path="categorias/:id/editar" element={<FormularioCategoria modo="editar" />} />
    
    {/* Rutas de roles */}
    <Route path="roles" element={<ListaRoles />} />
    <Route path="roles/:id" element={<DetalleRol />} />
    <Route path="roles/nuevo" element={<FormularioRol modo="crear" />} />
    <Route path="roles/:id/editar" element={<FormularioRol modo="editar" />} />
    
    {/* Rutas de estados */}
    <Route path="estados" element={<ListaEstados />} />
    <Route path="estados/:id" element={<DetalleEstado />} />
    <Route path="estados/nuevo" element={<FormularioEstado modo="crear" />} />
    <Route path="estados/:id/editar" element={<FormularioEstado modo="editar" />} />

    {/* Rutas de carga masiva */}
    <Route path="cargaMasiva" element={<CargaMasiva />} />
  </Route>
); 