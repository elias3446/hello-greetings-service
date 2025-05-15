import { useEffect, useState } from 'react';
import Layout from '@/components/layout/Layout';
import { reportes } from '@/data/reportes';
import { estadosReporte } from '@/data/estadosReporte';
import Hero from '@/components/index/Hero';
import Stats from '@/components/index/Stats';
import Features from '@/components/index/Features';
import ReportsList from '@/components/index/ReportsList';
import { ReportesPorEstado, initialState } from '@/constants/index/types';

const Index = () => {
  
  const [reportesPorEstado, setReportesPorEstado] = useState<ReportesPorEstado>(initialState);

  useEffect(() => {
    const reportesAgrupados = estadosReporte.reduce((acc, estado) => {
      const reportesFiltrados = reportes.filter(reporte => reporte.estado.id === estado.id);
      
      if (reportesFiltrados.length > 0) {
        acc[estado.id] = {
          nombre: estado.nombre,
          tipo: estado.nombre.toLowerCase().replace(/ /g, '_'),
          color: estado.color,
          reportes: reportesFiltrados
        };
      }
      
      return acc;
    }, {} as ReportesPorEstado);

    setReportesPorEstado(reportesAgrupados);
  }, []);
    
  return (
    <Layout>
      <div className="space-y-8">
        <Hero />
        <Stats totalReportes={reportes.length} reportesPorEstado={reportesPorEstado} />
        <Features />
        <ReportsList reportesPorEstado={reportesPorEstado} />
      </div>
    </Layout>
  );
};

export default Index;
