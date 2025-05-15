import { HistorialActividadCategoria, Categoria, Usuario } from '@/types/tipos';
import { historialActividadCategoria } from '@/data/actividades';

/** Obtiene todos los registros del historial de actividades */
export const getAllHistorialActividadCategoria = (): HistorialActividadCategoria[] =>
  [...historialActividadCategoria];

/** Obtiene un registro por su ID */
export const getHistorialActividadCategoriaById = (id: string): HistorialActividadCategoria | undefined =>
  historialActividadCategoria.find(registro => registro.id === id);

/** Obtiene todos los registros para una categoría específica */
export const getHistorialActividadByCategoriaId = (categoriaId: string): HistorialActividadCategoria[] =>
  historialActividadCategoria.filter(registro => registro.categoria.id === categoriaId);

/** Crea un nuevo registro en el historial */
export const createHistorialActividadCategoria = (data: Omit<HistorialActividadCategoria, 'id'>): HistorialActividadCategoria => {
  const nuevoRegistro: HistorialActividadCategoria = {
    id: crypto.randomUUID(),
    ...data
  };
  historialActividadCategoria.push(nuevoRegistro);
  return nuevoRegistro;
};

/** Función genérica para registrar actividades en el historial */
const registrarActividad = (
  categoria: Categoria,
  usuario: Usuario,
  tipoActividad: HistorialActividadCategoria['tipoActividad'],
  descripcion: string,
  detalles: Record<string, any> = {},
  activo = true
): HistorialActividadCategoria => {
  return createHistorialActividadCategoria({
    categoria,
    tipoActividad,
    descripcion,
    fechaActividad: new Date(),
    usuarioResponsable: usuario,
    detalles,
    activo
  });
};

/** Registro específico para creación de categoría */
export const registrarCreacionCategoria = (
  categoria: Categoria,
  usuario: Usuario,
  comentario?: string
): HistorialActividadCategoria =>
  registrarActividad(
    categoria,
    usuario,
    'creacion',
    `Creación de la categoría "${categoria.nombre}"`,
    { comentario: comentario ?? 'Categoría creada correctamente' }
  );

/** Registro específico para modificación de categoría */
export const registrarModificacionCategoria = (
  categoria: Categoria,
  usuario: Usuario,
  campo: string,
  valorAnterior: string,
  valorNuevo: string,
  comentario?: string
): HistorialActividadCategoria =>
  registrarActividad(
    categoria,
    usuario,
    'modificacion',
    `Actualización del campo "${campo}" de la categoría "${categoria.nombre}"`,
    { campo, valorAnterior, valorNuevo, comentario: comentario ?? `Se actualizó el campo ${campo}` }
  );

/** Registro específico para cambio de estado de categoría */
export const registrarCambioEstadoCategoria = (
  categoria: Categoria,
  usuario: Usuario,
  estadoAnterior: boolean,
  estadoNuevo: boolean,
  comentario?: string
): HistorialActividadCategoria =>
  registrarActividad(
    categoria,
    usuario,
    'cambio_estado',
    `Cambio de estado de la categoría "${categoria.nombre}" de ${estadoAnterior ? 'activo' : 'inactivo'} a ${estadoNuevo ? 'activo' : 'inactivo'}`,
    {
      campo: 'activo',
      valorAnterior: estadoAnterior.toString(),
      valorNuevo: estadoNuevo.toString(),
      comentario: comentario ?? 'Se cambió el estado de la categoría'
    }
  );

/** Registro específico para eliminación de categoría */
export const registrarEliminacionCategoria = (
  categoria: Categoria,
  usuario: Usuario,
  comentario?: string
): HistorialActividadCategoria =>
  registrarActividad(
    categoria,
    usuario,
    'eliminacion',
    `Eliminación de la categoría "${categoria.nombre}"`,
    { comentario: comentario ?? 'Categoría eliminada' }
  );

/** Actualiza un registro del historial */
export const updateHistorialActividadCategoria = (
  id: string,
  data: Partial<HistorialActividadCategoria>
): HistorialActividadCategoria | undefined => {
  const index = historialActividadCategoria.findIndex(registro => registro.id === id);
  if (index === -1) return undefined;

  const registroActualizado = { ...historialActividadCategoria[index], ...data };
  historialActividadCategoria[index] = registroActualizado;
  return registroActualizado;
};

/** Elimina un registro del historial */
export const deleteHistorialActividadCategoria = (id: string): boolean => {
  const index = historialActividadCategoria.findIndex(registro => registro.id === id);
  if (index === -1) return false;

  historialActividadCategoria.splice(index, 1);
  return true;
};

/** Filtra por tipo de actividad */
export const getHistorialActividadByTipo = (
  tipoActividad: HistorialActividadCategoria['tipoActividad']
): HistorialActividadCategoria[] =>
  historialActividadCategoria.filter(registro => registro.tipoActividad === tipoActividad);

/** Filtra por usuario responsable */
export const getHistorialActividadByUsuario = (usuarioId: string): HistorialActividadCategoria[] =>
  historialActividadCategoria.filter(registro => registro.usuarioResponsable.id === usuarioId);

/** Filtra por rango de fechas */
export const getHistorialActividadByRangoFechas = (
  fechaInicio: Date,
  fechaFin: Date
): HistorialActividadCategoria[] =>
  historialActividadCategoria.filter(registro => {
    const fecha = new Date(registro.fechaActividad);
    return fecha >= fechaInicio && fecha <= fechaFin;
  });
