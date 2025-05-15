import { ActividadUsuario } from '@/types/tipos';
import { actividadesUsuario } from '@/data/actividades';

// Simulación de base de datos en memoria
let historialEstados: ActividadUsuario[] = [...actividadesUsuario];

/**
 * Crea un nuevo registro en el historial de usuario.
 * @param registro - Datos del nuevo registro (sin ID).
 * @returns El nuevo registro creado, con ID asignado.
 */
export const crearHistorial = (registro: Omit<ActividadUsuario, 'id'>): ActividadUsuario => {
  const nuevoRegistro: ActividadUsuario = {
    id: Date.now().toString(), // ID temporal basado en timestamp
    ...registro,
  };

  historialEstados.push(nuevoRegistro);
  return nuevoRegistro;
};

/**
 * Obtiene todos los registros del historial para un usuario específico.
 * @param idUsuario - ID del usuario.
 * @returns Lista de registros ordenados por fecha descendente.
 */
export const obtenerHistorialUsuario = (idUsuario: string | number): ActividadUsuario[] => {
  return historialEstados
    .filter(registro => String(registro.usuarioId) === String(idUsuario))
    .sort((a, b) => b.fecha.getTime() - a.fecha.getTime());
};

/**
 * Obtiene un registro específico del historial por su ID.
 * @param id - ID del registro.
 * @returns El registro encontrado o undefined.
 */
export const obtenerRegistroHistorial = (id: string | number): ActividadUsuario | undefined => {
  return historialEstados.find(registro => registro.id === String(id));
};

/**
 * Actualiza un registro existente en el historial.
 * @param id - ID del registro a actualizar.
 * @param datos - Datos nuevos para el registro.
 * @returns El registro actualizado o undefined si no se encontró.
 */
export const actualizarRegistroHistorial = (
  id: string | number,
  datos: Partial<ActividadUsuario>
): ActividadUsuario | undefined => {
  const indice = historialEstados.findIndex(registro => registro.id === String(id));
  if (indice === -1) return undefined;

  historialEstados[indice] = { ...historialEstados[indice], ...datos };
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
 * Registra automáticamente un cambio o acción en el historial de usuario.
 * @param id - ID único del evento (opcional, reemplazado por timestamp interno).
 * @param tipo - Tipo de acción (login, logout, creación, modificación, etc.).
 * @param descripcion - Descripción del evento.
 * @param fecha - Fecha del evento.
 * @param usuarioId - Usuario afectado.
 * @param detalles - Detalles opcionales del cambio (valor anterior/nuevo, comentario).
 */
export const registrarCambioHistorial = (
  id: string, // No se usa directamente, se genera un nuevo ID interno
  tipo: 'login' | 'logout' | 'creacion' | 'modificacion' | 'eliminacion',
  descripcion: string,
  fecha: Date,
  usuarioId: string,
  detalles?: {
    valorAnterior?: string;
    valorNuevo?: string;
    comentario?: string;
  }
): void => {
  crearHistorial({
    tipo,
    descripcion,
    fecha,
    usuarioId,
    detalles,
  });
};
