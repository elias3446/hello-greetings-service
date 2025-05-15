import { Rol } from "@/types/tipos";

export interface RoleTotalCardProps {
    totalRoles: number;
  }

export interface ChartData {
    name: string;
    value: number;
    color: string;
  }
  
export interface RoleChartsProps {
    usuariosPorRol: ChartData[];
    permisosPorRol: ChartData[];
  }

  export interface RoleDetailsProps {
    roles: Rol[];
  }

