import { HistorialAsignacion, Reporte, Usuario } from '../../../types/tipos';

export const agregarAsignacion = (reporte: Reporte, usuario: Usuario | null | undefined): HistorialAsignacion[] => {
  const historialActual = reporte.historialAsignaciones || [];
  
  // Marcar todas las asignaciones anteriores como no actuales
  const historialActualizado = historialActual.map(asignacion => ({
    ...asignacion,
    esActual: false
  }));

  // Agregar la nueva asignación
  const nuevaAsignacion: HistorialAsignacion = {
    id: crypto.randomUUID(),
    usuario: usuario || null,
    fechaAsignacion: new Date(),
    fechaCreacion: new Date(),
    esActual: true
  };

  return [...historialActualizado, nuevaAsignacion];
};

export const obtenerHistorialPorReporte = (reporte: Reporte): HistorialAsignacion[] => {
  return reporte.historialAsignaciones || [];
};

export const obtenerAsignacionActual = (reporte: Reporte): HistorialAsignacion | undefined => {
  return reporte.historialAsignaciones?.find(asignacion => asignacion.esActual);
}; 