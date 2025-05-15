import { Usuario } from '@/types/tipos';
import { usuarios } from '@/data/usuarios';
import { filtrarReportes, actualizarReporte } from '@/controller/CRUD/report/reportController';

/**
 * Retorna la lista completa de usuarios registrados.
 */
export const getUsers = (): Usuario[] => usuarios;

/**
 * Busca y retorna un usuario por su ID.
 * @param id - Identificador único del usuario.
 */
export const getUserById = (id: string): Usuario | undefined =>
  usuarios.find((usuario) => usuario.id === id);

/**
 * Crea un nuevo usuario y lo agrega a la lista.
 * @param userData - Datos del usuario sin el ID (este se genera automáticamente).
 */
export const createUser = (userData: Omit<Usuario, 'id'>): Usuario => {
  const nuevoUsuario: Usuario = {
    id: crypto.randomUUID(),
    ...userData,
  };
  usuarios.push(nuevoUsuario);
  return nuevoUsuario;
};

/**
 * Actualiza la información de un usuario existente.
 * @param id - ID del usuario a actualizar.
 * @param userData - Datos a actualizar.
 */
export const updateUser = (id: string, userData: Partial<Usuario>): Usuario | undefined => {
  const index = usuarios.findIndex((usuario) => usuario.id === id);
  if (index === -1) return undefined;

  const usuarioActualizado = { ...usuarios[index], ...userData };
  usuarios[index] = usuarioActualizado;
  return usuarioActualizado;
};

/**
 * Elimina un usuario por su ID.
 * También desasigna los reportes que tenía asignados.
 * @param id - ID del usuario a eliminar.
 */
export const deleteUser = (id: string): boolean => {
  const index = usuarios.findIndex((usuario) => usuario.id === id);
  if (index === -1) return false;

  // Desasignar reportes relacionados antes de eliminar el usuario
  const reportesAsignados = filtrarReportes({ userId: id });
  reportesAsignados.forEach((reporte) => {
    actualizarReporte(reporte.id, { asignadoA: undefined });
  });

  usuarios.splice(index, 1);
  return true;
};
