import { EstadoReporte, Usuario } from '@/types/tipos';
import { createEstado, getEstadoById } from '../../CRUD/estado/estadoController';
import { createHistorialEstado } from '../../CRUD/estado/historialEstadoController';
import { toast } from '@/components/ui/sonner';

/**
 * Crea un nuevo estado de reporte y registra el cambio en el historial
 * 
 * @param estadoData - Datos del nuevo estado
 * @param usuario - Usuario que realiza la creación
 * @param motivoCambio - Motivo opcional de la creación
 * @returns Promise con el estado creado o null si ocurrió un error
 */
export const crearEstadoConHistorial = async (
  estadoData: Omit<EstadoReporte, 'id'>,
  usuario: Usuario,
  motivoCambio?: string
): Promise<EstadoReporte | null> => {
  try {
    // 1. Validar datos mínimos necesarios
    if (!estadoData.nombre) {
      toast.error('El nombre del estado es obligatorio');
      return null;
    }

    // 2. Asegurar que se incluyan los campos necesarios con valores por defecto
    const datosCompletos: Omit<EstadoReporte, 'id'> = {
      ...estadoData,
      fechaCreacion: estadoData.fechaCreacion || new Date(),
      activo: estadoData.activo !== undefined ? estadoData.activo : true,
      descripcion: estadoData.descripcion || '',
      icono: estadoData.icono || 'circle',
      color: estadoData.color || '#808080'
    };

    // 3. Crear el estado
    const nuevoEstado = createEstado(datosCompletos);

    if (!nuevoEstado) {
      throw new Error('Error al crear el estado');
    }

    // 4. Registrar la creación en el historial de estados
    const descripcionCambio = motivoCambio || `Creación del estado "${nuevoEstado.nombre}"`;
    
    await createHistorialEstado(
      nuevoEstado.id,
      'no_existe',
      nuevoEstado.activo ? 'activo' : 'inactivo',
      usuario.id,
      'creacion',
      descripcionCambio
    );

    toast.success(`Estado "${nuevoEstado.nombre}" creado correctamente`);
    return nuevoEstado;
  } catch (error) {
    console.error('Error en crearEstadoConHistorial:', error);
    toast.error('Error al crear el estado');
    return null;
  }
};

/**
 * Crea una copia de un estado existente
 * 
 * @param idEstadoBase - ID del estado a duplicar
 * @param nuevoNombre - Nombre para el nuevo estado
 * @param usuario - Usuario que realiza la operación
 * @param motivoCambio - Motivo opcional de la duplicación
 * @returns Promise con el nuevo estado o null si ocurrió un error
 */
export const duplicarEstado = async (
  idEstadoBase: string,
  nuevoNombre: string,
  usuario: Usuario,
  motivoCambio?: string
): Promise<EstadoReporte | null> => {
  try {
    // 1. Obtener el estado base
    const estadoBase = getEstadoById(idEstadoBase);
    
    if (!estadoBase) {
      toast.error('No se encontró el estado a duplicar');
      return null;
    }

    // 2. Preparar los datos del nuevo estado
    const datosNuevoEstado: Omit<EstadoReporte, 'id'> = {
      nombre: nuevoNombre,
      descripcion: `${estadoBase.descripcion} (copia)`,
      icono: estadoBase.icono,
      color: estadoBase.color,
      fechaCreacion: new Date(),
      activo: true
    };

    // 3. Crear el nuevo estado con historial
    const comentarioFinal = motivoCambio || 
      `Estado creado como duplicado de "${estadoBase.nombre}"`;
    
    return await crearEstadoConHistorial(
      datosNuevoEstado,
      usuario,
      comentarioFinal
    );
  } catch (error) {
    console.error('Error en duplicarEstado:', error);
    toast.error('Error al duplicar el estado');
    return null;
  }
};

/**
 * Crea un conjunto de estados predefinidos para comenzar a usar el sistema
 * 
 * @param tipo - Tipo de conjunto a crear ('basico', 'completo')
 * @param usuario - Usuario que realiza la creación
 * @returns Promise con array de estados creados
 */
export const crearEstadosPredefinidos = async (
  tipo: 'basico' | 'completo',
  usuario: Usuario
): Promise<EstadoReporte[]> => {
  const estadosCreados: EstadoReporte[] = [];

  try {
    // Definir plantillas según el tipo solicitado
    const plantillas: Omit<EstadoReporte, 'id'>[] = [];
    
    // Estados básicos (siempre incluidos)
    plantillas.push({
      nombre: 'Pendiente',
      descripcion: 'Reporte recién creado, pendiente de revisión',
      icono: 'clock',
      color: '#FFA500',
      fechaCreacion: new Date(),
      activo: true
    });
    
    plantillas.push({
      nombre: 'En proceso',
      descripcion: 'Reporte en proceso de atención',
      icono: 'play',
      color: '#3B82F6',
      fechaCreacion: new Date(),
      activo: true
    });
    
    plantillas.push({
      nombre: 'Completado',
      descripcion: 'Reporte atendido y finalizado',
      icono: 'check-circle',
      color: '#10B981',
      fechaCreacion: new Date(),
      activo: true
    });
    
    // Estados adicionales para el conjunto completo
    if (tipo === 'completo') {
      plantillas.push({
        nombre: 'Cancelado',
        descripcion: 'Reporte cancelado',
        icono: 'x-circle',
        color: '#EF4444',
        fechaCreacion: new Date(),
        activo: true
      });
      
      plantillas.push({
        nombre: 'En espera',
        descripcion: 'Reporte en espera de información adicional',
        icono: 'pause',
        color: '#F59E0B',
        fechaCreacion: new Date(),
        activo: true
      });
      
      plantillas.push({
        nombre: 'Rechazado',
        descripcion: 'Reporte rechazado por no cumplir requisitos',
        icono: 'ban',
        color: '#6B7280',
        fechaCreacion: new Date(),
        activo: true
      });
    }

    // Crear los estados desde las plantillas
    for (const plantilla of plantillas) {
      const estadoCreado = await crearEstadoConHistorial(
        plantilla,
        usuario,
        `Estado creado automáticamente como parte del conjunto "${tipo}"`
      );
      
      if (estadoCreado) {
        estadosCreados.push(estadoCreado);
      }
    }

    if (estadosCreados.length > 0) {
      toast.success(`Se crearon ${estadosCreados.length} estados predefinidos`);
    } else {
      toast.warning('No se pudo crear ningún estado predefinido');
    }

    return estadosCreados;
  } catch (error) {
    console.error('Error en crearEstadosPredefinidos:', error);
    toast.error('Error al crear estados predefinidos');
    return estadosCreados;
  }
}; 