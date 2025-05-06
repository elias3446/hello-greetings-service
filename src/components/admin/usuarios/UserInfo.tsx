import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Mail, Shield, Calendar } from 'lucide-react';
import { Usuario } from '@/types/tipos';
import { roles } from '@/data/roles';

interface UserInfoProps {
  usuario: Usuario;
}

export const UserInfo: React.FC<UserInfoProps> = ({ usuario }) => {
  const rol = roles.find(r => usuario?.roles.some(userRole => userRole.id === r.id));

  return (
    <Card className="overflow-hidden">
      <div className="bg-muted p-6">
        <div className="flex items-center gap-4 p-4 rounded-md border">
          <Avatar className="h-20 w-20">
            <AvatarImage src={`https://ui-avatars.com/api/?name=${usuario.nombre}+${usuario.apellido}&background=random&size=100`} alt="Avatar" />
            <AvatarFallback>{usuario.nombre.charAt(0)}{usuario.apellido.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <div className="text-2xl font-semibold">{usuario.nombre} {usuario.apellido}</div>
            <div className="text-muted-foreground">{usuario.email}</div>
          </div>
        </div>
      </div>

      <CardContent className="p-6 space-y-6">
        {/* Detalles principales */}
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-1">Roles</h4>
            <div className="flex flex-wrap gap-2">
              {usuario.roles.map(rolUsuario => {
                const rolInfo = roles.find(r => r.id === rolUsuario.id);
                return (
                  <Badge 
                    key={rolUsuario.id} 
                    style={{ backgroundColor: rolInfo?.color, color: "white" }}
                  >
                    {rolInfo?.nombre}
                  </Badge>
                );
              })}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-1">Estado actual</h4>
              <Badge 
                variant={
                  usuario.estado === 'activo' ? 'default' : 
                  usuario.estado === 'inactivo' ? 'secondary' : 
                  'destructive'
                }
              >
                {usuario.estado === 'activo' ? 'Activo' : 
                 usuario.estado === 'inactivo' ? 'Inactivo' : 
                 'Bloqueado'}
              </Badge>
            </div>

            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-1">Fecha de creación</h4>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>
                  {new Date(usuario.fechaCreacion).toLocaleDateString('es-ES', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  })}
                </span>
              </div>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-1">Último acceso</h4>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>
                  {new Date().toLocaleDateString('es-ES', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  })}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Información adicional */}
        <div>
          <h4 className="text-sm font-medium text-muted-foreground mb-3">Información de contacto</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center gap-3">
              <Mail className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium">{usuario.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Shield className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Rol Principal</p>
                <p className="font-medium">{rol?.nombre}</p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}; 