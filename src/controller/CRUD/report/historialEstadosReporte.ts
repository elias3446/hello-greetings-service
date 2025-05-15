import { HistorialEstadoReporte, Reporte, Usuario } from '@/types/tipos';
import { historialEstadosReporteEjemplo } from '@/data/actividades';

// Simulación de base de datos
let historialEstados: HistorialEstadoReporte[] = [...historialEstadosReporteEjemplo];

/* =========================
   FUNCIONES PRINCIPALES
   ========================= */

/**
 * Crea un nuevo registro de historial de estado de reporte.
 * @param registro - Datos del nuevo registro (sin ID).
 * @returns Registro creado con ID generado.
 */
export const crearRegistroHistorial = (
  registro: Omit<HistorialEstadoReporte, 'id'>
): HistorialEstadoReporte => {
  const nuevoRegistro: HistorialEstadoReporte = {
    ...registro,
    id: Date.now().toString(), // ID generado por timestamp
  };

  historialEstados.push(nuevoRegistro);
  return nuevoRegistro;
};

/**
 * Obtiene todos los registros del historial de un reporte específico.
 * @param idReporte - ID del reporte.
 * @returns Registros ordenados de más reciente a más antiguo.
 */
export const obtenerHistorialReporte = (idReporte: string): HistorialEstadoReporte[] => {
  return historialEstados
    .filter(registro => String(registro.idReporte.id) === String(idReporte))
    .sort((a, b) => b.fechaHoraCambio.getTime() - a.fechaHoraCambio.getTime());
};

/**
 * Obtiene un registro específico del historial por su ID.
 * @param id - ID del registro.
 * @returns El registro encontrado o undefined si no existe.
 */
export const obtenerRegistroHistorial = (id: string): HistorialEstadoReporte | undefined => {
  return historialEstados.find(registro => registro.id === id);
};

/**
 * Actualiza un registro del historial.
 * @param id - ID del registro a actualizar.
 * @param datos - Datos nuevos a aplicar.
 * @returns El registro actualizado o undefined si no se encontró.
 */
export const actualizarRegistroHistorial = (
  id: string,
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
 * Elimina un registro del historial.
 * @param id - ID del registro a eliminar.
 * @returns true si se eliminó correctamente, false si no se encontró.
 */
export const eliminarRegistroHistorial = (id: string): boolean => {
  const longitudInicial = historialEstados.length;
  historialEstados = historialEstados.filter(registro => registro.id !== id);
  return historialEstados.length < longitudInicial;
};

/**
 * Registra un cambio de estado en un reporte.
 * @param reporte - Reporte afectado.
 * @param estadoAnterior - Estado anterior del reporte.
 * @param estadoNuevo - Estado nuevo del reporte.
 * @param realizadoPor - Usuario que realizó el cambio.
 * @param motivoCambio - Motivo opcional del cambio.
 * @param tipoAccion - Tipo de acción (por defecto: 'cambio_estado').
 */
export const registrarCambioEstadoReporte = (
  reporte: Reporte,
  estadoAnterior: string,
  estadoNuevo: string,
  realizadoPor: Usuario,
  motivoCambio?: string,
  tipoAccion: HistorialEstadoReporte['tipoAccion'] = 'cambio_estado'
): void => {
  crearRegistroHistorial({
    idReporte: reporte,
    estadoAnterior,
    estadoNuevo,
    fechaHoraCambio: new Date(),
    realizadoPor,
    motivoCambio,
    tipoAccion,
  });
};
