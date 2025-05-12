import { deleteCategory } from '../CRUD/categoryController';
import { registrarCambioEstadoReporte } from '../CRUD/historialEstadosReporte';
import { Reporte, Usuario } from '../../types/tipos';
import { reportes } from '../../data/reportes';

/**
 * Elimina una categoría y actualiza el historial de estados de los reportes asociados
 * @param categoryId - ID de la categoría a eliminar
 * @param usuario - Usuario que realiza la acción
 * @returns Objeto con el resultado de la operación
 */
export const deleteCategoryAndUpdateHistory = (
  categoryId: string,
  usuario: Usuario
): { success: boolean; message: string; affectedReports?: number } => {
  try {
    // Obtener los reportes asociados a la categoría antes de eliminarla
    const reportesAsociados = reportes.filter(reporte => reporte.categoria?.id === categoryId);
    
    // Eliminar la categoría
    const categoriaEliminada = deleteCategory(categoryId);
    
    if (!categoriaEliminada) {
      return {
        success: false,
        message: 'No se encontró la categoría especificada'
      };
    }

    // Actualizar el historial de estados para cada reporte asociado
    reportesAsociados.forEach(reporte => {
      registrarCambioEstadoReporte(
        reporte,
        reporte.estado.nombre,
        'sin_categoria', // Nuevo estado para reportes sin categoría
        usuario,
        'Categoría eliminada del sistema',
        'cambio_estado'
      );
    });

    return {
      success: true,
      message: 'Categoría eliminada exitosamente',
      affectedReports: reportesAsociados.length
    };
  } catch (error) {
    console.error('Error al eliminar categoría y actualizar historial:', error);
    return {
      success: false,
      message: 'Error al procesar la solicitud'
    };
  }
}; 