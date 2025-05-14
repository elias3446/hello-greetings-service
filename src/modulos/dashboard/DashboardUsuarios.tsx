import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getUsers } from '@/controller/CRUD/userController';
import { Usuario } from '@/types/tipos';
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
import { UserCheck, UserMinus } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { roles } from '@/data/roles';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const DashboardUsuarios = () => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [usuariosPorRol, setUsuariosPorRol] = useState<any[]>([]);
  const [usuariosPorEstado, setUsuariosPorEstado] = useState<any[]>([]);
  
  useEffect(() => {
    const usuariosData = getUsers();
    setUsuarios(usuariosData);

    // Usuarios por rol
    // Crear un mapa de roles para contar usuarios
    const rolesMap = roles.reduce((acc: Record<string, { name: string, value: number, color: string }>, rol) => {
      acc[rol.id] = { 
        name: rol.nombre, 
        value: 0, 
        color: rol.color 
      };
      return acc;
    }, {});

    // Contar usuarios por rol
    usuariosData.forEach(usuario => {
      usuario.roles.forEach(rol => {
        if (rolesMap[rol.id]) {
          rolesMap[rol.id].value += 1;
        }
      });
    });

    setUsuariosPorRol(Object.values(rolesMap).filter(r => r.value > 0));

    // Usuarios por estado
    const usuariosActivos = usuariosData.filter(u => u.estado === 'activo').length;
    const usuariosInactivos = usuariosData.filter(u => u.estado === 'inactivo').length;
    const usuariosBloqueados = usuariosData.filter(u => u.estado === 'bloqueado').length;

    setUsuariosPorEstado([
      { name: 'Activos', value: usuariosActivos, color: '#10b981' },
      { name: 'Inactivos', value: usuariosInactivos, color: '#f43f5e' },
      { name: 'Bloqueados', value: usuariosBloqueados, color: '#f59e0b' }
    ].filter(estado => estado.value > 0));

  }, []);

  return (
    <div className="space-y-6">
      {/* Tarjetas de contadores */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="border-l-4" style={{ borderLeftColor: '#10b981' }}>
          <CardContent className="flex justify-between items-center py-6">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Usuarios Activos</p>
              <p className="text-3xl font-bold">{usuarios.filter(u => u.estado === 'activo').length}</p>
            </div>
            <UserCheck className="h-8 w-8 text-[#10b981]" />
          </CardContent>
        </Card>
        
        <Card className="border-l-4" style={{ borderLeftColor: '#f43f5e' }}>
          <CardContent className="flex justify-between items-center py-6">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Usuarios Inactivos</p>
              <p className="text-3xl font-bold">{usuarios.filter(u => u.estado === 'inactivo').length}</p>
            </div>
            <UserMinus className="h-8 w-8 text-[#f43f5e]" />
          </CardContent>
        </Card>

        <Card className="border-l-4" style={{ borderLeftColor: '#f59e0b' }}>
          <CardContent className="flex justify-between items-center py-6">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Usuarios Bloqueados</p>
              <p className="text-3xl font-bold">{usuarios.filter(u => u.estado === 'bloqueado').length}</p>
            </div>
            <UserMinus className="h-8 w-8 text-[#f59e0b]" />
          </CardContent>
        </Card>
      </div>

      {/* Gráficos de usuarios por rol y por estado */}
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
            <CardTitle>Usuarios por Estado</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            {usuariosPorEstado.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={usuariosPorEstado}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {usuariosPorEstado.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color || COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value} usuarios`, 'Cantidad']} />
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
      </div>

      {/* Lista de usuarios */}
      <Card>
        <CardHeader>
          <CardTitle>Últimos Usuarios</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {usuarios
              .sort((a, b) => new Date(b.fechaCreacion).getTime() - new Date(a.fechaCreacion).getTime())
              .slice(0, 5)
              .map((usuario) => (
                <div key={usuario.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarFallback>
                        {usuario.nombre.charAt(0) + usuario.apellido.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{usuario.nombre} {usuario.apellido}</p>
                      <p className="text-sm text-muted-foreground">{usuario.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {usuario.roles.map((rol) => (
                      <span
                        key={rol.id}
                        className="px-2 py-1 rounded-full text-xs"
                        style={{
                          backgroundColor: `${rol.color}20`,
                          color: rol.color
                        }}
                      >
                        {rol.nombre}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardUsuarios;
