import React from 'react';
import { Reporte } from '@/types/tipos';
import { sortReports } from '@/controller/CRUD/reportController';

export const useReportesFiltering = (
  reportes: Reporte[],
  searchTerm: string,
  sortBy: string,
  sortDirection: 'asc' | 'desc',
  selectedFilterValues: any[]
) => {
  const getFieldValue = (reporte: Reporte, field: string): string => {
    switch (field) {
      case 'titulo':
        return reporte.titulo;
      case 'ubicacion':
        return reporte.ubicacion.direccion;
      case 'asignadoA':
        return reporte.asignadoA?.nombre || 'Sin asignar';
      case 'fechaCreacion':
        return new Date(reporte.fechaCreacion).toLocaleDateString('es-ES');
      case 'estado':
        return reporte.estado.nombre;
      case 'categoria':
        return reporte.categoria.nombre;
      default:
        return '';
    }
  };

  const filteredReportes = React.useMemo(() => {
    let result = [...reportes];

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        reporte => reporte.titulo.toLowerCase().includes(term) ||
                reporte.ubicacion.direccion.toLowerCase().includes(term) ||
                reporte.asignadoA?.nombre.toLowerCase().includes(term) ||
                reporte.estado.nombre.toLowerCase().includes(term) ||
                reporte.estado.id.toString().toLowerCase().includes(term) ||
                reporte.categoria.nombre.toLowerCase().includes(term) ||
                reporte.fechaCreacion.toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' }).toLowerCase().includes(term)
      );
    }

    const filterValues = selectedFilterValues.filter(value => !value.includes(':'));
    const filterStates = selectedFilterValues.filter(value => value.startsWith('estado:')).map(value => value.split(':')[1]);
    const filterCategories = selectedFilterValues.filter(value => value.startsWith('categoria:')).map(value => value.split(':')[1]);

    if (filterValues.length > 0) {
      result = result.filter(reporte => 
        filterValues.includes(getFieldValue(reporte, sortBy))
      );
    }

    if (filterStates.length > 0) {
      result = result.filter(reporte => 
        filterStates.includes(reporte.estado.nombre)
      );
    }

    if (filterCategories.length > 0) {
      result = result.filter(reporte => 
        filterCategories.includes(reporte.categoria.nombre)
      );
    }

    return sortReports(result, sortBy, sortDirection);
  }, [reportes, searchTerm, sortBy, sortDirection, selectedFilterValues]);

  return {
    filteredReportes,
    getFieldValue,
  };
}; 