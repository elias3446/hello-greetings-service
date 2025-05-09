import { Reporte, Usuario } from '@/types/tipos';
import { registrarCambioEstado } from '../CRUD/historialEstadosUsuario';
import { filterReports, getReports, deleteReport } from '../CRUD/reportController';
import { toast } from '@/components/ui/sonner';

/**
 * Elimina un reporte y actualiza todos los registros relacionados
 * @param reporte - Reporte a eliminar
 * @param realizadoPor - Usuario que realiza la eliminación
 * @returns Promise<boolean> - true si la eliminación fue exitosa
 */
export const eliminarReporte = async (
  reporte: Reporte,
  realizadoPor: Usuario
): Promise<boolean> => {
  try {
    console.log('Iniciando eliminación de reporte:', {
      reporteId: reporte.id,
      titulo: reporte.titulo
    });

    // 1. Registrar el cambio en el historial de estados del usuario asignado
    if (reporte.asignadoA) {
      await registrarCambioEstado(
        reporte.asignadoA,
        reporte.asignadoA.estado,
        reporte.asignadoA.estado,
        realizadoPor,
        `Reporte ${reporte.id} eliminado`,
        'otro'
      );
      console.log('Historial de usuario actualizado');
    }

    // 2. Eliminar el reporte
    const success = await deleteReport(reporte.id);
    if (!success) {
      throw new Error('Error al eliminar el reporte');
    }

    // 3. Actualizar los reportes asignados del usuario
    if (reporte.asignadoA) {
      const reportesUsuario = filterReports({ userId: reporte.asignadoA.id });
      console.log('Reportes del usuario actualizados:', reportesUsuario.length);
    }

    console.log('Reporte eliminado correctamente');
    toast.success(`Reporte ${reporte.titulo} eliminado correctamente`);
    return true;
  } catch (error) {
    console.error('Error al eliminar el reporte:', error);
    toast.error('Error al eliminar el reporte');
    return false;
  }
}; 