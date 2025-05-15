import { Reporte, Usuario } from '@/types/tipos';
import { updateReport } from '@/controller/CRUD/report/reportController';
import { registrarCambioEstado } from '@/controller/CRUD/user/historialEstadosUsuario';
import { registrarCambioEstadoReporte } from '@/controller/CRUD/report/historialEstadosReporte';
import { toast } from '@/components/ui/sonner';

/**
 * Actualiza el estado activo de un reporte y sus registros relacionados
 * @param reporte - Reporte a actualizar
 * @param nuevoEstado - Nuevo estado activo del reporte
 * @param realizadoPor - Usuario que realiza la actualización
 * @returns Promise<boolean> - true si la actualización fue exitosa
 */
export const actualizarEstadoActivoReporte = async (
  reporte: Reporte,
  nuevoEstado: boolean,
  realizadoPor: Usuario
): Promise<boolean> => {
  try {
    console.log('Iniciando actualización de estado activo:', {
      reporteId: reporte.id,
      estadoAnterior: reporte.activo,
      nuevoEstado
    });

    // 1. Registrar el cambio en el historial de estados del reporte
    await registrarCambioEstadoReporte(
      reporte,
      reporte.activo ? 'Activo' : 'Inactivo',
      nuevoEstado ? 'Activo' : 'Inactivo',
      realizadoPor,
      'Cambio de estado activo del reporte',
      'cambio_estado'
    );

    console.log('Historial de reporte actualizado');

    // 2. Registrar el cambio en el historial de estados del usuario asignado
    if (reporte.asignadoA) {
      await registrarCambioEstado(
        reporte.asignadoA,
        reporte.asignadoA.estado,
        reporte.asignadoA.estado,
        realizadoPor,
        `Reporte ${reporte.id} ${nuevoEstado ? 'activado' : 'desactivado'}`,
        'otro'
      );
      console.log('Historial de usuario actualizado');
    }

    // 3. Actualizar el reporte
    const reporteActualizado = updateReport(reporte.id, { activo: nuevoEstado });
    if (!reporteActualizado) {
      throw new Error('Error al actualizar el reporte');
    }

    console.log('Reporte actualizado correctamente');
    toast.success(`Reporte ${nuevoEstado ? 'activado' : 'desactivado'} correctamente`);
    return true;
  } catch (error) {
    console.error('Error al actualizar el estado activo del reporte:', error);
    toast.error('Error al actualizar el estado activo del reporte');
    return false;
  }
}; 