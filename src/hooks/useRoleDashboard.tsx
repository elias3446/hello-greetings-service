
import { useState, useEffect } from 'react';
import { getRoles } from '@/controller/roleController';
import { getUsers } from '@/controller/userController';
import { Rol } from '@/types/tipos';

export const useRoleDashboard = () => {
  const [roles, setRoles] = useState<Rol[]>([]);
  const [usuariosPorRol, setUsuariosPorRol] = useState<any[]>([]);
  const [permisosPorRol, setPermisosPorRol] = useState<any[]>([]);
  
  useEffect(() => {
    const rolesData = getRoles();
    const usuariosData = getUsers();
    
    setRoles(rolesData);

    // Usuarios por rol
    const usuariosRol = rolesData.map(rol => {
      const usuariosConRol = usuariosData.filter(usuario => 
        usuario.roles.some(r => r.id === rol.id)
      ).length;
      
      return {
        name: rol.nombre,
        value: usuariosConRol,
        color: rol.color
      };
    });

    setUsuariosPorRol(usuariosRol);

    // Permisos por rol
    const permisosPorRolData = rolesData.map(rol => {
      return {
        name: rol.nombre,
        value: rol.permisos?.length || 0,
        color: rol.color
      };
    }).sort((a, b) => b.value - a.value);

    setPermisosPorRol(permisosPorRolData);
  }, []);

  return {
    roles,
    usuariosPorRol,
    permisosPorRol,
  };
};

export default useRoleDashboard;
