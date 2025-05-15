import { Rol, Usuario } from '@/types/tipos';
import { deleteRole, getRoleById } from '../../CRUD/role/roleController';
import { createHistorialEstadoRol } from '../../CRUD/role/historialEstadoRolController';
import { registrarCambioEstado } from '../../CRUD/user/historialEstadosUsuario';
import { getUsers, updateUser } from '../../CRUD/user/userController';
import { toast } from '@/components/ui/sonner';

/**
 * Elimina un rol y gestiona el impacto en los usuarios asociados
 * 
 * @param id - ID del rol a eliminar
 * @param usuario - Usuario que realiza la eliminación
 * @param motivoEliminacion - Motivo de la eliminación
 * @returns Promise<boolean> indicando si la operación fue exitosa
 */
export const eliminarRolConHistorial = async (
  id: string,
  usuario: Usuario,
  motivoEliminacion?: string
): Promise<boolean> => {
  try {
    // 1. Obtener el rol antes de eliminarlo
    const rol = getRoleById(id);
    
    if (!rol) {
      toast.error('No se encontró el rol a eliminar');
      return false;
    }

    // 2. Identificar los usuarios afectados
    const usuariosAfectados = identificarUsuariosAfectados(rol);
    
    if (usuariosAfectados.length > 0) {
      console.log(`La eliminación del rol afectará a ${usuariosAfectados.length} usuarios`);
    }

    // 3. Actualizar los usuarios afectados
    const actualizacionUsuariosExitosa = await actualizarUsuariosAfectados(
      rol,
      usuariosAfectados,
      usuario,
      motivoEliminacion
    );
    
    if (!actualizacionUsuariosExitosa) {
      toast.error('No se pudieron actualizar correctamente todos los usuarios afectados');
      return false;
    }

    // 4. Registrar la eliminación en el historial de estados del rol
    createHistorialEstadoRol(
      id,
      rol.activo ? 'activo' : 'inactivo',
      'eliminado',
      usuario.id,
      'otro',
      motivoEliminacion || 'Eliminación del rol'
    );

    // 5. Eliminar el rol
    const eliminacionExitosa = deleteRole(id);
    
    if (!eliminacionExitosa) {
      toast.error('Error al eliminar el rol');
      return false;
    }

    toast.success(`Rol "${rol.nombre}" eliminado correctamente`);
    return true;
  } catch (error) {
    console.error('Error en eliminarRolConHistorial:', error);
    toast.error('Error al eliminar el rol');
    return false;
  }
};

/**
 * Identifica los usuarios que tienen asignado el rol a eliminar
 * 
 * @param rol - Rol que se va a eliminar
 * @returns Array de usuarios afectados
 */
const identificarUsuariosAfectados = (rol: Rol): Usuario[] => {
  const todosLosUsuarios = getUsers();
  return todosLosUsuarios.filter(usuario => 
    usuario.roles && usuario.roles.some(r => r.id === rol.id)
  );
};

/**
 * Actualiza los usuarios afectados por la eliminación de un rol
 * 
 * @param rol - Rol que se está eliminando
 * @param usuariosAfectados - Lista de usuarios que tienen asignado el rol
 * @param usuarioResponsable - Usuario que realiza la eliminación
 * @param motivoEliminacion - Motivo de la eliminación
 * @returns Promise<boolean> indicando si todas las actualizaciones fueron exitosas
 */
const actualizarUsuariosAfectados = async (
  rol: Rol,
  usuariosAfectados: Usuario[],
  usuarioResponsable: Usuario,
  motivoEliminacion?: string
): Promise<boolean> => {
  if (usuariosAfectados.length === 0) {
    return true; // No hay usuarios que actualizar
  }

  // Procesar cada usuario afectado
  const resultadosActualizacion = await Promise.all(
    usuariosAfectados.map(async (usuario) => {
      try {
        // 1. Quitar el rol eliminado de la lista de roles del usuario
        const rolesActualizados = usuario.roles.filter(r => r.id !== rol.id);
        
        // 2. Determinar si es necesario cambiar el estado del usuario
        const estadoAnterior = usuario.estado;
        let nuevoEstado = usuario.estado;
        
        // Si el usuario se queda sin roles, desactivarlo
        if (rolesActualizados.length === 0 && estadoAnterior === 'activo') {
          nuevoEstado = 'inactivo';
        }
        
        // 3. Registrar el cambio en el historial de estados del usuario si hay cambio de estado
        if (estadoAnterior !== nuevoEstado) {
          registrarCambioEstado(
            usuario,
            estadoAnterior,
            nuevoEstado,
            usuarioResponsable,
            `Cambio de estado por eliminación del rol "${rol.nombre}". ${motivoEliminacion || 'Sin detalles adicionales'}`,
            'cambio_estado'
          );
        }
        
        // 4. Registrar el cambio de roles en el historial de estados del usuario
        registrarCambioEstado(
          usuario,
          `Roles: ${usuario.roles.map(r => r.nombre).join(', ')}`,
          `Roles: ${rolesActualizados.map(r => r.nombre).join(', ') || 'Ninguno'}`,
          usuarioResponsable,
          `Eliminación del rol "${rol.nombre}" de la lista de roles del usuario. ${motivoEliminacion || 'Sin detalles adicionales'}`,
          'otro'
        );
        
        // 5. Actualizar el usuario
        const datosActualizados: Partial<Usuario> = {
          roles: rolesActualizados
        };
        
        if (estadoAnterior !== nuevoEstado) {
          datosActualizados.estado = nuevoEstado;
        }
        
        const usuarioActualizado = updateUser(usuario.id, datosActualizados);
        
        if (!usuarioActualizado) {
          throw new Error(`Error al actualizar el usuario ${usuario.id}`);
        }
        
        return true;
      } catch (error) {
        console.error(`Error al actualizar el usuario ${usuario.id}:`, error);
        return false;
      }
    })
  );
  
  // Verificar si todas las actualizaciones fueron exitosas
  const fallos = resultadosActualizacion.filter(resultado => !resultado).length;
  
  if (fallos > 0) {
    console.error(`${fallos} usuarios no pudieron ser actualizados correctamente`);
    toast.warning(`${fallos} de ${usuariosAfectados.length} usuarios no pudieron ser actualizados correctamente`);
    return false;
  }
  
  toast.success(`${usuariosAfectados.length} usuarios actualizados correctamente`);
  return true;
};

/**
 * Busca un rol alternativo para asignar a los usuarios que perderán su único rol
 * 
 * @param rolEliminado - Rol que está siendo eliminado
 * @returns Un rol alternativo o undefined si no hay alternativas adecuadas
 */
export const buscarRolAlternativo = (rolEliminado: Rol): Rol | undefined => {
  try {
    // Obtener roles que no sean el eliminado y estén activos
    const todosLosRoles = require('@/data/roles').roles;
    const rolesAlternativos = todosLosRoles.filter((r: Rol) => 
      r.id !== rolEliminado.id && 
      r.activo === true &&
      r.tipo === 'usuario' // Preferir roles de tipo usuario
    );
    
    if (rolesAlternativos.length === 0) {
      return undefined;
    }
    
    // Intentar encontrar un rol con permisos similares
    let mejorAlternativa = rolesAlternativos[0];
    
    // Si el rol eliminado tiene permisos, buscar un rol con permisos similares
    if (rolEliminado.permisos && rolEliminado.permisos.length > 0) {
      for (const rol of rolesAlternativos) {
        if (rol.permisos && rolEliminado.permisos) {
          // Contar permisos en común
          const permisosComunes = rol.permisos.filter(p1 => 
            rolEliminado.permisos?.some(p2 => p1.id === p2.id)
          ).length;
          
          // Si tiene más permisos en común, es mejor alternativa
          if (permisosComunes > 0) {
            mejorAlternativa = rol;
            break;
          }
        }
      }
    }
    
    return mejorAlternativa;
  } catch (error) {
    console.error('Error al buscar rol alternativo:', error);
    return undefined;
  }
};

/**
 * Asigna un rol alternativo a usuarios que quedarían sin roles
 * 
 * @param rolId - ID del rol a eliminar
 * @param rolAlternativoId - ID del rol alternativo a asignar
 * @param usuario - Usuario que realiza la operación
 * @param motivoCambio - Motivo del cambio
 * @returns Promise<boolean> indicando si la operación fue exitosa
 */
export const asignarRolAlternativo = async (
  rolId: string,
  rolAlternativoId: string,
  usuario: Usuario,
  motivoCambio?: string
): Promise<boolean> => {
  try {
    // 1. Obtener los roles
    const rolAEliminar = getRoleById(rolId);
    const rolAlternativo = getRoleById(rolAlternativoId);
    
    if (!rolAEliminar || !rolAlternativo) {
      throw new Error('No se encontró alguno de los roles');
    }
    
    // 2. Identificar usuarios que quedarían sin roles
    const todosLosUsuarios = getUsers();
    const usuariosAfectados = todosLosUsuarios.filter(u => 
      u.roles.length === 1 && u.roles.some(r => r.id === rolId)
    );
    
    if (usuariosAfectados.length === 0) {
      return true; // No hay usuarios que actualizar
    }
    
    // 3. Actualizar cada usuario
    const resultadosActualizacion = await Promise.all(
      usuariosAfectados.map(async (u) => {
        try {
          // Registrar el cambio en el historial
          registrarCambioEstado(
            u,
            `Rol: ${rolAEliminar.nombre}`,
            `Rol: ${rolAlternativo.nombre}`,
            usuario,
            `Asignación de rol alternativo por eliminación del rol "${rolAEliminar.nombre}". ${motivoCambio || 'Sin detalles adicionales'}`,
            'otro'
          );
          
          // Actualizar el usuario
          const usuarioActualizado = updateUser(u.id, {
            roles: [rolAlternativo]
          });
          
          if (!usuarioActualizado) {
            throw new Error(`Error al actualizar el usuario ${u.id}`);
          }
          
          return true;
        } catch (error) {
          console.error(`Error al asignar rol alternativo al usuario ${u.id}:`, error);
          return false;
        }
      })
    );
    
    // Verificar resultados
    const fallos = resultadosActualizacion.filter(r => !r).length;
    
    if (fallos > 0) {
      toast.warning(`${fallos} de ${usuariosAfectados.length} usuarios no pudieron ser actualizados con el rol alternativo`);
      return false;
    }
    
    toast.success(`${usuariosAfectados.length} usuarios actualizados con el rol alternativo`);
    return true;
  } catch (error) {
    console.error('Error en asignarRolAlternativo:', error);
    toast.error('Error al asignar rol alternativo');
    return false;
  }
}; 