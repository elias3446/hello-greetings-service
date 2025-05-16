import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { X } from "lucide-react";
import { PropertiesFilterProps } from "./types";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { formatValue } from "./utils";

export function PropertiesFilter<T>({
  propertyFilters,
  data,
  filteredData, // Mantenemos este parámetro para compatibilidad, pero no lo usaremos
  selectedProperties,
  onChange,
  onClear,
  activeFiltersCount = 0,
}: PropertiesFilterProps<T>) {
  const [selectedProperty, setSelectedProperty] = useState<string>("");
  const [propertyValues, setPropertyValues] = useState<string[]>([]);
  const [searchValue, setSearchValue] = useState("");
  const [selectAll, setSelectAll] = useState(true);
  
  // Extraer valores únicos para la propiedad seleccionada usando los datos originales
  useEffect(() => {
    if (selectedProperty) {
      const dataToUse = data;
      const propInfo = propertyFilters.find(prop => prop.property === selectedProperty);
      
      if (dataToUse.length > 0) {
        const uniqueValues = new Set<string>();
        
        dataToUse.forEach(item => {
          try {
            let value;
            
            // Si la propiedad tiene getValue, usarlo
            if (propInfo?.getValue) {
              value = propInfo.getValue(item);
            } else {
              value = (item as any)[selectedProperty];
            }
            
            if (value !== undefined && value !== null) {
              let formattedValue: string;
              
              // Si la propiedad tiene formatValue, usarlo
              if (propInfo?.formatValue) {
                formattedValue = propInfo.formatValue(value);
              } else {
                // Si no, usar el formatValue genérico
                formattedValue = formatValue(value);
              }
              
              // Solo agregar si el valor formateado es válido
              if (formattedValue && formattedValue !== '[Objeto]' && formattedValue !== '[object Object]') {
                uniqueValues.add(formattedValue);
              }
            }
          } catch (error) {
            console.error("Error extracting property value:", error);
          }
        });
        
        let valueArray = Array.from(uniqueValues);
        
        // Ordenar valores según el tipo
        if (propInfo?.type === 'date') {
          valueArray.sort((a, b) => new Date(a).getTime() - new Date(b).getTime());
        } else if (propInfo?.type === 'number') {
          valueArray.sort((a, b) => {
            const numA = parseFloat(a);
            const numB = parseFloat(b);
            return isNaN(numA) || isNaN(numB) ? a.localeCompare(b) : numA - numB;
          });
        } else {
          valueArray.sort();
        }
        
        setPropertyValues(valueArray);
      } else {
        setPropertyValues([]);
      }

      const currentValues = selectedProperties[selectedProperty] || [];
      setSelectAll(currentValues.length === 0);
    } else {
      setPropertyValues([]);
    }
  }, [selectedProperty, data, selectedProperties, propertyFilters]);
  
  // Manejar cambios en la selección de valores
  const handleValueToggle = (value: string) => {
    const currentValues = selectedProperties[selectedProperty] || [];
    const newValues = currentValues.includes(value)
      ? currentValues.filter(v => v !== value)
      : [...currentValues, value];
    
    onChange(selectedProperty, newValues);
  };

  // Manejar seleccionar todos
  const handleSelectAll = () => {
    if (!selectAll) {
      // Si "Todos" está siendo seleccionado, limpiar los filtros para esta propiedad
      onChange(selectedProperty, []);
      setSelectAll(true);
    } else {
      // Si "Todos" está siendo des-seleccionado, esto no debería pasar directamente
      // Se des-seleccionará automáticamente cuando se seleccione un valor específico
      setSelectAll(false);
    }
  };
  
  // Manejar cambio de propiedad seleccionada
  const handlePropertyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newProperty = e.target.value;
    setSelectedProperty(newProperty);
  };
  
  // Obtener la etiqueta de la propiedad seleccionada para mostrar
  const getSelectedPropertyLabel = () => {
    if (!selectedProperty) return "";
    const prop = propertyFilters.find(p => p.property === selectedProperty);
    return prop ? prop.label : "";
  };
  
  // Filtrar valores basados en la búsqueda
  const filteredValues = propertyValues.filter(value => 
    value.toLowerCase().includes(searchValue.toLowerCase())
  );

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button 
          variant="outline" 
          className="flex items-center gap-1.5"
        >
          {selectedProperty ? `Filtrar: ${getSelectedPropertyLabel()}` : "Filtrar"}
          {activeFiltersCount > 0 && (
            <Badge 
              variant="secondary" 
              className="rounded-full ml-1 text-xs font-normal"
            >
              {activeFiltersCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-medium text-sm">Filtrar por propiedades</h4>
            {activeFiltersCount > 0 && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={onClear} 
                className="h-auto py-1 px-2 text-xs"
              >
                Limpiar
              </Button>
            )}
          </div>
          
          {/* Selector de propiedad */}
          <select
            value={selectedProperty}
            onChange={handlePropertyChange}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <option value="">Seleccionar propiedad</option>
            {propertyFilters.map(prop => (
              <option key={prop.property} value={prop.property}>
                {prop.label}
              </option>
            ))}
          </select>
          
          {selectedProperty && (
            <>
              {/* Búsqueda de valores */}
              <div className="relative">
                <Input
                  placeholder="Buscar valores..."
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  className="w-full"
                />
                {searchValue && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full"
                    onClick={() => setSearchValue("")}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
              
              {/* Opción para "Todos" */}
              <div className="flex items-center space-x-2 border-b pb-2 mb-2">
                <Checkbox
                  id="select-all-properties"
                  checked={selectAll}
                  onCheckedChange={handleSelectAll}
                />
                <label
                  htmlFor="select-all-properties"
                  className={cn(
                    "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer",
                    selectAll && "font-semibold"
                  )}
                >
                  Todos
                </label>
              </div>
              
              {/* Lista de valores */}
              <ScrollArea className="h-[200px] pr-4">
                <div className="space-y-2">
                  {filteredValues.length > 0 ? (
                    filteredValues.map(value => {
                      const isChecked = (selectedProperties[selectedProperty] || []).includes(value);
                      
                      return (
                        <div key={value} className="flex items-center space-x-2">
                          <Checkbox
                            id={`property-${value}`}
                            checked={isChecked}
                            onCheckedChange={() => handleValueToggle(value)}
                          />
                          <label
                            htmlFor={`property-${value}`}
                            className={cn(
                              "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer",
                              isChecked && "font-semibold"
                            )}
                          >
                            {value}
                          </label>
                        </div>
                      );
                    })
                  ) : (
                    <div className="text-center text-sm text-muted-foreground py-2">
                      {searchValue ? "No hay valores que coincidan con la búsqueda" : "No hay valores disponibles"}
                    </div>
                  )}
                </div>
              </ScrollArea>
            </>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}

export default PropertiesFilter;