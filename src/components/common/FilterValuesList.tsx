
import React from 'react';
import { Check } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface FilterValuesListProps<T> {
  title: string;
  values: Array<T>;
  selectedValues: Array<T>;
  onValueToggle: (value: T) => void;
  getDisplayValue: (value: T) => string;
  getValueId?: (value: T) => string;
  showSelectAll?: boolean;
  onSelectAll?: () => void;
  onClearAll?: () => void;
}

function FilterValuesList<T>({
  title,
  values,
  selectedValues,
  onValueToggle,
  getDisplayValue,
  getValueId = (value) => String(value),
  showSelectAll = true,
  onSelectAll,
  onClearAll
}: FilterValuesListProps<T>) {
  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
          {showSelectAll && (
            <div className="flex gap-2">
              <Button 
                variant="ghost"
                size="sm" 
                onClick={onSelectAll} 
                className="text-xs h-7"
              >
                Seleccionar todos
              </Button>
              <Button 
                variant="ghost"
                size="sm" 
                onClick={onClearAll} 
                className="text-xs h-7"
              >
                Limpiar
              </Button>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <ScrollArea className="h-[200px] pr-4">
          <div className="space-y-1">
            {values.map((value) => {
              const valueId = getValueId(value);
              const display = getDisplayValue(value);
              const isSelected = selectedValues.some(
                (selected) => getValueId(selected) === valueId
              );
              
              return (
                <div 
                  key={valueId}
                  onClick={() => onValueToggle(value)}
                  className="flex items-center justify-between p-2 hover:bg-gray-100 rounded cursor-pointer"
                >
                  <span className="flex items-center gap-2 text-sm">
                    {display}
                  </span>
                  {isSelected && (
                    <Check className="h-4 w-4 text-primary" />
                  )}
                </div>
              );
            })}
          </div>
        </ScrollArea>
        
        {selectedValues.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            {selectedValues.map((value) => (
              <Badge 
                key={getValueId(value)} 
                variant="secondary"
                className="cursor-pointer"
                onClick={() => onValueToggle(value)}
              >
                {getDisplayValue(value)}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default FilterValuesList;
