
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Check, ChevronDown, Filter } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

interface FilterByValuesProps<T> {
  items: T[];
  currentField?: string;
  onFilterChange: (values: any[]) => void;
  getFieldValue: (item: T, field: string) => any;
}

function FilterByValues<T>({
  items,
  currentField,
  onFilterChange,
  getFieldValue
}: FilterByValuesProps<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const [uniqueValues, setUniqueValues] = useState<any[]>([]);
  const [selectedValues, setSelectedValues] = useState<any[]>([]);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  // Cerrar el dropdown cuando se hace clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Actualizar valores únicos cuando cambia el campo o los items
  useEffect(() => {
    if (!currentField) {
      setUniqueValues([]);
      setSelectedValues([]);
      return;
    }

    // Extraer valores únicos del campo seleccionado
    const values = items.map(item => getFieldValue(item, currentField))
      .filter(value => value !== undefined && value !== null);
    
    // Si los valores son objetos (como roles), extraer el nombre o la propiedad relevante
    const processedValues = values.map(value => {
      if (typeof value === 'object' && value !== null) {
        return value.nombre || value.name || value.value || JSON.stringify(value);
      }
      return value;
    });
    
    // Filtrar valores únicos
    const unique = Array.from(new Set(processedValues));
    setUniqueValues(unique);
    setSelectedValues([]);
  }, [currentField, items, getFieldValue]);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const toggleValue = (value: any) => {
    setSelectedValues(prev => {
      const isSelected = prev.includes(value);
      const newValues = isSelected
        ? prev.filter(v => v !== value)
        : [...prev, value];
      
      onFilterChange(newValues);
      return newValues;
    });
  };

  const clearFilters = () => {
    setSelectedValues([]);
    onFilterChange([]);
  };

  // Si no hay campo seleccionado o no hay valores únicos, desactivar el botón
  const disabled = !currentField || uniqueValues.length === 0;

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      <Button
        variant="outline"
        className="flex items-center gap-2"
        onClick={toggleDropdown}
        disabled={disabled}
      >
        <Filter className="h-4 w-4" />
        Filtrar por
        {selectedValues.length > 0 && (
          <Badge variant="secondary" className="ml-1">
            {selectedValues.length}
          </Badge>
        )}
        <ChevronDown className="h-4 w-4 ml-1" />
      </Button>

      {isOpen && !disabled && (
        <div className="absolute right-0 z-50 mt-1 w-56 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="p-2 border-b">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Filtrar valores</span>
              {selectedValues.length > 0 && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={clearFilters}
                  className="text-xs h-7"
                >
                  Limpiar
                </Button>
              )}
            </div>
          </div>
          <ScrollArea className="h-60 py-1">
            <div className="py-1">
              {uniqueValues.map((value, index) => {
                const isSelected = selectedValues.includes(value);
                const displayValue = value === true ? 'Sí' : value === false ? 'No' : String(value);
                
                return (
                  <button
                    key={index}
                    className={`flex items-center w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${
                      isSelected ? 'bg-gray-50 text-primary' : ''
                    }`}
                    onClick={() => toggleValue(value)}
                  >
                    {isSelected && <Check className="h-4 w-4 mr-2" />}
                    <span className={isSelected ? 'ml-0' : 'ml-6'}>
                      {displayValue}
                    </span>
                  </button>
                );
              })}
            </div>
          </ScrollArea>
        </div>
      )}
    </div>
  );
}

export default FilterByValues;
