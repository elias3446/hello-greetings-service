
import { Clock, BarChart3, CheckCircle2, CalendarDays, FileText } from 'lucide-react';
import { estadosReporte } from '@/data/estadosReporte';

export const iconosPorTipo: {[key: string]: any} = {
  pendiente: { icono: Clock, color: 'bg-yellow-100', textColor: '#FFD166' },
  en_progreso: { icono: BarChart3, color: 'bg-blue-100', textColor: '#118AB2' },
  completado: { icono: CheckCircle2, color: 'bg-green-100', textColor: '#06D6A0' },
  cancelado: { icono: CalendarDays, color: 'bg-red-100', textColor: '#EF476F' },
};

export const getEstadoOriginal = (estadoId: string) => {
  return estadosReporte.find(e => e.id === estadoId);
};

export const getIconoInfo = (tipo: string) => {
  return iconosPorTipo[tipo] || { 
    icono: FileText, 
    color: 'bg-gray-100', 
    textColor: '#555' 
  };
};
