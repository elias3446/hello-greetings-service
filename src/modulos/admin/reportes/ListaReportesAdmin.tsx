import { Component } from 'react';
import { Reporte } from '@/types/tipos';
import { toast } from '@/components/ui/sonner';
import { exportToCSV } from '@/utils/reportes';
import { ListaReportesAdminProps, ListaReportesAdminState } from '@/props/admin/report/PropListaReportesAdmin';
import ListaReportesAdminContent from '@/components/admin/reportes/ListaReportesAdmin/ListaReportesAdminContent';
import {
  ATTRIBUTES,
  PROPERTY_FILTERS,
  getInitialState,
  loadReportes,
  handleBulkEstadoUpdate,
  handleBulkCategoriaUpdate,
  handleBulkAsignacionUpdate,
  handleBulkActivoUpdate,
  handleBulkPrioridadUpdate,
  confirmarEliminacion,
  handleCategoriaChange,
  handleEstadoChange,
  handleAsignacionChange
} from '@/constants/admin/report/ListaReportesAdminLogic';

const itemsPerPage = 5;

class ListaReportesAdmin extends Component<ListaReportesAdminProps, ListaReportesAdminState> {
  
  private readonly ATTRIBUTES = ATTRIBUTES;
  private readonly PROPERTY_FILTERS = PROPERTY_FILTERS;

  constructor(props: ListaReportesAdminProps) {
    super(props);
    this.state = getInitialState();
  }

  componentDidMount() {
    this.loadReportes();
  }

  loadReportes = async () => {
    await loadReportes(this.setState.bind(this));
  };

  get isAllSelected(): boolean {
    return this.state.filteredData.length > 0 && 
      this.state.filteredData.every(reporte => this.state.selectedReportes.has(reporte.id));
  }

  get isSomeSelected(): boolean {
    return this.state.filteredData.some(reporte => this.state.selectedReportes.has(reporte.id));
  }

  handleSelectReporte = (reporteId: string, checked: boolean) => {
    this.setState(prev => {
      const newSelected = new Set(prev.selectedReportes);
      if (checked) {
        newSelected.add(reporteId);
      } else {
        newSelected.delete(reporteId);
      }
      return { selectedReportes: newSelected };
    });
  };

  handleSelectAll = (checked: boolean) => {
    if (checked) {
      this.setState({ selectedReportes: new Set(this.state.filteredData.map(reporte => reporte.id)) });
    } else {
      this.setState({ selectedReportes: new Set() });
    }
  };

  handlePageChange = (page: number) => {
    const totalPages = Math.ceil(this.state.filteredData.length / itemsPerPage);
    if (page >= 1 && page <= totalPages) {
      this.setState({ currentPage: page });
    }
  };

  handleFilterChange = (newData: any[], filters: any) => {
    this.setState({ 
      filteredData: newData,
      currentPage: 1 
    });
  };

  handleBulkEstadoUpdate = async () => {
    await handleBulkEstadoUpdate(this.state, this.setState.bind(this));
  };

  handleBulkCategoriaUpdate = async () => {
    await handleBulkCategoriaUpdate(this.state, this.setState.bind(this));
  };

  handleBulkAsignacionUpdate = async () => {
    await handleBulkAsignacionUpdate(this.state, this.setState.bind(this));
  };

  handleBulkActivoUpdate = async () => {
    await handleBulkActivoUpdate(this.state, this.setState.bind(this));
  };

  handleBulkPrioridadUpdate = async () => {
    await handleBulkPrioridadUpdate(this.state, this.setState.bind(this));
  };

  handleBulkDelete = () => {
    const reportesSeleccionados = this.state.reportes.filter(reporte => this.state.selectedReportes.has(reporte.id));
    this.setState({ 
      reportesAEliminar: reportesSeleccionados,
      reporteAEliminar: null,
      showDeleteDialog: true 
    });
  };

  handleDeleteReporte = (reporte: Reporte) => {
    this.setState({ 
      reporteAEliminar: reporte,
      reportesAEliminar: [],
      showDeleteDialog: true 
    });
  };

  handleCancelDelete = () => {
    this.setState({ 
      reporteAEliminar: null, 
      reportesAEliminar: [], 
      showDeleteDialog: false 
    });
  };

  confirmarEliminacion = async () => {
    await confirmarEliminacion(this.state, this.setState.bind(this));
    this.handleCancelDelete();
    
    // Actualizar la lista de reportes después de la eliminación
    const updatedReportes = this.state.reportes.filter(reporte => 
      !this.state.reportesAEliminar.some(r => r.id === reporte.id) && 
      reporte.id !== this.state.reporteAEliminar?.id
    );
    
    this.setState({
      reportes: updatedReportes,
      filteredData: updatedReportes,
      selectedReportes: new Set()
    });
  };

  handleExport = (data: any[]) => {
    try {
      exportToCSV(data);
      toast.success(`Se han exportado ${data.length} registros en formato CSV`);
    } catch (error) {
      console.error("Error al exportar:", error);
      toast.error("No se pudo completar la exportación de datos");
    }
  };

  handleNavigate = () => {
    this.props.navigate('/admin/reportes/nuevo');
  };

  handleCategoriaChange = async (reporte: Reporte, value: string) => {
    await handleCategoriaChange(reporte, value, this.state, this.setState.bind(this));
  };

  handleEstadoChange = async (reporte: Reporte, value: string) => {
    await handleEstadoChange(reporte, value, this.state, this.setState.bind(this));
  };

  handleAsignacionChange = async (reporte: Reporte, value: string) => {
    await handleAsignacionChange(reporte, value, this.state, this.setState.bind(this));
  };

  render() {
  return (
      <ListaReportesAdminContent
        state={this.state}
        setState={this.setState.bind(this)}
        ATTRIBUTES={this.ATTRIBUTES}
        PROPERTY_FILTERS={this.PROPERTY_FILTERS}
        isAllSelected={this.isAllSelected}
        isSomeSelected={this.isSomeSelected}
        handleFilterChange={this.handleFilterChange}
        handleSelectReporte={this.handleSelectReporte}
        handleSelectAll={this.handleSelectAll}
        handlePageChange={this.handlePageChange}
        handleExport={this.handleExport}
        handleNavigate={this.handleNavigate}
        handleBulkCategoriaUpdate={this.handleBulkCategoriaUpdate}
        handleBulkEstadoUpdate={this.handleBulkEstadoUpdate}
        handleBulkAsignacionUpdate={this.handleBulkAsignacionUpdate}
        handleBulkPrioridadUpdate={this.handleBulkPrioridadUpdate}
        handleBulkActivoUpdate={this.handleBulkActivoUpdate}
        handleBulkDelete={this.handleBulkDelete}
        handleDeleteReporte={this.handleDeleteReporte}
        handleCategoriaChange={this.handleCategoriaChange}
        handleEstadoChange={this.handleEstadoChange}
        handleAsignacionChange={this.handleAsignacionChange}
        confirmarEliminacion={this.confirmarEliminacion}
        navigate={this.props.navigate}
        itemsPerPage={itemsPerPage}
      />
    );
  }
}

export default ListaReportesAdmin;
