import { ActividadReporte } from '@/types/tipos';

// Simulación de base de datos en memoria
let actividadesReporte: ActividadReporte[] = [];

/**
 * Registra una nueva actividad de reporte
 * @param actividad - La actividad a registrar
 * @returns La actividad registrada
 */
export const registrarActividadReporte = (actividad: ActividadReporte): ActividadReporte => {
  const nuevaActividad = {
    ...actividad,
    id: `act-${Date.now()}`,
    fechaHora: new Date()
  };
  
  actividadesReporte.push(nuevaActividad);
  return nuevaActividad;
};

/**
 * Obtiene todas las actividades de un reporte específico
 * @param reporteId - ID del reporte
 * @returns Array de actividades del reporte
 */
export const getActividadesReporte = (reporteId: string): ActividadReporte[] => {
  return actividadesReporte
    .filter(actividad => actividad.reporteId === reporteId)
    .sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());
};

/**
 * Obtiene todas las actividades de reporte
 * @returns Array de todas las actividades
 */
export const getAllActividadesReporte = (): ActividadReporte[] => {
  return [...actividadesReporte].sort((a, b) => 
    new Date(b.fecha).getTime() - new Date(a.fecha).getTime()
  );
};

/**
 * Elimina todas las actividades de un reporte
 * @param reporteId - ID del reporte
 */
export const eliminarActividadesReporte = (reporteId: string): void => {
  actividadesReporte = actividadesReporte.filter(actividad => actividad.reporteId !== reporteId);
}; 