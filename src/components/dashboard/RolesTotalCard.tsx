
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Shield } from 'lucide-react';

interface RolesTotalCardProps {
  totalRoles: number;
}

const RolesTotalCard = ({ totalRoles }: RolesTotalCardProps) => {
  return (
    <Card className="border-l-4" style={{ borderLeftColor: '#6366f1' }}>
      <CardContent className="flex justify-between items-center py-6">
        <div>
          <p className="text-sm font-medium text-muted-foreground">Total de Roles</p>
          <p className="text-3xl font-bold">{totalRoles}</p>
        </div>
        <Shield className="h-8 w-8 text-[#6366f1]" />
      </CardContent>
    </Card>
  );
};

export default RolesTotalCard;
