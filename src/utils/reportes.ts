import { Reporte } from '@/types/tipos';

export const formatDate = (date: Date): string => {
  return new Date(date).toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
};

export const getFullName = (reporte: Reporte): string => {
  if (!reporte.asignadoA) return 'Sin asignar';
  return `${reporte.asignadoA.nombre} ${reporte.asignadoA.apellido}`.trim();
};

export const getFieldValue = (reporte: Reporte, field: string): string => {
  switch (field) {
    case 'titulo':
      return reporte.titulo;
    case 'ubicacion':
      return reporte.ubicacion.direccion;
    case 'asignadoA':
      return getFullName(reporte);
    case 'fechaCreacion':
      return formatDate(reporte.fechaCreacion);
    case 'estado':
      return reporte.estado.nombre;
    case 'categoria':
      return reporte.categoria.nombre;
    default:
      return '';
  }
};

export const exportToCSV = (reportes: Reporte[]): void => {
  const data = reportes.map(reporte => ({
    titulo: reporte.titulo,
    categoria: reporte.categoria.nombre,
    estado: reporte.estado.nombre,
    fechaCreacion: formatDate(reporte.fechaCreacion),
    ubicacion: reporte.ubicacion.direccion,
    asignadoA: getFullName(reporte)
  }));
  
  const csvContent = [
    Object.keys(data[0]).join(','),
    ...data.map(row => Object.values(row).join(','))
  ].join('\n');
  
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', 'reportes.csv');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}; 