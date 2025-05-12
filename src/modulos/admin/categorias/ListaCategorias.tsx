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
  CheckIcon
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
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { filterCategories, getCategories, getReportesPorCategoria, sortCategories, updateCategory } from '@/controller/CRUD/categoryController';
import { toast } from 'sonner';
import FilterByValues from '@/components/common/FilterByValues';
import SearchFilterBar from '@/components/layout/SearchFilterBar';
import { Checkbox } from '@/components/ui/checkbox';
import { actualizarEstadoCategoria } from '@/controller/controller/actualizarEstadoCategoria';
import { getSystemUser } from '@/utils/userUtils';
import { deleteCategoryAndUpdateHistory } from '@/controller/controller/categoryDeleteController';
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

const ListaCategorias: React.FC = () => {
  const navigate = useNavigate();
  const [categorias, setCategorias] = useState(getCategories());
  const [filteredCategorias, setFilteredCategorias] = useState(categorias);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('nombre');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [currentField, setCurrentField] = useState<string | undefined>('nombre');
  const [selectedFilterValues, setSelectedFilterValues] = useState<any[]>([]);
  const [selectedCategorias, setSelectedCategorias] = useState<Set<string>>(new Set());
  const categoriasPerPage = 10;
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [categoriaAEliminar, setCategoriaAEliminar] = useState<string | null>(null);

  const sortOptions = [
    { value: 'nombre', label: 'Nombre' },
    { value: 'descripcion', label: 'Descripción' },
    { value: 'reportes', label: 'Reportes' },
    { value: 'fechaCreacion', label: 'Fecha creación' }
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
  const indexOfLastCategoria = currentPage * categoriasPerPage;
  const indexOfFirstCategoria = indexOfLastCategoria - categoriasPerPage;
  const currentCategorias = filteredCategorias.slice(indexOfFirstCategoria, indexOfLastCategoria);
  const totalPages = Math.ceil(filteredCategorias.length / categoriasPerPage);

  // Función para obtener el valor del campo según el campo actual
  const getFieldValue = (categoria: any, field: string): string => {
    switch (field) {
      case 'nombre':
        return categoria.nombre;
      case 'descripcion':
        return categoria.descripcion || 'Sin descripción';
      case 'reportes':
        return getReportesPorCategoria(categoria.id).toString();
      case 'fechaCreacion':
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

  const handleDeleteClick = (categoriaId: string) => {
    setCategoriaAEliminar(categoriaId);
    setShowDeleteDialog(true);
  };

  const handleDeleteCategoria = async (categoriaId: string) => {
    try {
      const resultado = await deleteCategoryAndUpdateHistory(categoriaId, getSystemUser());
      
      if (resultado.success) {
        toast.success(resultado.message);
        // Actualizar la lista de categorías
        setCategorias(prevCategorias => prevCategorias.filter(cat => cat.id !== categoriaId));
      } else {
        toast.error(resultado.message);
      }
    } catch (error) {
      toast.error('Error al eliminar la categoría');
    } finally {
      setShowDeleteDialog(false);
      setCategoriaAEliminar(null);
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
      setSelectedCategorias(new Set(currentCategorias.map(categoria => categoria.id)));
    } else {
      setSelectedCategorias(new Set());
    }
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
          onSortByChange={setSortBy}
          sortDirection={sortDirection}
          onSortDirectionChange={handleToggleSortDirection}
          currentField={currentField}
          onCurrentFieldChange={setCurrentField}
          onFilterChange={handleFilterChange}
          onExport={handleExport}
          onNewItem={handleNuevaCategoria}
          items={categorias}
          getFieldValue={getFieldValue}
          newButtonLabel="Nueva Categoría"
          sortOptions={sortOptions}
          filteredCount={filteredCategorias.length}
          totalCount={categorias.length}
          itemLabel="categorías"
          filterOptions={filterOptions}
        />

        {selectedCategorias.size > 0 && (
          <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-md border">
            <div className="flex-1">
              <span className="text-sm font-medium text-gray-700">
                {selectedCategorias.size} {selectedCategorias.size === 1 ? 'categoría seleccionada' : 'categorías seleccionadas'}
              </span>
            </div>
            <div className="flex items-center gap-4">
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
              <TableRow className="bg-gray-50">
                <TableHead className="w-[50px]">
                  <Checkbox
                    checked={selectedCategorias.size === currentCategorias.length && currentCategorias.length > 0}
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
        {filteredCategorias.length > categoriasPerPage && (
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500">
              Página {currentPage} de {totalPages}
            </div>
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious 
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
                  />
                </PaginationItem>
                
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter(page => 
                    page === 1 || 
                    page === totalPages || 
                    (page >= currentPage - 1 && page <= currentPage + 1)
                  )
                  .map((page, i, array) => {
                    // Determinar si necesitamos mostrar puntos suspensivos
                    const showEllipsisBefore = i > 0 && array[i - 1] !== page - 1;
                    const showEllipsisAfter = i < array.length - 1 && array[i + 1] !== page + 1;
                    
                    return (
                      <React.Fragment key={page}>
                        {showEllipsisBefore && (
                          <PaginationItem>
                            <span className="flex h-9 w-9 items-center justify-center text-gray-400">...</span>
                          </PaginationItem>
                        )}
                        
                        <PaginationItem>
                          <PaginationLink
                            onClick={() => setCurrentPage(page)}
                            isActive={currentPage === page}
                          >
                            {page}
                          </PaginationLink>
                        </PaginationItem>
                        
                        {showEllipsisAfter && (
                          <PaginationItem>
                            <span className="flex h-9 w-9 items-center justify-center text-gray-400">...</span>
                          </PaginationItem>
                        )}
                      </React.Fragment>
                    );
                  })
                }
                
                <PaginationItem>
                  <PaginationNext 
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </div>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Se eliminará permanentemente la categoría{' '}
              <span className="font-semibold">
                {categorias.find(cat => cat.id === categoriaAEliminar)?.nombre}
              </span>
              {categoriaAEliminar && getReportesPorCategoria(categoriaAEliminar) > 0 && (
                <span>
                  {' '}y se actualizarán {getReportesPorCategoria(categoriaAEliminar)} reportes asociados.
                </span>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => categoriaAEliminar && handleDeleteCategoria(categoriaAEliminar)}
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

export default ListaCategorias;
