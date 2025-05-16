import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  PlusIcon, 
  PencilIcon, 
  Trash2Icon, 
  SearchIcon, 
  FilterIcon, 
  ArrowDownIcon, 
  ArrowUpIcon, 
  DownloadIcon,
  CheckIcon,
  X
} from 'lucide-react';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import Pagination from '@/components/layout/Pagination';
import { filterCategories, getCategories, getReportesPorCategoria, sortCategories, updateCategory } from '@/controller/CRUD/category/categoryController';
import { toast } from 'sonner';
import FilterByValues from '@/components/common/FilterByValues';
import SearchFilterBar from '@/components/layout/SearchFilterBar';
import { Checkbox } from '@/components/ui/checkbox';
import { actualizarEstadoCategoria } from '@/controller/controller/category/actualizarEstadoCategoria';
import { getSystemUser } from '@/utils/userUtils';
import { deleteCategoryAndUpdateHistory } from '@/controller/controller/category/categoryDeleteController';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Categoria } from '@/types/tipos';
const ListaCategorias: React.FC = () => {
  const navigate = useNavigate();
  const [categorias, setCategorias] = useState(getCategories());
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'nombre' | 'descripcion' | 'reportes' | 'estado' | 'fecha'>('nombre');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);

  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [currentField, setCurrentField] = useState<string | undefined>('nombre');
  const [selectedFilterValues, setSelectedFilterValues] = useState<any[]>([]);
  const [selectedCategorias, setSelectedCategorias] = useState<Set<string>>(new Set());
  const categoriasPerPage = 10;
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [categoriasAEliminar, setCategoriasAEliminar] = useState<string[]>([]);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showBulkUpdateDialog, setShowBulkUpdateDialog] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [selectedEstado, setSelectedEstado] = useState<'activo' | 'inactivo'>('activo');
  const [filteredCategorias, setFilteredCategorias] = useState<Categoria[]>([]);
  const itemsPerPage = 5;

  const sortOptions = [
    { value: 'nombre', label: 'Nombre' },
    { value: 'descripcion', label: 'Descripción' },
    { value: 'reportes', label: 'Reportes' },
    { value: 'estado', label: 'Estado' },
    { value: 'fecha', label: 'Fecha creación' }
  ];

  const filterOptions = [
    { value: 'estado', label: 'Estado' }
  ];

  useEffect(() => {
    // Cargar categorías
    setIsLoading(true);
    try {
      const categoriasData = getCategories();
      setCategorias(categoriasData);
      setFilteredCategorias(categoriasData);
      setIsLoading(false);
    } catch (error) {
      toast.error("Error al cargar categorías");
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    // Aplicar filtros, búsqueda y ordenamiento
    let result = [...categorias];

    // Aplicar filtro de búsqueda
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        cat =>
              cat.fechaCreacion.toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' }).toLowerCase().includes(term) ||
              (cat.descripcion && cat.descripcion.toLowerCase().includes(term)) ||
              cat.activo.toString().toLowerCase().includes(term) ||
              getReportesPorCategoria(cat.id).toString().toLowerCase().includes(term) ||
              cat.color.toLowerCase().includes(term) ||
              cat.id.toString().toLowerCase().includes(term) ||
              cat.nombre.toLowerCase().includes(term)
      );
    }

    // Separar los valores de filtro por tipo
    const filterValues = selectedFilterValues.filter(value => !value.includes(':'));
    const filterStates = selectedFilterValues.filter(value => value.startsWith('estado:')).map(value => value.split(':')[1]);

    // Aplicar filtro de valores (si hay valores seleccionados)
    if (filterValues.length > 0) {
      result = result.filter(cat => 
        filterValues.includes(getFieldValue(cat, sortBy))
      );
    }

    // Aplicar filtro de estados sobre el resultado anterior
    if (filterStates.length > 0) {
      result = result.filter(cat => 
        filterStates.includes(cat.activo ? 'Activo' : 'Inactivo')
      );
    }

    // Aplicar ordenamiento
    result = sortCategories(result, sortBy, sortDirection);

    setFilteredCategorias(result);
    setCurrentPage(1);
  }, [categorias, searchTerm, sortBy, sortDirection, selectedFilterValues]);

  // Paginación
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentCategorias = filteredCategorias.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredCategorias.length / itemsPerPage);

  // Función para obtener el valor del campo según el campo actual
  const getFieldValue = (categoria: any, field: string): string => {
    switch (field) {
      case 'nombre':
        return categoria.nombre;
      case 'descripcion':
        return categoria.descripcion || 'Sin descripción';
      case 'reportes':
        return getReportesPorCategoria(categoria.id).toString();
      case 'fecha':
        return new Date(categoria.fechaCreacion).toLocaleDateString('es-ES');
      case 'estado':
        return categoria.activo ? 'Activo' : 'Inactivo';
      default:
        return '';
    }
  };

  const handleToggleSortDirection = () => {
    setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
  };

  const handleFilterChange = (values: any[]) => {
    setSelectedFilterValues(values);
  };

  const handleExport = () => {
    // Implementación de exportación
    const data = filteredCategorias.map(cat => {
      return {
        id: cat.id,
        nombre: cat.nombre,
        descripcion: cat.descripcion || '',
        numReportes: getReportesPorCategoria(cat.id),
        estado: cat.activo ? 'Activo' : 'Inactivo',
        fechaCreacion: cat.fechaCreacion instanceof Date 
          ? cat.fechaCreacion.toLocaleDateString('es-ES') 
          : new Date(cat.fechaCreacion).toLocaleDateString('es-ES')
      };
    });

    // Crear CSV
    const headers = ['ID', 'Nombre', 'Descripción', 'Num. Reportes', 'Estado', 'Fecha Creación'];
    const csvContent = [
      headers.join(','),
      ...data.map(row => [
        row.id,
        `"${row.nombre}"`,
        `"${row.descripcion}"`,
        row.numReportes,
        row.estado,
        row.fechaCreacion
      ].join(','))
    ].join('\n');

    // Crear y descargar el archivo
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `categorias-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success('Archivo exportado correctamente');
  };

  const clearFilters = () => {
    setSearchTerm('');
    setStatusFilter(null);
    setSortBy('nombre');
    setSortDirection('asc');
    setSelectedFilterValues([]);
    setCurrentField('nombre');
  };

  const handleNuevaCategoria = () => {
    navigate('/admin/categorias/nuevo');
  };

  // New function to toggle category status
  const handleEstadoChange = async (categoriaId: string) => {
    const categoria = categorias.find(cat => cat.id === categoriaId);
    if (categoria) {
      const nuevoEstado = !categoria.activo;
      
      const resultado = await actualizarEstadoCategoria(
        categoria,
        nuevoEstado,
        getSystemUser(),
        `Cambio de estado a ${nuevoEstado ? 'Activo' : 'Inactivo'}`
      );
      
      if (!resultado) {
        toast.error('Error al actualizar el estado de la categoría');
        return;
      }
      
      setCategorias(prevCategorias => prevCategorias.map(cat => {
        if (cat.id === categoriaId) {
          return { ...cat, activo: nuevoEstado };
        }
        return cat;
      }));
    }
  };

  const handleBulkDelete = () => {
    setCategoriasAEliminar(Array.from(selectedCategorias));
    setShowDeleteDialog(true);
  };

  const handleDeleteCategorias = async () => {
    if (categoriasAEliminar.length === 0) return;

    setIsDeleting(true);
    try {
      let successCount = 0;
      let errorCount = 0;
      let totalAffectedReports = 0;

      for (const categoriaId of categoriasAEliminar) {
        const resultado = await deleteCategoryAndUpdateHistory(categoriaId, getSystemUser());
        
        if (resultado.success) {
          successCount++;
          totalAffectedReports += resultado.affectedReports || 0;
          // Actualizar la lista de categorías
          setCategorias(prevCategorias => prevCategorias.filter(cat => cat.id !== categoriaId));
        } else {
          errorCount++;
        }
      }

      if (successCount > 0) {
        toast.success(`Se eliminaron ${successCount} categorías correctamente`);
        if (totalAffectedReports > 0) {
          toast.info(`${totalAffectedReports} reportes fueron actualizados a "Sin categoría"`);
        }
      }
      if (errorCount > 0) {
        toast.error(`Hubo errores al eliminar ${errorCount} categorías`);
      }

      setSelectedCategorias(new Set());
    } catch (error) {
      console.error('Error al eliminar las categorías:', error);
      toast.error('Error al eliminar las categorías');
    } finally {
      setIsDeleting(false);
      setShowDeleteDialog(false);
      setCategoriasAEliminar([]);
    }
  };

  const handleBulkUpdate = async (nuevoEstado: boolean) => {
    if (selectedCategorias.size === 0) return;

    setIsUpdating(true);
    try {
      const categoriasSeleccionadas = categorias.filter(cat => selectedCategorias.has(cat.id));
      const resultados = await Promise.all(
        categoriasSeleccionadas.map(categoria =>
          actualizarEstadoCategoria(
            categoria,
            nuevoEstado,
            getSystemUser(),
            `Actualización masiva de estado a ${nuevoEstado ? 'Activo' : 'Inactivo'}`
          )
        )
      );

      const exitosos = resultados.filter(Boolean).length;
      const fallidos = resultados.length - exitosos;

      if (exitosos > 0) {
        toast.success(`${exitosos} categorías actualizadas correctamente`);
        // Actualizar la lista de categorías
        setCategorias(prevCategorias =>
          prevCategorias.map(cat => {
            if (selectedCategorias.has(cat.id)) {
              return { ...cat, activo: nuevoEstado };
            }
            return cat;
          })
        );
      }

      if (fallidos > 0) {
        toast.error(`${fallidos} categorías no pudieron ser actualizadas`);
      }

      setSelectedCategorias(new Set());
      setShowBulkUpdateDialog(false);
    } catch (error) {
      toast.error('Error al actualizar las categorías');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleBulkEstadoUpdate = async () => {
    if (selectedCategorias.size === 0) return;

    setIsUpdating(true);
    try {
      const categoriasSeleccionadas = categorias.filter(cat => selectedCategorias.has(cat.id));
      const resultados = await Promise.all(
        categoriasSeleccionadas.map(categoria =>
          actualizarEstadoCategoria(
            categoria,
            selectedEstado === 'activo',
            getSystemUser(),
            `Actualización masiva de estado a ${selectedEstado === 'activo' ? 'Activo' : 'Inactivo'}`
          )
        )
      );

      const exitosos = resultados.filter(Boolean).length;
      const fallidos = resultados.length - exitosos;

      if (exitosos > 0) {
        toast.success(`${exitosos} categorías actualizadas correctamente`);
        // Actualizar la lista de categorías
        setCategorias(prevCategorias =>
          prevCategorias.map(cat => {
            if (selectedCategorias.has(cat.id)) {
              return { ...cat, activo: selectedEstado === 'activo' };
            }
            return cat;
          })
        );
      }

      if (fallidos > 0) {
        toast.error(`${fallidos} categorías no pudieron ser actualizadas`);
      }

      setSelectedCategorias(new Set());
      setShowBulkUpdateDialog(false);
    } catch (error) {
      toast.error('Error al actualizar las categorías');
    } finally {
      setIsUpdating(false);
    }
  };

  // Contar los resultados después de aplicar los filtros
  const filteredCount = filteredCategorias.length;
  const totalCount = categorias.length;

  const handleSelectCategoria = (categoriaId: string, checked: boolean) => {
    setSelectedCategorias(prev => {
      const newSelected = new Set(prev);
      if (checked) {
        newSelected.add(categoriaId);
      } else {
        newSelected.delete(categoriaId);
      }
      return newSelected;
    });
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedCategorias(new Set(filteredCategorias.map(categoria => categoria.id)));
    } else {
      setSelectedCategorias(new Set());
    }
  };

  // Determinar si todos los estados filtrados están seleccionados
  const isAllSelected = filteredCategorias.length > 0 && 
    filteredCategorias.every(categoria => selectedCategorias.has(categoria.id));

  // Determinar si algunos estados están seleccionados
  const isSomeSelected = filteredCategorias.some(categoria => selectedCategorias.has(categoria.id));

  const handleDeleteClick = (categoriaId: string) => {
    setCategoriasAEliminar([categoriaId]);
    setShowDeleteDialog(true);
  };

  const handleSortByChange = (value: string) => {
    setSortBy(value as 'nombre' | 'descripcion' | 'reportes' | 'estado' | 'fecha');
  };

  return (
    <div>
      <div className="space-y-4">
        {/* Barra de búsqueda y acciones */}
        <SearchFilterBar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          roleFilter={null}
          onRoleFilterChange={() => {}}
          sortBy={sortBy}
          onSortByChange={handleSortByChange}
          sortDirection={sortDirection}
          onSortDirectionChange={handleToggleSortDirection}
          onCurrentFieldChange={setCurrentField}
          onFilterChange={handleFilterChange}
          onExport={handleExport}
          onNewItem={handleNuevaCategoria}
          items={categorias}
          getFieldValue={getFieldValue}
          newButtonLabel="Nueva Categoría"
          sortOptions={sortOptions}
          filteredCount={filteredCount}
          totalCount={totalCount}
          itemLabel="categorías"
          filterOptions={filterOptions}
        />

        {selectedCategorias.size > 0 && (
          <div className="flex items-center gap-4 p-4rounded-md border">
            <div className="flex-1">
              <span className="text-sm font-medium text-gray-700">
                {selectedCategorias.size} {selectedCategorias.size === 1 ? 'categoría seleccionada' : 'categorías seleccionadas'}
              </span>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-[200px]">
                <Select
                  value={selectedEstado}
                  onValueChange={(value: 'activo' | 'inactivo') => setSelectedEstado(value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar estado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="activo">Activo</SelectItem>
                    <SelectItem value="inactivo">Inactivo</SelectItem>
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
                onClick={handleBulkDelete}
                variant="destructive"
                disabled={isDeleting}
              >
                Eliminar Seleccionadas
              </Button>
              <Button
                onClick={() => setSelectedCategorias(new Set())}
                variant="outline"
              >
                Cancelar
              </Button>
            </div>
          </div>
        )}

        {/* Tabla de categorías */}
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow >
                <TableHead className="w-[50px]">
                  <Checkbox
                    checked={isAllSelected}
                    indeterminate={isSomeSelected && !isAllSelected}
                    onCheckedChange={handleSelectAll}
                    aria-label="Seleccionar todas las categorías"
                  />
                </TableHead>
                <TableHead className="font-semibold text-gray-600">Nombre</TableHead>
                <TableHead className="font-semibold text-gray-600">Descripción</TableHead>
                <TableHead className="font-semibold text-gray-600 text-center">Reportes</TableHead>
                <TableHead className="font-semibold text-gray-600 text-center">Estado</TableHead>
                <TableHead className="font-semibold text-gray-600 text-center">Fecha creación</TableHead>
                <TableHead className="font-semibold text-gray-600 text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    <div className="flex justify-center">
                      <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full"></div>
                    </div>
                  </TableCell>
                </TableRow>
              ) : currentCategorias.length > 0 ? (
                currentCategorias.map((categoria) => {
                  const numReportes = getReportesPorCategoria(categoria.id);
                  
                  return (
                    <TableRow key={categoria.id}>
                      <TableCell className="w-[50px]">
                        <Checkbox
                          checked={selectedCategorias.has(categoria.id)}
                          onCheckedChange={(checked) => handleSelectCategoria(categoria.id, checked as boolean)}
                          aria-label={`Seleccionar categoría ${categoria.nombre}`}
                        />
                      </TableCell>
                      <TableCell>
                        <Link to={`/admin/categorias/${categoria.id}`} className="text-blue-600 hover:underline flex items-center">
                          <div
                            className="w-3 h-3 rounded-full inline-block mr-2"
                            style={{ backgroundColor: categoria.color }}
                          ></div>
                          {categoria.nombre}
                        </Link>
                      </TableCell>
                      <TableCell className="max-w-xs truncate">
                        {categoria.descripcion || 'Sin descripción'}
                      </TableCell>
                      <TableCell className="text-center">{numReportes}</TableCell>
                      <TableCell className="text-center">
                        <Badge 
                          variant={categoria.activo ? 'success' : 'inactive'}
                          className="cursor-pointer"
                          onClick={() => handleEstadoChange(categoria.id)}
                        >
                          {categoria.activo ? 'Activo' : 'Inactivo'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        {new Date(categoria.fechaCreacion).toLocaleDateString('es-ES', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </TableCell>
                      <TableCell>
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            asChild
                          >
                            <Link to={`/admin/categorias/${categoria.id}/editar`}>
                              <PencilIcon className="h-4 w-4 text-gray-500" />
                            </Link>
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-red-500 hover:text-red-600"
                            onClick={() => handleDeleteClick(categoria.id)}
                          >
                            <Trash2Icon className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-4 text-gray-500">
                    No se encontraron categorías con los criterios seleccionados
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        
        {/* Paginación */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          totalItems={filteredCategorias.length}
          itemsPerPage={itemsPerPage}
        />
      </div>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Se eliminarán permanentemente {categoriasAEliminar.length} categorías seleccionadas.
              Los reportes asociados serán actualizados a "Sin categoría".
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteCategorias}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={isDeleting}
            >
              {isDeleting ? 'Eliminando...' : 'Eliminar'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ListaCategorias;
