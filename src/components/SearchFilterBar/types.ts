
/**
 * Tipos para el componente SearchFilterBar
 */

export interface Attribute {
  label: string;
  value: string;
  type?: 'string' | 'number' | 'date' | 'object';
}

export interface PropertyFilter {
  label: string;
  property: string;
}

export type SortDirection = 'asc' | 'desc';

export interface SearchFilterBarProps<T> {
  /** Array de datos original a filtrar */
  data: T[];
  
  /** Función callback que se ejecuta cuando cambian los filtros */
  onFilterChange?: (filteredData: T[], filters: any) => void;
  
  /** Lista de atributos por los que se puede filtrar y ordenar */
  attributes: Attribute[];
  
  /** Lista de propiedades importantes para el filtrado rápido */
  propertyFilters: PropertyFilter[];
  
  /** Placeholder para el campo de búsqueda */
  searchPlaceholder?: string;
  
  /** Etiqueta para el contador de resultados (ej: "resultados", "elementos", etc) */
  resultLabel?: string;
  
  /** Etiqueta para el botón de exportar */
  exportLabel?: string;
  
  /** Clase CSS adicional */
  className?: string;
  
  /** Función para exportar los resultados filtrados */
  exportFunction?: (data: T[]) => void;
  
  /** Función para navegar a otra pantalla */
  navigateFunction?: () => void;
  
  /** Texto para el botón de navegación */
  navigateLabel?: string;
}

export interface AttributeFilterProps {
  attributes: Attribute[];
  selectedAttribute: string;
  onChange: (value: string) => void;
}

export interface ValuesFilterProps<T> {
  attributes: Attribute[];
  data: T[];
  filteredData?: T[]; // Mantener como opcional para compatibilidad
  selectedValues: Record<string, string[]>;
  onChange: (attribute: string, values: string[]) => void;
  onClear: () => void;
  activeFiltersCount?: number;
  selectedSortAttribute?: string; // Atributo seleccionado desde el componente padre
}

export interface PropertiesFilterProps<T> {
  propertyFilters: PropertyFilter[];
  data: T[];
  filteredData?: T[]; // Mantener como opcional para compatibilidad
  selectedProperties: Record<string, string[]>;
  onChange: (property: string, values: string[]) => void;
  onClear: () => void;
  activeFiltersCount?: number;
}
