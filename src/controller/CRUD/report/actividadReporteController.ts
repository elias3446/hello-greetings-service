import { ActividadReporte } from '@/types/tipos';

// Simulación de base de datos en memoria
let actividadesReporte: ActividadReporte[] = [];

/* =========================
   REGISTRO DE ACTIVIDADES
   ========================= */

/**
 * Registra una nueva actividad asociada a un reporte.
 * @param actividad - Actividad a registrar (sin ID ni fecha).
 * @returns Actividad registrada con ID y timestamp.
 */
export const registrarActividadReporte = (
  actividad: Omit<ActividadReporte, 'id' | 'fecha'>
): ActividadReporte => {
  const nuevaActividad: ActividadReporte = {
    ...actividad,
    id: `act-${Date.now()}`,
    fecha: new Date(),
  };

  actividadesReporte.push(nuevaActividad);
  return nuevaActividad;
};

/* =========================
   CONSULTAS
   ========================= */

/**
 * Obtiene todas las actividades de un reporte específico.
 * @param reporteId - ID del reporte.
 * @returns Lista de actividades ordenadas por fecha descendente.
 */
export const getActividadesReporte = (reporteId: string): ActividadReporte[] => {
  return actividadesReporte
    .filter(actividad => actividad.reporteId === reporteId)
    .sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());
};

/**
 * Obtiene todas las actividades registradas en el sistema.
 * @returns Lista completa de actividades ordenadas por fecha descendente.
 */
export const getAllActividadesReporte = (): ActividadReporte[] => {
  return [...actividadesReporte].sort(
    (a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime()
  );
};

/* =========================
   ELIMINACIÓN
   ========================= */

/**
 * Elimina todas las actividades asociadas a un reporte.
 * @param reporteId - ID del reporte.
 */
export const eliminarActividadesReporte = (reporteId: string): void => {
  actividadesReporte = actividadesReporte.filter(
    actividad => actividad.reporteId !== reporteId
  );
};
