export interface StatsCardsProps {
  contadores: Record<string, number>;
  getColorForEstadoTipo: (tipo: string) => string;
  getIconForEstadoTipo: (tipo: string) => React.ReactNode;
}

export interface ChartData {
  name: string;
  value: number;
  color: string;
}

export interface ChartsProps {
  reportesPorCategoria: ChartData[];
  reportesPorPrioridad: ChartData[];
}

export interface Reporte {
  id: string;
  titulo: string;
  categoria?: {
    nombre: string;
  };
  estado: {
    nombre: string;
    color: string;
  };
  fechaCreacion: Date;
}

export interface RecentReportsProps {
  reportesRecientes: Reporte[];
}