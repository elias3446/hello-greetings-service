import { ReportesPorEstado } from "@/constants/index/types";

export interface ReportsListProps {
    reportesPorEstado: ReportesPorEstado;
  }

export interface StatsProps {
    totalReportes: number;
    reportesPorEstado: ReportesPorEstado;
  }