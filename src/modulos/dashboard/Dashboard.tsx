import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
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

const Dashboard = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const initialTab = searchParams.get('tab') || 'general';
  const [activeTab, setActiveTab] = useState(initialTab);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setIsMenuOpen(false);
    navigate(`/dashboard?tab=${value}`);
  };

  const navItems = [
    { value: 'general', label: 'General', icon: LayoutDashboard },
    { value: 'reportes', label: 'Reportes', icon: FileText },
    { value: 'usuarios', label: 'Usuarios', icon: Users },
    { value: 'categorias', label: 'Categorías', icon: FolderTree },
    { value: 'roles', label: 'Roles', icon: Shield },
    { value: 'estados', label: 'Estados', icon: Activity }
  ];

  const getActiveTitle = () => {
    const activeItem = navItems.find(item => item.value === activeTab);
    return activeItem ? activeItem.label : 'Dashboard';
  };

  return (
    <Layout>
      <div className="w-full">
        {/* Static dashboard navigation under the main NavBar */}
        <div className="sticky top-14 sm:top-16 bg-background z-20 border-b shadow-sm">
          <div className="w-full px-2 sm:px-4 lg:px-6">
            <div className="flex items-center justify-between h-12 sm:h-14">
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
                    return (
                      <button
                        key={item.value}
                        onClick={() => handleTabChange(item.value)}
                        className={`nav-link px-2 py-1.5 whitespace-nowrap text-sm lg:text-base ${
                          activeTab === item.value 
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
            <div className="px-3 py-2 space-y-1 bg-background">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.value}
                    onClick={() => handleTabChange(item.value)}
                    className={`w-full py-2.5 px-3 flex items-center rounded-md ${
                      activeTab === item.value 
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
        </div>

        {/* Dashboard Content */}
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
