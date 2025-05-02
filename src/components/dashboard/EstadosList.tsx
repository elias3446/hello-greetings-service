
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { EstadoReporte } from '@/types/tipos';

interface EstadosListProps {
  estados: EstadoReporte[];
  reportesCountByEstado: Record<string, number>;
}

const EstadosList = ({ estados, reportesCountByEstado }: EstadosListProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Lista de Estados</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {estados.map((estado) => {
            const reportesCount = reportesCountByEstado[estado.nombre] || 0;
            
            return (
              <div 
                key={estado.id} 
                className="flex items-center justify-between p-3 rounded-lg"
                style={{ backgroundColor: `${estado.color}10` }}
              >
                <div className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: estado.color }}
                  ></div>
                  <div>
                    <span className="font-medium">{estado.nombre}</span>
                    <p className="text-xs text-muted-foreground">{estado.descripcion}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <span 
                    className="px-2 py-1 rounded-full text-xs"
                    style={{ 
                      backgroundColor: estado.color, 
                      color: '#fff'
                    }}
                  >
                    {reportesCount} reportes
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default EstadosList;
