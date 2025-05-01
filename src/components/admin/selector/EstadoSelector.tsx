
import React, { useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getEstados } from '@/controller/estadoController';
import { updateReport } from '@/controller/reportController';
import { toast } from '@/components/ui/sonner';
import { EstadoReporte } from '@/types/tipos';

interface EstadoSelectorProps {
  ReporteId: string;
  currentEstadoId: string;
  onEstadoChange?: (newEstado: EstadoReporte) => void;
}

const EstadoSelector: React.FC<EstadoSelectorProps> = ({ 
  ReporteId, 
  currentEstadoId,
  onEstadoChange 
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
        throw new Error('Rol no encontrado');
      }
      
      // Update the user with the new Estado
      const updatedUser = updateReport(ReporteId, {
        estado  : selectedEstado // Changed from 'rol' to 'Estado' which is an array in the Usuario type
      });
      
      if (!updatedUser) {
        throw new Error('Error al actualizar el rol del usuario');
      }
      
      // Actualizar el estado local para reflejar el cambio inmediatamente
      setSelectedEstadoId(selectedEstadoId);
      
      // Call the onEstadoChange callback if provided
      if (onEstadoChange && selectedEstado) {
        onEstadoChange(selectedEstado);
      }
      
      toast.success('Rol actualizado correctamente');
    } catch (error) {
      console.error('Error al cambiar el rol:', error);
      toast.error('Error al actualizar el rol');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Select
      value={selectedEstadoId}
      onValueChange={handleEstadoChange}
      disabled={isLoading}
    >
      <SelectTrigger className="w-[180px] h-9">
        <SelectValue placeholder="Seleccionar rol">
          {currentEstado?.nombre || "Seleccionar rol"}
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
