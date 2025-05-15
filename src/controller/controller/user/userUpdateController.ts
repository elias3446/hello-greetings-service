import { Usuario } from '@/types/tipos';
import { updateUser } from '@/controller/CRUD/user/userController';
import { actualizarRolUsuario } from './userRoleController';
import { actualizarEstadoUsuario } from './userStateController';
import { toast } from '@/components/ui/sonner';

/**
 * Actualiza un usuario y sus registros relacionados (rol, estado)
 * @param usuarioAnterior Usuario antes de la actualización
 * @param usuarioActualizado Datos actualizados (parciales)
 * @param realizadoPor Usuario que realiza la actualización
 * @returns Promise<boolean> true si la actualización fue exitosa
 */
export const actualizarUsuario = async (
  usuarioAnterior: Usuario,
  usuarioActualizado: Partial<Usuario>,
  realizadoPor: Usuario
): Promise<boolean> => {
  try {
    console.log(`Iniciando actualización de usuario: ${usuarioAnterior.id} - ${usuarioAnterior.nombre} ${usuarioAnterior.apellido}`);

    // Detectar cambio de rol
    const rolAnteriorId = usuarioAnterior.roles[0]?.id ?? '';
    const rolNuevoId = usuarioActualizado.roles?.[0]?.id ?? rolAnteriorId;
    const rolCambiado = rolAnteriorId !== rolNuevoId;

    if (rolCambiado) {
      console.log(`Detectado cambio de rol de "${rolAnteriorId}" a "${rolNuevoId}"`);
      const resultadoRol = await actualizarRolUsuario(
        usuarioAnterior.id,
        rolNuevoId,
        realizadoPor,
        `Cambio de rol para usuario ${usuarioAnterior.nombre} ${usuarioAnterior.apellido}`
      );
      if (!resultadoRol) {
        throw new Error('Error al actualizar el rol');
      }
    }

    // Detectar cambio de estado
    const estadoAnterior = usuarioAnterior.estado;
    // Si no viene estado nuevo, mantener el anterior
    const estadoNuevo = usuarioActualizado.estado ?? estadoAnterior;
    const estadoCambiado = estadoAnterior !== estadoNuevo;

    if (estadoCambiado) {
      console.log(`Detectado cambio de estado de "${estadoAnterior}" a "${estadoNuevo}"`);
      const resultadoEstado = await actualizarEstadoUsuario(
        usuarioAnterior,
        estadoNuevo,
        realizadoPor
      );
      if (!resultadoEstado) {
        throw new Error('Error al actualizar el estado');
      }
    }

    // Actualizar datos generales del usuario
    const usuarioFinal = updateUser(usuarioAnterior.id, usuarioActualizado);
    if (!usuarioFinal) {
      throw new Error('Error al actualizar el usuario');
    }

    console.log(`Usuario ${usuarioAnterior.nombre} ${usuarioAnterior.apellido} actualizado correctamente`);
    toast.success(`Usuario ${usuarioAnterior.nombre} ${usuarioAnterior.apellido} actualizado correctamente`);
    return true;

  } catch (error) {
    console.error('Error al actualizar el usuario:', error);
    toast.error('Error al actualizar el usuario');
    return false;
  }
};
