import React, { useState, useEffect } from 'react';
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
import { getUsers, updateUser, deleteUser } from '@/controller/userController';
import RoleSelector from '@/components/admin/selector/RoleSelector';
import { sortUsers } from '@/utils/userUtils';
import SearchFilterBar from '@/components/layout/SearchFilterBar';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';

const ListaUsuarios: React.FC = () => {
  const navigate = useNavigate();
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [filteredUsuarios, setFilteredUsuarios] = useState<Usuario[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [roleFilter, setRoleFilter] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<string>('nombre');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [currentField, setCurrentField] = useState<string | undefined>();
  const [selectedFilterValues, setSelectedFilterValues] = useState<any[]>([]);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [usuarioAEliminar, setUsuarioAEliminar] = useState<{ id: string; nombre: string } | null>(null);
  const itemsPerPage = 10;
  const [searchField, setSearchField] = useState<string>('nombre');

  const sortOptions = [
    { value: 'nombre', label: 'Nombre' },
    { value: 'email', label: 'Email' },
    { value: 'fecha', label: 'Fecha creación' },
  ];

  const filterOptions = [
    { value: 'estado', label: 'Estado' },
    { value: 'rol', label: 'Rol' },
  ];

  useEffect(() => {
    // Cargar usuarios
    setIsLoading(true);
    try {
      const data = getUsers();
      setUsuarios(data);
      setFilteredUsuarios(data);
      setIsLoading(false);
    } catch (error) {
      toast.error("Error al cargar usuarios");
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    // Aplicar filtros, búsqueda y ordenamiento
    let result = [...usuarios];

    // Aplicar filtro de búsqueda
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        usuario => usuario.nombre.toLowerCase().includes(term) ||
                usuario.apellido.toLowerCase().includes(term) ||
                usuario.email.toLowerCase().includes(term) ||
                (usuario.roles && usuario.roles.some(rol => rol.nombre.toLowerCase().includes(term)))
      );
    }

    // Separar los valores de filtro por tipo
    const filterValues = selectedFilterValues.filter(value => !value.includes(':'));
    const filterStates = selectedFilterValues.filter(value => value.startsWith('estado:')).map(value => value.split(':')[1]);
    const filterRoles = selectedFilterValues.filter(value => value.startsWith('rol:')).map(value => value.split(':')[1]);

    // Aplicar filtro de valores (si hay valores seleccionados)
    if (filterValues.length > 0) {
      result = result.filter(usuario => 
        filterValues.includes(getFieldValue(usuario, sortBy))
      );
    }

    // Aplicar filtro de estados sobre el resultado anterior
    if (filterStates.length > 0) {
      result = result.filter(usuario => 
        filterStates.includes(usuario.estado)
      );
    }

    // Aplicar filtro de roles sobre el resultado anterior
    if (filterRoles.length > 0) {
      result = result.filter(usuario => 
        usuario.roles?.some(rol => filterRoles.includes(rol.nombre))
      );
    }

    // Aplicar ordenamiento utilizando la función del util
    result = sortUsers(result, sortBy, sortDirection);

    setFilteredUsuarios(result);
    // Reset to first page when filters change
    setCurrentPage(1);
  }, [usuarios, searchTerm, sortBy, sortDirection, selectedFilterValues]);

  // Paginación
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentUsuarios = filteredUsuarios.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredUsuarios.length / itemsPerPage);

  // Función para obtener el valor del campo según el campo actual
  const getFieldValue = (usuario: Usuario, field: string): string => {
    switch (field) {
      case 'nombre':
        return usuario.nombre + ' ' + usuario.apellido;
      case 'email':
        return usuario.email;
      case 'fecha':
        return new Date(usuario.fechaCreacion).toLocaleDateString('es-ES');
      case 'estado':
        return usuario.estado;
      case 'rol':
        return usuario.roles?.map(rol => rol.nombre).join(', ') || '';
      default:
        return '';
    }
  };

  const handleToggleSortDirection = () => {
    setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
  };

  const handleFilterChange = (values: any[]) => {
    setSelectedFilterValues(values);
  };

  // Resetear valores de filtro cuando cambia el campo de ordenamiento
  useEffect(() => {
    // Solo resetear los valores que no son filtros (estado o rol)
    setSelectedFilterValues(prev => 
      prev.filter(value => value.startsWith('estado:') || value.startsWith('rol:'))
    );
  }, [sortBy]);

  const handleExportUsuarios = () => {
    // Implementación para exportar usuarios
    const data = filteredUsuarios.map(usuario => ({
      nombre: usuario.nombre + ' ' + usuario.apellido,
      email: usuario.email,
      rol: usuario.roles?.length > 0 ? usuario.roles[0].nombre : '',
      fechaCreacion: new Date(usuario.fechaCreacion).toLocaleDateString('es-ES'),
      estado: usuario.estado ? 'Activo' : 'Inactivo'
    }));
    
    const csvContent = [
      Object.keys(data[0]).join(','),
      ...data.map(row => Object.values(row).join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', 'usuarios_export.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success('Datos exportados correctamente');
  };

  // Obtener roles únicos para el filtro
  const rolesUnicos = [...new Set(
    usuarios.flatMap(usuario => 
      usuario.roles?.map(rol => rol.nombre) || []
    )
  )];

  // Contar los resultados después de aplicar los filtros
  const filteredCount = filteredUsuarios.length;
  const totalCount = usuarios.length;

  const handleNuevoUsuario = () => {
    navigate('/admin/usuarios/nuevo');
  };

  const handleViewDetails = (usuarioId: string) => {
    navigate(`/admin/usuarios/${usuarioId}`);
  };

  // Función para manejar la eliminación de usuarios
  const handleDeleteUser = (usuarioId: string, nombreUsuario: string) => {
    setUsuarioAEliminar({ id: usuarioId, nombre: nombreUsuario });
    setShowDeleteDialog(true);
  };

  const confirmarEliminacion = () => {
    try {
      if (!usuarioAEliminar) return;
      
      const eliminado = deleteUser(usuarioAEliminar.id);
      
      if (eliminado) {
        // Actualizar el estado local
        setUsuarios(prevUsuarios => prevUsuarios.filter(user => user.id !== usuarioAEliminar.id));
        setFilteredUsuarios(prevUsuarios => prevUsuarios.filter(user => user.id !== usuarioAEliminar.id));
        
        toast.success(`Usuario ${usuarioAEliminar.nombre} eliminado correctamente`);
      } else {
        toast.error('Error al eliminar el usuario');
      }
    } catch (error) {
      console.error('Error al eliminar el usuario:', error);
      toast.error('Error al eliminar el usuario');
    } finally {
      setShowDeleteDialog(false);
      setUsuarioAEliminar(null);
    }
  };

  // Función para cambiar el estado del usuario (activo/inactivo)
  const handleEstadoChange = (usuarioId: string) => {
    const usuario = usuarios.find(user => user.id === usuarioId);
    if (usuario) {
      // Solo permitir cambiar entre activo e inactivo si no está bloqueado
      if (usuario.estado === 'bloqueado') {
        toast.error('No se puede cambiar el estado de un usuario bloqueado directamente');
        return;
      }
      
      // Determine the new state based on current state
      const nuevoEstado = usuario.estado === 'activo' ? 'inactivo' : 'activo';
      
      // Update the user in the data layer
      const updatedUser = updateUser(usuarioId, { estado: nuevoEstado });
      
      if (!updatedUser) {
        toast.error('Error al actualizar el estado del usuario');
        return;
      }
      
      // Update both usuarios and filteredUsuarios arrays to reflect the change immediately
      setUsuarios(prevUsuarios => prevUsuarios.map(user => {
        if (user.id === usuarioId) {
          return { ...user, estado: nuevoEstado };
        }
        return user;
      }));
      
      toast.success(`Estado del usuario actualizado a ${nuevoEstado === 'activo' ? 'Activo' : 'Inactivo'}`);
    }
  };

  const normalizeText = (text: string) => {
    return text
      .toString()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Elimina tildes
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, '') // Elimina caracteres especiales
      .replace(/\s+/g, ' ') // Espacios múltiples a uno solo
      .trim();
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    if (!term) {
      setFilteredUsuarios(usuarios);
      return;
    }

    const searchTerm = normalizeText(term);
    const filtered = usuarios.filter(usuario => {
      const nombreCompleto = normalizeText(`${usuario.nombre} ${usuario.apellido}`);
      const email = normalizeText(usuario.email);
      const roles = normalizeText(usuario.roles.map(rol => rol.nombre).join(', '));
      const fechaFormateada = normalizeText(new Date(usuario.fechaCreacion).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' }));
      const estado = normalizeText(usuario.estado);

      // console.log({ nombreCompleto, email, roles, fechaFormateada, estado, searchTerm });

      if (nombreCompleto.includes(searchTerm)) return true;
      if (email.includes(searchTerm)) return true;
      if (roles.includes(searchTerm)) return true;
      if (fechaFormateada.includes(searchTerm)) return true;
      if (estado.includes(searchTerm)) return true;
      return false;
    });

    setFilteredUsuarios(filtered);
  };

  console.log('filteredUsuarios', filteredUsuarios);
  console.log('currentUsuarios', currentUsuarios);

  return (
    <div>
      <div className="space-y-4">
        {/* Barra de búsqueda y acciones */}
        <SearchFilterBar
          searchTerm={searchTerm}
          onSearchChange={handleSearch}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          roleFilter={roleFilter}
          onRoleFilterChange={setRoleFilter}
          sortBy={sortBy}
          onSortByChange={setSortBy}
          sortDirection={sortDirection}
          onSortDirectionChange={handleToggleSortDirection}
          currentField={currentField}
          onCurrentFieldChange={setCurrentField}
          onFilterChange={handleFilterChange}
          onExport={handleExportUsuarios}
          onNewItem={handleNuevoUsuario}
          items={usuarios}
          getFieldValue={getFieldValue}
          roles={rolesUnicos}
          newButtonLabel="Nuevo Usuario"
          sortOptions={sortOptions}
          filteredCount={filteredUsuarios.length}
          totalCount={usuarios.length}
          itemLabel="usuarios"
          filterOptions={filterOptions}
          searchPlaceholder="Buscar por nombre, email, rol, fecha o estado..."
        />

        {/* Tabla de usuarios */}
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead className="font-semibold text-gray-600">Nombre</TableHead>
                <TableHead className="font-semibold text-gray-600">Email</TableHead>
                <TableHead className="font-semibold text-gray-600">Rol</TableHead>
                <TableHead className="font-semibold text-gray-600">Fecha creación</TableHead>
                <TableHead className="font-semibold text-gray-600 text-center">Estado</TableHead>
                <TableHead className="font-semibold text-gray-600 text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    <div className="flex justify-center">
                      <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full"></div>
                    </div>
                  </TableCell>
                </TableRow>
              ) : currentUsuarios.length > 0 ? (
                currentUsuarios.map((usuario) => (
                  <TableRow key={usuario.id}>
                    <TableCell>
                      <Link to={`/admin/usuarios/${usuario.id}`} className="text-blue-600 hover:underline">
                        {usuario.nombre} {usuario.apellido}
                      </Link>
                    </TableCell>
                    <TableCell>{usuario.email}</TableCell>
                    <TableCell>
                      {usuario.roles && usuario.roles.length > 0 && (
                        <RoleSelector
                          userId={usuario.id}
                          currentRoleId={usuario.roles[0].id}
                        />
                      )}
                    </TableCell>
                    <TableCell>{new Date(usuario.fechaCreacion).toLocaleDateString('es-ES', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}</TableCell>
                    <TableCell className="text-center">
                      <Badge 
                        variant={
                          usuario.estado === 'activo' ? 'success' : 
                          usuario.estado === 'inactivo' ? 'inactive' : 
                          'destructive'
                        }
                        className={`cursor-pointer ${
                          usuario.estado === 'bloqueado' ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                        onClick={() => usuario.estado !== 'bloqueado' && handleEstadoChange(usuario.id)}
                      >
                        {usuario.estado === 'activo' ? 'Activo' : 
                         usuario.estado === 'inactivo' ? 'Inactivo' : 
                         'Bloqueado'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          asChild
                        >
                          <Link to={`/admin/usuarios/${usuario.id}/editar`}>
                            <PencilIcon className="h-4 w-4 text-gray-500" />
                          </Link>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-red-500 hover:text-red-600"
                          onClick={() => handleDeleteUser(usuario.id, `${usuario.nombre} ${usuario.apellido}`)}
                        >
                          <Trash2Icon className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-4 text-gray-500">
                    No se encontraron usuarios con los criterios seleccionados
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        
        {/* Paginación */}
        {filteredUsuarios.length > itemsPerPage && (
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500">
              Página {currentPage} de {totalPages}
            </div>
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious 
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
                  />
                </PaginationItem>
                
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter(page => 
                    page === 1 || 
                    page === totalPages || 
                    (page >= currentPage - 1 && page <= currentPage + 1)
                  )
                  .map((page, i, array) => {
                    // Determinar si necesitamos mostrar puntos suspensivos
                    const showEllipsisBefore = i > 0 && array[i - 1] !== page - 1;
                    const showEllipsisAfter = i < array.length - 1 && array[i + 1] !== page + 1;
                    
                    return (
                      <React.Fragment key={page}>
                        {showEllipsisBefore && (
                          <PaginationItem>
                            <span className="flex h-9 w-9 items-center justify-center text-gray-400">...</span>
                          </PaginationItem>
                        )}
                        
                        <PaginationItem>
                          <PaginationLink
                            onClick={() => setCurrentPage(page)}
                            isActive={currentPage === page}
                          >
                            {page}
                          </PaginationLink>
                        </PaginationItem>
                        
                        {showEllipsisAfter && (
                          <PaginationItem>
                            <span className="flex h-9 w-9 items-center justify-center text-gray-400">...</span>
                          </PaginationItem>
                        )}
                      </React.Fragment>
                    );
                  })
                }
                
                <PaginationItem>
                  <PaginationNext 
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </div>

      {/* Diálogo de confirmación para eliminar usuario */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Se eliminará permanentemente el usuario{' '}
              <span className="font-semibold">{usuarioAEliminar?.nombre}</span>.
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
