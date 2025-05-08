import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Usuario, Reporte, HistorialEstadoUsuario, Rol } from '@/types/tipos';
import { UsuarioState, UsuarioActions } from '@/types/usuario';
import { getUsers, updateUser, deleteUser, getUserById } from '@/controller/CRUD/userController';
import { getReports, filterReports } from '@/controller/CRUD/reportController';
import { registrarCambioEstado, obtenerHistorialUsuario } from '@/controller/CRUD/historialEstadosUsuario';
import { registrarCambioEstadoReporte } from '@/controller/CRUD/historialEstadosReporte';
import { toast } from '@/components/ui/sonner';
import { normalizeText, getFieldValue, exportUsuariosToCSV } from '@/utils/usuarioUtils';
import { sortUsers } from '@/utils/userUtils';
import { roles } from '@/data/roles';

export const useUsuarioState = (): [UsuarioState, UsuarioActions] => {
  const [usuarios, setUsuarios] = React.useState<Usuario[]>([]);
  const [filteredUsuarios, setFilteredUsuarios] = React.useState<Usuario[]>([]);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState<string | null>(null);
  const [roleFilter, setRoleFilter] = React.useState<string | null>(null);
  const [sortBy, setSortBy] = React.useState<string>('nombre');
  const [sortDirection, setSortDirection] = React.useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = React.useState(1);
  const [isLoading, setIsLoading] = React.useState(true);
  const [currentField, setCurrentField] = React.useState<string | undefined>();
  const [selectedFilterValues, setSelectedFilterValues] = React.useState<any[]>([]);
  const [showDeleteDialog, setShowDeleteDialog] = React.useState(false);
  const [usuarioAEliminar, setUsuarioAEliminar] = React.useState<Usuario | null>(null);
  const [searchField, setSearchField] = React.useState<string>('nombre');

  const state: UsuarioState = {
    usuarios,
    filteredUsuarios,
    searchTerm,
    statusFilter,
    roleFilter,
    sortBy,
    sortDirection,
    currentPage,
    isLoading,
    currentField,
    selectedFilterValues,
    showDeleteDialog,
    usuarioAEliminar,
    searchField
  };

  const actions: UsuarioActions = {
    setUsuarios,
    setFilteredUsuarios,
    setSearchTerm,
    setStatusFilter,
    setRoleFilter,
    setSortBy,
    setSortDirection,
    setCurrentPage,
    setIsLoading,
    setCurrentField,
    setSelectedFilterValues,
    setShowDeleteDialog,
    setUsuarioAEliminar,
    setSearchField
  };

  return [state, actions];
};

export const useUsuarioData = (state: UsuarioState, actions: UsuarioActions) => {
  const { setUsuarios, setFilteredUsuarios, setIsLoading } = actions;

  React.useEffect(() => {
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
};

export const useUsuarioFilters = (state: UsuarioState, actions: UsuarioActions) => {
  const { usuarios, searchTerm, sortBy, sortDirection, selectedFilterValues } = state;
  const { setFilteredUsuarios, setCurrentPage } = actions;

  React.useEffect(() => {
    let result = [...usuarios];

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        usuario => usuario.nombre.toLowerCase().includes(term) ||
                usuario.apellido.toLowerCase().includes(term) ||
                usuario.email.toLowerCase().includes(term) ||
                usuario.fechaCreacion.toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' }).toLowerCase().includes(term) ||
                usuario.estado.toLowerCase().includes(term) ||
                (usuario.roles && usuario.roles.some(rol => rol.nombre.toLowerCase().includes(term)))
      );
    }

    const filterValues = selectedFilterValues.filter(value => !value.includes(':'));
    const filterStates = selectedFilterValues.filter(value => value.startsWith('estado:')).map(value => value.split(':')[1]);
    const filterRoles = selectedFilterValues.filter(value => value.startsWith('rol:')).map(value => value.split(':')[1]);

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
        usuario.roles?.some(rol => filterRoles.includes(rol.nombre))
      );
    }

    result = sortUsers(result, sortBy, sortDirection);
    setFilteredUsuarios(result);
    setCurrentPage(1);
  }, [usuarios, searchTerm, sortBy, sortDirection, selectedFilterValues]);
};

export const useUsuarioHandlers = (state: UsuarioState, actions: UsuarioActions) => {
  const { usuarios, usuarioAEliminar } = state;
  const { setUsuarios, setFilteredUsuarios, setShowDeleteDialog, setUsuarioAEliminar } = actions;
  const navigate = useNavigate();

  const handleToggleSortDirection = () => {
    actions.setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
  };

  const handleFilterChange = (values: any[]) => {
    actions.setSelectedFilterValues(values);
  };

  const handleSearch = (term: string) => {
    actions.setSearchTerm(term);
    if (!term) {
      actions.setFilteredUsuarios(usuarios);
      return;
    }

    const searchTerm = normalizeText(term);
    const filtered = usuarios.filter(usuario => {
      const nombreCompleto = normalizeText(`${usuario.nombre} ${usuario.apellido}`);
      const email = normalizeText(usuario.email);
      const roles = normalizeText(usuario.roles.map(rol => rol.nombre).join(', '));
      const fechaFormateada = normalizeText(new Date(usuario.fechaCreacion).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' }));
      const estado = normalizeText(usuario.estado);

      return nombreCompleto.includes(searchTerm) ||
             email.includes(searchTerm) ||
             roles.includes(searchTerm) ||
             fechaFormateada.includes(searchTerm) ||
             estado.includes(searchTerm);
    });

    actions.setFilteredUsuarios(filtered);
  };

  const handleExportUsuarios = () => {
    exportUsuariosToCSV(state.filteredUsuarios);
    toast.success('Datos exportados correctamente');
  };

  const handleNuevoUsuario = () => {
    navigate('/admin/usuarios/nuevo');
  };

  const handleDeleteUser = (usuario: Usuario) => {
    setUsuarioAEliminar(usuario);
    setShowDeleteDialog(true);
  };

  const handleEstadoChange = async (usuarioId: string) => {
    const usuario = usuarios.find(user => user.id === usuarioId);
    if (!usuario || usuario.estado === 'bloqueado') {
      toast.error('No se puede cambiar el estado de un usuario bloqueado directamente');
      return;
    }
    
    const nuevoEstado = usuario.estado === 'activo' ? 'inactivo' : 'activo';
    
    try {
      const reportesAsignados = getReports().filter(reporte => 
        reporte.asignadoA && reporte.asignadoA.id === usuario.id
      );

      await registrarCambioEstado(
        usuario,
        usuario.estado,
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
        },
        `Cambio de estado de usuario ${usuario.nombre} ${usuario.apellido}`,
        'cambio_estado'
      );

      for (const reporte of reportesAsignados) {
        await registrarCambioEstadoReporte(
          reporte,
          reporte.estado.nombre,
          reporte.estado.nombre,
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
          `Usuario asignado ${usuario.nombre} ${usuario.apellido} ${nuevoEstado === 'activo' ? 'activado' : 'desactivado'}`,
          'asignacion_reporte'
        );
      }

      const updatedUser = updateUser(usuarioId, { estado: nuevoEstado });
      
      if (!updatedUser) {
        throw new Error('Error al actualizar el estado del usuario');
      }
      
      setUsuarios(prevUsuarios => prevUsuarios.map(user => {
        if (user.id === usuarioId) {
          return { ...user, estado: nuevoEstado };
        }
        return user;
      }));
      
      toast.success(`Estado del usuario actualizado a ${nuevoEstado === 'activo' ? 'Activo' : 'Inactivo'}`);
    } catch (error) {
      console.error('Error al actualizar el estado del usuario:', error);
      toast.error('Error al actualizar el estado del usuario');
    }
  };

  const confirmarEliminacion = async () => {
    try {
      if (!usuarioAEliminar) return;
      
      const reportesAsignados = getReports().filter(reporte => 
        reporte.asignadoA && reporte.asignadoA.id === usuarioAEliminar.id
      );

      await registrarCambioEstado(
        usuarioAEliminar,
        usuarioAEliminar.estado,
        'eliminado',
        usuarioAEliminar,
        'Usuario eliminado del sistema',
        'otro'
      );

      for (const reporte of reportesAsignados) {
        await registrarCambioEstadoReporte(
          reporte,
          `${usuarioAEliminar.nombre} ${usuarioAEliminar.apellido}`,
          'Sin asignar',
          usuarioAEliminar,
          'Usuario eliminado del sistema',
          'asignacion_reporte'
        );
      }

      const success = deleteUser(usuarioAEliminar.id);
      
      if (success) {
        setUsuarios(prevUsuarios => prevUsuarios.filter(user => user.id !== usuarioAEliminar.id));
        setFilteredUsuarios(prevUsuarios => prevUsuarios.filter(user => user.id !== usuarioAEliminar.id));
        toast.success(`Usuario ${usuarioAEliminar.nombre} eliminado correctamente`);
      } else {
        throw new Error('Error al eliminar el usuario');
      }
    } catch (error) {
      console.error('Error al eliminar el usuario:', error);
      toast.error('Error al eliminar el usuario');
    } finally {
      setShowDeleteDialog(false);
      setUsuarioAEliminar(null);
    }
  };

  return {
    handleToggleSortDirection,
    handleFilterChange,
    handleSearch,
    handleExportUsuarios,
    handleNuevoUsuario,
    handleDeleteUser,
    handleEstadoChange,
    confirmarEliminacion
  };
};

export const useUsuario = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState(true);
  const [reportesAsignados, setReportesAsignados] = useState<Reporte[]>([]);
  const [historialEstados, setHistorialEstados] = useState<HistorialEstadoUsuario[]>([]);
  const [roles, setRoles] = useState<Rol[]>([]);

  useEffect(() => {
    const cargarUsuario = () => {
      try {
        if (!id) {
          toast.error('ID de usuario no válido');
          navigate('/admin/usuarios');
          return;
        }
        
        const userData = getUserById(id);
        
        if (!userData) {
          toast.error('Usuario no encontrado');
          navigate('/admin/usuarios');
          return;
        }
        
        setUsuario(userData);
      } catch (error) {
        console.error('Error al cargar el usuario:', error);
        toast.error('Error al cargar el usuario');
      } finally {
        setLoading(false);
      }
    };
    
    cargarUsuario();
  }, [id, navigate]);

  useEffect(() => {
    if (id) {
      const reportes = filterReports({ userId: id });
      setReportesAsignados(reportes);
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      const historial = obtenerHistorialUsuario(id);
      setHistorialEstados(historial);
    }
  }, [id, usuario]);

  useEffect(() => {
    const cargarRoles = async () => {
      try {
        const rolesData = getUsers().filter(user => user.roles && user.roles.length > 0);
        setRoles(rolesData.map(user => user.roles[0]));
      } catch (error) {
        console.error('Error al cargar roles:', error);
        toast.error('Error al cargar roles');
      }
    };

    cargarRoles();
  }, []);

  const handleRoleChange = async (userId: string, newRoleId: string) => {
    try {
      if (!usuario) return;

      const rolAnterior = usuario.roles[0]?.nombre || 'Sin rol';
      const nuevoRol = roles.find(r => r.id === newRoleId);
      
      if (!nuevoRol) {
        throw new Error('Rol no encontrado');
      }

      const usuarioActualizado = updateUser(usuario.id, {
        roles: [nuevoRol]
      });

      if (!usuarioActualizado) {
        throw new Error('Error al actualizar el rol del usuario');
      }

      setUsuario(usuarioActualizado);
      
      const historial = obtenerHistorialUsuario(usuario.id);
      setHistorialEstados(historial);
      
      toast.success('Rol asignado correctamente');
    } catch (error) {
      console.error('Error al asignar el rol:', error);
      toast.error('Error al asignar el rol');
    }
  };

  const handleCambiarEstado = async () => {
    try {
      if (!id || !usuario) return false;
      
      if (usuario.estado === 'bloqueado') {
        toast.error('No se puede cambiar el estado de un usuario bloqueado directamente');
        return false;
      }
      
      const estadoAnterior = usuario.estado;
      const nuevoEstado = usuario.estado === 'activo' ? 'inactivo' : 'activo';
      const usuarioActualizado = updateUser(id, { estado: nuevoEstado });
      
      if (usuarioActualizado) {
        setUsuario(usuarioActualizado);
        
        await registrarCambioEstado(
          usuario,
          estadoAnterior,
          nuevoEstado,
          usuarioActualizado,
          'Cambio de estado manual',
          'cambio_estado'
        );

        for (const reporte of reportesAsignados) {
          await registrarCambioEstadoReporte(
            reporte,
            reporte.estado.nombre,
            reporte.estado.nombre,
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
            `Usuario asignado ${usuario.nombre} ${usuario.apellido} ${nuevoEstado === 'activo' ? 'activado' : 'desactivado'}`,
            'asignacion_reporte'
          );
        }
        
        const historial = obtenerHistorialUsuario(id);
        setHistorialEstados(historial);
        
        toast.success(`Usuario ${nuevoEstado === 'activo' ? 'activado' : 'desactivado'} correctamente`);
        return true;
      }
      
      toast.error('Error al actualizar el estado del usuario');
      return false;
    } catch (error) {
      console.error('Error al cambiar el estado del usuario:', error);
      toast.error('Error al cambiar el estado del usuario');
      return false;
    }
  };

  const handleEliminarUsuario = async () => {
    try {
      if (!id || !usuario) return false;

      await registrarCambioEstado(
        usuario,
        usuario.estado,
        'eliminado',
        usuario,
        'Usuario eliminado del sistema',
        'otro'
      );

      for (const reporte of reportesAsignados) {
        await registrarCambioEstadoReporte(
          reporte,
          `${usuario.nombre} ${usuario.apellido}`,
          'Sin asignar',
          usuario,
          'Usuario eliminado del sistema',
          'asignacion_reporte'
        );
      }

      const nuevoHistorial = await obtenerHistorialUsuario(id);
      setHistorialEstados(nuevoHistorial);

      const success = deleteUser(id);
      
      if (success) {
        toast.success('Usuario eliminado correctamente');
        navigate('/admin/usuarios');
        return true;
      }
      
      throw new Error('Error al eliminar el usuario');
    } catch (error) {
      console.error('Error al eliminar el usuario:', error);
      toast.error('Error al eliminar el usuario');
      return false;
    }
  };

  const handleEditarUsuario = (datosActualizados: Partial<Usuario>) => {
    try {
      if (!usuario || !id) return false;

      const usuarioActualizado = updateUser(id, datosActualizados);

      if (!usuarioActualizado) {
        throw new Error('Error al actualizar el usuario');
      }

      setUsuario(usuarioActualizado);

      registrarCambioEstado(
        usuario,
        'Información anterior',
        'Información actualizada',
        usuarioActualizado,
        'Edición de información del usuario',
        'actualizacion'
      );

      const historial = obtenerHistorialUsuario(id);
      setHistorialEstados(historial);

      toast.success('Usuario actualizado correctamente');
      return true;
    } catch (error) {
      console.error('Error al actualizar el usuario:', error);
      toast.error('Error al actualizar el usuario');
      return false;
    }
  };

  return {
    usuario,
    loading,
    reportesAsignados,
    historialEstados,
    handleRoleChange,
    handleCambiarEstado,
    handleEliminarUsuario,
    handleEditarUsuario,
    setUsuario,
    setReportesAsignados
  };
}; 