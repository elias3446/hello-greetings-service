import React, { Component } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { 
  PencilIcon, 
  Trash2Icon,
  Check,
  X
} from 'lucide-react';
import Pagination from '@/components/layout/Pagination';
import { Link } from 'react-router-dom';
import { toast } from '@/components/ui/sonner';
import { obtenerRoles } from '@/controller/CRUD/role/roleController';
import type { EstadoReporte, Rol } from '@/types/tipos';
import { Checkbox } from '@/components/ui/checkbox';
import SearchFilterBar from '@/components/SearchFilterBar/SearchFilterBar';
import { exportToCSV } from '@/utils/exportUtils';

interface ListaRolesProps {
  navigate: (path: string) => void;
}

interface ListaRolesState {
  roles: Rol[];
  filteredRoles: Rol[];
  searchTerm: string;
  sortBy: string;
  sortDirection: 'asc' | 'desc';
  currentPage: number;
  selectedRoles: Set<string>;
  showDeleteDialog: boolean;
  rolesAEliminar: Rol[];
  isLoading: boolean;
  selectedFilterValues: any[];
}

const itemsPerPage = 5;

class ListaRoles extends Component<ListaRolesProps, ListaRolesState> {
  private readonly ATTRIBUTES = [
    { label: "Nombre", value: "nombre", type: "string" as const },
    { label: "Descripción", value: "descripcion", type: "string" as const },
    { 
      label: "Permisos", 
      value: "permisos", 
      type: "object" as const,
      getValue: (item: any) => item.permisos,
      formatValue: (value: any) => {
        if (!value) return '';
        if (typeof value === 'string') return value;
        if (Array.isArray(value)) {
          return value.map(p => typeof p === 'string' ? p : p.nombre).join(', ');
        }
        return typeof value === 'object' ? value.nombre : '';
      }
    },
    { label: "Fecha Creación", value: "fechaCreacion", type: "date" as const },
  ];

  private readonly PROPERTY_FILTERS = [
    { label: "Estado", value: "activo", property: "activo", type: "boolean" as const },
  ];

  constructor(props: ListaRolesProps) {
    super(props);
    this.state = {
      roles: [],
      filteredRoles: [],
      searchTerm: '',
      sortBy: 'nombre',
      sortDirection: 'asc',
      currentPage: 1,
      selectedRoles: new Set(),
      showDeleteDialog: false,
      rolesAEliminar: [],
      isLoading: true,
      selectedFilterValues: []
    };
  }

  componentDidMount() {
    this.loadRoles();
  }

  componentDidUpdate(prevProps: ListaRolesProps, prevState: ListaRolesState) {
    if (
      prevState.searchTerm !== this.state.searchTerm ||
      prevState.sortBy !== this.state.sortBy ||
      prevState.sortDirection !== this.state.sortDirection ||
      prevState.selectedFilterValues !== this.state.selectedFilterValues
    ) {
      this.applyFiltersAndSorting();
    }
  }

  loadRoles = () => {
    this.setState({ isLoading: true });
    try {
      const data = obtenerRoles();
      this.setState({
        roles: data,
        filteredRoles: data,
        isLoading: false
      });
    } catch (error) {
      toast.error("Error al cargar roles");
      this.setState({ isLoading: false });
    }
  };

  applyFiltersAndSorting = () => {
    let result = [...this.state.roles];

    // Aplicar búsqueda
    if (this.state.searchTerm) {
      const term = this.state.searchTerm.toLowerCase();
      result = result.filter(
        rol => rol.nombre.toLowerCase().includes(term) ||
              rol.fechaCreacion.toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' }).toLowerCase().includes(term) ||  
              (rol.descripcion && rol.descripcion.toLowerCase().includes(term)) ||
              rol.activo.toString().toLowerCase().includes(term) ||
              rol.permisos.some(permiso => permiso.nombre.toLowerCase().includes(term)) ||
              rol.id.toString().toLowerCase().includes(term)
      );
    }

    // Separar los valores de filtro por tipo
    const filterValues = this.state.selectedFilterValues.filter(value => !value.includes(':'));
    const filterStates = this.state.selectedFilterValues
      .filter(value => value.startsWith('estado:'))
      .map(value => value.split(':')[1]);

    // Aplicar filtro de valores
    if (filterValues.length > 0) {
      result = result.filter(rol => 
        filterValues.includes(this.getFieldValue(rol, this.state.sortBy))
      );
    }

    // Aplicar filtro de estados
    if (filterStates.length > 0) {
      result = result.filter(rol => 
        filterStates.includes(rol.activo ? 'Activo' : 'Inactivo')
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
      filteredRoles: result,
      currentPage: 1
    });
  };

  getFieldValue = (rol: Rol, field: string): string => {
    switch (field) {
      case 'nombre':
        return rol.nombre;
      case 'descripcion':
        return rol.descripcion || 'Sin descripción';
      case 'fechaCreacion':
        return rol.fechaCreacion instanceof Date ? 
          rol.fechaCreacion.toLocaleDateString('es-ES') : 
          new Date(rol.fechaCreacion).toLocaleDateString('es-ES');
      case 'estado':
        return rol.activo ? 'Activo' : 'Inactivo';
      default:
        return '';
    }
  };

  handlePageChange = (page: number) => {
    const totalPages = Math.ceil(this.state.filteredRoles.length / itemsPerPage);
    if (page >= 1 && page <= totalPages) {
      this.setState({ currentPage: page });
    }
  };

  handleFilterChange = (newData: any[], filters: any) => {
    this.setState({ 
      filteredRoles: newData,
      currentPage: 1 
    });
  };

  handleSelectRole = (roleId: string, checked: boolean) => {
    this.setState(prev => {
      const newSelected = new Set(prev.selectedRoles);
      if (checked) {
        newSelected.add(roleId);
      } else {
        newSelected.delete(roleId);
      }
      return { selectedRoles: newSelected };
    });
  };

  handleSelectAll = (checked: boolean) => {
    if (checked) {
      this.setState({ selectedRoles: new Set(this.state.filteredRoles.map(role => role.id)) });
    } else {
      this.setState({ selectedRoles: new Set() });
    }
  };

  get isAllSelected(): boolean {
    return this.state.filteredRoles.length > 0 && 
      this.state.filteredRoles.every(role => this.state.selectedRoles.has(role.id));
  }

  get isSomeSelected(): boolean {
    return this.state.filteredRoles.some(role => this.state.selectedRoles.has(role.id));
  }

  handleEstadoChange = (rolId: string) => {
    const rol = this.state.roles.find(r => r.id === rolId);
    if (rol) {
      const nuevoEstado = !rol.activo;
      
      // Update the roles array
      this.setState(prev => ({
        roles: prev.roles.map(r => {
          if (r.id === rolId) {
            return { ...r, activo: nuevoEstado };
          }
          return r;
        })
      }));
      
      toast.success(`Estado del rol actualizado a ${nuevoEstado ? 'Activo' : 'Inactivo'}`);
    }
  };

  handleDeleteRole = (rolId: string, nombreRol: string) => {
    toast.error(`Función de eliminar rol ${nombreRol} en desarrollo`);
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
    this.props.navigate("/admin/roles/nuevo");
  };

  render() {
    const { filteredRoles, currentPage, isLoading } = this.state;
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentRoles = filteredRoles.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredRoles.length / itemsPerPage);

    return (
      <div>
        <div className="space-y-4">
          <SearchFilterBar
            data={this.state.roles}
            onFilterChange={this.handleFilterChange}
            attributes={this.ATTRIBUTES}
            propertyFilters={this.PROPERTY_FILTERS}
            searchPlaceholder="Buscar roles..."
            resultLabel="roles"
            exportLabel="Exportar CSV"
            exportFunction={this.handleExport}
            navigateFunction={this.handleNavigate}
            navigateLabel="Nuevo Rol"
          />

          {this.state.selectedRoles.size > 0 && (
            <div className="flex items-center gap-4 p-4 rounded-md border">
              <div className="flex-1">
                <span className="text-sm font-medium text-gray-700">
                  {this.state.selectedRoles.size} {this.state.selectedRoles.size === 1 ? 'rol seleccionado' : 'roles seleccionados'}
                </span>
              </div>
              <div className="flex items-center gap-4">
                <Button
                  onClick={() => this.setState({ selectedRoles: new Set() })}
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
                      aria-label="Seleccionar todos los roles"
                    />
                  </TableHead>
                  <TableHead className="font-semibold text-gray-600">Nombre</TableHead>
                  <TableHead className="font-semibold text-gray-600">Descripción</TableHead>
                  <TableHead className="font-semibold text-gray-600">Permisos</TableHead>
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
                ) : currentRoles.length > 0 ? (
                  currentRoles.map((rol) => (
                    <TableRow key={rol.id}>
                      <TableCell className="w-[50px]">
                        <Checkbox
                          checked={this.state.selectedRoles.has(rol.id)}
                          onCheckedChange={(checked) => this.handleSelectRole(rol.id, checked as boolean)}
                          aria-label={`Seleccionar rol ${rol.nombre}`}
                        />
                      </TableCell>
                      <TableCell>
                        <Link to={`/admin/roles/${rol.id}`} className="text-blue-600 hover:underline">
                          {rol.nombre}
                        </Link>
                      </TableCell>
                      <TableCell>{rol.descripcion}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {rol.permisos && rol.permisos.slice(0, 3).map((permiso, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {typeof permiso === 'string' ? permiso : permiso.nombre}
                            </Badge>
                          ))}
                          {rol.permisos && rol.permisos.length > 3 && (
                            <Badge variant="secondary" className="text-xs">
                              +{rol.permisos.length - 3} más
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge 
                          variant={rol.activo ? 'success' : 'inactive'}
                          className="cursor-pointer"
                          onClick={() => this.handleEstadoChange(rol.id)}
                        >
                          {rol.activo ? 'Activo' : 'Inactivo'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        {new Date(rol.fechaCreacion).toLocaleDateString('es-ES', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            asChild
                          >
                            <Link to={`/admin/roles/${rol.id}/editar`}>
                              <PencilIcon className="h-4 w-4 text-gray-500" />
                            </Link>
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-red-500 hover:text-red-600"
                            onClick={() => this.handleDeleteRole(rol.id, rol.nombre)}
                          >
                            <Trash2Icon className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-4 text-gray-500">
                      No se encontraron roles con los criterios seleccionados
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
            totalItems={filteredRoles.length}
            itemsPerPage={itemsPerPage}
          />
        </div>
      </div>
    );
  }
}

// Create a wrapper component to provide navigation
const ListaRolesWithNavigation: React.FC = () => {
  const navigate = useNavigate();
  return <ListaRoles navigate={navigate} />;
};

export default ListaRolesWithNavigation;
