import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getEstados } from '@/controller/CRUD/estado/estadoController';
import { obtenerReportes } from '@/controller/CRUD/report/reportController';
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
    const reportesData = obtenerReportes();
    
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

    // Análisis de rendimiento considerando estado activo e historial
    const reportesPorRendimiento = estadosData.map(estado => {
      const reportesDelEstado = reportesData.filter(reporte => reporte.estado.id === estado.id);
      
      // Filtrar reportes activos
      const reportesActivos = reportesDelEstado.filter(r => r.activo);
      const reportesInactivos = reportesDelEstado.filter(r => !r.activo);

      // Calcular velocidad de resolución (reportes resueltos por día)
      const reportesResueltos = reportesInactivos.length;
      const velocidadResolucion = reportesResueltos > 0
        ? reportesResueltos / (30) // Promedio de reportes resueltos por día en los últimos 30 días
        : 0;

      return {
        name: estado.nombre,
        resueltos: reportesInactivos.length,
        sinResolver: reportesActivos.length,
        velocidadResolucion: Math.round(velocidadResolucion * 100) / 100,
        color: estado.color,
        total: reportesDelEstado.length
      };
    }).sort((a, b) => b.total - a.total);

    setReportesPorTipoEstado(reportesPorRendimiento);

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

      {/* Lista de estados */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Estados</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4">
            {estados.map((estado) => {
              const reportesCount = reportesPorEstado.find(r => r.name === estado.nombre)?.value || 0;
              const metricas = reportesPorTipoEstado.find(r => r.name === estado.nombre);
              const reportesDelEstado = obtenerReportes().filter(reporte => reporte.estado.id === estado.id);
              
              return (
                <div 
                  key={estado.id} 
                  className="p-4 rounded-lg border"
                  style={{ borderColor: estado.color }}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: estado.color }}
                      ></div>
                      <div>
                        <span className="font-medium text-lg">{estado.nombre}</span>
                        <p className="text-sm text-muted-foreground">{estado.descripcion}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-center">
                        <span className="text-sm text-muted-foreground">Total</span>
                        <p className="text-xl font-bold">{reportesCount}</p>
                      </div>
                      <div className="text-center">
                        <span className="text-sm text-muted-foreground">Sin Resolver</span>
                        <p className="text-xl font-bold text-red-500">{metricas?.sinResolver || 0}</p>
                      </div>
                      <div className="text-center">
                        <span className="text-sm text-muted-foreground">Resueltos</span>
                        <p className="text-xl font-bold text-green-500">{metricas?.resueltos || 0}</p>
                      </div>
                    </div>
                  </div>

                  {/* Lista de reportes */}
                  <div className="mt-4 space-y-2">
                    {reportesDelEstado.map(reporte => (
                      <div 
                        key={reporte.id}
                        className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                      >
                        <div className="flex items-center gap-3">
                          <div 
                            className={`w-2 h-2 rounded-full ${reporte.activo ? 'bg-red-500' : 'bg-green-500'}`}
                          />
                          <div>
                            <p className="font-medium">{reporte.titulo}</p>
                            <p className="text-sm text-muted-foreground">
                              Categoría: {reporte.categoria?.nombre || 'Sin categoría'} | 
                              Prioridad: {reporte.prioridad?.nombre || 'Sin prioridad'} | 
                              Fecha: {new Date(reporte.fechaCreacion).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            reporte.activo 
                              ? 'bg-red-100 text-red-700' 
                              : 'bg-green-100 text-green-700'
                          }`}>
                            {reporte.activo ? 'Sin Resolver' : 'Resuelto'}
                          </span>
                        </div>
                      </div>
                    ))}
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
