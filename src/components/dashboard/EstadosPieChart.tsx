
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  PieChart, 
  Pie, 
  Cell, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';

interface EstadosPieChartProps {
  reportesPorEstado: any[];
}

const EstadosPieChart = ({ reportesPorEstado }: EstadosPieChartProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Reportes por Estado</CardTitle>
      </CardHeader>
      <CardContent className="h-[300px]">
        {reportesPorEstado.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={reportesPorEstado}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                {reportesPorEstado.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`${value} reportes`, 'Cantidad']} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-muted-foreground">No hay datos disponibles</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default EstadosPieChart;
