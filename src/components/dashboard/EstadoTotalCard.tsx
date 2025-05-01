
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Activity } from 'lucide-react';

interface EstadoTotalCardProps {
  totalEstados: number;
}

const EstadoTotalCard = ({ totalEstados }: EstadoTotalCardProps) => {
  return (
    <Card className="border-l-4" style={{ borderLeftColor: '#ec4899' }}>
      <CardContent className="flex justify-between items-center py-6">
        <div>
          <p className="text-sm font-medium text-muted-foreground">Total de Estados</p>
          <p className="text-3xl font-bold">{totalEstados}</p>
        </div>
        <Activity className="h-8 w-8 text-[#ec4899]" />
      </CardContent>
    </Card>
  );
};

export default EstadoTotalCard;
