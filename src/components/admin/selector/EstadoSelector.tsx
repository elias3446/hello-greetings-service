import React, { useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getEstados } from '@/controller/CRUD/estado/estadoController';
import { EstadoReporte } from '@/types/tipos';

interface EstadoSelectorProps {
  ReporteId: string;
  currentEstadoId: string;
  onEstadoChange?: (newEstado: EstadoReporte) => void;
  disabled?: boolean;
}

const EstadoSelector: React.FC<EstadoSelectorProps> = ({ 
  ReporteId, 
  currentEstadoId,
  onEstadoChange,
  disabled = false
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedEstadoId, setSelectedEstadoId] = useState(currentEstadoId);
  const availableEstado = getEstados();
  const currentEstado = availableEstado.find(Estado => Estado.id === selectedEstadoId);

  const handleEstadoChange = async (selectedEstadoId: string) => {
    try {
      setIsLoading(true);
      
      // Find the selected Estado object
      const selectedEstado = availableEstado.find(Estado => Estado.id === selectedEstadoId);
      
      if (!selectedEstado) {
        throw new Error('Estado no encontrado');
      }
      
      // Call the onEstadoChange callback if provided
      if (onEstadoChange) {
        await onEstadoChange(selectedEstado);
      }
      
      // Actualizar el estado local para reflejar el cambio inmediatamente
      setSelectedEstadoId(selectedEstadoId);
      
    } catch (error) {
      console.error('Error al cambiar el estado:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Select
      value={selectedEstadoId}
      onValueChange={handleEstadoChange}
      disabled={isLoading || disabled}
    >
      <SelectTrigger className="w-[180px] h-9">
        <SelectValue placeholder="Seleccionar estado">
          {currentEstado?.nombre || "Seleccionar estado"}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {availableEstado.map((Estado) => (
          <SelectItem 
            key={Estado.id} 
            value={Estado.id}
          >
            {Estado.nombre}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default EstadoSelector;
