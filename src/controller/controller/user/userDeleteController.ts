import { Usuario, Reporte } from '@/types/tipos';
import { deleteUser } from '@/controller/CRUD/userController';
import { registrarCambioEstado } from '@/controller/CRUD/historialEstadosUsuario';
import { registrarCambioEstadoReporte } from '@/controller/CRUD/historialEstadosReporte';
import { filterReports } from '@/controller/CRUD/reportController';
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
    console.log('Iniciando eliminación de usuario:', {
      usuarioId: usuario.id,
      nombre: usuario.nombre
    });

    // 1. Obtener los reportes asignados antes de eliminar
    const reportesAsignados = filterReports({ userId: usuario.id });
    console.log('Reportes asignados encontrados:', reportesAsignados.length);

    // 2. Registrar el cambio en el historial de estados del usuario
    await registrarCambioEstado(
      usuario,
      usuario.estado,
      'eliminado',
      realizadoPor,
      'Usuario eliminado del sistema',
      'otro'
    );

    console.log('Historial de usuario actualizado');

    // 3. Actualizar el historial de estados y asignaciones de cada reporte
    for (const reporte of reportesAsignados) {
      console.log('Actualizando historial de reporte:', {
        reporteId: reporte.id,
        estadoAnterior: `${usuario.nombre} ${usuario.apellido}`,
        estadoNuevo: 'Sin responsable'
      });

      await registrarCambioEstadoReporte(
        reporte,
        `${usuario.nombre} ${usuario.apellido}`,
        'Sin responsable',
        realizadoPor,
        'Usuario eliminado del sistema',
        'asignacion_reporte'
      );

      console.log('Historial de reporte actualizado');
    }

    // 4. Eliminar el usuario
    const resultado = deleteUser(usuario.id);
    
    if (!resultado) {
      throw new Error('Error al eliminar el usuario');
    }

    console.log('Usuario eliminado correctamente');
    toast.success(`Usuario ${usuario.nombre} ${usuario.apellido} eliminado correctamente`);
    return true;
  } catch (error) {
    console.error('Error al eliminar el usuario:', error);
    toast.error('Error al eliminar el usuario');
    return false;
  }
}; 