import { Reporte, Usuario } from '@/types/tipos';
import { updateReport } from '@/controller/CRUD/report/reportController';
import { registrarCambioEstadoReporte } from '@/controller/CRUD/report/historialEstadosReporte';
import { registrarCambioEstado } from '@/controller/CRUD/user/historialEstadosUsuario';
import { agregarAsignacion } from '@/controller/CRUD/user/historialAsignacionController';
import { toast } from '@/components/ui/sonner';

/**
 * Actualiza un reporte y todos sus registros relacionados
 * @param reporte - Reporte a actualizar
 * @param reporteActualizado - Datos actualizados del reporte
 * @param realizadoPor - Usuario que realiza la actualización
 * @returns Promise<boolean> - true si la actualización fue exitosa
 */
export const actualizarReporte = async (
  reporte: Reporte,
  reporteActualizado: Partial<Reporte>,
  realizadoPor: Usuario
): Promise<boolean> => {
  try {
    console.log('Iniciando actualización de reporte:', {
      reporteId: reporte.id,
      cambios: reporteActualizado
    });

    // 1. Verificar cambios en el estado activo
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
        await registrarCambioEstado(
          reporte.asignadoA,
          reporte.asignadoA.estado,
          reporte.asignadoA.estado,
          realizadoPor,
          `Reporte ${reporte.id} ${reporteActualizado.activo ? 'activado' : 'desactivado'}`,
          'otro'
        );
      }
    }

    // 2. Verificar cambios en el estado
    if ('estado' in reporteActualizado && reporteActualizado.estado?.id !== reporte.estado.id) {
      await registrarCambioEstadoReporte(
        reporte,
        reporte.estado.nombre,
        reporteActualizado.estado?.nombre || '',
        realizadoPor,
        'Cambio de estado del reporte',
        'cambio_estado'
      );
    }

    // 3. Verificar cambios en la prioridad
    if ('prioridad' in reporteActualizado && reporteActualizado.prioridad?.id !== reporte.prioridad?.id) {
      await registrarCambioEstadoReporte(
        reporte,
        reporte.prioridad?.nombre || 'Sin prioridad',
        reporteActualizado.prioridad?.nombre || 'Sin prioridad',
        realizadoPor,
        'Cambio de prioridad del reporte',
        'cambio_estado'
      );

      if (reporte.asignadoA) {
        await registrarCambioEstado(
          reporte.asignadoA,
          reporte.asignadoA.estado,
          reporte.asignadoA.estado,
          realizadoPor,
          `Cambio de prioridad en reporte ${reporte.id}`,
          'otro'
        );
      }
    }

    // 4. Verificar cambios en la asignación
    if ('asignadoA' in reporteActualizado) {
      const hayCambioAsignacion = 
        (reporteActualizado.asignadoA?.id !== reporte.asignadoA?.id) || 
        (reporteActualizado.asignadoA === null && reporte.asignadoA !== null) ||
        (reporteActualizado.asignadoA !== null && reporte.asignadoA === null);

      if (hayCambioAsignacion) {
        const historialActualizado = agregarAsignacion(reporte, reporteActualizado.asignadoA);
        reporteActualizado.historialAsignaciones = historialActualizado;

        await registrarCambioEstadoReporte(
          reporte,
          reporte.asignadoA ? `${reporte.asignadoA.nombre} ${reporte.asignadoA.apellido}` : 'Sin asignar',
          reporteActualizado.asignadoA ? `${reporteActualizado.asignadoA.nombre} ${reporteActualizado.asignadoA.apellido}` : 'Sin asignar',
          realizadoPor,
          'Cambio de asignación del reporte',
          'asignacion_reporte'
        );

        // Registrar cambio en historial del usuario anterior
        if (reporte.asignadoA) {
          await registrarCambioEstado(
            reporte.asignadoA,
            reporte.asignadoA.estado,
            reporte.asignadoA.estado,
            realizadoPor,
            `Reporte ${reporte.id} desasignado`,
            'otro'
          );
        }

        // Registrar cambio en historial del nuevo usuario
        if (reporteActualizado.asignadoA) {
          await registrarCambioEstado(
            reporteActualizado.asignadoA,
            reporteActualizado.asignadoA.estado,
            reporteActualizado.asignadoA.estado,
            realizadoPor,
            `Reporte ${reporte.id} asignado`,
            'otro'
          );
        }
      }
    }

    // 5. Verificar cambios en la categoría
    if ('categoria' in reporteActualizado && reporteActualizado.categoria?.id !== reporte.categoria.id) {
      await registrarCambioEstadoReporte(
        reporte,
        reporte.categoria.nombre,
        reporteActualizado.categoria?.nombre || '',
        realizadoPor,
        'Cambio de categoría del reporte',
        'otro'
      );
    }

    // 6. Actualizar el reporte
    const reporteActualizadoFinal = updateReport(reporte.id, reporteActualizado);
    if (!reporteActualizadoFinal) {
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