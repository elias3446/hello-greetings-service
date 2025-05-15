import { Reporte, Usuario, EstadoReporte } from '@/types/tipos';
import { updateReport } from '@/controller/CRUD/report/reportController';
import { registrarCambioEstadoReporte } from '@/controller/CRUD/report/historialEstadosReporte';
import { toast } from '@/components/ui/sonner';

/**
 * Actualiza el estado de un reporte y su historial
 * @param reporte - Reporte a actualizar
 * @param nuevoEstado - Nuevo estado del reporte
 * @param realizadoPor - Usuario que realiza la actualización
 * @returns Promise<boolean> - true si la actualización fue exitosa
 */
export const actualizarEstadoReporte = async (
  reporte: Reporte,
  nuevoEstado: EstadoReporte,
  realizadoPor: Usuario
): Promise<boolean> => {
  try {
    console.log('Iniciando actualización de estado:', {
      reporteId: reporte.id,
      estadoAnterior: reporte.estado,
      nuevoEstado
    });

    // 1. Registrar el cambio en el historial de estados del reporte
    await registrarCambioEstadoReporte(
      reporte,
      reporte.estado.nombre,
      nuevoEstado.nombre,
      realizadoPor,
      'Cambio de estado del reporte',
      'cambio_estado'
    );

    console.log('Historial de reporte actualizado');

    // 2. Actualizar el reporte
    const reporteActualizado = updateReport(reporte.id, { estado: nuevoEstado });
    if (!reporteActualizado) {
      throw new Error('Error al actualizar el reporte');
    }

    console.log('Reporte actualizado correctamente');
    toast.success(`Estado del reporte actualizado correctamente`);
    return true;
  } catch (error) {
    console.error('Error al actualizar el estado del reporte:', error);
    toast.error('Error al actualizar el estado del reporte');
    return false;
  }
}; 