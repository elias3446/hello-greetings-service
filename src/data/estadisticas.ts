// Datos de ejemplo para estadísticas del dashboard
import { EstadisticasDashboard } from '../types/tipos';
import { reportes } from './reportes';

export const estadisticasDashboard: EstadisticasDashboard = {
  totalReportes: reportes.length,  // Total de reportes
  
  // Reportes por estado
  reportesPorEstado: reportes.reduce((acc, reporte) => {
    acc[reporte.estado.id] = (acc[reporte.estado.id] || 0) + 1;
    return acc;
  }, {}),

  // Reportes por categoría
  reportesPorCategoria: reportes.reduce((acc, reporte) => {
    acc[reporte.categoria.id] = (acc[reporte.categoria.id] || 0) + 1;
    return acc;
  }, {}),

  // Reportes recientes
  reportesRecientes: reportes.sort((a, b) => 
    b.fechaCreacion.getTime() - a.fechaCreacion.getTime()
  ).slice(0, 5),

  // Reportes por prioridad
  reportesPorPrioridad: reportes.reduce((acc, reporte) => {
    if (reporte.prioridad) {
      acc[reporte.prioridad.id] = (acc[reporte.prioridad.id] || 0) + 1;
    }
    return acc;
  }, {}),
};
