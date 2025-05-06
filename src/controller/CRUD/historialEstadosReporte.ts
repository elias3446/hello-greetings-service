import { HistorialEstadoReporte, Reporte, Usuario } from '@/types/tipos';
import { historialEstadosReporteEjemplo } from '@/data/actividades';

// Array para almacenar los registros del historial (simulación de base de datos)
let historialEstados: HistorialEstadoReporte[] = [...historialEstadosReporteEjemplo];

/**
 * Crea un nuevo registro en el historial de estados de reporte
 * @param registro - El registro a crear
 * @returns El registro creado con su ID
 */
export const crearRegistroHistorial = (registro: Omit<HistorialEstadoReporte, 'id'>): HistorialEstadoReporte => {
  const nuevoRegistro: HistorialEstadoReporte = {
    ...registro,
    id: Date.now().toString(), // Usamos timestamp como ID temporal
  };
  
  historialEstados.push(nuevoRegistro);
  return nuevoRegistro;
};

/**
 * Obtiene todos los registros del historial de un reporte específico
 * @param idReporte - ID del reporte
 * @returns Array de registros ordenados cronológicamente
 */
export const obtenerHistorialReporte = (idReporte: string | number): HistorialEstadoReporte[] => {
  console.log('Buscando historial para reporte:', idReporte);
  console.log('Tipo de idReporte:', typeof idReporte);
  console.log('Historial actual:', historialEstados);
  
  const historialFiltrado = historialEstados
    .filter(registro => {
      const idReporteRegistro = registro.idReporte.id;
      console.log('Comparando IDs:', {
        idReporte,
        idReporteRegistro,
        tipoIdReporte: typeof idReporte,
        tipoIdReporteRegistro: typeof idReporteRegistro,
        iguales: String(idReporte) === String(idReporteRegistro)
      });
      return String(idReporte) === String(idReporteRegistro);
    })
    .sort((a, b) => b.fechaHoraCambio.getTime() - a.fechaHoraCambio.getTime());
  
  console.log('Historial filtrado:', historialFiltrado);
  return historialFiltrado;
};

/**
 * Obtiene un registro específico del historial
 * @param id - ID del registro
 * @returns El registro encontrado o undefined
 */
export const obtenerRegistroHistorial = (id: string | number): HistorialEstadoReporte | undefined => {
  return historialEstados.find(registro => registro.id === id);
};

/**
 * Actualiza un registro existente en el historial
 * @param id - ID del registro a actualizar
 * @param datos - Nuevos datos del registro
 * @returns El registro actualizado o undefined si no se encontró
 */
export const actualizarRegistroHistorial = (
  id: string | number,
  datos: Partial<HistorialEstadoReporte>
): HistorialEstadoReporte | undefined => {
  const indice = historialEstados.findIndex(registro => registro.id === id);
  
  if (indice === -1) return undefined;
  
  historialEstados[indice] = {
    ...historialEstados[indice],
    ...datos,
  };
  
  return historialEstados[indice];
};

/**
 * Elimina un registro del historial
 * @param id - ID del registro a eliminar
 * @returns true si se eliminó correctamente, false si no se encontró
 */
export const eliminarRegistroHistorial = (id: string | number): boolean => {
  const longitudInicial = historialEstados.length;
  historialEstados = historialEstados.filter(registro => registro.id !== id);
  return historialEstados.length < longitudInicial;
};

/**
 * Registra automáticamente un cambio de estado de reporte
 * @param reporte - Reporte afectado
 * @param estadoAnterior - Estado previo del reporte
 * @param estadoNuevo - Nuevo estado del reporte
 * @param realizadoPor - Usuario que realizó el cambio
 * @param motivoCambio - Motivo opcional del cambio
 * @param tipoAccion - Tipo de acción realizada
 */
export const registrarCambioEstadoReporte = (
  reporte: Reporte,
  estadoAnterior: string,
  estadoNuevo: string,
  realizadoPor: Usuario,
  motivoCambio?: string,
  tipoAccion: HistorialEstadoReporte['tipoAccion'] = 'cambio_estado'
): void => {
  console.log('Registrando cambio de estado en reporte:', {
    reporteId: reporte.id,
    estadoAnterior,
    estadoNuevo,
    realizadoPorId: realizadoPor.id,
    motivoCambio,
    tipoAccion
  });

  const nuevoRegistro = crearRegistroHistorial({
    idReporte: reporte,
    estadoAnterior,
    estadoNuevo,
    fechaHoraCambio: new Date(),
    realizadoPor,
    motivoCambio,
    tipoAccion,
  });

  console.log('Nuevo registro creado:', nuevoRegistro);
  console.log('Historial actualizado:', historialEstados);
}; 