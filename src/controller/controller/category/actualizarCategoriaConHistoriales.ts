import { Categoria, Usuario } from '@/types/tipos';
import { updateCategory, getCategoryById } from '../../CRUD/category/categoryController';
import { registrarCambioEstadoCategoria } from '../../CRUD/category/historialEstadosCategoria';
import { registrarModificacionCategoria, registrarCambioEstadoCategoria as registrarCambioEstadoActividadCategoria } from '../../CRUD/category/historialActividadCategoriaController';
import { filterReports, updateReport } from '../../CRUD/report/reportController';
import { registrarCambioEstadoReporte } from '../../CRUD/report/historialEstadosReporte';
import { toast } from '@/components/ui/sonner';

/**
 * Actualiza una categoría y registra los cambios en los historiales correspondientes
 * 
 * @param id - ID de la categoría a actualizar
 * @param categoryData - Datos actualizados de la categoría
 * @param usuario - Usuario que realiza la actualización
 * @param comentario - Comentario opcional para el registro de actividad
 * @returns Promise con la categoría actualizada o null si ocurrió un error
 */
export const actualizarCategoriaConHistoriales = async (
  id: string,
  categoryData: Partial<Categoria>,
  usuario: Usuario,
  comentario?: string
): Promise<Categoria | null> => {
  try {
    // 1. Obtener la categoría actual antes de actualizarla
    const categoriaActual = getCategoryById(id);
    
    if (!categoriaActual) {
      throw new Error('Categoría no encontrada');
    }

    // 2. Verificar si hay cambio en el estado activo
    const cambioEstado = 'activo' in categoryData && categoryData.activo !== categoriaActual.activo;
    
    // 3. Actualizar la categoría
    const categoriaActualizada = updateCategory(id, categoryData);
    
    if (!categoriaActualizada) {
      throw new Error('Error al actualizar la categoría');
    }

    // 4. Procesar los cambios en los campos y registrar en historiales
    for (const [key, value] of Object.entries(categoryData)) {
      // Evitar registrar cambios en campos que no han cambiado
      if (categoriaActual[key as keyof Categoria] === value) {
        continue;
      }

      // Si el cambio es en el estado activo, registrar en el historial de estados
      if (key === 'activo' && typeof value === 'boolean') {
        await registrarCambioEstadoCategoria(
          categoriaActualizada,
          categoriaActual.activo ? 'activo' : 'inactivo',
          value ? 'activo' : 'inactivo',
          usuario,
          comentario,
          'cambio_estado'
        );

        // También registrar en el historial de actividades de categoría
        registrarCambioEstadoActividadCategoria(
          categoriaActualizada,
          usuario,
          categoriaActual.activo,
          value,
          comentario
        );
      } else {
        // Para otros campos, registrar en el historial de actividades
        const valorAnterior = categoriaActual[key as keyof Categoria]?.toString() || 'no definido';
        const valorNuevo = value?.toString() || 'no definido';
        
        registrarModificacionCategoria(
          categoriaActualizada,
          usuario,
          key,
          valorAnterior,
          valorNuevo,
          comentario
        );
      }
    }

    // 5. Si hubo cambio en el estado activo, actualizar los reportes asociados
    if (cambioEstado) {
      await actualizarReportesAsociados(
        categoriaActualizada, 
        categoryData.activo as boolean, 
        usuario, 
        comentario
      );
    }

    toast.success('Categoría actualizada correctamente');
    return categoriaActualizada;
  } catch (error) {
    console.error('Error en actualizarCategoriaConHistoriales:', error);
    toast.error('Error al actualizar la categoría');
    return null;
  }
};

/**
 * Actualiza los reportes asociados a una categoría cuando cambia su estado
 * 
 * @param categoria - Categoría actualizada
 * @param nuevoEstado - Nuevo estado de la categoría
 * @param usuario - Usuario que realiza el cambio
 * @param comentario - Comentario opcional sobre el cambio
 * @returns Promise<boolean> - true si todas las actualizaciones fueron exitosas
 */
const actualizarReportesAsociados = async (
  categoria: Categoria,
  nuevoEstado: boolean,
  usuario: Usuario,
  comentario?: string
): Promise<boolean> => {
  try {
    // 1. Obtener todos los reportes asociados a la categoría
    const reportesCategoria = await filterReports({ categoryId: categoria.id });
    
    if (reportesCategoria.length === 0) {
      return true; // No hay reportes que actualizar
    }

    // 2. Actualizar el historial de estados de los reportes asociados
    const actualizacionesReportes = await Promise.all(
      reportesCategoria.map(async (reporte) => {
        try {
          // Si el estado del reporte es diferente al nuevo estado de la categoría
          if (reporte.activo !== nuevoEstado) {
            // Registrar el cambio en el historial de estados del reporte
            await registrarCambioEstadoReporte(
              reporte,
              reporte.activo ? 'activo' : 'inactivo',
              nuevoEstado ? 'activo' : 'inactivo',
              usuario,
              `Cambio de estado por actualización de categoría "${categoria.nombre}". ${comentario || 'Sin comentarios adicionales'}`,
              'cambio_estado'
            );
            
            // Actualizar el estado del reporte
            const reporteActualizado = updateReport(reporte.id, { 
              activo: nuevoEstado 
            });
            
            if (!reporteActualizado) {
              throw new Error(`Error al actualizar el reporte ${reporte.id}`);
            }
          }
          
          // Si la categoría se desactiva, desasociar la categoría del reporte
          if (!nuevoEstado) {
            const reporteActualizado = updateReport(reporte.id, { 
              categoria: undefined 
            });
            
            if (!reporteActualizado) {
              throw new Error(`Error al desasociar la categoría del reporte ${reporte.id}`);
            }
          }
          
          return true;
        } catch (error) {
          console.error(`Error al procesar el reporte ${reporte.id}:`, error);
          return false;
        }
      })
    );

    // 3. Verificar si todas las actualizaciones fueron exitosas
    const reportesFallidos = actualizacionesReportes.filter(result => !result).length;
    
    if (reportesFallidos > 0) {
      toast.warning(`${reportesFallidos} reportes no pudieron ser actualizados completamente`);
      return false;
    }
    
    toast.success(`${reportesCategoria.length} reportes actualizados correctamente`);
    return true;
  } catch (error) {
    console.error('Error al actualizar reportes asociados:', error);
    toast.error('Error al actualizar los reportes asociados a la categoría');
    return false;
  }
}; 