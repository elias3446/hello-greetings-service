import { Usuario, Reporte } from '@/types/tipos';
import { updateUser } from '@/controller/CRUD/user/userController';
import { registrarCambioEstado } from '@/controller/CRUD/user/historialEstadosUsuario';
import { registrarCambioEstadoReporte } from '@/controller/CRUD/report/historialEstadosReporte';
import { filtrarReportes, actualizarReporte } from '@/controller/CRUD/report/reportController';
import { toast } from '@/components/ui/sonner';

type EstadoUsuario = 'activo' | 'inactivo' | 'bloqueado';

/**
 * Actualiza el estado de un usuario y registra todos los cambios relacionados
 * @param usuario - Usuario a actualizar
 * @param nuevoEstado - Nuevo estado del usuario
 * @param realizadoPor - Usuario que realiza el cambio
 * @param motivoCambio - Motivo del cambio (opcional)
 * @returns Promise<boolean> - true si la actualización fue exitosa
 */
export const actualizarEstadoUsuario = async (
  usuario: Usuario,
  nuevoEstado: EstadoUsuario,
  realizadoPor: Usuario,
  motivoCambio?: string
): Promise<boolean> => {
  try {
    console.log('Iniciando actualización de estado:', {
      usuarioId: usuario.id,
      estadoAnterior: usuario.estado,
      nuevoEstado
    });

    // 1. Obtener los reportes asignados antes de actualizar el estado
    const reportesAsignados = filtrarReportes({ userId: usuario.id });
    console.log('Reportes asignados encontrados:', reportesAsignados.length);

    // 2. Actualizar el estado del usuario
    const usuarioActualizado = updateUser(usuario.id, { estado: nuevoEstado });
    
    if (!usuarioActualizado) {
      throw new Error('Error al actualizar el estado del usuario');
    }

    console.log('Usuario actualizado:', usuarioActualizado);

    // 3. Registrar el cambio en el historial de estados del usuario
    await registrarCambioEstado(
      usuario,
      usuario.estado,
      nuevoEstado,
      realizadoPor,
      motivoCambio || `Cambio de estado de usuario ${usuario.nombre} ${usuario.apellido}`,
      'cambio_estado'
    );

    console.log('Historial de usuario actualizado');

    // 4. Actualizar el historial de estados y asignaciones de cada reporte
    for (const reporte of reportesAsignados) {
      if (nuevoEstado === 'inactivo' || nuevoEstado === 'bloqueado') {
        // Si el usuario está inactivo o bloqueado, registrar el cambio y desasignar
        const estadoAnterior = `${reporte.asignadoA?.nombre} ${reporte.asignadoA?.apellido} (${usuario.estado})`;
        const estadoNuevo = 'Sin responsable';

        console.log('Actualizando historial de reporte:', {
          reporteId: reporte.id,
          estadoAnterior,
          estadoNuevo
        });

        // Registrar el cambio en el historial manualmente
        registrarCambioEstadoReporte(
          reporte,
          estadoAnterior,
          estadoNuevo,
          realizadoPor,
          `Usuario ${usuario.nombre} ${usuario.apellido} ${nuevoEstado === 'inactivo' ? 'desactivado' : 'bloqueado'}, reporte desasignado`,
          'asignacion_reporte'
        );

        // Desasignar el reporte después de registrar el historial
        const reporteActualizado = actualizarReporte(reporte.id, { 
          asignadoA: undefined,
          historialAsignaciones: [
            ...reporte.historialAsignaciones,
            {
              id: crypto.randomUUID(),
              usuario: null,
              fechaAsignacion: new Date(),
              fechaCreacion: new Date(),
              esActual: true
            }
          ]
        });

        if (!reporteActualizado) {
          console.error('Error al desasignar el reporte:', reporte.id);
        }
      } else {
        // Si el usuario está activo, solo registrar el cambio de estado
        const estadoAnterior = `${reporte.asignadoA?.nombre} ${reporte.asignadoA?.apellido} (${usuario.estado})`;
        const estadoNuevo = `${reporte.asignadoA?.nombre} ${reporte.asignadoA?.apellido} (${nuevoEstado})`;

        console.log('Actualizando historial de reporte:', {
          reporteId: reporte.id,
          estadoAnterior,
          estadoNuevo
        });

        registrarCambioEstadoReporte(
          reporte,
          estadoAnterior,
          estadoNuevo,
          realizadoPor,
          `Usuario asignado ${usuario.nombre} ${usuario.apellido} activado`,
          'asignacion_reporte'
        );
      }

      console.log('Historial de reporte actualizado');
    }

    toast.success(`Estado del usuario actualizado a ${nuevoEstado === 'activo' ? 'Activo' : 'Inactivo'}`);
    return true;
  } catch (error) {
    console.error('Error al actualizar el estado del usuario:', error);
    toast.error('Error al actualizar el estado del usuario');
    return false;
  }
}; 