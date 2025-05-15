import { ChartData } from '@/props/dashboard/PropDashboardReportes';
import { Reporte } from '@/types/tipos';
import { AlertTriangle } from 'lucide-react';
import React from 'react';

// State types
export interface DashboardReportesState {
  reportesPorCategoria: ChartData[];
  reportesPorPrioridad: ChartData[];
  reportesRecientes: Reporte[];
  contadores: Record<string, number>;
  iconosPorTipo: Record<string, React.ElementType>;
  coloresPorTipo: Record<string, string>;
}

// Utility functions
export const formatearTipoEstado = (tipo: string): string => {
  // Convertir de snake_case a formato legible
  const palabras = tipo.split('_').map(palabra => 
    palabra.charAt(0).toUpperCase() + palabra.slice(1)
  );
  return palabras.join(' ');
};

export const getIconForEstadoTipo = (iconosPorTipo: Record<string, React.ElementType>, coloresPorTipo: Record<string, string>) => (tipo: string): React.ReactNode => {
  const IconComponent = iconosPorTipo[tipo] || AlertTriangle;
  const color = coloresPorTipo[tipo] || '#9b87f5';
  
  return React.createElement(IconComponent, { 
    className: "h-8 w-8", 
    style: { color } 
  });
};

export const getColorForEstadoTipo = (coloresPorTipo: Record<string, string>) => (tipo: string): string => {
  return coloresPorTipo[tipo] || '#9b87f5'; // Color púrpura por defecto
}; 