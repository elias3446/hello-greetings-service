import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { 
  User, 
  FileText, 
  List, 
  Shield, 
  Activity,
  Upload
} from 'lucide-react';
import { Outlet } from 'react-router-dom';

const MenuAdmin = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Determinar la pestaña activa basada en la ruta actual
  const getActiveTab = () => {
    const path = location.pathname;
    if (path.includes('/admin/usuarios')) return 'usuarios';
    if (path.includes('/admin/reportes')) return 'reportes';
    if (path.includes('/admin/categorias')) return 'categorias';
    if (path.includes('/admin/roles')) return 'roles';
    if (path.includes('/admin/estados')) return 'estados';
    if (path.includes('/admin/cargaMasiva')) return 'cargaMasiva';
    return 'usuarios'; // Por defecto
  };

  const handleTabChange = (value: string) => {
    // Navegar a la ruta base de cada sección
    switch (value) {
      case 'usuarios':
        navigate('/admin/usuarios');
        break;
      case 'reportes':
        navigate('/admin/reportes');
        break;
      case 'categorias':
        navigate('/admin/categorias');
        break;
      case 'roles':
        navigate('/admin/roles');
        break;
      case 'estados':
        navigate('/admin/estados');
        break;
      case 'cargaMasiva':
        navigate('/admin/cargaMasiva');
        break;
      default:
        navigate('/admin/usuarios');
    }
  };

  const navItems = [
    { value: 'usuarios', label: 'Usuarios', icon: User },
    { value: 'reportes', label: 'Reportes', icon: FileText },
    { value: 'categorias', label: 'Categorías', icon: List },
    { value: 'roles', label: 'Roles', icon: Shield },
    { value: 'estados', label: 'Estados', icon: Activity },
    { value: 'cargaMasiva', label: 'Carga Masiva', icon: Upload }
  ];

  return (
    <Layout>
      <div>
        <nav className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-[100] w-full">
          <div className="w-full">
            <div className="flex h-16">
              <div className="flex w-full">
                <div className="flex w-full justify-center space-x-4">
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = getActiveTab() === item.value;
                    return (
                      <button
                        key={item.value}
                        onClick={() => handleTabChange(item.value)}
                        className={`nav-link ${isActive ? 'text-primary border-b-2 border-primary' : 'text-muted-foreground hover:text-foreground'}`}
                      >
                        <Icon className="h-4 w-4" />
                        {item.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </nav>

        <div className="mt-5">
          <Outlet />
        </div>
      </div>
    </Layout>
  );
};

export default MenuAdmin;
