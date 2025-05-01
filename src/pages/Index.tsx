
import React, { useEffect, useState } from 'react';
import Layout from '@/components/layout/Layout';
import { reportes } from '@/data/reportes';
import { estadosReporte } from '@/data/estadosReporte';
import HeroSection from '@/components/home/HeroSection';
import StatsCards from '@/components/home/StatsCards';
import FeaturedCards from '@/components/home/FeaturedCards';
import ReportesEstadoCards from '@/components/home/ReportesEstadoCards';

const Index = () => {
  const [reportesPorEstado, setReportesPorEstado] = useState<{
    [key: string]: {
      nombre: string;
      tipo: string;
      color: string;
      reportes: typeof reportes;
    }
  }>({});

  useEffect(() => {
    const reportesAgrupados = estadosReporte.reduce((acc, estado) => {
      const reportesFiltrados = reportes.filter(reporte => reporte.estado.id === estado.id);
      
      if (reportesFiltrados.length > 0) {
        acc[estado.id] = {
          nombre: estado.nombre,
          tipo: estado.tipo,
          color: estado.color,
          reportes: reportesFiltrados
        };
      }
      
      return acc;
    }, {} as {[key: string]: any});

    setReportesPorEstado(reportesAgrupados);
  }, []);

  const totalReportes = reportes.length;

  return (
    <Layout>
      <div className="space-y-8">
        <HeroSection />
        <StatsCards 
          totalReportes={totalReportes} 
          reportesPorEstado={reportesPorEstado} 
        />
        <FeaturedCards />
        <ReportesEstadoCards reportesPorEstado={reportesPorEstado} />
      </div>
    </Layout>
  );
};

export default Index;
