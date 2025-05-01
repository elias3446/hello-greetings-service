
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ActivitySummaryCardProps {
  reportesActivos: number;
  estadisticasPorTipo: Record<string, number>;
  formatearTipoEstado: (tipo: string) => string;
}

const ActivitySummaryCard = ({ 
  reportesActivos, 
  estadisticasPorTipo,
  formatearTipoEstado
}: ActivitySummaryCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Resumen de Actividad</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <p>Reportes activos</p>
              <p className="font-medium">{reportesActivos}</p>
            </div>
            {/* Generar dinámicamente los elementos según los tipos de estado disponibles */}
            {Object.entries(estadisticasPorTipo).map(([tipo, cantidad]) => (
              <div key={tipo} className="flex items-center justify-between text-sm">
                <p>Reportes {formatearTipoEstado(tipo)}</p>
                <p className="font-medium">{cantidad}</p>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ActivitySummaryCard;
