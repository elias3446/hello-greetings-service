
import { EstadoReporte } from '../types/tipos';
import { estadosReporte } from '../data/estadosReporte';

// Obtener todos los estados
export const getEstados = (): EstadoReporte[] => {
  return estadosReporte;
};

// Obtener un estado por ID
export const getEstadoById = (id: string): EstadoReporte | undefined => {
  return estadosReporte.find((estado) => estado.id === id);
};

// Crear un nuevo estado
export const createEstado = (estadoData: Omit<EstadoReporte, 'id'>): EstadoReporte => {
  const newEstado: EstadoReporte = {
    id: crypto.randomUUID(),
    ...estadoData
  };
  estadosReporte.push(newEstado);
  return newEstado;
};

// Actualizar un estado
export const updateEstado = (id: string, estadoData: Partial<EstadoReporte>): EstadoReporte | undefined => {
  const index = estadosReporte.findIndex((estado) => estado.id === id);
  if (index !== -1) {
    estadosReporte[index] = { ...estadosReporte[index], ...estadoData };
    return estadosReporte[index];
  }
  return undefined;
};

// Eliminar un estado
export const deleteEstado = (id: string): boolean => {
  const index = estadosReporte.findIndex((estado) => estado.id === id);
  if (index !== -1) {
    estadosReporte.splice(index, 1);
    return true;
  }
  return false;
};
