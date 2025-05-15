export interface ChartData {
  name: string;
  value: number;
  color?: string;
} 

export interface CategoryTotalCardProps {
  totalCategorias: number;
}

export interface CategoryChartsProps {
  reportesPorCategoria: ChartData[];
  reportesPorCategoriaEstado: ChartData[];
  tiposEstado: Record<string, { nombre: string; color: string }>;
}

export interface MostUsedCategoriesProps {
  categoriasMasUsadas: ChartData[];
}