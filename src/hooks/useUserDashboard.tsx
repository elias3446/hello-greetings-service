
import { useState, useEffect } from 'react';
import { getUsers } from '@/controller/userController';
import { Usuario } from '@/types/tipos';
import { roles } from '@/data/roles';

export const useUserDashboard = () => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [usuariosPorRol, setUsuariosPorRol] = useState<any[]>([]);
  const [usuariosPorEstado, setUsuariosPorEstado] = useState<any[]>([]);
  
  useEffect(() => {
    const usuariosData = getUsers();
    setUsuarios(usuariosData);

    // Usuarios por rol
    // Crear un mapa de roles para contar usuarios
    const rolesMap = roles.reduce((acc: Record<string, { name: string, value: number, color: string }>, rol) => {
      acc[rol.id] = { 
        name: rol.nombre, 
        value: 0, 
        color: rol.color 
      };
      return acc;
    }, {});

    // Contar usuarios por rol
    usuariosData.forEach(usuario => {
      usuario.roles.forEach(rol => {
        if (rolesMap[rol.id]) {
          rolesMap[rol.id].value += 1;
        }
      });
    });

    setUsuariosPorRol(Object.values(rolesMap).filter(r => r.value > 0));

    // Usuarios por estado
    const usuariosActivos = usuariosData.filter(u => u.estado === 'activo').length;
    const usuariosInactivos = usuariosData.filter(u => u.estado === 'inactivo').length;

    setUsuariosPorEstado([
      { name: 'Activos', value: usuariosActivos, color: '#10b981' },
      { name: 'Inactivos', value: usuariosInactivos, color: '#f43f5e' }
    ]);

  }, []);

  return {
    usuarios,
    usuariosPorRol,
    usuariosPorEstado
  };
};

export default useUserDashboard;
