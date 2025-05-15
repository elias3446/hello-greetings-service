import { Reporte, Usuario, Categoria } from '@/types/tipos';
import { updateReport } from '@/controller/CRUD/report/reportController';
import { registrarCambioEstadoReporte } from '@/controller/CRUD/report/historialEstadosReporte';
import { toast } from '@/components/ui/sonner';

/**
 * Actualiza la categoría de un reporte y su historial
 * @param reporte - Reporte a actualizar
 * @param nuevaCategoria - Nueva categoría del reporte
 * @param realizadoPor - Usuario que realiza la actualización
 * @returns Promise<boolean> - true si la actualización fue exitosa
 */
export const actualizarCategoriaReporte = async (
  reporte: Reporte,
  nuevaCategoria: Categoria | undefined,
  realizadoPor: Usuario
): Promise<boolean> => {
  try {
    console.log('Iniciando actualización de categoría:', {
      reporteId: reporte.id,
      categoriaAnterior: reporte.categoria,
      nuevaCategoria
    });

    // 1. Registrar el cambio en el historial de estados del reporte
    await registrarCambioEstadoReporte(
      reporte,
      reporte.categoria?.nombre || 'Sin categoría',
      nuevaCategoria?.nombre || 'Sin categoría',
      realizadoPor,
      'Cambio de categoría del reporte',
      'otro'
    );

    console.log('Historial de reporte actualizado');

    // 2. Actualizar el reporte
    const reporteActualizado = updateReport(reporte.id, { categoria: nuevaCategoria });
    if (!reporteActualizado) {
      throw new Error('Error al actualizar el reporte');
    }

    console.log('Reporte actualizado correctamente');
    toast.success(`Categoría del reporte actualizada correctamente`);
    return true;
  } catch (error) {
    console.error('Error al actualizar la categoría del reporte:', error);
    toast.error('Error al actualizar la categoría del reporte');
    return false;
  }
}; 