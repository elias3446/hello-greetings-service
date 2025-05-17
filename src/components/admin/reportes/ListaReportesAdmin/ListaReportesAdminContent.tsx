import { Reporte } from '@/types/tipos';
import { getEstados } from '@/controller/CRUD/estado/estadoController';
import { SearchFilterBar } from '@/components/SearchFilterBar/SearchFilterBar';
import BulkActions from '@/components/admin/reportes/ListaReportesAdmin/BulkActions';
import ReportsTable from '@/components/admin/reportes/ListaReportesAdmin/ReportsTable';
import DeleteDialog from '@/components/admin/reportes/ListaReportesAdmin/DeleteDialog';
import Pagination from '@/components/layout/Pagination';
import { ListaReportesAdminContentProps } from '@/props/admin/report/PropListaReportesAdmin';

const ListaReportesAdminContent = ({
  state,
  setState,
  ATTRIBUTES,
  PROPERTY_FILTERS,
  isAllSelected,
  isSomeSelected,
  handleFilterChange,
  handleSelectReporte,
  handleSelectAll,
  handlePageChange,
  handleExport,
  handleNavigate,
  handleBulkCategoriaUpdate,
  handleBulkEstadoUpdate,
  handleBulkAsignacionUpdate,
  handleBulkPrioridadUpdate,
  handleBulkActivoUpdate,
  handleBulkDelete,
  handleDeleteReporte,
  handleCategoriaChange,
  handleEstadoChange,
  handleAsignacionChange,
  confirmarEliminacion,
  navigate,
  itemsPerPage
}: ListaReportesAdminContentProps) => {
  const { filteredData, currentPage, isLoading } = state;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const handleReporteNavigate = (path: string) => {
    navigate(path);
  };

  const handleNewReport = () => {
    navigate('/admin/reportes/nuevo');
  };

  return (
    <div className="space-y-6">
      <SearchFilterBar
        data={state.reportes}
        onFilterChange={handleFilterChange}
        attributes={ATTRIBUTES}
        propertyFilters={PROPERTY_FILTERS}
        searchPlaceholder="Buscar reportes..."
        resultLabel="reportes"
        exportLabel="Exportar CSV"
        exportFunction={handleExport}
        navigateFunction={handleNewReport}
        navigateLabel="Nuevo Reporte"
      />

      {state.selectedReportes.size > 0 && (
        <BulkActions
          selectedReportes={state.selectedReportes}
          selectedCategoriaId={state.selectedCategoriaId}
          selectedEstado={state.selectedEstado}
          selectedUsuarioId={state.selectedUsuarioId}
          selectedPrioridadId={state.selectedPrioridadId}
          selectedActivo={state.selectedActivo}
          onCategoriaChange={(value) => setState({ selectedCategoriaId: value })}
          onEstadoChange={(value) => {
            const estado = getEstados().find(e => e.id === value);
            if (estado) setState({ selectedEstado: estado });
          }}
          onUsuarioChange={(value) => setState({ selectedUsuarioId: value })}
          onPrioridadChange={(value) => setState({ selectedPrioridadId: value })}
          onActivoChange={(value) => setState({ selectedActivo: value === 'activo' })}
          onBulkCategoriaUpdate={handleBulkCategoriaUpdate}
          onBulkEstadoUpdate={handleBulkEstadoUpdate}
          onBulkAsignacionUpdate={handleBulkAsignacionUpdate}
          onBulkPrioridadUpdate={handleBulkPrioridadUpdate}
          onBulkActivoUpdate={handleBulkActivoUpdate}
          onBulkDelete={handleBulkDelete}
          onCancel={() => {
            setState({ selectedReportes: new Set() });
            setState({ selectedCategoriaId: '' });
            setState({ selectedEstado: getEstados()[0] });
            setState({ selectedUsuarioId: '' });
            setState({ selectedPrioridadId: '' });
            setState({ selectedActivo: true });
          }}
        />
      )}

      <ReportsTable
        isLoading={isLoading}
        filteredData={filteredData}
        currentItems={currentItems}
        selectedReportes={state.selectedReportes}
        isAllSelected={isAllSelected}
        isSomeSelected={isSomeSelected}
        onSelectReporte={handleSelectReporte}
        onSelectAll={handleSelectAll}
        onNavigate={handleReporteNavigate}
        onDeleteReporte={handleDeleteReporte}
        onCategoriaChange={handleCategoriaChange}
        onEstadoChange={handleEstadoChange}
        onAsignacionChange={handleAsignacionChange}
      />

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        totalItems={filteredData.length}
        itemsPerPage={itemsPerPage}
      />

      <DeleteDialog
        showDeleteDialog={state.showDeleteDialog}
        reporteAEliminar={state.reporteAEliminar}
        reportesAEliminar={state.reportesAEliminar}
        onOpenChange={(open) => setState({ showDeleteDialog: open })}
        onConfirm={confirmarEliminacion}
      />
    </div>
  );
};

export default ListaReportesAdminContent; 