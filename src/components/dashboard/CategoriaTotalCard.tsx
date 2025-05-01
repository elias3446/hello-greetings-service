
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { List } from 'lucide-react';

interface CategoriaTotalCardProps {
  totalCategorias: number;
}

const CategoriaTotalCard = ({ totalCategorias }: CategoriaTotalCardProps) => {
  return (
    <Card className="border-l-4" style={{ borderLeftColor: '#f59e0b' }}>
      <CardContent className="flex justify-between items-center py-6">
        <div>
          <p className="text-sm font-medium text-muted-foreground">Total de Categorías</p>
          <p className="text-3xl font-bold">{totalCategorias}</p>
        </div>
        <List className="h-8 w-8 text-[#f59e0b]" />
      </CardContent>
    </Card>
  );
};

export default CategoriaTotalCard;
