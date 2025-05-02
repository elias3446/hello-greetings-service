import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FileText, 
  Users, 
  FolderTree, 
  Shield, 
  Activity 
} from 'lucide-react';
import DashboardGeneral from './DashboardGeneral';
import DashboardReportes from './DashboardReportes';
import DashboardUsuarios from './DashboardUsuarios';
import DashboardCategorias from './DashboardCategorias';
import DashboardRoles from './DashboardRoles';
import DashboardEstados from './DashboardEstados';

const Dashboard = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const initialTab = searchParams.get('tab') || 'general';
  const [activeTab, setActiveTab] = useState(initialTab);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
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

  return (
    <Layout>
      <div >
        <nav className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-[100] w-full">
          <div className="w-full">
            <div className="flex h-16">
              <div className="flex w-full">
                <div className="flex w-full justify-center space-x-4">
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.value}
                        onClick={() => handleTabChange(item.value)}
                        className={`nav-link ${activeTab === item.value ? 'text-primary border-b-2 border-primary' : 'text-muted-foreground hover:text-foreground'}`}
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
