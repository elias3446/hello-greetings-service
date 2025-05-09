import React, { useState } from 'react';
import { Table, TableBody } from '@/components/ui/table';
import SearchFilterBar from '@/components/layout/SearchFilterBar';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { useUsuarioState, useUsuarioData, useUsuarioFilters, useUsuarioHandlers } from '@/hooks/useUsuario';
import { UsuarioTableHeader, LoadingRow, EmptyStateRow, UsuarioRow, PaginationComponent } from '@/components/admin/usuarios/UsuarioComponents';
import { getFieldValue } from '@/utils/usuarioUtils';
import { SORT_OPTIONS, FILTER_OPTIONS, ITEMS_PER_PAGE } from '@/utils/userListConstants';
import { calculatePagination, getUniqueRoles } from '@/utils/userListUtils';
import { actualizarRolUsuario } from '@/controller/controller/userRoleController';
import { actualizarEstadoUsuario } from '@/controller/controller/userStateController';
import { eliminarUsuario } from '@/controller/controller/userDeleteController';
import { toast } from '@/components/ui/sonner';
import { Usuario } from '@/types/tipos';

const ListaUsuarios: React.FC = () => {
  const [state, actions] = useUsuarioState();
  const [selectedUsers, setSelectedUsers] = useState<Set<string>>(new Set());
  
  useUsuarioData(state, actions);
  useUsuarioFilters(state, actions);
  const handlers = useUsuarioHandlers(state, actions);

  const { currentUsuarios, totalPages } = calculatePagination(state.filteredUsuarios, state.currentPage);
  const rolesUnicos = getUniqueRoles(state.usuarios);

  // Count results
  const filteredCount = state.filteredUsuarios.length;
  const totalCount = state.usuarios.length;

  const handleSelectUser = (userId: string, checked: boolean) => {
    setSelectedUsers(prev => {
      const newSelected = new Set(prev);
      if (checked) {
        newSelected.add(userId);
      } else {
        newSelected.delete(userId);
      }
      return newSelected;
    });
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedUsers(new Set(currentUsuarios.map(user => user.id)));
    } else {
      setSelectedUsers(new Set());
    }
  };

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

  const handleEstadoChange = async (userId: string) => {
    const usuario = state.usuarios.find(user => user.id === userId);
    if (!usuario) {
      toast.error('Usuario no encontrado');
      return;
    }

    if (usuario.estado === 'bloqueado') {
      toast.error('No se puede cambiar el estado de un usuario bloqueado');
      return;
    }

    const nuevoEstado = usuario.estado === 'activo' ? 'inactivo' : 'activo';
    
    console.log('Iniciando cambio de estado:', {
      userId,
      estadoAnterior: usuario.estado,
      nuevoEstado
    });

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
      console.log('Actualizando estado local');
      // Actualizar el estado local de usuarios
      actions.setUsuarios(prevUsuarios => 
        prevUsuarios.map(user => 
          user.id === userId ? { ...user, estado: nuevoEstado } : user
        )
      );

      // Actualizar el estado local de usuarios filtrados
      actions.setFilteredUsuarios(prevUsuarios => 
        prevUsuarios.map(user => 
          user.id === userId ? { ...user, estado: nuevoEstado } : user
        )
      );

      console.log('Estado local actualizado');
    }
  };

  const handleDeleteUser = (usuario: Usuario) => {
    actions.setUsuarioAEliminar(usuario);
    actions.setShowDeleteDialog(true);
  };

  const confirmarEliminacion = async () => {
    try {
      if (!state.usuarioAEliminar) return;

      const resultado = await eliminarUsuario(
        state.usuarioAEliminar,
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
        // Actualizar el estado local
        actions.setUsuarios(prevUsuarios => 
          prevUsuarios.filter(user => user.id !== state.usuarioAEliminar?.id)
        );
        actions.setFilteredUsuarios(prevUsuarios => 
          prevUsuarios.filter(user => user.id !== state.usuarioAEliminar?.id)
        );
      }
    } catch (error) {
      console.error('Error al eliminar el usuario:', error);
      toast.error('Error al eliminar el usuario');
    } finally {
      actions.setShowDeleteDialog(false);
      actions.setUsuarioAEliminar(null);
    }
  };

  return (
    <div className="space-y-6">
        <SearchFilterBar
          searchTerm={state.searchTerm}
        onSearchChange={actions.setSearchTerm}
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
        showNewButton={true}
        newButtonLabel="Nuevo usuario"
        showExportButton={true}
          sortOptions={SORT_OPTIONS}
          filteredCount={filteredCount}
          totalCount={totalCount}
          itemLabel="usuarios"
          filterOptions={FILTER_OPTIONS}
        searchPlaceholder="Buscar usuarios..."
        />

        <div className="rounded-md border">
          <Table>
            <UsuarioTableHeader onSelectAll={handleSelectAll} />
            <TableBody>
              {state.isLoading ? (
                <LoadingRow />
              ) : state.filteredUsuarios.length === 0 ? (
                <EmptyStateRow />
              ) : (
                currentUsuarios.map((usuario) => (
                  <UsuarioRow
                    key={usuario.id}
                    usuario={usuario}
                    onEstadoChange={handleEstadoChange}
                    onDelete={handleDeleteUser}
                    onRoleChange={handleRoleChange}
                    onSelect={handleSelectUser}
                    isSelected={selectedUsers.has(usuario.id)}
                  />
                ))
              )}
            </TableBody>
          </Table>
        </div>
        
        <PaginationComponent
          currentPage={state.currentPage}
          totalPages={totalPages}
          onPageChange={actions.setCurrentPage}
        />

      <AlertDialog open={state.showDeleteDialog} onOpenChange={actions.setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Se eliminará permanentemente el usuario{' '}
              <span className="font-semibold">{state.usuarioAEliminar?.nombre} {state.usuarioAEliminar?.apellido}</span>.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmarEliminacion}
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
