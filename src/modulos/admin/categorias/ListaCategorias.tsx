import React, { Component } from 'react';
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
import { Categoria, Rol } from '@/types/tipos';
import SearchFilterBar from '@/components/SearchFilterBar/SearchFilterBar';
import { exportToCSV } from '@/utils/exportUtils';

interface ListaCategoriasProps {
  navigate: (path: string) => void;
}

interface ListaCategoriasState {
  categorias: Categoria[];
  filteredCategorias: Categoria[];
  searchTerm: string;
  sortBy: 'nombre' | 'descripcion' | 'reportes' | 'estado' | 'fecha';
  sortDirection: 'asc' | 'desc';
  currentPage: number;
  selectedCategorias: Set<string>;
  showDeleteDialog: boolean;
  categoriasAEliminar: string[];
  isDeleting: boolean;
  showBulkUpdateDialog: boolean;
  isUpdating: boolean;
  selectedEstado: 'activo' | 'inactivo';
  selectedFilterValues: any[];
  isLoading: boolean;
}

const itemsPerPage = 5;

class ListaCategorias extends Component<ListaCategoriasProps, ListaCategoriasState> {
  private readonly ATTRIBUTES = [
    { label: "Nombre", value: "nombre", type: "string" as "string" },
    { label: "Descripción", value: "descripcion", type: "string" as "string" },
    { 
      label: "Reportes", 
      value: "numReportes", 
      type: "function" as "function",
      getValue: (item: any) => getReportesPorCategoria(item.id)
    },
    { label: "Fecha Creación", value: "fechaCreacion", type: "date" as "date" },
  ];

  private readonly PROPERTY_FILTERS = [
    { label: "Estado", value: "activo", property: "activo", type: "boolean" as "boolean" },
  ];

  constructor(props: ListaCategoriasProps) {
    super(props);
    this.state = {
      categorias: getCategories(),
      filteredCategorias: getCategories(),
      searchTerm: '',
      sortBy: 'nombre',
      sortDirection: 'asc',
      currentPage: 1,
      selectedCategorias: new Set(),
      showDeleteDialog: false,
      categoriasAEliminar: [],
      isDeleting: false,
      showBulkUpdateDialog: false,
      isUpdating: false,
      selectedEstado: 'activo',
      selectedFilterValues: [],
      isLoading: true
    };
  }

  componentDidMount() {
    this.loadCategorias();
  }

  componentDidUpdate(prevProps: ListaCategoriasProps, prevState: ListaCategoriasState) {
    if (
      prevState.searchTerm !== this.state.searchTerm ||
      prevState.sortBy !== this.state.sortBy ||
      prevState.sortDirection !== this.state.sortDirection ||
      prevState.selectedFilterValues !== this.state.selectedFilterValues
    ) {
      this.applyFiltersAndSorting();
    }
  }

  loadCategorias = () => {
    this.setState({ isLoading: true });
    try {
      const data = getCategories();
      this.setState({
        categorias: data,
        filteredCategorias: data,
        isLoading: false
      });
    } catch (error) {
      toast.error("Error al cargar categorías");
      this.setState({ isLoading: false });
    }
  };

  applyFiltersAndSorting = () => {
    let result = [...this.state.categorias];

    // Aplicar búsqueda
    if (this.state.searchTerm) {
      const term = this.state.searchTerm.toLowerCase();
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

    // Aplicar filtros
    const filterValues = this.state.selectedFilterValues.filter(value => !value.includes(':'));
    const filterStates = this.state.selectedFilterValues.filter(value => value.startsWith('estado:')).map(value => value.split(':')[1]);

    if (filterValues.length > 0) {
      result = result.filter(cat => 
        filterValues.includes(this.getFieldValue(cat, this.state.sortBy))
      );
    }

    if (filterStates.length > 0) {
      result = result.filter(cat => 
        filterStates.includes(cat.activo ? 'Activo' : 'Inactivo')
      );
    }

    // Aplicar ordenamiento
    result = this.sortCategories(result, this.state.sortBy, this.state.sortDirection);
    
    this.setState({
      filteredCategorias: result,
      currentPage: 1
    });
  };

  getFieldValue = (categoria: any, field: string): string => {
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

  sortCategories = (categories: Categoria[], sortBy: string, sortDirection: 'asc' | 'desc'): Categoria[] => {
    return [...categories].sort((a, b) => {
      let valueA: any;
      let valueB: any;

      if (sortBy === 'reportes') {
        valueA = Number(getReportesPorCategoria(a.id));
        valueB = Number(getReportesPorCategoria(b.id));
      } else if (sortBy === 'fechaCreacion') {
        valueA = new Date(a.fechaCreacion).getTime();
        valueB = new Date(b.fechaCreacion).getTime();
      } else if (sortBy === 'estado') {
        valueA = a.activo ? 'Activo' : 'Inactivo';
        valueB = b.activo ? 'Activo' : 'Inactivo';
      } else {
        valueA = a[sortBy as keyof Categoria];
        valueB = b[sortBy as keyof Categoria];
      }

      if (typeof valueA === 'number' && typeof valueB === 'number') {
        return sortDirection === 'asc' ? valueA - valueB : valueB - valueA;
      }

      const strA = String(valueA);
      const strB = String(valueB);
      return sortDirection === 'asc' 
        ? strA.localeCompare(strB)
        : strB.localeCompare(strA);
    });
  };

  handlePageChange = (page: number) => {
    const totalPages = Math.ceil(this.state.filteredCategorias.length / itemsPerPage);
    if (page >= 1 && page <= totalPages) {
      this.setState({ currentPage: page });
    }
  };

  handleFilterChange = (newData: any[], filters: any) => {
    this.setState({ 
      filteredCategorias: newData,
      currentPage: 1 
    });
  };

  handleSelectCategoria = (categoriaId: string, checked: boolean) => {
    this.setState(prev => {
      const newSelected = new Set(prev.selectedCategorias);
      if (checked) {
        newSelected.add(categoriaId);
      } else {
        newSelected.delete(categoriaId);
      }
      return { selectedCategorias: newSelected };
    });
  };

  handleSelectAll = (checked: boolean) => {
    if (checked) {
      this.setState({ selectedCategorias: new Set(this.state.filteredCategorias.map(categoria => categoria.id)) });
    } else {
      this.setState({ selectedCategorias: new Set() });
    }
  };

  get isAllSelected(): boolean {
    return this.state.filteredCategorias.length > 0 && 
      this.state.filteredCategorias.every(categoria => this.state.selectedCategorias.has(categoria.id));
  }

  get isSomeSelected(): boolean {
    return this.state.filteredCategorias.some(categoria => this.state.selectedCategorias.has(categoria.id));
  }

  handleEstadoChange = async (categoriaId: string) => {
    const categoria = this.state.categorias.find(cat => cat.id === categoriaId);
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
      
      this.setState(prev => ({
        categorias: prev.categorias.map(cat => {
          if (cat.id === categoriaId) {
            return { ...cat, activo: nuevoEstado };
          }
          return cat;
        })
      }));
    }
  };

  handleBulkDelete = () => {
    this.setState({ 
      categoriasAEliminar: Array.from(this.state.selectedCategorias),
      showDeleteDialog: true 
    });
  };

  handleDeleteCategorias = async () => {
    if (this.state.categoriasAEliminar.length === 0) return;

    this.setState({ isDeleting: true });
    try {
      let successCount = 0;
      let errorCount = 0;
      let totalAffectedReports = 0;

      for (const categoriaId of this.state.categoriasAEliminar) {
        const resultado = await deleteCategoryAndUpdateHistory(categoriaId, getSystemUser());
        
        if (resultado.success) {
          successCount++;
          totalAffectedReports += resultado.affectedReports || 0;
          this.setState(prev => ({
            categorias: prev.categorias.filter(cat => cat.id !== categoriaId)
          }));
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

      this.setState({ selectedCategorias: new Set() });
    } catch (error) {
      console.error('Error al eliminar las categorías:', error);
      toast.error('Error al eliminar las categorías');
    } finally {
      this.setState({ 
        isDeleting: false, 
        showDeleteDialog: false, 
        categoriasAEliminar: [] 
      });
    }
  };

  handleBulkEstadoUpdate = async () => {
    if (this.state.selectedCategorias.size === 0) return;

    this.setState({ isUpdating: true });
    try {
      const categoriasSeleccionadas = this.state.categorias.filter(cat => this.state.selectedCategorias.has(cat.id));
      const resultados = await Promise.all(
        categoriasSeleccionadas.map(categoria =>
          actualizarEstadoCategoria(
            categoria,
            this.state.selectedEstado === 'activo',
            getSystemUser(),
            `Actualización masiva de estado a ${this.state.selectedEstado === 'activo' ? 'Activo' : 'Inactivo'}`
          )
        )
      );

      const exitosos = resultados.filter(Boolean).length;
      const fallidos = resultados.length - exitosos;

      if (exitosos > 0) {
        toast.success(`${exitosos} categorías actualizadas correctamente`);
        this.setState(prev => ({
          categorias: prev.categorias.map(cat => {
            if (this.state.selectedCategorias.has(cat.id)) {
              return { ...cat, activo: this.state.selectedEstado === 'activo' };
            }
            return cat;
          })
        }));
      }

      if (fallidos > 0) {
        toast.error(`${fallidos} categorías no pudieron ser actualizadas`);
      }

      this.setState({ selectedCategorias: new Set() });
      this.setState({ showBulkUpdateDialog: false });
    } catch (error) {
      toast.error('Error al actualizar las categorías');
    } finally {
      this.setState({ isUpdating: false });
    }
  };

  handleDeleteClick = (categoriaId: string) => {
    this.setState({ 
      categoriasAEliminar: [categoriaId],
      showDeleteDialog: true 
    });
  };

  handleExport = (data: any[]) => {
    try {
      exportToCSV(
        data,
        `informes-${new Date().toLocaleDateString().replace(/\//g, '-')}`,
        Object.fromEntries(this.ATTRIBUTES.map(attr => [attr.value, attr.label]))
      );
      toast.success(`Se han exportado ${data.length} registros en formato CSV`);
    } catch (error) {
      console.error("Error al exportar:", error);
      toast.error("No se pudo completar la exportación de datos");
    }
  };

  handleNavigate = () => {
    this.props.navigate("/admin/categorias/nueva");
  };

  render() {
    const { filteredCategorias, currentPage, isLoading } = this.state;
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentCategorias = filteredCategorias.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredCategorias.length / itemsPerPage);

    return (
      <div>
        <div className="space-y-4">
          <SearchFilterBar
            data={this.state.categorias}
            onFilterChange={this.handleFilterChange}
            attributes={this.ATTRIBUTES}
            propertyFilters={this.PROPERTY_FILTERS}
            searchPlaceholder="Buscar categorías..."
            resultLabel="categorías"
            exportLabel="Exportar CSV"
            exportFunction={this.handleExport}
            navigateFunction={this.handleNavigate}
            navigateLabel="Nueva Categoría"
          />

          {this.state.selectedCategorias.size > 0 && (
            <div className="flex items-center gap-4 p-4 rounded-md border">
              <div className="flex-1">
                <span className="text-sm font-medium text-gray-700">
                  {this.state.selectedCategorias.size} {this.state.selectedCategorias.size === 1 ? 'categoría seleccionada' : 'categorías seleccionadas'}
                </span>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-[200px]">
                  <Select
                    value={this.state.selectedEstado}
                    onValueChange={(value: 'activo' | 'inactivo') => this.setState({ selectedEstado: value })}
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
                  onClick={this.handleBulkEstadoUpdate}
                  variant="default"
                >
                  Actualizar Estados
                </Button>
                <Button
                  onClick={this.handleBulkDelete}
                  variant="destructive"
                  disabled={this.state.isDeleting}
                >
                  Eliminar Seleccionadas
                </Button>
                <Button
                  onClick={() => this.setState({ selectedCategorias: new Set() })}
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
                      checked={this.isAllSelected}
                      indeterminate={this.isSomeSelected && !this.isAllSelected}
                      onCheckedChange={this.handleSelectAll}
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
                            checked={this.state.selectedCategorias.has(categoria.id)}
                            onCheckedChange={(checked) => this.handleSelectCategoria(categoria.id, checked as boolean)}
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
                            onClick={() => this.handleEstadoChange(categoria.id)}
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
                              onClick={() => this.handleDeleteClick(categoria.id)}
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
          
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={this.handlePageChange}
            totalItems={filteredCategorias.length}
            itemsPerPage={itemsPerPage}
          />
        </div>

        <AlertDialog open={this.state.showDeleteDialog} onOpenChange={(open) => this.setState({ showDeleteDialog: open })}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
              <AlertDialogDescription>
                Esta acción no se puede deshacer. Se eliminarán permanentemente {this.state.categoriasAEliminar.length} categorías seleccionadas.
                Los reportes asociados serán actualizados a "Sin categoría".
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction 
                onClick={this.handleDeleteCategorias}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                disabled={this.state.isDeleting}
              >
                {this.state.isDeleting ? 'Eliminando...' : 'Eliminar'}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    );
  }
}

// Create a wrapper component to provide navigation
const ListaCategoriasWithNavigation: React.FC = () => {
  const navigate = useNavigate();
  return <ListaCategorias navigate={navigate} />;
};

export default ListaCategoriasWithNavigation;
