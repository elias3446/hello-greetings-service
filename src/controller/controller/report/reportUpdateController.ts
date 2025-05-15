import { Reporte, Usuario } from '@/types/tipos';
import { actualizarReporte } from '@/controller/CRUD/report/reportController';
import { registrarCambioEstadoReporte } from '@/controller/CRUD/report/historialEstadosReporte';
import { registrarCambioEstado } from '@/controller/CRUD/user/historialEstadosUsuario';
import { agregarAsignacion } from '@/controller/CRUD/user/historialAsignacionController';
import { toast } from '@/components/ui/sonner';

/**
 * Actualiza un reporte y todos sus registros relacionados
 * @param reporte - Reporte original
 * @param reporteActualizado - Cambios a aplicar
 * @param realizadoPor - Usuario que realiza la actualización
 * @returns Promise<boolean> - true si se actualiza correctamente
 */
export const reportUpdate = async (
  reporte: Reporte,
  reporteActualizado: Partial<Reporte>,
  realizadoPor: Usuario
): Promise<boolean> => {
  try {
    console.log('Iniciando actualización de reporte:', {
      reporteId: reporte.id,
      cambios: reporteActualizado
    });

    // 1. Cambio en el estado activo
    if ('activo' in reporteActualizado && reporteActualizado.activo !== reporte.activo) {
      await registrarCambioEstadoReporte(
        reporte,
        reporte.activo ? 'Activo' : 'Inactivo',
        reporteActualizado.activo ? 'Activo' : 'Inactivo',
        realizadoPor,
        'Cambio de estado activo del reporte',
        'cambio_estado'
      );

      if (reporte.asignadoA) {
        await registrarEstadoUsuario(
          reporte.asignadoA,
          `Reporte ${reporte.id} ${reporteActualizado.activo ? 'activado' : 'desactivado'}`,
          realizadoPor
        );
      }
    }

    // 2. Cambio de estado
    if ('estado' in reporteActualizado && reporteActualizado.estado?.id !== reporte.estado.id) {
      await registrarCambioEstadoReporte(
        reporte,
        reporte.estado.nombre,
        reporteActualizado.estado?.nombre ?? '',
        realizadoPor,
        'Cambio de estado del reporte',
        'cambio_estado'
      );
    }

    // 3. Cambio de prioridad
    if ('prioridad' in reporteActualizado && reporteActualizado.prioridad?.id !== reporte.prioridad?.id) {
      await registrarCambioEstadoReporte(
        reporte,
        reporte.prioridad?.nombre ?? 'Sin prioridad',
        reporteActualizado.prioridad?.nombre ?? 'Sin prioridad',
        realizadoPor,
        'Cambio de prioridad del reporte',
        'cambio_estado'
      );

      if (reporte.asignadoA) {
        await registrarEstadoUsuario(
          reporte.asignadoA,
          `Cambio de prioridad en reporte ${reporte.id}`,
          realizadoPor
        );
      }
    }

    // 4. Cambio de asignación
    if ('asignadoA' in reporteActualizado) {
      const nuevoAsignadoId = reporteActualizado.asignadoA?.id;
      const actualAsignadoId = reporte.asignadoA?.id;

      const hayCambioAsignacion =
        nuevoAsignadoId !== actualAsignadoId ||
        (reporte.asignadoA && !reporteActualizado.asignadoA) ||
        (!reporte.asignadoA && reporteActualizado.asignadoA);

      if (hayCambioAsignacion) {
        reporteActualizado.historialAsignaciones = agregarAsignacion(reporte, reporteActualizado.asignadoA);

        await registrarCambioEstadoReporte(
          reporte,
          reporte.asignadoA ? `${reporte.asignadoA.nombre} ${reporte.asignadoA.apellido}` : 'Sin asignar',
          reporteActualizado.asignadoA ? `${reporteActualizado.asignadoA.nombre} ${reporteActualizado.asignadoA.apellido}` : 'Sin asignar',
          realizadoPor,
          'Cambio de asignación del reporte',
          'asignacion_reporte'
        );

        if (reporte.asignadoA) {
          await registrarEstadoUsuario(
            reporte.asignadoA,
            `Reporte ${reporte.id} desasignado`,
            realizadoPor
          );
        }

        if (reporteActualizado.asignadoA) {
          await registrarEstadoUsuario(
            reporteActualizado.asignadoA,
            `Reporte ${reporte.id} asignado`,
            realizadoPor
          );
        }
      }
    }

    // 5. Cambio de categoría
    if ('categoria' in reporteActualizado && reporteActualizado.categoria?.id !== reporte.categoria.id) {
      await registrarCambioEstadoReporte(
        reporte,
        reporte.categoria.nombre,
        reporteActualizado.categoria?.nombre ?? '',
        realizadoPor,
        'Cambio de categoría del reporte',
        'otro'
      );
    }

    // 6. Actualizar reporte
    const resultado = await actualizarReporte(reporte.id, reporteActualizado);
    if (!resultado) {
      throw new Error('Error al actualizar el reporte');
    }

    console.log('Reporte actualizado correctamente');
    toast.success('Reporte actualizado correctamente');
    return true;
  } catch (error) {
    console.error('Error al actualizar el reporte:', error);
    toast.error('Error al actualizar el reporte');
    return false;
  }
};

/**
 * Registra un cambio de estado en el historial del usuario sin cambiar su estado real.
 * Útil para notificaciones o auditoría de contexto.
 */
const registrarEstadoUsuario = async (
  usuario: Usuario,
  descripcion: string,
  realizadoPor: Usuario
) => {
  await registrarCambioEstado(
    usuario,
    usuario.estado,
    usuario.estado,
    realizadoPor,
    descripcion,
    'otro'
  );
};
