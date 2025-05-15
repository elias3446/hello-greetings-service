import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { RoleChartsProps } from '@/props/dashboard/PropDashboardRoles';

const RoleCharts: React.FC<RoleChartsProps> = ({ usuariosPorRol, permisosPorRol }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Usuarios por Rol</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px]">
          {usuariosPorRol.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={usuariosPorRol}
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
                <Tooltip formatter={(value) => [`${value} usuarios`, 'Cantidad']} />
                <Legend />
                <Bar dataKey="value" name="Usuarios">
                  {usuariosPorRol.map((entry, index) => (
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

      <Card>
        <CardHeader>
          <CardTitle>Permisos por Rol</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px]">
          {permisosPorRol.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={permisosPorRol}
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
                  {permisosPorRol.map((entry, index) => (
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
    </div>
  );
};

export default RoleCharts; 