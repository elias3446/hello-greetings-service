import { deleteCategory } from '@/controller/CRUD/category/categoryController';
import { registrarCambioEstadoReporte } from '@/controller/CRUD/report/historialEstadosReporte';
import { Reporte, Usuario } from '@/types/tipos';
import { reportes } from '@/data/reportes';

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

    // Actualizar el historial de estados y la categoría para cada reporte asociado
    reportesAsociados.forEach(reporte => {
      // Actualizar la categoría del reporte a "Sin categoria"
      const index = reportes.findIndex(r => r.id === reporte.id);
      if (index !== -1) {
        reportes[index] = {
          ...reportes[index],
          categoria: {
            id: 'sin-categoria',
            nombre: 'Sin categoria',
            descripcion: 'Reporte sin categoría asignada',
            color: '#808080',
            icono: 'folder-question',
            fechaCreacion: new Date(),
            activo: true
          }
        };
      }

      // Registrar el cambio en el historial
      registrarCambioEstadoReporte(
        reportes[index],
        reporte.categoria?.nombre || 'sin categoria',
        'sin categoria',
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