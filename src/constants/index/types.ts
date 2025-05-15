import { reportes } from '@/data/reportes';

export interface ReportesPorEstado {
  [key: string]: {
    nombre: string;
    tipo: string;
    color: string;
    reportes: typeof reportes;
  }
}

export const initialState: ReportesPorEstado = {}; 