import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { FileText } from 'lucide-react';
import { getIconoInfo, getEstadoOriginal } from './helpers';
import { Reporte } from '@/types/tipos';

interface StatsCardsProps {
  totalReportes: number;
  reportesPorEstado: {
    [key: string]: {
      nombre: string;
      tipo: string;
      color: string;
      reportes: Reporte[];
    }
  };
}

const StatsCards: React.FC<StatsCardsProps> = ({ totalReportes, reportesPorEstado }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
      <Card>
        <CardContent className="p-4 flex items-center gap-4">
          <div className="bg-blue-100 p-3 rounded-full">
            <FileText className="h-5 w-5 text-blue-700" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Total Reportes</p>
            <p className="text-2xl font-bold">{totalReportes}</p>
          </div>
        </CardContent>
      </Card>

      {Object.entries(reportesPorEstado).map(([estadoId, estado]) => {
        const estadoOriginal = getEstadoOriginal(estadoId);
        const tipo = estadoOriginal?.nombre.toLowerCase().replace(/ /g, '_') || 'default';
        
        const iconoInfo = getIconoInfo(tipo);
        const Icono = iconoInfo.icono;
        const colorFondo = iconoInfo.color;
        
        return (
          <Card key={estadoId}>
            <CardContent className="p-4 flex items-center gap-4">
              <div className={`${colorFondo} p-3 rounded-full`}>
                <Icono className="h-5 w-5" style={{ color: estado.color }} />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Reportes {estado.nombre}</p>
                <p className="text-2xl font-bold">{estado.reportes.length}</p>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default StatsCards;
