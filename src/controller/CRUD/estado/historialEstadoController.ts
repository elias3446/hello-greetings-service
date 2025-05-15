import { HistorialEstado, EstadoReporte, Usuario } from '@/types/tipos';
import { historialEstados } from '@/data/actividades';
import { getEstadoById } from './estadoController';

/**
 * Obtiene todos los registros del historial de estados.
 * @returns Array de registros de historial.
 */
export const getHistorialEstados = (): HistorialEstado[] => {
  return [...historialEstados]; // Retorna copia para evitar modificaciones externas
};

/**
 * Obtiene un registro del historial por su ID.
 * @param id - ID del registro.
 * @returns Registro encontrado o undefined si no existe.
 */
export const getHistorialEstadoById = (id: string): HistorialEstado | undefined => {
  return historialEstados.find(historial => historial.id === id);
};

/**
 * Obtiene todos los registros del historial para un estado específico.
 * @param estadoId - ID del estado.
 * @returns Array de registros relacionados al estado.
 */
export const getHistorialEstadoByEstadoId = (estadoId: string): HistorialEstado[] => {
  return historialEstados.filter(historial => historial.idEstado.id === estadoId);
};

/**
 * Crea un nuevo registro en el historial de estados.
 * @param estadoId - ID del estado actual.
 * @param estadoAnterior - Nombre del estado anterior.
 * @param estadoNuevo - Nombre del estado nuevo.
 * @param realizadoPorId - ID del usuario que realiza el cambio.
 * @param tipoAccion - Tipo de acción realizada.
 * @param motivoCambio - Motivo opcional del cambio.
 * @returns Nuevo registro creado.
 * @throws Error si el estado no existe.
 */
export const createHistorialEstado = (
  estadoId: string,
  estadoAnterior: string,
  estadoNuevo: string,
  realizadoPorId: string,
  tipoAccion: 'creacion' | 'actualizacion' | 'cambio_estado' | 'otro',
  motivoCambio?: string
): HistorialEstado => {
  const estado = getEstadoById(estadoId);
  if (!estado) throw new Error(`Estado con ID "${estadoId}" no encontrado`);

  // En un entorno real, obtener usuario de la base de datos; aquí se simula admin
  const realizadoPor: Usuario = {
    id: realizadoPorId,
    nombre: 'Admin',
    apellido: 'Sistema',
    email: 'admin@sistema.com',
    roles: [],
    fechaCreacion: new Date(),
    estado: 'activo',
    tipo: 'admin',
    intentosFallidos: 0,
    password: ''
  };

  const nuevoHistorial: HistorialEstado = {
    id: crypto.randomUUID(),
    idEstado: estado,
    estadoAnterior,
    estadoNuevo,
    fechaHoraCambio: new Date(),
    realizadoPor,
    motivoCambio,
    tipoAccion
  };

  historialEstados.push(nuevoHistorial);
  return nuevoHistorial;
};

/**
 * Actualiza un registro existente del historial de estados.
 * @param id - ID del registro a actualizar.
 * @param historialData - Campos a modificar.
 * @returns Registro actualizado.
 * @throws Error si no se encuentra el registro.
 */
export const updateHistorialEstado = (
  id: string,
  historialData: Partial<HistorialEstado>
): HistorialEstado => {
  const index = historialEstados.findIndex(historial => historial.id === id);
  if (index === -1) throw new Error(`Registro con ID "${id}" no encontrado`);

  historialEstados[index] = {
    ...historialEstados[index],
    ...historialData
  };

  return historialEstados[index];
};

/**
 * Elimina un registro del historial de estados.
 * @param id - ID del registro a eliminar.
 * @returns true si se eliminó correctamente, false si no se encontró.
 */
export const deleteHistorialEstado = (id: string): boolean => {
  const index = historialEstados.findIndex(historial => historial.id === id);
  if (index === -1) return false;

  historialEstados.splice(index, 1);
  return true;
};
