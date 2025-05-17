import { Reporte, EstadoReporte } from "@/types/tipos";


export interface ListaReportesAdminProps {
    navigate: (path: string) => void;
  }
  
  export interface ListaReportesAdminState {
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

  export interface BulkActionsProps {
    selectedReportes: Set<string>;
    selectedCategoriaId: string;
    selectedEstado: any;
    selectedUsuarioId: string;
    selectedPrioridadId: string;
    selectedActivo: boolean;
    onCategoriaChange: (value: string) => void;
    onEstadoChange: (value: string) => void;
    onUsuarioChange: (value: string) => void;
    onPrioridadChange: (value: string) => void;
    onActivoChange: (value: string) => void;
    onBulkCategoriaUpdate: () => void;
    onBulkEstadoUpdate: () => void;
    onBulkAsignacionUpdate: () => void;
    onBulkPrioridadUpdate: () => void;
    onBulkActivoUpdate: () => void;
    onBulkDelete: () => void;
    onCancel: () => void;
  }

  export interface DeleteDialogProps {
    showDeleteDialog: boolean;
    reporteAEliminar: Reporte | null;
    reportesAEliminar: Reporte[];
    onOpenChange: (open: boolean) => void;
    onConfirm: () => void;
  }

  export interface ReportsTableProps {
    isLoading: boolean;
    filteredData: Reporte[];
    currentItems: Reporte[];
    selectedReportes: Set<string>;
    isAllSelected: boolean;
    isSomeSelected: boolean;
    onSelectReporte: (reporteId: string, checked: boolean) => void;
    onSelectAll: (checked: boolean) => void;
    onNavigate: (path: string) => void;
    onDeleteReporte: (reporte: Reporte) => void;
    onCategoriaChange: (reporte: Reporte, value: string) => void;
    onEstadoChange: (reporte: Reporte, value: string) => void;
    onAsignacionChange: (reporte: Reporte, value: string) => void;
  }

  export interface ListaReportesAdminContentProps {
    state: ListaReportesAdminState;
    setState: (state: Partial<ListaReportesAdminState>) => void;
    ATTRIBUTES: any[];
    PROPERTY_FILTERS: any[];
    isAllSelected: boolean;
    isSomeSelected: boolean;
    handleFilterChange: (newData: any[], filters: any) => void;
    handleSelectReporte: (reporteId: string, checked: boolean) => void;
    handleSelectAll: (checked: boolean) => void;
    handlePageChange: (page: number) => void;
    handleExport: (data: any[]) => void;
    handleNavigate: () => void;
    handleBulkCategoriaUpdate: () => Promise<void>;
    handleBulkEstadoUpdate: () => Promise<void>;
    handleBulkAsignacionUpdate: () => Promise<void>;
    handleBulkPrioridadUpdate: () => Promise<void>;
    handleBulkActivoUpdate: () => Promise<void>;
    handleBulkDelete: () => void;
    handleDeleteReporte: (reporte: Reporte) => void;
    handleCategoriaChange: (reporte: Reporte, value: string) => Promise<void>;
    handleEstadoChange: (reporte: Reporte, value: string) => Promise<void>;
    handleAsignacionChange: (reporte: Reporte, value: string) => Promise<void>;
    confirmarEliminacion: () => Promise<void>;
    navigate: (path: string) => void;
    itemsPerPage: number;
  }