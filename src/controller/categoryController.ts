
import { Categoria } from '../types/tipos';
import { categorias } from '../data/categorias';
import { reportes } from '../data/reportes';

// Obtener todas las categorías
export const getCategories = (): Categoria[] => {
  return categorias;
};

// Obtener una categoría por ID
export const getCategoryById = (id: string): Categoria | undefined => {
  return categorias.find((category) => category.id === id);
};

// Crear una nueva categoría
export const createCategory = (categoryData: Omit<Categoria, 'id'>): Categoria => {
  const newCategory: Categoria = {
    id: crypto.randomUUID(),
    ...categoryData
  };
  categorias.push(newCategory);
  return newCategory;
};

// Actualizar una categoría
export const updateCategory = (id: string, categoryData: Partial<Categoria>): Categoria | undefined => {
  const index = categorias.findIndex((category) => category.id === id);
  if (index !== -1) {
    categorias[index] = { ...categorias[index], ...categoryData };
    return categorias[index];
  }
  return undefined;
};

// Eliminar una categoría
export const deleteCategory = (id: string): boolean => {
  const index = categorias.findIndex((category) => category.id === id);
  if (index !== -1) {
    categorias.splice(index, 1);
    return true;
  }
  return false;
};

// Obtener el número de reportes por categoría
export const getReportesPorCategoria = (categoriaId: string): number => {
  return reportes.filter(reporte => reporte.categoria.id === categoriaId).length;
};

// Filtrar categorías por criterios
export const filterCategories = (criteria: {
  search?: string;
  active?: boolean;
  reportsMin?: number;
  reportsMax?: number;
}): Categoria[] => {
  let filteredCategories = [...categorias];
  
  if (criteria.search) {
    const term = criteria.search.toLowerCase();
    filteredCategories = filteredCategories.filter(
      category => category.nombre.toLowerCase().includes(term) ||
                  (category.descripcion || '').toLowerCase().includes(term)
    );
  }
  
  if (criteria.active !== undefined) {
    filteredCategories = filteredCategories.filter(category => category.activo === criteria.active);
  }
  
  if (criteria.reportsMin !== undefined || criteria.reportsMax !== undefined) {
    filteredCategories = filteredCategories.filter(category => {
      const reportCount = getReportesPorCategoria(category.id);
      
      if (criteria.reportsMin !== undefined && reportCount < criteria.reportsMin) {
        return false;
      }
      
      if (criteria.reportsMax !== undefined && reportCount > criteria.reportsMax) {
        return false;
      }
      
      return true;
    });
  }
  
  return filteredCategories;
};

// Ordenar categorías
export const sortCategories = (categories: Categoria[], sortBy: string, direction: 'asc' | 'desc'): Categoria[] => {
  const sortedCategories = [...categories];
  
  sortedCategories.sort((a, b) => {
    let comparison = 0;
    
    switch (sortBy) {
      case 'nombre':
        comparison = a.nombre.localeCompare(b.nombre);
        break;
      case 'descripcion':
        comparison = (a.descripcion || '').localeCompare(b.descripcion || '');
        break;
      case 'reportes':
        const reportsA = getReportesPorCategoria(a.id);
        const reportsB = getReportesPorCategoria(b.id);
        comparison = reportsA - reportsB;
        break;
      case 'estado':
        comparison = Number(a.activo) - Number(b.activo);
        break;
      case 'fecha':
        const fechaA = a.fechaCreacion instanceof Date ? a.fechaCreacion : new Date(a.fechaCreacion);
        const fechaB = b.fechaCreacion instanceof Date ? b.fechaCreacion : new Date(b.fechaCreacion);
        comparison = fechaA.getTime() - fechaB.getTime();
        break;
      default:
        comparison = 0;
    }

    return direction === 'asc' ? comparison : -comparison;
  });
  
  return sortedCategories;
};
