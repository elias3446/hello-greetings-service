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
import RoleSelector from '@/components/admin/selector/RoleSelector';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const ListaUsuarios: React.FC = () => {
  const [state, actions] = useUsuarioState();
  const [selectedUsers, setSelectedUsers] = useState<Set<string>>(new Set());
  const [selectedRoleId, setSelectedRoleId] = useState<string>('');
  const [selectedEstado, setSelectedEstado] = useState<'activo' | 'inactivo'>('activo');
  const [usuariosAEliminar, setUsuariosAEliminar] = useState<Usuario[]>([]);
  
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

  const handleBulkEstadoUpdate = async () => {
    if (selectedUsers.size === 0) {
      toast.error('Por favor seleccione al menos un usuario');
      return;
    }

    const systemUser: Usuario = {
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
        tipo: 'admin' as const,
        fechaCreacion: new Date('2023-01-01'),
        activo: true
      }],
      fechaCreacion: new Date('2023-01-01'),
    };

    let successCount = 0;
    let errorCount = 0;
    let skippedCount = 0;

    for (const userId of selectedUsers) {
      try {
        const usuario = state.usuarios.find(u => u.id === userId);
        if (!usuario) continue;

        if (usuario.estado === 'bloqueado') {
          skippedCount++;
          continue;
        }

        const resultado = await actualizarEstadoUsuario(
          usuario,
          selectedEstado,
          systemUser,
          'Actualización masiva de estados'
        );

        if (resultado) {
          successCount++;
          // Actualizar el estado local
          actions.setUsuarios(prevUsuarios => 
            prevUsuarios.map(user => 
              user.id === userId ? { ...user, estado: selectedEstado } : user
            )
          );
          actions.setFilteredUsuarios(prevUsuarios => 
            prevUsuarios.map(user => 
              user.id === userId ? { ...user, estado: selectedEstado } : user
            )
          );
        } else {
          errorCount++;
        }
      } catch (error) {
        console.error(`Error al actualizar el estado del usuario ${userId}:`, error);
        errorCount++;
      }
    }

    if (successCount > 0) {
      toast.success(`Se actualizaron ${successCount} usuarios correctamente`);
    }
    if (errorCount > 0) {
      toast.error(`Hubo errores al actualizar ${errorCount} usuarios`);
    }
    if (skippedCount > 0) {
      toast.info(`${skippedCount} usuarios bloqueados fueron omitidos`);
    }

    // Limpiar la selección después de la actualización
    setSelectedUsers(new Set());
    setSelectedEstado('activo');
  };

  const handleBulkRoleUpdate = async () => {
    if (!selectedRoleId || selectedUsers.size === 0) {
      toast.error('Por favor seleccione un rol y al menos un usuario');
      return;
    }

    const systemUser: Usuario = {
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
        tipo: 'admin' as const,
        fechaCreacion: new Date('2023-01-01'),
        activo: true
      }],
      fechaCreacion: new Date('2023-01-01'),
    };

    let successCount = 0;
    let errorCount = 0;
    let skippedCount = 0;

    for (const userId of selectedUsers) {
      try {
        const usuario = state.usuarios.find(u => u.id === userId);
        if (!usuario) continue;

        if (usuario.estado === 'bloqueado') {
          skippedCount++;
          continue;
        }

        const usuarioActualizado = actualizarRolUsuario(
          userId,
          selectedRoleId,
          systemUser,
          'Actualización masiva de roles'
        );

        if (usuarioActualizado) {
          successCount++;
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
        } else {
          errorCount++;
        }
      } catch (error) {
        console.error(`Error al actualizar el rol del usuario ${userId}:`, error);
        errorCount++;
      }
    }

    if (successCount > 0) {
      toast.success(`Se actualizaron ${successCount} usuarios correctamente`);
    }
    if (errorCount > 0) {
      toast.error(`Hubo errores al actualizar ${errorCount} usuarios`);
    }
    if (skippedCount > 0) {
      toast.info(`${skippedCount} usuarios bloqueados fueron omitidos`);
    }

    // Limpiar la selección después de la actualización
    setSelectedUsers(new Set());
    setSelectedRoleId('');
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

  const handleBulkDelete = () => {
    const usuariosSeleccionados = state.usuarios.filter(user => selectedUsers.has(user.id));
    setUsuariosAEliminar(usuariosSeleccionados);
    actions.setShowDeleteDialog(true);
  };

  const confirmarEliminacion = async () => {
    try {
      if (usuariosAEliminar.length > 0) {
        let successCount = 0;
        let errorCount = 0;

        for (const usuario of usuariosAEliminar) {
          const resultado = await eliminarUsuario(
            usuario,
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
            successCount++;
            // Actualizar el estado local
            actions.setUsuarios(prevUsuarios => 
              prevUsuarios.filter(user => user.id !== usuario.id)
            );
            actions.setFilteredUsuarios(prevUsuarios => 
              prevUsuarios.filter(user => user.id !== usuario.id)
            );
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
      } else if (state.usuarioAEliminar) {
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
      }
    } catch (error) {
      console.error('Error al eliminar los usuarios:', error);
      toast.error('Error al eliminar los usuarios');
    } finally {
      actions.setShowDeleteDialog(false);
      actions.setUsuarioAEliminar(null);
      setUsuariosAEliminar([]);
      setSelectedUsers(new Set());
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

        {selectedUsers.size > 0 && (
          <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-md border">
            <div className="flex-1">
              <span className="text-sm font-medium text-gray-700">
                {selectedUsers.size} {selectedUsers.size === 1 ? 'usuario seleccionado' : 'usuarios seleccionados'}
              </span>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-[200px]">
                <RoleSelector
                  userId="bulk-update"
                  currentRoleId={selectedRoleId}
                  onRoleChange={async (_, roleId) => {
                    setSelectedRoleId(roleId);
                    return Promise.resolve();
                  }}
                  autoUpdate={false}
                />
              </div>
              <Button
                onClick={handleBulkRoleUpdate}
                disabled={!selectedRoleId}
                variant="default"
              >
                Actualizar Roles
              </Button>
              <div className="w-[200px]">
                <Select
                  value={selectedEstado}
                  onValueChange={(value: 'activo' | 'inactivo') => setSelectedEstado(value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar estado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="activo">Activo</SelectItem>
                    <SelectItem value="inactivo">Inactivo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button
                onClick={handleBulkEstadoUpdate}
                variant="default"
              >
                Actualizar Estados
              </Button>
              <Button
                onClick={handleBulkDelete}
                variant="destructive"
              >
                Eliminar Seleccionados
              </Button>
              <Button
                onClick={() => {
                  setSelectedUsers(new Set());
                  setSelectedRoleId('');
                  setSelectedEstado('activo');
                }}
                variant="outline"
              >
                Cancelar
              </Button>
            </div>
          </div>
        )}

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
              {usuariosAEliminar.length > 0 ? (
                <>
                  Esta acción no se puede deshacer. Se eliminarán permanentemente {usuariosAEliminar.length} usuarios seleccionados.
                </>
              ) : (
                <>
                  Esta acción no se puede deshacer. Se eliminará permanentemente el usuario{' '}
                  <span className="font-semibold">{state.usuarioAEliminar?.nombre} {state.usuarioAEliminar?.apellido}</span>.
                </>
              )}
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
