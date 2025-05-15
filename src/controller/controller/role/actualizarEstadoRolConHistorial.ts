import { Rol, Usuario } from '@/types/tipos';
import { updateRole, getRoleById } from '../../CRUD/role/roleController';
import { createHistorialEstadoRol } from '../../CRUD/role/historialEstadoRolController';
import { registrarCambioEstado } from '../../CRUD/user/historialEstadosUsuario';
import { getUsers, updateUser } from '../../CRUD/user/userController';
import { toast } from '@/components/ui/sonner';

/**
 * Actualiza el estado de un rol y registra los cambios en los historiales correspondientes
 * 
 * @param id - ID del rol a actualizar
 * @param nuevoEstado - Nuevo estado del rol (activo o inactivo)
 * @param usuario - Usuario que realiza la actualización
 * @param motivoCambio - Motivo del cambio (opcional)
 * @returns Promise con el rol actualizado o null si ocurrió un error
 */
export const actualizarEstadoRolConHistorial = async (
  id: string,
  nuevoEstado: boolean,
  usuario: Usuario,
  motivoCambio?: string
): Promise<Rol | null> => {
  try {
    // 1. Obtener el rol actual antes de actualizarlo
    const rolActual = getRoleById(id);
    
    if (!rolActual) {
      throw new Error('Rol no encontrado');
    }

    // Verificar si realmente hay un cambio de estado
    if (rolActual.activo === nuevoEstado) {
      toast.info('El rol ya se encuentra en el estado solicitado');
      return rolActual;
    }

    // 2. Actualizar el rol
    const rolActualizado = updateRole(id, { 
      activo: nuevoEstado,
      fechaActualizacion: new Date()
    });

    if (!rolActualizado) {
      throw new Error('Error al actualizar el estado del rol');
    }

    // 3. Registrar el cambio en el historial de estados de roles
    const historialRolCreado = createHistorialEstadoRol(
      id,
      rolActual.activo ? 'activo' : 'inactivo',
      nuevoEstado ? 'activo' : 'inactivo',
      usuario.id,
      'cambio_estado',
      motivoCambio
    );

    if (!historialRolCreado) {
      console.warn('No se pudo registrar el cambio en el historial de roles');
    }

    // 4. Actualizar los usuarios asociados al rol
    await actualizarUsuariosAsociados(
      rolActualizado,
      nuevoEstado,
      usuario,
      motivoCambio
    );

    toast.success(`Rol "${rolActualizado.nombre}" ${nuevoEstado ? 'activado' : 'desactivado'} correctamente`);
    return rolActualizado;
  } catch (error) {
    console.error('Error en actualizarEstadoRolConHistorial:', error);
    toast.error('Error al actualizar el estado del rol');
    return null;
  }
};

/**
 * Actualiza los usuarios que tienen asignado el rol cuyo estado se ha modificado
 * 
 * @param rol - Rol actualizado
 * @param nuevoEstado - Nuevo estado del rol
 * @param usuarioResponsable - Usuario que realiza el cambio
 * @param motivoCambio - Motivo del cambio (opcional)
 * @returns Promise<boolean> - true si todas las actualizaciones fueron exitosas
 */
const actualizarUsuariosAsociados = async (
  rol: Rol,
  nuevoEstado: boolean,
  usuarioResponsable: Usuario,
  motivoCambio?: string
): Promise<boolean> => {
  try {
    // 1. Obtener todos los usuarios que tienen asignado este rol
    const usuarios = getUsers();
    const usuariosConRol = usuarios.filter(u => 
      u.roles && u.roles.some(r => r.id === rol.id)
    );
    
    if (usuariosConRol.length === 0) {
      return true; // No hay usuarios que actualizar
    }

    console.log(`Actualizando ${usuariosConRol.length} usuarios con el rol "${rol.nombre}"`);

    // 2. Para cada usuario afectado
    const actualizacionesUsuarios = await Promise.all(
      usuariosConRol.map(async (usuario) => {
        try {
          const estadoAnterior = usuario.estado;
          let nuevoEstadoUsuario = usuario.estado;

          // Si el rol se desactiva y el usuario solo tiene este rol, desactivar el usuario
          if (!nuevoEstado && usuario.roles.length === 1) {
            nuevoEstadoUsuario = 'inactivo';
          }

          // Si hay un cambio en el estado del usuario, registrarlo y aplicarlo
          if (estadoAnterior !== nuevoEstadoUsuario) {
            // Registrar en el historial de estados de usuario
            registrarCambioEstado(
              usuario,
              estadoAnterior,
              nuevoEstadoUsuario,
              usuarioResponsable,
              `Cambio de estado por desactivación del rol "${rol.nombre}". ${motivoCambio || 'Sin comentarios adicionales'}`,
              'cambio_estado'
            );
            
            // Actualizar el usuario
            const usuarioActualizado = updateUser(usuario.id, { 
              estado: nuevoEstadoUsuario 
            });
            
            if (!usuarioActualizado) {
              throw new Error(`Error al actualizar el usuario ${usuario.id}`);
            }
          }

          // Si el rol se desactiva, removerlo de los roles del usuario
          if (!nuevoEstado) {
            const rolesActualizados = usuario.roles.filter(r => r.id !== rol.id);
            
            const usuarioActualizado = updateUser(usuario.id, { 
              roles: rolesActualizados
            });
            
            if (!usuarioActualizado) {
              throw new Error(`Error al remover el rol del usuario ${usuario.id}`);
            }
          }
          
          return true;
        } catch (error) {
          console.error(`Error al procesar el usuario ${usuario.id}:`, error);
          return false;
        }
      })
    );

    // 3. Verificar si todas las actualizaciones fueron exitosas
    const usuariosFallidos = actualizacionesUsuarios.filter(result => !result).length;
    
    if (usuariosFallidos > 0) {
      toast.warning(`${usuariosFallidos} usuarios no pudieron ser actualizados completamente`);
      return false;
    }
    
    if (usuariosConRol.length > 0) {
      toast.success(`${usuariosConRol.length} usuarios actualizados correctamente`);
    }
    
    return true;
  } catch (error) {
    console.error('Error al actualizar usuarios asociados:', error);
    toast.error('Error al actualizar los usuarios asociados al rol');
    return false;
  }
};

/**
 * Actualiza toda la información de un rol y registra los cambios en el historial
 * 
 * @param id - ID del rol a actualizar
 * @param rolData - Datos actualizados del rol
 * @param usuario - Usuario que realiza la actualización
 * @param motivoCambio - Motivo del cambio (opcional)
 * @returns Promise con el rol actualizado o null si ocurrió un error
 */
export const actualizarRolCompleto = async (
  id: string,
  rolData: Partial<Rol>,
  usuario: Usuario,
  motivoCambio?: string
): Promise<Rol | null> => {
  try {
    // 1. Obtener el rol actual antes de actualizarlo
    const rolActual = getRoleById(id);
    
    if (!rolActual) {
      throw new Error('Rol no encontrado');
    }

    // 2. Verificar si hay cambio en el estado activo
    const cambioEstado = 'activo' in rolData && rolData.activo !== rolActual.activo;
    
    // 3. Actualizar el rol
    const rolActualizado = updateRole(id, {
      ...rolData,
      fechaActualizacion: new Date()
    });
    
    if (!rolActualizado) {
      throw new Error('Error al actualizar el rol');
    }

    // 4. Registrar los cambios en el historial
    if (cambioEstado && typeof rolData.activo === 'boolean') {
      // Si hay cambio de estado, usar la función especializada
      return await actualizarEstadoRolConHistorial(
        id,
        rolData.activo,
        usuario,
        motivoCambio
      );
    }
    
    // 5. Para otros cambios, registrar en el historial de roles
    const tipoAccion = 'actualizacion';
    let descripcionCambio = 'Actualización de información general';
    
    if ('nombre' in rolData) {
      descripcionCambio = `Cambio de nombre de "${rolActual.nombre}" a "${rolData.nombre}"`;
    } else if ('descripcion' in rolData) {
      descripcionCambio = 'Actualización de descripción';
    } else if ('permisos' in rolData) {
      descripcionCambio = 'Actualización de permisos';
    }
    
    createHistorialEstadoRol(
      id,
      rolActual.nombre || 'sin_nombre',
      rolActualizado.nombre || 'sin_nombre',
      usuario.id,
      tipoAccion,
      descripcionCambio || motivoCambio
    );
    
    toast.success(`Rol actualizado correctamente`);
    return rolActualizado;
  } catch (error) {
    console.error('Error en actualizarRolCompleto:', error);
    toast.error('Error al actualizar el rol');
    return null;
  }
}; 