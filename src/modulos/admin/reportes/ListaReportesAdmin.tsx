import React, { Component } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Reporte, Usuario, Categoria, EstadoReporte } from '@/types/tipos';
import { toast } from '@/components/ui/sonner';
import { obtenerReportes, obtenerReportePorId, actualizarReporte } from '@/controller/CRUD/report/reportController';
import { registrarCambioEstadoReporte } from '@/controller/CRUD/report/historialEstadosReporte';
import { registrarCambioEstado } from '@/controller/CRUD/user/historialEstadosUsuario';
import { SortOption, FilterOption } from '@/types/reportes';
import { getFieldValue } from '@/utils/reportes';
import { exportToCSV } from '@/utils/reportes';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { getCategories } from '@/controller/CRUD/category/categoryController';
import { actualizarCategoriaReporte } from '@/controller/controller/report/reportCategoryController';
import { actualizarEstadoReporte } from '@/controller/controller/report/reportStateController';
import { actualizarAsignacionReporte } from '@/controller/controller/report/reportAssignmentController';
import { eliminarReport } from '@/controller/controller/report/reportDeleteController';
import { getEstados } from '@/controller/CRUD/estado/estadoController';
import { usuarios } from '@/data/usuarios';
import { getSystemUser } from '@/utils/userUtils';
import { Pencil, Trash2 } from 'lucide-react';
import { actualizarEstadoActivoReporte } from '@/controller/controller/report/reportActiveController';
import { categorias, prioridades } from '@/data/categorias';
import { actualizarPrioridadReporte } from '@/controller/controller/report/reportPriorityController';
import Pagination from '@/components/layout/Pagination';
import { SearchFilterBar } from '@/components/SearchFilterBar/SearchFilterBar';

const itemsPerPage = 5;

interface ListaReportesAdminProps {
  navigate: (path: string) => void;
}

interface ListaReportesAdminState {
  reportes: Reporte[];
  filteredData: Reporte[];
  searchTerm: string;
  estadoFilter: string;
  categoriaFilter: string;
  sortBy: string;
  sortDirection: 'asc' | 'desc';
  isLoading: boolean;
  showDeleteDialog: boolean;
  reporteAEliminar: Reporte | null;
  currentField: string;
  selectedFilterValues: any[];
  currentPage: number;
  selectedReportes: Set<string>;
  selectedCategoriaId: string;
  selectedEstado: EstadoReporte;
  selectedUsuarioId: string;
  selectedActivo: boolean;
  reportesAEliminar: Reporte[];
  selectedPrioridadId: string;
}

class ListaReportesAdmin extends Component<ListaReportesAdminProps, ListaReportesAdminState> {
  private readonly ATTRIBUTES = [
    { label: "Título", value: "titulo", type: "string" as const },
    { 
      label: "Asignado a", 
      value: "asignadoA", 
      type: "object" as const, 
      getValue: (item: any) => item.asignadoA,
      formatValue: (value: any) => {
        if (!value) return 'No asignado';
        return `${value.nombre} ${value.apellido}`;
      }
    },
    { label: "Fecha", value: "fechaCreacion", type: "date" as const },
    { 
      label: "Ubicación", 
      value: "ubicacion", 
      type: "object" as const, 
      getValue: (item: any) => item.ubicacion,
      formatValue: (value: any) => value?.direccion || 'Sin ubicación'
    },
  ];

  private readonly PROPERTY_FILTERS = [
    { 
      label: "Activo", 
      value: "activo", 
      property: "activo", 
      type: "boolean" as const,
      formatValue: (value: boolean) => value ? 'Activo' : 'Inactivo'
    },
    { 
      label: "Categoría", 
      value: "categoria", 
      property: "categoria", 
      type: "object" as const, 
      getValue: (item: any) => {
        if (!item.categoria) return 'Sin categoría';
        return item.categoria.nombre || 'Sin categoría';
      },
      formatValue: (value: any) => {
        if (!value) return 'Sin categoría';
        if (typeof value === 'string') return value;
        return value.nombre || 'Sin categoría';
      }
    },
    { 
      label: "Estado", 
      value: "estado", 
      property: "estado", 
      type: "object" as const, 
      getValue: (item: any) => {
        if (!item.estado) return 'Sin estado';
        return item.estado.nombre || 'Sin estado';
      },
      formatValue: (value: any) => {
        if (!value) return 'Sin estado';
        if (typeof value === 'string') return value;
        return value.nombre || 'Sin estado';
      }
    },
    { 
      label: "Prioridad", 
      value: "prioridad", 
      property: "prioridad", 
      type: "object" as const, 
      getValue: (item: any) => {
        if (!item.prioridad) return 'Sin prioridad';
        return item.prioridad.nombre || 'Sin prioridad';
      },
      formatValue: (value: any) => {
        if (!value) return 'Sin prioridad';
        if (typeof value === 'string') return value;
        return value.nombre || 'Sin prioridad';
      }
    }
  ];

  constructor(props: ListaReportesAdminProps) {
    super(props);
    this.state = {
      reportes: [],
      filteredData: [],
      searchTerm: '',
      estadoFilter: '',
      categoriaFilter: '',
      sortBy: 'titulo',
      sortDirection: 'asc',
      isLoading: true,
      showDeleteDialog: false,
      reporteAEliminar: null,
      currentField: '',
      selectedFilterValues: [],
      currentPage: 1,
      selectedReportes: new Set(),
      selectedCategoriaId: '',
      selectedEstado: getEstados()[0],
      selectedUsuarioId: '',
      selectedActivo: true,
      reportesAEliminar: [],
      selectedPrioridadId: ''
    };
  }

  componentDidMount() {
    this.loadReportes();
  }

  loadReportes = async () => {
    this.setState({ isLoading: true });
    try {
      const data = obtenerReportes();
      this.setState({
        reportes: data,
        filteredData: data,
        isLoading: false
      });
    } catch (error) {
      toast.error("Error al cargar reportes");
      this.setState({ isLoading: false });
    }
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
    if (this.state.selectedReportes.size === 0) {
      toast.error('Por favor seleccione al menos un reporte');
      return;
    }

    const systemUser: Usuario = {
        id: '0',
        nombre: 'Sistema',
        apellido: '',
        email: 'sistema@example.com',
        estado: 'activo',
        tipo: 'usuario',
        intentosFallidos: 0,
        password: 'hashed_password',
        roles: [{
          id: '1',
          nombre: 'Administrador',
          descripcion: 'Rol con acceso total al sistema',
          color: '#FF0000',
          tipo: 'admin',
          fechaCreacion: new Date('2023-01-01'),
          activo: true
        }],
        fechaCreacion: new Date('2023-01-01'),
      };

    let successCount = 0;
    let errorCount = 0;
    let skippedCount = 0;

    for (const reporteId of this.state.selectedReportes) {
      try {
        const reporte = this.state.reportes.find(r => r.id === reporteId);
        if (!reporte) continue;

        if (!reporte.activo) {
          skippedCount++;
          continue;
        }

        const success = await actualizarEstadoReporte(reporte, this.state.selectedEstado, systemUser);
        if (success) {
          successCount++;
          this.setState(prev => ({
            reportes: prev.reportes.map(r => 
              r.id === reporteId ? { ...r, estado: this.state.selectedEstado } : r
            ),
            filteredData: prev.filteredData.map(r => 
              r.id === reporteId ? { ...r, estado: this.state.selectedEstado } : r
            )
          }));
        } else {
          errorCount++;
        }
      } catch (error) {
        console.error(`Error al actualizar el estado del reporte ${reporteId}:`, error);
        errorCount++;
      }
    }

    if (successCount > 0) {
      toast.success(`Se actualizaron ${successCount} reportes correctamente`);
    }
    if (errorCount > 0) {
      toast.error(`Hubo errores al actualizar ${errorCount} reportes`);
    }
    if (skippedCount > 0) {
      toast.info(`${skippedCount} reportes inactivos fueron omitidos`);
    }

    this.setState({ selectedReportes: new Set() });
    this.setState({ selectedEstado: getEstados()[0] });
  };

  handleBulkCategoriaUpdate = async () => {
    if (!this.state.selectedCategoriaId || this.state.selectedReportes.size === 0) {
      toast.error('Por favor seleccione una categoría y al menos un reporte');
      return;
    }

    const systemUser: Usuario = {
        id: '0',
        nombre: 'Sistema',
        apellido: '',
        email: 'sistema@example.com',
        estado: 'activo',
        tipo: 'usuario',
        intentosFallidos: 0,
        password: 'hashed_password',
        roles: [{
          id: '1',
          nombre: 'Administrador',
          descripcion: 'Rol con acceso total al sistema',
          color: '#FF0000',
          tipo: 'admin',
          fechaCreacion: new Date('2023-01-01'),
          activo: true
        }],
        fechaCreacion: new Date('2023-01-01'),
      };

    let successCount = 0;
    let errorCount = 0;
    let skippedCount = 0;

    for (const reporteId of this.state.selectedReportes) {
      try {
        const reporte = this.state.reportes.find(r => r.id === reporteId);
        if (!reporte) continue;

        if (!reporte.activo) {
          skippedCount++;
          continue;
        }

        const nuevaCategoria = getCategories().find(c => c.id === this.state.selectedCategoriaId);
        if (!nuevaCategoria) continue;

        const success = await actualizarCategoriaReporte(reporte, nuevaCategoria, systemUser);
        if (success) {
          successCount++;
          this.setState(prev => ({
            reportes: prev.reportes.map(r => 
              r.id === reporteId ? { ...r, categoria: nuevaCategoria } : r
            ),
            filteredData: prev.filteredData.map(r => 
              r.id === reporteId ? { ...r, categoria: nuevaCategoria } : r
            )
          }));
        } else {
          errorCount++;
        }
      } catch (error) {
        console.error(`Error al actualizar la categoría del reporte ${reporteId}:`, error);
        errorCount++;
      }
    }

    if (successCount > 0) {
      toast.success(`Se actualizaron ${successCount} reportes correctamente`);
    }
    if (errorCount > 0) {
      toast.error(`Hubo errores al actualizar ${errorCount} reportes`);
    }
    if (skippedCount > 0) {
      toast.info(`${skippedCount} reportes inactivos fueron omitidos`);
    }

    this.setState({ selectedReportes: new Set() });
    this.setState({ selectedCategoriaId: '' });
    this.setState({ selectedEstado: getEstados()[0] });
  };

  handleBulkAsignacionUpdate = async () => {
    if (this.state.selectedReportes.size === 0) {
      toast.error('Por favor seleccione al menos un reporte');
      return;
    }

    const systemUser: Usuario = {
      id: '0',
      nombre: 'Sistema',
      apellido: '',
      email: 'sistema@example.com',
      estado: 'activo',
      tipo: 'usuario',
      intentosFallidos: 0,
      password: 'hashed_password',
      roles: [{
        id: '1',
        nombre: 'Administrador',
        descripcion: 'Rol con acceso total al sistema',
        color: '#FF0000',
        tipo: 'admin',
        fechaCreacion: new Date('2023-01-01'),
        activo: true
      }],
      fechaCreacion: new Date('2023-01-01'),
    };

    let successCount = 0;
    let errorCount = 0;
    let skippedCount = 0;

    for (const reporteId of this.state.selectedReportes) {
      try {
        const reporte = this.state.reportes.find(r => r.id === reporteId);
        if (!reporte) continue;

        if (!reporte.activo) {
          skippedCount++;
          continue;
        }

        const nuevoUsuario = this.state.selectedUsuarioId === 'none' ? null : usuarios.find(u => u.id === this.state.selectedUsuarioId);
        if (!nuevoUsuario && this.state.selectedUsuarioId !== 'none') continue;

        const success = await actualizarAsignacionReporte(reporte, nuevoUsuario || systemUser, systemUser);
        if (success) {
          successCount++;
          this.setState(prev => ({
            reportes: prev.reportes.map(r => 
              r.id === reporteId ? { ...r, asignadoA: nuevoUsuario || undefined } : r
            ),
            filteredData: prev.filteredData.map(r => 
              r.id === reporteId ? { ...r, asignadoA: nuevoUsuario || undefined } : r
            )
          }));
        } else {
          errorCount++;
        }
      } catch (error) {
        console.error(`Error al actualizar la asignación del reporte ${reporteId}:`, error);
        errorCount++;
      }
    }

    if (successCount > 0) {
      toast.success(`Se actualizaron ${successCount} reportes correctamente`);
    }
    if (errorCount > 0) {
      toast.error(`Hubo errores al actualizar ${errorCount} reportes`);
    }
    if (skippedCount > 0) {
      toast.info(`${skippedCount} reportes inactivos fueron omitidos`);
    }

    this.setState({ selectedReportes: new Set() });
    this.setState({ selectedUsuarioId: '' });
  };

  handleBulkActivoUpdate = async () => {
    if (this.state.selectedReportes.size === 0) {
      toast.error('Por favor seleccione al menos un reporte');
      return;
    }

    const systemUser: Usuario = {
      id: '0',
      nombre: 'Sistema',
      apellido: '',
      email: 'sistema@example.com',
      estado: 'activo',
      tipo: 'usuario',
      intentosFallidos: 0,
      password: 'hashed_password',
      roles: [{
        id: '1',
        nombre: 'Administrador',
        descripcion: 'Rol con acceso total al sistema',
        color: '#FF0000',
        tipo: 'admin',
        fechaCreacion: new Date('2023-01-01'),
        activo: true
      }],
      fechaCreacion: new Date('2023-01-01'),
    };

    let successCount = 0;
    let errorCount = 0;

    for (const reporteId of this.state.selectedReportes) {
      try {
        const reporte = this.state.reportes.find(r => r.id === reporteId);
        if (!reporte) continue;

        const success = await actualizarEstadoActivoReporte(reporte, this.state.selectedActivo, systemUser);
        if (success) {
          successCount++;
          this.setState(prev => ({
            reportes: prev.reportes.map(r => 
              r.id === reporteId ? { ...r, activo: this.state.selectedActivo } : r
            ),
            filteredData: prev.filteredData.map(r => 
              r.id === reporteId ? { ...r, activo: this.state.selectedActivo } : r
            )
          }));
        } else {
          errorCount++;
        }
      } catch (error) {
        console.error(`Error al actualizar el estado activo del reporte ${reporteId}:`, error);
        errorCount++;
      }
    }

    if (successCount > 0) {
      toast.success(`Se ${this.state.selectedActivo ? 'activaron' : 'desactivaron'} ${successCount} reportes correctamente`);
    }
    if (errorCount > 0) {
      toast.error(`Hubo errores al actualizar ${errorCount} reportes`);
    }

    this.setState({ selectedReportes: new Set() });
    this.setState({ selectedActivo: true });
  };

  handleBulkPrioridadUpdate = async () => {
    if (this.state.selectedReportes.size === 0) {
      toast.error('Por favor seleccione al menos un reporte');
      return;
    }

    const systemUser: Usuario = {
      id: '0',
      nombre: 'Sistema',
      apellido: '',
      email: 'sistema@example.com',
      estado: 'activo',
      tipo: 'usuario',
      intentosFallidos: 0,
      password: 'hashed_password',
      roles: [{
        id: '1',
        nombre: 'Administrador',
        descripcion: 'Rol con acceso total al sistema',
        color: '#FF0000',
        tipo: 'admin',
        fechaCreacion: new Date('2023-01-01'),
        activo: true
      }],
      fechaCreacion: new Date('2023-01-01'),
    };

    let successCount = 0;
    let errorCount = 0;
    let skippedCount = 0;

    for (const reporteId of this.state.selectedReportes) {
      try {
        const reporte = this.state.reportes.find(r => r.id === reporteId);
        if (!reporte) continue;

        if (!reporte.activo) {
          skippedCount++;
          continue;
        }

        const nuevaPrioridad = this.state.selectedPrioridadId === 'none' ? undefined : prioridades.find(p => p.id === this.state.selectedPrioridadId);
        if (!nuevaPrioridad && this.state.selectedPrioridadId !== 'none') continue;

        const success = await actualizarPrioridadReporte(reporte, nuevaPrioridad, systemUser);
        if (success) {
          successCount++;
          this.setState(prev => ({
            reportes: prev.reportes.map(r => 
              r.id === reporteId ? { ...r, prioridad: nuevaPrioridad } : r
            ),
            filteredData: prev.filteredData.map(r => 
              r.id === reporteId ? { ...r, prioridad: nuevaPrioridad } : r
            )
          }));
        } else {
          errorCount++;
        }
      } catch (error) {
        console.error(`Error al actualizar la prioridad del reporte ${reporteId}:`, error);
        errorCount++;
      }
    }

    if (successCount > 0) {
      toast.success(`Se actualizaron ${successCount} reportes correctamente`);
    }
    if (errorCount > 0) {
      toast.error(`Hubo errores al actualizar ${errorCount} reportes`);
    }
    if (skippedCount > 0) {
      toast.info(`${skippedCount} reportes inactivos fueron omitidos`);
    }

    this.setState({ selectedReportes: new Set() });
    this.setState({ selectedPrioridadId: '' });
  };

  handleBulkDelete = () => {
    const reportesSeleccionados = this.state.reportes.filter(reporte => 
      this.state.selectedReportes.has(reporte.id) && reporte.activo
    );
    this.setState({ reportesAEliminar: reportesSeleccionados });
    this.setState({ showDeleteDialog: true });
  };

  handleDeleteReporte = (reporte: Reporte) => {
    this.setState({ reporteAEliminar: reporte });
    this.setState({ showDeleteDialog: true });
  };

  confirmarEliminacion = async () => {
    try {
      if (this.state.reportesAEliminar.length > 0) {
        let successCount = 0;
        let errorCount = 0;
        let skippedCount = 0;

        for (const reporte of this.state.reportesAEliminar) {
          try {
            if (!reporte.activo) {
              skippedCount++;
              continue;
            }

            const success = await eliminarReport(reporte, {
              id: '0',
              nombre: 'Sistema',
              apellido: '',
              email: 'sistema@example.com',
              estado: 'activo',
              tipo: 'usuario',
              intentosFallidos: 0,
              password: 'hashed_password',
              roles: [{
                id: '1',
                nombre: 'Administrador',
                descripcion: 'Rol con acceso total al sistema',
                color: '#FF0000',
                tipo: 'admin',
                fechaCreacion: new Date('2023-01-01'),
                activo: true
              }],
              fechaCreacion: new Date('2023-01-01'),
            });

            if (success) {
              successCount++;
              this.setState(prev => ({
                reportes: prev.reportes.filter(r => r.id !== reporte.id)
              }));
              this.setState(prev => ({
                filteredData: prev.filteredData.filter(r => r.id !== reporte.id)
              }));
            } else {
              errorCount++;
            }
          } catch (error) {
            console.error(`Error al eliminar el reporte ${reporte.id}:`, error);
            errorCount++;
          }
        }

        if (successCount > 0) {
          toast.success(`Se eliminaron ${successCount} reportes correctamente`);
        }
        if (errorCount > 0) {
          toast.error(`Hubo errores al eliminar ${errorCount} reportes`);
        }
        if (skippedCount > 0) {
          toast.info(`${skippedCount} reportes inactivos fueron omitidos`);
        }
      } else if (this.state.reporteAEliminar) {
        const success = await eliminarReport(this.state.reporteAEliminar, {
          id: '0',
          nombre: 'Sistema',
          apellido: '',
          email: 'sistema@example.com',
          estado: 'activo',
          tipo: 'usuario',
          intentosFallidos: 0,
          password: 'hashed_password',
          roles: [{
            id: '1',
            nombre: 'Administrador',
            descripcion: 'Rol con acceso total al sistema',
            color: '#FF0000',
            tipo: 'admin',
            fechaCreacion: new Date('2023-01-01'),
            activo: true
          }],
          fechaCreacion: new Date('2023-01-01'),
        });

        if (success) {
          this.setState(prev => ({
            reportes: prev.reportes.filter(reporte => reporte.id !== this.state.reporteAEliminar.id)
          }));
          this.setState(prev => ({
            filteredData: prev.filteredData.filter(reporte => reporte.id !== this.state.reporteAEliminar.id)
          }));
          toast.success('Reporte eliminado correctamente');
        }
      }
    } catch (error) {
      console.error('Error al eliminar los reportes:', error);
      toast.error('Error al eliminar los reportes');
    } finally {
      this.setState({ showDeleteDialog: false });
      this.setState({ reporteAEliminar: null });
      this.setState({ reportesAEliminar: [] });
      this.setState({ selectedReportes: new Set() });
    }
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
    console.log("Navegación a nueva pantalla");
    // Ejemplo de navegación - Puedes cambiarlo por la ruta que necesites
    // navigate("/detalles");
    toast.info("Aquí iría la navegación a otra pantalla");
  };

  handleCategoriaChange = async (reporte: Reporte, value: string) => {
    const nuevaCategoria = value === 'none' ? undefined : getCategories().find(c => c.id === value);
    if (nuevaCategoria || value === 'none') {
      await actualizarCategoriaReporte(reporte, nuevaCategoria, getSystemUser());
      this.setState(prev => ({
        reportes: prev.reportes.map(r => r.id === reporte.id ? { ...r, categoria: nuevaCategoria } : r),
        filteredData: prev.filteredData.map(r => r.id === reporte.id ? { ...r, categoria: nuevaCategoria } : r)
      }));
    }
  };

  handleEstadoChange = async (reporte: Reporte, value: string) => {
    const nuevoEstado = getEstados().find(e => e.id === value);
    if (nuevoEstado) {
      await actualizarEstadoReporte(reporte, nuevoEstado, getSystemUser());
      this.setState(prev => ({
        reportes: prev.reportes.map(r => r.id === reporte.id ? { ...r, estado: nuevoEstado } : r),
        filteredData: prev.filteredData.map(r => r.id === reporte.id ? { ...r, estado: nuevoEstado } : r)
      }));
    }
  };

  handleAsignacionChange = async (reporte: Reporte, value: string) => {
    const nuevoUsuario = value === 'none' ? null : usuarios.find(u => u.id === value);
    if (nuevoUsuario || value === 'none') {
      await actualizarAsignacionReporte(reporte, nuevoUsuario, getSystemUser());
      this.setState(prev => ({
        reportes: prev.reportes.map(r => r.id === reporte.id ? { ...r, asignadoA: nuevoUsuario || undefined } : r),
        filteredData: prev.filteredData.map(r => r.id === reporte.id ? { ...r, asignadoA: nuevoUsuario || undefined } : r)
      }));
    }
  };

  render() {
    const { filteredData, currentPage, isLoading } = this.state;
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  return (
    <div className="space-y-6">
      <SearchFilterBar
          data={this.state.reportes}
          onFilterChange={this.handleFilterChange}
          attributes={this.ATTRIBUTES}
          propertyFilters={this.PROPERTY_FILTERS}
        searchPlaceholder="Buscar reportes..."
        resultLabel="reportes"
        exportLabel="Exportar CSV"
          exportFunction={this.handleExport}
          navigateFunction={this.handleNavigate}
        navigateLabel="Nuevo Reporte"
      />

        {this.state.selectedReportes.size > 0 && (
          <div className="flex items-center gap-4 p-4 rounded-md border">
            <div className="flex-1">
              <span className="text-sm font-medium text-gray-700">
                {this.state.selectedReportes.size} {this.state.selectedReportes.size === 1 ? 'reporte seleccionado' : 'reportes seleccionados'}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-4">
            <div className="flex items-center gap-4">
        <div className="w-[200px]">
                   <Select
                    value={this.state.selectedCategoriaId}
                    onValueChange={(value) => this.setState({ selectedCategoriaId: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar categoría" />
                    </SelectTrigger>
                    <SelectContent>
                      {getCategories().map(categoria => (
                        <SelectItem key={categoria.id} value={categoria.id}>
                          {categoria.nombre}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button
                  onClick={this.handleBulkCategoriaUpdate}
                  disabled={!this.state.selectedCategoriaId}
                  variant="default"
                  size="sm"
                >
                  Actualizar Categorías
                </Button>
              </div>

              <div className="flex items-center gap-4">
              <div className="w-[200px]">                  <Select
                    value={this.state.selectedEstado.id}
                    onValueChange={(value) => {
                      const estado = getEstados().find(e => e.id === value);
                      if (estado) this.setState({ selectedEstado: estado });
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar estado" />
                    </SelectTrigger>
                    <SelectContent>
                      {getEstados().map(estado => (
                        <SelectItem key={estado.id} value={estado.id}>
                          {estado.nombre}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button
                  onClick={this.handleBulkEstadoUpdate}
                  variant="default"
                  size="sm"
                  disabled={!this.state.selectedEstado.id}
                >
                  Actualizar Estados
                </Button>
              </div>

              <div className="flex items-center gap-4">
              <div className="w-[200px]">                  <Select
                    value={this.state.selectedUsuarioId}
                    onValueChange={(value) => this.setState({ selectedUsuarioId: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar usuario" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">No asignar</SelectItem>
                      {usuarios.map(usuario => (
                        <SelectItem key={usuario.id} value={usuario.id}>
                          {usuario.nombre} {usuario.apellido}
                          {usuario.estado === 'inactivo' && (
                            <span className="ml-2 px-2 py-0.5 rounded bg-gray-200 text-xs text-gray-600">Inactivo</span>
                          )}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button
                  onClick={this.handleBulkAsignacionUpdate}
                  variant="default"
                  size="sm"
                  disabled={!this.state.selectedUsuarioId}
                >
                  Actualizar Asignaciones
                </Button>
              </div>

              <div className="flex items-center gap-4">
              <div className="w-[200px]">                  <Select
                    value={this.state.selectedPrioridadId}
                    onValueChange={(value) => this.setState({ selectedPrioridadId: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar prioridad" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Sin prioridad</SelectItem>
                      {prioridades.map(prioridad => (
                        <SelectItem key={prioridad.id} value={prioridad.id}>
                          {prioridad.nombre}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button
                  onClick={this.handleBulkPrioridadUpdate}
                  variant="default"
                  size="sm"
                  disabled={!this.state.selectedPrioridadId}
                >
                  Actualizar Prioridades
                </Button>
              </div>

              <div className="flex items-center gap-4">
              <div className="w-[200px]">                  <Select
                    value={this.state.selectedActivo ? 'activo' : 'inactivo'}
                    onValueChange={(value) => this.setState({ selectedActivo: value === 'activo' })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar estado activo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="activo">Activo</SelectItem>
                      <SelectItem value="inactivo">Inactivo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button
                  onClick={this.handleBulkActivoUpdate}
                  variant="default"
                  size="sm"
                  disabled={this.state.selectedActivo === undefined}
                >
                  Actualizar Estado Activo
                </Button>
              </div>

              <div className="flex items-center gap-4">
                <Button
                  onClick={this.handleBulkDelete}
                  variant="destructive"
                  size="sm"
                  className="w-full"
                >
                  Eliminar Seleccionados
                </Button>
              </div>

            
            </div>
            <Button
                onClick={() => {
                  this.setState({ selectedReportes: new Set() });
                  this.setState({ selectedCategoriaId: '' });
                  this.setState({ selectedEstado: getEstados()[0] });
                  this.setState({ selectedUsuarioId: '' });
                  this.setState({ selectedPrioridadId: '' });
                  this.setState({ selectedActivo: true });
                }}
                variant="outline"
                size="sm"
              >
                Cancelar
              </Button>
            </div>
        )}

      <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">
                  <Checkbox
                    checked={this.isAllSelected}
                    indeterminate={this.isSomeSelected && !this.isAllSelected}
                    onCheckedChange={this.handleSelectAll}
                    aria-label="Seleccionar todos los reportes"
                  />
                </TableHead>
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
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-4">
                  Cargando reportes...
                </TableCell>
              </TableRow>
            ) : filteredData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-4">
                  No se encontraron reportes
                </TableCell>
              </TableRow>
            ) : (
              currentItems.map((reporte) => (
                <TableRow key={reporte.id}>
                  <TableCell>
                    <Checkbox
                      checked={this.state.selectedReportes.has(reporte.id)}
                      onCheckedChange={(checked) => this.handleSelectReporte(reporte.id, checked as boolean)}
                      aria-label={`Seleccionar reporte ${reporte.titulo}`}
                    />
                  </TableCell>
                  <TableCell>
                    <a
                      href="#"
                      className="text-primary font-medium hover:underline cursor-pointer"
                      onClick={e => {
                        e.preventDefault();
                        this.props.navigate(`/admin/reportes/${reporte.id}`);
                      }}
                    >
                      {reporte.titulo}
                    </a>
                  </TableCell>
                  <TableCell>
                    <Select
                      value={reporte.categoria?.id || 'none'}
                      onValueChange={(value) => this.handleCategoriaChange(reporte, value)}
                      disabled={!reporte.activo}
                    >
                      <SelectTrigger className={`w-[180px] focus:outline-none ${!reporte.activo ? 'opacity-50 cursor-not-allowed' : ''}`}>
                        <SelectValue>{reporte.categoria?.nombre || 'Sin categoría'}</SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">Sin categoría</SelectItem>
                        {getCategories().map(categoria => (
                          <SelectItem key={categoria.id} value={categoria.id}>
                            {categoria.nombre}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <Select
                      value={reporte.estado.id}
                      onValueChange={(value) => this.handleEstadoChange(reporte, value)}
                      disabled={!reporte.activo}
                    >
                      <SelectTrigger className={`w-[180px] focus:ring-0 focus:outline-none ${!reporte.activo ? 'opacity-50 cursor-not-allowed' : ''}`}>
                        <SelectValue>{reporte.estado.nombre}</SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        {getEstados().map(estado => (
                          <SelectItem key={estado.id} value={estado.id}>
                            {estado.nombre}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>{new Date(reporte.fechaCreacion).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })}</TableCell>
                  <TableCell>{reporte.ubicacion.direccion}</TableCell>
                  <TableCell>
                    <Select
                      value={reporte.asignadoA?.id || 'none'}
                      onValueChange={(value) => this.handleAsignacionChange(reporte, value)}
                      disabled={!reporte.activo}
                    >
                      <SelectTrigger className={`w-[180px] focus:ring-0 focus:outline-none ${!reporte.activo ? 'opacity-50 cursor-not-allowed' : ''}`}>
                        <SelectValue>{reporte.asignadoA ? `${reporte.asignadoA.nombre} ${reporte.asignadoA.apellido}` : 'No asignado'}</SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">No asignado</SelectItem>
                        {usuarios.map(usuario => (
                          <SelectItem key={usuario.id} value={usuario.id}>
                            {usuario.nombre} {usuario.apellido}
                            {usuario.estado === 'inactivo' && (
                              <span className="ml-2 px-2 py-0.5 rounded bg-gray-200 text-xs text-gray-600">Inactivo</span>
                            )}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => this.props.navigate(`/admin/reportes/${reporte.id}/editar`)}
                    >
                      <Pencil className="w-4 h-4 text-muted-foreground" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => this.handleDeleteReporte(reporte)}
                      disabled={!reporte.activo}
                      className={!reporte.activo ? 'opacity-50 cursor-not-allowed' : ''}
                    >
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
            </TableBody>
          </Table>
        </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={this.handlePageChange}
        totalItems={filteredData.length}
        itemsPerPage={itemsPerPage}
      />

      <AlertDialog open={this.state.showDeleteDialog} onOpenChange={(open) => this.setState({ showDeleteDialog: open })}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              {this.state.reportesAEliminar.length > 0 ? (
                <>
                  Esta acción no se puede deshacer. Se eliminarán permanentemente {this.state.reportesAEliminar.length} reportes activos seleccionados.
                </>
              ) : (
                <>
                  Esta acción no se puede deshacer. Se eliminará permanentemente el reporte{' '}
                  <span className="font-semibold">{this.state.reporteAEliminar?.titulo}</span>.
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={this.confirmarEliminacion}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
  }
}

// Create a wrapper component to provide navigation
const ListaReportesAdminWithNavigation: React.FC = () => {
  const navigate = useNavigate();
  return <ListaReportesAdmin navigate={navigate} />;
};

export default ListaReportesAdminWithNavigation;
