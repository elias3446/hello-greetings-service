import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FileText } from 'lucide-react';
import { Reporte, Usuario } from '@/types/tipos';

interface UserReportsProps {
  reportes: Reporte[];
  onAsignarReporte: (datosActualizados: Partial<Usuario>) => boolean;
}

export const UserReports: React.FC<UserReportsProps> = ({ reportes, onAsignarReporte }) => {
  const handleAsignarReporte = (reporteId: string) => {
    onAsignarReporte({ id: reporteId });
  };

  return (
    <Card className="bg-muted/30">
      <CardContent className="pt-6">
        {reportes.length > 0 ? (
          <div className="space-y-4">
            {reportes.map((reporte) => (
              <div key={reporte.id} className="flex items-start gap-4 p-4 rounded-lg border hover:bg-muted/50 transition-colors">
                <div className="flex-shrink-0">
                  <FileText className="h-5 w-5 text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <Link 
                    to={`/admin/reportes/${reporte.id}`}
                    className="text-sm font-medium hover:underline"
                  >
                    {reporte.titulo}
                  </Link>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge 
                      variant="outline" 
                      style={{ backgroundColor: reporte.estado.color, color: 'white' }}
                    >
                      {reporte.estado.nombre}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {new Date(reporte.fechaCreacion).toLocaleDateString('es-ES', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </span>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleAsignarReporte(reporte.id)}
                >
                  Asignar
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center p-4">
            <FileText className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
            <p className="text-muted-foreground">No hay reportes asignados</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}; 