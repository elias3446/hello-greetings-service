import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { RecentUsersListProps } from '@/props/dashboard/PropDashboardUsuarios';

const RecentUsersList: React.FC<RecentUsersListProps> = ({ usuarios }) => {
  if (usuarios.length === 0) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Últimos Usuarios</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {usuarios
            .sort((a, b) => new Date(b.fechaCreacion).getTime() - new Date(a.fechaCreacion).getTime())
            .slice(0, 5)
            .map((usuario) => (
              <div key={usuario.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarFallback>
                      {usuario.nombre.charAt(0) + usuario.apellido.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{usuario.nombre} {usuario.apellido}</p>
                    <p className="text-sm text-muted-foreground">{usuario.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {usuario.roles.map((rol) => (
                    <span
                      key={rol.id}
                      className="px-2 py-1 rounded-full text-xs"
                      style={{
                        backgroundColor: `${rol.color}20`,
                        color: rol.color
                      }}
                    >
                      {rol.nombre}
                    </span>
                  ))}
                </div>
              </div>
            ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentUsersList; 