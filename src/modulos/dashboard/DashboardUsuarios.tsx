
import React from 'react';
import { useUserDashboard } from '@/hooks/useUserDashboard';
import UserStatusCards from '@/components/dashboard/UserStatusCards';
import UsersByRoleChart from '@/components/dashboard/UsersByRoleChart';
import UsersByStatusChart from '@/components/dashboard/UsersByStatusChart';
import RecentUsersList from '@/components/dashboard/RecentUsersList';

const DashboardUsuarios = () => {
  const { usuarios, usuariosPorRol, usuariosPorEstado } = useUserDashboard();
  
  // Calcular usuarios activos e inactivos
  const usuariosActivos = usuarios.filter(u => u.estado === 'activo').length;
  const usuariosInactivos = usuarios.filter(u => u.estado === 'inactivo').length;
  
  // Ordenar usuarios por fecha de creación (más recientes primero)
  const recentUsers = [...usuarios]
    .sort((a, b) => new Date(b.fechaCreacion).getTime() - new Date(a.fechaCreacion).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Tarjetas de contadores */}
      <UserStatusCards 
        activeUsers={usuariosActivos} 
        inactiveUsers={usuariosInactivos} 
      />

      {/* Gráficos de usuarios por rol y por estado */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <UsersByRoleChart data={usuariosPorRol} />
        <UsersByStatusChart data={usuariosPorEstado} />
      </div>

      {/* Lista de usuarios recientes */}
      <RecentUsersList users={recentUsers} />
    </div>
  );
};

export default DashboardUsuarios;
