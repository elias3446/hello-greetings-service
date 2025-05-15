import { HistorialEstado, EstadoReporte, Usuario } from '@/types/tipos';
import { historialEstados } from '@/data/actividades';
import { getEstadoById } from './estadoController';

// Obtener todo el historial de estados
export const getHistorialEstados = (): HistorialEstado[] => {
  return historialEstados;
};

// Obtener el historial de estado por ID
export const getHistorialEstadoById = (id: string): HistorialEstado | undefined => {
  return historialEstados.find((historial) => historial.id === id);
};

// Obtener el historial de estados de un estado específico
export const getHistorialEstadoByEstadoId = (estadoId: string): HistorialEstado[] => {
  return historialEstados.filter((historial) => historial.idEstado.id === estadoId);
};

// Crear un nuevo registro en el historial de estados
export const createHistorialEstado = (
  estadoId: string,
  estadoAnterior: string,
  estadoNuevo: string,
  realizadoPorId: string,
  tipoAccion: 'creacion' | 'actualizacion' | 'cambio_estado' | 'otro',
  motivoCambio?: string
): HistorialEstado => {
  // Obtener el estado por ID
  const estado = getEstadoById(estadoId);
  if (!estado) {
    throw new Error('Estado no encontrado');
  }

  // En un caso real, buscaríamos al usuario en la base de datos
  // Aquí usamos el usuario admin de ejemplo
  const realizadoPor = {
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
  } as Usuario;

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

// Actualizar un registro del historial de estados
export const updateHistorialEstado = (
  id: string,
  historialData: Partial<HistorialEstado>
): HistorialEstado => {
  const index = historialEstados.findIndex((historial) => historial.id === id);
  if (index === -1) {
    throw new Error('Registro de historial no encontrado');
  }

  // Actualizar el registro existente manteniendo los campos no modificados
  const historialActualizado: HistorialEstado = {
    ...historialEstados[index],
    ...historialData
  };

  historialEstados[index] = historialActualizado;
  return historialActualizado;
};

// Eliminar un registro del historial de estados
export const deleteHistorialEstado = (id: string): boolean => {
  const index = historialEstados.findIndex((historial) => historial.id === id);
  if (index !== -1) {
    historialEstados.splice(index, 1);
    return true;
  }
  return false;
}; 