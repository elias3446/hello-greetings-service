import { Reporte } from '@/types/tipos';

export const exportToCSV = (reportes: Reporte[]) => {
  const data = reportes.map(reporte => ({
    titulo: reporte.titulo,
    categoria: reporte.categoria.nombre,
    estado: reporte.estado.nombre,
    fechaCreacion: new Date(reporte.fechaCreacion).toLocaleDateString('es-ES'),
    ubicacion: reporte.ubicacion.direccion,
    asignadoA: reporte.asignadoA?.nombre || 'Sin asignar'
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