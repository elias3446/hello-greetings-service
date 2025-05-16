import React, { useState } from 'react';
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
import { useReportesState, useReportesData, usePagination } from '@/hooks/useReportes';
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
import { prioridades } from '@/data/categorias';
import { actualizarPrioridadReporte } from '@/controller/controller/report/reportPriorityController';
import Pagination from '@/components/layout/Pagination';

const ITEMS_PER_PAGE = 5;

const SORT_OPTIONS: SortOption[] = [
  { value: 'titulo', label: 'Título' },
  { value: 'ubicacion', label: 'Ubicación' },
  { value: 'asignadoA', label: 'Asignado a' },
  { value: 'fechaCreacion', label: 'Fecha creación' },
];

const FILTER_OPTIONS: FilterOption[] = [
  { value: 'estado', label: 'Estado' },
  { value: 'categoria', label: 'Categoría' },
  { value: 'prioridad', label: 'Prioridad' },
  { value: 'activo', label: 'Estado' }
];

const ListaReportesAdmin: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { state } = location;
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
    currentPage,
    setCurrentPage,
  } = useReportesState();

  const [selectedReportes, setSelectedReportes] = useState<Set<string>>(new Set());
  const [selectedCategoriaId, setSelectedCategoriaId] = useState<string>('');
  const [selectedEstado, setSelectedEstado] = useState<EstadoReporte>(getEstados()[0]);
  const [selectedUsuarioId, setSelectedUsuarioId] = useState<string>('');
  const [selectedActivo, setSelectedActivo] = useState<boolean>(true);
  const [reportesAEliminar, setReportesAEliminar] = useState<Reporte[]>([]);
  const [selectedPrioridadId, setSelectedPrioridadId] = useState<string>('');

  const filteredData = useReportesData(reportes, searchTerm, sortBy, sortDirection, selectedFilterValues);
  const { totalPages, currentItems } = usePagination(
    filteredData,
    ITEMS_PER_PAGE,
    currentPage,
    setCurrentPage
  );

  React.useEffect(() => {
    setIsLoading(true);
    try {
      const data = obtenerReportes();
      setReportes(data);
      setFilteredReportes(data);

      // Aplicar filtros iniciales si existen
      if (state?.initialFilters) {
        const { categoria } = state.initialFilters;
        if (categoria && categoria.length > 0) {
          const categoriaSeleccionada = getCategories().find(c => c.id === categoria[0]);
          if (categoriaSeleccionada) {
            // Forzar la actualización de los filtros
            const filterValue = `categoria:${categoriaSeleccionada.nombre}`;
            console.log('Setting initial filter:', filterValue);
            
            // Asegurar que el filtro se aplique antes de actualizar el estado
            setSelectedFilterValues([filterValue]);
            setCategoriaFilter(categoriaSeleccionada.nombre);
            
            // Asegurar que el filtro se aplique inmediatamente
            const filteredData = data.filter(reporte => 
              reporte.categoria?.nombre === categoriaSeleccionada.nombre
            );
            setFilteredReportes(filteredData);

            // Forzar la actualización del estado de los filtros
            setTimeout(() => {
              console.log('Forcing filter update with:', filterValue);
              setSelectedFilterValues([filterValue]);
            }, 100);
          }
        }
      }
    } catch (error) {
      toast.error("Error al cargar reportes");
    } finally {
      setIsLoading(false);
    }
  }, [state?.initialFilters]);

  React.useEffect(() => {
    setCurrentPage(1);
  }, [filteredData, setCurrentPage]);

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
      setSelectedReportes(new Set(filteredData.map(reporte => reporte.id)));
    } else {
      setSelectedReportes(new Set());
    }
  };

  const isAllSelected = React.useMemo(() => {
    return filteredData.length > 0 && filteredData.every(reporte => selectedReportes.has(reporte.id));
  }, [filteredData, selectedReportes]);

  const isSomeSelected = React.useMemo(() => {
    return filteredData.some(reporte => selectedReportes.has(reporte.id));
  }, [filteredData, selectedReportes]);

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
    let skippedCount = 0;

    for (const reporteId of selectedReportes) {
      try {
        const reporte = reportes.find(r => r.id === reporteId);
        if (!reporte) continue;

        if (!reporte.activo) {
          skippedCount++;
          continue;
        }

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
    if (skippedCount > 0) {
      toast.info(`${skippedCount} reportes inactivos fueron omitidos`);
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
    let skippedCount = 0;

    for (const reporteId of selectedReportes) {
      try {
        const reporte = reportes.find(r => r.id === reporteId);
        if (!reporte) continue;

        if (!reporte.activo) {
          skippedCount++;
          continue;
        }

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
    if (skippedCount > 0) {
      toast.info(`${skippedCount} reportes inactivos fueron omitidos`);
    }

    setSelectedReportes(new Set());
    setSelectedCategoriaId('');
    setSelectedEstado(getEstados()[0]);
  };

  const handleBulkAsignacionUpdate = async () => {
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
    let skippedCount = 0;

    for (const reporteId of selectedReportes) {
      try {
        const reporte = reportes.find(r => r.id === reporteId);
        if (!reporte) continue;

        if (!reporte.activo) {
          skippedCount++;
          continue;
        }

        const nuevoUsuario = selectedUsuarioId === 'none' ? null : usuarios.find(u => u.id === selectedUsuarioId);
        if (!nuevoUsuario && selectedUsuarioId !== 'none') continue;

        const success = await actualizarAsignacionReporte(reporte, nuevoUsuario || systemUser, systemUser);
        if (success) {
          successCount++;
          setReportes(prevReportes => 
            prevReportes.map(r => 
              r.id === reporteId ? { ...r, asignadoA: nuevoUsuario || undefined } : r
            )
          );
          setFilteredReportes(prevReportes => 
            prevReportes.map(r => 
              r.id === reporteId ? { ...r, asignadoA: nuevoUsuario || undefined } : r
            )
          );
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

    setSelectedReportes(new Set());
    setSelectedUsuarioId('');
  };

  const handleBulkActivoUpdate = async () => {
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

        const success = await actualizarEstadoActivoReporte(reporte, selectedActivo, systemUser);
        if (success) {
          successCount++;
          setReportes(prevReportes => 
            prevReportes.map(r => 
              r.id === reporteId ? { ...r, activo: selectedActivo } : r
            )
          );
          setFilteredReportes(prevReportes => 
            prevReportes.map(r => 
              r.id === reporteId ? { ...r, activo: selectedActivo } : r
            )
          );
        } else {
          errorCount++;
        }
      } catch (error) {
        console.error(`Error al actualizar el estado activo del reporte ${reporteId}:`, error);
        errorCount++;
      }
    }

    if (successCount > 0) {
      toast.success(`Se ${selectedActivo ? 'activaron' : 'desactivaron'} ${successCount} reportes correctamente`);
    }
    if (errorCount > 0) {
      toast.error(`Hubo errores al actualizar ${errorCount} reportes`);
    }

    setSelectedReportes(new Set());
    setSelectedActivo(true);
  };

  const handleBulkPrioridadUpdate = async () => {
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
    let skippedCount = 0;

    for (const reporteId of selectedReportes) {
      try {
        const reporte = reportes.find(r => r.id === reporteId);
        if (!reporte) continue;

        if (!reporte.activo) {
          skippedCount++;
          continue;
        }

        const nuevaPrioridad = selectedPrioridadId === 'none' ? undefined : prioridades.find(p => p.id === selectedPrioridadId);
        if (!nuevaPrioridad && selectedPrioridadId !== 'none') continue;

        const success = await actualizarPrioridadReporte(reporte, nuevaPrioridad, systemUser);
        if (success) {
          successCount++;
          setReportes(prevReportes => 
            prevReportes.map(r => 
              r.id === reporteId ? { ...r, prioridad: nuevaPrioridad } : r
            )
          );
          setFilteredReportes(prevReportes => 
            prevReportes.map(r => 
              r.id === reporteId ? { ...r, prioridad: nuevaPrioridad } : r
            )
          );
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

    setSelectedReportes(new Set());
    setSelectedPrioridadId('');
  };

  const handleBulkDelete = () => {
    const reportesSeleccionados = reportes.filter(reporte => 
      selectedReportes.has(reporte.id) && reporte.activo
    );
    setReportesAEliminar(reportesSeleccionados);
    setShowDeleteDialog(true);
  };

  const handleDeleteReporte = (reporte: Reporte) => {
    setReporteAEliminar(reporte);
    setShowDeleteDialog(true);
  };

  const confirmarEliminacion = async () => {
    try {
      if (reportesAEliminar.length > 0) {
        let successCount = 0;
        let errorCount = 0;
        let skippedCount = 0;

        for (const reporte of reportesAEliminar) {
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
              setReportes(prevReportes => 
                prevReportes.filter(r => r.id !== reporte.id)
              );
              setFilteredReportes(prevReportes => 
                prevReportes.filter(r => r.id !== reporte.id)
              );
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
      } else if (reporteAEliminar) {
        const success = await eliminarReport(reporteAEliminar, {
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
          setReportes(prevReportes => 
            prevReportes.filter(reporte => reporte.id !== reporteAEliminar.id)
          );
          setFilteredReportes(prevReportes => 
            prevReportes.filter(reporte => reporte.id !== reporteAEliminar.id)
          );
          toast.success('Reporte eliminado correctamente');
        }
      }
    } catch (error) {
      console.error('Error al eliminar los reportes:', error);
      toast.error('Error al eliminar los reportes');
    } finally {
      setShowDeleteDialog(false);
      setReporteAEliminar(null);
      setReportesAEliminar([]);
      setSelectedReportes(new Set());
    }
  };




  return (
    <div className="space-y-6">

        {selectedReportes.size > 0 && (
          <div className="flex items-center gap-4 p-4 rounded-md border">
            <div className="flex-1">
              <span className="text-sm font-medium text-gray-700">
                {selectedReportes.size} {selectedReportes.size === 1 ? 'reporte seleccionado' : 'reportes seleccionados'}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-4">
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
                  size="sm"
                >
                  Actualizar Categorías
                </Button>
              </div>

              <div className="flex items-center gap-4">
              <div className="w-[200px]">                  <Select
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
                  size="sm"
                  disabled={!selectedEstado.id}
                >
                  Actualizar Estados
                </Button>
              </div>

              <div className="flex items-center gap-4">
              <div className="w-[200px]">                  <Select
                    value={selectedUsuarioId}
                    onValueChange={setSelectedUsuarioId}
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
                  onClick={handleBulkAsignacionUpdate}
                  variant="default"
                  size="sm"
                  disabled={!selectedUsuarioId}
                >
                  Actualizar Asignaciones
                </Button>
              </div>

              <div className="flex items-center gap-4">
              <div className="w-[200px]">                  <Select
                    value={selectedPrioridadId}
                    onValueChange={setSelectedPrioridadId}
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
                  onClick={handleBulkPrioridadUpdate}
                  variant="default"
                  size="sm"
                  disabled={!selectedPrioridadId}
                >
                  Actualizar Prioridades
                </Button>
              </div>

              <div className="flex items-center gap-4">
              <div className="w-[200px]">                  <Select
                    value={selectedActivo ? 'activo' : 'inactivo'}
                    onValueChange={(value) => setSelectedActivo(value === 'activo')}
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
                  onClick={handleBulkActivoUpdate}
                  variant="default"
                  size="sm"
                  disabled={selectedActivo === undefined}
                >
                  Actualizar Estado Activo
                </Button>
              </div>

              <div className="flex items-center gap-4">
                <Button
                  onClick={handleBulkDelete}
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
                  setSelectedReportes(new Set());
                  setSelectedCategoriaId('');
                  setSelectedEstado(getEstados()[0]);
                  setSelectedUsuarioId('');
                  setSelectedPrioridadId('');
                  setSelectedActivo(true);
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
                    checked={isAllSelected}
                    indeterminate={isSomeSelected && !isAllSelected}
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
                      value={reporte.categoria?.id || 'none'}
                      onValueChange={async (value) => {
                        const nuevaCategoria = value === 'none' ? undefined : getCategories().find(c => c.id === value);
                        if (nuevaCategoria || value === 'none') {
                          await actualizarCategoriaReporte(reporte, nuevaCategoria, getSystemUser());
                          setReportes(prev => prev.map(r => r.id === reporte.id ? { ...r, categoria: nuevaCategoria } : r));
                        }
                      }}
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
                      onValueChange={async (value) => {
                        const nuevoEstado = getEstados().find(e => e.id === value);
                        if (nuevoEstado) {
                          await actualizarEstadoReporte(reporte, nuevoEstado, getSystemUser());
                          setReportes(prev => prev.map(r => r.id === reporte.id ? { ...r, estado: nuevoEstado } : r));
                        }
                      }}
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
                      onValueChange={async (value) => {
                        let nuevoUsuario = null;
                        if (value !== 'none') {
                          nuevoUsuario = usuarios.find(u => u.id === value);
                        }
                        await actualizarAsignacionReporte(reporte, nuevoUsuario, getSystemUser());
                        setReportes(prev => prev.map(r => r.id === reporte.id ? { ...r, asignadoA: nuevoUsuario || undefined } : r));
                      }}
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
                      onClick={() => navigate(`/admin/reportes/${reporte.id}/editar`)}
                    >
                      <Pencil className="w-4 h-4 text-muted-foreground" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteReporte(reporte)}
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
        onPageChange={setCurrentPage}
        totalItems={filteredData.length}
        itemsPerPage={ITEMS_PER_PAGE}
      />

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              {reportesAEliminar.length > 0 ? (
                <>
                  Esta acción no se puede deshacer. Se eliminarán permanentemente {reportesAEliminar.length} reportes activos seleccionados.
                </>
              ) : (
                <>
                  Esta acción no se puede deshacer. Se eliminará permanentemente el reporte{' '}
                  <span className="font-semibold">{reporteAEliminar?.titulo}</span>.
                </>
              )}
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
