// =====================
// Interfaces de Usuario y Seguridad
// =====================

export interface Usuario {
  id: string;
  nombre: string;
  apellido: string;
  email: string;
  password: string;
  avatar?: string;
  roles: Rol[];
  permisos?: Permiso[];
  intentosFallidos: number;
  fechaCreacion: Date;
  estado: 'activo' | 'inactivo' | 'bloqueado';
  tipo: 'admin' | 'usuario';
  historialEstados?: HistorialEstadoUsuario[];
  historialActividades?: HistorialActividadUsuario[];
}

export interface Rol {
  id: string;
  nombre: string;
  descripcion: string;
  tipo: 'admin' | 'usuario';
  color: string;
  activo: boolean;
  fechaCreacion: Date;
  fechaActualizacion?: Date;
  permisos?: Permiso[];
  historialEstados?: HistorialEstadoRol[];
}

export interface Permiso {
  id: string;
  nombre: string;
  descripcion: string;
  fechaCreacion: Date;
  activo: boolean;
}

// =====================
// Interfaces de Reporte
// =====================

export interface Reporte {
  id: string;
  titulo: string;
  descripcion: string;
  ubicacion: Ubicacion;
  categoria: Categoria;
  estado: EstadoReporte;
  prioridad?: Prioridad;
  usuarioCreador: Usuario;
  asignadoA?: Usuario;
  comentarios?: Comentario[];
  imagenes?: string[];
  historialAsignaciones?: HistorialAsignacion[];
  historialEstados?: HistorialEstadoReporte[];
  historialActividades?: HistorialActividadReporte[];
  fechaCreacion: Date;
  fechaActualizacion?: Date;
  fechaInicio: Date;
  fechaFinalizacion?: Date;
  activo: boolean;
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
  actividades?: HistorialActividadCategoria[];
  historialEstados?: HistorialEstadoCategoria[];
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
  icono: string;
  color: string;
  fechaCreacion: Date;
  activo: boolean;
  historialEstados?: HistorialEstado[];
}

export interface Comentario {
  id: string;
  texto: string;
  fecha: Date;
  usuario: Usuario;
  reporte: Reporte;
  activo: boolean;
}

export interface HistorialAsignacion {
  id: string;
  usuario: Usuario;
  fechaAsignacion: Date;
  fechaCreacion: Date;
  esActual: boolean;
}

// =====================
// Actividades e Historiales
// =====================

export interface HistorialEstadoUsuario {
  id: string | number;
  idUsuario: Usuario;
  estadoAnterior: string;
  estadoNuevo: string;
  fechaHoraCambio: Date;
  realizadoPor: Usuario;
  motivoCambio?: string;
  tipoAccion: 'creacion' | 'actualizacion' | 'cambio_estado' | 'asignacion_reporte' | 'cambio_rol' | 'otro';
}

export interface HistorialEstadoReporte {
  id: string | number;
  idReporte?: Reporte;
  idUsuario?: Usuario;
  estadoAnterior: string;
  estadoNuevo: string;
  fechaHoraCambio: Date;
  realizadoPor: Usuario;
  motivoCambio?: string;
  tipoAccion: 'creacion' | 'actualizacion' | 'cambio_estado' | 'asignacion_reporte' | 'cambio_rol' | 'otro';
}

export interface HistorialEstadoCategoria {
  id: string | number;
  idCategoria: Categoria;
  estadoAnterior: string;
  estadoNuevo: string;
  fechaHoraCambio: Date;
  realizadoPor: Usuario;
  motivoCambio?: string;
  tipoAccion: 'creacion' | 'actualizacion' | 'cambio_estado' | 'otro';
}

export interface HistorialEstadoRol {
  id: string | number;
  idRol: Rol;
  estadoAnterior: string;
  estadoNuevo: string;
  fechaHoraCambio: Date;
  realizadoPor: Usuario;
  motivoCambio?: string;
  tipoAccion: 'creacion' | 'actualizacion' | 'cambio_estado' | 'otro';
}

export interface HistorialEstado {
  id: string | number;
  idEstado: EstadoReporte;
  estadoAnterior: string;
  estadoNuevo: string;
  fechaHoraCambio: Date;
  realizadoPor: Usuario;
  motivoCambio?: string;
  tipoAccion: 'creacion' | 'actualizacion' | 'cambio_estado' | 'otro';
}

export interface HistorialActividadUsuario {
  id: string;
  usuario: Usuario;
  tipoActividad: 'login' | 'logout' | 'creacion' | 'modificacion' | 'eliminacion';
  descripcion: string;
  fechaActividad: Date;
  detalles?: {
    valorAnterior?: string;
    valorNuevo?: string;
    campo?: string;
    comentario?: string;
  };
  activo: boolean;
}

export interface HistorialActividadReporte {
  id: string;
  reporte: Reporte;
  tipoActividad: 'creacion' | 'modificacion' | 'cambio_estado' | 'asignacion' | 'comentario';
  descripcion: string;
  fechaActividad: Date;
  usuarioResponsable: Usuario;
  detalles?: {
    valorAnterior?: string;
    valorNuevo?: string;
    campo?: string;
    comentario?: string;
  };
  activo: boolean;
}

export interface HistorialActividadCategoria {
  id: string;
  categoria: Categoria;
  tipoActividad: 'creacion' | 'modificacion' | 'cambio_estado' | 'eliminacion';
  descripcion: string;
  fechaActividad: Date;
  usuarioResponsable: Usuario;
  detalles?: {
    valorAnterior?: string;
    valorNuevo?: string;
    campo?: string;
    comentario?: string;
  };
  activo: boolean;
}

// =====================
// Actividades Simples
// =====================

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

// =====================
// Dashboard y utilidades
// =====================

export interface EstadisticasDashboard {
  totalReportes: number;
  reportesPorEstado: Record<string, number>;
  reportesPorCategoria: Record<string, number>;
  reportesPorPrioridad: Record<string, number>;
  reportesRecientes: Reporte[];
}

export interface SortOption {
  id: string;
  label: string;
  direction?: 'asc' | 'desc';
}

export type TipoEntidad = 'usuarios' | 'reportes' | 'categorias' | 'roles' | 'estados';
