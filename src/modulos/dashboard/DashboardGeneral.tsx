
import React, { useEffect, useState } from 'react';
import { 
  FileText, 
  Users, 
  List, 
  Shield
} from 'lucide-react';
import { getReports } from '@/controller/reportController';
import { getUsers } from '@/controller/userController';
import { getCategories } from '@/controller/categoryController';
import { getRoles } from '@/controller/roleController';
import { getEstados } from '@/controller/estadoController';
import { EstadoReporte } from '@/types/tipos';
import EstadoTotalCard from '@/components/dashboard/EstadoTotalCard';
import EstadosPieChart from '@/components/dashboard/EstadosPieChart';
import EstadosTypeChart from '@/components/dashboard/EstadosTypeChart';
import ActivitySummaryCard from '@/components/dashboard/ActivitySummaryCard';
import StatCard from '@/components/dashboard/StatCard';

const DashboardGeneral = () => {
  const [data, setData] = useState({
    totalReportes: 0,
    totalUsuarios: 0,
    totalCategorias: 0,
    totalRoles: 0,
    totalEstados: 0,
  });

  const [reportesPorEstado, setReportesPorEstado] = useState<any[]>([]);
  const [reportesPorTipoEstado, setReportesPorTipoEstado] = useState<any[]>([]);
  const [estadisticasPorTipo, setEstadisticasPorTipo] = useState<Record<string, number>>({});
  const [reportesActivos, setReportesActivos] = useState<number>(0);
  
  useEffect(() => {
    // Obtener datos para los contadores
    const reportes = getReports();
    const usuarios = getUsers();
    const categorias = getCategories();
    const roles = getRoles();
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
      const cantidad = reportes.filter(reporte => reporte.estado.id === estado.id).length;
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
    
    // Contar reportes por tipo de estado
    reportes.forEach(reporte => {
      const tipoEstado = reporte.estado.tipo;
      if (tipoEstado in reportesPorTipo) {
        reportesPorTipo[tipoEstado]++;
      }
    });
    
    setEstadisticasPorTipo(reportesPorTipo);

    // Generar datos para el gráfico de tipos de estado
    const tipoEstadoData = Object.entries(reportesPorTipo)
      .map(([tipo, cantidad]) => {
        // Encontrar un estado con este tipo para obtener su color
        const estadoConTipo = estados.find(e => e.tipo === tipo);
        
        return {
          name: formatearTipoEstado(tipo),
          value: cantidad,
          color: estadoConTipo ? estadoConTipo.color : '#888888'
        };
      })
      .filter(item => item.value > 0);

    setReportesPorTipoEstado(tipoEstadoData);
  }, []);

  // Obtener todos los tipos únicos de estado
  const getAllTiposEstado = (estados: EstadoReporte[]): string[] => {
    const tiposUnicos = new Set<string>();
    estados.forEach(estado => {
      tiposUnicos.add(estado.tipo);
    });
    return Array.from(tiposUnicos);
  };

  // Función para formatear el tipo de estado para su visualización
  const formatearTipoEstado = (tipo: string): string => {
    // Convertir de snake_case a formato legible
    const palabras = tipo.split('_').map(palabra => 
      palabra.charAt(0).toUpperCase() + palabra.slice(1)
    );
    return palabras.join(' ');
  };

  const cards = [
    {
      title: 'Reportes',
      value: data.totalReportes,
      icon: FileText,
      color: '#3b82f6',
      bgColor: 'rgba(59, 130, 246, 0.1)',
    },
    {
      title: 'Usuarios',
      value: data.totalUsuarios,
      icon: Users,
      color: '#10b981',
      bgColor: 'rgba(16, 185, 129, 0.1)',
    },
    {
      title: 'Categorías',
      value: data.totalCategorias,
      icon: List,
      color: '#f59e0b',
      bgColor: 'rgba(245, 158, 11, 0.1)',
    },
    {
      title: 'Roles',
      value: data.totalRoles,
      icon: Shield,
      color: '#6366f1',
      bgColor: 'rgba(99, 102, 241, 0.1)',
    },
  ];

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {cards.map((card) => (
          <StatCard 
            key={card.title}
            title={card.title}
            value={card.value}
            icon={card.icon}
            color={card.color}
            bgColor={card.bgColor}
          />
        ))}
        <EstadoTotalCard totalEstados={data.totalEstados} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <EstadosPieChart reportesPorEstado={reportesPorEstado} />
        <ActivitySummaryCard 
          reportesActivos={reportesActivos} 
          estadisticasPorTipo={estadisticasPorTipo}
          formatearTipoEstado={formatearTipoEstado}
        />
      </div>

      <div className="grid grid-cols-1 gap-6">
        <EstadosTypeChart reportesPorTipoEstado={reportesPorTipoEstado} />
      </div>
    </div>
  );
};

export default DashboardGeneral;
