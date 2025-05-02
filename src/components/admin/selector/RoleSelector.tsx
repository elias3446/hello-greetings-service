import React, { useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getRoles } from '@/controller/CRUD/roleController';
import { updateUser, getUserById } from '@/controller/CRUD/userController';
import { toast } from '@/components/ui/sonner';
import { Rol } from '@/types/tipos';

interface RoleSelectorProps {
  userId: string;
  currentRoleId: string;
  onRoleChange?: (newRole: Rol) => void;
}

const RoleSelector: React.FC<RoleSelectorProps> = ({ 
  userId, 
  currentRoleId,
  onRoleChange 
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRoleId, setSelectedRoleId] = useState(currentRoleId);
  const availableRoles = getRoles();
  const currentRole = availableRoles.find(role => role.id === selectedRoleId);
  const usuario = getUserById(userId);
  const isUsuarioBloqueado = usuario?.estado === 'bloqueado';

  const handleRoleChange = async (selectedRoleId: string) => {
    try {
      setIsLoading(true);
      
      // Verificar si el usuario está bloqueado
      if (isUsuarioBloqueado) {
        toast.error('No se puede cambiar el rol de un usuario bloqueado');
        return;
      }
      
      // Find the selected role object
      const selectedRole = availableRoles.find(role => role.id === selectedRoleId);
      
      if (!selectedRole) {
        throw new Error('Rol no encontrado');
      }
      
      // Update the user with the new role
      const updatedUser = updateUser(userId, {
        roles: [selectedRole]
      });
      
      if (!updatedUser) {
        throw new Error('Error al actualizar el rol del usuario');
      }
      
      // Actualizar el estado local para reflejar el cambio inmediatamente
      setSelectedRoleId(selectedRoleId);
      
      // Call the onRoleChange callback if provided
      if (onRoleChange && selectedRole) {
        onRoleChange(selectedRole);
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
      value={selectedRoleId}
      onValueChange={handleRoleChange}
      disabled={isLoading || isUsuarioBloqueado}
    >
      <SelectTrigger className="w-[180px] h-9">
        <SelectValue placeholder="Seleccionar rol">
          {currentRole?.nombre || "Seleccionar rol"}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {availableRoles.map((role) => (
          <SelectItem 
            key={role.id} 
            value={role.id}
          >
            {role.nombre}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default RoleSelector;
