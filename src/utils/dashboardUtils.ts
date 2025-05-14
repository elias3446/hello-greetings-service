import { Categoria, EstadoReporte } from '@/types/tipos';
import { getCategories } from '@/controller/CRUD/categoryController';
import { getReports } from '@/controller/CRUD/reportController';
import { getEstados } from '@/controller/CRUD/estadoController';

// Interface for grouped states
export interface EstadoAgrupado {
  [key: string]: number;
}

export interface TipoEstado {
  [key: string]: {
    nombre: string;
    color: string;
  };
}

export interface CategoriaConReportes {
  name: string;
  value: number;
  color: string;
}

export interface CategoriaEstadoData {
  name: string;
  color: string;
  [key: string]: any;
}

// Get categories with report counts
export const getCategoriaConReportes = (): CategoriaConReportes[] => {
  const categoriasData = getCategories();
  const reportesData = getReports();
  
  return categoriasData.map(categoria => {
    const reportesCat = reportesData.filter(reporte => reporte.categoria.id === categoria.id);
    
    return {
      name: categoria.nombre,
      value: reportesCat.length,
      color: categoria.color
    };
  }).sort((a, b) => b.value - a.value);
};

// Get report counts by category and status type
export const getReportesPorCategoriaEstado = (tiposEstado: TipoEstado): CategoriaEstadoData[] => {
  const categoriasData = getCategories();
  const reportesData = getReports();
  
  return categoriasData
    .filter(categoria => 
      reportesData.some(reporte => reporte.categoria.id === categoria.id)
    )
    .map(categoria => {
      const reportesCat = reportesData.filter(reporte => reporte.categoria.id === categoria.id);
      
      // Create an object for counting by status type
      const estadosConteo: EstadoAgrupado = {};
      
      // Initialize all status types to 0
      Object.keys(tiposEstado).forEach(tipo => {
        estadosConteo[tiposEstado[tipo].nombre] = 0;
      });
      
      // Count reports by status type for this category
      reportesCat.forEach(reporte => {
        const estadoKey = reporte.estado.nombre.toLowerCase().replace(/ /g, '_');
        const estadoNombre = tiposEstado[estadoKey]?.nombre || reporte.estado.nombre;
        estadosConteo[estadoNombre] = (estadosConteo[estadoNombre] || 0) + 1;
      });

      return {
        name: categoria.nombre,
        ...estadosConteo,
        color: categoria.color
      };
    })
    .sort((a, b) => {
      // Calculate total reports per category for sorting
      const totalA = Object.keys(a)
        .filter(key => key !== 'name' && key !== 'color')
        .reduce((sum, key) => sum + a[key], 0);
        
      const totalB = Object.keys(b)
        .filter(key => key !== 'name' && key !== 'color')
        .reduce((sum, key) => sum + b[key], 0);
        
      return totalB - totalA;
    })
    .slice(0, 5);
};

// Get unique status types with their colors
export const getTiposEstado = (): TipoEstado => {
  const estadosData = getEstados();
  
  const tiposEstadoTemp: TipoEstado = {};
  estadosData.forEach(estado => {
    const estadoKey = estado.nombre.toLowerCase().replace(/ /g, '_');
    if (!tiposEstadoTemp[estadoKey]) {
      tiposEstadoTemp[estadoKey] = {
        nombre: estado.nombre,
        color: estado.color
      };
    }
  });
  
  return tiposEstadoTemp;
};

export const CHART_COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];
