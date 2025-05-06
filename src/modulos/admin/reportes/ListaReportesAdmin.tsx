import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  PlusIcon, 
  PencilIcon, 
  Trash2Icon, 
  DownloadIcon,
  FileText
} from 'lucide-react';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { Reporte } from '@/types/tipos';
import { toast } from '@/components/ui/sonner';
import { getReports, filterReports, sortReports, deleteReport } from '@/controller/CRUD/reportController';
import SearchFilterBar from '@/components/layout/SearchFilterBar';
import CategoriaSelector from '@/components/admin/selector/CategoriaSelector';
import EstadoSelector from '@/components/admin/selector/EstadoSelector';
import UsuarioSelector from '@/components/admin/selector/UsuarioSelector';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { registrarCambioEstadoReporte } from '@/controller/CRUD/historialEstadosReporte';
import { registrarCambioEstado } from '@/controller/CRUD/historialEstadosUsuario';

// Types
interface SortOption {
  value: string;
  label: string;
}

interface FilterOption {
  value: string;
  label: string;
}

interface ReporteTableProps {
  reportes: Reporte[];
  isLoading: boolean;
  onEdit: (id: string) => void;
  onDelete: (reporte: Reporte) => void;
}

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

interface DeleteDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  reporte: Reporte | null;
}

// Utility functions
const formatDate = (date: Date): string => {
  return new Date(date).toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
};

const getFullName = (reporte: Reporte): string => {
  if (!reporte.asignadoA) return 'Sin asignar';
  return `${reporte.asignadoA.nombre} ${reporte.asignadoA.apellido}`.trim();
};

const getFieldValue = (reporte: Reporte, field: string): string => {
  switch (field) {
    case 'titulo':
      return reporte.titulo;
    case 'ubicacion':
      return reporte.ubicacion.direccion;
    case 'asignadoA':
      return getFullName(reporte);
    case 'fechaCreacion':
      return formatDate(reporte.fechaCreacion);
    case 'estado':
      return reporte.estado.nombre;
    case 'categoria':
      return reporte.categoria.nombre;
    default:
      return '';
  }
};

const exportToCSV = (reportes: Reporte[]): void => {
  const data = reportes.map(reporte => ({
    titulo: reporte.titulo,
    categoria: reporte.categoria.nombre,
    estado: reporte.estado.nombre,
    fechaCreacion: formatDate(reporte.fechaCreacion),
    ubicacion: reporte.ubicacion.direccion,
    asignadoA: getFullName(reporte)
  }));
  
  const csvContent = [
    Object.keys(data[0]).join(','),
    ...data.map(row => Object.values(row).join(','))
  ].join('\n');
  
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', 'reportes.csv');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// Custom hook for state management
const useReportesState = () => {
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

// Delete confirmation dialog component
const DeleteConfirmationDialog: React.FC<DeleteDialogProps> = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  reporte 
}) => (
  <AlertDialog open={isOpen} onOpenChange={onClose}>
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
        <AlertDialogDescription>
          Esta acción no se puede deshacer. Se eliminará permanentemente el reporte{' '}
          <span className="font-semibold">{reporte?.titulo}</span>.
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel>Cancelar</AlertDialogCancel>
        <AlertDialogAction 
          onClick={onConfirm}
          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
        >
          Eliminar
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
);

// Table component for displaying reports
const ReportesTable: React.FC<ReporteTableProps> = ({ 
  reportes, 
  isLoading, 
  onEdit, 
  onDelete 
}) => {
  if (isLoading) {
    return (
      <TableRow>
        <TableCell colSpan={7} className="text-center">
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
          </div>
        </TableCell>
      </TableRow>
    );
  }

  if (reportes.length === 0) {
    return (
      <TableRow>
        <TableCell colSpan={7} className="text-center">
          No se encontraron reportes
        </TableCell>
      </TableRow>
    );
  }

  return (
    <>
      {reportes.map((reporte) => (
        <TableRow key={reporte.id}>
          <TableCell>
            <Link to={`/admin/reportes/${reporte.id}`} className="text-blue-600 hover:underline">
              {reporte.titulo}
            </Link>
          </TableCell>
          <TableCell>
            {reporte.categoria.nombre && (
              <CategoriaSelector
                ReporteId={reporte.id}
                currentCategoriaId={reporte.categoria.id}
              />
            )}
          </TableCell>
          <TableCell>
            {reporte.estado.nombre && (
              <EstadoSelector
                ReporteId={reporte.id}
                currentEstadoId={reporte.estado.id}
              />
            )}
          </TableCell>
          <TableCell>
            {formatDate(reporte.fechaCreacion)}
          </TableCell>
          <TableCell>{reporte.ubicacion.direccion}</TableCell>
          <TableCell>
            <UsuarioSelector
              ReporteId={reporte.id}
              currentUsuarioId={reporte.asignadoA?.id}
            />
          </TableCell>
          <TableCell className="text-right">
            <div className="flex justify-end gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onEdit(reporte.id)}
              >
                <PencilIcon className="h-4 w-4 text-gray-500" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="text-red-500 hover:text-red-600"
                onClick={() => onDelete(reporte)}
              >
                <Trash2Icon className="h-4 w-4" />
              </Button>
            </div>
          </TableCell>
        </TableRow>
      ))}
    </>
  );
};

// Pagination component
const ReportesPagination: React.FC<PaginationProps> = ({ 
  currentPage, 
  totalPages, 
  onPageChange 
}) => {
  if (totalPages <= 1) return null;

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
            className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
          />
        </PaginationItem>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <PaginationItem key={page}>
            <PaginationLink
              onClick={() => onPageChange(page)}
              isActive={currentPage === page}
            >
              {page}
            </PaginationLink>
          </PaginationItem>
        ))}
        <PaginationItem>
          <PaginationNext
            onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
            className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};

const ListaReportesAdmin: React.FC = () => {
  const navigate = useNavigate();
  const {
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
  } = useReportesState();

  const itemsPerPage = 10;

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
          getFullName(reporteAEliminar),
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

  React.useEffect(() => {
    let result = [...reportes];

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        reporte => reporte.titulo.toLowerCase().includes(term) ||
                reporte.ubicacion.direccion.toLowerCase().includes(term) ||
                getFullName(reporte).toLowerCase().includes(term) ||
                reporte.estado.nombre.toLowerCase().includes(term) ||
                reporte.estado.id.toString().toLowerCase().includes(term) ||
                reporte.categoria.nombre.toLowerCase().includes(term) ||
                formatDate(reporte.fechaCreacion).toLowerCase().includes(term)
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

    result = sortReports(result, sortBy, sortDirection);

    setFilteredReportes(result);
    setCurrentPage(1);
  }, [reportes, searchTerm, sortBy, sortDirection, selectedFilterValues]);

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
    exportToCSV(filteredReportes);
  };

  // Paginación
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentReportes = filteredReportes.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredReportes.length / itemsPerPage);

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
          filteredCount={filteredReportes.length}
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
                reportes={currentReportes}
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
