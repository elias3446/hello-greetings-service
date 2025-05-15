import React, { useState, useEffect, useMemo } from 'react';
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

interface FilterOption {
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
  onCurrentFieldChange: (value: string | undefined) => void;
  onFilterChange: (values: string[]) => void;
  onExport: () => void;
  onNewItem: () => void;
  items: Record<string, any>[];
  getFieldValue: (item: any, field: string) => string;
  showNewButton?: boolean;
  newButtonLabel?: string;
  showExportButton?: boolean;
  sortOptions: SortOption[];
  filteredCount?: number;
  totalCount?: number;
  itemLabel?: string;
  filterOptions: FilterOption[];
  searchPlaceholder?: string;
  initialFilters?: string[];
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
  onCurrentFieldChange,
  onFilterChange,
  onExport,
  onNewItem,
  items,
  getFieldValue,
  showNewButton = true,
  newButtonLabel = 'Nuevo',
  showExportButton = true,
  sortOptions,
  filteredCount = items.length,
  totalCount = items.length,
  itemLabel = 'elementos',
  filterOptions,
  searchPlaceholder = 'Buscar...',
  initialFilters = []
}) => {
  const [selectedValues, setSelectedValues] = useState<string[]>(initialFilters);
  const [showAll, setShowAll] = useState(true);
  const [filterState, setFilterState] = useState({ values: [] as string[], filters: initialFilters });

  // Separar valores y filtros
  useEffect(() => {
    const values = selectedValues.filter(v => !v.includes(':'));
    const filters = selectedValues.filter(v => v.includes(':'));
    setFilterState({ values, filters });
    onFilterChange(selectedValues);
  }, [selectedValues]);

  useEffect(() => {
    if (initialFilters.length > 0) {
      setSelectedValues(initialFilters);
      setFilterState(prev => ({ ...prev, filters: initialFilters }));
    }
  }, [initialFilters]);

  const uniqueValues = useMemo(() => {
    if (!sortBy) return [];
    const values = items.map(item => getFieldValue(item, sortBy));
    return Array.from(new Set(values));
  }, [items, sortBy]);

  const getFilterValues = (field: string) => {
    const values = items.map(item => getFieldValue(item, field));
    return Array.from(new Set(values));
  };

  const handleValueChange = (value: string, checked: boolean) => {
    if (!sortBy) return;
    setSelectedValues(prev => {
      const currentFilters = prev.filter(v => v.includes(':'));
      if (value === 'Todos') {
        setShowAll(true);
        return currentFilters;
      } else {
        setShowAll(false);
        return checked
          ? [...currentFilters, value]
          : prev.filter(v => v !== value && !v.includes(':'));
      }
    });
  };

  const handleFilterChange = (option: FilterOption, value: string, checked: boolean) => {
    setSelectedValues(prev => {
      const currentValues = prev.filter(v => !v.startsWith(option.value + ':'));
      return checked
        ? [...currentValues, `${option.value}:${value}`]
        : prev.filter(v => v !== `${option.value}:${value}`);
    });
  };

  const clearAll = () => {
    setSelectedValues([]);
    setFilterState({ values: [], filters: [] });
    setShowAll(true);
    onSearchChange('');
    onStatusFilterChange(null);
    onRoleFilterChange(null);
    onSortByChange('nombre');
    onSortDirectionChange();
    onCurrentFieldChange(undefined);
  };

  const handleSortChange = (value: string) => {
    onSortByChange(value);
    onSortDirectionChange();
    onCurrentFieldChange(value);
    setSelectedValues(prev => prev.filter(v => v.includes(':')));
  };

  return (
    <div className="space-y-4">
      {/* Top Controls */}
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        {/* Search Input */}
        <div className="relative w-full sm:w-80">
          <Input
            placeholder={searchPlaceholder}
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
          />
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Sort Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                {sortDirection === 'asc' ? <ArrowUpIcon className="h-4 w-4" /> : <ArrowDownIcon className="h-4 w-4" />}
                Ordenar por: {sortOptions.find(option => option.value === sortBy)?.label}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {sortOptions.map(option => (
                <DropdownMenuItem key={option.value} onClick={() => handleSortChange(option.value)}>
                  {option.label} {sortBy === option.value && <CheckIcon className="h-4 w-4 ml-auto" />}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Value Filter */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <FilterIcon className="h-4 w-4" />
                Valores {filterState.values.length > 0 && <Badge variant="secondary">!</Badge>}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              {sortBy ? (
                <div className="p-2">
                  <h4 className="mb-2 text-sm font-medium">{sortOptions.find(o => o.value === sortBy)?.label}</h4>
                  <div className="max-h-40 overflow-y-auto space-y-1">
                    <DropdownMenuCheckboxItem
                      checked={showAll}
                      onCheckedChange={(checked) => handleValueChange('Todos', checked)}
                    >
                      Todos
                    </DropdownMenuCheckboxItem>
                    {uniqueValues.map(value => (
                      <DropdownMenuCheckboxItem
                        key={value}
                        checked={selectedValues.includes(value)}
                        onCheckedChange={(checked) => handleValueChange(value, checked)}
                      >
                        {value}
                      </DropdownMenuCheckboxItem>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="p-2 text-sm text-muted-foreground">Selecciona una columna para filtrar</div>
              )}
              {filterState.values.length > 0 && (
                <>
                  <DropdownMenuSeparator />
                  <div className="p-2">
                    <Button variant="ghost" size="sm" className="w-full" onClick={() => handleValueChange('Todos', true)}>
                      Limpiar valores
                    </Button>
                  </div>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Filter Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <FilterIcon className="h-4 w-4" />
                Filtros {filterState.filters.length > 0 && <Badge variant="secondary">!</Badge>}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {filterOptions.map((option) => {
                const filterValues = getFilterValues(option.value);
                const selectedValue = filterState.filters.find(f => f.startsWith(option.value + ':'))?.split(':')[1];

                return (
                  <div key={option.value} className="p-2">
                    <h4 className="mb-2 text-sm font-medium">{option.label}</h4>
                    <div className="flex flex-col gap-1">
                      <DropdownMenuCheckboxItem
                        checked={!selectedValue}
                        onCheckedChange={() =>
                          setSelectedValues(prev => prev.filter(v => !v.startsWith(option.value + ':')))
                        }
                      >
                        Todos
                      </DropdownMenuCheckboxItem>
                      {filterValues.map(value => (
                        <DropdownMenuCheckboxItem
                          key={value}
                          checked={selectedValue === value}
                          onCheckedChange={(checked) => handleFilterChange(option, value, checked)}
                        >
                          {value}
                        </DropdownMenuCheckboxItem>
                      ))}
                    </div>
                  </div>
                );
              })}
              {filterState.filters.length > 0 && (
                <>
                  <DropdownMenuSeparator />
                  <div className="p-2">
                    <Button variant="ghost" size="sm" className="w-full" onClick={clearAll}>
                      Limpiar filtros
                    </Button>
                  </div>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          {showExportButton && (
            <Button variant="outline" size="sm" onClick={onExport} className="flex items-center gap-2">
              <DownloadIcon className="h-4 w-4" />
              Exportar
            </Button>
          )}

          {showNewButton && (
            <Button onClick={onNewItem} className="flex items-center gap-2">
              <UserPlus className="h-4 w-4" />
              {newButtonLabel}
            </Button>
          )}
        </div>
      </div>

      {/* Result Count */}
      <div className="text-sm text-gray-500">
        Mostrando {filteredCount} de {totalCount} {itemLabel}
        {(statusFilter || roleFilter || searchTerm || selectedValues.length > 0) && (
          <Button variant="link" className="p-0 h-auto text-sm ml-2" onClick={clearAll}>
            Limpiar filtros
          </Button>
        )}
      </div>
    </div>
  );
};

export default SearchFilterBar;
