import { EstadoReporte, Usuario } from '@/types/tipos';
import { getEstadoById, updateEstado } from '../../CRUD/estado/estadoController';
import { createHistorialEstado } from '../../CRUD/estado/historialEstadoController';
import { filterReports, updateReport } from '../../CRUD/report/reportController';
import { registrarCambioEstadoReporte } from '../../CRUD/report/historialEstadosReporte';
import { toast } from '@/components/ui/sonner';

/**
 * Actualiza un estado, registra el cambio en su historial y actualiza los reportes afectados
 * 
 * @param id - ID del estado a actualizar
 * @param estadoData - Datos a actualizar del estado
 * @param usuario - Usuario que realiza la actualización
 * @param motivoCambio - Motivo opcional del cambio
 * @returns Promise con el estado actualizado o null si hubo un error
 */
export const actualizarEstadoConHistorial = async (
  id: string,
  estadoData: Partial<EstadoReporte>,
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

    // 2. Determinar si hay cambios en propiedades críticas
    const cambioActivo = 'activo' in estadoData && estadoData.activo !== estadoActual.activo;
    const cambioNombre = 'nombre' in estadoData && estadoData.nombre !== estadoActual.nombre;
    const cambioIcono = 'icono' in estadoData && estadoData.icono !== estadoActual.icono;
    const cambioColor = 'color' in estadoData && estadoData.color !== estadoActual.color;
    
    const hayCambiosSignificativos = cambioActivo || cambioNombre || cambioIcono || cambioColor;

    // 3. Actualizar el estado
    const estadoActualizado = updateEstado(id, {
      ...estadoData,
      fechaActualizacion: new Date()
    });

    if (!estadoActualizado) {
      throw new Error('Error al actualizar el estado');
    }

    // 4. Registrar cambios en el historial si son significativos
    if (hayCambiosSignificativos) {
      await registrarCambiosEnHistorial(estadoActual, estadoActualizado, usuario, motivoCambio);
    }

    // 5. Si cambió el estado activo, actualizar los reportes afectados
    if (cambioActivo) {
      await actualizarReportesAfectados(estadoActual, estadoActualizado, usuario, motivoCambio);
    }

    toast.success(`Estado "${estadoActualizado.nombre}" actualizado correctamente`);
    return estadoActualizado;
  } catch (error) {
    console.error('Error en actualizarEstadoConHistorial:', error);
    toast.error('Error al actualizar el estado');
    return null;
  }
};

/**
 * Cambia un estado de activo a inactivo o viceversa
 * 
 * @param id - ID del estado a cambiar
 * @param nuevoValorActivo - Nuevo valor para la propiedad activo
 * @param usuario - Usuario que realiza el cambio
 * @param motivoCambio - Motivo opcional del cambio
 * @returns Promise con el estado actualizado o null si hubo un error
 */
export const cambiarEstadoActivo = async (
  id: string,
  nuevoValorActivo: boolean,
  usuario: Usuario,
  motivoCambio?: string
): Promise<EstadoReporte | null> => {
  try {
    const estadoActual = getEstadoById(id);
    if (!estadoActual) {
      toast.error('Estado no encontrado');
      return null;
    }
    
    // Si el estado ya tiene el valor solicitado, no hay nada que hacer
    if (estadoActual.activo === nuevoValorActivo) {
      toast.info(`El estado "${estadoActual.nombre}" ya está ${nuevoValorActivo ? 'activo' : 'inactivo'}`);
      return estadoActual;
    }

    // Si vamos a desactivar un estado, verificar si hay reportes afectados y si hay estados alternativos
    if (!nuevoValorActivo) {
      const reportesAfectados = await filterReports({ estadoId: id });
      
      if (reportesAfectados.length > 0) {
        // Obtener estados alternativos activos
        const estadosReporte = require('@/data/estadosReporte').estadosReporte;
        const estadosActivos = estadosReporte.filter((e: EstadoReporte) => 
          e.id !== id && e.activo === true
        );
        
        if (estadosActivos.length === 0) {
          toast.error('No se puede desactivar el estado porque hay reportes asociados y no hay estados alternativos activos');
          return null;
        }
        
        toast.warning(`Al desactivar este estado, ${reportesAfectados.length} reportes se verán afectados`);
      }
    }
    
    return await actualizarEstadoConHistorial(
      id,
      { activo: nuevoValorActivo },
      usuario,
      motivoCambio || `Cambio de estado a ${nuevoValorActivo ? 'activo' : 'inactivo'}`
    );
  } catch (error) {
    console.error('Error en cambiarEstadoActivo:', error);
    toast.error('Error al cambiar el estado activo');
    return null;
  }
};

/**
 * Registra los cambios en el historial del estado
 * 
 * @param estadoAnterior - Estado anterior a la actualización
 * @param estadoActualizado - Estado después de la actualización
 * @param usuario - Usuario que realizó la actualización
 * @param motivoCambio - Motivo opcional del cambio
 */
const registrarCambiosEnHistorial = async (
  estadoAnterior: EstadoReporte,
  estadoActualizado: EstadoReporte,
  usuario: Usuario,
  motivoCambio?: string
): Promise<void> => {
  try {
    // Detectar qué cambios ocurrieron para crear una descripción detallada
    const cambios: string[] = [];
    
    if (estadoAnterior.activo !== estadoActualizado.activo) {
      cambios.push(`cambio de estado de "${estadoAnterior.activo ? 'activo' : 'inactivo'}" a "${estadoActualizado.activo ? 'activo' : 'inactivo'}"`);
    }
    
    if (estadoAnterior.nombre !== estadoActualizado.nombre) {
      cambios.push(`cambio de nombre de "${estadoAnterior.nombre}" a "${estadoActualizado.nombre}"`);
    }
    
    if (estadoAnterior.icono !== estadoActualizado.icono) {
      cambios.push(`cambio de icono de "${estadoAnterior.icono}" a "${estadoActualizado.icono}"`);
    }
    
    if (estadoAnterior.color !== estadoActualizado.color) {
      cambios.push(`cambio de color de "${estadoAnterior.color}" a "${estadoActualizado.color}"`);
    }
    
    // Crear descripción de cambios
    const descripcionCambios = cambios.join(', ');
    
    // Registrar en historial
    await createHistorialEstado(
      estadoActualizado.id,
      estadoAnterior.activo ? 'activo' : 'inactivo',
      estadoActualizado.activo ? 'activo' : 'inactivo',
      usuario.id,
      'actualizacion',
      motivoCambio ? `${motivoCambio} (${descripcionCambios})` : descripcionCambios
    );
  } catch (error) {
    console.error('Error al registrar cambios en historial:', error);
  }
};

/**
 * Actualiza los reportes afectados por un cambio en el estado
 * 
 * @param estadoAnterior - Estado anterior a la actualización
 * @param estadoActualizado - Estado después de la actualización
 * @param usuario - Usuario que realizó la actualización
 * @param motivoCambio - Motivo opcional del cambio
 * @returns Número de reportes actualizados
 */
const actualizarReportesAfectados = async (
  estadoAnterior: EstadoReporte,
  estadoActualizado: EstadoReporte,
  usuario: Usuario,
  motivoCambio?: string
): Promise<number> => {
  try {
    // 1. Obtener reportes asociados a este estado
    const reportesConEstado = await filterReports({ estadoId: estadoActualizado.id });
    
    if (reportesConEstado.length === 0) {
      return 0; // No hay reportes afectados
    }
    
    let reportesActualizados = 0;
    
    // 2. Si el estado se desactivó, necesitamos gestionar los reportes
    if (estadoAnterior.activo && !estadoActualizado.activo) {
      // Buscar un estado alternativo activo
      const todosLosEstados = require('@/data/estadosReporte').estadosReporte;
      const estadoAlternativo = todosLosEstados.find((e: EstadoReporte) => 
        e.id !== estadoActualizado.id && e.activo === true
      );
      
      for (const reporte of reportesConEstado) {
        try {
          // Si hay un estado alternativo, reasignar; si no, marcar como inactivo
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
            
            // Actualizar el reporte
            const reporteActualizado = updateReport(reporte.id, {
              estado: estadoAlternativo
            });
            
            if (reporteActualizado) {
              reportesActualizados++;
            }
          } else {
            // Si no hay alternativa, sólo registrar que el estado se desactivó
            await registrarCambioEstadoReporte(
              reporte,
              reporte.activo ? 'activo' : 'inactivo',
              'inactivo',
              usuario,
              `El reporte quedó inactivo porque su estado "${estadoActualizado.nombre}" fue desactivado. ${motivoCambio || ''}`,
              'cambio_estado'
            );
            
            // Marcar el reporte como inactivo
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
    // 3. Si el estado se activó, podemos reactivar los reportes asociados
    else if (!estadoAnterior.activo && estadoActualizado.activo) {
      for (const reporte of reportesConEstado) {
        if (!reporte.activo) {
          try {
            // Registrar en historial del reporte
            await registrarCambioEstadoReporte(
              reporte,
              'inactivo',
              'activo',
              usuario,
              `Reporte reactivado porque su estado "${estadoActualizado.nombre}" se activó. ${motivoCambio || ''}`,
              'cambio_estado'
            );
            
            // Reactivar el reporte
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