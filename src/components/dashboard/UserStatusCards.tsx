
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { UserCheck, UserMinus } from 'lucide-react';

interface UserStatusCardsProps {
  activeUsers: number;
  inactiveUsers: number;
}

const UserStatusCards = ({ activeUsers, inactiveUsers }: UserStatusCardsProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <Card className="border-l-4" style={{ borderLeftColor: '#10b981' }}>
        <CardContent className="flex justify-between items-center py-6">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Usuarios Activos</p>
            <p className="text-3xl font-bold">{activeUsers}</p>
          </div>
          <UserCheck className="h-8 w-8 text-[#10b981]" />
        </CardContent>
      </Card>
      
      <Card className="border-l-4" style={{ borderLeftColor: '#f43f5e' }}>
        <CardContent className="flex justify-between items-center py-6">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Usuarios Inactivos</p>
            <p className="text-3xl font-bold">{inactiveUsers}</p>
          </div>
          <UserMinus className="h-8 w-8 text-[#f43f5e]" />
        </CardContent>
      </Card>
    </div>
  );
};

export default UserStatusCards;
