import React from 'react';
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from '@/components/ui/alert-dialog';
import type { Reporte, Usuario } from '@/types/tipos';

interface DetalleReporteDeleteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  reporte: Reporte;
  onDelete: () => void;
}

const DetalleReporteDeleteDialog: React.FC<DetalleReporteDeleteDialogProps> = ({ open, onOpenChange, reporte, onDelete }) => (
  <AlertDialog open={open} onOpenChange={onOpenChange}>
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
        <AlertDialogDescription>
          Esta acción no se puede deshacer. Se eliminará permanentemente el reporte{' '}
          <span className="font-semibold">{reporte.titulo}</span>.
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel>Cancelar</AlertDialogCancel>
        <AlertDialogAction 
          onClick={onDelete}
          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
        >
          Eliminar
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
);

export default DetalleReporteDeleteDialog; 