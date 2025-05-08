import { Usuario } from '@/types/tipos';
import { updateUser } from '../CRUD/userController';
import { registrarCambioEstado } from '../CRUD/historialEstadosUsuario';
import { registrarCambioEstadoReporte } from '../CRUD/historialEstadosReporte';
import { filterReports } from '../CRUD/reportController';
import { actualizarRolUsuario } from './userRoleController';
import { actualizarEstadoUsuario } from './userStateController';
import { toast } from '@/components/ui/sonner';

/**
 * Actualiza un usuario y todos sus registros relacionados
 * @param usuarioAnterior - Usuario antes de la actualización
 * @param usuarioActualizado - Datos actualizados del usuario
 * @param realizadoPor - Usuario que realiza la actualización
 * @returns Promise<boolean> - true si la actualización fue exitosa
 */
export const actualizarUsuario = async (
  usuarioAnterior: Usuario,
  usuarioActualizado: Partial<Usuario>,
  realizadoPor: Usuario
): Promise<boolean> => {
  try {
    console.log('Iniciando actualización de usuario:', {
      usuarioId: usuarioAnterior.id,
      nombre: usuarioAnterior.nombre
    });

    // 1. Verificar si hay cambios en el rol
    const rolCambiado = usuarioAnterior.roles[0]?.id !== usuarioActualizado.roles?.[0]?.id;
    if (rolCambiado) {
      console.log('Detectado cambio de rol');
      const resultadoRol = actualizarRolUsuario(
        usuarioAnterior.id,
        usuarioActualizado.roles?.[0]?.id || '',
        realizadoPor,
        `Cambio de rol para usuario ${usuarioAnterior.nombre} ${usuarioAnterior.apellido}`
      );
      if (!resultadoRol) {
        throw new Error('Error al actualizar el rol');
      }
    }

    // 2. Verificar si hay cambios en el estado
    const estadoCambiado = usuarioAnterior.estado !== usuarioActualizado.estado;
    if (estadoCambiado) {
      console.log('Detectado cambio de estado');
      const resultadoEstado = await actualizarEstadoUsuario(
        usuarioAnterior,
        usuarioActualizado.estado || 'activo',
        realizadoPor
      );
      if (!resultadoEstado) {
        throw new Error('Error al actualizar el estado');
      }
    }

    // 3. Actualizar el usuario
    const usuarioFinal = updateUser(usuarioAnterior.id, usuarioActualizado);
    if (!usuarioFinal) {
      throw new Error('Error al actualizar el usuario');
    }

    console.log('Usuario actualizado correctamente');
    toast.success(`Usuario ${usuarioAnterior.nombre} ${usuarioAnterior.apellido} actualizado correctamente`);
    return true;
  } catch (error) {
    console.error('Error al actualizar el usuario:', error);
    toast.error('Error al actualizar el usuario');
    return false;
  }
}; 