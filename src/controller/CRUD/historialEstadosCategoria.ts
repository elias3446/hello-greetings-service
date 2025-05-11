import { HistorialEstadoCategoria, Categoria, Usuario } from '@/types/tipos';
import { historialEstadosCategoria } from '@/data/actividades';
import { toast } from '@/components/ui/sonner';

/**
 * Obtiene el historial de estados de una categoría específica
 * @param categoriaId - ID de la categoría
 * @returns Array de registros del historial de estados
 */
export const getHistorialEstadosCategoria = (categoriaId: string): HistorialEstadoCategoria[] => {
  return historialEstadosCategoria.filter(historial => historial.idCategoria.id === categoriaId);
};

/**
 * Obtiene todos los registros del historial de estados de categorías
 * @returns Array de todos los registros del historial
 */
export const getAllHistorialEstadosCategoria = (): HistorialEstadoCategoria[] => {
  return historialEstadosCategoria;
};

/**
 * Registra un nuevo cambio de estado en el historial de una categoría
 * @param categoria - Categoría a la que se le registra el cambio
 * @param estadoAnterior - Estado anterior de la categoría
 * @param estadoNuevo - Nuevo estado de la categoría
 * @param realizadoPor - Usuario que realiza el cambio
 * @param motivoCambio - Motivo del cambio (opcional)
 * @param tipoAccion - Tipo de acción realizada
 * @returns Promise<boolean> - true si el registro fue exitoso
 */
export const registrarCambioEstadoCategoria = async (
  categoria: Categoria,
  estadoAnterior: string,
  estadoNuevo: string,
  realizadoPor: Usuario,
  motivoCambio?: string,
  tipoAccion: 'creacion' | 'actualizacion' | 'cambio_estado' | 'otro' = 'cambio_estado'
): Promise<boolean> => {
  try {
    const nuevoRegistro: HistorialEstadoCategoria = {
      id: (historialEstadosCategoria.length + 1).toString(),
      idCategoria: categoria,
      estadoAnterior,
      estadoNuevo,
      fechaHoraCambio: new Date(),
      realizadoPor,
      motivoCambio,
      tipoAccion
    };

    historialEstadosCategoria.push(nuevoRegistro);
    console.log('Registro de cambio de estado de categoría creado:', nuevoRegistro);
    return true;
  } catch (error) {
    console.error('Error al registrar cambio de estado de categoría:', error);
    toast.error('Error al registrar el cambio de estado');
    return false;
  }
};

/**
 * Elimina un registro del historial de estados de categorías
 * @param historialId - ID del registro a eliminar
 * @returns Promise<boolean> - true si la eliminación fue exitosa
 */
export const eliminarRegistroHistorialCategoria = async (historialId: string): Promise<boolean> => {
  try {
    const index = historialEstadosCategoria.findIndex(h => h.id === historialId);
    if (index === -1) {
      throw new Error('Registro no encontrado');
    }

    historialEstadosCategoria.splice(index, 1);
    console.log('Registro de historial de categoría eliminado:', historialId);
    return true;
  } catch (error) {
    console.error('Error al eliminar registro de historial de categoría:', error);
    toast.error('Error al eliminar el registro');
    return false;
  }
};

/**
 * Actualiza un registro del historial de estados de categorías
 * @param historialId - ID del registro a actualizar
 * @param datosActualizados - Datos actualizados del registro
 * @returns Promise<boolean> - true si la actualización fue exitosa
 */
export const actualizarRegistroHistorialCategoria = async (
  historialId: string,
  datosActualizados: Partial<HistorialEstadoCategoria>
): Promise<boolean> => {
  try {
    const index = historialEstadosCategoria.findIndex(h => h.id === historialId);
    if (index === -1) {
      throw new Error('Registro no encontrado');
    }

    historialEstadosCategoria[index] = {
      ...historialEstadosCategoria[index],
      ...datosActualizados
    };

    console.log('Registro de historial de categoría actualizado:', historialEstadosCategoria[index]);
    return true;
  } catch (error) {
    console.error('Error al actualizar registro de historial de categoría:', error);
    toast.error('Error al actualizar el registro');
    return false;
  }
}; 