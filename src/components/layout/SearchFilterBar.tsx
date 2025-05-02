import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  SearchIcon, 
  FilterIcon, 
  ArrowUpIcon, 
  ArrowDownIcon, 
  DownloadIcon,
  CheckIcon,
  UserPlus
} from 'lucide-react';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';

interface SortOption {
  value: string;
  label: string;
}

interface SearchFilterBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  statusFilter: string | null;
  onStatusFilterChange: (value: string | null) => void;
  roleFilter: string | null;
  onRoleFilterChange: (value: string | null) => void;
  sortBy: string;
  onSortByChange: (value: string) => void;
  sortDirection: 'asc' | 'desc';
  onSortDirectionChange: () => void;
  currentField: string | undefined;
  onCurrentFieldChange: (value: string | undefined) => void;
  onFilterChange: (values: any[]) => void;
  onExport: () => void;
  onNewItem: () => void;
  items: any[];
  getFieldValue: (item: any, field: string) => string;
  roles?: string[];
  showNewButton?: boolean;
  newButtonLabel?: string;
  showExportButton?: boolean;
  sortOptions: SortOption[];
  filteredCount?: number;
  totalCount?: number;
  itemLabel?: string;
  filterOptions: {
    value: string;
    label: string;
  }[];
  searchPlaceholder?: string;
}

const SearchFilterBar: React.FC<SearchFilterBarProps> = ({
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  roleFilter,
  onRoleFilterChange,
  sortBy,
  onSortByChange,
  sortDirection,
  onSortDirectionChange,
  currentField,
  onCurrentFieldChange,
  onFilterChange,
  onExport,
  onNewItem,
  items,
  getFieldValue,
  roles = [],
  showNewButton = true,
  newButtonLabel = 'Nuevo',
  showExportButton = true,
  sortOptions,
  filteredCount = items.length,
  totalCount = items.length,
  itemLabel = 'elementos',
  filterOptions,
  searchPlaceholder = "Buscar..."
}) => {
  const [selectedValues, setSelectedValues] = useState<string[]>([]);
  const [showAll, setShowAll] = useState(true);
  const [filterState, setFilterState] = useState<{
    values: string[];
    filters: string[];
  }>({
    values: [],
    filters: []
  });

  // Efecto para sincronizar los filtros
  useEffect(() => {
    const values = selectedValues.filter(v => !v.includes(':'));
    const filters = selectedValues.filter(v => v.includes(':'));
    setFilterState({ values, filters });
    onFilterChange(selectedValues);
  }, [selectedValues]);

  const handleFilterChange = (option: { value: string; label: string }, value: string, checked: boolean) => {
    setSelectedValues(prev => {
      if (checked) {
        // Al seleccionar un filtro específico
        const newValues = prev.filter(v => !v.startsWith(option.value + ':'));
        return [...newValues, `${option.value}:${value}`];
      } else {
        // Al deseleccionar un filtro
        return prev.filter(v => v !== `${option.value}:${value}`);
      }
    });
  };

  const handleValueChange = (value: string, checked: boolean) => {
    if (value === 'Todos') {
      if (checked) {
        // Mantener solo los filtros al seleccionar "Todos"
        setSelectedValues(prev => prev.filter(v => v.includes(':')));
        setShowAll(true);
      }
      return;
    }

    setSelectedValues(prev => {
      if (checked) {
        // Agregar nuevo valor manteniendo los filtros
        return [...prev.filter(v => v.includes(':')), value];
      } else {
        // Remover valor manteniendo los filtros
        return prev.filter(v => v.includes(':') || v !== value);
      }
    });
    setShowAll(false);
  };

  const clearFilters = () => {
    // Mantener solo los filtros al limpiar
    setSelectedValues(prev => prev.filter(v => v.includes(':')));
    setShowAll(true);
    onSearchChange('');
    onStatusFilterChange(null);
    onRoleFilterChange(null);
    onSortByChange('nombre');
    onSortDirectionChange();
    onCurrentFieldChange(undefined);
  };

  const handleSortChange = (value: string) => {
    // Mantener los filtros existentes al cambiar el ordenamiento
    const currentFilters = selectedValues.filter(v => v.includes(':'));
    
    onSearchChange('');
    onStatusFilterChange(null);
    onRoleFilterChange(null);
    onSortByChange(value);
    onSortDirectionChange();
    onCurrentFieldChange(value);
    
    // Mantener los filtros existentes
    setSelectedValues(currentFilters);
  };

  const isAllSelected = () => {
    return selectedValues.includes('Todos');
  };

  const isValueSelected = (value: string) => {
    return selectedValues.includes(value);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Input
            placeholder={searchPlaceholder}
            value={searchTerm}
            onChange={(e) => {
              console.log('Input Search Value:', e.target.value);
              onSearchChange(e.target.value);
            }}
            className="pl-10"
          />
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        </div>
        
        <div className="flex items-center gap-2 flex-wrap">
          
          {/* Dropdown de ordenamiento */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                {sortDirection === 'asc' ? <ArrowUpIcon className="h-4 w-4" /> : <ArrowDownIcon className="h-4 w-4" />}
                Ordenar por: {sortOptions.find(option => option.value === sortBy)?.label || sortBy}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {sortOptions.map(option => (
                <DropdownMenuItem 
                  key={option.value}
                  onClick={() => handleSortChange(option.value)} 
                  className="flex justify-between"
                >
                  {option.label} {sortBy === option.value && <CheckIcon className="h-4 w-4" />}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          
           {/* Dropdown de valores */}
           <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <FilterIcon className="h-4 w-4" />
                Valores {filterState.values.length > 0 && <Badge variant="secondary" className="h-5 px-1">!</Badge>}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              {sortBy && (
                <div className="p-2">
                  <h4 className="mb-2 text-sm font-medium">
                    {sortOptions.find(option => option.value === sortBy)?.label}
                  </h4>
                  <div className="flex flex-col gap-1 max-h-40 overflow-y-auto">
                    <DropdownMenuCheckboxItem 
                      checked={showAll}
                      onCheckedChange={(checked) => handleValueChange('Todos', checked)}
                    >
                      Todos
                    </DropdownMenuCheckboxItem>
                    {items
                      .map(item => getFieldValue(item, sortBy))
                      .filter((value, index, self) => self.indexOf(value) === index)
                      .map(value => (
                        <DropdownMenuCheckboxItem 
                          key={value}
                          checked={filterState.values.includes(value)}
                          onCheckedChange={(checked) => handleValueChange(value, checked)}
                        >
                          {value}
                        </DropdownMenuCheckboxItem>
                      ))
                    }
                  </div>
                </div>
              )}
              
              {!sortBy && (
                <div className="p-2 text-sm text-muted-foreground">
                  Selecciona una columna para filtrar
                </div>
              )}
              
              {filterState.values.length > 0 && (
                <>
                  <DropdownMenuSeparator />
                  <div className="p-2">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="w-full" 
                      onClick={() => handleValueChange('Todos', true)}
                    >
                      Limpiar valores
                    </Button>
                  </div>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

           {/* Dropdown de filtros */}
           <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <FilterIcon className="h-4 w-4" />
                Filtros {filterState.filters.length > 0 && <Badge variant="secondary" className="h-5 px-1">!</Badge>}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              {filterOptions.map((option) => {
                const hasFilters = filterState.filters.some(f => f.startsWith(option.value + ':'));
                return (
                  <div key={option.value} className="p-2">
                    <h4 className="mb-2 text-sm font-medium">{option.label}</h4>
                    <div className="flex flex-col gap-1">
                      <DropdownMenuCheckboxItem 
                        checked={!hasFilters}
                        onCheckedChange={() => {
                          // Remover todos los filtros de esta opción
                          setSelectedValues(prev => 
                            prev.filter(v => !v.startsWith(option.value + ':'))
                          );
                        }}
                      >
                        Todos
                      </DropdownMenuCheckboxItem>
                      {items
                        .map(item => getFieldValue(item, option.value))
                        .filter((value, index, self) => self.indexOf(value) === index)
                        .map(value => (
                          <DropdownMenuCheckboxItem 
                            key={value}
                            checked={filterState.filters.includes(`${option.value}:${value}`)}
                            onCheckedChange={(checked) => handleFilterChange(option, value, checked)}
                          >
                            {value}
                          </DropdownMenuCheckboxItem>
                        ))
                      }
                    </div>
                  </div>
                );
              })}
              
              {filterState.filters.length > 0 && (
                <>
                  <DropdownMenuSeparator />
                  <div className="p-2">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="w-full" 
                      onClick={() => {
                        // Limpiar todos los filtros
                        setSelectedValues(prev => 
                          prev.filter(v => !v.includes(':'))
                        );
                      }}
                    >
                      Limpiar filtros
                    </Button>
                  </div>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Botón de exportar */}
          {showExportButton && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onExport}
              className="flex items-center gap-2"
            >
              <DownloadIcon className="h-4 w-4" />
              Exportar
            </Button>
          )}
          
          {/* Botón de nuevo */}
          {showNewButton && (
            <Button 
              onClick={onNewItem}
              className="flex items-center gap-2"
            >
              <UserPlus className="h-4 w-4" />
              {newButtonLabel}
            </Button>
          )}
        </div>
      </div>

      {/* Contador de resultados */}
      <div className="text-sm text-gray-500">
        Mostrando {filteredCount} de {totalCount} {itemLabel}
        {(statusFilter !== null || roleFilter !== null || searchTerm || selectedValues.length > 0) && (
          <Button 
            variant="link" 
            className="p-0 h-auto text-sm ml-2" 
            onClick={() => {
              // Limpiar todos los filtros
              setSelectedValues(prev => 
                prev.filter(v => !v.includes(':') && handleValueChange('Todos', true)),
                
              );
            }}
          >
            Limpiar filtros
          </Button>
        )}
      </div>
    </div>
  );
};

export default SearchFilterBar; 