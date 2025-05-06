import React from 'react';
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
  UserPlus
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
import { Usuario } from '@/types/tipos';
import { toast } from '@/components/ui/sonner';
import { getUsers, updateUser, deleteUser } from '@/controller/CRUD/userController'; 
import RoleSelector from '@/components/admin/selector/RoleSelector';
import { sortUsers } from '@/utils/userUtils';
import SearchFilterBar from '@/components/layout/SearchFilterBar';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { registrarCambioEstado } from '@/controller/CRUD/historialEstadosUsuario';
import { registrarCambioEstadoReporte } from '@/controller/CRUD/historialEstadosReporte';
import { getReports } from '@/controller/CRUD/reportController';
import { useUsuarioState, useUsuarioData, useUsuarioFilters, useUsuarioHandlers } from '@/hooks/useUsuario';
import { UsuarioTableHeader, LoadingRow, EmptyStateRow, UsuarioRow, PaginationComponent } from '@/components/admin/usuarios/UsuarioComponents';
import { getFieldValue } from '@/utils/usuarioUtils';
import { UsuarioState, UsuarioActions } from '@/types/usuario';

// Constants
const ITEMS_PER_PAGE = 10;
const SORT_OPTIONS = [
  { value: 'nombre', label: 'Nombre' },
  { value: 'email', label: 'Email' },
  { value: 'fecha', label: 'Fecha creación' },
];

const FILTER_OPTIONS = [
  { value: 'estado', label: 'Estado' },
  { value: 'rol', label: 'Rol' },
];

const ListaUsuarios: React.FC = () => {
  const [state, actions] = useUsuarioState();
  
  useUsuarioData(state, actions);
  useUsuarioFilters(state, actions);
  const handlers = useUsuarioHandlers(state, actions);

  // Pagination calculations
  const indexOfLastItem = state.currentPage * ITEMS_PER_PAGE;
  const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
  const currentUsuarios = state.filteredUsuarios.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(state.filteredUsuarios.length / ITEMS_PER_PAGE);

  // Get unique roles for filter
  const rolesUnicos = [...new Set(
    state.usuarios.flatMap(usuario => 
      usuario.roles?.map(rol => rol.nombre) || []
    )
  )];

  // Count results
  const filteredCount = state.filteredUsuarios.length;
  const totalCount = state.usuarios.length;

  return (
    <div>
      <div className="space-y-4">
        <SearchFilterBar
          searchTerm={state.searchTerm}
          onSearchChange={handlers.handleSearch}
          statusFilter={state.statusFilter}
          onStatusFilterChange={actions.setStatusFilter}
          roleFilter={state.roleFilter}
          onRoleFilterChange={actions.setRoleFilter}
          sortBy={state.sortBy}
          onSortByChange={actions.setSortBy}
          sortDirection={state.sortDirection}
          onSortDirectionChange={handlers.handleToggleSortDirection}
          currentField={state.currentField}
          onCurrentFieldChange={actions.setCurrentField}
          onFilterChange={handlers.handleFilterChange}
          onExport={handlers.handleExportUsuarios}
          onNewItem={handlers.handleNuevoUsuario}
          items={state.usuarios}
          getFieldValue={getFieldValue}
          roles={rolesUnicos}
          newButtonLabel="Nuevo Usuario"
          sortOptions={SORT_OPTIONS}
          filteredCount={filteredCount}
          totalCount={totalCount}
          itemLabel="usuarios"
          filterOptions={FILTER_OPTIONS}
        />

        <div className="rounded-md border">
          <Table>
            <UsuarioTableHeader />
            <TableBody>
              {state.isLoading ? (
                <LoadingRow />
              ) : currentUsuarios.length > 0 ? (
                currentUsuarios.map((usuario) => (
                  <UsuarioRow
                    key={usuario.id}
                    usuario={usuario}
                    onEstadoChange={handlers.handleEstadoChange}
                    onDelete={handlers.handleDeleteUser}
                  />
                ))
              ) : (
                <EmptyStateRow />
              )}
            </TableBody>
          </Table>
        </div>
        
        {state.filteredUsuarios.length > ITEMS_PER_PAGE && (
          <PaginationComponent
            currentPage={state.currentPage}
            totalPages={totalPages}
            onPageChange={actions.setCurrentPage}
          />
        )}
      </div>

      <AlertDialog open={state.showDeleteDialog} onOpenChange={actions.setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Se eliminará permanentemente el usuario{' '}
              <span className="font-semibold">{state.usuarioAEliminar?.nombre}</span>.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handlers.confirmarEliminacion}
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

export default ListaUsuarios;
