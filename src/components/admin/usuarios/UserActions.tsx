import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Edit, Shield, CheckCircle, AlertTriangle } from 'lucide-react';
import RoleSelector from '@/components/admin/selector/RoleSelector';
import { Usuario } from '@/types/tipos';

interface UserActionsProps {
  usuario: Usuario;
  onRoleChange: (newRole: any) => Promise<boolean>;
  onEstadoChange: () => Promise<boolean>;
  onDelete: () => Promise<boolean>;
}

export const UserActions: React.FC<UserActionsProps> = ({
  usuario,
  onRoleChange,
  onEstadoChange,
  onDelete
}) => {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showRoleDialog, setShowRoleDialog] = useState(false);

  const handleRoleChange = async (newRole: any) => {
    const success = await onRoleChange(newRole);
    if (success) {
      setShowRoleDialog(false);
    }
  };

  return (
    <>
      <div className="space-y-4">
        <Button variant="outline" className="w-full justify-start" asChild>
          <Link to={`/admin/usuarios/${usuario.id}/editar`}>
            <Edit className="mr-2 h-4 w-4" />
            Editar usuario
          </Link>
        </Button>
        <Button
          variant="outline"
          className="w-full justify-start"
          onClick={() => setShowRoleDialog(true)}
          disabled={usuario?.estado === 'bloqueado'}
        >
          <Shield className="mr-2 h-4 w-4" />
          Cambiar rol
        </Button>
        <Button 
          variant={usuario.estado === 'activo' ? 'destructive' : 'default'}
          className={`w-full justify-start ${
            usuario.estado === 'bloqueado' ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          onClick={usuario.estado !== 'bloqueado' ? onEstadoChange : undefined}
          disabled={usuario.estado === 'bloqueado'}
        >
          <CheckCircle className="mr-2 h-4 w-4" />
          {usuario.estado === 'activo' ? 'Desactivar' : 
           usuario.estado === 'inactivo' ? 'Activar' : 
           'Usuario bloqueado'} usuario
        </Button>
        <Button 
          variant="outline" 
          className="w-full justify-start text-destructive hover:text-destructive"
          onClick={() => setShowDeleteDialog(true)}
        >
          <AlertTriangle className="mr-2 h-4 w-4" />
          Eliminar usuario
        </Button>
      </div>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Se eliminará permanentemente el usuario{' '}
              <span className="font-semibold">{usuario.nombre} {usuario.apellido}</span>.
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

      <AlertDialog open={showRoleDialog} onOpenChange={setShowRoleDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Asignar rol</AlertDialogTitle>
            <AlertDialogDescription>
              {usuario?.estado === 'bloqueado' ? (
                <div className="text-destructive">
                  No se puede cambiar el rol de un usuario bloqueado
                </div>
              ) : (
                `Selecciona el nuevo rol para el usuario ${usuario?.nombre} ${usuario?.apellido}`
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="py-4">
            <RoleSelector
              userId={usuario?.id || ''}
              currentRoleId={usuario?.roles?.[0]?.id || ''}
              onRoleChange={handleRoleChange}
            />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}; 