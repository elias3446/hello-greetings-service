
import { Rol } from '../types/tipos';
import { roles } from '../data/roles';
import { permisosDisponibles } from '../data/permisos';

// Obtener todos los roles
export const getRoles = (): Rol[] => {
  return roles;
};

// Obtener un rol por ID
export const getRoleById = (id: string): Rol | undefined => {
  return roles.find((role) => role.id === id);
};

// Crear un nuevo rol
export const createRole = (roleData: Omit<Rol, 'id'>): Rol => {
  const newRole: Rol = {
    id: crypto.randomUUID(),
    ...roleData,
    fechaCreacion: new Date(),
    activo: true
  };
  roles.push(newRole);
  return newRole;
};

// Actualizar un rol
export const updateRole = (id: string, roleData: Partial<Rol>): Rol => {
  const index = roles.findIndex((role) => role.id === id);
  if (index === -1) {
    throw new Error('Rol no encontrado');
  }

  // Actualizar el rol existente manteniendo los campos no modificados
  const rolActualizado: Rol = {
    ...roles[index],
    ...roleData,
    fechaActualizacion: new Date()
  };

  roles[index] = rolActualizado;
  return rolActualizado;
};

// Eliminar un rol
export const deleteRole = (id: string): boolean => {
  const index = roles.findIndex((role) => role.id === id);
  if (index !== -1) {
    roles.splice(index, 1);
    return true;
  }
  return false;
};
