import { Rol } from '@/types/tipos';
import { roles } from '@/data/roles';

/**
 * Retorna todos los roles existentes.
 */
export const obtenerRoles = (): Rol[] => {
  return [...roles];
};

/**
 * Busca un rol por su ID único.
 * 
 * @param id - ID del rol.
 * @returns El rol encontrado o undefined.
 */
export const obtenerRolPorId = (id: string): Rol | undefined => {
  return roles.find(rol => rol.id === id);
};

/**
 * Crea un nuevo rol con datos proporcionados.
 * 
 * @param datosRol - Datos del nuevo rol, excluyendo el ID.
 * @returns El nuevo rol creado.
 */
export const crearRol = (datosRol: Omit<Rol, 'id' | 'fechaCreacion' | 'activo'>): Rol => {
  const nuevoRol: Rol = {
    id: crypto.randomUUID(),
    ...datosRol,
    fechaCreacion: new Date(),
    activo: true,
  };

  roles.push(nuevoRol);
  return nuevoRol;
};

/**
 * Actualiza un rol existente por ID.
 * 
 * @param id - ID del rol a actualizar.
 * @param datos - Datos parciales a modificar.
 * @returns El rol actualizado.
 * @throws Error si el rol no existe.
 */
export const actualizarRol = (id: string, datos: Partial<Rol>): Rol => {
  const indice = roles.findIndex(rol => rol.id === id);

  if (indice === -1) {
    throw new Error(`Rol con ID "${id}" no encontrado.`);
  }

  const rolActualizado: Rol = {
    ...roles[indice],
    ...datos,
    fechaActualizacion: new Date(),
  };

  roles[indice] = rolActualizado;
  return rolActualizado;
};

/**
 * Elimina un rol por su ID.
 * 
 * @param id - ID del rol a eliminar.
 * @returns true si se eliminó correctamente, false si no se encontró.
 */
export const eliminarRol = (id: string): boolean => {
  const indice = roles.findIndex(rol => rol.id === id);
  if (indice === -1) return false;

  roles.splice(indice, 1);
  return true;
};
