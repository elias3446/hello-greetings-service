import { Reporte, Usuario } from '@/types/tipos';
import { updateReport } from '../../CRUD/reportController';
import { registrarCambioEstadoReporte } from '../../CRUD/historialEstadosReporte';
import { registrarCambioEstado } from '../../CRUD/historialEstadosUsuario';
import { filterReports } from '../../CRUD/reportController';
import { toast } from '@/components/ui/sonner';

/**
 * Actualiza la asignación de un reporte y todos los registros relacionados
 * @param reporte - Reporte a actualizar
 * @param nuevoUsuario - Nuevo usuario asignado
 * @param realizadoPor - Usuario que realiza la asignación
 * @returns Promise<boolean> - true si la actualización fue exitosa
 */
export const actualizarAsignacionReporte = async (
  reporte: Reporte,
  nuevoUsuario: Usuario,
  realizadoPor: Usuario
): Promise<boolean> => {
  try {
    console.log('Iniciando actualización de asignación:', {
      reporteId: reporte.id,
      usuarioAnterior: reporte.asignadoA?.nombre,
      nuevoUsuario: nuevoUsuario.nombre
    });

    // 1. Registrar el cambio en el historial de estados del reporte
    await registrarCambioEstadoReporte(
      reporte,
      reporte.asignadoA ? `${reporte.asignadoA.nombre} ${reporte.asignadoA.apellido}` : 'Sin asignar',
      `${nuevoUsuario.nombre} ${nuevoUsuario.apellido}`,
      realizadoPor,
      'Cambio de asignación del reporte',
      'asignacion_reporte'
    );

    console.log('Historial de reporte actualizado');

    // 2. Registrar el cambio en el historial de estados del usuario anterior
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

    // 3. Registrar el cambio en el historial de estados del nuevo usuario
    await registrarCambioEstado(
      nuevoUsuario,
      nuevoUsuario.estado,
      nuevoUsuario.estado,
      realizadoPor,
      `Reporte ${reporte.id} asignado`,
      'otro'
    );

    console.log('Historial de usuarios actualizado');

    // 4. Actualizar el reporte
    const reporteActualizado = updateReport(reporte.id, { asignadoA: nuevoUsuario });
    if (!reporteActualizado) {
      throw new Error('Error al actualizar el reporte');
    }

    // 5. Actualizar los reportes asignados del usuario anterior
    if (reporte.asignadoA) {
      const reportesUsuarioAnterior = filterReports({ userId: reporte.asignadoA.id });
      console.log('Reportes del usuario anterior actualizados:', reportesUsuarioAnterior.length);
    }

    // 6. Actualizar los reportes asignados del nuevo usuario
    const reportesNuevoUsuario = filterReports({ userId: nuevoUsuario.id });
    console.log('Reportes del nuevo usuario actualizados:', reportesNuevoUsuario.length);

    console.log('Reporte actualizado correctamente');
    toast.success(`Reporte asignado correctamente a ${nuevoUsuario.nombre} ${nuevoUsuario.apellido}`);
    return true;
  } catch (error) {
    console.error('Error al actualizar la asignación del reporte:', error);
    toast.error('Error al actualizar la asignación del reporte');
    return false;
  }
}; 