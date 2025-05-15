import { Usuario, Reporte } from '@/types/tipos';
import { deleteUser } from '@/controller/CRUD/user/userController';
import { registrarCambioEstado } from '@/controller/CRUD/user/historialEstadosUsuario';
import { registrarCambioEstadoReporte } from '@/controller/CRUD/report/historialEstadosReporte';
import { filtrarReportes } from '@/controller/CRUD/report/reportController';
import { toast } from '@/components/ui/sonner';

/**
 * Elimina un usuario y actualiza todos los registros relacionados
 * @param usuario - Usuario a eliminar
 * @param realizadoPor - Usuario que realiza la eliminación
 * @returns Promise<boolean> - true si la eliminación fue exitosa
 */
export const eliminarUsuario = async (
  usuario: Usuario,
  realizadoPor: Usuario
): Promise<boolean> => {
  try {
    console.log('[eliminarUsuario] Iniciando eliminación de usuario:', {
      usuarioId: usuario.id,
      nombreCompleto: `${usuario.nombre} ${usuario.apellido}`
    });

    // 1. Obtener reportes asignados al usuario antes de eliminarlo
    const reportesAsignados = filtrarReportes({ userId: usuario.id });
    console.log(`[eliminarUsuario] Reportes asignados encontrados: ${reportesAsignados.length}`);

    // 2. Registrar cambio de estado del usuario a "eliminado" en historial
    await registrarCambioEstado(
      usuario,
      usuario.estado,
      'eliminado',
      realizadoPor,
      'Usuario eliminado del sistema',
      'otro'
    );
    console.log('[eliminarUsuario] Historial de estados de usuario actualizado');

    // 3. Actualizar historial de cada reporte asignado, marcando "Sin responsable"
    for (const reporte of reportesAsignados) {
      console.log(`[eliminarUsuario] Actualizando historial del reporte ${reporte.id}`);
      await registrarCambioEstadoReporte(
        reporte,
        `${usuario.nombre} ${usuario.apellido}`,
        'Sin responsable',
        realizadoPor,
        'Usuario eliminado del sistema',
        'asignacion_reporte'
      );
      console.log(`[eliminarUsuario] Historial del reporte ${reporte.id} actualizado`);
    }

    // 4. Eliminar el usuario
    const resultado = await deleteUser(usuario.id);
    if (!resultado) {
      throw new Error('Error al eliminar el usuario');
    }

    console.log('[eliminarUsuario] Usuario eliminado correctamente');
    toast.success(`Usuario ${usuario.nombre} ${usuario.apellido} eliminado correctamente`);
    return true;
  } catch (error) {
    console.error('[eliminarUsuario] Error al eliminar el usuario:', error);
    toast.error('Error al eliminar el usuario');
    return false;
  }
};
