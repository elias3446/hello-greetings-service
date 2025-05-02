
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  Cell
} from 'recharts';

interface PermisosPorRolChartProps {
  data: Array<{
    name: string;
    value: number;
    color: string;
  }>;
}

const PermisosPorRolChart = ({ data }: PermisosPorRolChartProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Permisos por Rol</CardTitle>
      </CardHeader>
      <CardContent className="h-[300px]">
        {data.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 5,
              }}
              layout="vertical"
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" allowDecimals={false} />
              <YAxis dataKey="name" type="category" width={100} />
              <Tooltip formatter={(value) => [`${value} permisos`, 'Cantidad']} />
              <Legend />
              <Bar dataKey="value" name="Permisos" barSize={20}>
                {data.map((entry, index) => (
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

export default PermisosPorRolChart;
