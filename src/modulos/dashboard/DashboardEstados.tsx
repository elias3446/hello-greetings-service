
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getEstados } from '@/controller/estadoController';
import { getReports } from '@/controller/reportController';
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

    // Reportes por tipo de estado (agrupados) - VERSIÓN DINÁMICA
    // Primero identificamos todos los tipos de estado únicos que existen en los datos
    const tiposUnicos = new Set<string>();
    estadosData.forEach(estado => {
      tiposUnicos.add(estado.tipo);
    });
    
    // Creamos un objeto para almacenar los datos por tipo
    const tipoEstadoMap: Record<string, { name: string, value: number, color: string }> = {};
    
    // Para cada tipo único, encontramos un estado representativo para obtener el color y crear un nombre legible
    tiposUnicos.forEach(tipo => {
      // Encontrar un estado representativo de este tipo para obtener un color
      const estadoRepresentativo = estadosData.find(estado => estado.tipo === tipo);
      
      if (estadoRepresentativo) {
        // Crear un nombre legible (capitalizar y reemplazar guiones bajos)
        let nombreLegible = tipo
          .split('_')
          .map(palabra => palabra.charAt(0).toUpperCase() + palabra.slice(1))
          .join(' ');
        
        // Pluralizar el nombre
        if (nombreLegible.endsWith('o')) {
          nombreLegible = nombreLegible + 's';
        } else if (nombreLegible.endsWith('e')) {
          nombreLegible = nombreLegible + 's';
        } else {
          nombreLegible = nombreLegible + 'es';
        }
        
        tipoEstadoMap[tipo] = {
          name: nombreLegible,
          value: 0,
          color: estadoRepresentativo.color
        };
      }
    });
    
    // Ahora contamos los reportes para cada tipo de estado
    estadosData.forEach(estado => {
      const reportesCount = reportesData.filter(r => r.estado.id === estado.id).length;
      if (tipoEstadoMap[estado.tipo]) {
        tipoEstadoMap[estado.tipo].value += reportesCount;
      }
    });

    // Convertimos el mapa a un array para el gráfico
    const tiposEstadoArray = Object.values(tipoEstadoMap);
    
    setReportesPorTipoEstado(tiposEstadoArray);

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
            <CardTitle>Reportes por Tipo de Estado</CardTitle>
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
                  <YAxis allowDecimals={false} />
                  <Tooltip formatter={(value) => [`${value} reportes`, 'Cantidad']} />
                  <Legend />
                  <Bar dataKey="value" name="Reportes">
                    {reportesPorTipoEstado.map((entry, index) => (
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

      {/* Lista de estados */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Estados</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {estados.map((estado) => {
              const reportesCount = reportesPorEstado.find(r => r.name === estado.nombre)?.value || 0;
              
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
                  <div className="flex items-center">
                    <span 
                      className="px-2 py-1 rounded-full text-xs"
                      style={{ 
                        backgroundColor: estado.color, 
                        color: '#fff'
                      }}
                    >
                      {reportesCount} reportes
                    </span>
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
