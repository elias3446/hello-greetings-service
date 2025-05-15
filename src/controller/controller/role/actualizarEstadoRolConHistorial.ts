import { Rol, Usuario } from '@/types/tipos';
import { actualizarRol, obtenerRolPorId } from '../../CRUD/role/roleController';
import { crearHistorialEstadoRol } from '../../CRUD/role/historialEstadoRolController';
import { registrarCambioEstado } from '../../CRUD/user/historialEstadosUsuario';
import { getUsers, updateUser } from '../../CRUD/user/userController';
import { toast } from '@/components/ui/sonner';

/**
 * Actualiza el estado de un rol y registra los cambios en los historiales correspondientes.
 */
export const actualizarEstadoRolConHistorial = async (
  id: string,
  nuevoEstado: boolean,
  usuario: Usuario,
  motivoCambio?: string
): Promise<Rol | null> => {
  try {
    const rolActual = await obtenerRolPorId(id);
    if (!rolActual) throw new Error('Rol no encontrado');

    if (rolActual.activo === nuevoEstado) {
      toast.info('El rol ya está en el estado solicitado');
      return rolActual;
    }

    const rolActualizado = await actualizarRol(id, {
      activo: nuevoEstado,
      fechaActualizacion: new Date(),
    });

    if (!rolActualizado) throw new Error('Error al actualizar el estado del rol');

    const historialCreado = await crearHistorialEstadoRol(
      id,
      rolActual.activo ? 'activo' : 'inactivo',
      nuevoEstado ? 'activo' : 'inactivo',
      usuario.id,
      'cambio_estado',
      motivoCambio
    );

    if (!historialCreado) {
      console.warn('No se pudo registrar el historial del rol');
    }

    await actualizarUsuariosAsociados(rolActualizado, nuevoEstado, usuario, motivoCambio);

    toast.success(`Rol "${rolActualizado.nombre}" ${nuevoEstado ? 'activado' : 'desactivado'} correctamente`);
    return rolActualizado;
  } catch (error) {
    console.error('Error en actualizarEstadoRolConHistorial:', error);
    toast.error('Error al actualizar el estado del rol');
    return null;
  }
};

/**
 * Actualiza los usuarios que tienen asignado el rol cuyo estado se ha modificado.
 */
const actualizarUsuariosAsociados = async (
  rol: Rol,
  nuevoEstado: boolean,
  usuarioResponsable: Usuario,
  motivoCambio?: string
): Promise<boolean> => {
  try {
    const usuarios = await getUsers();
    const usuariosConRol = usuarios.filter(u => u.roles?.some(r => r.id === rol.id));

    if (!usuariosConRol.length) return true;

    const resultados = await Promise.all(
      usuariosConRol.map(async (usuario) => {
        try {
          const estadoAnterior = usuario.estado;
          let nuevoEstadoUsuario = estadoAnterior;

          if (!nuevoEstado && usuario.roles.length === 1) {
            nuevoEstadoUsuario = 'inactivo';
          }

          if (estadoAnterior !== nuevoEstadoUsuario) {
            await registrarCambioEstado(
              usuario,
              estadoAnterior,
              nuevoEstadoUsuario,
              usuarioResponsable,
              `Cambio de estado por ${nuevoEstado ? 'activación' : 'desactivación'} del rol "${rol.nombre}". ${motivoCambio || ''}`,
              'cambio_estado'
            );

            const actualizado = await updateUser(usuario.id, { estado: nuevoEstadoUsuario });
            if (!actualizado) throw new Error(`Error al actualizar el usuario ${usuario.id}`);
          }

          if (!nuevoEstado) {
            const rolesActualizados = usuario.roles.filter(r => r.id !== rol.id);
            const actualizado = await updateUser(usuario.id, { roles: rolesActualizados });
            if (!actualizado) throw new Error(`Error al remover el rol del usuario ${usuario.id}`);
          }

          return true;
        } catch (error) {
          console.error(`Error procesando usuario ${usuario.id}:`, error);
          return false;
        }
      })
    );

    const errores = resultados.filter(r => !r).length;
    if (errores) {
      toast.warning(`${errores} usuarios no pudieron ser actualizados completamente`);
    } else {
      toast.success(`${usuariosConRol.length} usuarios actualizados correctamente`);
    }

    return errores === 0;
  } catch (error) {
    console.error('Error en actualizarUsuariosAsociados:', error);
    toast.error('Error al actualizar usuarios asociados al rol');
    return false;
  }
};

/**
 * Actualiza toda la información de un rol y registra los cambios en el historial.
 */
export const actualizarRolCompleto = async (
  id: string,
  rolData: Partial<Rol>,
  usuario: Usuario,
  motivoCambio?: string
): Promise<Rol | null> => {
  try {
    const rolActual = await obtenerRolPorId(id);
    if (!rolActual) throw new Error('Rol no encontrado');

    const hayCambioEstado = 'activo' in rolData && rolData.activo !== rolActual.activo;

    const rolActualizado = await actualizarRol(id, {
      ...rolData,
      fechaActualizacion: new Date()
    });

    if (!rolActualizado) throw new Error('Error al actualizar el rol');

    if (hayCambioEstado && typeof rolData.activo === 'boolean') {
      return await actualizarEstadoRolConHistorial(id, rolData.activo, usuario, motivoCambio);
    }

    const tipoAccion = 'actualizacion';
    let descripcionCambio = 'Actualización de información general';

    if ('nombre' in rolData) {
      descripcionCambio = `Cambio de nombre de "${rolActual.nombre}" a "${rolData.nombre}"`;
    } else if ('descripcion' in rolData) {
      descripcionCambio = 'Actualización de descripción';
    } else if ('permisos' in rolData) {
      descripcionCambio = 'Actualización de permisos';
    }

    await crearHistorialEstadoRol(
      id,
      rolActual.nombre || 'sin_nombre',
      rolActualizado.nombre || 'sin_nombre',
      usuario.id,
      tipoAccion,
      descripcionCambio || motivoCambio
    );

    toast.success('Rol actualizado correctamente');
    return rolActualizado;
  } catch (error) {
    console.error('Error en actualizarRolCompleto:', error);
    toast.error('Error al actualizar el rol');
    return null;
  }
};
