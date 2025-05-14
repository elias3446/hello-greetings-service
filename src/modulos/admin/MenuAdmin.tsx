import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { User, FileText, List, Shield, Activity, Upload, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Definición de ítems del menú de navegación
const navItems = [
  { value: 'usuarios', label: 'Usuarios', icon: User, path: '/admin/usuarios' },
  { value: 'reportes', label: 'Reportes', icon: FileText, path: '/admin/reportes' },
  { value: 'categorias', label: 'Categorías', icon: List, path: '/admin/categorias' },
  { value: 'roles', label: 'Roles', icon: Shield, path: '/admin/roles' },
  { value: 'estados', label: 'Estados', icon: Activity, path: '/admin/estados' },
  { value: 'cargaMasiva', label: 'Carga Masiva', icon: Upload, path: '/admin/cargaMasiva' }
];

const MenuAdmin = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('usuarios');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Actualiza la pestaña activa al detectar un cambio en la ruta
  useEffect(() => {
    const current = navItems.find(item => location.pathname.includes(item.path));
    setActiveTab(current?.value || 'usuarios');
  }, [location.pathname]);

  const handleTabChange = (tab: string) => {
    const selected = navItems.find(item => item.value === tab);
    if (selected) {
      setIsMenuOpen(false);
      navigate(selected.path);
    }
  };

  const renderNavButton = (item: typeof navItems[number], isMobile = false) => {
    const isActive = activeTab === item.value;
    const Icon = item.icon;

    const baseClass = isMobile
      ? `w-full py-2.5 px-3 flex items-center rounded-md ${
          isActive
            ? 'bg-primary/10 text-primary'
            : 'text-muted-foreground hover:text-foreground hover:bg-accent'
        }`
      : `nav-link px-2 py-1.5 whitespace-nowrap text-sm lg:text-base ${
          isActive
            ? 'text-primary border-b-2 border-primary'
            : 'text-muted-foreground hover:text-foreground'
        }`;

    return (
      <button
        key={item.value}
        onClick={() => handleTabChange(item.value)}
        className={baseClass}
      >
        <Icon className={isMobile ? 'h-5 w-5' : 'h-4 w-4 inline-block'} />
        <span className={isMobile ? 'ml-2' : 'ml-1.5'}>{item.label}</span>
      </button>
    );
  };

  const getActiveTitle = () => {
    return navItems.find(item => item.value === activeTab)?.label || 'Administración';
  };

  return (
    <Layout>
      <div className="w-full">
        {/* Barra de navegación fija debajo del navbar principal */}
        <div className="sticky top-14 sm:top-16 bg-background z-20">
          <div className="w-full px-2 sm:px-4 lg:px-6">
            <div className="flex items-center justify-between h-12 sm:h-14">
              {/* Título en móviles */}
              <div className="flex items-center [@media(min-width:910px)]:hidden">
                <h1 className="text-lg sm:text-xl font-semibold text-foreground">
                  {getActiveTitle()}
                </h1>
              </div>

              {/* Navegación en escritorio */}
              <div className="hidden [@media(min-width:910px)]:flex items-center justify-center flex-1">
                <div className="flex items-center space-x-1 lg:space-x-2">
                  {navItems.map(item => renderNavButton(item))}
                </div>
              </div>

              {/* Botón del menú móvil */}
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

          {/* Navegación móvil */}
          <div
            className={`[@media(min-width:910px)]:hidden transition-all duration-200 ease-in-out ${
              isMenuOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0 overflow-hidden'
            }`}
          >
            <div className="px-3 py-2 space-y-1 bg-background">
              {navItems.map(item => renderNavButton(item, true))}
            </div>
          </div>
        </div>

        {/* Contenido principal dinámico */}
        <div className="w-full py-5">
          <Outlet />
        </div>
      </div>
    </Layout>
  );
};

export default MenuAdmin;
