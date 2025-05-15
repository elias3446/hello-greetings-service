import { Reporte, Usuario, EstadoReporte } from '@/types/tipos';
import { actualizarReporte } from '@/controller/CRUD/report/reportController';
import { registrarCambioEstadoReporte } from '@/controller/CRUD/report/historialEstadosReporte';
import { toast } from '@/components/ui/sonner';

/**
 * Actualiza el estado de un reporte y registra el cambio en el historial
 * @param reporte - Reporte a actualizar
 * @param nuevoEstado - Nuevo estado a asignar
 * @param realizadoPor - Usuario que realiza el cambio
 * @returns Promise<boolean> - true si se actualizó correctamente
 */
export const actualizarEstadoReporte = async (
  reporte: Reporte,
  nuevoEstado: EstadoReporte,
  realizadoPor: Usuario
): Promise<boolean> => {
  try {
    // Validar si hay cambio real
    if (reporte.estado.id === nuevoEstado.id) {
      toast.info('El estado del reporte ya es el seleccionado');
      return false;
    }

    console.log('Iniciando actualización de estado del reporte:', {
      reporteId: reporte.id,
      estadoAnterior: reporte.estado.nombre,
      nuevoEstado: nuevoEstado.nombre
    });

    // 1. Registrar en el historial
    await registrarCambioEstadoReporte(
      reporte,
      reporte.estado.nombre,
      nuevoEstado.nombre,
      realizadoPor,
      'Cambio de estado del reporte',
      'cambio_estado'
    );

    console.log('Historial del estado del reporte registrado');

    // 2. Actualizar el estado del reporte
    const actualizado = await actualizarReporte(reporte.id, { estado: nuevoEstado });
    if (!actualizado) {
      throw new Error('La actualización del reporte falló');
    }

    console.log('Estado del reporte actualizado exitosamente');
    toast.success('Estado del reporte actualizado correctamente');
    return true;

  } catch (error) {
    console.error('Error al actualizar el estado del reporte:', error);
    toast.error('Error al actualizar el estado del reporte');
    return false;
  }
};
