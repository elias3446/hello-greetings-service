
import React from 'react';
import { Check, AlertTriangle, Clock, CheckCircle, XCircle, AlertCircle, FileText, Shield, Construction, Activity } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

interface IconSelectorProps {
  selectedIcon: string;
  onChange: (iconName: string) => void;
}

const IconSelector: React.FC<IconSelectorProps> = ({ selectedIcon, onChange }) => {
  // Lista de iconos disponibles con sus nombres
  const iconOptions = [
    { name: 'alert-triangle', Icon: AlertTriangle, label: 'Alerta' },
    { name: 'clock', Icon: Clock, label: 'Reloj' },
    { name: 'check-circle', Icon: CheckCircle, label: 'Completado' },
    { name: 'x-circle', Icon: XCircle, label: 'Cancelado' },
    { name: 'alert-circle', Icon: AlertCircle, label: 'Información' },
    { name: 'file-text', Icon: FileText, label: 'Documento' },
    { name: 'shield', Icon: Shield, label: 'Escudo' },
    { name: 'construction', Icon: Construction, label: 'Construcción' },
    { name: 'activity', Icon: Activity, label: 'Actividad' },
    { name: 'check', Icon: Check, label: 'Check' },
  ];

  return (
    <ScrollArea className="h-60 border rounded-md p-2">
      <div className="grid grid-cols-2 gap-2 p-1">
        {iconOptions.map((icon) => {
          const IconComponent = icon.Icon;
          const isSelected = selectedIcon === icon.name;
          
          return (
            <Button
              key={icon.name}
              type="button"
              variant={isSelected ? "default" : "outline"}
              className={`flex items-center justify-start gap-2 h-auto py-3 px-3 ${isSelected ? 'border-2 border-primary' : ''}`}
              onClick={() => onChange(icon.name)}
            >
              <IconComponent className="h-5 w-5" />
              <span className="text-sm">{icon.label}</span>
            </Button>
          );
        })}
      </div>
    </ScrollArea>
  );
};

export default IconSelector;
