import { HistorialAsignacion, Reporte, Usuario } from '@/types/tipos';

/**
 * Agrega una nueva asignación al historial del reporte,
 * marcando todas las anteriores como no actuales.
 * 
 * @param reporte - Reporte al que se asignará un usuario.
 * @param usuario - Usuario asignado o null si se desasigna.
 * @returns Historial actualizado con la nueva asignación.
 */
export const agregarAsignacion = (
  reporte: Reporte,
  usuario: Usuario | null | undefined
): HistorialAsignacion[] => {
  const historialPrevio = reporte.historialAsignaciones ?? [];

  // Desmarcar asignaciones anteriores
  const historialSinActual = historialPrevio.map(asignacion => ({
    ...asignacion,
    esActual: false,
  }));

  const ahora = new Date();

  // Crear nueva asignación
  const nuevaAsignacion: HistorialAsignacion = {
    id: crypto.randomUUID(),
    usuario: usuario ?? null,
    fechaCreacion: ahora,
    fechaAsignacion: ahora,
    esActual: true,
  };

  return [...historialSinActual, nuevaAsignacion];
};

/**
 * Obtiene el historial completo de asignaciones de un reporte.
 * 
 * @param reporte - Reporte del cual se obtiene el historial.
 * @returns Lista de asignaciones.
 */
export const obtenerHistorialPorReporte = (
  reporte: Reporte
): HistorialAsignacion[] => {
  return reporte.historialAsignaciones ?? [];
};

/**
 * Obtiene la asignación actual (activa) de un reporte, si existe.
 * 
 * @param reporte - Reporte a consultar.
 * @returns La asignación actual o undefined si no hay ninguna.
 */
export const obtenerAsignacionActual = (
  reporte: Reporte
): HistorialAsignacion | undefined => {
  return reporte.historialAsignaciones?.find(asignacion => asignacion.esActual);
};
