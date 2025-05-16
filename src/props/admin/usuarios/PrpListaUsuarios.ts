export interface BulkActionsBarProps {
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

  export interface DeleteUserDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    usuarioAEliminar?: { nombre: string; apellido: string };
    usuariosAEliminar: any[];
    onConfirm: () => void;
    onCancel: () => void;
  }