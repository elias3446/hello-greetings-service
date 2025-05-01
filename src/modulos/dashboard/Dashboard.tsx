
import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import DashboardGeneral from './DashboardGeneral';
import DashboardReportes from './DashboardReportes';
import DashboardUsuarios from './DashboardUsuarios';
import DashboardCategorias from './DashboardCategorias';
import DashboardRoles from './DashboardRoles';
import DashboardEstados from './DashboardEstados';
import { useNavigate, useSearchParams } from 'react-router-dom';

const Dashboard = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const initialTab = searchParams.get('tab') || 'general';
  const [activeTab, setActiveTab] = useState(initialTab);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    navigate(`/dashboard?tab=${value}`);
  };

  return (
    <Layout titulo="Panel de Control">
      <div className="space-y-8">
        <div className="p-1 bg-muted/40 rounded-lg">
          <Tabs
            value={activeTab}
            onValueChange={handleTabChange}
            className="w-full"
          >
            <TabsList className="grid grid-cols-3 md:grid-cols-6 w-full">
              <TabsTrigger value="general">General</TabsTrigger>
              <TabsTrigger value="reportes">Reportes</TabsTrigger>
              <TabsTrigger value="usuarios">Usuarios</TabsTrigger>
              <TabsTrigger value="categorias">Categorías</TabsTrigger>
              <TabsTrigger value="roles">Roles</TabsTrigger>
              <TabsTrigger value="estados">Estados</TabsTrigger>
            </TabsList>

            <TabsContent value="general" className="mt-6">
              <DashboardGeneral />
            </TabsContent>

            <TabsContent value="reportes" className="mt-6">
              <DashboardReportes />
            </TabsContent>

            <TabsContent value="usuarios" className="mt-6">
              <DashboardUsuarios />
            </TabsContent>

            <TabsContent value="categorias" className="mt-6">
              <DashboardCategorias />
            </TabsContent>

            <TabsContent value="roles" className="mt-6">
              <DashboardRoles />
            </TabsContent>

            <TabsContent value="estados" className="mt-6">
              <DashboardEstados />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
