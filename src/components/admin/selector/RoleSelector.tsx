import React, { useState, useEffect } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getRoles } from '@/controller/CRUD/roleController';
import { updateUser } from '@/controller/CRUD/user/userController';
import { toast } from '@/components/ui/sonner';
import { Usuario, Rol } from '@/types/tipos';
import { registrarCambioEstado } from '@/controller/CRUD/user/historialEstadosUsuario';

interface RoleSelectorProps {
  userId: string;
  currentRoleId: string;
  onRoleChange?: (userId: string, roleId: string) => Promise<void>;
  autoUpdate?: boolean;
}

const RoleSelector: React.FC<RoleSelectorProps> = ({ 
  userId, 
  currentRoleId,
  onRoleChange,
  autoUpdate = true
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRoleId, setSelectedRoleId] = useState(currentRoleId);
  const availableRoles = getRoles();
  const currentRole = availableRoles.find(role => role.id === selectedRoleId);

  useEffect(() => {
    setSelectedRoleId(currentRoleId);
  }, [currentRoleId]);

  const handleRoleChange = async (newRoleId: string) => {
    try {
      setIsLoading(true);
      
      const selectedRole = availableRoles.find(role => role.id === newRoleId);
      
      if (!selectedRole) {
        throw new Error('Rol no encontrado');
      }

      if (onRoleChange) {
        await onRoleChange(userId, newRoleId);
      } else if (autoUpdate) {
        // Update the user with the new role
        const updatedUser = updateUser(userId, {
          roles: [selectedRole]
        });
        
        if (!updatedUser) {
          throw new Error('Error al actualizar el rol del usuario');
        }

        // Registrar el cambio en el historial
        registrarCambioEstado(
          updatedUser,
          currentRole?.nombre || 'Sin rol',
          selectedRole.nombre,
          {
            id: '0',
            nombre: 'Sistema',
            apellido: '',
            email: 'sistema@example.com',
            estado: 'activo',
            tipo: 'usuario',
            intentosFallidos: 0,
            password: 'hashed_password',
            roles: [{
              id: '1',
              nombre: 'Administrador',
              descripcion: 'Rol con acceso total al sistema',
              color: '#FF0000',
              tipo: 'admin',
              fechaCreacion: new Date('2023-01-01'),
              activo: true
            }],
            fechaCreacion: new Date('2023-01-01'),
          },
          `Cambio de rol de usuario ${updatedUser.nombre} ${updatedUser.apellido}`,
          'cambio_rol'
        );
        
        // Update local state to reflect the change immediately
        setSelectedRoleId(newRoleId);
        toast.success('Rol actualizado correctamente');
      }
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
      disabled={isLoading}
    >
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Seleccionar rol">
          {currentRole ? currentRole.nombre : "Seleccionar rol"}
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
