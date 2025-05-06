import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Table, TableHeader, TableBody, TableRow, TableHead } from '@/components/ui/table';
import { Reporte } from '@/types/tipos';
import { toast } from '@/components/ui/sonner';
import { getReports, deleteReport } from '@/controller/CRUD/reportController';
import SearchFilterBar from '@/components/layout/SearchFilterBar';
import { registrarCambioEstadoReporte } from '@/controller/CRUD/historialEstadosReporte';
import { registrarCambioEstado } from '@/controller/CRUD/historialEstadosUsuario';
import { SortOption, FilterOption } from '@/types/reportes';
import { getFieldValue } from '@/utils/reportes';
import { exportToCSV } from '@/utils/reportes';
import { useReportesState, useReportesData, usePagination } from '@/hooks/useReportes';
import { ReportesTable } from '@/components/reportes/ReportesTable';
import { ReportesPagination } from '@/components/reportes/ReportesPagination';
import { DeleteConfirmationDialog } from '@/components/reportes/DeleteConfirmationDialog';

const ITEMS_PER_PAGE = 10;

const ListaReportesAdmin: React.FC = () => {
  const navigate = useNavigate();
  const {
    reportes,
    setReportes,
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
  } = useReportesState();

  const filteredData = useReportesData(reportes, searchTerm, sortBy, sortDirection, selectedFilterValues);
  const { currentPage, setCurrentPage, totalPages, currentItems } = usePagination(filteredData, ITEMS_PER_PAGE);

  const sortOptions: SortOption[] = [
    { value: 'titulo', label: 'Título' },
    { value: 'ubicacion', label: 'Ubicación' },
    { value: 'asignadoA', label: 'Asignado a' },
    { value: 'fechaCreacion', label: 'Fecha creación' }
  ];

  const filterOptions: FilterOption[] = [
    { value: 'estado', label: 'Estado' },
    { value: 'categoria', label: 'Categoría' }
  ];

  React.useEffect(() => {
    setIsLoading(true);
    try {
      const data = getReports();
      setReportes(data);
      setFilteredReportes(data);
    } catch (error) {
      toast.error("Error al cargar reportes");
    } finally {
      setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    setFilteredReportes(filteredData);
    setCurrentPage(1);
  }, [filteredData]);

  const confirmarEliminacion = async () => {
    try {
      if (!reporteAEliminar) return;
      
      const reportesAsignados = getReports().filter(reporte => 
        reporte.asignadoA && reporte.asignadoA.id === reporteAEliminar.id
      );

      await registrarCambioEstado(
        reporteAEliminar.asignadoA,
        reporteAEliminar.estado.nombre,
        'eliminado',
        reporteAEliminar.asignadoA,
        'Reporte eliminado del sistema',
        'otro'
      );

      for (const reporte of reportesAsignados) {
        await registrarCambioEstadoReporte(
          reporte,
          getFieldValue(reporteAEliminar, 'asignadoA'),
          'Sin asignar',
          reporteAEliminar.asignadoA,
          'Reporte eliminado del sistema',
          'asignacion_reporte'
        );
      }

      const success = deleteReport(reporteAEliminar.id);
      
      if (success) {
        setReportes(prevReportes => prevReportes.filter(reporte => reporte.id !== reporteAEliminar.id));
        setFilteredReportes(prevReportes => prevReportes.filter(reporte => reporte.id !== reporteAEliminar.id));
        toast.success(`Reporte ${reporteAEliminar.titulo} eliminado correctamente`);
      } else {
        throw new Error('Error al eliminar el reporte');
      }
    } catch (error) {
      console.error('Error al eliminar el reporte:', error);
      toast.error('Error al eliminar el reporte');
    } finally {
      setShowDeleteDialog(false);
      setReporteAEliminar(null);
    }
  };

  const handleToggleSortDirection = () => {
    setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
  };

  const handleFilterChange = (values: any[]) => {
    setSelectedFilterValues(values);
  };

  const handleDeleteReporte = (reporte: Reporte) => {
    setReporteAEliminar(reporte);
    setShowDeleteDialog(true);
  };

  const handleEditReporte = (id: string) => {
    navigate(`/admin/reportes/${id}/editar`);
  };

  const handleExportReportes = () => {
    exportToCSV(filteredData);
  };

  return (
    <div>
      <div className="space-y-4">
        <SearchFilterBar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          statusFilter={estadoFilter}
          onStatusFilterChange={setEstadoFilter}
          roleFilter={categoriaFilter}
          onRoleFilterChange={setCategoriaFilter}
          sortBy={sortBy}
          onSortByChange={setSortBy}
          sortDirection={sortDirection}
          onSortDirectionChange={handleToggleSortDirection}
          currentField={currentField}
          onCurrentFieldChange={setCurrentField}
          onFilterChange={handleFilterChange}
          onExport={handleExportReportes}
          onNewItem={() => navigate('/admin/reportes/nuevo')}
          items={reportes}
          getFieldValue={getFieldValue}
          showNewButton={true}
          newButtonLabel="Nuevo Reporte"
          showExportButton={true}
          sortOptions={sortOptions}
          filteredCount={filteredData.length}
          totalCount={reportes.length}
          itemLabel="reportes"
          filterOptions={filterOptions}
        />

        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Título</TableHead>
                <TableHead>Categoría</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead>Ubicación</TableHead>
                <TableHead>Asignado a</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <ReportesTable
                reportes={currentItems}
                isLoading={isLoading}
                onEdit={handleEditReporte}
                onDelete={handleDeleteReporte}
              />
            </TableBody>
          </Table>
        </div>

        <ReportesPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>

      <DeleteConfirmationDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={confirmarEliminacion}
        reporte={reporteAEliminar}
      />
    </div>
  );
};

export default ListaReportesAdmin;
