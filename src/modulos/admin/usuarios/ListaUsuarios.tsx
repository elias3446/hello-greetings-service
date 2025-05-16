import React, { Component } from 'react';
import { Table, TableBody, TableHeader, TableRow, TableHead } from '@/components/ui/table';
import { UsuarioTableHeader, LoadingRow, EmptyStateRow, UsuarioRow } from '@/components/admin/usuarios/UsuarioComponents';
import { getFieldValue } from '@/utils/usuarioUtils';
import { SORT_OPTIONS, FILTER_OPTIONS, ITEMS_PER_PAGE } from '@/utils/userListConstants';
import { actualizarRolUsuario } from '@/controller/controller/user/userRoleController';
import { actualizarEstadoUsuario } from '@/controller/controller/user/userStateController';
import { eliminarUsuario } from '@/controller/controller/user/userDeleteController';
import { toast } from '@/components/ui/sonner';
import { Usuario } from '@/types/tipos';
import { useNavigate, useLocation } from 'react-router-dom';
import BulkActionsBar from '@/components/admin/usuarios/listaUsuarios/BulkActionsBar';
import DeleteUserDialog from '@/components/admin/usuarios/listaUsuarios/DeleteUserDialog';
import Pagination from '@/components/layout/Pagination';
import { getUsers, updateUser, deleteUser } from '@/controller/CRUD/user/userController';
import { exportUsuariosToCSV } from '@/utils/usuarioUtils';
import { sortUsers } from '@/utils/userUtils';
import { normalizeText } from '@/utils/usuarioUtils';
import { Button } from '@/components/ui/button';
import { FileDown, Plus } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import FilterByValues from '@/components/common/FilterByValues';
import SearchFilterBar from '@/components/SearchFilterBar/SearchFilterBar';
import { exportToCSV } from '@/utils/exportUtils';

interface ListaUsuariosState {
  usuarios: Usuario[];
  filteredUsuarios: Usuario[];
  searchTerm: string;
  sortBy: string;
  sortDirection: 'asc' | 'desc';
  currentPage: number;
  selectedUsers: Set<string>;
  selectedRoleId: string;
  selectedEstado: 'activo' | 'inactivo';
  usuariosAEliminar: Usuario[];
  showDeleteDialog: boolean;
  usuarioAEliminar: Usuario | null;
  isLoading: boolean;
  selectedFilterValues: any[];
}

class ListaUsuarios extends Component<{}, ListaUsuariosState> {
  private readonly ATTRIBUTES = [
    { label: "Nombre", value: "nombre", type: "string" as const },
    { label: "Email", value: "email", type: "string" as const },
    { label: "Fecha Creación", value: "fechaCreacion", type: "date" as const },
  ];

  private readonly PROPERTY_FILTERS = [
    { 
      label: "Rol", 
      value: "roles", 
      property: "roles", 
      type: "object" as const,
      getValue: (item: any) => item.roles,
      formatValue: (value: any) => value.map((rol: any) => rol.nombre).join(', ')
    },
    { label: "Estado", value: "estado", property: "estado", type: "string" as const },
  ];

  constructor(props: {}) {
    super(props);
    this.state = {
      usuarios: [],
      filteredUsuarios: [],
      searchTerm: '',
      sortBy: 'nombre',
      sortDirection: 'asc',
      currentPage: 1,
      selectedUsers: new Set(),
      selectedRoleId: '',
      selectedEstado: 'activo',
      usuariosAEliminar: [],
      showDeleteDialog: false,
      usuarioAEliminar: null,
      isLoading: true,
      selectedFilterValues: []
    };
  }

  componentDidMount() {
    this.loadUsuarios();
  }

  componentDidUpdate(prevProps: {}, prevState: ListaUsuariosState) {
    if (
      prevState.searchTerm !== this.state.searchTerm ||
      prevState.sortBy !== this.state.sortBy ||
      prevState.sortDirection !== this.state.sortDirection ||
      prevState.selectedFilterValues !== this.state.selectedFilterValues
    ) {
      this.applyFiltersAndSorting();
    }
  }

  loadUsuarios = async () => {
    this.setState({ isLoading: true });
    try {
      const data = getUsers();
      this.setState({
        usuarios: data,
        filteredUsuarios: data,
        isLoading: false
      });
    } catch (error) {
      toast.error("Error al cargar usuarios");
      this.setState({ isLoading: false });
    }
  };

  applyFiltersAndSorting = () => {
    let result = [...this.state.usuarios];

    // Aplicar búsqueda
    if (this.state.searchTerm) {
      const term = normalizeText(this.state.searchTerm);
      result = result.filter(usuario => {
        const nombreCompleto = normalizeText(`${usuario.nombre} ${usuario.apellido}`);
        const email = normalizeText(usuario.email);
        const roles = normalizeText(usuario.roles.map(rol => rol.nombre).join(', '));
        const fechaFormateada = normalizeText(new Date(usuario.fechaCreacion).toLocaleDateString('es-ES'));
        const estado = normalizeText(usuario.estado);

        return nombreCompleto.includes(term) ||
               email.includes(term) ||
               roles.includes(term) ||
               fechaFormateada.includes(term) ||
               estado.includes(term);
      });
    }

    // Aplicar filtros
    const filterValues = this.state.selectedFilterValues.filter(value => !value.includes(':'));
    const filterStates = this.state.selectedFilterValues
      .filter(value => value.startsWith('estado:'))
      .map(value => value.split(':')[1]);
    const filterRoles = this.state.selectedFilterValues
      .filter(value => value.startsWith('rol:'))
      .map(value => value.split(':')[1]);

    if (filterValues.length > 0) {
      result = result.filter(usuario => 
        filterValues.includes(getFieldValue(usuario, this.state.sortBy))
      );
    }

    if (filterStates.length > 0) {
      result = result.filter(usuario => 
        filterStates.includes(usuario.estado)
      );
    }

    if (filterRoles.length > 0) {
      result = result.filter(usuario => 
        usuario.roles.some(rol => filterRoles.includes(rol.nombre))
      );
    }

    // Aplicar ordenamiento
    result = sortUsers(result, this.state.sortBy, this.state.sortDirection);
    
    this.setState({
      filteredUsuarios: result,
      currentPage: 1 // Resetear a la primera página cuando cambian los filtros
    });
  };

  handlePageChange = (page: number) => {
    const totalPages = Math.ceil(this.state.filteredUsuarios.length / ITEMS_PER_PAGE);
    if (page >= 1 && page <= totalPages) {
      this.setState({ currentPage: page });
    }
  };

  handleSelectUser = (userId: string, checked: boolean) => {
    this.setState(prev => {
      const newSelected = new Set(prev.selectedUsers);
      if (checked) {
        newSelected.add(userId);
      } else {
        newSelected.delete(userId);
      }
      return { selectedUsers: newSelected };
    });
  };

  handleSelectAll = (checked: boolean) => {
    if (checked) {
      this.setState({ selectedUsers: new Set(this.state.filteredUsuarios.map(user => user.id)) });
    } else {
      this.setState({ selectedUsers: new Set() });
    }
  };

  get isAllSelected(): boolean {
    return this.state.filteredUsuarios.length > 0 && 
      this.state.filteredUsuarios.every(user => this.state.selectedUsers.has(user.id));
  }

  get isSomeSelected(): boolean {
    return this.state.filteredUsuarios.some(user => this.state.selectedUsers.has(user.id));
  }

  handleEstadoChange = async (userId: string) => {
    const usuario = this.state.usuarios.find(user => user.id === userId);
    if (!usuario || usuario.estado === 'bloqueado') {
      toast.error('No se puede cambiar el estado de un usuario bloqueado');
      return;
    }

    const nuevoEstado = usuario.estado === 'activo' ? 'inactivo' : 'activo';
    
    try {
      const resultado = await actualizarEstadoUsuario(
        usuario,
        nuevoEstado,
        {
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
        }
      );

      if (resultado) {
        this.setState(prev => ({
          usuarios: prev.usuarios.map(user => 
            user.id === userId ? { ...user, estado: nuevoEstado } : user
          )
        }));
        toast.success(`Estado actualizado a ${nuevoEstado}`);
      }
    } catch (error) {
      console.error('Error al actualizar el estado:', error);
      toast.error('Error al actualizar el estado');
    }
  };

  handleDeleteUser = (usuario: Usuario) => {
    this.setState({ usuarioAEliminar: usuario, showDeleteDialog: true });
  };

  handleBulkDelete = () => {
    const usuariosSeleccionados = this.state.usuarios.filter(user => this.state.selectedUsers.has(user.id));
    this.setState({ usuariosAEliminar: usuariosSeleccionados, showDeleteDialog: true });
  };

  handleCancelDelete = () => {
    this.setState({ usuarioAEliminar: null, usuariosAEliminar: [], showDeleteDialog: false });
  };

  confirmarEliminacion = async () => {
    try {
      if (this.state.usuariosAEliminar.length > 0) {
        let successCount = 0;
        let errorCount = 0;

        for (const usuario of this.state.usuariosAEliminar) {
          const resultado = await eliminarUsuario(usuario, {
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

          if (resultado) {
            successCount++;
            this.setState(prev => ({
              usuarios: prev.usuarios.filter(user => user.id !== usuario.id)
            }));
            this.setState(prev => ({
              selectedUsers: new Set(Array.from(prev.selectedUsers).filter(id => id !== usuario.id))
            }));
          } else {
            errorCount++;
          }
        }

        if (successCount > 0) {
          toast.success(`Se eliminaron ${successCount} usuarios correctamente`);
        }
        if (errorCount > 0) {
          toast.error(`Hubo errores al eliminar ${errorCount} usuarios`);
        }
      } else if (this.state.usuarioAEliminar) {
        const resultado = await eliminarUsuario(this.state.usuarioAEliminar, {
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

        if (resultado) {
          this.setState(prev => ({
            usuarios: prev.usuarios.filter(user => user.id !== this.state.usuarioAEliminar.id)
          }));
          this.setState(prev => ({
            selectedUsers: new Set(Array.from(prev.selectedUsers).filter(id => id !== this.state.usuarioAEliminar.id))
          }));
          toast.success('Usuario eliminado correctamente');
        }
      }
    } catch (error) {
      console.error('Error al eliminar los usuarios:', error);
      toast.error('Error al eliminar los usuarios');
    } finally {
      this.handleCancelDelete();
      this.setState({ selectedUsers: new Set() });
    }
  };

  handleFilterChange = (newData: any[], filters: any) => {
    this.setState({ filteredUsuarios: newData, currentPage: 1 });
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
    console.log("Navegación a nueva pantalla");
    // Ejemplo de navegación - Puedes cambiarlo por la ruta que necesites
    // navigate("/detalles");
    toast.info("Aquí iría la navegación a otra pantalla");
  };

  render() {
    const { filteredUsuarios, currentPage, isLoading } = this.state;
    const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
    const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
    const currentItems = filteredUsuarios.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredUsuarios.length / ITEMS_PER_PAGE);

    return (
      <div className="space-y-4">
        <SearchFilterBar
          data={this.state.usuarios}
          onFilterChange={this.handleFilterChange}
          attributes={this.ATTRIBUTES}
          propertyFilters={this.PROPERTY_FILTERS}
          searchPlaceholder="Buscar usuarios..."
          resultLabel="usuarios"
          exportLabel="Exportar CSV"
          exportFunction={this.handleExport}
          navigateFunction={this.handleNavigate}
          navigateLabel="Nuevo Usuario"
        />

        {this.state.selectedUsers.size > 0 && (
          <BulkActionsBar
            selectedUsers={this.state.selectedUsers}
            selectedRoleId={this.state.selectedRoleId}
            selectedEstado={this.state.selectedEstado}
            onRoleChange={(_, roleId) => {
              this.setState({ selectedRoleId: roleId });
              return Promise.resolve();
            }}
            onEstadoChange={(value) => this.setState({ selectedEstado: value })}
            onBulkRoleUpdate={() => {}}
            onBulkEstadoUpdate={() => {}}
            onBulkDelete={this.handleBulkDelete}
            onCancel={() => {
              this.setState({ 
                selectedUsers: new Set(), 
                selectedRoleId: '', 
                selectedEstado: 'activo' 
              });
            }}
          />
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
                    aria-label="Seleccionar todos los usuarios"
                  />
                </TableHead>
                <TableHead>Nombre</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Rol</TableHead>
                <TableHead>Fecha creación</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <LoadingRow />
              ) : currentItems.length === 0 ? (
                <EmptyStateRow />
              ) : (
                currentItems.map((usuario) => (
                  <UsuarioRow
                    key={usuario.id}
                    usuario={usuario}
                    onEstadoChange={this.handleEstadoChange}
                    onDelete={this.handleDeleteUser}
                    onSelect={this.handleSelectUser}
                    isSelected={this.state.selectedUsers.has(usuario.id)}
                    onRoleChange={async () => Promise.resolve()}
                  />
                ))
              )}
            </TableBody>
          </Table>
        </div>

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={this.handlePageChange}
          totalItems={filteredUsuarios.length}
          itemsPerPage={ITEMS_PER_PAGE}
        />

        <DeleteUserDialog
          open={this.state.showDeleteDialog}
          onOpenChange={(open) => this.setState({ showDeleteDialog: open })}
          usuarioAEliminar={this.state.usuarioAEliminar}
          usuariosAEliminar={this.state.usuariosAEliminar}
          onConfirm={this.confirmarEliminacion}
          onCancel={this.handleCancelDelete}
        />
      </div>
    );
  }
}

export default ListaUsuarios;
