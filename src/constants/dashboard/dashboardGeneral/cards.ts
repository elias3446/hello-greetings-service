import { 
  FileText, 
  Users, 
  List, 
  Shield, 
  Activity 
} from 'lucide-react';

export interface Card {
  title: string;
  value: number;
  icon: React.ElementType;
  color: string;
  bgColor: string;
}

export const getCards = (data: {
  totalReportes: number;
  totalUsuarios: number;
  totalCategorias: number;
  totalRoles: number;
  totalEstados: number;
}): Card[] => [
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
  {
    title: 'Estados',
    value: data.totalEstados,
    icon: Activity,
    color: '#ec4899',
    bgColor: 'rgba(236, 72, 153, 0.1)',
  },
]; 