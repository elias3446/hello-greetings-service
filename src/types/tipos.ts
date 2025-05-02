export interface Usuario {
  id: string;
  nombre: string;
  apellido: string;
  email: string;
  roles: Rol[];
  fechaCreacion: Date;
  estado: 'activo' | 'inactivo' | 'bloqueado';
  tipo: 'admin' | 'usuario';
  permisos?: Permiso[];
  intentosFallidos: number;
  password: string;
  avatar?: string;
}

export interface Rol {
  id: string;
  nombre: string;
  descripcion: string;
  permisos?: Permiso[];
  color: string;
  tipo: 'admin' | 'usuario';
  fechaCreacion: Date;
  fechaActualizacion?: Date;
  activo: boolean;
}

export interface Permiso {
  id: string;
  nombre: string;
  descripcion: string;
  fechaCreacion: Date;
  activo: boolean;
}

export interface Reporte {
  id: string;
  titulo: string;
  descripcion: string;
  ubicacion: Ubicacion;
  categoria: Categoria;
  estado: EstadoReporte;
  prioridad?: Prioridad;
  fechaCreacion: Date;
  fechaActualizacion?: Date;
  usuarioCreador: Usuario;
  asignadoA?: Usuario;
  historialAsignaciones: HistorialAsignacion[];
  fechaInicio: Date;
  fechaFinalizacion?: Date;
  comentarios?: Comentario[];
  imagenes?: string[];
  activo: boolean;
}

export interface HistorialAsignacion {
  id: string;
  usuario: Usuario;
  fechaAsignacion: Date;
  fechaCreacion: Date;
  esActual: boolean;
}

export interface Ubicacion {
  id: string;
  latitud: number;
  longitud: number;
  direccion: string;
  referencia: string;
  fechaCreacion: Date;
  activo: boolean;
}

export interface Categoria {
  id: string;
  nombre: string;
  descripcion: string;
  color: string;
  icono: string;
  fechaCreacion: Date;
  fechaActualizacion?: Date;
  fechaEliminacion?: Date;
  usuarioCreador?: Usuario;
  actividades?: ActividadCategoria[];
  activo: boolean;
}

export interface Prioridad {
  id: string;
  nombre: string;
  tipo: 'alta' | 'media' | 'baja';
  color: string;
  fechaCreacion: Date;
  activo: boolean;
}

export interface EstadoReporte {
  id: string;
  nombre: string;
  descripcion: string;
  color: string;
  tipo: 'pendiente' | 'en_progreso' | 'completado' | 'cancelado';
  fechaCreacion: Date;
  activo: boolean;
  icono: string;
}

export interface Comentario {
  id: string;
  texto: string;
  fecha: Date;
  usuario: Usuario;
  reporte: Reporte;
  activo: boolean;
}

export interface ActividadUsuario {
  id: string;
  tipo: 'login' | 'logout' | 'creacion' | 'modificacion' | 'eliminacion';
  descripcion: string;
  fecha: Date;
  usuarioId: string;
  detalles?: {
    valorAnterior?: string;
    valorNuevo?: string;
    comentario?: string;
  };
}

export interface ActividadReporte {
  id: string;
  tipo: 'creacion' | 'cambio_estado' | 'asignacion' | 'comentario' | 'modificacion';
  descripcion: string;
  fecha: Date;
  usuarioId: string;
  reporteId: string;
  detalles?: {
    comentario?: string;
    estadoAnterior?: string;
    estadoNuevo?: string;
  };
}

export interface ActividadCategoria {
  id: string;
  tipo: 'creacion' | 'modificacion' | 'eliminacion';
  descripcion: string;
  fecha: Date;
  usuarioId: string;
  categoriaId: string;
}

export interface EstadisticasDashboard {
  totalReportes: number;
  reportesPorEstado: Record<string, number>;
  reportesPorCategoria: Record<string, number>;
  reportesRecientes: Reporte[];
  reportesPorPrioridad: Record<string, number>;
}

export interface SortOption {
  id: string;
  label: string;
  direction?: 'asc' | 'desc';
}
