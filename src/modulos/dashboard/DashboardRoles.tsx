
import React from 'react';
import { useRoleDashboard } from '@/hooks/useRoleDashboard';
import RolesTotalCard from '@/components/dashboard/RolesTotalCard';
import UsuariosPorRolChart from '@/components/dashboard/UsuariosPorRolChart';
import PermisosPorRolChart from '@/components/dashboard/PermisosPorRolChart';
import RolesDetailList from '@/components/dashboard/RolesDetailList';

const DashboardRoles = () => {
  const { roles, usuariosPorRol, permisosPorRol } = useRoleDashboard();
  
  return (
    <div className="space-y-6">
      {/* Tarjeta principal de roles */}
      <RolesTotalCard totalRoles={roles.length} />

      {/* Gráficos de roles */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <UsuariosPorRolChart data={usuariosPorRol} />
        <PermisosPorRolChart data={permisosPorRol} />
      </div>

      {/* Detalles de roles */}
      <RolesDetailList roles={roles} />
    </div>
  );
};

export default DashboardRoles;
