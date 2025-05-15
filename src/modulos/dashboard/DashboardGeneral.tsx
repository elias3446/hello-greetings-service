import { useEffect, useState } from 'react';
import { obtenerReportes } from '@/controller/CRUD/report/reportController';
import { getUsers } from '@/controller/CRUD/user/userController';
import { getCategories } from '@/controller/CRUD/category/categoryController';
import { obtenerRoles } from '@/controller/CRUD/role/roleController';
import { getEstados } from '@/controller/CRUD/estado/estadoController';
import StatsCards from '@/components/dashboard/dashboardGeneral/StatsCards';
import ChartsAndSummary from '@/components/dashboard/dashboardGeneral/ChartsAndSummary';
import { ReportePorEstado } from '@/props/dashboard/PropDashboardGeneral';
import { getCards } from '@/constants/dashboard/dashboardGeneral/cards';
import { getAllTiposEstado, formatearTipoEstado } from '@/constants/dashboard/dashboardGeneral/utils';

const DashboardGeneral = () => {
  
  const [data, setData] = useState({
    totalReportes: 0,
    totalUsuarios: 0,
    totalCategorias: 0,
    totalRoles: 0,
    totalEstados: 0,
  });
  const [reportesPorEstado, setReportesPorEstado] = useState<ReportePorEstado[]>([]);  
  const [estadisticasPorTipo, setEstadisticasPorTipo] = useState<Record<string, number>>({});
  const [reportesActivos, setReportesActivos] = useState<number>(0);
  
  useEffect(() => {
    // Obtener datos para los contadores
    const reportes = obtenerReportes();
    const usuarios = getUsers();
    const categorias = getCategories();
    const roles = obtenerRoles();
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

  return (
    <div className="space-y-6">
      <StatsCards cards={getCards(data)} />
      <ChartsAndSummary 
        reportesPorEstado={reportesPorEstado}
        reportesActivos={reportesActivos}
        estadisticasPorTipo={estadisticasPorTipo}
        formatearTipoEstado={formatearTipoEstado}
      />
    </div>
  );
};

export default DashboardGeneral;
