import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Layout from '@/components/layout/Layout';
import DetalleUsuarioBreadcrumb from '@/components/admin/usuarios/detalleUsuario/DetalleUsuarioBreadcrumb';
import { DetalleUsuarioMain } from '@/components/admin/usuarios/detalleUsuario/DetalleUsuarioMain';
import DetalleUsuarioSidebar from '@/components/admin/usuarios/detalleUsuario/DetalleUsuarioSidebar';
import { useDetalleUsuarioLogic } from '@/constants/admin/user/DetalleUsuarioLogic';

const DetalleUsuario: React.FC = () => {
  const {
    usuario,
    loading,
    reportesAsignados,
    historialEstados,
    handleRoleChange,
    handleEditarUsuario,
    handleCambiarEstado,
    handleDelete,
    actividadesDelUsuario,
    navigate
  } = useDetalleUsuarioLogic();

  if (loading) {
    return (
      <Layout titulo="Cargando usuario...">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </Layout>
    );
  }

  if (!usuario) {
    return (
      <Layout titulo="Usuario no encontrado">
        <div className="text-center py-10">
          <AlertTriangle className="mx-auto h-12 w-12 text-yellow-500 mb-4" />
          <h2 className="text-2xl font-semibold mb-2">Usuario no encontrado</h2>
          <p className="text-muted-foreground mb-6">No se pudo encontrar el usuario solicitado</p>
          <Button onClick={() => navigate('/admin/usuarios')}>Volver a la lista</Button>
        </div>
      </Layout>
    );
  }

  return (
    <div>
      <div className="space-y-6">
        <DetalleUsuarioBreadcrumb />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <DetalleUsuarioMain
            usuario={usuario}
            reportesAsignados={reportesAsignados}
            actividadesDelUsuario={actividadesDelUsuario}
            onEditarUsuario={handleEditarUsuario}
          />
          <DetalleUsuarioSidebar
                  usuario={usuario}
            historialEstados={historialEstados}
                  onRoleChange={handleRoleChange}
                  onEstadoChange={handleCambiarEstado}
            onDelete={handleDelete}
                />
        </div>
      </div>
    </div>
  );
};

export default DetalleUsuario;
