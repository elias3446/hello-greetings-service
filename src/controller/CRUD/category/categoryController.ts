import { Categoria } from '@/types/tipos';
import { categorias } from '@/data/categorias';
import { reportes } from '@/data/reportes';

/** Obtiene una copia de todas las categorías */
export const getCategories = (): Categoria[] => [...categorias];

/** Obtiene una categoría por su ID */
export const getCategoryById = (id: string): Categoria | undefined =>
  categorias.find(category => category.id === id);

/** Crea una nueva categoría y la agrega a la lista */
export const createCategory = (categoryData: Omit<Categoria, 'id'>): Categoria => {
  const newCategory: Categoria = {
    id: crypto.randomUUID(),
    ...categoryData
  };
  categorias.push(newCategory);
  return newCategory;
};

/** Actualiza una categoría existente, devuelve la categoría actualizada o undefined si no existe */
export const updateCategory = (id: string, categoryData: Partial<Categoria>): Categoria | undefined => {
  const index = categorias.findIndex(category => category.id === id);
  if (index === -1) return undefined;

  categorias[index] = { ...categorias[index], ...categoryData };
  return categorias[index];
};

/** Elimina una categoría por ID, devuelve true si fue eliminada */
export const deleteCategory = (id: string): boolean => {
  const index = categorias.findIndex(category => category.id === id);
  if (index === -1) return false;

  categorias.splice(index, 1);
  return true;
};

/** Obtiene el número de reportes asociados a una categoría */
export const getReportesPorCategoria = (categoriaId: string): number =>
  reportes.filter(reporte => reporte.categoria?.id === categoriaId).length;

/** Filtra categorías según criterios opcionales */
export const filterCategories = (criteria: {
  search?: string;
  active?: boolean;
  reportsMin?: number;
  reportsMax?: number;
}): Categoria[] => {
  return categorias.filter(category => {
    const term = criteria.search?.toLowerCase() ?? '';
    const matchesSearch = !term || category.nombre.toLowerCase().includes(term) || (category.descripcion?.toLowerCase().includes(term) ?? false);
    const matchesActive = criteria.active === undefined || category.activo === criteria.active;
    const reportCount = getReportesPorCategoria(category.id);
    const matchesReportsMin = criteria.reportsMin === undefined || reportCount >= criteria.reportsMin;
    const matchesReportsMax = criteria.reportsMax === undefined || reportCount <= criteria.reportsMax;

    return matchesSearch && matchesActive && matchesReportsMin && matchesReportsMax;
  });
};

/** Ordena categorías según campo y dirección indicados */
export const sortCategories = (
  categories: Categoria[],
  sortBy: 'nombre' | 'descripcion' | 'reportes' | 'estado' | 'fecha',
  direction: 'asc' | 'desc'
): Categoria[] => {
  const sortedCategories = [...categories];

  sortedCategories.sort((a, b) => {
    let comparison = 0;

    switch (sortBy) {
      case 'nombre':
        comparison = a.nombre.localeCompare(b.nombre);
        break;
      case 'descripcion':
        comparison = (a.descripcion ?? '').localeCompare(b.descripcion ?? '');
        break;
      case 'reportes': {
        const reportsA = getReportesPorCategoria(a.id);
        const reportsB = getReportesPorCategoria(b.id);
        comparison = reportsA - reportsB;
        break;
      }
      case 'estado':
        comparison = Number(a.activo) - Number(b.activo);
        break;
      case 'fecha': {
        const fechaA = a.fechaCreacion instanceof Date ? a.fechaCreacion : new Date(a.fechaCreacion);
        const fechaB = b.fechaCreacion instanceof Date ? b.fechaCreacion : new Date(b.fechaCreacion);
        comparison = fechaA.getTime() - fechaB.getTime();
        break;
      }
    }

    return direction === 'asc' ? comparison : -comparison;
  });

  return sortedCategories;
};
