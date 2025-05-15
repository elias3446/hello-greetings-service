import { HistorialEstadoRol, Rol, Usuario } from '@/types/tipos';
import { historialEstadosRol } from '@/data/actividades';
import { obtenerRolPorId } from './roleController';

/**
 * Retorna todo el historial de estados de roles.
 */
export const obtenerHistorialEstadosRol = (): HistorialEstadoRol[] => {
  return [...historialEstadosRol];
};

/**
 * Obtiene un registro del historial por ID.
 * 
 * @param id - ID del historial.
 * @returns El registro encontrado o undefined.
 */
export const obtenerHistorialEstadoRolPorId = (id: string): HistorialEstadoRol | undefined => {
  return historialEstadosRol.find(historial => historial.id === id);
};

/**
 * Obtiene el historial de cambios de estado para un rol específico.
 * 
 * @param rolId - ID del rol.
 * @returns Arreglo de historial filtrado.
 */
export const obtenerHistorialPorRolId = (rolId: string): HistorialEstadoRol[] => {
  return historialEstadosRol.filter(historial => historial.idRol.id === rolId);
};

/**
 * Crea un nuevo registro de historial de estado para un rol.
 * 
 * @param rolId - ID del rol.
 * @param estadoAnterior - Estado anterior del rol.
 * @param estadoNuevo - Estado nuevo del rol.
 * @param realizadoPorId - ID del usuario que realizó el cambio.
 * @param tipoAccion - Tipo de acción registrada.
 * @param motivoCambio - Motivo opcional del cambio.
 * @returns El nuevo registro creado.
 * @throws Error si el rol no se encuentra.
 */
export const crearHistorialEstadoRol = (
  rolId: string,
  estadoAnterior: string,
  estadoNuevo: string,
  realizadoPorId: string,
  tipoAccion: HistorialEstadoRol['tipoAccion'],
  motivoCambio?: string
): HistorialEstadoRol => {
  const rol = obtenerRolPorId(rolId);
  if (!rol) throw new Error(`Rol con ID "${rolId}" no encontrado.`);

  // Simulación de usuario administrador
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

/**
 * Actualiza un registro existente del historial.
 * 
 * @param id - ID del registro a actualizar.
 * @param datos - Datos a modificar.
 * @returns Registro actualizado.
 * @throws Error si no se encuentra el historial.
 */
export const actualizarHistorialEstadoRol = (
  id: string,
  datos: Partial<HistorialEstadoRol>
): HistorialEstadoRol => {
  const index = historialEstadosRol.findIndex(historial => historial.id === id);
  if (index === -1) throw new Error(`Historial con ID "${id}" no encontrado.`);

  const historialActualizado: HistorialEstadoRol = {
    ...historialEstadosRol[index],
    ...datos,
  };

  historialEstadosRol[index] = historialActualizado;
  return historialActualizado;
};

/**
 * Elimina un registro del historial por ID.
 * 
 * @param id - ID del historial a eliminar.
 * @returns true si fue eliminado, false si no se encontró.
 */
export const eliminarHistorialEstadoRol = (id: string): boolean => {
  const index = historialEstadosRol.findIndex(historial => historial.id === id);
  if (index === -1) return false;

  historialEstadosRol.splice(index, 1);
  return true;
};
