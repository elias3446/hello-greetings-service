import { Categoria, Usuario } from '@/types/tipos';
import { createCategory } from '../../CRUD/category/categoryController';
import { registrarCambioEstadoCategoria } from '../../CRUD/category/historialEstadosCategoria';
import { registrarCreacionCategoria, registrarModificacionCategoria } from '../../CRUD/category/historialActividadCategoriaController';
import { toast } from '@/components/ui/sonner';

/**
 * Crea una nueva categoría y registra la creación en el historial de estados y actividades
 * 
 * @param categoryData - Datos de la categoría a crear
 * @param usuario - Usuario que realiza la creación
 * @param comentario - Comentario opcional para el registro de actividad
 * @returns Promise con la categoría creada o null si ocurrió un error
 */
export const createCategoryWithHistory = async (
  categoryData: Omit<Categoria, 'id'>,
  usuario: Usuario,
  comentario?: string
): Promise<Categoria | null> => {
  try {
    // 1. Crear la categoría
    const nuevaCategoria = createCategory(categoryData);
    
    if (!nuevaCategoria) {
      throw new Error('Error al crear la categoría');
    }

    // 2. Registrar la creación en el historial de estados
    const historialEstadoResult = await registrarCambioEstadoCategoria(
      nuevaCategoria,
      'no_existe', // Estado anterior
      nuevaCategoria.activo ? 'activo' : 'inactivo', // Estado nuevo
      usuario,
      comentario,
      'creacion' // Tipo de acción
    );

    if (!historialEstadoResult) {
      throw new Error('Error al registrar el historial de estado');
    }

    // 3. Registrar la creación en el historial de actividades
    const historialActividadResult = registrarCreacionCategoria(
      nuevaCategoria,
      usuario,
      comentario
    );

    if (!historialActividadResult) {
      throw new Error('Error al registrar el historial de actividad');
    }

    toast.success('Categoría creada correctamente');
    return nuevaCategoria;
  } catch (error) {
    console.error('Error en createCategoryWithHistory:', error);
    toast.error('Error al crear la categoría');
    return null;
  }
};

/**
 * Actualiza una categoría existente y registra los cambios en el historial
 * 
 * @param id - ID de la categoría a actualizar
 * @param categoryData - Datos actualizados de la categoría
 * @param usuario - Usuario que realiza la actualización
 * @param comentario - Comentario opcional para el registro de actividad
 * @returns Promise con la categoría actualizada o null si ocurrió un error
 */
export const updateCategoryWithHistory = async (
  id: string,
  categoryData: Partial<Categoria>,
  usuario: Usuario,
  comentario?: string
): Promise<Categoria | null> => {
  try {
    // Obtener la categoría actual antes de actualizarla
    const categorias = require('@/data/categorias').categorias;
    const categoriaActual = categorias.find((cat: Categoria) => cat.id === id);
    
    if (!categoriaActual) {
      throw new Error('Categoría no encontrada');
    }

    // Actualizar la categoría usando el controlador CRUD
    const { updateCategory } = require('../../CRUD/category/categoryController');
    const categoriaActualizada = updateCategory(id, categoryData);
    
    if (!categoriaActualizada) {
      throw new Error('Error al actualizar la categoría');
    }

    // Registrar los cambios en los historiales
    for (const [key, value] of Object.entries(categoryData)) {
      // Evitar registrar cambios en campos que no han cambiado
      if (categoriaActual[key as keyof Categoria] === value) {
        continue;
      }

      // Si el cambio es en el estado activo, registrar en el historial de estados
      if (key === 'activo' && typeof value === 'boolean') {
        await registrarCambioEstadoCategoria(
          categoriaActualizada,
          categoriaActual.activo ? 'activo' : 'inactivo',
          value ? 'activo' : 'inactivo',
          usuario,
          comentario,
          'cambio_estado'
        );
      }

      // Registrar en el historial de actividades
      const valorAnterior = categoriaActual[key as keyof Categoria]?.toString() || 'no definido';
      const valorNuevo = value?.toString() || 'no definido';
      
      registrarModificacionCategoria(
        categoriaActualizada,
        usuario,
        key,
        valorAnterior,
        valorNuevo,
        comentario
      );
    }

    toast.success('Categoría actualizada correctamente');
    return categoriaActualizada;
  } catch (error) {
    console.error('Error en updateCategoryWithHistory:', error);
    toast.error('Error al actualizar la categoría');
    return null;
  }
};

/**
 * Cambia el estado de una categoría y registra el cambio en el historial
 * 
 * @param id - ID de la categoría a cambiar
 * @param nuevoEstado - Nuevo estado de la categoría
 * @param usuario - Usuario que realiza el cambio
 * @param motivoCambio - Motivo del cambio
 * @returns Promise con el resultado de la operación
 */
export const changeCategoryStatus = async (
  id: string,
  nuevoEstado: boolean,
  usuario: Usuario,
  motivoCambio?: string
): Promise<boolean> => {
  try {
    // Usamos el controlador existente que ya maneja todo el proceso
    const { actualizarEstadoCategoria } = require('./actualizarEstadoCategoria');
    
    // Obtener la categoría actual
    const categorias = require('@/data/categorias').categorias;
    const categoria = categorias.find((cat: Categoria) => cat.id === id);
    
    if (!categoria) {
      throw new Error('Categoría no encontrada');
    }
    
    // Actualizar el estado y registrar los cambios
    const result = await actualizarEstadoCategoria(
      categoria,
      nuevoEstado,
      usuario,
      motivoCambio
    );
    
    return result;
  } catch (error) {
    console.error('Error en changeCategoryStatus:', error);
    toast.error('Error al cambiar el estado de la categoría');
    return false;
  }
}; 