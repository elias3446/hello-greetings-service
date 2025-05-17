import { Reporte, EstadoReporte } from '@/types/tipos';
import { toast } from '@/components/ui/sonner';
import { obtenerReportes } from '@/controller/CRUD/report/reportController';
import { getCategories } from '@/controller/CRUD/category/categoryController';
import { actualizarCategoriaReporte } from '@/controller/controller/report/reportCategoryController';
import { actualizarEstadoReporte } from '@/controller/controller/report/reportStateController';
import { actualizarAsignacionReporte } from '@/controller/controller/report/reportAssignmentController';
import { eliminarReport } from '@/controller/controller/report/reportDeleteController';
import { getEstados } from '@/controller/CRUD/estado/estadoController';
import { usuarios } from '@/data/usuarios';
import { getSystemUser } from '@/utils/userUtils';
import { actualizarEstadoActivoReporte } from '@/controller/controller/report/reportActiveController';
import { prioridades } from '@/data/categorias';
import { actualizarPrioridadReporte } from '@/controller/controller/report/reportPriorityController';
import { ListaReportesAdminState } from '@/props/admin/report/PropListaReportesAdmin';

export const ATTRIBUTES = [
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

export const PROPERTY_FILTERS = [
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

export const getInitialState = (): ListaReportesAdminState => ({
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
});

export const loadReportes = async (setState: (state: Partial<ListaReportesAdminState>) => void) => {
  setState({ isLoading: true });
  try {
    const data = obtenerReportes();
    setState({
      reportes: data,
      filteredData: data,
      isLoading: false
    });
  } catch (error) {
    toast.error("Error al cargar reportes");
    setState({ isLoading: false });
  }
};

export const handleBulkEstadoUpdate = async (
  state: ListaReportesAdminState,
  setState: (state: Partial<ListaReportesAdminState>) => void
) => {
  if (state.selectedReportes.size === 0) {
    toast.error('Por favor seleccione al menos un reporte');
    return;
  }

  const systemUser = getSystemUser();
  let successCount = 0;
  let errorCount = 0;
  let skippedCount = 0;

  for (const reporteId of state.selectedReportes) {
    try {
      const reporte = state.reportes.find(r => r.id === reporteId);
      if (!reporte) continue;

      if (!reporte.activo) {
        skippedCount++;
        continue;
      }

      const success = await actualizarEstadoReporte(reporte, state.selectedEstado, systemUser);
      if (success) {
        successCount++;
        setState({
          reportes: state.reportes.map(r => 
            r.id === reporteId ? { ...r, estado: state.selectedEstado } : r
          ),
          filteredData: state.filteredData.map(r => 
            r.id === reporteId ? { ...r, estado: state.selectedEstado } : r
          )
        });
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

  setState({ 
    selectedReportes: new Set(),
    selectedEstado: getEstados()[0]
  });
};

export const handleBulkCategoriaUpdate = async (
  state: ListaReportesAdminState,
  setState: (state: Partial<ListaReportesAdminState>) => void
) => {
  if (!state.selectedCategoriaId || state.selectedReportes.size === 0) {
    toast.error('Por favor seleccione una categoría y al menos un reporte');
    return;
  }

  const systemUser = getSystemUser();
  let successCount = 0;
  let errorCount = 0;
  let skippedCount = 0;

  for (const reporteId of state.selectedReportes) {
    try {
      const reporte = state.reportes.find(r => r.id === reporteId);
      if (!reporte) continue;

      if (!reporte.activo) {
        skippedCount++;
        continue;
      }

      const nuevaCategoria = getCategories().find(c => c.id === state.selectedCategoriaId);
      if (!nuevaCategoria) continue;

      const success = await actualizarCategoriaReporte(reporte, nuevaCategoria, systemUser);
      if (success) {
        successCount++;
        setState({
          reportes: state.reportes.map(r => 
            r.id === reporteId ? { ...r, categoria: nuevaCategoria } : r
          ),
          filteredData: state.filteredData.map(r => 
            r.id === reporteId ? { ...r, categoria: nuevaCategoria } : r
          )
        });
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

  setState({ 
    selectedReportes: new Set(),
    selectedCategoriaId: '',
    selectedEstado: getEstados()[0]
  });
};

export const handleBulkAsignacionUpdate = async (
  state: ListaReportesAdminState,
  setState: (state: Partial<ListaReportesAdminState>) => void
) => {
  if (state.selectedReportes.size === 0) {
    toast.error('Por favor seleccione al menos un reporte');
    return;
  }

  const systemUser = getSystemUser();
  let successCount = 0;
  let errorCount = 0;
  let skippedCount = 0;

  for (const reporteId of state.selectedReportes) {
    try {
      const reporte = state.reportes.find(r => r.id === reporteId);
      if (!reporte) continue;

      if (!reporte.activo) {
        skippedCount++;
        continue;
      }

      const nuevoUsuario = state.selectedUsuarioId === 'none' ? null : usuarios.find(u => u.id === state.selectedUsuarioId);
      if (!nuevoUsuario && state.selectedUsuarioId !== 'none') continue;

      const success = await actualizarAsignacionReporte(reporte, nuevoUsuario || systemUser, systemUser);
      if (success) {
        successCount++;
        setState({
          reportes: state.reportes.map(r => 
            r.id === reporteId ? { ...r, asignadoA: nuevoUsuario || undefined } : r
          ),
          filteredData: state.filteredData.map(r => 
            r.id === reporteId ? { ...r, asignadoA: nuevoUsuario || undefined } : r
          )
        });
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

  setState({ 
    selectedReportes: new Set(),
    selectedUsuarioId: ''
  });
};

export const handleBulkActivoUpdate = async (
  state: ListaReportesAdminState,
  setState: (state: Partial<ListaReportesAdminState>) => void
) => {
  if (state.selectedReportes.size === 0) {
    toast.error('Por favor seleccione al menos un reporte');
    return;
  }

  const systemUser = getSystemUser();
  let successCount = 0;
  let errorCount = 0;

  for (const reporteId of state.selectedReportes) {
    try {
      const reporte = state.reportes.find(r => r.id === reporteId);
      if (!reporte) continue;

      const success = await actualizarEstadoActivoReporte(reporte, state.selectedActivo, systemUser);
      if (success) {
        successCount++;
        setState({
          reportes: state.reportes.map(r => 
            r.id === reporteId ? { ...r, activo: state.selectedActivo } : r
          ),
          filteredData: state.filteredData.map(r => 
            r.id === reporteId ? { ...r, activo: state.selectedActivo } : r
          )
        });
      } else {
        errorCount++;
      }
    } catch (error) {
      console.error(`Error al actualizar el estado activo del reporte ${reporteId}:`, error);
      errorCount++;
    }
  }

  if (successCount > 0) {
    toast.success(`Se ${state.selectedActivo ? 'activaron' : 'desactivaron'} ${successCount} reportes correctamente`);
  }
  if (errorCount > 0) {
    toast.error(`Hubo errores al actualizar ${errorCount} reportes`);
  }

  setState({ 
    selectedReportes: new Set(),
    selectedActivo: true
  });
};

export const handleBulkPrioridadUpdate = async (
  state: ListaReportesAdminState,
  setState: (state: Partial<ListaReportesAdminState>) => void
) => {
  if (state.selectedReportes.size === 0) {
    toast.error('Por favor seleccione al menos un reporte');
    return;
  }

  const systemUser = getSystemUser();
  let successCount = 0;
  let errorCount = 0;
  let skippedCount = 0;

  for (const reporteId of state.selectedReportes) {
    try {
      const reporte = state.reportes.find(r => r.id === reporteId);
      if (!reporte) continue;

      if (!reporte.activo) {
        skippedCount++;
        continue;
      }

      const nuevaPrioridad = state.selectedPrioridadId === 'none' ? undefined : prioridades.find(p => p.id === state.selectedPrioridadId);
      if (!nuevaPrioridad && state.selectedPrioridadId !== 'none') continue;

      const success = await actualizarPrioridadReporte(reporte, nuevaPrioridad, systemUser);
      if (success) {
        successCount++;
        setState({
          reportes: state.reportes.map(r => 
            r.id === reporteId ? { ...r, prioridad: nuevaPrioridad } : r
          ),
          filteredData: state.filteredData.map(r => 
            r.id === reporteId ? { ...r, prioridad: nuevaPrioridad } : r
          )
        });
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

  setState({ 
    selectedReportes: new Set(),
    selectedPrioridadId: ''
  });
};

export const handleBulkDelete = (
  state: ListaReportesAdminState,
  setState: (state: Partial<ListaReportesAdminState>) => void
) => {
  const reportesSeleccionados = state.reportes.filter(reporte => 
    state.selectedReportes.has(reporte.id) && reporte.activo
  );
  setState({ 
    reportesAEliminar: reportesSeleccionados,
    showDeleteDialog: true
  });
};

export const handleDeleteReporte = (
  reporte: Reporte,
  setState: (state: Partial<ListaReportesAdminState>) => void
) => {
  setState({ 
    reporteAEliminar: reporte,
    showDeleteDialog: true
  });
};

export const confirmarEliminacion = async (
  state: ListaReportesAdminState,
  setState: (state: Partial<ListaReportesAdminState>) => void
) => {
  try {
    if (state.reportesAEliminar.length > 0) {
      let successCount = 0;
      let errorCount = 0;
      let skippedCount = 0;
      const reportesAEliminarIds = new Set(state.reportesAEliminar.map(r => r.id));

      for (const reporte of state.reportesAEliminar) {
        try {
          if (!reporte.activo) {
            skippedCount++;
            continue;
          }

          const success = await eliminarReport(reporte, getSystemUser());

          if (success) {
            successCount++;
          } else {
            errorCount++;
          }
        } catch (error) {
          console.error(`Error al eliminar el reporte ${reporte.id}:`, error);
          errorCount++;
        }
      }

      if (successCount > 0) {
        setState({
          reportes: state.reportes.filter(r => !reportesAEliminarIds.has(r.id)),
          filteredData: state.filteredData.filter(r => !reportesAEliminarIds.has(r.id)),
          selectedReportes: new Set(),
          showDeleteDialog: false,
          reporteAEliminar: null,
          reportesAEliminar: []
        });
        toast.success(`Se eliminaron ${successCount} reportes correctamente`);
      }
      if (errorCount > 0) {
        toast.error(`Hubo errores al eliminar ${errorCount} reportes`);
      }
      if (skippedCount > 0) {
        toast.info(`${skippedCount} reportes inactivos fueron omitidos`);
      }
    } else if (state.reporteAEliminar) {
      const success = await eliminarReport(state.reporteAEliminar, getSystemUser());

      if (success) {
        setState({
          reportes: state.reportes.filter(r => r.id !== state.reporteAEliminar?.id),
          filteredData: state.filteredData.filter(r => r.id !== state.reporteAEliminar?.id),
          selectedReportes: new Set(),
          showDeleteDialog: false,
          reporteAEliminar: null,
          reportesAEliminar: []
        });
        toast.success('Reporte eliminado correctamente');
      }
    }
  } catch (error) {
    console.error('Error al eliminar los reportes:', error);
    toast.error('Error al eliminar los reportes');
  }
};

export const handleCategoriaChange = async (
  reporte: Reporte,
  value: string,
  state: ListaReportesAdminState,
  setState: (state: Partial<ListaReportesAdminState>) => void
) => {
  const nuevaCategoria = value === 'none' ? undefined : getCategories().find(c => c.id === value);
  if (nuevaCategoria || value === 'none') {
    await actualizarCategoriaReporte(reporte, nuevaCategoria, getSystemUser());
    setState({
      reportes: state.reportes.map(r => r.id === reporte.id ? { ...r, categoria: nuevaCategoria } : r),
      filteredData: state.filteredData.map(r => r.id === reporte.id ? { ...r, categoria: nuevaCategoria } : r)
    });
  }
};

export const handleEstadoChange = async (
  reporte: Reporte,
  value: string,
  state: ListaReportesAdminState,
  setState: (state: Partial<ListaReportesAdminState>) => void
) => {
  const nuevoEstado = getEstados().find(e => e.id === value);
  if (nuevoEstado) {
    await actualizarEstadoReporte(reporte, nuevoEstado, getSystemUser());
    setState({
      reportes: state.reportes.map(r => r.id === reporte.id ? { ...r, estado: nuevoEstado } : r),
      filteredData: state.filteredData.map(r => r.id === reporte.id ? { ...r, estado: nuevoEstado } : r)
    });
  }
};

export const handleAsignacionChange = async (
  reporte: Reporte,
  value: string,
  state: ListaReportesAdminState,
  setState: (state: Partial<ListaReportesAdminState>) => void
) => {
  const nuevoUsuario = value === 'none' ? null : usuarios.find(u => u.id === value);
  if (nuevoUsuario || value === 'none') {
    await actualizarAsignacionReporte(reporte, nuevoUsuario, getSystemUser());
    setState({
      reportes: state.reportes.map(r => r.id === reporte.id ? { ...r, asignadoA: nuevoUsuario || undefined } : r),
      filteredData: state.filteredData.map(r => r.id === reporte.id ? { ...r, asignadoA: nuevoUsuario || undefined } : r)
    });
  }
}; 