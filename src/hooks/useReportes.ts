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
  const filteredReportes = React.useMemo(() => {
    let result = [...reportes];

    // Aplicar búsqueda
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        reporte => reporte.titulo.toLowerCase().includes(term) ||
                reporte.ubicacion.direccion.toLowerCase().includes(term) ||
                reporte.asignadoA?.nombre.toLowerCase().includes(term) ||
                reporte.estado.nombre.toLowerCase().includes(term) ||
                reporte.estado.id.toString().toLowerCase().includes(term) ||
                reporte.categoria.nombre.toLowerCase().includes(term) ||
                reporte.prioridad?.nombre.toLowerCase().includes(term) ||
                reporte.fechaCreacion.toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' }).toLowerCase().includes(term)
      );
    }

    // Aplicar filtros
    if (selectedFilterValues.length > 0) {
      // Separar los valores de filtro y los valores normales
      const filterValues = selectedFilterValues.filter(value => !value.includes(':'));
      const filterStates = selectedFilterValues.filter(value => value.startsWith('estado:')).map(value => value.split(':')[1]);
      const filterCategories = selectedFilterValues.filter(value => value.startsWith('categoria:')).map(value => value.split(':')[1]);
      const filterPriorities = selectedFilterValues.filter(value => value.startsWith('prioridad:')).map(value => value.split(':')[1]);
      const filterActivo = selectedFilterValues.filter(value => value.startsWith('activo:')).map(value => value.split(':')[1]);

      console.log('Applying filters:', {
        filterValues,
        filterStates,
        filterCategories,
        filterPriorities,
        filterActivo
      });

      result = result.filter(reporte => {
        // Verificar filtros específicos
        if (filterStates.length > 0 && !filterStates.includes(reporte.estado.nombre)) {
          return false;
        }

        if (filterCategories.length > 0 && !filterCategories.includes(reporte.categoria?.nombre)) {
          return false;
        }

        if (filterPriorities.length > 0 && !filterPriorities.includes(reporte.prioridad?.nombre || 'Sin prioridad')) {
          return false;
        }

        if (filterActivo.length > 0 && !filterActivo.includes(String(reporte.activo))) {
          return false;
        }

        // Verificar valores normales
        if (filterValues.length > 0) {
          const reporteValue = getFieldValue(reporte, sortBy);
          if (!filterValues.includes(reporteValue)) {
            return false;
          }
        }

        return true;
      });
    }

    // Ordenar resultados
    if (sortBy) {
      result.sort((a, b) => {
        let aValue = getFieldValue(a, sortBy);
        let bValue = getFieldValue(b, sortBy);

        // Manejar valores nulos o indefinidos
        if (aValue === null || aValue === undefined) aValue = '';
        if (bValue === null || bValue === undefined) bValue = '';

        // Convertir a string para comparación
        aValue = String(aValue).toLowerCase();
        bValue = String(bValue).toLowerCase();

        if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return result;
  }, [reportes, searchTerm, selectedFilterValues, sortBy, sortDirection]);

  return filteredReportes;
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