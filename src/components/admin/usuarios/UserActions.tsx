import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Edit, Shield, CheckCircle, AlertTriangle } from 'lucide-react';
import RoleSelector from '@/components/admin/selector/RoleSelector';
import { Usuario } from '@/types/tipos';
import { actualizarRolUsuario } from '@/controller/controller/userRoleController';
import { toast } from '@/components/ui/sonner';
import { eliminarUsuario } from '@/controller/controller/userDeleteController';
import { useNavigate } from 'react-router-dom';

interface UserActionsProps {
  usuario: Usuario;
  onRoleChange: (userId: string, newRoleId: string) => Promise<void>;
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
  const [currentUsuario, setCurrentUsuario] = useState<Usuario>(usuario);
  const navigate = useNavigate();

  // Actualizar el usuario local cuando cambia el prop
  React.useEffect(() => {
    setCurrentUsuario(usuario);
  }, [usuario]);

  const handleRoleChange = async (userId: string, newRoleId: string) => {
    try {
      console.log('Iniciando cambio de rol:', { userId, newRoleId });
      const usuarioActualizado = actualizarRolUsuario(
        userId,
        newRoleId,
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
        `Cambio de rol para usuario ${currentUsuario.nombre} ${currentUsuario.apellido}`
      );

      console.log('Usuario actualizado:', usuarioActualizado);

      if (usuarioActualizado) {
        console.log('Actualizando estado local...');
        setCurrentUsuario(usuarioActualizado);
        console.log('Notificando al componente padre...');
        await onRoleChange(userId, newRoleId);
        console.log('Cerrando diálogo...');
        setShowRoleDialog(false);
        toast.success('Rol actualizado correctamente');
      } else {
        toast.error('Error al actualizar el rol');
      }
    } catch (error) {
      console.error('Error al cambiar el rol:', error);
      toast.error('Error al actualizar el rol');
    }
  };

  const confirmarEliminacion = async () => {
    try {
      if (!currentUsuario) return;

      const resultado = await eliminarUsuario(
        currentUsuario,
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
        }
      );

    } catch (error) {
      console.error('Error al eliminar el usuario:', error);
      toast.error('Error al eliminar el usuario');
    } finally {
      setShowDeleteDialog(false);
      setCurrentUsuario(null);
      navigate('/admin/usuarios');
    }
  };

  return (
    <>
      <div className="space-y-4">
        <Button variant="outline" className="w-full justify-start" asChild>
          <Link to={`/admin/usuarios/${currentUsuario.id}/editar`}>
            <Edit className="mr-2 h-4 w-4" />
            Editar usuario
          </Link>
        </Button>
        <Button
          variant="outline"
          className="w-full justify-start"
          onClick={() => setShowRoleDialog(true)}
          disabled={currentUsuario?.estado === 'bloqueado'}
        >
          <Shield className="mr-2 h-4 w-4" />
          Cambiar rol
        </Button>
        <Button 
          variant={currentUsuario.estado === 'activo' ? 'destructive' : 'default'}
          className={`w-full justify-start ${
            currentUsuario.estado === 'bloqueado' ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          onClick={currentUsuario.estado !== 'bloqueado' ? onEstadoChange : undefined}
          disabled={currentUsuario.estado === 'bloqueado'}
        >
          <CheckCircle className="mr-2 h-4 w-4" />
          {currentUsuario.estado === 'activo' ? 'Desactivar' : 
           currentUsuario.estado === 'inactivo' ? 'Activar' : 
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
              <span className="font-semibold">{currentUsuario.nombre} {currentUsuario.apellido}</span>.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmarEliminacion}
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
              {currentUsuario?.estado === 'bloqueado' ? (
                <div className="text-destructive">
                  No se puede cambiar el rol de un usuario bloqueado
                </div>
              ) : (
                `Selecciona el nuevo rol para el usuario ${currentUsuario?.nombre} ${currentUsuario?.apellido}`
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="py-4">
            <RoleSelector
              userId={currentUsuario?.id || ''}
              currentRoleId={currentUsuario?.roles?.[0]?.id || ''}
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