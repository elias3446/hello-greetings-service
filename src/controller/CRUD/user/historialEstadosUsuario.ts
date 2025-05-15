import { HistorialEstadoUsuario, Usuario } from '@/types/tipos';
import { historialEstadosEjemplo } from '@/data/actividades';

// Simulación de base de datos en memoria
let historialEstados: HistorialEstadoUsuario[] = [...historialEstadosEjemplo];

/**
 * Crea un nuevo registro en el historial de estados de usuario.
 * @param registro - Datos del nuevo registro (sin ID).
 * @returns El nuevo registro creado con ID asignado.
 */
export const crearRegistroHistorial = (
  registro: Omit<HistorialEstadoUsuario, 'id'>
): HistorialEstadoUsuario => {
  const nuevoRegistro: HistorialEstadoUsuario = {
    ...registro,
    id: Date.now().toString(), // ID temporal único
  };

  historialEstados.push(nuevoRegistro);
  return nuevoRegistro;
};

/**
 * Obtiene todos los registros del historial de un usuario específico.
 * @param idUsuario - ID del usuario.
 * @returns Lista de registros ordenados cronológicamente por fecha descendente.
 */
export const obtenerHistorialUsuario = (
  idUsuario: string | number
): HistorialEstadoUsuario[] => {
  return historialEstados
    .filter(registro => String(registro.idUsuario.id) === String(idUsuario))
    .sort((a, b) => b.fechaHoraCambio.getTime() - a.fechaHoraCambio.getTime());
};

/**
 * Obtiene un registro específico del historial por su ID.
 * @param id - ID del registro.
 * @returns El registro encontrado o undefined.
 */
export const obtenerRegistroHistorial = (
  id: string | number
): HistorialEstadoUsuario | undefined => {
  return historialEstados.find(registro => registro.id === String(id));
};

/**
 * Actualiza un registro existente en el historial.
 * @param id - ID del registro a actualizar.
 * @param datos - Nuevos datos del registro.
 * @returns El registro actualizado o undefined si no se encontró.
 */
export const actualizarRegistroHistorial = (
  id: string | number,
  datos: Partial<HistorialEstadoUsuario>
): HistorialEstadoUsuario | undefined => {
  const indice = historialEstados.findIndex(registro => registro.id === String(id));
  if (indice === -1) return undefined;

  historialEstados[indice] = {
    ...historialEstados[indice],
    ...datos,
  };

  return historialEstados[indice];
};

/**
 * Elimina un registro del historial por su ID.
 * @param id - ID del registro a eliminar.
 * @returns true si se eliminó correctamente, false si no se encontró.
 */
export const eliminarRegistroHistorial = (id: string | number): boolean => {
  const longitudAntes = historialEstados.length;
  historialEstados = historialEstados.filter(registro => registro.id !== String(id));
  return historialEstados.length < longitudAntes;
};

/**
 * Registra automáticamente un cambio de estado de usuario.
 * @param idUsuario - Usuario afectado.
 * @param estadoAnterior - Estado anterior del usuario.
 * @param estadoNuevo - Nuevo estado del usuario.
 * @param realizadoPor - Usuario que realizó el cambio.
 * @param motivoCambio - Motivo opcional del cambio.
 * @param tipoAccion - Tipo de acción (por defecto 'cambio_estado').
 */
export const registrarCambioEstado = (
  idUsuario: Usuario,
  estadoAnterior: string,
  estadoNuevo: string,
  realizadoPor: Usuario,
  motivoCambio?: string,
  tipoAccion: HistorialEstadoUsuario['tipoAccion'] = 'cambio_estado'
): void => {
  crearRegistroHistorial({
    idUsuario,
    estadoAnterior,
    estadoNuevo,
    fechaHoraCambio: new Date(),
    realizadoPor,
    motivoCambio,
    tipoAccion,
  });
};
