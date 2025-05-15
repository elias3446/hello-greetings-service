import { Usuario } from '@/types/tipos';
import { updateUser } from '@/controller/CRUD/user/userController';
import { registrarCambioEstado } from '@/controller/CRUD/user/historialEstadosUsuario';
import { obtenerRolPorId } from '@/controller/CRUD/role/roleController'; // Asegúrate de importar esta función

/**
 * Actualiza el rol de un usuario y registra el cambio en el historial
 * @param idUsuario - ID del usuario a actualizar
 * @param nuevoRolId - ID del nuevo rol a asignar
 * @param realizadoPor - Usuario que realiza el cambio
 * @param motivoCambio - Motivo opcional del cambio
 * @returns El usuario actualizado o undefined si no se encontró o hubo error
 */
export const actualizarRolUsuario = (
  idUsuario: string,
  nuevoRolId: string,
  realizadoPor: Usuario,
  motivoCambio?: string
): Usuario | undefined => {
  // Obtener el usuario actual sin modificar (usando un getUser si existe)
  // Aquí asumo que updateUser(id, {}) devuelve el usuario sin cambios, si no, usa otra función para obtener usuario
  const usuarioActual = updateUser(idUsuario, {});
  if (!usuarioActual) {
    console.error(`[actualizarRolUsuario] Usuario no encontrado: ${idUsuario}`);
    return undefined;
  }

  // Obtener el nuevo rol por su ID
  const nuevoRol = obtenerRolPorId(nuevoRolId);
  if (!nuevoRol) {
    console.error(`[actualizarRolUsuario] Rol no encontrado: ${nuevoRolId}`);
    return undefined;
  }

  // Obtener nombre del rol anterior para el historial
  const rolAnterior = usuarioActual.roles?.[0]?.nombre ?? 'sin rol';

  // Verificar si el nuevo rol es igual al actual para evitar actualización innecesaria
  if (rolAnterior === nuevoRol.nombre) {
    console.log(`[actualizarRolUsuario] El usuario ya tiene el rol "${rolAnterior}"`);
    return usuarioActual;
  }

  // Actualizar el usuario con el nuevo rol
  const usuarioActualizado = updateUser(idUsuario, { roles: [nuevoRol] });
  if (!usuarioActualizado) {
    console.error(`[actualizarRolUsuario] Error al actualizar el usuario con nuevo rol`);
    return undefined;
  }

  // Registrar el cambio de rol en el historial
  registrarCambioEstado(
    usuarioActualizado,
    rolAnterior,
    nuevoRol.nombre,
    realizadoPor,
    motivoCambio ?? `Cambio de rol de "${rolAnterior}" a "${nuevoRol.nombre}"`,
    'cambio_rol'
  );

  return usuarioActualizado;
};
