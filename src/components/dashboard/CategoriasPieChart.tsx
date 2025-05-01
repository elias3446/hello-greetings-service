
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
import { CategoriaConReportes, CHART_COLORS } from '@/utils/dashboardUtils';

interface CategoriasPieChartProps {
  reportesPorCategoria: CategoriaConReportes[];
}

const CategoriasPieChart = ({ reportesPorCategoria }: CategoriasPieChartProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Reportes por Categoría</CardTitle>
      </CardHeader>
      <CardContent className="h-[400px]">
        {reportesPorCategoria.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={reportesPorCategoria}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={120}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                {reportesPorCategoria.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color || CHART_COLORS[index % CHART_COLORS.length]} />
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

export default CategoriasPieChart;
