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
import EstadoTotalCard from '@/components/dashboard/dashboardEstados/EstadoTotalCard';
import EstadoCharts from '@/components/dashboard/dashboardEstados/EstadoCharts';
import EstadoList from '@/components/dashboard/dashboardEstados/EstadoList';
import { ChartData } from '@/props/dashboard/PropDashboardEstados';

const DashboardEstados = () => {
  const [estados, setEstados] = useState<EstadoReporte[]>([]);
  const [reportes, setReportes] = useState<any[]>([]);
  const [reportesPorEstado, setReportesPorEstado] = useState<ChartData[]>([]);
  const [reportesPorTipoEstado, setReportesPorTipoEstado] = useState<ChartData[]>([]);
  
  useEffect(() => {
    const estadosData = getEstados();
    const reportesData = obtenerReportes();
    
    setEstados(estadosData);
    setReportes(reportesData);

    // Reportes por estado
    const reportesPorEstado = estadosData.map(estado => ({
      name: estado.nombre,
      value: reportesData.filter(r => r.estado.id === estado.id).length,
      color: estado.color
    }));

    // Reportes por tipo de estado
    const reportesPorTipoEstado = estadosData.map(estado => {
      const reportesDelEstado = reportesData.filter(r => r.estado.id === estado.id);
      return {
        name: estado.nombre,
        value: reportesDelEstado.length,
        color: estado.color,
        sinResolver: reportesDelEstado.filter(r => r.activo).length,
        resueltos: reportesDelEstado.filter(r => !r.activo).length
      };
    });

    setReportesPorEstado(reportesPorEstado);
    setReportesPorTipoEstado(reportesPorTipoEstado);

  }, []);

  return (
    <div className="space-y-6">
      <EstadoTotalCard totalEstados={estados.length} />
      <EstadoCharts 
        reportesPorEstado={reportesPorEstado}
        reportesPorTipoEstado={reportesPorTipoEstado}
      />
      <EstadoList 
        estados={estados}
        reportesPorEstado={reportesPorEstado}
        reportesPorTipoEstado={reportesPorTipoEstado}
        reportes={reportes}
      />
    </div>
  );
};

export default DashboardEstados;
