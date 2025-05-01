
import React, { useEffect, useState } from 'react';
import { getEstados } from '@/controller/estadoController';
import { getReports } from '@/controller/reportController';
import { EstadoReporte } from '@/types/tipos';
import EstadoTotalCard from '@/components/dashboard/EstadoTotalCard';
import EstadosPieChart from '@/components/dashboard/EstadosPieChart';
import EstadosTypeChart from '@/components/dashboard/EstadosTypeChart';
import EstadosList from '@/components/dashboard/EstadosList';

const DashboardEstados = () => {
  const [estados, setEstados] = useState<EstadoReporte[]>([]);
  const [reportesPorEstado, setReportesPorEstado] = useState<any[]>([]);
  const [reportesPorTipoEstado, setReportesPorTipoEstado] = useState<any[]>([]);
  const [reportesCountByEstado, setReportesCountByEstado] = useState<Record<string, number>>({});
  
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
    
    // Create a map of estado nombre to reportes count
    const countByEstado: Record<string, number> = {};
    reportesEstado.forEach(item => {
      countByEstado[item.name] = item.value;
    });
    setReportesCountByEstado(countByEstado);

    // Reportes por tipo de estado (agrupados)
    const tiposUnicos = new Set<string>();
    estadosData.forEach(estado => {
      tiposUnicos.add(estado.tipo);
    });
    
    const tipoEstadoMap: Record<string, { name: string, value: number, color: string }> = {};
    
    tiposUnicos.forEach(tipo => {
      const estadoRepresentativo = estadosData.find(estado => estado.tipo === tipo);
      
      if (estadoRepresentativo) {
        let nombreLegible = tipo
          .split('_')
          .map(palabra => palabra.charAt(0).toUpperCase() + palabra.slice(1))
          .join(' ');
        
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
    
    estadosData.forEach(estado => {
      const reportesCount = reportesData.filter(r => r.estado.id === estado.id).length;
      if (tipoEstadoMap[estado.tipo]) {
        tipoEstadoMap[estado.tipo].value += reportesCount;
      }
    });

    const tiposEstadoArray = Object.values(tipoEstadoMap);
    
    setReportesPorTipoEstado(tiposEstadoArray);
  }, []);

  return (
    <div className="space-y-6">
      {/* Tarjeta principal de estados */}
      <EstadoTotalCard totalEstados={estados.length} />

      {/* Gráficos de estados */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <EstadosPieChart reportesPorEstado={reportesPorEstado} />
        <EstadosTypeChart reportesPorTipoEstado={reportesPorTipoEstado} />
      </div>

      {/* Lista de estados */}
      <EstadosList estados={estados} reportesCountByEstado={reportesCountByEstado} />
    </div>
  );
};

export default DashboardEstados;
