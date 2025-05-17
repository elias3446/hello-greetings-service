import React from 'react';
import { Table, TableBody, TableHeader, TableRow, TableHead } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { LoadingRow, EmptyStateRow, UsuarioRow } from '@/components/admin/usuarios/UsuarioComponents';
import { Usuario } from '@/types/tipos';

interface UsuariosTableProps {
  isLoading: boolean;
  currentItems: Usuario[];
  isAllSelected: boolean;
  isSomeSelected: boolean;
  selectedUsers: Set<string>;
  onSelectAll: (checked: boolean) => void;
  onEstadoChange: (userId: string) => void;
  onDelete: (usuario: Usuario) => void;
  onSelect: (userId: string, checked: boolean) => void;
}

const UsuariosTable: React.FC<UsuariosTableProps> = ({
  isLoading,
  currentItems,
  isAllSelected,
  isSomeSelected,
  selectedUsers,
  onSelectAll,
  onEstadoChange,
  onDelete,
  onSelect,
}) => {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]">
              <Checkbox
                checked={isAllSelected}
                indeterminate={isSomeSelected && !isAllSelected}
                onCheckedChange={onSelectAll}
                aria-label="Seleccionar todos los usuarios"
              />
            </TableHead>
            <TableHead>Nombre</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Rol</TableHead>
            <TableHead>Fecha creación</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead>Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <LoadingRow />
          ) : currentItems.length === 0 ? (
            <EmptyStateRow />
          ) : (
            currentItems.map((usuario) => (
              <UsuarioRow
                key={usuario.id}
                usuario={usuario}
                onEstadoChange={onEstadoChange}
                onDelete={onDelete}
                onSelect={onSelect}
                isSelected={selectedUsers.has(usuario.id)}
                onRoleChange={async () => Promise.resolve()}
              />
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default UsuariosTable; 