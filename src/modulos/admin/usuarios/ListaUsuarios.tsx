import { Component } from 'react';
import { getUsers } from '@/controller/CRUD/user/userController';
import { toast } from '@/components/ui/sonner';
import { Usuario } from '@/types/tipos';
import { exportToCSV } from '@/utils/exportUtils';
import { ListaUsuariosProps } from '@/props/admin/usuarios/PropListaUsuarios';
import { ITEMS_PER_PAGE } from '@/utils/userListConstants';
import { 
  ATTRIBUTES, 
  applyFiltersAndSorting, 
  handleEstadoChange, 
  confirmarEliminacion 
} from '@/constants/admin/user/ListaUsuariosConstants';
import ListaUsuariosContent from '@/components/admin/usuarios/listaUsuarios/ListaUsuariosContent';

interface ListaUsuariosComponentProps {
  navigate: (path: string) => void;
}

class ListaUsuarios extends Component<ListaUsuariosComponentProps, ListaUsuariosProps> {
  constructor(props: ListaUsuariosComponentProps) {
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

  componentDidUpdate(prevProps: ListaUsuariosComponentProps, prevState: ListaUsuariosProps) {
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
    const result = applyFiltersAndSorting(
      this.state.usuarios,
      this.state.searchTerm,
      this.state.sortBy,
      this.state.sortDirection,
      this.state.selectedFilterValues
    );
    
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
    await handleEstadoChange(userId, this.state.usuarios, this.setState.bind(this));
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
    await confirmarEliminacion(
      this.state.usuariosAEliminar,
      this.state.usuarioAEliminar,
      this.setState.bind(this),
      this.handleCancelDelete
    );
  };

  handleFilterChange = (newData: any[], filters: any) => {
    this.setState({ filteredUsuarios: newData, currentPage: 1 });
  };

  handleExport = (data: any[]) => {
    try {
      exportToCSV(
        data,
        `informes-${new Date().toLocaleDateString().replace(/\//g, '-')}`,
        Object.fromEntries(ATTRIBUTES.map(attr => [attr.value, attr.label]))
      );
      toast.success(`Se han exportado ${data.length} registros en formato CSV`);
    } catch (error) {
      console.error("Error al exportar:", error);
      toast.error("No se pudo completar la exportación de datos");
    }
  };

  handleNavigate = () => {
    this.props.navigate('/admin/usuarios/nuevo'); 
  };

  render() {
    const { filteredUsuarios, currentPage, isLoading } = this.state;

    return (
      <ListaUsuariosContent
        usuarios={this.state.usuarios}
        filteredUsuarios={filteredUsuarios}
        currentPage={currentPage}
        isLoading={isLoading}
        selectedUsers={this.state.selectedUsers}
        selectedRoleId={this.state.selectedRoleId}
        selectedEstado={this.state.selectedEstado}
        showDeleteDialog={this.state.showDeleteDialog}
        usuarioAEliminar={this.state.usuarioAEliminar}
        usuariosAEliminar={this.state.usuariosAEliminar}
        isAllSelected={this.isAllSelected}
        isSomeSelected={this.isSomeSelected}
        onFilterChange={this.handleFilterChange}
        onExport={this.handleExport}
        onNavigate={this.handleNavigate}
        onRoleChange={(_, roleId) => {
          this.setState({ selectedRoleId: roleId });
          return Promise.resolve();
        }}
        onEstadoChange={(value) => this.setState({ selectedEstado: value })}
        onBulkDelete={this.handleBulkDelete}
        onCancel={() => {
          this.setState({ 
            selectedUsers: new Set(), 
            selectedRoleId: '', 
            selectedEstado: 'activo' 
          });
        }}
        onSelectAll={this.handleSelectAll}
        onEstadoChangeUser={this.handleEstadoChange}
        onDelete={this.handleDeleteUser}
        onSelect={this.handleSelectUser}
        onPageChange={this.handlePageChange}
        onOpenChange={(open) => this.setState({ showDeleteDialog: open })}
        onConfirmDelete={this.confirmarEliminacion}
        onCancelDelete={this.handleCancelDelete}
      />
    );
  }
}

export default ListaUsuarios;
