
import React, { useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getUsers } from '@/controller/userController';
import { updateReport } from '@/controller/reportController';
import { toast } from '@/components/ui/sonner';
import {  Usuario} from '@/types/tipos';

interface UsuarioSelectorProps {
  ReporteId: string;
  currentUsuarioId: string;
  onUsuarioChange?: (newUsuario: Usuario) => void;
}

const UsuarioSelector: React.FC<UsuarioSelectorProps> = ({ 
  ReporteId, 
  currentUsuarioId,
  onUsuarioChange 
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedUsuarioId, setSelectedUsuarioId] = useState(currentUsuarioId);
  const availableUsuario = getUsers();
  const currentUsuario = availableUsuario.find(Usuario => Usuario.id === selectedUsuarioId);

  const handleUsuarioChange = async (selectedUsuarioId: string) => {
    try {
      setIsLoading(true);
      
      // Find the selected Usuario object
      const selectedUsuario = availableUsuario.find(Usuario => Usuario.id === selectedUsuarioId);
      
      if (!selectedUsuario) {
        throw new Error('Rol no encontrado');
      }
      
      // Update the user with the new Usuario
      const updatedUser = updateReport(ReporteId, {
        asignadoA  : selectedUsuario // Changed from 'rol' to 'Usuario' which is an array in the Usuario type
      });
      
      if (!updatedUser) {
        throw new Error('Error al actualizar el rol del usuario');
      }
      
      // Actualizar el Usuario local para reflejar el cambio inmediatamente
      setSelectedUsuarioId(selectedUsuarioId);
      
      // Call the onUsuarioChange callback if provided
      if (onUsuarioChange && selectedUsuario) {
        onUsuarioChange(selectedUsuario);
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
      value={selectedUsuarioId}
      onValueChange={handleUsuarioChange}
      disabled={isLoading}
    >
      <SelectTrigger className="w-[180px] h-9">
        <SelectValue placeholder="Sin asignar">
          {currentUsuario?.nombre + " " + currentUsuario?.apellido || "Sin asignar"}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {availableUsuario.map((Usuario) => (
          <SelectItem 
            key={Usuario.id} 
            value={Usuario.id}
          >
            {Usuario.nombre + " " + Usuario.apellido}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default UsuarioSelector;
