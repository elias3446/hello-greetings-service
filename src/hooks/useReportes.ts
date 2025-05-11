import React from 'react';
import { Reporte } from '@/types/tipos';
import { sortReports } from '@/controller/CRUD/reportController';
import { getFieldValue, formatDate, getFullName } from '@/utils/reportes';

export const useReportesState = () => {
  const [reportes, setReportes] = React.useState<Reporte[]>([]);
  const [filteredReportes, setFilteredReportes] = React.useState<Reporte[]>([]);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [estadoFilter, setEstadoFilter] = React.useState<string | null>(null);
  const [categoriaFilter, setCategoriaFilter] = React.useState<string | null>(null);
  const [sortBy, setSortBy] = React.useState<string>('titulo');
  const [sortDirection, setSortDirection] = React.useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = React.useState(1);
  const [isLoading, setIsLoading] = React.useState(true);
  const [showDeleteDialog, setShowDeleteDialog] = React.useState(false);
  const [reporteAEliminar, setReporteAEliminar] = React.useState<Reporte | null>(null);
  const [currentField, setCurrentField] = React.useState<string | undefined>();
  const [selectedFilterValues, setSelectedFilterValues] = React.useState<any[]>([]);

  return {
    reportes,
    setReportes,
    filteredReportes,
    setFilteredReportes,
    searchTerm,
    setSearchTerm,
    estadoFilter,
    setEstadoFilter,
    categoriaFilter,
    setCategoriaFilter,
    sortBy,
    setSortBy,
    sortDirection,
    setSortDirection,
    currentPage,
    setCurrentPage,
    isLoading,
    setIsLoading,
    showDeleteDialog,
    setShowDeleteDialog,
    reporteAEliminar,
    setReporteAEliminar,
    currentField,
    setCurrentField,
    selectedFilterValues,
    setSelectedFilterValues,
  };
};

export const useReportesData = (
  reportes: Reporte[],
  searchTerm: string,
  sortBy: string,
  sortDirection: 'asc' | 'desc',
  selectedFilterValues: any[]
) => {
  return React.useMemo(() => {
    let result = [...reportes];

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        reporte => reporte.titulo.toLowerCase().includes(term) ||
                reporte.ubicacion.direccion.toLowerCase().includes(term) ||
                getFullName(reporte).toLowerCase().includes(term) ||
                reporte.estado.nombre.toLowerCase().includes(term) ||
                reporte.estado.id.toString().toLowerCase().includes(term) ||
                (reporte.categoria?.nombre || 'Sin categoría').toLowerCase().includes(term) ||
                reporte.activo.toString().toLowerCase().includes(term) ||
                formatDate(reporte.fechaCreacion).toLowerCase().includes(term)
      );
    }

    const filterValues = selectedFilterValues.filter(value => !value.includes(':'));
    const filterStates = selectedFilterValues.filter(value => value.startsWith('estado:')).map(value => value.split(':')[1]);
    const filterCategories = selectedFilterValues.filter(value => value.startsWith('categoria:')).map(value => value.split(':')[1]);
    const filterActives = selectedFilterValues.filter(value => value.startsWith('activo:')).map(value => value.split(':')[1]);
    
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
        filterCategories.includes(reporte.categoria?.nombre || 'Sin categoría')
      );
    }

    if (filterActives.length > 0) {
      result = result.filter(reporte => 
        filterActives.includes(reporte.activo.toString())
      );
    }


    return sortReports(result, sortBy, sortDirection);
  }, [reportes, searchTerm, sortBy, sortDirection, selectedFilterValues]);
};

export const usePagination = (items: Reporte[], itemsPerPage: number) => {
  const [currentPage, setCurrentPage] = React.useState(1);
  const totalPages = Math.ceil(items.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = items.slice(indexOfFirstItem, indexOfLastItem);

  return {
    currentPage,
    setCurrentPage,
    totalPages,
    currentItems,
  };
}; 