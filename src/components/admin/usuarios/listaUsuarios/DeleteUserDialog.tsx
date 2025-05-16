import React from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface DeleteUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  usuarioAEliminar?: { nombre: string; apellido: string };
  usuariosAEliminar: any[];
  onConfirm: () => void;
  onCancel: () => void;
}

const DeleteUserDialog: React.FC<DeleteUserDialogProps> = ({
  open,
  onOpenChange,
  usuarioAEliminar,
  usuariosAEliminar,
  onConfirm,
  onCancel
}) => {
  const handleCancel = () => {
    onCancel();
    onOpenChange(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
          <AlertDialogDescription>
            {usuariosAEliminar.length > 0 ? (
              <>
                Esta acción no se puede deshacer. Se eliminarán permanentemente {usuariosAEliminar.length} usuarios seleccionados.
              </>
            ) : (
              <>
                Esta acción no se puede deshacer. Se eliminará permanentemente el usuario{' '}
                <span className="font-semibold">{usuarioAEliminar?.nombre} {usuarioAEliminar?.apellido}</span>.
              </>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={handleCancel}>Cancelar</AlertDialogCancel>
          <AlertDialogAction 
            onClick={onConfirm}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            Eliminar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteUserDialog; 