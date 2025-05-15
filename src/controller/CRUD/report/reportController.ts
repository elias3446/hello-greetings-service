import { Reporte } from '@/types/tipos';
import { reportes } from '@/data/reportes';
import { agregarAsignacion } from '@/controller/CRUD/user/historialAsignacionController';

/* =========================
   OPERACIONES PRINCIPALES
   ========================= */

/**
 * Devuelve todos los reportes (copia del arreglo original).
 */
export const obtenerReportes = (): Reporte[] => [...reportes];

/**
 * Busca un reporte por su ID.
 */
export const obtenerReportePorId = (id: string): Reporte | undefined =>
  reportes.find((reporte) => reporte.id === id);

/**
 * Crea un nuevo reporte y actualiza historial si es necesario.
 */
export const crearReporte = (datos: Omit<Reporte, 'id'>): Reporte => {
  const nuevoReporte: Reporte = {
    id: crypto.randomUUID(),
    ...datos
  };

  reportes.push(nuevoReporte);

  // Si se asignó a un usuario, agregar historial
  if (datos.asignadoA) {
    const historialAsignaciones = agregarAsignacion(nuevoReporte, datos.asignadoA);
    nuevoReporte.historialAsignaciones = historialAsignaciones;
  }

  return nuevoReporte;
};

/**
 * Actualiza un reporte existente, incluyendo historial de asignación si cambia.
 */
export const actualizarReporte = (id: string, cambios: Partial<Reporte>): Reporte | undefined => {
  const index = reportes.findIndex((r) => r.id === id);
  if (index === -1) return undefined;

  const reporteOriginal = reportes[index];

  // Verificar si cambió el usuario asignado
  const asignadoOriginalId = reporteOriginal.asignadoA?.id || null;
  const nuevoAsignadoId = cambios.asignadoA?.id || null;
  const cambioAsignacion = asignadoOriginalId !== nuevoAsignadoId;

  if (cambioAsignacion && cambios.asignadoA) {
    cambios.historialAsignaciones = agregarAsignacion(reporteOriginal, cambios.asignadoA);
  }

  const reporteActualizado: Reporte = {
    ...reporteOriginal,
    ...cambios
  };

  reportes[index] = reporteActualizado;
  return reporteActualizado;
};

/**
 * Elimina un reporte por ID.
 */
export const eliminarReporte = async (id: string): Promise<boolean> => {
  const index = reportes.findIndex((r) => r.id === id);
  if (index === -1) return false;
  reportes.splice(index, 1);
  return true;
};

/* ========================
   FILTRADO Y ORDENAMIENTO
   ======================== */

/**
 * Filtra reportes por múltiples criterios.
 */
export const filtrarReportes = (criterios: {
  search?: string;
  categoryId?: string;
  statusId?: string;
  estadoId?: string;
  userId?: string;
}): Reporte[] => {
  let resultado = [...reportes];

  const { search, categoryId, statusId, estadoId, userId } = criterios;

  if (search) {
    const termino = search.toLowerCase();
    resultado = resultado.filter((r) =>
      r.titulo.toLowerCase().includes(termino) ||
      (r.categoria?.nombre || '').toLowerCase().includes(termino) ||
      (r.estado?.nombre || '').toLowerCase().includes(termino) ||
      (r.ubicacion?.direccion || '').toLowerCase().includes(termino) ||
      (r.asignadoA?.nombre || '').toLowerCase().includes(termino)
    );
  }

  if (categoryId) {
    resultado = resultado.filter(r => r.categoria?.id === categoryId);
  }

  if (statusId || estadoId) {
    const estadoBuscado = statusId || estadoId;
    resultado = resultado.filter(r => r.estado?.id === estadoBuscado);
  }

  if (userId) {
    resultado = resultado.filter(r => r.asignadoA?.id === userId);
  }

  return resultado;
};

/**
 * Ordena reportes por campo específico.
 */
export const ordenarReportes = (
  reportes: Reporte[],
  campo: string,
  direccion: 'asc' | 'desc'
): Reporte[] => {
  const copia = [...reportes];

  copia.sort((a, b) => {
    let resultado = 0;

    switch (campo) {
      case 'titulo':
        resultado = a.titulo.localeCompare(b.titulo);
        break;
      case 'categoria':
        resultado = (a.categoria?.nombre || '').localeCompare(b.categoria?.nombre || '');
        break;
      case 'estado':
        resultado = (a.estado?.nombre || '').localeCompare(b.estado?.nombre || '');
        break;
      case 'ubicacion':
        resultado = (a.ubicacion?.direccion || '').localeCompare(b.ubicacion?.direccion || '');
        break;
      case 'asignadoA':
        resultado = (a.asignadoA?.nombre || '').localeCompare(b.asignadoA?.nombre || '');
        break;
      case 'fecha':
        const fechaA = new Date(a.fechaCreacion).getTime();
        const fechaB = new Date(b.fechaCreacion).getTime();
        resultado = fechaA - fechaB;
        break;
      default:
        resultado = 0;
    }

    return direccion === 'asc' ? resultado : -resultado;
  });

  return copia;
};
