import { Card, CardContent } from '@/components/ui/card';
import { formatearTipoEstado } from '@/constants/dashboard/dashboardGeneral/utils';
import { StatsCardsProps } from '@/props/dashboard/PropDashboardReportes';


const StatsCards = ({ contadores, getColorForEstadoTipo, getIconForEstadoTipo }: StatsCardsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {Object.keys(contadores).map((tipo) => (
        <Card key={tipo} className="border-l-4" style={{ borderLeftColor: getColorForEstadoTipo(tipo) }}>
          <CardContent className="flex justify-between items-center py-6">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                {formatearTipoEstado(tipo)}
              </p>
              <p className="text-3xl font-bold">{contadores[tipo]}</p>
            </div>
            {getIconForEstadoTipo(tipo)}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default StatsCards; 