import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  FileText, 
  Users, 
  List, 
  Shield, 
  Activity 
} from 'lucide-react';
import { getReports } from '@/controller/CRUD/report/reportController';
import { getUsers } from '@/controller/CRUD/user/userController';
import { getCategories } from '@/controller/CRUD/categoryController';
import { getRoles } from '@/controller/CRUD/roleController';
import { getEstados } from '@/controller/CRUD/estadoController';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { EstadoReporte } from '@/types/tipos';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const DashboardGeneral = () => {
  const [data, setData] = useState({
    totalReportes: 0,
    totalUsuarios: 0,
    totalCategorias: 0,
    totalRoles: 0,
    totalEstados: 0,
  });

  const [reportesPorEstado, setReportesPorEstado] = useState<any[]>([]);
  const [estadisticasPorTipo, setEstadisticasPorTipo] = useState<Record<string, number>>({});
  const [reportesActivos, setReportesActivos] = useState<number>(0);
  
  useEffect(() => {
    // Obtener datos para los contadores
    const reportes = getReports();
    const usuarios = getUsers();
    const categorias = getCategories();
    const roles = getRoles();
    const estados = getEstados();

    setData({
      totalReportes: reportes.length,
      totalUsuarios: usuarios.length,
      totalCategorias: categorias.length,
      totalRoles: roles.length,
      totalEstados: estados.length,
    });

    // Calcular estadísticas para reportes por estado
    const estadisticas = estados.map(estado => {
      const cantidad = reportes.filter(reporte => reporte.estado.id === estado.id && reporte.activo).length;
      return {
        name: estado.nombre,
        value: cantidad,
        color: estado.color
      };
    }).filter(item => item.value > 0);

    setReportesPorEstado(estadisticas);
    
    // Calcular reportes activos
    const activos = reportes.filter(r => r.activo).length;
    setReportesActivos(activos);
    
    // Calcular estadísticas por tipo de estado dinámicamente
    const tiposEstado = getAllTiposEstado(estados);
    const reportesPorTipo: Record<string, number> = {};
    
    // Inicializar contador para cada tipo de estado
    tiposEstado.forEach(tipo => {
      reportesPorTipo[tipo] = 0;
    });
    
    // Contar reportes por tipo de estado (solo activos)
    reportes.filter(r => r.activo).forEach(reporte => {
      const tipoEstado = reporte.estado.nombre;
      if (tipoEstado in reportesPorTipo) {
        reportesPorTipo[tipoEstado]++;
      }
    });

    // Filtrar solo los tipos con reportes activos
    const reportesPorTipoFiltrados = Object.fromEntries(
      Object.entries(reportesPorTipo).filter(([_, value]) => value > 0)
    );
    
    setEstadisticasPorTipo(reportesPorTipoFiltrados);
  }, []);

  // Obtener todos los tipos únicos de estado
  const getAllTiposEstado = (estados: EstadoReporte[]): string[] => {
    const tiposUnicos = new Set<string>();
    estados.forEach(estado => {
      tiposUnicos.add(estado.nombre);
    });
    return Array.from(tiposUnicos);
  };

  const cards = [
    {
      title: 'Reportes',
      value: data.totalReportes,
      icon: FileText,
      color: '#3b82f6',
      bgColor: 'rgba(59, 130, 246, 0.1)',
    },
    {
      title: 'Usuarios',
      value: data.totalUsuarios,
      icon: Users,
      color: '#10b981',
      bgColor: 'rgba(16, 185, 129, 0.1)',
    },
    {
      title: 'Categorías',
      value: data.totalCategorias,
      icon: List,
      color: '#f59e0b',
      bgColor: 'rgba(245, 158, 11, 0.1)',
    },
    {
      title: 'Roles',
      value: data.totalRoles,
      icon: Shield,
      color: '#6366f1',
      bgColor: 'rgba(99, 102, 241, 0.1)',
    },
    {
      title: 'Estados',
      value: data.totalEstados,
      icon: Activity,
      color: '#ec4899',
      bgColor: 'rgba(236, 72, 153, 0.1)',
    },
  ];

  // Función para formatear el tipo de estado para su visualización
  const formatearTipoEstado = (tipo: string): string => {
    // Convertir de snake_case a formato legible
    const palabras = tipo.split('_').map(palabra => 
      palabra.charAt(0).toUpperCase() + palabra.slice(1)
    );
    return palabras.join(' ');
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {cards.map((card) => (
          <Card key={card.title} className="transition-shadow hover:shadow-md">
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
              <CardTitle className="text-md font-medium">{card.title}</CardTitle>
              <div 
                className="p-2 rounded-full" 
                style={{ backgroundColor: card.bgColor }}
              >
                <card.icon className="h-5 w-5" style={{ color: card.color }} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{card.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                      <Cell key={`cell-${index}`} fill={entry.color || COLORS[index % COLORS.length]} />
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
            <CardTitle>Resumen de Actividad</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <p>Reportes activos</p>
                  <p className="font-medium">{reportesActivos}</p>
                </div>
                {/* Generar dinámicamente los elementos según los tipos de estado disponibles */}
                {Object.entries(estadisticasPorTipo).map(([tipo, cantidad]) => (
                  <div key={tipo} className="flex items-center justify-between text-sm">
                    <p>Reportes {formatearTipoEstado(tipo)}</p>
                    <p className="font-medium">{cantidad}</p>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardGeneral;
