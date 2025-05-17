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
import Pagination from '@/components/layout/Pagination';
import { EstadoReporte } from '@/types/tipos';
import { toast } from 'sonner';
import { getEstados, updateEstado, deleteEstado } from '@/controller/CRUD/estado/estadoController';
import FilterByValues from '@/components/common/FilterByValues';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent } from '@/components/ui/card';
import SearchFilterBar from '@/components/SearchFilterBar/SearchFilterBar';
import { exportToCSV } from '@/utils/exportUtils';
import { getReportesPorCategoria } from '@/controller/CRUD/category/categoryController';

interface ListaEstadosProps {
  navigate: (path: string) => void;
}

interface ListaEstadosState {
  estados: EstadoReporte[];
  filteredEstados: EstadoReporte[];
  searchTerm: string;
  sortBy: string;
  sortDirection: 'asc' | 'desc';
  currentPage: number;
  selectedEstados: Set<string>;
  isLoading: boolean;
  selectedFilterValues: any[];
}

const itemsPerPage = 5;

class ListaEstados extends Component<ListaEstadosProps, ListaEstadosState> {
  private readonly ATTRIBUTES = [
    { label: "Nombre", value: "nombre", type: "string" as const },
    { label: "Descripción", value: "descripcion", type: "string" as const },
    { label: "Color", value: "color", type: "string" as const },
    { label: "Fecha Creación", value: "fechaCreacion", type: "date" as const },
  ];

  private readonly PROPERTY_FILTERS = [
    { label: "Estado", value: "activo", property: "activo", type: "boolean" as const },
  ];

  constructor(props: ListaEstadosProps) {
    super(props);
    this.state = {
      estados: [],
      filteredEstados: [],
      searchTerm: '',
      sortBy: 'nombre',
      sortDirection: 'asc',
      currentPage: 1,
      selectedEstados: new Set(),
      isLoading: true,
      selectedFilterValues: []
    };
  }

  componentDidMount() {
    this.loadEstados();
  }

  componentDidUpdate(prevProps: ListaEstadosProps, prevState: ListaEstadosState) {
    if (
      prevState.searchTerm !== this.state.searchTerm ||
      prevState.sortBy !== this.state.sortBy ||
      prevState.sortDirection !== this.state.sortDirection ||
      prevState.selectedFilterValues !== this.state.selectedFilterValues
    ) {
      this.applyFiltersAndSorting();
    }
  }

  loadEstados = () => {
    this.setState({ isLoading: true });
    try {
      const data = getEstados();
      this.setState({
        estados: data,
        filteredEstados: data,
        isLoading: false
      });
    } catch (error) {
      toast.error("Error al cargar estados");
      this.setState({ isLoading: false });
    }
  };

  applyFiltersAndSorting = () => {
    let result = [...this.state.estados];

    // Aplicar búsqueda
    if (this.state.searchTerm) {
      const term = this.state.searchTerm.toLowerCase();
      result = result.filter(
        estado => estado.nombre.toLowerCase().includes(term) ||
              estado.fechaCreacion.toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' }).toLowerCase().includes(term) ||  
              (estado.descripcion && estado.descripcion.toLowerCase().includes(term)) ||
              estado.activo.toString().toLowerCase().includes(term) ||
              estado.color.toLowerCase().includes(term) ||
              estado.id.toString().toLowerCase().includes(term)
      );
    }

    // Separar los valores de filtro por tipo
    const filterValues = this.state.selectedFilterValues.filter(value => !value.includes(':'));
    const filterStates = this.state.selectedFilterValues
      .filter(value => value.startsWith('estado:'))
      .map(value => value.split(':')[1]);

    // Aplicar filtro de valores
    if (filterValues.length > 0) {
      result = result.filter(estado => 
        filterValues.includes(this.getFieldValue(estado, this.state.sortBy))
      );
    }

    // Aplicar filtro de estados
    if (filterStates.length > 0) {
      result = result.filter(estado => 
        filterStates.includes(estado.activo ? 'Activo' : 'Inactivo')
      );
    }

    // Aplicar ordenamiento
    result.sort((a, b) => {
      let comparison = 0;
      
      switch (this.state.sortBy) {
        case 'nombre':
          comparison = a.nombre.localeCompare(b.nombre);
          break;
        case 'descripcion':
          comparison = (a.descripcion || '').localeCompare(b.descripcion || '');
          break;
        case 'fechaCreacion':
          const fechaA = a.fechaCreacion instanceof Date ? a.fechaCreacion : new Date(a.fechaCreacion);
          const fechaB = b.fechaCreacion instanceof Date ? b.fechaCreacion : new Date(b.fechaCreacion);
          comparison = fechaA.getTime() - fechaB.getTime();
          break;
        default:
          comparison = 0;
      }

      return this.state.sortDirection === 'asc' ? comparison : -comparison;
    });

    this.setState({
      filteredEstados: result,
      currentPage: 1
    });
  };

  getFieldValue = (estado: EstadoReporte, field: string): string => {
    switch (field) {
      case 'nombre':
        return estado.nombre;
      case 'descripcion':
        return estado.descripcion || 'Sin descripción';
      case 'fechaCreacion':
        return estado.fechaCreacion instanceof Date ? 
          estado.fechaCreacion.toLocaleDateString('es-ES') : 
          new Date(estado.fechaCreacion).toLocaleDateString('es-ES');
      case 'estado':
        return estado.activo ? 'Activo' : 'Inactivo';
      default:
        return '';
    }
  };

  handlePageChange = (page: number) => {
    const totalPages = Math.ceil(this.state.filteredEstados.length / itemsPerPage);
    if (page >= 1 && page <= totalPages) {
      this.setState({ currentPage: page });
    }
  };

  handleFilterChange = (newData: any[], filters: any) => {
    this.setState({ 
      filteredEstados: newData,
      currentPage: 1 
    });
  };

  handleSelectEstado = (estadoId: string, checked: boolean) => {
    this.setState(prev => {
      const newSelected = new Set(prev.selectedEstados);
      if (checked) {
        newSelected.add(estadoId);
      } else {
        newSelected.delete(estadoId);
      }
      return { selectedEstados: newSelected };
    });
  };

  handleSelectAll = (checked: boolean) => {
    if (checked) {
      this.setState({ selectedEstados: new Set(this.state.filteredEstados.map(estado => estado.id)) });
    } else {
      this.setState({ selectedEstados: new Set() });
    }
  };

  get isAllSelected(): boolean {
    return this.state.filteredEstados.length > 0 && 
      this.state.filteredEstados.every(estado => this.state.selectedEstados.has(estado.id));
  }

  get isSomeSelected(): boolean {
    return this.state.filteredEstados.some(estado => this.state.selectedEstados.has(estado.id));
  }

  handleEstadoChange = (estadoId: string) => {
    const estado = this.state.estados.find(e => e.id === estadoId);
    if (estado) {
      const nuevoEstado = !estado.activo;
      const estadoActualizado = updateEstado(estadoId, { activo: nuevoEstado });
      if (estadoActualizado) {
        this.setState(prev => ({
          estados: prev.estados.map(e => e.id === estadoId ? estadoActualizado : e)
        }));
        toast.success(`Estado actualizado a ${nuevoEstado ? 'activo' : 'inactivo'}`);
      }
    }
  };

  handleDeleteEstado = (estadoId: string) => {
    if (window.confirm('¿Está seguro que desea eliminar este estado?')) {
      const resultado = deleteEstado(estadoId);
      if (resultado) {
        this.setState(prev => ({
          estados: prev.estados.filter(e => e.id !== estadoId)
        }));
        toast.success('Estado eliminado correctamente');
      }
    }
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
    this.props.navigate("/admin/estados/nuevo");
  };

  render() {
    const { filteredEstados, currentPage, isLoading } = this.state;
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentEstados = filteredEstados.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredEstados.length / itemsPerPage);

    return (
      <div>
        <div className="space-y-4">
          <SearchFilterBar
            data={this.state.estados}
            onFilterChange={this.handleFilterChange}
            attributes={this.ATTRIBUTES}
            propertyFilters={this.PROPERTY_FILTERS}
            searchPlaceholder="Buscar estados..."
            resultLabel="estados"
            exportLabel="Exportar CSV"
            exportFunction={this.handleExport}
            navigateFunction={this.handleNavigate}
            navigateLabel="Nuevo Estado"
          />

          {this.state.selectedEstados.size > 0 && (
            <div className="flex items-center gap-4 p-4 rounded-md border">
              <div className="flex-1">
                <span className="text-sm font-medium text-gray-700">
                  {this.state.selectedEstados.size} {this.state.selectedEstados.size === 1 ? 'estado seleccionado' : 'estados seleccionados'}
                </span>
              </div>
              <div className="flex items-center gap-4">
                <Button
                  onClick={() => this.setState({ selectedEstados: new Set() })}
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
                      aria-label="Seleccionar todos los estados"
                    />
                  </TableHead>
                  <TableHead className="font-semibold text-gray-600">Nombre</TableHead>
                  <TableHead className="font-semibold text-gray-600">Descripción</TableHead>
                  <TableHead className="font-semibold text-gray-600">Color</TableHead>
                  <TableHead className="font-semibold text-gray-600">Fecha Creación</TableHead>
                  <TableHead className="font-semibold text-gray-600 text-center">Estado</TableHead>
                  <TableHead className="font-semibold text-gray-600 text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8">
                      <div className="flex justify-center">
                        <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full"></div>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : currentEstados.length > 0 ? (
                  currentEstados.map((estado) => (
                    <TableRow key={estado.id}>
                      <TableCell className="w-[50px]">
                        <Checkbox
                          checked={this.state.selectedEstados.has(estado.id)}
                          onCheckedChange={(checked) => this.handleSelectEstado(estado.id, checked as boolean)}
                          aria-label={`Seleccionar estado ${estado.nombre}`}
                        />
                      </TableCell>
                      <TableCell>
                        <Link to={`/admin/estados/${estado.id}`} className="text-blue-600 hover:underline">
                          {estado.nombre}
                        </Link>
                      </TableCell>
                      <TableCell>{estado.descripcion || '-'}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div 
                            className="h-4 w-4 rounded-full" 
                            style={{ backgroundColor: estado.color }}
                          />
                          <span>{estado.color}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {new Date(estado.fechaCreacion).toLocaleDateString('es-ES', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge 
                          variant={estado.activo ? 'success' : 'inactive'}
                          className="cursor-pointer"
                          onClick={() => this.handleEstadoChange(estado.id)}
                        >
                          {estado.activo ? 'Activo' : 'Inactivo'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            asChild
                          >
                            <Link to={`/admin/estados/${estado.id}/editar`}>
                              <PencilIcon className="h-4 w-4 text-gray-500" />
                            </Link>
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-red-500 hover:text-red-600"
                            onClick={() => this.handleDeleteEstado(estado.id)}
                          >
                            <Trash2Icon className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-4 text-gray-500">
                      No se encontraron estados con los criterios seleccionados
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
            totalItems={filteredEstados.length}
            itemsPerPage={itemsPerPage}
          />
        </div>
      </div>
    );
  }
}

// Create a wrapper component to provide navigation
const ListaEstadosWithNavigation: React.FC = () => {
  const navigate = useNavigate();
  return <ListaEstados navigate={navigate} />;
};

export default ListaEstadosWithNavigation;
