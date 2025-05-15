import { Card, CardContent } from '@/components/ui/card';
import { FileText } from 'lucide-react';
import { Icons } from '@/components/Icons';
import { estadosReporte } from '@/data/estadosReporte';
import { StatsProps } from '@/props/index/PropsIndex';

const Stats = ({ totalReportes, reportesPorEstado }: StatsProps) => {
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
        const estadoOriginal = estadosReporte.find(e => e.id === estadoId);
        const Icono = Icons[estadoOriginal?.icono || 'default'];
        
        return (
          <Card key={estadoId}>
            <CardContent className="p-4 flex items-center gap-4">
              <div className="bg-gray-100 p-3 rounded-full">
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

export default Stats; 