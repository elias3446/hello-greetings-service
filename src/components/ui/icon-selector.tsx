import React from 'react';
import { icons, iconNames } from '@/data/icons';
import { Input } from './input';
import { ScrollArea } from './scroll-area';
import { cn } from '@/lib/utils';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface IconSelectorProps {
  value?: string;
  onChange: (value: string) => void;
  className?: string;
}

export function IconSelector({ value, onChange, className }: IconSelectorProps) {
  const [search, setSearch] = React.useState('');
  const [isOpen, setIsOpen] = React.useState(false);

  const filteredIcons = React.useMemo(() => {
    if (!search) return iconNames;
    return iconNames.filter(icon => 
      icon.label.toLowerCase().includes(search.toLowerCase())
    );
  }, [search]);

  const selectedIcon = value ? icons[value as keyof typeof icons] : null;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <div 
          className={cn(
            "flex items-center gap-2 p-2 border rounded-md cursor-pointer hover:bg-accent",
            className
          )}
        >
          {selectedIcon ? (
            React.createElement(selectedIcon, { className: "w-5 h-5" })
          ) : (
            <div className="w-5 h-5" />
          )}
          <span className="text-sm">
            {value ? iconNames.find(icon => icon.value === value)?.label : 'Seleccionar icono'}
          </span>
        </div>
      </DialogTrigger>
      <DialogContent className="max-w-[700px]">
        <DialogHeader>
          <DialogTitle>Seleccionar Icono</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col h-[calc(100vh-12rem)] sm:h-[calc(100vh-16rem)]">
          <div className="p-4 pb-0">
            <Input
              placeholder="Buscar icono..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="mb-4"
            />
          </div>
          <ScrollArea className="flex-1 px-4">
            <div className="grid grid-cols-8 gap-4 p-2">
              {filteredIcons.map((icon) => {
                const IconComponent = icons[icon.label as keyof typeof icons];
                if (!IconComponent) return null;
                
                return (
                  <button
                    key={icon.value}
                    className={cn(
                      "flex flex-col items-center justify-center p-3 rounded-md hover:bg-accent transition-colors",
                      value === icon.value && "bg-accent"
                    )}
                    onClick={() => {
                      onChange(icon.value);
                      setIsOpen(false);
                    }}
                  >
                    <div className="w-8 h-8 flex items-center justify-center mb-2">
                      {React.createElement(IconComponent, { className: "w-6 h-6" })}
                    </div>
                    <span className="text-xs text-center text-muted-foreground">
                      {icon.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
} 