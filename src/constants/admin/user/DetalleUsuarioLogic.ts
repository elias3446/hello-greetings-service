import { useNavigate, useParams } from 'react-router-dom';
import { useUsuario } from '@/hooks/useUsuario';
import { obtenerHistorialUsuario } from '@/controller/CRUD/user/historialUsuario';
import { actualizarEstadoUsuario } from '@/controller/controller/user/userStateController';
import { toast } from '@/components/ui/sonner';
import { updateUser } from '@/controller/CRUD/user/userController';
import { filtrarReportes } from '@/controller/CRUD/report/reportController';

export function useDetalleUsuarioLogic() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {
    usuario,
    loading,
    reportesAsignados,
    historialEstados,
    handleRoleChange,
    handleEliminarUsuario,
    handleEditarUsuario,
    setUsuario,
    setReportesAsignados
  } = useUsuario();

  const handleCambiarEstado = async (): Promise<boolean> => {
    if (!usuario) return false;
    if (usuario.estado === 'bloqueado') {
      toast.error('No se puede cambiar el estado de un usuario bloqueado');
      return false;
    }
    const nuevoEstado = usuario.estado === 'activo' ? 'inactivo' : 'activo';
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
      const usuarioActualizado = updateUser(usuario.id, { estado: nuevoEstado });
      if (usuarioActualizado) {
        setUsuario(usuarioActualizado);
        const nuevosReportes = filtrarReportes({ userId: usuario.id });
        setReportesAsignados(nuevosReportes);
      }
    }
    return resultado;
  };

  const handleDelete = async (): Promise<boolean> => {
    if (!usuario) return false;
    try {
      const resultado = await handleEliminarUsuario();
      if (resultado) {
        navigate('/admin/usuarios');
      }
      return resultado;
    } catch (error) {
      console.error('Error al eliminar el usuario:', error);
      toast.error('Error al eliminar el usuario');
      return false;
    }
  };

  const actividadesDelUsuario = usuario ? obtenerHistorialUsuario(usuario.id) : [];

  return {
    id,
    navigate,
    usuario,
    loading,
    reportesAsignados,
    historialEstados,
    handleRoleChange,
    handleEliminarUsuario,
    handleEditarUsuario,
    setUsuario,
    setReportesAsignados,
    handleCambiarEstado,
    handleDelete,
    actividadesDelUsuario
  };
} 