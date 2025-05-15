import { HistorialActividadCategoria, Categoria, Usuario } from '@/types/tipos';
import { historialActividadCategoria } from '@/data/historialActividades';

/**
 * Obtiene todos los registros del historial de actividades de categorías
 * @returns Array de registros del historial de actividades de categorías
 */
export const getAllHistorialActividadCategoria = (): HistorialActividadCategoria[] => {
  return historialActividadCategoria;
};

/**
 * Obtiene un registro del historial de actividades de categorías por su ID
 * @param id ID del registro a buscar
 * @returns Registro del historial de actividades de categorías o undefined si no se encuentra
 */
export const getHistorialActividadCategoriaById = (id: string): HistorialActividadCategoria | undefined => {
  return historialActividadCategoria.find(registro => registro.id === id);
};

/**
 * Obtiene todos los registros del historial de actividades de una categoría específica
 * @param categoriaId ID de la categoría
 * @returns Array de registros del historial de actividades de la categoría
 */
export const getHistorialActividadByCategoriaId = (categoriaId: string): HistorialActividadCategoria[] => {
  return historialActividadCategoria.filter(registro => registro.categoria.id === categoriaId);
};

/**
 * Crea un nuevo registro en el historial de actividades de categorías
 * @param data Datos del nuevo registro
 * @returns El registro creado
 */
export const createHistorialActividadCategoria = (data: Omit<HistorialActividadCategoria, 'id'>): HistorialActividadCategoria => {
  const nuevoRegistro: HistorialActividadCategoria = {
    id: crypto.randomUUID(),
    ...data
  };
  
  historialActividadCategoria.push(nuevoRegistro);
  return nuevoRegistro;
};

/**
 * Registra una actividad de creación de categoría
 * @param categoria Categoría creada
 * @param usuario Usuario responsable
 * @param comentario Comentario opcional
 * @returns El registro creado
 */
export const registrarCreacionCategoria = (
  categoria: Categoria,
  usuario: Usuario,
  comentario?: string
): HistorialActividadCategoria => {
  return createHistorialActividadCategoria({
    categoria,
    tipoActividad: 'creacion',
    descripcion: `Creación de la categoría "${categoria.nombre}"`,
    fechaActividad: new Date(),
    usuarioResponsable: usuario,
    detalles: {
      comentario: comentario || 'Categoría creada correctamente'
    },
    activo: true
  });
};

/**
 * Registra una actividad de modificación de categoría
 * @param categoria Categoría modificada
 * @param usuario Usuario responsable
 * @param campo Campo modificado
 * @param valorAnterior Valor anterior
 * @param valorNuevo Valor nuevo
 * @param comentario Comentario opcional
 * @returns El registro creado
 */
export const registrarModificacionCategoria = (
  categoria: Categoria,
  usuario: Usuario,
  campo: string,
  valorAnterior: string,
  valorNuevo: string,
  comentario?: string
): HistorialActividadCategoria => {
  return createHistorialActividadCategoria({
    categoria,
    tipoActividad: 'modificacion',
    descripcion: `Actualización del campo "${campo}" de la categoría "${categoria.nombre}"`,
    fechaActividad: new Date(),
    usuarioResponsable: usuario,
    detalles: {
      campo,
      valorAnterior,
      valorNuevo,
      comentario: comentario || `Se actualizó el campo ${campo}`
    },
    activo: true
  });
};

/**
 * Registra una actividad de cambio de estado de categoría
 * @param categoria Categoría modificada
 * @param usuario Usuario responsable
 * @param estadoAnterior Estado anterior
 * @param estadoNuevo Estado nuevo
 * @param comentario Comentario opcional
 * @returns El registro creado
 */
export const registrarCambioEstadoCategoria = (
  categoria: Categoria,
  usuario: Usuario,
  estadoAnterior: boolean,
  estadoNuevo: boolean,
  comentario?: string
): HistorialActividadCategoria => {
  return createHistorialActividadCategoria({
    categoria,
    tipoActividad: 'cambio_estado',
    descripcion: `Cambio de estado de la categoría "${categoria.nombre}" de ${estadoAnterior ? 'activo' : 'inactivo'} a ${estadoNuevo ? 'activo' : 'inactivo'}`,
    fechaActividad: new Date(),
    usuarioResponsable: usuario,
    detalles: {
      campo: 'activo',
      valorAnterior: estadoAnterior.toString(),
      valorNuevo: estadoNuevo.toString(),
      comentario: comentario || `Se cambió el estado de la categoría`
    },
    activo: true
  });
};

/**
 * Registra una actividad de eliminación de categoría
 * @param categoria Categoría eliminada
 * @param usuario Usuario responsable
 * @param comentario Comentario opcional
 * @returns El registro creado
 */
export const registrarEliminacionCategoria = (
  categoria: Categoria,
  usuario: Usuario,
  comentario?: string
): HistorialActividadCategoria => {
  return createHistorialActividadCategoria({
    categoria,
    tipoActividad: 'eliminacion',
    descripcion: `Eliminación de la categoría "${categoria.nombre}"`,
    fechaActividad: new Date(),
    usuarioResponsable: usuario,
    detalles: {
      comentario: comentario || 'Categoría eliminada'
    },
    activo: true
  });
};

/**
 * Actualiza un registro del historial de actividades de categorías
 * @param id ID del registro a actualizar
 * @param data Datos a actualizar
 * @returns El registro actualizado o undefined si no se encuentra
 */
export const updateHistorialActividadCategoria = (
  id: string,
  data: Partial<HistorialActividadCategoria>
): HistorialActividadCategoria | undefined => {
  const index = historialActividadCategoria.findIndex(registro => registro.id === id);
  
  if (index === -1) {
    return undefined;
  }
  
  const registroActualizado = {
    ...historialActividadCategoria[index],
    ...data
  };
  
  historialActividadCategoria[index] = registroActualizado;
  return registroActualizado;
};

/**
 * Elimina un registro del historial de actividades de categorías
 * @param id ID del registro a eliminar
 * @returns true si se eliminó correctamente, false si no se encontró
 */
export const deleteHistorialActividadCategoria = (id: string): boolean => {
  const index = historialActividadCategoria.findIndex(registro => registro.id === id);
  
  if (index === -1) {
    return false;
  }
  
  historialActividadCategoria.splice(index, 1);
  return true;
};

/**
 * Filtra registros del historial de actividades de categorías por tipo de actividad
 * @param tipoActividad Tipo de actividad a filtrar
 * @returns Array de registros filtrados
 */
export const getHistorialActividadByTipo = (
  tipoActividad: 'creacion' | 'modificacion' | 'cambio_estado' | 'eliminacion'
): HistorialActividadCategoria[] => {
  return historialActividadCategoria.filter(registro => registro.tipoActividad === tipoActividad);
};

/**
 * Filtra registros del historial de actividades de categorías por usuario responsable
 * @param usuarioId ID del usuario responsable
 * @returns Array de registros filtrados
 */
export const getHistorialActividadByUsuario = (usuarioId: string): HistorialActividadCategoria[] => {
  return historialActividadCategoria.filter(registro => registro.usuarioResponsable.id === usuarioId);
};

/**
 * Filtra registros del historial de actividades de categorías por rango de fechas
 * @param fechaInicio Fecha de inicio
 * @param fechaFin Fecha de fin
 * @returns Array de registros filtrados
 */
export const getHistorialActividadByRangoFechas = (
  fechaInicio: Date,
  fechaFin: Date
): HistorialActividadCategoria[] => {
  return historialActividadCategoria.filter(registro => {
    const fecha = new Date(registro.fechaActividad);
    return fecha >= fechaInicio && fecha <= fechaFin;
  });
}; 