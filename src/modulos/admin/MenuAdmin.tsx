import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams, useParams, useLocation } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { User, FileText, List, Shield, Activity } from 'lucide-react';
import ListaUsuarios from './usuarios/ListaUsuarios';
import ListaReportesAdmin from './reportes/ListaReportesAdmin';
import ListaCategorias from './categorias/ListaCategorias';
import ListaRoles from './roles/ListaRoles';
import ListaEstados from './estados/ListaEstados';
import DetalleUsuario from './usuarios/DetalleUsuario';
import DetalleReporteAdmin from './reportes/DetalleReporteAdmin';
import DetalleCategoria from './categorias/DetalleCategoria';
import DetalleRol from './roles/DetalleRol';
import DetalleEstado from './estados/DetalleEstado';
import FormularioUsuario from './usuarios/FormularioUsuario';
import FormularioReporteAdmin from './reportes/FormularioReporteAdmin';
import FormularioCategoria from './categorias/FormularioCategoria';
import FormularioRol from './roles/FormularioRol';
import FormularioEstado from './estados/FormularioEstado';

const MenuAdmin = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const pathSegments = location.pathname.split('/');
  const module = pathSegments[2] || 'usuarios';
  const action = pathSegments[3] || 'lista';
  const initialTab = searchParams.get('tab') || module;
  const [activeTab, setActiveTab] = useState(initialTab);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    navigate(`/admin/${value}`);
  };

  const modulos = [
    {
      value: 'usuarios',
      titulo: 'Gestión de Usuarios',
      icono: User,
      lista: <ListaUsuarios />,
      detalle: id ? <DetalleUsuario /> : null,
      formulario: action === 'nuevo' ? <FormularioUsuario modo="crear" /> : 
                 action === 'editar' ? <FormularioUsuario modo="editar" /> : null
    },
    {
      value: 'reportes',
      titulo: 'Gestión de Reportes',
      icono: FileText,
      lista: <ListaReportesAdmin />,
      detalle: id ? <DetalleReporteAdmin /> : null,
      formulario: action === 'nuevo' ? <FormularioReporteAdmin modo="crear" /> : 
                 action === 'editar' ? <FormularioReporteAdmin modo="editar" /> : null
    },
    {
      value: 'categorias',
      titulo: 'Gestión de Categorías',
      icono: List,
      lista: <ListaCategorias />,
      detalle: id ? <DetalleCategoria /> : null,
      formulario: action === 'nuevo' ? <FormularioCategoria modo="crear" /> : 
                 action === 'editar' ? <FormularioCategoria modo="editar" /> : null
    },
    {
      value: 'roles',
      titulo: 'Gestión de Roles',
      icono: Shield,
      lista: <ListaRoles />,
      detalle: id ? <DetalleRol /> : null,
      formulario: action === 'nuevo' ? <FormularioRol modo="crear" /> : 
                 action === 'editar' ? <FormularioRol modo="editar" /> : null
    },
    {
      value: 'estados',
      titulo: 'Gestión de Estados',
      icono: Activity,
      lista: <ListaEstados />,
      detalle: id ? <DetalleEstado /> : null,
      formulario: action === 'nuevo' ? <FormularioEstado modo="crear" /> : 
                 action === 'editar' ? <FormularioEstado modo="editar" /> : null
    },
  ];

  const moduloActual = modulos.find(m => m.value === activeTab);

  return (
    <Layout>
      <div>
        <nav className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-[100] w-full">
          <div className="w-full">
            <div className="flex h-16">
              <div className="flex w-full">
                <div className="flex w-full justify-center space-x-4">
                  {modulos.map((modulo) => {
                    const Icon = modulo.icono;
                    return (
                      <button
                        key={modulo.value}
                        onClick={() => handleTabChange(modulo.value)}
                        className={`nav-link ${activeTab === modulo.value ? 'text-primary border-b-2 border-primary' : 'text-muted-foreground hover:text-foreground'}`}
                      >
                        <Icon className="h-4 w-4" />
                        {modulo.titulo}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </nav>

        <div className="mt-5">
          {moduloActual?.formulario || moduloActual?.detalle || moduloActual?.lista}
        </div>
      </div>
    </Layout>
  );
};

export default MenuAdmin;
