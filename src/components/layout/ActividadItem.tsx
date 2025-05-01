
import { ActividadUsuario } from '@/types/tipos';
import { Clock } from 'lucide-react';

interface ActividadItemProps {
  actividad: ActividadUsuario;
}

const ActividadItem = ({ actividad }: ActividadItemProps) => {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-1">
        <Clock className="h-4 w-4 text-gray-400" />
      </div>
      <div className="flex-1">
        <p className="text-sm font-medium">{actividad.descripcion}</p>
        <p className="text-xs text-gray-500">
          {new Date(actividad.fecha).toLocaleDateString('es-ES', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })}
        </p>
        {actividad.detalles?.comentario && (
          <p className="text-xs italic mt-1 text-gray-600 bg-gray-50 p-1.5 rounded-sm">
            "{actividad.detalles.comentario}"
          </p>
        )}
      </div>
    </div>
  );
};

export default ActividadItem;
