import React from 'react';
import { Reporte } from '@/types/tipos';

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