import { Categoria, Usuario } from '@/types/tipos';
import { updateCategory } from '../../CRUD/category/categoryController';
import { registrarCambioEstadoCategoria } from '../../CRUD/category/historialEstadosCategoria';
import { registrarCambioEstadoReporte } from '../../CRUD/report/historialEstadosReporte';
import { filtrarReportes } from '../../CRUD/report/reportController';
import { toast } from '@/components/ui/sonner';
import { actualizarReporte } from '../../CRUD/report/reportController';

/**
 * Actualiza el estado de una categoría y registra los cambios en los historiales correspondientes
 * @param categoria - Categoría a actualizar
 * @param nuevoEstado - Nuevo estado de la categoría
 * @param usuario - Usuario que realiza el cambio
 * @param motivoCambio - Motivo del cambio (opcional)
 * @returns Promise<boolean> - true si todas las actualizaciones fueron exitosas
 */
export const actualizarEstadoCategoria = async (
  categoria: Categoria,
  nuevoEstado: boolean,
  usuario: Usuario,
  motivoCambio?: string
): Promise<boolean> => {
  try {
    // 1. Actualizar el estado de la categoría
    const categoriaActualizada = {
      ...categoria,
      activo: nuevoEstado
    };

    const categoriaActualizadaResult = await updateCategory(categoria.id, categoriaActualizada);
    if (!categoriaActualizadaResult) {
      throw new Error('Error al actualizar el estado de la categoría');
    }

    // 2. Registrar el cambio en el historial de estados de categoría
    const historialCategoriaResult = await registrarCambioEstadoCategoria(
      categoria,
      categoria.activo ? 'activo' : 'inactivo',
      nuevoEstado ? 'activo' : 'inactivo',
      usuario,
      motivoCambio,
      'cambio_estado'
    );

    if (!historialCategoriaResult) {
      throw new Error('Error al registrar el cambio en el historial de categoría');
    }

    // 3. Obtener todos los reportes asociados a la categoría
    const reportesCategoria = await filtrarReportes({ categoryId: categoria.id });

    // 4. Actualizar el historial de estados de los reportes asociados
    const actualizacionesReportes = await Promise.all(
      reportesCategoria.map(async (reporte) => {
        try {
          if (reporte.activo !== nuevoEstado) {
            await registrarCambioEstadoReporte(
              reporte,
              reporte.activo ? 'activo' : 'inactivo',
              nuevoEstado ? 'activo' : 'inactivo',
              usuario,
              `Cambio de estado por actualización de categoría: ${motivoCambio || 'Sin motivo especificado'}`,
              'cambio_estado'
            );
          }

          // Si la categoría se está desactivando, remover la categoría de los reportes
          if (!nuevoEstado) {
            const reporteActualizado = actualizarReporte(reporte.id, { categoria: undefined });
            if (!reporteActualizado) {
              console.error(`Error al remover la categoría del reporte ${reporte.id}`);
              return false;
            }
          }
          return true;
        } catch (error) {
          console.error(`Error al procesar el reporte ${reporte.id}:`, error);
          return false;
        }
      })
    );

    // Verificar si todas las actualizaciones de reportes fueron exitosas
    const reportesFallidos = actualizacionesReportes.reduce((acc, result, index) => {
      if (!result) {
        acc.push(reportesCategoria[index].id);
      }
      return acc;
    }, [] as string[]);

    if (reportesFallidos.length > 0) {
      console.error('Reportes que fallaron al actualizar:', reportesFallidos);
      toast.error(`Error al actualizar ${reportesFallidos.length} reportes asociados`);
      return false;
    }

    toast.success('Estado de categoría actualizado correctamente');
    return true;
  } catch (error) {
    console.error('Error en actualizarEstadoCategoria:', error);
    toast.error('Error al actualizar el estado de la categoría');
    return false;
  }
}; 