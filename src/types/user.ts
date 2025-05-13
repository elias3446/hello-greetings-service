import { useForm, Control } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { Usuario } from '@/types/tipos';

export type UserType = 'admin' | 'usuario';
export type UserStatus = 'activo' | 'inactivo' | 'bloqueado';
export type FormMode = 'crear' | 'editar';

export interface UserFormData {
  nombre: string;
  apellido: string;
  email: string;
  password: string;
  roles: string[];
  estado: UserStatus;
  tipo: UserType;
}

export interface FormularioUsuarioProps {
  modo: FormMode;
}

export interface UserFormState {
  form: ReturnType<typeof useForm<UserFormData>>;
  showCancelDialog: boolean;
  setShowCancelDialog: (show: boolean) => void;
  handleSubmit: (data: UserFormData) => Promise<void>;
  handleCancel: () => void;
  navigate: ReturnType<typeof useNavigate>;
  isSubmitting: boolean;
}

export type SingleValueField = Exclude<keyof UserFormData, 'roles'>;
export type MultiValueField = 'roles';

export interface FormFieldProps {
  control: Control<UserFormData>;
  name: SingleValueField;
  label: string;
  placeholder?: string;
  type?: string;
  description?: string;
}

export interface SelectOption {
  value: string;
  label: string;
}

export interface FormSelectProps extends FormFieldProps {
  options: SelectOption[];
}

export interface FormMultiSelectProps {
  control: Control<UserFormData>;
  name: MultiValueField;
  label: string;
  options: SelectOption[];
}

export interface FormHeaderProps {
  modo: FormMode;
  handleCancel: () => void;
  handleSubmit: () => void;
  isSubmitting: boolean;
  backLink?: string;
  backText?: string;
}

export interface UserProfileProps {
  form: ReturnType<typeof useForm<UserFormData>>;
}

export interface TabContentProps {
  form: ReturnType<typeof useForm<UserFormData>>;
  modo?: FormMode;
}

export interface SortOption {
  value: string;
  label: string;
}

export interface FilterOption {
  value: string;
  label: string;
}

export interface UsuarioListState {
  usuarios: Usuario[];
  filteredUsuarios: Usuario[];
  currentPage: number;
  searchTerm: string;
  statusFilter: string;
  roleFilter: string;
  sortBy: string;
  sortDirection: 'asc' | 'desc';
  currentField: string;
  isLoading: boolean;
  showDeleteDialog: boolean;
  usuarioAEliminar?: Usuario;
}

export interface UsuarioListActions {
  setCurrentPage: (page: number) => void;
  setSearchTerm: (term: string) => void;
  setStatusFilter: (status: string) => void;
  setRoleFilter: (role: string) => void;
  setSortBy: (field: string) => void;
  setSortDirection: (direction: 'asc' | 'desc') => void;
  setCurrentField: (field: string) => void;
  setShowDeleteDialog: (show: boolean) => void;
  setUsuarioAEliminar: (usuario?: Usuario) => void;
}

export interface UsuarioListHandlers {
  handleSearch: (term: string) => void;
  handleToggleSortDirection: () => void;
  handleFilterChange: (field: string, value: string) => void;
  handleExportUsuarios: () => void;
  handleNuevoUsuario: () => void;
  handleEstadoChange: (usuario: Usuario) => void;
  handleDeleteUser: (usuario: Usuario) => void;
  confirmarEliminacion: () => void;
} 