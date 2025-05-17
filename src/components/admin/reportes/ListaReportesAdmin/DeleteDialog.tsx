import React from 'react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { DeleteDialogProps } from '@/props/admin/report/PropListaReportesAdmin';

const DeleteDialog: React.FC<DeleteDialogProps> = ({
  showDeleteDialog,
  reporteAEliminar,
  reportesAEliminar,
  onOpenChange,
  onConfirm
}) => {
  return (
    <AlertDialog open={showDeleteDialog} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
          <AlertDialogDescription>
            {reportesAEliminar.length > 0 ? (
              <>
                Esta acción no se puede deshacer. Se eliminarán permanentemente {reportesAEliminar.length} reportes activos seleccionados.
              </>
            ) : (
              <>
                Esta acción no se puede deshacer. Se eliminará permanentemente el reporte{' '}
                <span className="font-semibold">{reporteAEliminar?.titulo}</span>.
              </>
            )}
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
};

export default DeleteDialog; 