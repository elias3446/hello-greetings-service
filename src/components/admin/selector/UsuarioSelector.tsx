import React, { useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getUsers } from '@/controller/CRUD/user/userController';
import { Usuario } from '@/types/tipos';
import { Badge } from "@/components/ui/badge";

interface UsuarioSelectorProps {
  ReporteId: string;
  currentUsuarioId: string;
  onUsuarioChange?: (newUsuario: Usuario | undefined) => void;
  disabled?: boolean;
}

const UsuarioSelector: React.FC<UsuarioSelectorProps> = ({ 
  ReporteId, 
  currentUsuarioId,
  onUsuarioChange,
  disabled = false
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedUsuarioId, setSelectedUsuarioId] = useState(currentUsuarioId);
  const availableUsuario = getUsers();
  const currentUsuario = availableUsuario.find(Usuario => Usuario.id === selectedUsuarioId);

  const handleUsuarioChange = async (selectedUsuarioId: string) => {
    try {
      setIsLoading(true);
      
      if (selectedUsuarioId === "unassigned") {
        // Call the onUsuarioChange callback with undefined to unassign
        if (onUsuarioChange) {
          await onUsuarioChange(undefined);
        }
        setSelectedUsuarioId(selectedUsuarioId);
        return;
      }
      
      // Find the selected Usuario object
      const selectedUsuario = availableUsuario.find(Usuario => Usuario.id === selectedUsuarioId);
      
      if (!selectedUsuario) {
        throw new Error('Usuario no encontrado');
      }

      // Verificar si el usuario está bloqueado o inactivo
      if (selectedUsuario.estado === 'bloqueado' || selectedUsuario.estado === 'inactivo') {
        throw new Error('No se puede asignar a un usuario bloqueado o inactivo');
      }
      
      // Call the onUsuarioChange callback if provided
      if (onUsuarioChange) {
        await onUsuarioChange(selectedUsuario);
      }
      
      // Actualizar el usuario local para reflejar el cambio inmediatamente
      setSelectedUsuarioId(selectedUsuarioId);
      
    } catch (error) {
      console.error('Error al cambiar el usuario:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Select
      value={selectedUsuarioId}
      onValueChange={handleUsuarioChange}
      disabled={isLoading || disabled}
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
