import { Rol, Usuario } from '@/types/tipos';
import { actualizarRol, obtenerRolPorId } from '../../CRUD/role/roleController';
import { crearHistorialEstadoRol } from '../../CRUD/role/historialEstadoRolController';
import { registrarCambioEstado } from '../../CRUD/user/historialEstadosUsuario';
import { getUsers, updateUser } from '../../CRUD/user/userController';
import { toast } from '@/components/ui/sonner';

/**
 * Actualiza un rol con seguimiento avanzado de cambios.
 * 
 * @param id - ID del rol a actualizar
 * @param rolData - Datos a actualizar del rol
 * @param usuario - Usuario que realiza la actualización
 * @param motivoCambio - Motivo opcional del cambio
 */
export const actualizarRolAvanzado = async (
  id: string,
  rolData: Partial<Rol>,
  usuario: Usuario,
  motivoCambio?: string
): Promise<Rol | null> => {
  try {
    const rolAnterior = await obtenerRolPorId(id);
    if (!rolAnterior) {
      toast.error('Rol no encontrado');
      return null;
    }

    const rolActualizado = await actualizarRol(id, {
      ...rolData,
      fechaActualizacion: new Date()
    });

    if (!rolActualizado) {
      throw new Error('Error al actualizar el rol');
    }

    const cambiosCriticos = detectarCambiosCriticos(rolAnterior, rolActualizado);

    if (cambiosCriticos) {
      await registrarCambiosEnHistorial(rolAnterior, rolActualizado, usuario, motivoCambio);
      const usuariosActualizados = await actualizarUsuariosAfectados(rolAnterior, rolActualizado, usuario, motivoCambio);

      if (usuariosActualizados > 0) {
        toast.success(`Se actualizaron ${usuariosActualizados} usuarios con el rol`);
      }
    }

    toast.success(`Rol "${rolActualizado.nombre}" actualizado correctamente`);
    return rolActualizado;
  } catch (error) {
    console.error('Error en actualizarRolAvanzado:', error);
    toast.error('Error al actualizar el rol');
    return null;
  }
};

const detectarCambiosCriticos = (anterior: Rol, actualizado: Rol): boolean => {
  const cambioActivo = actualizado.activo !== anterior.activo;
  const cambioTipo = actualizado.tipo !== anterior.tipo;
  const cambioPermisos = JSON.stringify(anterior.permisos) !== JSON.stringify(actualizado.permisos);

  return cambioActivo || cambioTipo || cambioPermisos;
};
/**
* Registra los cambios del rol en el historial de estados
*
* @param rolAnterior - Estado anterior del rol
* @param rolActualizado - Estado nuevo del rol
* @param usuario - Usuario que realiza los cambios
* @param motivoCambio - Motivo opcional del cambio
*/
  const registrarCambiosEnHistorial = async (
  rolAnterior: Rol,
  rolActualizado: Rol,
  usuario: Usuario,
  motivoCambio?: string
  ): Promise<void> => {
  try {
  // Detectar qué cambios ocurrieron
  const cambios: string[] = [];

  if (rolAnterior.activo !== rolActualizado.activo) {
  cambios.push(`cambio de estado de "${rolAnterior.activo ? 'activo' : 'inactivo'}" a "${rolActualizado.activo ? 'activo' : 'inactivo'}"`);
  }

  if (rolAnterior.tipo !== rolActualizado.tipo) {
  cambios.push(`cambio de tipo de "${rolAnterior.tipo}" a "${rolActualizado.tipo}"`);
  }

  if (JSON.stringify(rolAnterior.permisos) !== JSON.stringify(rolActualizado.permisos)) {
  // Contar cuántos permisos se añadieron o quitaron para dar información más precisa
  const permisosAnteriores = rolAnterior.permisos?.map(p => p.id) || [];
  const permisosNuevos = rolActualizado.permisos?.map(p => p.id) || [];

  const permisosAgregados = permisosNuevos.filter(p => !permisosAnteriores.includes(p)).length;
  const permisosQuitados = permisosAnteriores.filter(p => !permisosNuevos.includes(p)).length;

  cambios.push(`actualización de permisos (${permisosAgregados} agregados, ${permisosQuitados} quitados)`);
  }

  // Crear descripción de cambios
  const descripcionCambios = cambios.join(', ');

  // Registrar en historial
  crearHistorialEstadoRol(
  rolActualizado.id,
  JSON.stringify(rolAnterior),
  JSON.stringify(rolActualizado),
  usuario.id,
  'actualizacion',
  motivoCambio ? `${motivoCambio} (${descripcionCambios})` : descripcionCambios
  );
  } catch (error) {
  console.error('Error al registrar cambios en historial:', error);
  }
  };

/**
  * Actualiza los usuarios afectados por cambios en el rol
  *
  * @param rolAnterior - Estado anterior del rol
  * @param rolActualizado - Estado nuevo del rol
  * @param usuario - Usuario que realiza los cambios
  * @param motivoCambio - Motivo opcional del cambio
  * @returns Número de usuarios actualizados
*/
    const actualizarUsuariosAfectados = async (
    rolAnterior: Rol,
    rolActualizado: Rol,
    usuario: Usuario,
    motivoCambio?: string
    ): Promise<number> => {
    try {
    // 1. Identificar usuarios que tienen este rol
    const todosLosUsuarios = getUsers();
    const usuariosConRol = todosLosUsuarios.filter(u =>
    u.roles && u.roles.some(r => r.id === rolActualizado.id)
    );
  
    if (usuariosConRol.length === 0) {
    return 0; // No hay usuarios que actualizar
    }
  
    let usuariosActualizados = 0;
  
    // 2. Procesar cambios según el tipo de actualización
  
    // 2.1 Si el rol se desactivó, actualizar usuarios
    if (rolAnterior.activo && !rolActualizado.activo) {
    const resultados = await desactivarRolEnUsuarios(
    rolActualizado,
    usuariosConRol,
    usuario,
    motivoCambio
    );
    usuariosActualizados += resultados;
    }
  
    // 2.2 Si cambiaron los permisos, actualizar el historial de los usuarios
    if (JSON.stringify(rolAnterior.permisos) !== JSON.stringify(rolActualizado.permisos)) {
    const resultados = await actualizarPermisosEnUsuarios(
    rolAnterior,
    rolActualizado,
    usuariosConRol,
    usuario,
    motivoCambio
    );
    usuariosActualizados += resultados;
    }
  
    // 2.3 Si cambió el tipo de rol, actualizar el historial
    if (rolAnterior.tipo !== rolActualizado.tipo) {
    const resultados = await actualizarTipoRolEnUsuarios(
    rolAnterior,
    rolActualizado,
    usuariosConRol,
    usuario,
    motivoCambio
    );
    usuariosActualizados += resultados;
    }
  
    return usuariosActualizados;
    } catch (error) {
    console.error('Error al actualizar usuarios afectados:', error);
    return 0;
    }
    };

/**
* Maneja la desactivación de un rol en los usuarios que lo tienen
*
* @param rolDesactivado - Rol que ha sido desactivado
* @param usuariosAfectados - Lista de usuarios con el rol
* @param usuarioResponsable - Usuario que realiza la acción
* @param motivoCambio - Motivo opcional del cambio
* @returns Número de usuarios actualizados
*/
  const desactivarRolEnUsuarios = async (
  rolDesactivado: Rol,
  usuariosAfectados: Usuario[],
  usuarioResponsable: Usuario,
  motivoCambio?: string
  ): Promise<number> => {
  let usuariosActualizados = 0;

try {
// Procesar cada usuario afectado
for (const usuario of usuariosAfectados) {
try {
// 1. Quitar el rol desactivado de la lista de roles del usuario
const rolesActualizados = usuario.roles.filter(r => r.id !== rolDesactivado.id);

// 2. Determinar si es necesario cambiar el estado del usuario
    const estadoAnterior = usuario.estado;
    let nuevoEstado = usuario.estado;
    
    // Si el usuario se queda sin roles, desactivarlo
    if (rolesActualizados.length === 0 && estadoAnterior === 'activo') {
      nuevoEstado = 'inactivo';
    }
    
    // 3. Registrar el cambio en el historial de estados del usuario
    registrarCambioEstado(
      usuario,
      `Roles: ${usuario.roles.map(r => r.nombre).join(', ')}`,
      `Roles: ${rolesActualizados.map(r => r.nombre).join(', ') || 'Ninguno'}`,
      usuarioResponsable,
      `Rol "${rolDesactivado.nombre}" desactivado. ${motivoCambio || 'Sin comentarios adicionales'}`,
      'otro'
    );
    
    // Si cambia el estado, registrarlo también
    if (estadoAnterior !== nuevoEstado) {
      registrarCambioEstado(
        usuario,
        estadoAnterior,
        nuevoEstado,
        usuarioResponsable,
        `Cambio de estado por desactivación del rol "${rolDesactivado.nombre}". ${motivoCambio || 'Sin comentarios adicionales'}`,
        'cambio_estado'
      );
    }
    
    // 4. Actualizar el usuario
    const datosActualizados: Partial<Usuario> = {
      roles: rolesActualizados
    };
    
    if (estadoAnterior !== nuevoEstado) {
      datosActualizados.estado = nuevoEstado;
    }
    
    const usuarioActualizado = updateUser(usuario.id, datosActualizados);
    
    if (usuarioActualizado) {
      usuariosActualizados++;
    }
  } catch (error) {
    console.error(`Error al procesar el usuario ${usuario.id}:`, error);
  }
}

} catch (error) {
console.error('Error al desactivar rol en usuarios:', error);
}

return usuariosActualizados;
};

/**
* Actualiza los usuarios cuando cambian los permisos de un rol
*
* @param rolAnterior - Estado anterior del rol
* @param rolActualizado - Estado nuevo del rol con permisos actualizados
* @param usuariosAfectados - Lista de usuarios con el rol
* @param usuarioResponsable - Usuario que realiza la acción
* @param motivoCambio - Motivo opcional del cambio
* @returns Número de usuarios actualizados
*/
  const actualizarPermisosEnUsuarios = async (
  rolAnterior: Rol,
  rolActualizado: Rol,
  usuariosAfectados: Usuario[],
  usuarioResponsable: Usuario,
  motivoCambio?: string
  ): Promise<number> => {
  let usuariosActualizados = 0;

try {
// Contar permisos añadidos y quitados para la descripción
const permisosAnteriores = rolAnterior.permisos?.map(p => p.id) || [];
const permisosNuevos = rolActualizado.permisos?.map(p => p.id) || [];
const permisosAgregados = permisosNuevos.filter(p => !permisosAnteriores.includes(p));
const permisosQuitados = permisosAnteriores.filter(p => !permisosNuevos.includes(p));

const descripcionCambio = `Actualización de permisos en rol "${rolActualizado.nombre}": ` +
  `${permisosAgregados.length} permisos agregados, ${permisosQuitados.length} permisos quitados. ` +
  `${motivoCambio || ''}`;

// Procesar cada usuario afectado
for (const usuario of usuariosAfectados) {
  try {
    // 1. Actualizar el rol en la lista de roles del usuario
    const rolesActualizados = usuario.roles.map(r => 
      r.id === rolActualizado.id ? rolActualizado : r
    );
    
    // 2. Registrar el cambio en el historial de estados del usuario
    registrarCambioEstado(
      usuario,
      `Permisos anteriores en rol "${rolActualizado.nombre}": ${permisosAnteriores.length}`,
      `Permisos actuales en rol "${rolActualizado.nombre}": ${permisosNuevos.length}`,
      usuarioResponsable,
      descripcionCambio,
      'otro'
    );
    
    // 3. Actualizar el usuario
    const usuarioActualizado = updateUser(usuario.id, {
      roles: rolesActualizados
    });
    
    if (usuarioActualizado) {
      usuariosActualizados++;
    }
  } catch (error) {
    console.error(`Error al actualizar permisos en usuario ${usuario.id}:`, error);
  }
}


} catch (error) {
console.error('Error al actualizar permisos en usuarios:', error);
}

return usuariosActualizados;
};

/**
* Actualiza los usuarios cuando cambia el tipo de un rol
*
* @param rolAnterior - Estado anterior del rol
* @param rolActualizado - Estado nuevo del rol con tipo actualizado
* @param usuariosAfectados - Lista de usuarios con el rol
* @param usuarioResponsable - Usuario que realiza la acción
* @param motivoCambio - Motivo opcional del cambio
* @returns Número de usuarios actualizados
  */
  const actualizarTipoRolEnUsuarios = async (
  rolAnterior: Rol,
  rolActualizado: Rol,
  usuariosAfectados: Usuario[],
  usuarioResponsable: Usuario,
  motivoCambio?: string
  ): Promise<number> => {
  let usuariosActualizados = 0;

try {
const descripcionCambio = `Cambio de tipo de rol "${rolActualizado.nombre}" ` +
`de "${rolAnterior.tipo}" a "${rolActualizado.tipo}". ${motivoCambio || ''}`;

// Procesar cada usuario afectado
for (const usuario of usuariosAfectados) {
  try {
    // 1. Actualizar el rol en la lista de roles del usuario
    const rolesActualizados = usuario.roles.map(r => 
      r.id === rolActualizado.id ? rolActualizado : r
    );
    
    // Comprobar si el usuario debe cambiar de tipo
    const tieneRolAdmin = rolesActualizados.some(r => r.tipo === 'admin');
    const nuevoTipo = tieneRolAdmin ? 'admin' : 'usuario';
    const cambioTipo = usuario.tipo !== nuevoTipo;
    
    // 2. Registrar el cambio en el historial de estados del usuario
    registrarCambioEstado(
      usuario,
      `Tipo de rol: ${rolAnterior.tipo}`,
      `Tipo de rol: ${rolActualizado.tipo}`,
      usuarioResponsable,
      descripcionCambio,
      'otro'
    );
    
    // Si también cambia el tipo del usuario, registrarlo
    if (cambioTipo) {
      registrarCambioEstado(
        usuario,
        usuario.tipo,
        nuevoTipo,
        usuarioResponsable,
        `Cambio de tipo de usuario debido a actualización del rol "${rolActualizado.nombre}". ${motivoCambio || ''}`,
        'cambio_estado'
      );
    }
    
    // 3. Actualizar el usuario
    const datosActualizados: Partial<Usuario> = {
      roles: rolesActualizados
    };
    
    if (cambioTipo) {
      datosActualizados.tipo = nuevoTipo;
    }
    
    const usuarioActualizado = updateUser(usuario.id, datosActualizados);
    
    if (usuarioActualizado) {
      usuariosActualizados++;
    }
  } catch (error) {
    console.error(`Error al actualizar tipo de rol en usuario ${usuario.id}:`, error);
  }
}

} catch (error) {
console.error('Error al actualizar tipo de rol en usuarios:', error);
}

return usuariosActualizados;
};