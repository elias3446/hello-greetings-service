import React from 'react';
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel } from '@/components/ui/alert-dialog';
import UsuarioSelector from '@/components/admin/selector/UsuarioSelector';
import type { Reporte, Usuario } from '@/types/tipos';

interface DetalleReporteAssignDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  reporte: Reporte;
  onUsuarioChange: (usuario: Usuario) => void;
}

const DetalleReporteAssignDialog: React.FC<DetalleReporteAssignDialogProps> = ({ open, onOpenChange, reporte, onUsuarioChange }) => (
  <AlertDialog open={open} onOpenChange={onOpenChange}>
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Asignar usuario</AlertDialogTitle>
        <AlertDialogDescription>
          {reporte.asignadoA?.estado === 'bloqueado' ? (
            <div className="text-destructive">
              No se puede cambiar el usuario de un reporte bloqueado
            </div>
          ) : (
            `Selecciona el nuevo usuario para el reporte ${reporte.titulo}`
          )}
        </AlertDialogDescription>
      </AlertDialogHeader>
      <div className="py-4">
        <UsuarioSelector
          ReporteId={reporte.id}
          currentUsuarioId={reporte.asignadoA?.id || ''}
          onUsuarioChange={onUsuarioChange}
        />
      </div>
      <AlertDialogFooter>
        <AlertDialogCancel>Cancelar</AlertDialogCancel>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
);

export default DetalleReporteAssignDialog; 