import { Reporte, EstadoReporte } from "@/types/tipos";

export interface ChartData {
  name: string;
  value: number;
  color: string;
  sinResolver?: number;
  resueltos?: number;
}

export interface EstadoTotalCardProps {
  totalEstados: number;
}

export interface EstadoChartsProps {
  reportesPorEstado: ChartData[];
  reportesPorTipoEstado: ChartData[];
}


export interface EstadoListProps {
  estados: EstadoReporte[];
  reportesPorEstado: ChartData[];
  reportesPorTipoEstado: ChartData[];
  reportes: Reporte[];
}
