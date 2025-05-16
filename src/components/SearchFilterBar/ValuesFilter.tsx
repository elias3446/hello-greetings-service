import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { X } from "lucide-react";
import { ValuesFilterProps, Attribute } from "./types";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { formatValue } from "./utils";

export function ValuesFilter<T>({
  attributes,
  data,
  filteredData, // Mantenemos este parámetro para compatibilidad, pero no lo usaremos
  selectedValues,
  onChange,
  onClear,
  activeFiltersCount = 0,
  selectedSortAttribute = "name", // Default to "name"
}: ValuesFilterProps<T>) {
  const [searchValue, setSearchValue] = useState("");
  const [attributeValues, setAttributeValues] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState(true);
  
  // Extraer valores únicos para el atributo seleccionado usando los datos originales
  useEffect(() => {
    if (selectedSortAttribute) {
      const dataToUse = data;
      const attrInfo = attributes.find(attr => attr.value === selectedSortAttribute);
      
      if (dataToUse.length > 0) {
        const uniqueValues = new Set<string>();
        
        dataToUse.forEach(item => {
          try {
            let value;
            
            // Si el atributo es de tipo function, usar getValue si está disponible
            if (attrInfo?.type === 'function' && attrInfo.getValue) {
              value = attrInfo.getValue(item);
            } else {
              value = (item as any)[selectedSortAttribute];
            }
            
            if (value !== undefined && value !== null) {
              let formattedValue: string;
              
              // Si el atributo tiene formatValue, usarlo
              if (attrInfo?.formatValue) {
                formattedValue = attrInfo.formatValue(value);
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
            console.error("Error extracting attribute value:", error);
          }
        });
        
        let valueArray = Array.from(uniqueValues);
        
        // Ordenar valores según el tipo
        if (attrInfo?.type === 'date') {
          valueArray.sort((a, b) => new Date(a).getTime() - new Date(b).getTime());
        } else if (attrInfo?.type === 'number') {
          valueArray.sort((a, b) => {
            const numA = parseFloat(a);
            const numB = parseFloat(b);
            return isNaN(numA) || isNaN(numB) ? a.localeCompare(b) : numA - numB;
          });
        } else {
          valueArray.sort();
        }
        
        setAttributeValues(valueArray);
      } else {
        setAttributeValues([]);
      }

      const currentValues = selectedValues[selectedSortAttribute] || [];
      setSelectAll(currentValues.length === 0);
    } else {
      setAttributeValues([]);
    }
  }, [selectedSortAttribute, data, selectedValues, attributes]);
  
  // Handle value toggle selection
  const handleValueToggle = (value: string) => {
    const currentValues = selectedValues[selectedSortAttribute] || [];
    const newValues = currentValues.includes(value)
      ? currentValues.filter(v => v !== value)
      : [...currentValues, value];
    
    onChange(selectedSortAttribute, newValues);
  };

  // Handle select all toggle
  const handleSelectAll = () => {
    if (!selectAll) {
      // Si "Todos" está siendo seleccionado, limpiar los filtros para este atributo
      onChange(selectedSortAttribute, []);
      setSelectAll(true);
    } else {
      // Si "Todos" está siendo des-seleccionado, esto no debería pasar directamente
      // Se des-seleccionará automáticamente cuando se seleccione un valor específico
      setSelectAll(false);
    }
  };
  
  // Filter values based on search
  const filteredValues = attributeValues.filter(value => 
    value.toLowerCase().includes(searchValue.toLowerCase())
  );
  
  // Get selected attribute label to display
  const getSelectedAttributeLabel = () => {
    if (!selectedSortAttribute) return "Nombre";
    const attr = attributes.find(a => a.value === selectedSortAttribute);
    return attr ? attr.label : "Nombre";
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button 
          variant="outline" 
          className="flex items-center gap-1.5"
        >
          Valores: {getSelectedAttributeLabel()}
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
            <h4 className="font-medium text-sm">
              Filtrar por {getSelectedAttributeLabel()}
            </h4>
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
          
          {/* Search box for values */}
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
          
          {/* Option for "Todos" */}
          <div className="flex items-center space-x-2 border-b pb-2 mb-2">
            <Checkbox
              id="select-all-values"
              checked={selectAll}
              onCheckedChange={handleSelectAll}
            />
            <label
              htmlFor="select-all-values"
              className={cn(
                "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer",
                selectAll && "font-semibold"
              )}
            >
              Todos
            </label>
          </div>
          
          {/* Values list */}
          <ScrollArea className="h-[200px] pr-4">
            <div className="space-y-2">
              {filteredValues.length > 0 ? (
                filteredValues.map(value => {
                  const isChecked = (selectedValues[selectedSortAttribute] || []).includes(value);
                  
                  return (
                    <div key={value} className="flex items-center space-x-2">
                      <Checkbox
                        id={`value-${value}`}
                        checked={isChecked}
                        onCheckedChange={() => handleValueToggle(value)}
                      />
                      <label
                        htmlFor={`value-${value}`}
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
        </div>
      </PopoverContent>
    </Popover>
  );
}

export default ValuesFilter;