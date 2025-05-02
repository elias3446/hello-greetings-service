
import { useState, useEffect } from 'react';
import { getReports } from '@/controller/CRUD/reportController';
import { getEstados } from '@/controller/CRUD/estadoController';
import { Reporte, EstadoReporte } from '@/types/tipos';
import { AlertTriangle, CheckCircle, Clock, icons } from 'lucide-react';

// Mapeo de tipos de estado a iconos predeterminados (como fallback)
const DEFAULT_ICONS_MAP: Record<string, React.ElementType> = {
  pendiente: AlertTriangle,
  en_progreso: Clock,
  completado: CheckCircle
};

// Mapeo de tipos de estado a colores predeterminados (como fallback)
const DEFAULT_COLORS_MAP: Record<string, string> = {
  pendiente: '#FFD166',
  en_progreso: '#06D6A0',
  completado: '#118AB2',
  cancelado: '#EF476F'
};

export const useReportDashboard = () => {
  const [reportes, setReportes] = useState<Reporte[]>([]);
  const [reportesPorCategoria, setReportesPorCategoria] = useState<any[]>([]);
  const [reportesPorPrioridad, setReportesPorPrioridad] = useState<any[]>([]);
  const [reportesRecientes, setReportesRecientes] = useState<Reporte[]>([]);
  const [contadores, setContadores] = useState<Record<string, number>>({});
  const [tiposEstado, setTiposEstado] = useState<Record<string, EstadoReporte[]>>({});
  const [estadosMapeados, setEstadosMapeados] = useState<Record<string, EstadoReporte>>({});
  const [iconosPorTipo, setIconosPorTipo] = useState<Record<string, React.ElementType>>({});
  const [coloresPorTipo, setColoresPorTipo] = useState<Record<string, string>>({});

  useEffect(() => {
    const reportesData = getReports();
    const estadosData = getEstados();
    setReportes(reportesData);

    // Reportes por categoría
    const categorias = reportesData.reduce((acc: { [key: string]: { name: string, value: number, color: string } }, reporte) => {
      const categoriaId = reporte.categoria.id;
      if (!acc[categoriaId]) {
        acc[categoriaId] = { 
          name: reporte.categoria.nombre, 
          value: 0,
          color: reporte.categoria.color 
        };
      }
      acc[categoriaId].value += 1;
      return acc;
    }, {});

    setReportesPorCategoria(Object.values(categorias));

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

    setReportesPorPrioridad(Object.values(prioridades));

    // Reportes recientes (últimos 5)
    const recientes = [...reportesData]
      .sort((a, b) => new Date(b.fechaCreacion).getTime() - new Date(a.fechaCreacion).getTime())
      .slice(0, 5);
    setReportesRecientes(recientes);

    // Agrupar estados por tipo
    const estadosPorTipo: Record<string, EstadoReporte[]> = {};
    const estadosPorId: Record<string, EstadoReporte> = {};
    const iconosEstados: Record<string, React.ElementType> = {};
    const coloresEstados: Record<string, string> = {};
    
    // Extraer colores e iconos de los estados
    estadosData.forEach(estado => {
      if (!estadosPorTipo[estado.tipo]) {
        estadosPorTipo[estado.tipo] = [];
        
        // Configurar color por tipo de estado
        coloresEstados[estado.tipo] = estado.color || DEFAULT_COLORS_MAP[estado.tipo] || '#9b87f5'; // Color púrpura por defecto
        
        // Intentar asignar un icono basado en el nombre del tipo o usar uno predeterminado
        let iconoNombre = estado.icono;
        if (!iconoNombre && DEFAULT_ICONS_MAP[estado.tipo]) {
          iconosEstados[estado.tipo] = DEFAULT_ICONS_MAP[estado.tipo];
        } else {
          // Intentar convertir el nombre de icono a componente Lucide
          const nombreCamellizado = iconoNombre ? 
            iconoNombre.split('-').map((part, i) => 
              i === 0 ? part : part.charAt(0).toUpperCase() + part.slice(1)
            ).join('') : 
            null;
          
          const LucideIcon = nombreCamellizado && (icons as any)[nombreCamellizado] ? 
            (icons as any)[nombreCamellizado] : 
            DEFAULT_ICONS_MAP[estado.tipo] || AlertTriangle;
          
          iconosEstados[estado.tipo] = LucideIcon;
        }
      }
      
      estadosPorTipo[estado.tipo].push(estado);
      estadosPorId[estado.id] = estado;
    });
    
    setTiposEstado(estadosPorTipo);
    setEstadosMapeados(estadosPorId);
    setIconosPorTipo(iconosEstados);
    setColoresPorTipo(coloresEstados);

    // Contadores por tipo de estado
    const contadoresPorTipo: Record<string, number> = {};
    
    Object.keys(estadosPorTipo).forEach(tipo => {
      contadoresPorTipo[tipo] = reportesData.filter(r => {
        return estadosPorTipo[tipo].some(estado => estado.id === r.estado.id);
      }).length;
    });
    
    setContadores(contadoresPorTipo);
  }, []);

  // Función para formatear el tipo de estado para su visualización
  const formatearTipoEstado = (tipo: string): string => {
    // Convertir de snake_case a formato legible
    const palabras = tipo.split('_').map(palabra => 
      palabra.charAt(0).toUpperCase() + palabra.slice(1)
    );
    return palabras.join(' ');
  };
  
  // Función para obtener un ícono según el tipo de estado
  const getIconForEstadoTipo = (tipo: string) => {
    const IconComponent = iconosPorTipo[tipo] || AlertTriangle;
    const color = coloresPorTipo[tipo] || '#9b87f5';
    
    return <IconComponent className="h-8 w-8" style={{ color }} />;
  };
  
  // Función para obtener un color según el tipo de estado
  const getColorForEstadoTipo = (tipo: string): string => {
    return coloresPorTipo[tipo] || '#9b87f5'; // Color púrpura por defecto
  };

  return {
    reportes,
    reportesPorCategoria,
    reportesPorPrioridad,
    reportesRecientes,
    contadores,
    tiposEstado,
    estadosMapeados,
    iconosPorTipo,
    coloresPorTipo,
    formatearTipoEstado,
    getIconForEstadoTipo,
    getColorForEstadoTipo,
  };
};

export default useReportDashboard;
