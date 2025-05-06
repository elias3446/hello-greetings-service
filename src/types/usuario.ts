import { Usuario } from './tipos';

export interface UsuarioState {
  usuarios: Usuario[];
  filteredUsuarios: Usuario[];
  searchTerm: string;
  statusFilter: string | null;
  roleFilter: string | null;
  sortBy: string;
  sortDirection: 'asc' | 'desc';
  currentPage: number;
  isLoading: boolean;
  currentField: string | undefined;
  selectedFilterValues: any[];
  showDeleteDialog: boolean;
  usuarioAEliminar: Usuario | null;
  searchField: string;
}

export interface UsuarioActions {
  setUsuarios: React.Dispatch<React.SetStateAction<Usuario[]>>;
  setFilteredUsuarios: React.Dispatch<React.SetStateAction<Usuario[]>>;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  setStatusFilter: React.Dispatch<React.SetStateAction<string | null>>;
  setRoleFilter: React.Dispatch<React.SetStateAction<string | null>>;
  setSortBy: React.Dispatch<React.SetStateAction<string>>;
  setSortDirection: React.Dispatch<React.SetStateAction<'asc' | 'desc'>>;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setCurrentField: React.Dispatch<React.SetStateAction<string | undefined>>;
  setSelectedFilterValues: React.Dispatch<React.SetStateAction<any[]>>;
  setShowDeleteDialog: React.Dispatch<React.SetStateAction<boolean>>;
  setUsuarioAEliminar: React.Dispatch<React.SetStateAction<Usuario | null>>;
  setSearchField: React.Dispatch<React.SetStateAction<string>>;
}

export interface UsuarioRowProps {
  usuario: Usuario;
  onEstadoChange: (id: string) => void;
  onDelete: (usuario: Usuario) => void;
}

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
} 