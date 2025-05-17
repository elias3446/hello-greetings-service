import { Usuario } from "@/types/tipos";

export interface BulkActionsBarProps {
    selectedUsers: Set<string>;
    selectedRoleId: string;
    selectedEstado: 'activo' | 'inactivo';
    onRoleChange: (userId: string, roleId: string) => Promise<void>;
    onEstadoChange: (value: 'activo' | 'inactivo') => void;
    onBulkRoleUpdate: () => void;
    onBulkEstadoUpdate: () => void;
    onBulkDelete: () => void;
    onCancel: () => void;
  }

  export interface DeleteUserDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    usuarioAEliminar?: { nombre: string; apellido: string };
    usuariosAEliminar: any[];
    onConfirm: () => void;
    onCancel: () => void;
  }

  export interface ListaUsuariosProps {
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

  export interface ListaUsuariosContentProps {
    usuarios: Usuario[];
    filteredUsuarios: Usuario[];
    currentPage: number;
    isLoading: boolean;
    selectedUsers: Set<string>;
    selectedRoleId: string;
    selectedEstado: 'activo' | 'inactivo';
    showDeleteDialog: boolean;
    usuarioAEliminar: Usuario | null;
    usuariosAEliminar: Usuario[];
    isAllSelected: boolean;
    isSomeSelected: boolean;
    onFilterChange: (newData: any[], filters: any) => void;
    onExport: (data: any[]) => void;
    onNavigate: () => void;
    onRoleChange: (value: any, roleId: string) => Promise<void>;
    onEstadoChange: (value: 'activo' | 'inactivo') => void;
    onBulkDelete: () => void;
    onCancel: () => void;
    onSelectAll: (checked: boolean) => void;
    onEstadoChangeUser: (userId: string) => void;
    onDelete: (usuario: Usuario) => void;
    onSelect: (userId: string, checked: boolean) => void;
    onPageChange: (page: number) => void;
    onOpenChange: (open: boolean) => void;
    onConfirmDelete: () => void;
    onCancelDelete: () => void;
  }