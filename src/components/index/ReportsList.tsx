import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight } from 'lucide-react';
import { ReportsListProps } from '@/props/index/PropsIndex';

const ReportsList = ({ reportesPorEstado }: ReportsListProps) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {Object.entries(reportesPorEstado).map(([estadoId, estado]) => {
        return (
          <Card key={estadoId} className="overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between bg-muted/50 py-3">
              <div>
                <CardTitle className="text-lg">Reportes {estado.nombre}</CardTitle>
                <CardDescription>Últimos reportes con estado {estado.nombre.toLowerCase()}</CardDescription>
              </div>
              <Badge 
                variant="outline" 
                className="text-xs py-1" 
                style={{ backgroundColor: `${estado.color}20`, color: estado.color, borderColor: estado.color }}
              >
                {estado.reportes.length} reportes
              </Badge>
            </CardHeader>
            
            <CardContent className="p-0">
              <div className="divide-y">
                {estado.reportes.slice(0, 5).map((reporte) => (
                  <Link
                    key={reporte.id}
                    to={`/reportes/${reporte.id}`}
                    className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors"
                  >
                    <div>
                      <p className="font-medium">{reporte.titulo}</p>
                      <p className="text-sm text-muted-foreground">
                        {reporte.ubicacion.direccion}
                      </p>
                    </div>
                    <Button variant="ghost" size="sm" className="gap-1">
                      Ver <ArrowRight size={16} />
                    </Button>
                  </Link>
                ))}
                
                {estado.reportes.length === 0 && (
                  <div className="p-6 text-center">
                    <p className="text-muted-foreground">No hay reportes {estado.nombre.toLowerCase()}</p>
                  </div>
                )}
              </div>
            </CardContent>

            {estado.reportes.length > 5 && (
              <div className="p-4 border-t bg-muted/20">
                <Button asChild variant="ghost" className="w-full flex gap-1 justify-center">
                  <Link to="/reportes">Ver todos los reportes {estado.nombre.toLowerCase()}</Link>
                </Button>
              </div>
            )}
          </Card>
        );
      })}
    </div>
  );
};

export default ReportsList; 