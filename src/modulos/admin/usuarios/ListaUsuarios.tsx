import React from 'react';
import { Table, TableBody } from '@/components/ui/table';
import SearchFilterBar from '@/components/layout/SearchFilterBar';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { useUsuarioState, useUsuarioData, useUsuarioFilters, useUsuarioHandlers } from '@/hooks/useUsuario';
import { UsuarioTableHeader, LoadingRow, EmptyStateRow, UsuarioRow, PaginationComponent } from '@/components/admin/usuarios/UsuarioComponents';
import { getFieldValue } from '@/utils/usuarioUtils';
import { SORT_OPTIONS, FILTER_OPTIONS, ITEMS_PER_PAGE } from '@/utils/userListConstants';
import { calculatePagination, getUniqueRoles } from '@/utils/userListUtils';

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
