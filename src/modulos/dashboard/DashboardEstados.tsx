import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getEstados } from '@/controller/CRUD/estadoController';
import { getReports } from '@/controller/CRUD/reportController';
import { EstadoReporte } from '@/types/tipos';
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
import { Activity } from 'lucide-react';

const DashboardEstados = () => {
  const [estados, setEstados] = useState<EstadoReporte[]>([]);
  const [reportesPorEstado, setReportesPorEstado] = useState<any[]>([]);
  const [reportesPorTipoEstado, setReportesPorTipoEstado] = useState<any[]>([]);
  
  useEffect(() => {
    const estadosData = getEstados();
    const reportesData = getReports();
    
    setEstados(estadosData);

    // Reportes por estado
    const reportesEstado = estadosData.map(estado => {
      const reportesEst = reportesData.filter(reporte => reporte.estado.id === estado.id);
      
      return {
        name: estado.nombre,
        value: reportesEst.length,
        color: estado.color
      };
    }).sort((a, b) => b.value - a.value);

    setReportesPorEstado(reportesEstado);

    // Análisis de tiempo de resolución por estado
    const reportesPorTiempo = estadosData.map(estado => {
      const reportesDelEstado = reportesData.filter(reporte => reporte.estado.id === estado.id);
      
      // Calcular métricas de tiempo
      const reportesResueltos = reportesDelEstado.filter(r => r.fechaFinalizacion);
      const tiempoPromedio = reportesResueltos.length > 0 
        ? reportesResueltos.reduce((total, reporte) => {
            const inicio = new Date(reporte.fechaInicio).getTime();
            const fin = new Date(reporte.fechaFinalizacion!).getTime();
            return total + (fin - inicio);
          }, 0) / reportesResueltos.length
        : 0;

      // Calcular eficiencia (reportes resueltos vs total)
      const eficiencia = reportesDelEstado.length > 0
        ? (reportesResueltos.length / reportesDelEstado.length) * 100
        : 0;

      // Reportes pendientes (sin fecha de finalización)
      const pendientes = reportesDelEstado.filter(r => !r.fechaFinalizacion).length;

      return {
        name: estado.nombre,
        tiempoPromedio: Math.round(tiempoPromedio / (1000 * 60 * 60 * 24)), // Convertir a días
        eficiencia: Math.round(eficiencia),
        resueltos: reportesResueltos.length,
        pendientes: pendientes,
        color: estado.color,
        total: reportesDelEstado.length
      };
    }).sort((a, b) => b.total - a.total);

    setReportesPorTipoEstado(reportesPorTiempo);

  }, []);

  return (
    <div className="space-y-6">
      {/* Tarjeta principal de estados */}
      <Card className="border-l-4" style={{ borderLeftColor: '#ec4899' }}>
        <CardContent className="flex justify-between items-center py-6">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Total de Estados</p>
            <p className="text-3xl font-bold">{estados.length}</p>
          </div>
          <Activity className="h-8 w-8 text-[#ec4899]" />
        </CardContent>
      </Card>

      {/* Gráficos de estados */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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

        <Card>
          <CardHeader>
            <CardTitle>Eficiencia por Estado</CardTitle>
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
                  <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                  <Tooltip formatter={(value, name) => {
                    if (name === "Tiempo Promedio") return [`${value} días`, name];
                    if (name === "Eficiencia") return [`${value}%`, name];
                    return [value, name];
                  }} />
                  <Legend />
                  <Bar yAxisId="left" dataKey="tiempoPromedio" name="Tiempo Promedio" fill="#8884d8">
                    {reportesPorTipoEstado.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill="#8884d8" />
                    ))}
                  </Bar>
                  <Bar yAxisId="right" dataKey="eficiencia" name="Eficiencia" fill="#82ca9d">
                    {reportesPorTipoEstado.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill="#82ca9d" />
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

      {/* Lista de estados */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Estados</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {estados.map((estado) => {
              const reportesCount = reportesPorEstado.find(r => r.name === estado.nombre)?.value || 0;
              const metricas = reportesPorTipoEstado.find(r => r.name === estado.nombre);
              
              return (
                <div 
                  key={estado.id} 
                  className="flex items-center justify-between p-3 rounded-lg"
                  style={{ backgroundColor: `${estado.color}10` }}
                >
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: estado.color }}
                    ></div>
                    <div>
                      <span className="font-medium">{estado.nombre}</span>
                      <p className="text-xs text-muted-foreground">{estado.descripcion}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span 
                      className="px-2 py-1 rounded-full text-xs"
                      style={{ 
                        backgroundColor: estado.color, 
                        color: '#fff'
                      }}
                    >
                      {reportesCount} reportes
                    </span>
                    {metricas && (
                      <div className="flex flex-col items-end text-xs">
                        <div className="flex items-center gap-2">
                          <span className="text-muted-foreground">Tiempo promedio:</span>
                          <span className="font-medium">{metricas.tiempoPromedio} días</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-muted-foreground">Eficiencia:</span>
                          <span className="font-medium">{metricas.eficiencia}%</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-muted-foreground">Pendientes:</span>
                          <span className="font-medium">{metricas.pendientes}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardEstados;
