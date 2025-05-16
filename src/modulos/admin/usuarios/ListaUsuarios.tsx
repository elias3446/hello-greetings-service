import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableHeader, TableRow, TableHead } from '@/components/ui/table';
import SearchFilterBar from '@/components/layout/SearchFilterBar';
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

const ListaUsuarios: React.FC = () => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [filteredUsuarios, setFilteredUsuarios] = useState<Usuario[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('nombre');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedUsers, setSelectedUsers] = useState<Set<string>>(new Set());
  const [selectedRoleId, setSelectedRoleId] = useState<string>('');
  const [selectedEstado, setSelectedEstado] = useState<'activo' | 'inactivo'>('activo');
  const [usuariosAEliminar, setUsuariosAEliminar] = useState<Usuario[]>([]);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [usuarioAEliminar, setUsuarioAEliminar] = useState<Usuario | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate();
  const location = useLocation();

  // Cargar usuarios
  useEffect(() => {
    const loadUsuarios = async () => {
      setIsLoading(true);
      try {
        const data = getUsers();
        setUsuarios(data);
        setFilteredUsuarios(data);
      } catch (error) {
        toast.error("Error al cargar usuarios");
      } finally {
        setIsLoading(false);
      }
    };

    loadUsuarios();
  }, []);

  // Aplicar filtros y ordenamiento
  useEffect(() => {
    let result = [...usuarios];

    // Aplicar búsqueda
    if (searchTerm) {
      const term = normalizeText(searchTerm);
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

    // Aplicar ordenamiento
    result = sortUsers(result, sortBy, sortDirection);
    setFilteredUsuarios(result);
    setCurrentPage(1);
  }, [usuarios, searchTerm, sortBy, sortDirection]);

  const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
  const currentUsuarios = filteredUsuarios.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredUsuarios.length / ITEMS_PER_PAGE);

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
      setSelectedUsers(new Set(filteredUsuarios.map(user => user.id)));
    } else {
      setSelectedUsers(new Set());
    }
  };

  const isAllSelected = filteredUsuarios.length > 0 && 
    filteredUsuarios.every(user => selectedUsers.has(user.id));
  const isSomeSelected = filteredUsuarios.some(user => selectedUsers.has(user.id));

  const handleToggleSortDirection = () => {
    setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
  };

  const handleEstadoChange = async (userId: string) => {
    const usuario = usuarios.find(user => user.id === userId);
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
        setUsuarios(prevUsuarios => 
          prevUsuarios.map(user => 
            user.id === userId ? { ...user, estado: nuevoEstado } : user
          )
        );
        toast.success(`Estado actualizado a ${nuevoEstado}`);
      }
    } catch (error) {
      console.error('Error al actualizar el estado:', error);
      toast.error('Error al actualizar el estado');
    }
  };

  const handleDeleteUser = (usuario: Usuario) => {
    setUsuarioAEliminar(usuario);
    setShowDeleteDialog(true);
  };

  const handleBulkDelete = () => {
    const usuariosSeleccionados = usuarios.filter(user => selectedUsers.has(user.id));
    setUsuariosAEliminar(usuariosSeleccionados);
    setShowDeleteDialog(true);
  };

  const handleCancelDelete = () => {
    setUsuarioAEliminar(null);
    setUsuariosAEliminar([]);
    setShowDeleteDialog(false);
  };

  const confirmarEliminacion = async () => {
    try {
      if (usuariosAEliminar.length > 0) {
        let successCount = 0;
        let errorCount = 0;

        for (const usuario of usuariosAEliminar) {
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
            setUsuarios(prevUsuarios => 
              prevUsuarios.filter(user => user.id !== usuario.id)
            );
            setSelectedUsers(prev => {
              const newSelected = new Set(prev);
              newSelected.delete(usuario.id);
              return newSelected;
            });
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
      } else if (usuarioAEliminar) {
        const resultado = await eliminarUsuario(usuarioAEliminar, {
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
          setUsuarios(prevUsuarios => 
            prevUsuarios.filter(user => user.id !== usuarioAEliminar.id)
          );
          setSelectedUsers(prev => {
            const newSelected = new Set(prev);
            newSelected.delete(usuarioAEliminar.id);
            return newSelected;
          });
          toast.success('Usuario eliminado correctamente');
        }
      }
    } catch (error) {
      console.error('Error al eliminar los usuarios:', error);
      toast.error('Error al eliminar los usuarios');
    } finally {
      handleCancelDelete();
      setSelectedUsers(new Set());
    }
  };

  const handleNuevoUsuario = () => {
    navigate('/admin/usuarios/nuevo', { 
      state: { from: location.pathname } 
    });
  };

  return (
    <div className="space-y-6">

      <SearchFilterBar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        sortBy={sortBy}
        onSortByChange={setSortBy}
        sortDirection={sortDirection}
        onSortDirectionChange={handleToggleSortDirection}
        sortOptions={SORT_OPTIONS}
        filterOptions={FILTER_OPTIONS}
        filteredCount={filteredUsuarios.length}
        totalCount={usuarios.length}
        itemLabel="usuarios"
        searchPlaceholder="Buscar usuarios..."
        statusFilter={null}
        onStatusFilterChange={() => {}}
        roleFilter={null}
        onRoleFilterChange={() => {}}
        onCurrentFieldChange={() => {}}
        onFilterChange={() => {}}
        onExport={() => {}}
        onNewItem={handleNuevoUsuario}
        items={usuarios}
        getFieldValue={getFieldValue}
        newButtonLabel="Nuevo usuario"
      />

      {selectedUsers.size > 0 && (
        <BulkActionsBar
          selectedUsers={selectedUsers}
          selectedRoleId={selectedRoleId}
          selectedEstado={selectedEstado}
          onRoleChange={(_, roleId) => {
            setSelectedRoleId(roleId);
            return Promise.resolve();
          }}
          onEstadoChange={(value) => setSelectedEstado(value)}
          onBulkRoleUpdate={() => {}}
          onBulkEstadoUpdate={() => {}}
          onBulkDelete={handleBulkDelete}
          onCancel={() => {
            setSelectedUsers(new Set());
            setSelectedRoleId('');
            setSelectedEstado('activo');
          }}
        />
      )}

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
            <TableHead className="w-[50px]">
                  <Checkbox
                    checked={isAllSelected}
                    indeterminate={isSomeSelected && !isAllSelected}
                    onCheckedChange={handleSelectAll}
                    aria-label="Seleccionar todos los reportes"
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
            ) : filteredUsuarios.length === 0 ? (
              <EmptyStateRow />
            ) : (
              currentUsuarios.map((usuario) => (
                <UsuarioRow
                  key={usuario.id}
                  usuario={usuario}
                  onEstadoChange={handleEstadoChange}
                  onDelete={handleDeleteUser}
                  onSelect={handleSelectUser}
                  isSelected={selectedUsers.has(usuario.id)}
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
        onPageChange={setCurrentPage}
        totalItems={filteredUsuarios.length}
        itemsPerPage={ITEMS_PER_PAGE}
      />

      <DeleteUserDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        usuarioAEliminar={usuarioAEliminar}
        usuariosAEliminar={usuariosAEliminar}
        onConfirm={confirmarEliminacion}
        onCancel={handleCancelDelete}
      />
    </div>
  );
};

export default ListaUsuarios;
