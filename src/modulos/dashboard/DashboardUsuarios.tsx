import { useEffect, useState } from 'react';
import { getUsers } from '@/controller/CRUD/user/userController';
import { Usuario } from '@/types/tipos';
import { ChartData } from '@/props/dashboard/PropDashboardUsuarios';
import UserStatusCards from '@/components/dashboard/dashboardUsuarios/UserStatusCards';
import UserCharts from '@/components/dashboard/dashboardUsuarios/UserCharts';
import RecentUsersList from '@/components/dashboard/dashboardUsuarios/RecentUsersList';

const DashboardUsuarios = () => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [usuariosPorRol, setUsuariosPorRol] = useState<ChartData[]>([]);
  const [usuariosPorEstado, setUsuariosPorEstado] = useState<ChartData[]>([]);

  useEffect(() => {
    const usuariosData = getUsers();

    // Usuarios por rol
    const roles = usuariosData.reduce((acc: { [key: string]: ChartData }, usuario) => {
      usuario.roles.forEach(rol => {
        if (!acc[rol.id]) {
          acc[rol.id] = { 
            name: rol.nombre, 
            value: 0,
            color: rol.color 
          };
        }
        acc[rol.id].value += 1;
      });
      return acc;
    }, {});

    setUsuariosPorRol(Object.values(roles).filter(rol => rol.value > 0));

    // Usuarios por estado
    const estados = usuariosData.reduce((acc: { [key: string]: ChartData }, usuario) => {
      const estado = usuario.estado;
      if (!acc[estado]) {
        acc[estado] = { 
          name: estado.charAt(0).toUpperCase() + estado.slice(1), 
          value: 0,
          color: estado === 'activo' ? '#10b981' : estado === 'inactivo' ? '#f43f5e' : '#f59e0b'
        };
      }
      acc[estado].value += 1;
      return acc;
    }, {});

    setUsuariosPorEstado(Object.values(estados).filter(estado => estado.value > 0));
    setUsuarios(usuariosData);
  }, []);

  return (
    <div className="space-y-6">
      <UserStatusCards usuarios={usuarios} />
      <UserCharts usuariosPorRol={usuariosPorRol} usuariosPorEstado={usuariosPorEstado} />
      <RecentUsersList usuarios={usuarios} />
    </div>
  );
};

export default DashboardUsuarios;
