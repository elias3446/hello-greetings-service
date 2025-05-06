import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Edit, X, Mail } from 'lucide-react';
import { FormHeaderProps, UserProfileProps } from '@/types/user';

export const FormHeader = ({ modo, handleCancel, handleSubmit, isSubmitting }: FormHeaderProps) => (
  <div className="flex items-center justify-between">
    <div className="space-y-1">
      <div className="text-sm text-muted-foreground flex items-center">
        <Link to="/admin/usuarios" className="hover:underline flex items-center">
          <ArrowLeft className="h-3.5 w-3.5 mr-1" />
          Usuarios
        </Link>
        <span className="mx-2">/</span>
        <span>{modo === 'crear' ? 'Crear' : 'Editar'}</span>
      </div>
    </div>
    <div>
      <Button 
        variant="outline" 
        className="mr-2"
        onClick={handleCancel}
        disabled={isSubmitting}
      >
        <X className="h-4 w-4 mr-2" /> Cancelar
      </Button>
      <Button 
        onClick={handleSubmit}
        disabled={isSubmitting}
      >
        <Edit className="h-4 w-4 mr-2" /> 
        {isSubmitting ? 'Procesando...' : modo === 'crear' ? 'Crear Usuario' : 'Guardar Cambios'}
      </Button>
    </div>
  </div>
);

export const UserProfile = ({ form }: UserProfileProps) => {
  const getInitials = () => {
    const nombre = form.watch('nombre');
    const apellido = form.watch('apellido');
    
    if (nombre && apellido) {
      return `${nombre.charAt(0)}${apellido.charAt(0)}`.toUpperCase();
    } else if (nombre) {
      return nombre.substring(0, 2).toUpperCase();
    }
    return 'US';
  };

  return (
    <div className="bg-muted p-6">
      <div className="flex flex-col md:flex-row md:items-center gap-4">
        <Avatar className="h-20 w-20 border-4 border-background">
          <AvatarFallback className="bg-primary text-primary-foreground">
            {getInitials()}
          </AvatarFallback>
        </Avatar>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h3 className="text-2xl font-semibold">
              {(form.watch('nombre') || form.watch('apellido')) 
                ? `${form.watch('nombre')} ${form.watch('apellido')}` 
                : 'Nuevo Usuario'}
            </h3>
            <Badge 
              className="ml-2"
              variant={form.watch('estado') === 'activo' ? 'default' : 'secondary'}
            >
              {form.watch('estado') === 'activo' ? 'Activo' : 
               form.watch('estado') === 'inactivo' ? 'Inactivo' : 'Bloqueado'}
            </Badge>
          </div>
          <div className="flex items-center text-muted-foreground">
            <Mail className="h-4 w-4 mr-2" />
            {form.watch('email') || 'correo@ejemplo.com'}
          </div>
        </div>
      </div>
    </div>
  );
}; 