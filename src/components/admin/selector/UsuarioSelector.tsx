import React, { useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getUsers } from '@/controller/CRUD/userController';
import { updateReport } from '@/controller/CRUD/reportController';
import { toast } from '@/components/ui/sonner';
import {  Usuario} from '@/types/tipos';
import { Badge } from "@/components/ui/badge";

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
      
      if (selectedUsuarioId === "unassigned") {
        // Update the report to remove the assigned user
        const updatedReport = updateReport(ReporteId, {
          asignadoA: undefined
        });
        
        if (!updatedReport) {
          throw new Error('Error al actualizar el reporte');
        }
        
        setSelectedUsuarioId(selectedUsuarioId);
        toast.success('Reporte desasignado correctamente');
        return;
      }
      
      // Find the selected Usuario object
      const selectedUsuario = availableUsuario.find(Usuario => Usuario.id === selectedUsuarioId);
      
      if (!selectedUsuario) {
        throw new Error('Usuario no encontrado');
      }

      // Verificar si el usuario está bloqueado o inactivo
      if (selectedUsuario.estado === 'bloqueado' || selectedUsuario.estado === 'inactivo') {
        toast.error('No se puede asignar a un usuario bloqueado o inactivo');
        return;
      }
      
      // Update the report with the new user
      const updatedReport = updateReport(ReporteId, {
        asignadoA: selectedUsuario
      });
      
      if (!updatedReport) {
        throw new Error('Error al actualizar el reporte');
      }
      
      // Update local state to reflect the change immediately
      setSelectedUsuarioId(selectedUsuarioId);
      
      // Call the onUsuarioChange callback if provided
      if (onUsuarioChange && selectedUsuario) {
        onUsuarioChange(selectedUsuario);
      }
      
      toast.success('Reporte asignado correctamente');
    } catch (error) {
      console.error('Error al cambiar el usuario:', error);
      toast.error('Error al actualizar el reporte');
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
        <SelectValue placeholder="Seleccionar usuario">
          {currentUsuario ? (
            <div className="flex items-center gap-2">
              <span>{currentUsuario.nombre} {currentUsuario.apellido}</span>
              {currentUsuario.estado === 'bloqueado' && (
                <Badge variant="destructive">Bloqueado</Badge>
              )}
              {currentUsuario.estado === 'inactivo' && (
                <Badge variant="secondary">Inactivo</Badge>
              )}
            </div>
          ) : (
            "Seleccionar usuario"
          )}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="unassigned">Sin asignar</SelectItem>
        {availableUsuario
          .filter(usuario => usuario.estado === 'activo')
          .map((usuario) => (
            <SelectItem 
              key={usuario.id} 
              value={usuario.id}
            >
              {usuario.nombre} {usuario.apellido}
            </SelectItem>
          ))}
      </SelectContent>
    </Select>
  );
};

export default UsuarioSelector;
