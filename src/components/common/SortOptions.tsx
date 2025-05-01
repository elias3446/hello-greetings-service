
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Check, ChevronDown, ArrowDownAZ, ArrowUpAZ } from 'lucide-react';

interface SortOption {
  id: string;
  label: string;
  direction?: 'asc' | 'desc';
}

interface SortOptionsProps {
  options: SortOption[];
  currentOptionId?: string;
  onSortChange: (option: SortOption) => void;
  buttonLabel?: string;
}

const SortOptions: React.FC<SortOptionsProps> = ({
  options,
  currentOptionId,
  onSortChange,
  buttonLabel = "Ordenar por"
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  // Encontrar la opción actual para mostrar en el botón
  const currentOption = currentOptionId 
    ? options.find(option => `${option.id}-${option.direction}` === currentOptionId) 
    : undefined;

  useEffect(() => {
    // Cerrar el dropdown cuando se hace clic fuera
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

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleOptionSelect = (option: SortOption) => {
    onSortChange(option);
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      <Button
        variant="outline"
        className="flex items-center gap-2"
        onClick={toggleDropdown}
      >
        {currentOption?.direction === 'asc' ? (
          <ArrowUpAZ className="h-4 w-4" />
        ) : currentOption?.direction === 'desc' ? (
          <ArrowDownAZ className="h-4 w-4" />
        ) : null}
        
        {buttonLabel}
        {currentOption && (
          <span className="text-sm font-medium text-muted-foreground ml-1">
            : {currentOption.label}
          </span>
        )}
        <ChevronDown className="h-4 w-4 ml-1" />
      </Button>

      {isOpen && (
        <div className="absolute right-0 z-50 mt-1 w-56 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="py-1 max-h-60 overflow-auto">
            {options.map((option) => (
              <button
                key={`${option.id}-${option.direction}`}
                className={`flex items-center w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${
                  `${option.id}-${option.direction}` === currentOptionId ? 'bg-gray-50 text-primary' : ''
                }`}
                onClick={() => handleOptionSelect(option)}
              >
                {`${option.id}-${option.direction}` === currentOptionId && (
                  <Check className="h-4 w-4 mr-2" />
                )}
                <span className={`${option.id}-${option.direction}` === currentOptionId ? 'ml-2' : 'ml-6'}>
                  {option.label}
                </span>
                
                {option.direction && (
                  <span className="ml-auto">
                    {option.direction === 'asc' ? (
                      <ArrowUpAZ className="h-4 w-4" />
                    ) : (
                      <ArrowDownAZ className="h-4 w-4" />
                    )}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SortOptions;
