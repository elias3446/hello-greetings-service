import React, { useEffect, useState } from 'react';
import { obtenerReportes } from '@/controller/CRUD/report/reportController';
import { getEstados } from '@/controller/CRUD/estado/estadoController';
import StatsCards from '@/components/dashboard/dashboardReportes/StatsCards';
import Charts from '@/components/dashboard/dashboardReportes/Charts';
import RecentReports from '@/components/dashboard/dashboardReportes/RecentReports';
import { Icons } from '@/components/Icons';
import { AlertTriangle } from 'lucide-react';
import { DashboardReportesState, getIconForEstadoTipo, getColorForEstadoTipo } from '@/constants/dashboard/dashboardReportes/types';

const DashboardReportes = () => {
  const [reportesPorCategoria, setReportesPorCategoria] = useState<DashboardReportesState['reportesPorCategoria']>([]);
  const [reportesPorPrioridad, setReportesPorPrioridad] = useState<DashboardReportesState['reportesPorPrioridad']>([]);
  const [reportesRecientes, setReportesRecientes] = useState<DashboardReportesState['reportesRecientes']>([]);
  const [contadores, setContadores] = useState<DashboardReportesState['contadores']>({});
  const [iconosPorTipo, setIconosPorTipo] = useState<DashboardReportesState['iconosPorTipo']>({});
  const [coloresPorTipo, setColoresPorTipo] = useState<DashboardReportesState['coloresPorTipo']>({});

  useEffect(() => {
    const reportesData = obtenerReportes().filter(r => r.activo);
    const estadosData = getEstados();

    // Reportes por categoría
    const categorias = reportesData.reduce((acc: { [key: string]: { name: string, value: number, color: string } }, reporte) => {
      const categoriaId = reporte.categoria?.id || 'sin-categoria';
      if (!acc[categoriaId]) {
        acc[categoriaId] = { 
          name: reporte.categoria?.nombre || 'Sin Categoría', 
          value: 0,
          color: reporte.categoria?.color || '#9CA3AF' // Color gris para reportes sin categoría
        };
      }
      acc[categoriaId].value += 1;
      return acc;
    }, {});

    setReportesPorCategoria((Object.values(categorias) as {name: string, value: number, color: string}[]).filter(cat => cat.value > 0));

    // Reportes por prioridad
    const prioridades = reportesData.reduce((acc: { [key: string]: { name: string, value: number, color: string } }, reporte) => {
      if (reporte.prioridad) {
        const prioridadId = reporte.prioridad.id;
        if (!acc[prioridadId]) {
          acc[prioridadId] = { 
            name: reporte.prioridad.nombre, 
            value: 0,
            color: reporte.prioridad.color 
          };
        }
        acc[prioridadId].value += 1;
      }
      return acc;
    }, {});

    setReportesPorPrioridad((Object.values(prioridades) as {name: string, value: number, color: string}[]).filter(pri => pri.value > 0));

    // Reportes recientes (últimos 5)
    const recientes = [...reportesData]
      .sort((a, b) => new Date(b.fechaCreacion).getTime() - new Date(a.fechaCreacion).getTime())
      .slice(0, 5);
    setReportesRecientes(recientes);

    // Agrupar estados por tipo
    const iconosEstados: Record<string, React.ElementType> = {};
    const coloresEstados: Record<string, string> = {};
    
    // Extraer colores e iconos de los estados
    estadosData.forEach(estado => {
      const tipoEstado = estado.nombre;
      
      // Configurar color por tipo de estado
      coloresEstados[tipoEstado] = estado.color || '#9b87f5';
      
      // Intentar asignar un icono basado en el nombre del tipo o usar uno predeterminado
      let iconoNombre = estado.icono;
      if (iconoNombre) {
        const nombreCamellizado = iconoNombre.split('-').map((part, i) => 
          i === 0 ? part : part.charAt(0).toUpperCase() + part.slice(1)
        ).join('');
        
        const LucideIcon = (Icons as any)[nombreCamellizado] || AlertTriangle;
        iconosEstados[tipoEstado] = LucideIcon;
      } else {
        iconosEstados[tipoEstado] = AlertTriangle;
      }
    });
    
    setIconosPorTipo(iconosEstados);
    setColoresPorTipo(coloresEstados);

    // Contadores por tipo de estado
    const contadoresPorTipo: Record<string, number> = {};
    
    Object.keys(iconosEstados).forEach(tipo => {
      contadoresPorTipo[tipo] = reportesData.filter(r => {
        return r.estado.nombre === tipo;
      }).length;
    });
    
    // Filtrar contadores para mostrar solo valores mayores a cero
    const contadoresFiltrados = Object.fromEntries(
      Object.entries(contadoresPorTipo).filter(([_, value]) => value > 0)
    );
    
    setContadores(contadoresFiltrados);
  }, []);

  return (
    <div className="space-y-6">
      {/* Tarjetas de contadores */}
      <StatsCards 
        contadores={contadores} 
        getColorForEstadoTipo={getColorForEstadoTipo(coloresPorTipo)}
        getIconForEstadoTipo={getIconForEstadoTipo(iconosPorTipo, coloresPorTipo)}
      />

      {/* Gráficos de reportes por categoría y por prioridad */}
      <Charts 
        reportesPorCategoria={reportesPorCategoria}
        reportesPorPrioridad={reportesPorPrioridad}
      />

      {/* Reportes recientes */}
      <RecentReports reportesRecientes={reportesRecientes} />
    </div>
  );
};

export default DashboardReportes;
