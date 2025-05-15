import { EstadoReporte } from '@/types/tipos';
import { estadosReporte } from '@/data/estadosReporte';

/**
 * Obtiene todos los estados de reporte.
 * @returns Array de estados (copia para evitar mutaciones externas).
 */
export const getEstados = (): EstadoReporte[] => {
  return [...estadosReporte];
};

/**
 * Obtiene un estado por su ID.
 * @param id - ID del estado.
 * @returns Estado encontrado o undefined si no existe.
 */
export const getEstadoById = (id: string): EstadoReporte | undefined => {
  return estadosReporte.find(estado => estado.id === id);
};

/**
 * Crea un nuevo estado de reporte.
 * @param estadoData - Datos del estado sin ID.
 * @returns Estado creado con ID generado.
 */
export const createEstado = (estadoData: Omit<EstadoReporte, 'id'>): EstadoReporte => {
  const newEstado: EstadoReporte = {
    id: crypto.randomUUID(),
    ...estadoData
  };
  estadosReporte.push(newEstado);
  return newEstado;
};

/**
 * Actualiza un estado existente.
 * @param id - ID del estado a actualizar.
 * @param estadoData - Datos parciales a actualizar.
 * @returns Estado actualizado o undefined si no existe.
 */
export const updateEstado = (id: string, estadoData: Partial<EstadoReporte>): EstadoReporte | undefined => {
  const index = estadosReporte.findIndex(estado => estado.id === id);
  if (index === -1) return undefined;

  estadosReporte[index] = {
    ...estadosReporte[index],
    ...estadoData
  };
  return estadosReporte[index];
};

/**
 * Elimina un estado por su ID.
 * @param id - ID del estado a eliminar.
 * @returns true si se eliminó correctamente, false si no se encontró.
 */
export const deleteEstado = (id: string): boolean => {
  const index = estadosReporte.findIndex(estado => estado.id === id);
  if (index === -1) return false;

  estadosReporte.splice(index, 1);
  return true;
};
