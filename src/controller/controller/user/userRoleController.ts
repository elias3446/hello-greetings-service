import { Usuario } from '@/types/tipos';
import { updateUser } from '@/controller/CRUD/userController';
import { registrarCambioEstado } from '@/controller/CRUD/historialEstadosUsuario';
import { getRoleById } from '@/controller/CRUD/roleController';

/**
 * Actualiza el rol de un usuario y registra el cambio en el historial
 * @param idUsuario - ID del usuario a actualizar
 * @param nuevoRolId - ID del nuevo rol a asignar
 * @param realizadoPor - Usuario que realiza el cambio
 * @param motivoCambio - Motivo opcional del cambio
 * @returns El usuario actualizado o undefined si no se encontró
 */
export const actualizarRolUsuario = (
  idUsuario: string,
  nuevoRolId: string,
  realizadoPor: Usuario,
  motivoCambio?: string
): Usuario | undefined => {
  // Obtener el usuario actual
  const usuarioActual = updateUser(idUsuario, {});
  if (!usuarioActual) {
    console.error('Usuario no encontrado:', idUsuario);
    return undefined;
  }

  // Obtener el nuevo rol
  const nuevoRol = getRoleById(nuevoRolId);
  if (!nuevoRol) {
    console.error('Rol no encontrado:', nuevoRolId);
    return undefined;
  }

  // Obtener el rol anterior para el historial
  const rolAnterior = usuarioActual.roles[0]?.nombre || 'sin rol';

  // Actualizar el usuario con el nuevo rol
  const usuarioActualizado = updateUser(idUsuario, {
    roles: [nuevoRol]
  });

  if (!usuarioActualizado) {
    console.error('Error al actualizar el usuario');
    return undefined;
  }

  // Registrar el cambio en el historial
  registrarCambioEstado(
    usuarioActualizado,
    rolAnterior,
    nuevoRol.nombre,
    realizadoPor,
    motivoCambio || `Cambio de rol de ${rolAnterior} a ${nuevoRol.nombre}`,
    'cambio_rol'
  );

  return usuarioActualizado;
}; 