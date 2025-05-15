import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { CategoryChartsProps } from '@/props/dashboard/PropDashboardCategorias';

const CategoryCharts: React.FC<CategoryChartsProps> = ({ 
  reportesPorCategoria, 
  reportesPorCategoriaEstado,
  tiposEstado 
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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

      <Card>
        <CardHeader>
          <CardTitle>Estado de Reportes por Categoría</CardTitle>
        </CardHeader>
        <CardContent className="h-[400px]">
          {reportesPorCategoriaEstado.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={reportesPorCategoriaEstado}
                margin={{
                  top: 20,
                  right: 30,
                  left: 20,
                  bottom: 40,
                }}
                barGap={0}
                barSize={20}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="name" 
                  angle={-45} 
                  textAnchor="end" 
                  height={70} 
                  interval={0}
                />
                <YAxis allowDecimals={false} />
                <Tooltip formatter={(value) => [`${value} reportes`, '']} />
                <Legend />
                {Object.keys(tiposEstado).map((tipo, index) => (
                  <Bar 
                    key={tipo}
                    dataKey={tiposEstado[tipo].nombre} 
                    name={tiposEstado[tipo].nombre} 
                    fill={tiposEstado[tipo].color} 
                  />
                ))}
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-muted-foreground">No hay datos disponibles</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CategoryCharts; 