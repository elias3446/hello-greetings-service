import { useEffect, useState } from 'react';
import { obtenerRoles } from '@/controller/CRUD/role/roleController';
import { getUsers } from '@/controller/CRUD/user/userController';
import RoleTotalCard from '@/components/dashboard/dashboardRoles/RoleTotalCard';
import RoleCharts from '@/components/dashboard/dashboardRoles/RoleCharts';
import RoleDetails from '@/components/dashboard/dashboardRoles/RoleDetails';
import { Rol } from '@/types/tipos';
import { ChartData } from '@/props/dashboard/PropDashboardRoles';

const DashboardRoles = () => {
  const [roles, setRoles] = useState<Rol[]>([]);
  const [usuariosPorRol, setUsuariosPorRol] = useState<ChartData[]>([]);
  const [permisosPorRol, setPermisosPorRol] = useState<ChartData[]>([]);
  
  useEffect(() => {
    const rolesData = obtenerRoles();
    const usuariosData = getUsers();
    
    setRoles(rolesData);

    // Usuarios por rol
    const usuariosPorRol = rolesData.map(rol => ({
      name: rol.nombre,
      value: usuariosData.filter(u => u.roles?.some(r => r.id === rol.id)).length,
      color: rol.color
    }));

    // Permisos por rol
    const permisosPorRol = rolesData.map(rol => ({
      name: rol.nombre,
      value: rol.permisos?.length || 0,
      color: rol.color
    }));

    setUsuariosPorRol(usuariosPorRol);
    setPermisosPorRol(permisosPorRol);

  }, []);

  return (
    <div className="space-y-6">
      <RoleTotalCard totalRoles={roles.length} />
      <RoleCharts 
        usuariosPorRol={usuariosPorRol}
        permisosPorRol={permisosPorRol}
      />
      <RoleDetails roles={roles} />
    </div>
  );
};

export default DashboardRoles;
