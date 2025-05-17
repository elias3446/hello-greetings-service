import { Usuario } from '@/types/tipos';
import { getFieldValue } from '@/utils/usuarioUtils';
import { normalizeText } from '@/utils/usuarioUtils';
import { sortUsers } from '@/utils/userUtils';
import { toast } from '@/components/ui/sonner';
import { actualizarEstadoUsuario } from '@/controller/controller/user/userStateController';
import { eliminarUsuario } from '@/controller/controller/user/userDeleteController';

export const ATTRIBUTES = [
  { label: "Nombre", value: "nombre", type: "string" as const },
  { label: "Email", value: "email", type: "string" as const },
  { label: "Fecha Creación", value: "fechaCreacion", type: "date" as const },
];

export const PROPERTY_FILTERS = [
  { 
    label: "Rol", 
    value: "roles", 
    property: "roles", 
    type: "object" as const,
    getValue: (item: any) => item.roles,
    formatValue: (value: any) => value.map((rol: any) => rol.nombre).join(', ')
  },
  { label: "Estado", value: "estado", property: "estado", type: "string" as const },
];

export const SYSTEM_USER: Usuario = {
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
};

export const applyFiltersAndSorting = (
  usuarios: Usuario[],
  searchTerm: string,
  sortBy: string,
  sortDirection: 'asc' | 'desc',
  selectedFilterValues: string[]
) => {
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

  // Aplicar filtros
  const filterValues = selectedFilterValues.filter(value => !value.includes(':'));
  const filterStates = selectedFilterValues
    .filter(value => value.startsWith('estado:'))
    .map(value => value.split(':')[1]);
  const filterRoles = selectedFilterValues
    .filter(value => value.startsWith('rol:'))
    .map(value => value.split(':')[1]);

  if (filterValues.length > 0) {
    result = result.filter(usuario => 
      filterValues.includes(getFieldValue(usuario, sortBy))
    );
  }

  if (filterStates.length > 0) {
    result = result.filter(usuario => 
      filterStates.includes(usuario.estado)
    );
  }

  if (filterRoles.length > 0) {
    result = result.filter(usuario => 
      usuario.roles.some(rol => filterRoles.includes(rol.nombre))
    );
  }

  // Aplicar ordenamiento
  return sortUsers(result, sortBy, sortDirection);
};

export const handleEstadoChange = async (
  userId: string,
  usuarios: Usuario[],
  setState: (callback: (prev: any) => any) => void
) => {
  const usuario = usuarios.find(user => user.id === userId);
  if (!usuario || usuario.estado === 'bloqueado') {
    toast.error('No se puede cambiar el estado de un usuario bloqueado');
    return;
  }

  const nuevoEstado = usuario.estado === 'activo' ? 'inactivo' : 'activo';
  
  try {
    const resultado = await actualizarEstadoUsuario(usuario, nuevoEstado, SYSTEM_USER);

    if (resultado) {
      setState(prev => ({
        usuarios: prev.usuarios.map(user => 
          user.id === userId ? { ...user, estado: nuevoEstado } : user
        )
      }));
      toast.success(`Estado actualizado a ${nuevoEstado}`);
    }
  } catch (error) {
    console.error('Error al actualizar el estado:', error);
    toast.error('Error al actualizar el estado');
  }
};

export const confirmarEliminacion = async (
  usuariosAEliminar: Usuario[],
  usuarioAEliminar: Usuario | null,
  setState: (callback: (prev: any) => any) => void,
  handleCancelDelete: () => void
) => {
  try {
    if (usuariosAEliminar.length > 0) {
      let successCount = 0;
      let errorCount = 0;

      for (const usuario of usuariosAEliminar) {
        const resultado = await eliminarUsuario(usuario, SYSTEM_USER);

        if (resultado) {
          successCount++;
          setState(prev => ({
            usuarios: prev.usuarios.filter(user => user.id !== usuario.id)
          }));
          setState(prev => ({
            selectedUsers: new Set(Array.from(prev.selectedUsers).filter(id => id !== usuario.id))
          }));
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
      const resultado = await eliminarUsuario(usuarioAEliminar, SYSTEM_USER);

      if (resultado) {
        setState(prev => ({
          usuarios: prev.usuarios.filter(user => user.id !== usuarioAEliminar.id)
        }));
        setState(prev => ({
          selectedUsers: new Set(Array.from(prev.selectedUsers).filter(id => id !== usuarioAEliminar.id))
        }));
        toast.success('Usuario eliminado correctamente');
      }
    }
  } catch (error) {
    console.error('Error al eliminar los usuarios:', error);
    toast.error('Error al eliminar los usuarios');
  } finally {
    handleCancelDelete();
    setState(prev => ({ ...prev, selectedUsers: new Set() }));
  }
}; 