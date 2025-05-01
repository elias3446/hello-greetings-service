
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { MapPin, Info, X } from 'lucide-react';
import type { Reporte } from '@/types/tipos';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetClose } from '@/components/ui/sheet';
import { useNavigate } from 'react-router-dom';

interface ReporteSidebarProps {
  reporte: Reporte | null;
  open: boolean;
  onClose: () => void;
}

const ReporteSidebar: React.FC<ReporteSidebarProps> = ({ reporte, open, onClose }) => {
  const navigate = useNavigate();

  if (!reporte) return null;

  const handleVerDetalles = () => {
    navigate(`/reportes/${reporte.id}`);
  };

  return (
    <Sheet open={open} onOpenChange={(isOpen) => {
      if (!isOpen) onClose();
    }}>
      <SheetContent className="w-[350px] sm:w-[450px] overflow-auto">
        <SheetHeader className="pb-4">
          <div className="flex justify-between items-start">
            <SheetTitle className="text-2xl font-bold">{reporte.titulo}</SheetTitle>
            <SheetClose asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 p-0">
                <X className="h-4 w-4" />
              </Button>
            </SheetClose>
          </div>
        </SheetHeader>
        
        <div className="space-y-6">
          <p className="text-muted-foreground">{reporte.descripcion}</p>
          
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Badge 
                style={{ backgroundColor: reporte.estado.color, color: '#fff' }}
                className="px-3 py-0.5 text-sm"
              >
                {reporte.estado.nombre}
              </Badge>
              {reporte.prioridad && (
                <Badge 
                  style={{ backgroundColor: reporte.prioridad.color, color: '#fff' }}
                  className="px-3 py-0.5 text-sm"
                >
                  {reporte.prioridad.nombre}
                </Badge>
              )}
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Categoría</h3>
              <div className="flex items-center gap-2 mt-1">
                <Info className="w-4 h-4 text-gray-500" />
                <p className="font-medium">{reporte.categoria.nombre}</p>
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Ubicación</h3>
              <div className="flex items-center gap-2 mt-1">
                <MapPin className="w-4 h-4 text-gray-500" />
                <p className="font-medium">{reporte.ubicacion.direccion}</p>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end pt-4">
            <Button onClick={handleVerDetalles}>
              Ver detalles completos
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default ReporteSidebar;
