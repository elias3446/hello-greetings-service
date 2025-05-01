
import React from 'react';
import { useReportDashboard } from '@/hooks/useReportDashboard';
import ReportTypeCard from '@/components/dashboard/ReportTypeCard';
import CategoryPieChart from '@/components/dashboard/CategoryPieChart';
import PriorityBarChart from '@/components/dashboard/PriorityBarChart';
import RecentReportsTable from '@/components/dashboard/RecentReportsTable';

const DashboardReportes = () => {
  const {
    reportesPorCategoria,
    reportesPorPrioridad,
    reportesRecientes,
    contadores,
    formatearTipoEstado,
    getIconForEstadoTipo,
    getColorForEstadoTipo
  } = useReportDashboard();

  return (
    <div className="space-y-6">
      {/* Tarjetas de contadores */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {Object.keys(contadores).map((tipo) => (
          <ReportTypeCard
            key={tipo}
            tipo={tipo}
            cantidad={contadores[tipo]}
            formatearTipoEstado={formatearTipoEstado}
            getIconForEstadoTipo={getIconForEstadoTipo}
            getColorForEstadoTipo={getColorForEstadoTipo}
          />
        ))}
      </div>

      {/* Gráficos de reportes por categoría y por prioridad */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CategoryPieChart reportesPorCategoria={reportesPorCategoria} />
        <PriorityBarChart reportesPorPrioridad={reportesPorPrioridad} />
      </div>

      {/* Reportes recientes */}
      <RecentReportsTable reportesRecientes={reportesRecientes} />
    </div>
  );
};

export default DashboardReportes;
