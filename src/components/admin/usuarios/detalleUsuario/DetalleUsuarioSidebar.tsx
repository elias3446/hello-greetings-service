import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { UserActions } from '@/components/admin/usuarios/UserActions';
import { UserHistory } from '@/components/admin/usuarios/UserHistory';
import { DetalleUsuarioSidebarProps } from '@/props/admin/usuarios/PropDetalleusuario';

const DetalleUsuarioSidebar: React.FC<DetalleUsuarioSidebarProps> = ({
  usuario,
  historialEstados,
  onRoleChange,
  onEstadoChange,
  onDelete
}) => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Acciones rápidas</CardTitle>
          <CardDescription>Opciones para gestionar este usuario</CardDescription>
        </CardHeader>
        <CardContent>
          <UserActions
            usuario={usuario}
            onRoleChange={onRoleChange}
            onEstadoChange={onEstadoChange}
            onDelete={onDelete}
          />
        </CardContent>
      </Card>
      
      <UserHistory historial={historialEstados} />
    </div>
  );
};

export default DetalleUsuarioSidebar; 