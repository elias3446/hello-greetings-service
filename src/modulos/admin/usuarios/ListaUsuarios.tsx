import React from 'react';
import { Table, TableBody } from '@/components/ui/table';
import SearchFilterBar from '@/components/layout/SearchFilterBar';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { useUsuarioState, useUsuarioData, useUsuarioFilters, useUsuarioHandlers } from '@/hooks/useUsuario';
import { UsuarioTableHeader, LoadingRow, EmptyStateRow, UsuarioRow, PaginationComponent } from '@/components/admin/usuarios/UsuarioComponents';
import { getFieldValue } from '@/utils/usuarioUtils';
import { SORT_OPTIONS, FILTER_OPTIONS, ITEMS_PER_PAGE } from '@/utils/userListConstants';
import { calculatePagination, getUniqueRoles } from '@/utils/userListUtils';
import { actualizarRolUsuario } from '@/controller/controller/userRoleController';
import { toast } from '@/components/ui/sonner';

const ListaUsuarios: React.FC = () => {
  const [state, actions] = useUsuarioState();
  
  useUsuarioData(state, actions);
  useUsuarioFilters(state, actions);
  const handlers = useUsuarioHandlers(state, actions);

  const { currentUsuarios, totalPages } = calculatePagination(state.filteredUsuarios, state.currentPage);
  const rolesUnicos = getUniqueRoles(state.usuarios);

  // Count results
  const filteredCount = state.filteredUsuarios.length;
  const totalCount = state.usuarios.length;

  const handleRoleChange = async (userId: string, newRoleId: string) => {
    try {
      const usuarioActual = state.usuarios.find(u => u.id === userId);
      if (!usuarioActual) {
        toast.error('Usuario no encontrado');
        return;
      }

      const usuarioActualizado = actualizarRolUsuario(
        userId,
        newRoleId,
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
        },
        `Cambio de rol para usuario ${usuarioActual.nombre} ${usuarioActual.apellido}`
      );

      if (usuarioActualizado) {
        // Actualizar el estado local
        actions.setUsuarios(prevUsuarios => 
          prevUsuarios.map(user => 
            user.id === userId ? usuarioActualizado : user
          )
        );
        actions.setFilteredUsuarios(prevUsuarios => 
          prevUsuarios.map(user => 
            user.id === userId ? usuarioActualizado : user
          )
        );
        toast.success('Rol actualizado correctamente');
      }
    } catch (error) {
      console.error('Error al actualizar el rol:', error);
      toast.error('Error al actualizar el rol del usuario');
    }
  };

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
                    onRoleChange={handleRoleChange}
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
