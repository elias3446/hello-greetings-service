import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { 
  User, 
  FileText, 
  List, 
  Shield, 
  Activity,
  Upload,
  Menu
} from 'lucide-react';
import { Outlet } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const MenuAdmin = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
    setIsMenuOpen(false);
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

  const getActiveTitle = () => {
    const activeItem = navItems.find(item => item.value === getActiveTab());
    return activeItem ? activeItem.label : 'Administración';
  };

  return (
    <Layout>
      <div className="relative">
        <nav className="bg-background fixed top-0 left-0 right-0 z-[100] border-b shadow-sm">
          <div className="w-full px-2 sm:px-4 lg:px-6">
            <div className="flex items-center justify-between h-14 sm:h-16">
              {/* Page Title - Only visible on mobile */}
              <div className="flex items-center [@media(min-width:910px)]:hidden">
                <h1 className="text-lg sm:text-xl font-semibold text-foreground">
                  {getActiveTitle()}
                </h1>
              </div>

              {/* Desktop Navigation */}
              <div className="hidden [@media(min-width:910px)]:flex items-center justify-center flex-1">
                <div className="flex items-center space-x-1 lg:space-x-2">
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = getActiveTab() === item.value;
                    return (
                      <button
                        key={item.value}
                        onClick={() => handleTabChange(item.value)}
                        className={`nav-link px-2 py-1.5 whitespace-nowrap text-sm lg:text-base ${
                          isActive 
                            ? 'text-primary border-b-2 border-primary' 
                            : 'text-muted-foreground hover:text-foreground'
                        }`}
                      >
                        <Icon className="h-4 w-4 inline-block" />
                        <span className="ml-1.5">{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Mobile Menu Button */}
              <Button
                variant="ghost"
                size="sm"
                className="[@media(min-width:910px)]:hidden p-1.5"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                <span className="sr-only">Abrir menú de navegación</span>
                <Menu className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Mobile Navigation */}
          <div 
            className={`[@media(min-width:910px)]:hidden transition-all duration-200 ease-in-out ${
              isMenuOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0 overflow-hidden'
            }`}
          >
            <div className="px-3 py-2 space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = getActiveTab() === item.value;
                return (
                  <button
                    key={item.value}
                    onClick={() => handleTabChange(item.value)}
                    className={`w-full py-2.5 px-3 flex items-center rounded-md ${
                      isActive 
                        ? 'bg-primary/10 text-primary' 
                        : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="ml-2">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </nav>

        {/* Add padding-top to account for fixed nav */}
        <div className="pt-14 sm:pt-16">
          <div className="mt-5">
            <Outlet />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default MenuAdmin;
