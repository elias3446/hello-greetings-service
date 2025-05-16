import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, Download, ChevronsUpDown, ArrowUp, ArrowDown } from "lucide-react";
import { ValuesFilter } from "./ValuesFilter";
import { PropertiesFilter } from "./PropertiesFilter";
import { exportToCSV } from "@/utils/exportUtils";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { SearchFilterBarProps, SortDirection } from "./types";
import { toast } from "@/hooks/use-toast";
import { datesMatch, objectMatches } from "./utils";

/**
 * SearchFilterBar - Componente reutilizable para búsqueda y filtrado avanzado
 */
export function SearchFilterBar<T>({
  data,
  onFilterChange,
  attributes,
  propertyFilters,
  searchPlaceholder = "Buscar...",
  resultLabel = "resultados",
  exportLabel = "Exportar",
  className,
  exportFunction,
  navigateFunction,
  navigateLabel,
}: SearchFilterBarProps<T>) {
  // Estado para almacenar todos los filtros
  const [filters, setFilters] = useState({
    searchTerm: "",
    selectedValues: {} as Record<string, string[]>,
    selectedProperties: {} as Record<string, string[]>,
  });

  // Establecer "name" como valor predeterminado o usar el primer atributo si existe
  const defaultAttribute = attributes.length > 0 ? attributes[0].value : "name";
  
  // Estado para el atributo seleccionado para ordenar y mostrar valores
  const [selectedAttribute, setSelectedAttribute] = useState(defaultAttribute);
  
  // Estado para la dirección de ordenación (ascendente o descendente)
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");

  // Estado para los resultados filtrados
  const [filteredResults, setFilteredResults] = useState<T[]>(data);

  // Función para formatear fechas en el formato "31 dic 2022"
  const formatDate = (date: Date) => {
    return format(date, "d MMM yyyy", { locale: es });
  };

  // Actualizamos los resultados cuando cambian los filtros o los datos
  useEffect(() => {
    // Filtrado por término de búsqueda
    let results = [...data];
    
    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
      results = results.filter(item => {
        // Buscar en todos los campos del objeto
        return Object.entries(item as object).some(([key, value]) => {
          if (typeof value === "string") {
            return value.toLowerCase().includes(searchLower);
          } else if (typeof value === "number") {
            return value.toString().includes(searchLower);
          } else if (value instanceof Date) {
            // Usar el formato correcto para buscar en fechas
            const formattedDate = formatDate(value).toLowerCase();
            return formattedDate.includes(searchLower);
          }
          return false;
        });
      });
    }
    
    // Filtrado por valores seleccionados
    Object.entries(filters.selectedValues).forEach(([attribute, values]) => {
      if (values.length > 0) {
        results = results.filter(item => {
          const itemValue = (item as any)[attribute];
          
          // Manejo especial para filtrado por fecha
          const attrInfo = attributes.find(attr => attr.value === attribute);
          
          if (attrInfo?.type === 'date' && itemValue instanceof Date) {
            // Usar la función datesMatch para comparar fechas
            return values.some(filterValue => datesMatch(itemValue, filterValue));
          }
          
          // Manejo especial para filtrado por objetos
          if (attrInfo?.type === 'object' || (typeof itemValue === 'object' && itemValue !== null && !(itemValue instanceof Date) && !Array.isArray(itemValue))) {
            return values.some(filterValue => objectMatches(itemValue, filterValue));
          }
          
          // Para arrays, verificar si algún elemento coincide
          if (Array.isArray(itemValue)) {
            return values.some(filterValue => 
              itemValue.some(val => {
                if (typeof val === 'object' && val !== null) {
                  return objectMatches(val, filterValue);
                }
                return String(val) === filterValue;
              })
            );
          }
          
          // Para tipos primitivos
          return values.includes(String(itemValue));
        });
      }
    });
    
    // Filtrado por propiedades seleccionadas
    Object.entries(filters.selectedProperties).forEach(([property, values]) => {
      if (values.length > 0) {
        results = results.filter(item => {
          const itemValue = (item as any)[property];
          if (Array.isArray(itemValue)) {
            return itemValue.some(val => values.includes(String(val)));
          }
          return values.includes(String(itemValue));
        });
      }
    });
    
    // Aplicar ordenación siempre que haya un atributo seleccionado
    if (selectedAttribute) {
      const selectedAttrInfo = attributes.find(attr => attr.value === selectedAttribute);
      const attrType = selectedAttrInfo?.type || 'string';
      
      results = [...results].sort((a, b) => {
        const aValue = (a as any)[selectedAttribute];
        const bValue = (b as any)[selectedAttribute];
        
        // Si alguno de los valores no existe, ponerlo al final
        if (aValue === undefined || aValue === null) return 1;
        if (bValue === undefined || bValue === null) return -1;
        
        let comparison = 0;
        
        // Comparar según el tipo de dato
        if (attrType === 'date') {
          // Si son objetos Date, comparar directamente
          if (aValue instanceof Date && bValue instanceof Date) {
            comparison = aValue.getTime() - bValue.getTime();
          } else {
            // Intentar convertir a Date si son strings
            const aDate = new Date(aValue);
            const bDate = new Date(bValue);
            comparison = aDate.getTime() - bDate.getTime();
          }
        } else if (attrType === 'number') {
          comparison = Number(aValue) - Number(bValue);
        } else {
          // Default: comparar como strings
          comparison = String(aValue).localeCompare(String(bValue));
        }
        
        // Aplicar dirección de ordenación
        return sortDirection === 'asc' ? comparison : -comparison;
      });
    }
    
    setFilteredResults(results);
    
    // Notificar al componente padre sobre los cambios
    if (onFilterChange) {
      onFilterChange(results, filters);
    }
  }, [filters, data, onFilterChange, selectedAttribute, sortDirection, attributes]);
  
  // Manejador de cambios de búsqueda
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters(prev => ({ ...prev, searchTerm: e.target.value }));
  };
  
  // Manejador para valores seleccionados
  const handleValuesChange = (attribute: string, values: string[]) => {
    setFilters(prev => ({
      ...prev,
      selectedValues: {
        ...prev.selectedValues,
        [attribute]: values
      }
    }));
  };
  
  // Manejador para propiedades seleccionadas
  const handlePropertiesChange = (property: string, values: string[]) => {
    setFilters(prev => ({
      ...prev,
      selectedProperties: {
        ...prev.selectedProperties,
        [property]: values
      }
    }));
  };

  // Manejador para cambio de atributo en "Ordenar por"
  const handleAttributeChange = (attribute: string) => {
    setSelectedAttribute(attribute);
  };
  
  // Manejador para cambiar la dirección de ordenación
  const toggleSortDirection = () => {
    setSortDirection(prev => prev === "asc" ? "desc" : "asc");
  };
  
  // Limpiar todos los filtros
  const handleClearAllFilters = () => {
    setFilters({
      searchTerm: "",
      selectedValues: {},
      selectedProperties: {},
    });
  };
  
  // Limpiar solo filtros de valores
  const handleClearValuesFilters = () => {
    setFilters(prev => ({
      ...prev,
      selectedValues: {},
    }));
  };
  
  // Limpiar solo filtros de propiedades
  const handleClearPropertiesFilters = () => {
    setFilters(prev => ({
      ...prev,
      selectedProperties: {},
    }));
  };
  
  // Función para manejar la exportación de resultados
  const handleExport = () => {
    if (exportFunction) {
      exportFunction(filteredResults);
    } else {
      // Usar nuestra función de exportación a CSV
      try {
        exportToCSV(
          filteredResults as Record<string, any>[],
          `export-${new Date().toISOString().split('T')[0]}`,
          Object.fromEntries(attributes.map(attr => [attr.value, attr.label]))
        );
        toast({
          title: "Exportación completada",
          description: `Se han exportado ${filteredResults.length} ${resultLabel}`,
        });
      } catch (error) {
        console.error("Error al exportar:", error);
        toast({
          title: "Error en la exportación",
          description: "No se pudo completar la exportación de datos",
          variant: "destructive"
        });
      }
    }
  };
  
  // Verificar si hay filtros activos
  const hasActiveFilters = 
    filters.searchTerm !== "" || 
    Object.values(filters.selectedValues).some(values => values.length > 0) ||
    Object.values(filters.selectedProperties).some(values => values.length > 0);
  
  // Calcular el número total de filtros activos para las badges
  const getActiveValueFiltersCount = () => {
    return Object.values(filters.selectedValues).reduce(
      (count, values) => count + values.length, 
      0
    );
  };
  
  const getActivePropertyFiltersCount = () => {
    return Object.values(filters.selectedProperties).reduce(
      (count, values) => count + values.length, 
      0
    );
  };

  // Get the current attribute label
  const getAttributeLabel = (attributeValue: string) => {
    const attr = attributes.find(a => a.value === attributeValue);
    return attr ? attr.label : "Nombre";
  };
  
  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        {/* Primera fila: búsqueda y botones auxiliares */}
        <div className="flex flex-1 flex-col gap-2 md:flex-row md:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              type="text"
              placeholder={searchPlaceholder}
              value={filters.searchTerm}
              onChange={handleSearchChange}
              className="pl-8"
            />
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            onClick={handleExport}
            className="flex items-center gap-1.5"
          >
            <Download className="h-4 w-4" />
            <span>{exportLabel}</span>
          </Button>
          
          {/* Nuevo botón de navegación */}
          {navigateFunction && navigateLabel && (
            <Button 
              variant="default" 
              onClick={navigateFunction}
              className="flex items-center gap-1.5"
            >
              <span>{navigateLabel}</span>
            </Button>
          )}
        </div>
      </div>
      
      {/* Segunda fila: ordenar por y filtros avanzados */}
      <div className="flex flex-wrap gap-2">
        {/* Ordenar asc/desc y Dropdown para "Ordenar por" - Con botón de dirección reubicado a la izquierda */}
        <div className="flex items-center gap-2">
          {/* Botón para cambiar la dirección de ordenación movido a la izquierda */}
          <Button
            variant="outline"
            size="icon"
            onClick={toggleSortDirection}
            className="flex items-center justify-center w-10 h-10"
            title={sortDirection === 'asc' ? 'Ordenar Descendente' : 'Ordenar Ascendente'}
          >
            {sortDirection === 'asc' ? (
              <ArrowUp className="h-4 w-4" />
            ) : (
              <ArrowDown className="h-4 w-4" />
            )}
          </Button>
          
          {/* Dropdown para "Ordenar por" */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-1.5">
                Ordenar por: {getAttributeLabel(selectedAttribute)}
                <ChevronsUpDown className="h-4 w-4 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[200px]">
              <DropdownMenuLabel>Ordenar por atributo</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {attributes.map((attr) => (
                <DropdownMenuItem
                  key={attr.value}
                  className={cn(
                    "cursor-pointer",
                    selectedAttribute === attr.value && "font-bold bg-accent"
                  )}
                  onClick={() => handleAttributeChange(attr.value)}
                >
                  {attr.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        {/* Filtro por valores - pasar data (no filteredResults) para los valores del filtro */}
        <ValuesFilter
          attributes={attributes}
          data={data}  // Usar data para construir las opciones de filtro
          filteredData={data}  // También pasamos data como filteredData para compatibilidad
          selectedValues={filters.selectedValues}
          onChange={handleValuesChange}
          onClear={handleClearValuesFilters}
          activeFiltersCount={getActiveValueFiltersCount()}
          selectedSortAttribute={selectedAttribute}
        />
        
        {/* Filtro por propiedades importantes - pasar data (no filteredResults) para los valores del filtro */}
        <PropertiesFilter
          propertyFilters={propertyFilters}
          data={data}  // Usar data para construir las opciones de filtro
          filteredData={data}  // También pasamos data como filteredData para compatibilidad
          selectedProperties={filters.selectedProperties}
          onChange={handlePropertiesChange}
          onClear={handleClearPropertiesFilters}
          activeFiltersCount={getActivePropertyFiltersCount()}
        />
      </div>
      
      {/* Tercera fila: contador de resultados y botón de limpiar filtros */}
      <div className="flex items-center justify-between text-sm">
        <div>
          Mostrando {filteredResults.length} de {data.length} {resultLabel}
        </div>
        
        {hasActiveFilters && (
          <Button variant="link" onClick={handleClearAllFilters} className="h-auto p-0">
            Limpiar filtros
          </Button>
        )}
      </div>
    </div>
  );
}

export default SearchFilterBar;
