import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { UserCheck, UserMinus } from 'lucide-react';
import { UserStatusCardsProps } from '@/props/dashboard/PropDashboardUsuarios';

const UserStatusCards: React.FC<UserStatusCardsProps> = ({ usuarios }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {usuarios.filter(u => u.estado === 'activo').length > 0 && (
        <Card className="border-l-4" style={{ borderLeftColor: '#10b981' }}>
          <CardContent className="flex justify-between items-center py-6">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Usuarios Activos</p>
              <p className="text-3xl font-bold">{usuarios.filter(u => u.estado === 'activo').length}</p>
            </div>
            <UserCheck className="h-8 w-8 text-[#10b981]" />
          </CardContent>
        </Card>
      )}
      
      {usuarios.filter(u => u.estado === 'inactivo').length > 0 && (
        <Card className="border-l-4" style={{ borderLeftColor: '#f43f5e' }}>
          <CardContent className="flex justify-between items-center py-6">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Usuarios Inactivos</p>
              <p className="text-3xl font-bold">{usuarios.filter(u => u.estado === 'inactivo').length}</p>
            </div>
            <UserMinus className="h-8 w-8 text-[#f43f5e]" />
          </CardContent>
        </Card>
      )}

      {usuarios.filter(u => u.estado === 'bloqueado').length > 0 && (
        <Card className="border-l-4" style={{ borderLeftColor: '#f59e0b' }}>
          <CardContent className="flex justify-between items-center py-6">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Usuarios Bloqueados</p>
              <p className="text-3xl font-bold">{usuarios.filter(u => u.estado === 'bloqueado').length}</p>
            </div>
            <UserMinus className="h-8 w-8 text-[#f59e0b]" />
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default UserStatusCards; 