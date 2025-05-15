import { EstadoReporte, Usuario } from '@/types/tipos';
import { getEstadoById, updateEstado } from '../../CRUD/estado/estadoController';
import { createHistorialEstado } from '../../CRUD/estado/historialEstadoController';
import { filterReports, updateReport } from '../../CRUD/report/reportController';
import { registrarCambioEstadoReporte } from '../../CRUD/report/historialEstadosReporte';
import { toast } from '@/components/ui/sonner';

/**
 * Cambia el estado activo/inactivo de un estado y actualiza reportes afectados
 * 
 * @param id - ID del estado a cambiar
 * @param nuevoValorActivo - Nuevo valor para la propiedad activo (true/false)
 * @param usuario - Usuario que realiza el cambio
 * @param motivoCambio - Motivo opcional del cambio
 * @returns Promise con el estado actualizado o null si hubo un error
 */
export const cambiarActivoEstado = async (
  id: string,
  nuevoValorActivo: boolean,
  usuario: Usuario,
  motivoCambio?: string
): Promise<EstadoReporte | null> => {
  try {
    // 1. Obtener el estado actual
    const estadoActual = getEstadoById(id);
    if (!estadoActual) {
      toast.error('Estado no encontrado');
      return null;
    }
    
    // 2. Verificar si el cambio es necesario
    if (estadoActual.activo === nuevoValorActivo) {
      toast.info(`El estado "${estadoActual.nombre}" ya está ${nuevoValorActivo ? 'activo' : 'inactivo'}`);
      return estadoActual;
    }

    // 3. Si vamos a desactivar el estado, verificar reportes afectados
    if (!nuevoValorActivo) {
      const reportesAfectados = await filterReports({ estadoId: id });
      
      if (reportesAfectados.length > 0) {
        // Buscar estados alternativos activos
        const estadosReporte = require('@/data/estadosReporte').estadosReporte;
        const estadosActivos = estadosReporte.filter((e: EstadoReporte) => 
          e.id !== id && e.activo === true
        );
        
        // Verificar si hay estados alternativos disponibles
        if (estadosActivos.length === 0) {
          toast.error('No se puede desactivar el estado porque hay reportes asociados y no hay estados alternativos activos');
          return null;
        }
        
        toast.warning(`Al desactivar este estado, ${reportesAfectados.length} reportes serán actualizados`);
      }
    }
    
    // 4. Actualizar el estado
    const estadoActualizado = updateEstado(id, { 
      activo: nuevoValorActivo,
      fechaActualizacion: new Date()
    });
    
    if (!estadoActualizado) {
      throw new Error('Error al actualizar el estado');
    }
    
    // 5. Registrar el cambio en el historial de estados
    await registrarCambioEnHistorial(estadoActual, estadoActualizado, usuario, motivoCambio);
    
    // 6. Actualizar reportes afectados
    await actualizarReportesAfectados(estadoActual, estadoActualizado, usuario, motivoCambio);
    
    // 7. Notificar éxito
    toast.success(`Estado "${estadoActualizado.nombre}" ${nuevoValorActivo ? 'activado' : 'desactivado'} correctamente`);
    return estadoActualizado;
  } catch (error) {
    console.error('Error en cambiarActivoEstado:', error);
    toast.error('Error al cambiar el estado activo');
    return null;
  }
};

/**
 * Registra el cambio de estado activo en el historial
 */
const registrarCambioEnHistorial = async (
  estadoAnterior: EstadoReporte,
  estadoActualizado: EstadoReporte,
  usuario: Usuario,
  motivoCambio?: string
): Promise<void> => {
  try {
    const cambioDescripcion = `Cambio de estado de ${estadoAnterior.activo ? 'activo' : 'inactivo'} a ${estadoActualizado.activo ? 'activo' : 'inactivo'}`;
    
    await createHistorialEstado(
      estadoActualizado.id,
      estadoAnterior.activo ? 'activo' : 'inactivo',
      estadoActualizado.activo ? 'activo' : 'inactivo',
      usuario.id,
      'cambio_estado',
      motivoCambio ? `${motivoCambio} (${cambioDescripcion})` : cambioDescripcion
    );
  } catch (error) {
    console.error('Error al registrar cambio en historial:', error);
  }
};

/**
 * Actualiza los reportes afectados cuando cambia el estado activo
 */
const actualizarReportesAfectados = async (
  estadoAnterior: EstadoReporte,
  estadoActualizado: EstadoReporte,
  usuario: Usuario,
  motivoCambio?: string
): Promise<number> => {
  try {
    // 1. Obtener reportes con este estado
    const reportesConEstado = await filterReports({ estadoId: estadoActualizado.id });
    
    if (reportesConEstado.length === 0) {
      return 0; // No hay reportes afectados
    }
    
    let reportesActualizados = 0;
    
    // 2. Si el estado se desactivó, buscar alternativa o desactivar reportes
    if (estadoAnterior.activo && !estadoActualizado.activo) {
      // Buscar un estado alternativo activo
      const todosLosEstados = require('@/data/estadosReporte').estadosReporte;
      const estadoAlternativo = todosLosEstados.find((e: EstadoReporte) => 
        e.id !== estadoActualizado.id && e.activo === true
      );
      
      for (const reporte of reportesConEstado) {
        try {
          if (estadoAlternativo) {
            // Registrar en historial del reporte
            await registrarCambioEstadoReporte(
              reporte,
              `Estado: ${estadoActualizado.nombre}`,
              `Estado: ${estadoAlternativo.nombre}`,
              usuario,
              `Cambio automático por desactivación del estado "${estadoActualizado.nombre}". ${motivoCambio || ''}`,
              'cambio_estado'
            );
            
            // Asignar al estado alternativo
            const reporteActualizado = updateReport(reporte.id, {
              estado: estadoAlternativo
            });
            
            if (reporteActualizado) {
              reportesActualizados++;
            }
          } else {
            // Si no hay alternativa, desactivar el reporte
            await registrarCambioEstadoReporte(
              reporte,
              reporte.activo ? 'activo' : 'inactivo',
              'inactivo',
              usuario,
              `Reporte desactivado porque su estado "${estadoActualizado.nombre}" fue desactivado. ${motivoCambio || ''}`,
              'cambio_estado'
            );
            
            const reporteActualizado = updateReport(reporte.id, {
              activo: false
            });
            
            if (reporteActualizado) {
              reportesActualizados++;
            }
          }
        } catch (error) {
          console.error(`Error al procesar el reporte ${reporte.id}:`, error);
        }
      }
    } 
    // 3. Si el estado se activó, reactivar reportes inactivos
    else if (!estadoAnterior.activo && estadoActualizado.activo) {
      for (const reporte of reportesConEstado) {
        if (!reporte.activo) {
          try {
            await registrarCambioEstadoReporte(
              reporte,
              'inactivo',
              'activo',
              usuario,
              `Reporte reactivado porque su estado "${estadoActualizado.nombre}" se activó. ${motivoCambio || ''}`,
              'cambio_estado'
            );
            
            const reporteActualizado = updateReport(reporte.id, {
              activo: true
            });
            
            if (reporteActualizado) {
              reportesActualizados++;
            }
          } catch (error) {
            console.error(`Error al reactivar el reporte ${reporte.id}:`, error);
          }
        }
      }
    }
    
    // 4. Notificar resultado
    if (reportesActualizados > 0) {
      toast.success(`Se actualizaron ${reportesActualizados} reportes asociados al estado "${estadoActualizado.nombre}"`);
    }
    
    return reportesActualizados;
  } catch (error) {
    console.error('Error al actualizar reportes afectados:', error);
    return 0;
  }
}; 