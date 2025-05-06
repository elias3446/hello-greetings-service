import { Reporte } from '../../types/tipos';
import { reportes } from '../../data/reportes';
import { agregarAsignacion } from './historialAsignacionController';

// Obtener todos los reportes
export const getReports = (): Reporte[] => {
  return [...reportes]; // Devuelve una copia para evitar modificaciones accidentales
};

// Obtener un reporte por ID
export const getReportById = (id: string): Reporte | undefined => {
  return reportes.find((report) => report.id === id);
};

// Crear un nuevo reporte
export const createReport = (reportData: Omit<Reporte, 'id'>): Reporte => {
  const newReport: Reporte = {
    id: crypto.randomUUID(),
    ...reportData
  };
  reportes.push(newReport);
  return newReport;
};

// Actualizar un reporte
export const updateReport = (id: string, reportData: Partial<Reporte>): Reporte | undefined => {
  const index = reportes.findIndex((report) => report.id === id);
  if (index !== -1) {
    const reporte = reportes[index];
    
    // Si se está actualizando el usuario asignado, actualizar el historial
    if ('asignadoA' in reportData) {
      const historialActualizado = agregarAsignacion(reporte, reportData.asignadoA);
      reportData.historialAsignaciones = historialActualizado;
    }
    
    const updatedReport = { ...reporte, ...reportData };
    reportes[index] = updatedReport;
    return updatedReport;
  }
  return undefined;
};

// Eliminar un reporte
export const deleteReport = (id: string): boolean => {
  const index = reportes.findIndex((report) => report.id === id);
  if (index !== -1) {
    reportes.splice(index, 1);
    return true;
  }
  return false;
};

// Filtrar reportes por criterios
export const filterReports = (criteria: {
  search?: string;
  categoryId?: string;
  statusId?: string;
  userId?: string;
}): Reporte[] => {
  let filteredReports = [...reportes];
  
  if (criteria.search) {
    const term = criteria.search.toLowerCase();
    filteredReports = filteredReports.filter(
      report => report.titulo.toLowerCase().includes(term) ||
               (report.categoria?.nombre || '').toLowerCase().includes(term) ||
               (report.estado?.nombre || '').toLowerCase().includes(term) ||
               (report.ubicacion?.direccion || '').toLowerCase().includes(term) ||
               (report.asignadoA?.nombre || '').toLowerCase().includes(term)
    );
  }
  
  if (criteria.categoryId) {
    filteredReports = filteredReports.filter(report => report.categoria.id === criteria.categoryId);
  }
  
  if (criteria.statusId) {
    filteredReports = filteredReports.filter(report => report.estado.id === criteria.statusId);
  }
  
  if (criteria.userId) {
    filteredReports = filteredReports.filter(report => {
      console.log('Comparando IDs de usuario:', {
        userId: criteria.userId,
        asignadoAId: report.asignadoA?.id,
        iguales: String(criteria.userId) === String(report.asignadoA?.id)
      });
      return String(criteria.userId) === String(report.asignadoA?.id);
    });
  }
  
  return filteredReports;
};

// Ordenar reportes
export const sortReports = (reports: Reporte[], sortBy: string, direction: 'asc' | 'desc'): Reporte[] => {
  const sortedReports = [...reports];
  
  sortedReports.sort((a, b) => {
    let comparison = 0;
    
    switch (sortBy) {
      case 'titulo':
        comparison = a.titulo.localeCompare(b.titulo);
        break;
      case 'categoria':
        comparison = (a.categoria?.nombre || '').localeCompare(b.categoria?.nombre || '');
        break;
      case 'estado':
        comparison = (a.estado?.nombre || '').localeCompare(b.estado?.nombre || '');
        break;
      case 'ubicacion':
        comparison = (a.ubicacion?.direccion || '').localeCompare(b.ubicacion?.direccion || '');
        break;
      case 'asignadoA':
        comparison = (a.asignadoA?.nombre || '').localeCompare(b.asignadoA?.nombre || '');
        break;
      case 'fecha':
        const fechaA = a.fechaCreacion instanceof Date ? a.fechaCreacion : new Date(a.fechaCreacion);
        const fechaB = b.fechaCreacion instanceof Date ? b.fechaCreacion : new Date(b.fechaCreacion);
        comparison = fechaA.getTime() - fechaB.getTime();
        break;
      default:
        comparison = 0;
    }

    return direction === 'asc' ? comparison : -comparison;
  });
  
  return sortedReports;
};
