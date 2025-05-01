
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Info, Clock, X } from 'lucide-react';
import type { Reporte } from '@/types/tipos';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface ReportePopupProps {
  reporte: Reporte | null;
  onClose: () => void;
}

const ReportePopup: React.FC<ReportePopupProps> = ({ reporte, onClose }) => {
  const navigate = useNavigate();

  if (!reporte) return null;

  const handleVerDetalles = () => {
    navigate(`/reportes/${reporte.id}`);
  };

  return (
    <div className="absolute top-4 right-4 z-[1000] w-full max-w-sm">
      <Card className="border shadow-lg">
        <CardHeader className="pb-2">
          <div className="flex justify-between">
            <CardTitle className="text-lg">{reporte.titulo}</CardTitle>
            <Button variant="ghost" size="sm" onClick={onClose} className="h-8 w-8 p-0">
              <span className="sr-only">Cerrar</span>
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex items-center gap-2 mt-1">
            <Badge 
              style={{ backgroundColor: reporte.estado.color, color: '#fff' }}
            >
              {reporte.estado.nombre}
            </Badge>
            {reporte.prioridad && (
              <Badge 
                style={{ backgroundColor: reporte.prioridad.color, color: '#fff' }}
              >
                {reporte.prioridad.nombre}
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <p>{reporte.descripcion}</p>
          
          <div className="flex items-start gap-2">
            <MapPin className="w-4 h-4 mt-0.5 text-gray-500" />
            <p>{reporte.ubicacion.direccion}</p>
          </div>
          
          <div className="flex items-start gap-2">
            <Info className="w-4 h-4 mt-0.5 text-gray-500" />
            <p>{reporte.categoria.nombre}</p>
          </div>
          
          <div className="flex items-start gap-2">
            <Clock className="w-4 h-4 mt-0.5 text-gray-500" />
            <p>
              {new Date(reporte.fechaCreacion).toLocaleDateString('es-ES', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
              })}
            </p>
          </div>
          
          <div className="flex justify-end">
            <Button variant="outline" size="sm" onClick={handleVerDetalles}>
              Ver detalles
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReportePopup;
