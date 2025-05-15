import { Reporte, Usuario, ActividadReporte } from '@/types/tipos';
import { createReport } from '@/controller/CRUD/report/reportController';
import { registrarCambioEstado } from '@/controller/CRUD/user/historialEstadosUsuario';
import { registrarCambioEstadoReporte } from '@/controller/CRUD/report/historialEstadosReporte';
import { registrarActividadReporte } from '@/controller/CRUD/report/actividadReporteController';

/**
 * Crea un nuevo reporte y actualiza todos los historiales relacionados
 * @param reporte - Datos del reporte a crear
 * @param usuario - Usuario que crea el reporte
 * @param motivo - Motivo de la creación
 * @returns Objeto con el resultado de la operación
 */
export const crearReporteCompleto = async (
  reporte: Omit<Reporte, 'id'>,
  usuario: Usuario,
  motivo: string
): Promise<{ success: boolean; reporte?: Reporte; message?: string }> => {
  try {
    // 1. Crear el reporte
    const nuevoReporte = createReport(reporte);
    if (!nuevoReporte) {
      return {
        success: false,
        message: 'Error al crear el reporte'
      };
    }

    // 2. Registrar cambio de estado del usuario
    const historialUsuario = registrarCambioEstado(
      usuario,
      'activo',
      'activo',
      usuario,
      `Creación de reporte: ${nuevoReporte.titulo}`,
      'creacion'
    );

    // 3. Registrar cambio de estado del reporte
    const historialReporte = registrarCambioEstadoReporte(
      nuevoReporte,
      'nuevo',
      nuevoReporte.estado.nombre,
      usuario,
      motivo,
      'creacion'
    );

    // 4. Registrar actividad del reporte
    const actividad: ActividadReporte = {
      id: `act-${Date.now()}`,
      reporteId: nuevoReporte.id,
      tipo: 'creacion',
      descripcion: motivo,
      usuarioId: usuario.id,
      fecha: new Date(),
      detalles: {
        estadoAnterior: 'nuevo',
        estadoNuevo: nuevoReporte.estado.nombre
      }
    };

    const actividadRegistrada = registrarActividadReporte(actividad);

    return {
      success: true,
      reporte: nuevoReporte
    };
  } catch (error) {
    console.error('Error al crear reporte completo:', error);
    return {
      success: false,
      message: 'Error al procesar la creación del reporte'
    };
  }
}; 