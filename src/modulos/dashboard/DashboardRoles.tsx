
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getRoles } from '@/controller/roleController';
import { getUsers } from '@/controller/userController';
import { Rol } from '@/types/tipos';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { Shield } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const DashboardRoles = () => {
  const [roles, setRoles] = useState<Rol[]>([]);
  const [usuariosPorRol, setUsuariosPorRol] = useState<any[]>([]);
  const [permisosPorRol, setPermisosPorRol] = useState<any[]>([]);
  
  useEffect(() => {
    const rolesData = getRoles();
    const usuariosData = getUsers();
    
    setRoles(rolesData);

    // Usuarios por rol
    const usuariosRol = rolesData.map(rol => {
      const usuariosConRol = usuariosData.filter(usuario => 
        usuario.roles.some(r => r.id === rol.id)
      ).length;
      
      return {
        name: rol.nombre,
        value: usuariosConRol,
        color: rol.color
      };
    });

    setUsuariosPorRol(usuariosRol);

    // Permisos por rol
    const permisosPorRolData = rolesData.map(rol => {
      return {
        name: rol.nombre,
        value: rol.permisos.length,
        color: rol.color
      };
    }).sort((a, b) => b.value - a.value);

    setPermisosPorRol(permisosPorRolData);

  }, []);

  return (
    <div className="space-y-6">
      {/* Tarjeta principal de roles */}
      <Card className="border-l-4" style={{ borderLeftColor: '#6366f1' }}>
        <CardContent className="flex justify-between items-center py-6">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Total de Roles</p>
            <p className="text-3xl font-bold">{roles.length}</p>
          </div>
          <Shield className="h-8 w-8 text-[#6366f1]" />
        </CardContent>
      </Card>

      {/* Gráficos de roles */}
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

      {/* Detalles de roles */}
      <Card>
        <CardHeader>
          <CardTitle>Detalle de Roles</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {roles.map((rol) => (
              <div 
                key={rol.id} 
                className="p-4 border rounded-lg"
                style={{ borderColor: rol.color }}
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-bold text-lg" style={{ color: rol.color }}>{rol.nombre}</h3>
                    <p className="text-muted-foreground text-sm">{rol.descripcion}</p>
                  </div>
                  <Badge style={{ backgroundColor: rol.color }}>
                    {rol.tipo === 'admin' ? 'Administrador' : 'Usuario'}
                  </Badge>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium mb-2">Permisos ({rol.permisos.length})</h4>
                  <div className="flex flex-wrap gap-2">
                    {rol.permisos.slice(0, 5).map((permiso, index) => (
                      <span 
                        key={index} 
                        className="px-2 py-1 bg-muted text-xs rounded-full"
                      >
                        {permiso.nombre}
                      </span>
                    ))}
                    {rol.permisos.length > 5 && (
                      <span className="px-2 py-1 bg-muted text-xs rounded-full">
                        +{rol.permisos.length - 5} más
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardRoles;
