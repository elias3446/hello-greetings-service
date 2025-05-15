import { HistorialEstadoRol, Rol, Usuario } from '@/types/tipos';
import { historialEstadosRol } from '@/data/actividades';
import { getRoleById } from './roleController';

// Obtener todo el historial de estados de roles
export const getHistorialEstadosRol = (): HistorialEstadoRol[] => {
  return historialEstadosRol;
};

// Obtener el historial de estados por ID
export const getHistorialEstadoRolById = (id: string): HistorialEstadoRol | undefined => {
  return historialEstadosRol.find((historial) => historial.id === id);
};

// Obtener el historial de estados de un rol específico
export const getHistorialEstadoRolByRolId = (rolId: string): HistorialEstadoRol[] => {
  return historialEstadosRol.filter((historial) => historial.idRol.id === rolId);
};

// Crear un nuevo registro en el historial de estados de rol
export const createHistorialEstadoRol = (
  rolId: string,
  estadoAnterior: string,
  estadoNuevo: string,
  realizadoPorId: string,
  tipoAccion: 'creacion' | 'actualizacion' | 'cambio_estado' | 'otro',
  motivoCambio?: string
): HistorialEstadoRol => {
  // Obtener el rol por ID
  const rol = getRoleById(rolId);
  if (!rol) {
    throw new Error('Rol no encontrado');
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

  const nuevoHistorial: HistorialEstadoRol = {
    id: crypto.randomUUID(),
    idRol: rol,
    estadoAnterior,
    estadoNuevo,
    fechaHoraCambio: new Date(),
    realizadoPor,
    motivoCambio,
    tipoAccion
  };

  historialEstadosRol.push(nuevoHistorial);
  return nuevoHistorial;
};

// Actualizar un registro del historial de estados de rol
export const updateHistorialEstadoRol = (
  id: string,
  historialData: Partial<HistorialEstadoRol>
): HistorialEstadoRol => {
  const index = historialEstadosRol.findIndex((historial) => historial.id === id);
  if (index === -1) {
    throw new Error('Registro de historial no encontrado');
  }

  // Actualizar el registro existente manteniendo los campos no modificados
  const historialActualizado: HistorialEstadoRol = {
    ...historialEstadosRol[index],
    ...historialData
  };

  historialEstadosRol[index] = historialActualizado;
  return historialActualizado;
};

// Eliminar un registro del historial de estados de rol
export const deleteHistorialEstadoRol = (id: string): boolean => {
  const index = historialEstadosRol.findIndex((historial) => historial.id === id);
  if (index !== -1) {
    historialEstadosRol.splice(index, 1);
    return true;
  }
  return false;
}; 