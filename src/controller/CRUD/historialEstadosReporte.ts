import { HistorialEstadoReporte, Usuario, Reporte } from '@/types/tipos';
import { historialEstadosReporte } from '@/data/actividades';

// Array para almacenar los registros del historial (simulación de base de datos)
let historialEstados: HistorialEstadoReporte[] = [...historialEstadosReporte];

/**
 * Crea un nuevo registro en el historial de estados de usuario
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
 * Obtiene todos los registros del historial de un usuario específico
 * @param idUsuario - ID del usuario
 * @returns Array de registros ordenados cronológicamente
 */
export const obtenerHistorialUsuario = (idUsuario: string | number): HistorialEstadoReporte[] => {
  return historialEstados
    .filter(registro => registro.idReporte.id === idUsuario)
    .sort((a, b) => b.fechaHoraCambio.getTime() - a.fechaHoraCambio.getTime());
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
 * Registra automáticamente un cambio de estado de usuario
 * @param idUsuario - ID del usuario afectado
 * @param estadoAnterior - Estado previo del usuario
 * @param estadoNuevo - Nuevo estado del usuario
 * @param realizadoPor - Usuario que realizó el cambio
 * @param motivoCambio - Motivo opcional del cambio
 * @param tipoAccion - Tipo de acción realizada
 */
export const registrarCambioEstado = (
  idReporte: Reporte,
  estadoAnterior: string,
  estadoNuevo: string,
  realizadoPor: Usuario,
  motivoCambio?: string,
  tipoAccion: HistorialEstadoReporte['tipoAccion'] = 'cambio_estado'
): void => {
  crearRegistroHistorial({
    idReporte,
    estadoAnterior,
    estadoNuevo,
    fechaHoraCambio: new Date(),
    realizadoPor,
    motivoCambio,
    tipoAccion,
  });
}; 