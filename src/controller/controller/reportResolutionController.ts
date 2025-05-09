import { Reporte, Usuario } from '@/types/tipos';
import { updateReport } from '../CRUD/reportController';
import { registrarCambioEstadoReporte } from '../CRUD/historialEstadosReporte';
import { toast } from '@/components/ui/sonner';

/**
 * Marca un reporte como resuelto o lo reabre
 * @param reporte - Reporte a actualizar
 * @param realizadoPor - Usuario que realiza la acción
 * @returns Promise<boolean> - true si la actualización fue exitosa
 */
export const actualizarEstadoResolucionReporte = async (
  reporte: Reporte,
  realizadoPor: Usuario
): Promise<boolean> => {
  try {
    console.log('Iniciando actualización de estado de resolución:', {
      reporteId: reporte.id,
      titulo: reporte.titulo,
      nuevoEstado: !reporte.activo ? 'resuelto' : 'activo'
    });

    // Actualizar el estado del reporte
    const updatedReport = updateReport(reporte.id, { activo: !reporte.activo });
    if (!updatedReport) {
      throw new Error('Error al actualizar el estado del reporte');
    }

    // Registrar el cambio en el historial del reporte
    await registrarCambioEstadoReporte(
      reporte,
      reporte.activo ? 'Activo' : 'Resuelto',
      !reporte.activo ? 'Activo' : 'Resuelto',
      realizadoPor,
      reporte.activo ? 'Reporte resuelto' : 'Reporte reabierto',
      'cambio_estado'
    );

    console.log('Estado de resolución actualizado correctamente');
    toast.success(reporte.activo ? 'Reporte marcado como resuelto' : 'Reporte reabierto');
    return true;
  } catch (error) {
    console.error('Error al actualizar el estado de resolución:', error);
    toast.error('Error al actualizar el estado del reporte');
    return false;
  }
}; 