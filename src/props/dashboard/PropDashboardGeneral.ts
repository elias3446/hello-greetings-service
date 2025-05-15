export interface ReportePorEstado {
    name: string;
    value: number;
    color?: string;
}

export interface ChartsAndSummaryProps {
    reportesPorEstado: ReportePorEstado[];
    reportesActivos: number;
    estadisticasPorTipo: { [key: string]: number };
    formatearTipoEstado: (tipo: string) => string;
  }

  export interface Card {
    title: string;
    value: number | string;
    icon: React.ElementType;
    color: string;
    bgColor: string;
  }
  
  export interface StatsCardsProps {
    cards: Card[];
  }