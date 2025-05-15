import { EstadoReporte, Usuario } from '@/types/tipos';
import { getEstadoById, updateEstado, deleteEstado } from '../../CRUD/estado/estadoController';
import { createHistorialEstado } from '../../CRUD/estado/historialEstadoController';
import { filtrarReportes, actualizarReporte } from '../../CRUD/report/reportController';
import { registrarCambioEstadoReporte } from '../../CRUD/report/historialEstadosReporte';
import { toast } from '@/components/ui/sonner';

/**
 * Elimina un estado y actualiza el historial de los reportes afectados
 * 
 * @param id - ID del estado a eliminar
 * @param estadoAlternativoId - ID del estado que reemplazará al eliminado en los reportes
 * @param usuario - Usuario que realiza la eliminación
 * @param motivoCambio - Motivo opcional de la eliminación
 * @returns Promise<boolean> indicando si la operación fue exitosa
 */
export const eliminarEstadoConHistorial = async (
  id: string,
  estadoAlternativoId: string,
  usuario: Usuario,
  motivoCambio?: string
): Promise<boolean> => {
  try {
    // 1. Verificar existencia de los estados
    const estadoAEliminar = getEstadoById(id);
    const estadoAlternativo = getEstadoById(estadoAlternativoId);
    
    if (!estadoAEliminar) {
      toast.error('El estado a eliminar no existe');
      return false;
    }
    
    if (!estadoAlternativo) {
      toast.error('El estado alternativo no existe');
      return false;
    }
    
    if (!estadoAlternativo.activo) {
      toast.error('El estado alternativo debe estar activo');
      return false;
    }

    // 2. Identificar reportes afectados
    const reportesAfectados = await filtrarReportes({ estadoId: id });
    
    // 3. Registrar en historial del estado a eliminar
    await createHistorialEstado(
      id,
      estadoAEliminar.activo ? 'activo' : 'inactivo',
      'eliminado',
      usuario.id,
      'otro',
      `Estado eliminado. ${motivoCambio || ''}`
    );
    
    // 4. Actualizar los reportes afectados y sus historiales
    let reportesActualizados = 0;
    
    for (const reporte of reportesAfectados) {
      try {
        // Registrar en el historial del reporte
        await registrarCambioEstadoReporte(
          reporte,
          `Estado: ${estadoAEliminar.nombre}`,
          `Estado: ${estadoAlternativo.nombre}`,
          usuario,
          `Cambio de estado por eliminación del estado "${estadoAEliminar.nombre}". ${motivoCambio || ''}`,
          'cambio_estado'
        );
        
        // Actualizar el reporte con el estado alternativo
        const reporteActualizado = actualizarReporte(reporte.id, {
          estado: estadoAlternativo
        });
        
        if (reporteActualizado) {
          reportesActualizados++;
        }
      } catch (error) {
        console.error(`Error al actualizar el reporte ${reporte.id}:`, error);
      }
    }
    
    // 5. Eliminar el estado
    const eliminado = deleteEstado(id);
    
    if (!eliminado) {
      throw new Error('No se pudo eliminar el estado');
    }
    
    // 6. Notificar resultados
    if (reportesAfectados.length > 0) {
      toast.success(`Se actualizaron ${reportesActualizados} de ${reportesAfectados.length} reportes al estado "${estadoAlternativo.nombre}"`);
    }
    
    toast.success(`Estado "${estadoAEliminar.nombre}" eliminado correctamente`);
    return true;
  } catch (error) {
    console.error('Error en eliminarEstadoConHistorial:', error);
    toast.error('Error al eliminar el estado');
    return false;
  }
};

/**
 * Marca un estado como inactivo en lugar de eliminarlo físicamente
 * Esta es una alternativa más segura a la eliminación completa
 * 
 * @param id - ID del estado a desactivar
 * @param estadoAlternativoId - ID del estado alternativo para los reportes
 * @param usuario - Usuario que realiza la acción
 * @param motivoCambio - Motivo opcional de la desactivación
 * @returns Promise<boolean> indicando si la operación fue exitosa
 */
export const desactivarEstado = async (
  id: string,
  estadoAlternativoId: string,
  usuario: Usuario,
  motivoCambio?: string
): Promise<boolean> => {
  try {
    // 1. Verificar existencia de los estados
    const estadoADesactivar = getEstadoById(id);
    const estadoAlternativo = getEstadoById(estadoAlternativoId);
    
    if (!estadoADesactivar) {
      toast.error('El estado a desactivar no existe');
      return false;
    }
    
    if (!estadoAlternativo) {
      toast.error('El estado alternativo no existe');
      return false;
    }
    
    if (!estadoAlternativo.activo) {
      toast.error('El estado alternativo debe estar activo');
      return false;
    }
    
    if (id === estadoAlternativoId) {
      toast.error('El estado alternativo no puede ser el mismo que se va a desactivar');
      return false;
    }

    // 2. Identificar reportes afectados
    const reportesAfectados = await filtrarReportes({ estadoId: id });
    
    // 3. Registrar en historial del estado a desactivar
    await createHistorialEstado(
      id,
      estadoADesactivar.activo ? 'activo' : 'inactivo',
      'inactivo',
      usuario.id,
      'cambio_estado',
      `Estado desactivado. ${motivoCambio || ''}`
    );
    
    // 4. Actualizar el estado a inactivo
    const estadoActualizado = updateEstado(id, { 
      activo: false,
      fechaActualizacion: new Date()
    });
    
    if (!estadoActualizado) {
      throw new Error('No se pudo desactivar el estado');
    }
    
    // 5. Actualizar los reportes afectados y sus historiales
    let reportesActualizados = 0;
    
    for (const reporte of reportesAfectados) {
      try {
        // Registrar en el historial del reporte
        await registrarCambioEstadoReporte(
          reporte,
          `Estado: ${estadoADesactivar.nombre}`,
          `Estado: ${estadoAlternativo.nombre}`,
          usuario,
          `Cambio de estado por desactivación del estado "${estadoADesactivar.nombre}". ${motivoCambio || ''}`,
          'cambio_estado'
        );
        
        // Actualizar el reporte con el estado alternativo
        const reporteActualizado = actualizarReporte(reporte.id, {
          estado: estadoAlternativo
        });
        
        if (reporteActualizado) {
          reportesActualizados++;
        }
      } catch (error) {
        console.error(`Error al actualizar el reporte ${reporte.id}:`, error);
      }
    }
    
    // 6. Notificar resultados
    if (reportesAfectados.length > 0) {
      toast.success(`Se actualizaron ${reportesActualizados} de ${reportesAfectados.length} reportes al estado "${estadoAlternativo.nombre}"`);
    }
    
    toast.success(`Estado "${estadoADesactivar.nombre}" desactivado correctamente`);
    return true;
  } catch (error) {
    console.error('Error en desactivarEstado:', error);
    toast.error('Error al desactivar el estado');
    return false;
  }
}; 