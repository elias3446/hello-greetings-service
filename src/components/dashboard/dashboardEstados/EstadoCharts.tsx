import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { EstadoChartsProps } from '@/props/dashboard/PropDashboardEstados';

const EstadoCharts: React.FC<EstadoChartsProps> = ({ reportesPorEstado, reportesPorTipoEstado }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Distribución de Reportes</CardTitle>
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

      <Card>
        <CardHeader>
          <CardTitle>Rendimiento por Estado</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px]">
          {reportesPorTipoEstado.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={reportesPorTipoEstado}
                margin={{
                  top: 20,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                <Tooltip formatter={(value, name) => {
                  if (name === "Velocidad de Resolución") return [`${value} reportes/día`, name];
                  return [value, name];
                }} />
                <Legend />
                <Bar yAxisId="left" dataKey="sinResolver" name="Sin Resolver" fill="#ef4444">
                  {reportesPorTipoEstado.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill="#ef4444" />
                  ))}
                </Bar>
                <Bar yAxisId="left" dataKey="resueltos" name="Resueltos" fill="#22c55e">
                  {reportesPorTipoEstado.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill="#22c55e" />
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
    </div>
  );
};

export default EstadoCharts; 