import { Rol, Usuario } from '@/types/tipos';
import { eliminarRol, obtenerRolPorId } from '@/controller/CRUD/role/roleController';
import { crearHistorialEstadoRol } from '@/controller/CRUD/role/historialEstadoRolController';
import { registrarCambioEstado } from '@/controller/CRUD/user/historialEstadosUsuario';
import { getUsers, updateUser } from '@/controller/CRUD/user/userController';
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
    const rol = await obtenerRolPorId(id);
    if (!rol) {
      toast.error('No se encontró el rol a eliminar');
      return false;
    }

    // 2. Identificar usuarios afectados
    const usuariosAfectados = await identificarUsuariosAfectados(rol);
    if (usuariosAfectados.length > 0) {
      console.log(`La eliminación del rol afectará a ${usuariosAfectados.length} usuarios`);
    }

    // 3. Actualizar usuarios afectados
    const actualizacionExitosa = await actualizarUsuariosAfectados(
      rol,
      usuariosAfectados,
      usuario,
      motivoEliminacion
    );
    if (!actualizacionExitosa) {
      toast.error('No se pudieron actualizar correctamente todos los usuarios afectados');
      return false;
    }

    // 4. Registrar eliminación en historial del rol
    await crearHistorialEstadoRol(
      id,
      rol.activo ? 'activo' : 'inactivo',
      'eliminado',
      usuario.id,
      'otro',
      motivoEliminacion || 'Eliminación del rol'
    );

    // 5. Eliminar el rol
    const eliminacionExitosa = await eliminarRol(id);
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
 * Obtiene todos los usuarios que tienen asignado el rol dado
 * 
 * @param rol - Rol que se va a eliminar
 * @returns Promise<Usuario[]> usuarios afectados
 */
const identificarUsuariosAfectados = async (rol: Rol): Promise<Usuario[]> => {
  const todosLosUsuarios = await getUsers();
  return todosLosUsuarios.filter(usuario =>
    usuario.roles?.some(r => r.id === rol.id)
  );
};

/**
 * Actualiza los usuarios afectados por la eliminación de un rol
 * 
 * @param rol - Rol que se está eliminando
 * @param usuariosAfectados - Lista de usuarios que tienen asignado el rol
 * @param usuarioResponsable - Usuario que realiza la eliminación
 * @param motivoEliminacion - Motivo de la eliminación
 * @returns Promise<boolean> si todas las actualizaciones fueron exitosas
 */
const actualizarUsuariosAfectados = async (
  rol: Rol,
  usuariosAfectados: Usuario[],
  usuarioResponsable: Usuario,
  motivoEliminacion?: string
): Promise<boolean> => {
  if (usuariosAfectados.length === 0) return true;

  const resultados = await Promise.all(
    usuariosAfectados.map(async (usuario) => {
      try {
        // Filtrar roles quitando el rol eliminado
        const rolesActualizados = usuario.roles.filter(r => r.id !== rol.id);

        // Determinar cambio de estado
        const estadoAnterior = usuario.estado;
        let nuevoEstado = estadoAnterior;

        // Si usuario se queda sin roles y está activo, inactivarlo
        if (rolesActualizados.length === 0 && estadoAnterior === 'activo') {
          nuevoEstado = 'inactivo';
        }

        // Registrar cambio de estado si aplica
        if (estadoAnterior !== nuevoEstado) {
          await registrarCambioEstado(
            usuario,
            estadoAnterior,
            nuevoEstado,
            usuarioResponsable,
            `Cambio de estado por eliminación del rol "${rol.nombre}". ${motivoEliminacion || 'Sin detalles adicionales'}`,
            'cambio_estado'
          );
        }

        // Registrar cambio en roles
        await registrarCambioEstado(
          usuario,
          `Roles: ${usuario.roles.map(r => r.nombre).join(', ') || 'Ninguno'}`,
          `Roles: ${rolesActualizados.map(r => r.nombre).join(', ') || 'Ninguno'}`,
          usuarioResponsable,
          `Eliminación del rol "${rol.nombre}" de la lista de roles del usuario. ${motivoEliminacion || 'Sin detalles adicionales'}`,
          'otro'
        );

        // Actualizar usuario
        const datosActualizados: Partial<Usuario> = { roles: rolesActualizados };
        if (estadoAnterior !== nuevoEstado) datosActualizados.estado = nuevoEstado;

        const usuarioActualizado = await updateUser(usuario.id, datosActualizados);
        if (!usuarioActualizado) throw new Error(`Error al actualizar usuario ${usuario.id}`);

        return true;
      } catch (error) {
        console.error(`Error actualizando usuario ${usuario.id}:`, error);
        return false;
      }
    })
  );

  const fallos = resultados.filter(r => !r).length;
  if (fallos > 0) {
    toast.warning(`${fallos} de ${usuariosAfectados.length} usuarios no pudieron ser actualizados correctamente`);
    return false;
  }

  toast.success(`${usuariosAfectados.length} usuarios actualizados correctamente`);
  return true;
};

/**
 * Busca un rol alternativo para asignar a usuarios que perderán su único rol
 * 
 * @param rolEliminado - Rol que está siendo eliminado
 * @returns Rol alternativo o undefined si no existe
 */
export const buscarRolAlternativo = (rolEliminado: Rol): Rol | undefined => {
  try {
    // Suponiendo que roles se importan desde un archivo estático
    const todosLosRoles: Rol[] = require('@/data/roles').roles;

    const rolesAlternativos = todosLosRoles.filter(r =>
      r.id !== rolEliminado.id &&
      r.activo === true &&
      r.tipo === 'usuario'
    );

    if (rolesAlternativos.length === 0) return undefined;

    // Buscar rol con más permisos comunes
    if (!rolEliminado.permisos?.length) {
      return rolesAlternativos[0];
    }

    let mejorAlternativa = rolesAlternativos[0];
    let maxPermisosComunes = 0;

    for (const rol of rolesAlternativos) {
      if (!rol.permisos) continue;
      const permisosComunes = rol.permisos.filter(p1 =>
        rolEliminado.permisos.some(p2 => p1.id === p2.id)
      ).length;

      if (permisosComunes > maxPermisosComunes) {
        maxPermisosComunes = permisosComunes;
        mejorAlternativa = rol;
      }
    }

    return mejorAlternativa;

  } catch (error) {
    console.error('Error buscando rol alternativo:', error);
    return undefined;
  }
};

/**
 * Asigna un rol alternativo a usuarios que quedarían sin roles tras eliminar un rol
 * 
 * @param rolId - ID del rol a eliminar
 * @param rolAlternativoId - ID del rol alternativo a asignar
 * @param usuario - Usuario que realiza la operación
 * @param motivoCambio - Motivo del cambio
 * @returns Promise<boolean> indicando éxito o fallo
 */
export const asignarRolAlternativo = async (
  rolId: string,
  rolAlternativoId: string,
  usuario: Usuario,
  motivoCambio?: string
): Promise<boolean> => {
  try {
    const rolAEliminar = await obtenerRolPorId(rolId);
    const rolAlternativo = await obtenerRolPorId(rolAlternativoId);

    if (!rolAEliminar || !rolAlternativo) {
      throw new Error('No se encontró alguno de los roles');
    }

    const todosLosUsuarios = await getUsers();
    const usuariosAfectados = todosLosUsuarios.filter(u =>
      u.roles.length === 1 && u.roles.some(r => r.id === rolId)
    );

    if (usuariosAfectados.length === 0) return true;

    const resultados = await Promise.all(
      usuariosAfectados.map(async (u) => {
        try {
          await registrarCambioEstado(
            u,
            `Rol: ${rolAEliminar.nombre}`,
            `Rol: ${rolAlternativo.nombre}`,
            usuario,
            `Asignación de rol alternativo por eliminación del rol "${rolAEliminar.nombre}". ${motivoCambio || 'Sin detalles adicionales'}`,
            'otro'
          );

          const usuarioActualizado = await updateUser(u.id, {
            roles: [rolAlternativo]
          });

          if (!usuarioActualizado) throw new Error(`Error actualizando usuario ${u.id}`);

          return true;
        } catch (error) {
          console.error(`Error asignando rol alternativo al usuario ${u.id}:`, error);
          return false;
        }
      })
    );

    const fallos = resultados.filter(r => !r).length;
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
