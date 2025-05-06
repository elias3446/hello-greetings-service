import React from 'react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { DeleteDialogProps } from '@/types/reportes';

export const DeleteConfirmationDialog: React.FC<DeleteDialogProps> = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  reporte 
}) => (
  <AlertDialog open={isOpen} onOpenChange={onClose}>
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
        <AlertDialogDescription>
          Esta acción no se puede deshacer. Se eliminará permanentemente el reporte{' '}
          <span className="font-semibold">{reporte?.titulo}</span>.
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel>Cancelar</AlertDialogCancel>
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