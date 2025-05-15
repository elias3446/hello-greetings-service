import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText } from 'lucide-react';
import { MostUsedCategoriesProps } from '@/props/dashboard/PropDashboardCategorias';

const MostUsedCategories: React.FC<MostUsedCategoriesProps> = ({ categoriasMasUsadas }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Categorías Más Utilizadas</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {categoriasMasUsadas.map((categoria) => (
            <div 
              key={categoria.name} 
              className="flex items-center justify-between p-3 rounded-lg"
              style={{ backgroundColor: `${categoria.color}10` }}
            >
              <div className="flex items-center gap-3">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: categoria.color }}
                ></div>
                <span className="font-medium">{categoria.name}</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  <FileText className="h-4 w-4 text-gray-400" />
                  <span className="font-medium">{categoria.value}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default MostUsedCategories; 