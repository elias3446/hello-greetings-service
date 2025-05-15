import { Usuario } from "@/types/tipos";

export interface ChartData {
  name: string;
  value: number;
  color?: string;
} 

export interface UserStatusCardsProps {
  usuarios: Usuario[];
}

export interface UserChartsProps {
  usuariosPorRol: ChartData[];
  usuariosPorEstado: ChartData[];
}

export interface RecentUsersListProps {
  usuarios: Usuario[];
}