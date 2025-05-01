
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface PriorityBarChartProps {
  reportesPorPrioridad: Array<{
    name: string;
    value: number;
    color: string;
  }>;
}

const PriorityBarChart = ({ reportesPorPrioridad }: PriorityBarChartProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Reportes por Prioridad</CardTitle>
      </CardHeader>
      <CardContent className="h-[300px]">
        {reportesPorPrioridad.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={reportesPorPrioridad}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip formatter={(value) => [`${value} reportes`, 'Cantidad']} />
              <Legend />
              <Bar dataKey="value" name="Reportes">
                {reportesPorPrioridad.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
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

export default PriorityBarChart;
