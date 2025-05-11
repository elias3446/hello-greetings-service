import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Info } from 'lucide-react';
import type { Reporte } from '@/types/tipos';

interface ReporteInfoProps {
  reporte: Reporte;
}

const ReporteInfo = ({ reporte }: ReporteInfoProps) => {
  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle>Información del Reporte</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <h3 className="text-xl font-semibold">{reporte.titulo}</h3>
        
        <p className="text-gray-600">{reporte.descripcion}</p>
        
        <div className="space-y-3">
          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-1">Categoría</h4>
            {reporte.categoria ? (
              <p className="font-medium">{reporte.categoria.nombre}</p>
            ) : (
              <p className="font-medium text-muted-foreground">Sin categoría</p>
            )}
          </div>
          
          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-1">Ubicación</h4>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-gray-500" />
              <p>{reporte.ubicacion.direccion}</p>
            </div>
          </div>
          
          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-1">Estado</h4>
            <Badge 
              style={{ 
                backgroundColor: reporte.estado.color, 
                color: '#fff' 
              }}
              className="px-3 py-1"
            >
              {reporte.estado.nombre}
            </Badge>
          </div>
          
          {reporte.prioridad && (
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-1">Prioridad</h4>
              <Badge 
                style={{ 
                  backgroundColor: reporte.prioridad.color, 
                  color: '#fff' 
                }}
                className="px-3 py-1"
              >
                {reporte.prioridad.nombre}
              </Badge>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ReporteInfo;
