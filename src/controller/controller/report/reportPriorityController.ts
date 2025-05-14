import { Reporte, Usuario, Prioridad } from '@/types/tipos';
import { updateReport } from '../../CRUD/reportController';
import { registrarCambioEstadoReporte } from '../../CRUD/historialEstadosReporte';
import { toast } from '@/components/ui/sonner';

/**
 * Actualiza la prioridad de un reporte y su historial
 * @param reporte - Reporte a actualizar
 * @param nuevaPrioridad - Nueva prioridad del reporte
 * @param realizadoPor - Usuario que realiza la actualización
 * @returns Promise<boolean> - true si la actualización fue exitosa
 */
export const actualizarPrioridadReporte = async (
  reporte: Reporte,
  nuevaPrioridad: Prioridad | undefined,
  realizadoPor: Usuario
): Promise<boolean> => {
  try {
    console.log('Iniciando actualización de prioridad:', {
      reporteId: reporte.id,
      prioridadAnterior: reporte.prioridad,
      nuevaPrioridad
    });

    // 1. Registrar el cambio en el historial de estados del reporte
    await registrarCambioEstadoReporte(
      reporte,
      reporte.prioridad?.nombre || 'Sin prioridad',
      nuevaPrioridad?.nombre || 'Sin prioridad',
      realizadoPor,
      'Cambio de prioridad del reporte',
      'cambio_estado'
    );

    console.log('Historial de reporte actualizado');

    // 2. Actualizar el reporte
    const reporteActualizado = updateReport(reporte.id, { prioridad: nuevaPrioridad });
    if (!reporteActualizado) {
      throw new Error('Error al actualizar el reporte');
    }

    console.log('Reporte actualizado correctamente');
    toast.success(`Prioridad del reporte actualizada correctamente`);
    return true;
  } catch (error) {
    console.error('Error al actualizar la prioridad del reporte:', error);
    toast.error('Error al actualizar la prioridad del reporte');
    return false;
  }
}; 