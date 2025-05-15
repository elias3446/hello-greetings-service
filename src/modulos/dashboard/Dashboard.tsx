import { useState, useMemo } from 'react';
import Layout from '@/components/layout/Layout';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  LayoutDashboard,
  FileText,
  Users,
  FolderTree,
  Shield,
  Activity,
  Menu
} from 'lucide-react';
import DashboardGeneral from './DashboardGeneral';
import DashboardReportes from './DashboardReportes';
import DashboardUsuarios from './DashboardUsuarios';
import DashboardCategorias from './DashboardCategorias';
import DashboardRoles from './DashboardRoles';
import DashboardEstados from './DashboardEstados';
import { Button } from '@/components/ui/button';

// Ítems de navegación
const navItems = [
  { value: 'general', label: 'General', icon: LayoutDashboard },
  { value: 'reportes', label: 'Reportes', icon: FileText },
  { value: 'usuarios', label: 'Usuarios', icon: Users },
  { value: 'categorias', label: 'Categorías', icon: FolderTree },
  { value: 'roles', label: 'Roles', icon: Shield },
  { value: 'estados', label: 'Estados', icon: Activity }
];

const Dashboard = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const initialTab = useMemo(() => searchParams.get('tab') || 'general', [searchParams]);
  const [activeTab, setActiveTab] = useState(initialTab);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setIsMenuOpen(false);
    navigate(`/dashboard?tab=${tab}`);
  };

  const getActiveTitle = () => {
    const activeItem = navItems.find(item => item.value === activeTab);
    return activeItem?.label || 'Dashboard';
  };

  // Componente individual para cada ítem de navegación
  const NavItem = ({ item }: { item: typeof navItems[0] }) => {
    const Icon = item.icon;
    const isActive = activeTab === item.value;
    return (
      <button
        onClick={() => handleTabChange(item.value)}
        className={`nav-link px-2 py-1.5 whitespace-nowrap text-sm lg:text-base ${
          isActive ? 'text-primary border-b-2 border-primary' : 'text-muted-foreground hover:text-foreground'
        }`}
      >
        <Icon className="h-4 w-4 inline-block" />
        <span className="ml-1.5">{item.label}</span>
      </button>
    );
  };

  // Componente para el menú móvil
  const MobileNavItem = ({ item }: { item: typeof navItems[0] }) => {
    const Icon = item.icon;
    const isActive = activeTab === item.value;
    return (
      <button
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
  };

  return (
    <Layout>
      <div className="w-full">
        {/* Navegación fija debajo de la barra superior */}
        <div className="sticky top-14 sm:top-16 bg-background z-20">
          <div className="w-full px-2 sm:px-4 lg:px-6">
            <div className="flex items-center justify-between h-12 sm:h-14">
              {/* Título visible solo en móvil */}
              <div className="flex items-center [@media(min-width:910px)]:hidden">
                <h1 className="text-lg sm:text-xl font-semibold text-foreground">
                  {getActiveTitle()}
                </h1>
              </div>

              {/* Navegación de escritorio */}
              <div className="hidden [@media(min-width:910px)]:flex items-center justify-center flex-1">
                <div className="flex items-center space-x-1 lg:space-x-2">
                  {navItems.map((item) => (
                    <NavItem key={item.value} item={item} />
                  ))}
                </div>
              </div>

              {/* Botón menú móvil */}
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

          {/* Menú móvil desplegable */}
          <div
            className={`[@media(min-width:910px)]:hidden transition-all duration-200 ease-in-out ${
              isMenuOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0 overflow-hidden'
            }`}
          >
            <div className="px-3 py-2 space-y-1 bg-background">
              {navItems.map((item) => (
                <MobileNavItem key={item.value} item={item} />
              ))}
            </div>
          </div>
        </div>

        {/* Contenido del dashboard */}
        <div className="w-full py-5">
          {activeTab === 'general' && <DashboardGeneral />}
          {activeTab === 'reportes' && <DashboardReportes />}
          {activeTab === 'usuarios' && <DashboardUsuarios />}
          {activeTab === 'categorias' && <DashboardCategorias />}
          {activeTab === 'roles' && <DashboardRoles />}
          {activeTab === 'estados' && <DashboardEstados />}
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
