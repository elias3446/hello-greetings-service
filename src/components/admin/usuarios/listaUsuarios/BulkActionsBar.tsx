import React from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import RoleSelector from '@/components/admin/selector/RoleSelector';

interface BulkActionsBarProps {
  selectedUsers: Set<string>;
  selectedRoleId: string;
  selectedEstado: 'activo' | 'inactivo';
  onRoleChange: (userId: string, roleId: string) => Promise<void>;
  onEstadoChange: (value: 'activo' | 'inactivo') => void;
  onBulkRoleUpdate: () => void;
  onBulkEstadoUpdate: () => void;
  onBulkDelete: () => void;
  onCancel: () => void;
}

const BulkActionsBar: React.FC<BulkActionsBarProps> = ({
  selectedUsers,
  selectedRoleId,
  selectedEstado,
  onRoleChange,
  onEstadoChange,
  onBulkRoleUpdate,
  onBulkEstadoUpdate,
  onBulkDelete,
  onCancel
}) => {
  return (
    <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-md border">
      <div className="flex-1">
        <span className="text-sm font-medium text-gray-700">
          {selectedUsers.size} {selectedUsers.size === 1 ? 'usuario seleccionado' : 'usuarios seleccionados'}
        </span>
      </div>
      <div className="flex items-center gap-4">
        <div className="w-[200px]">
          <RoleSelector
            userId="bulk-update"
            currentRoleId={selectedRoleId}
            onRoleChange={onRoleChange}
            autoUpdate={false}
          />
        </div>
        <Button
          onClick={onBulkRoleUpdate}
          disabled={!selectedRoleId}
          variant="default"
        >
          Actualizar Roles
        </Button>
        <div className="w-[200px]">
          <Select
            value={selectedEstado}
            onValueChange={onEstadoChange}
          >
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="activo">Activo</SelectItem>
              <SelectItem value="inactivo">Inactivo</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button
          onClick={onBulkEstadoUpdate}
          variant="default"
        >
          Actualizar Estados
        </Button>
        <Button
          onClick={onBulkDelete}
          variant="destructive"
        >
          Eliminar Seleccionados
        </Button>
        <Button
          onClick={onCancel}
          variant="outline"
        >
          Cancelar
        </Button>
      </div>
    </div>
  );
};

export default BulkActionsBar; 