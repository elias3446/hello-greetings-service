
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';

interface ReportTypeCardProps {
  tipo: string;
  cantidad: number;
  formatearTipoEstado: (tipo: string) => string;
  getIconForEstadoTipo: (tipo: string) => React.ReactNode;
  getColorForEstadoTipo: (tipo: string) => string;
}

const ReportTypeCard = ({ 
  tipo, 
  cantidad, 
  formatearTipoEstado, 
  getIconForEstadoTipo, 
  getColorForEstadoTipo 
}: ReportTypeCardProps) => {
  return (
    <Card 
      key={tipo} 
      className="border-l-4" 
      style={{ borderLeftColor: getColorForEstadoTipo(tipo) }}
    >
      <CardContent className="flex justify-between items-center py-6">
        <div>
          <p className="text-sm font-medium text-muted-foreground">
            {formatearTipoEstado(tipo)}
          </p>
          <p className="text-3xl font-bold">{cantidad}</p>
        </div>
        {getIconForEstadoTipo(tipo)}
      </CardContent>
    </Card>
  );
};

export default ReportTypeCard;
