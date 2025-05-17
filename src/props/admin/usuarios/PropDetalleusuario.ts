import { HistorialEstadoUsuario, Reporte } from "@/types/tipos";
import { ActividadUsuario } from "@/types/tipos";
import { Usuario } from "@/types/tipos";

export interface DetalleUsuarioMainProps {
    usuario: Usuario;
    reportesAsignados: Reporte[];
    actividadesDelUsuario: ActividadUsuario[];
    onEditarUsuario: (datosActualizados: Partial<Usuario>) => boolean;
  }

  export interface DetalleUsuarioSidebarProps {
    usuario: Usuario;
    historialEstados: HistorialEstadoUsuario[];
    onRoleChange: (userId: string, nuevoRolId: string) => Promise<void>;
    onEstadoChange: () => Promise<boolean>;
    onDelete: () => Promise<boolean>;
  }