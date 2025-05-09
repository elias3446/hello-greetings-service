import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Reporte, Usuario, Categoria, EstadoReporte } from '@/types/tipos';
import { toast } from '@/components/ui/sonner';
import { getReports, getReportById, updateReport } from '@/controller/CRUD/reportController';
import SearchFilterBar from '@/components/layout/SearchFilterBar';
import { registrarCambioEstadoReporte } from '@/controller/CRUD/historialEstadosReporte';
import { registrarCambioEstado } from '@/controller/CRUD/historialEstadosUsuario';
import { SortOption, FilterOption } from '@/types/reportes';
import { getFieldValue } from '@/utils/reportes';
import { exportToCSV } from '@/utils/reportes';
import { useReportesState, useReportesData, usePagination } from '@/hooks/useReportes';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { getCategories } from '@/controller/CRUD/categoryController';
import { actualizarCategoriaReporte } from '@/controller/controller/reportCategoryController';
import { actualizarEstadoReporte } from '@/controller/controller/reportStateController';
import { actualizarAsignacionReporte } from '@/controller/controller/reportAssignmentController';
import { eliminarReporte } from '@/controller/controller/reportDeleteController';
import { getEstados } from '@/controller/CRUD/estadoController';
import { usuarios } from '@/data/usuarios';
import { getSystemUser } from '@/utils/userUtils';
import { Pencil, Trash2 } from 'lucide-react';

const ITEMS_PER_PAGE = 10;

const SORT_OPTIONS: SortOption[] = [
  { value: 'titulo', label: 'Título' },
  { value: 'ubicacion', label: 'Ubicación' },
  { value: 'asignadoA', label: 'Asignado a' },
  { value: 'fechaCreacion', label: 'Fecha creación' }
];

const FILTER_OPTIONS: FilterOption[] = [
  { value: 'estado', label: 'Estado' },
  { value: 'categoria', label: 'Categoría' },
  { value: 'activo', label: 'Activo' }
];

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

  const [selectedReportes, setSelectedReportes] = useState<Set<string>>(new Set());
  const [selectedCategoriaId, setSelectedCategoriaId] = useState<string>('');
  const [selectedEstado, setSelectedEstado] = useState<EstadoReporte>(getEstados()[0]);

  const filteredData = useReportesData(reportes, searchTerm, sortBy, sortDirection, selectedFilterValues);
  const { currentPage, setCurrentPage, totalPages, currentItems } = usePagination(filteredData, ITEMS_PER_PAGE);

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

  const handleSelectReporte = (reporteId: string, checked: boolean) => {
    setSelectedReportes(prev => {
      const newSelected = new Set(prev);
      if (checked) {
        newSelected.add(reporteId);
      } else {
        newSelected.delete(reporteId);
      }
      return newSelected;
    });
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedReportes(new Set(currentItems.map(reporte => reporte.id)));
    } else {
      setSelectedReportes(new Set());
    }
  };

  const handleBulkEstadoUpdate = async () => {
    if (selectedReportes.size === 0) {
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

    for (const reporteId of selectedReportes) {
      try {
        const reporte = reportes.find(r => r.id === reporteId);
        if (!reporte) continue;

        const success = await actualizarEstadoReporte(reporte, selectedEstado, systemUser);
      if (success) {
          successCount++;
        setReportes(prevReportes => 
          prevReportes.map(r => 
              r.id === reporteId ? { ...r, estado: selectedEstado } : r
            )
          );
          setFilteredReportes(prevReportes => 
            prevReportes.map(r => 
              r.id === reporteId ? { ...r, estado: selectedEstado } : r
            )
          );
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

    setSelectedReportes(new Set());
    setSelectedEstado(getEstados()[0]);
  };

  const handleBulkCategoriaUpdate = async () => {
    if (!selectedCategoriaId || selectedReportes.size === 0) {
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

    for (const reporteId of selectedReportes) {
      try {
        const reporte = reportes.find(r => r.id === reporteId);
        if (!reporte) continue;

        const nuevaCategoria = getCategories().find(c => c.id === selectedCategoriaId);
        if (!nuevaCategoria) continue;

        const success = await actualizarCategoriaReporte(reporte, nuevaCategoria, systemUser);
        if (success) {
          successCount++;
          setReportes(prevReportes => 
            prevReportes.map(r => 
              r.id === reporteId ? { ...r, categoria: nuevaCategoria } : r
            )
          );
          setFilteredReportes(prevReportes => 
            prevReportes.map(r => 
              r.id === reporteId ? { ...r, categoria: nuevaCategoria } : r
            )
          );
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

    setSelectedReportes(new Set());
    setSelectedCategoriaId('');
    setSelectedEstado(getEstados()[0]);
  };

  const handleDeleteReporte = (reporte: Reporte) => {
    setReporteAEliminar(reporte);
    setShowDeleteDialog(true);
  };

  const confirmarEliminacion = async () => {
    try {
      if (!reporteAEliminar) return;

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

      const success = await eliminarReporte(reporteAEliminar, systemUser);
      if (success) {
        setReportes(prevReportes => prevReportes.filter(reporte => reporte.id !== reporteAEliminar.id));
        setFilteredReportes(prevReportes => prevReportes.filter(reporte => reporte.id !== reporteAEliminar.id));
        toast.success('Reporte eliminado correctamente');
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

  const handleExportReportes = () => {
    exportToCSV(filteredData);
  };

  return (
    <div className="space-y-6">
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
          getFieldValue={(reporte, field) => {
            if (field === 'activo') {
              return reporte.activo ? 'true' : 'false';
            }
            return getFieldValue(reporte, field);
          }}
          showNewButton={true}
          newButtonLabel="Nuevo Reporte"
          showExportButton={true}
        sortOptions={SORT_OPTIONS}
          filteredCount={filteredData.length}
          totalCount={reportes.length}
          itemLabel="reportes"
        filterOptions={FILTER_OPTIONS}
        searchPlaceholder="Buscar reportes..."
        />

        {selectedReportes.size > 0 && (
          <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-md border">
            <div className="flex-1">
              <span className="text-sm font-medium text-gray-700">
                {selectedReportes.size} {selectedReportes.size === 1 ? 'reporte seleccionado' : 'reportes seleccionados'}
              </span>
            </div>
            <div className="flex items-center gap-4">
            <div className="w-[200px]">
              <Select
                value={selectedCategoriaId}
                onValueChange={setSelectedCategoriaId}
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
              onClick={handleBulkCategoriaUpdate}
              disabled={!selectedCategoriaId}
              variant="default"
            >
              Actualizar Categorías
            </Button>
            <div className="w-[200px]">
              <Select
                value={selectedEstado.id}
                onValueChange={(value) => {
                  const estado = getEstados().find(e => e.id === value);
                  if (estado) setSelectedEstado(estado);
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
              onClick={handleBulkEstadoUpdate}
              variant="default"
            >
              Actualizar Estados
            </Button>
            <Button
              onClick={() => {
                setSelectedReportes(new Set());
                setSelectedCategoriaId('');
                setSelectedEstado(getEstados()[0]);
              }}
              variant="outline"
              >
                Cancelar
              </Button>
            </div>
          </div>
        )}

      <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">
                  <Checkbox
                    checked={selectedReportes.size === currentItems.length && currentItems.length > 0}
                    onCheckedChange={handleSelectAll}
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
            ) : currentItems.length === 0 ? (
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
                      checked={selectedReportes.has(reporte.id)}
                      onCheckedChange={(checked) => handleSelectReporte(reporte.id, checked as boolean)}
                      aria-label={`Seleccionar reporte ${reporte.titulo}`}
                    />
                  </TableCell>
                  <TableCell>
                    <a
                      href="#"
                      className="text-primary font-medium hover:underline cursor-pointer"
                      onClick={e => {
                        e.preventDefault();
                        navigate(`/admin/reportes/${reporte.id}`);
                      }}
                    >
                      {reporte.titulo}
                    </a>
                  </TableCell>
                  <TableCell>
                    <Select
                      value={reporte.categoria.id}
                      onValueChange={async (value) => {
                        const nuevaCategoria = getCategories().find(c => c.id === value);
                        if (nuevaCategoria) {
                          await actualizarCategoriaReporte(reporte, nuevaCategoria, getSystemUser());
                          setReportes(prev => prev.map(r => r.id === reporte.id ? { ...r, categoria: nuevaCategoria } : r));
                        }
                      }}
                    >
                      <SelectTrigger className="w-full bg-white border-none focus:ring-0 focus:outline-none">
                        <SelectValue>{reporte.categoria.nombre}</SelectValue>
                      </SelectTrigger>
                      <SelectContent>
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
                      onValueChange={async (value) => {
                        const nuevoEstado = getEstados().find(e => e.id === value);
                        if (nuevoEstado) {
                          await actualizarEstadoReporte(reporte, nuevoEstado, getSystemUser());
                          setReportes(prev => prev.map(r => r.id === reporte.id ? { ...r, estado: nuevoEstado } : r));
                        }
                      }}
                    >
                      <SelectTrigger className="w-full bg-white border-none focus:ring-0 focus:outline-none">
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
                      onValueChange={async (value) => {
                        let nuevoUsuario = null;
                        if (value !== 'none') {
                          nuevoUsuario = usuarios.find(u => u.id === value);
                        }
                        await actualizarAsignacionReporte(reporte, nuevoUsuario, getSystemUser());
                        setReportes(prev => prev.map(r => r.id === reporte.id ? { ...r, asignadoA: nuevoUsuario || undefined } : r));
                      }}
                    >
                      <SelectTrigger className="w-full bg-white border-none focus:ring-0 focus:outline-none">
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
                      onClick={() => navigate(`/admin/reportes/${reporte.id}/editar`)}
                    >
                      <Pencil className="w-4 h-4 text-muted-foreground" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteReporte(reporte)}
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

      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-500">
          Mostrando {currentItems.length} de {filteredData.length} reportes
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Anterior
          </Button>
          <span className="text-sm">
            Página {currentPage} de {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            Siguiente
          </Button>
        </div>
      </div>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Se eliminará permanentemente el reporte{' '}
              <span className="font-semibold">{reporteAEliminar?.titulo}</span>.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmarEliminacion}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ListaReportesAdmin;
