import { ActividadUsuario, ActividadReporte, ActividadCategoria, HistorialAsignacion, HistorialEstadoUsuario, HistorialEstadoReporte, HistorialEstadoCategoria, HistorialActividadCategoria, HistorialEstadoRol, HistorialEstado } from '@/types/tipos';
import { usuarios } from './usuarios';
import { reportes } from './reportes';
import { categorias } from './categorias';
import { roles } from './roles';
import { estadosReporte } from './estadosReporte';

export const actividadesUsuario: ActividadUsuario[] = [
  {
    id: '1',
    tipo: 'login',
    descripcion: 'Inicio de sesión exitoso',
    fecha: new Date('2025-04-25T08:30:00'),
    usuarioId: '1',
    detalles: {
      comentario: 'Acceso desde navegador Chrome'
    }
  },
  {
    id: '2',
    tipo: 'logout',
    descripcion: 'Cierre de sesión',
    fecha: new Date('2025-04-24T15:45:00'),
    usuarioId: '1',
    detalles: {
      comentario: 'Sesión finalizada correctamente'
    }
  },
  {
    id: '3',
    tipo: 'creacion',
    descripcion: 'Creación de nuevo reporte',
    fecha: new Date('2025-04-24T11:20:00'),
    usuarioId: '1',
    detalles: {
      comentario: 'Reporte creado con prioridad alta'
    }
  },
  {
    id: '4',
    tipo: 'modificacion',
    descripcion: 'Actualización de perfil',
    fecha: new Date('2025-04-24T17:30:00'),
    usuarioId: '1',
    detalles: {
      valorAnterior: 'Sin teléfono',
      valorNuevo: '+34 123 456 789',
      comentario: 'Actualización de datos de contacto'
    }
  },
];

export const actividadesReporte: ActividadReporte[] = [
  {
    id: '1',
    tipo: 'creacion',
    descripcion: 'Reporte creado',
    fecha: new Date('2025-04-25T10:30:00'),
    usuarioId: '1',
    reporteId: '1'
  },
  {
    id: '2',
    tipo: 'cambio_estado',
    descripcion: 'Estado actualizado a "En proceso"',
    fecha: new Date('2025-04-25T11:15:00'),
    usuarioId: '1',
    reporteId: '1'
  },
  {
    id: '3',
    tipo: 'asignacion',
    descripcion: 'Reporte asignado a Carlos Rodríguez',
    fecha: new Date('2025-04-25T11:20:00'),
    usuarioId: '1',
    reporteId: '1'
  },
  {
    id: '4',
    tipo: 'comentario',
    descripcion: 'Nuevo comentario agregado',
    fecha: new Date('2025-04-25T14:45:00'),
    usuarioId: '1',
    reporteId: '1'
  },
  {
    id: '5',
    tipo: 'modificacion',
    descripcion: 'Información del reporte actualizada',
    fecha: new Date('2025-04-25T16:30:00'),
    usuarioId: '1',
    reporteId: '1'
  }
];

export const actividadesCategoria: ActividadCategoria[] = [
  {
    id: '1',
    tipo: 'creacion',
    descripcion: 'Categoría creada',
    fecha: new Date('2025-04-20T10:00:00'),
    usuarioId: '1',
    categoriaId: '1'
  },
  {
    id: '2',
    tipo: 'modificacion',
    descripcion: 'Descripción actualizada',
    fecha: new Date('2025-04-22T15:30:00'),
    usuarioId: '1',
    categoriaId: '1'
  },
  {
    id: '3',
    tipo: 'modificacion',
    descripcion: 'Descripción actualizada',
    fecha: new Date('2025-04-24T09:15:00'),
    usuarioId: '1',
    categoriaId: '1'
  }
];

export const historialAsignaciones: HistorialAsignacion[] = [
  {
    id: '1',
    usuario: usuarios[0],
    fechaAsignacion: new Date('2025-04-25T10:30:00'),
    fechaCreacion: new Date('2025-04-25T10:30:00'),
    esActual: true
  }
];

// Datos de ejemplo para el historial de estados de usuario
export const historialEstadosEjemplo: HistorialEstadoUsuario[] = [
  {
    id: '1',
    idUsuario: {
      id: '1',
      nombre: 'Juan',
      apellido: 'Pérez',
      email: 'juan.perez@example.com',
      estado: 'activo',
      tipo: 'usuario',
      intentosFallidos: 0,
      password: 'hashed_password',
      roles: [{
        id: '1',
        nombre: 'Administrador',
        descripcion: 'Rol con acceso total al sistema',
        color: '#FF0000',
        tipo: 'admin',
        fechaCreacion: new Date('2023-01-01'),
        activo: true
      }],
      fechaCreacion: new Date('2023-01-01'),
    },
    estadoAnterior: 'no_existe',
    estadoNuevo: 'activo',
    fechaHoraCambio: new Date('2023-01-01T10:00:00'),
    realizadoPor: {
      id: '0',
      nombre: 'Sistema',
      apellido: '',
      email: 'sistema@example.com',
      estado: 'activo',
      tipo: 'usuario',
      intentosFallidos: 0,
      password: 'hashed_password',
      roles: [{
        id: '1',
        nombre: 'Administrador',
        descripcion: 'Rol con acceso total al sistema',
        color: '#FF0000',
        tipo: 'admin',
        fechaCreacion: new Date('2023-01-01'),
        activo: true
      }],
      fechaCreacion: new Date('2023-01-01'),
    },
    tipoAccion: 'creacion',
  },
  {
    id: '2',
    idUsuario: {
      id: '2',
      nombre: 'María',
      apellido: 'González',
      email: 'maria.gonzalez@example.com',
      estado: 'activo',
      tipo: 'usuario',
      intentosFallidos: 0,
      password: 'hashed_password',
      roles: [{
        id: '1',
        nombre: 'Administrador',
        descripcion: 'Rol con acceso total al sistema',
        color: '#FF0000',
        tipo: 'admin',
        fechaCreacion: new Date('2023-01-01'),
        activo: true
      }],
      fechaCreacion: new Date('2023-01-01'),
    },
    estadoAnterior: 'no_existe',
    estadoNuevo: 'activo',
    fechaHoraCambio: new Date('2023-01-01T10:00:00'),
    realizadoPor: {
      id: '0',
      nombre: 'Sistema',
      apellido: '',
      email: 'sistema@example.com',
      estado: 'activo',
      tipo: 'usuario',
      intentosFallidos: 0,
      password: 'hashed_password',
      roles: [{
        id: '1',
        nombre: 'Administrador',
        descripcion: 'Rol con acceso total al sistema',
        color: '#FF0000',
        tipo: 'admin',
        fechaCreacion: new Date('2023-01-01'),
        activo: true
      }],
      fechaCreacion: new Date('2023-01-01'),
    },
    tipoAccion: 'creacion',
  },
  {
    id: '3',
    idUsuario: {
      id: '1',
      nombre: 'Juan',
      apellido: 'Pérez',
      email: 'juan.perez@example.com',
      estado: 'inactivo',
      tipo: 'usuario',
      intentosFallidos: 0,
      password: 'hashed_password',
      roles: [{
        id: '1',
        nombre: 'Administrador',
        descripcion: 'Rol con acceso total al sistema',
        color: '#FF0000',
        tipo: 'admin',
        fechaCreacion: new Date('2023-01-01'),
        activo: true
      }],
      fechaCreacion: new Date('2023-01-01'),
    },
    estadoAnterior: 'activo',
    estadoNuevo: 'inactivo',
    fechaHoraCambio: new Date('2023-02-15T15:30:00'),
    realizadoPor: {
      id: '2',
      nombre: 'María',
      apellido: 'González',
      email: 'maria.gonzalez@example.com',
      estado: 'activo',
      tipo: 'usuario',
      intentosFallidos: 0,
      password: 'hashed_password',
      roles: [{
        id: '1',
        nombre: 'Administrador',
        descripcion: 'Rol con acceso total al sistema',
        color: '#FF0000',
        tipo: 'admin',
        fechaCreacion: new Date('2023-01-01'),
        activo: true
      }],
      fechaCreacion: new Date('2023-01-01'),
    },
    motivoCambio: 'Usuario en vacaciones',
    tipoAccion: 'cambio_estado',
  },
  {
    id: '4',
    idUsuario: {
      id: '1',
      nombre: 'Juan',
      apellido: 'Pérez',
      email: 'juan.perez@example.com',
      estado: 'activo',
      tipo: 'usuario',
      intentosFallidos: 0,
      password: 'hashed_password',
      roles: [{
        id: '2',
        nombre: 'Editor',
        descripcion: 'Rol con permisos de edición',
        color: '#00FF00',
        tipo: 'usuario',
        fechaCreacion: new Date('2023-01-01'),
        activo: true
      }],
      fechaCreacion: new Date('2023-01-01'),
    },
    estadoAnterior: 'Administrador',
    estadoNuevo: 'Editor',
    fechaHoraCambio: new Date('2023-03-01T09:15:00'),
    realizadoPor: {
      id: '2',
      nombre: 'María',
      apellido: 'González',
      email: 'maria.gonzalez@example.com',
      estado: 'activo',
      tipo: 'usuario',
      intentosFallidos: 0,
      password: 'hashed_password',
      roles: [{
        id: '1',
        nombre: 'Administrador',
        descripcion: 'Rol con acceso total al sistema',
        color: '#FF0000',
        tipo: 'admin',
        fechaCreacion: new Date('2023-01-01'),
        activo: true
      }],
      fechaCreacion: new Date('2023-01-01'),
    },
    motivoCambio: 'Cambio de responsabilidades',
    tipoAccion: 'cambio_rol',
  },
];

// Datos de ejemplo para el historial de estados de usuario
export const historialEstadosReporte: HistorialEstadoReporte[] = [
  {
    id: '1',
    idReporte: {
      id: '1',
      titulo: 'Reporte de prueba',
      descripcion: 'Descripción del reporte',
      ubicacion: {
        id: '1',
        latitud: 12.345678, 
        longitud: 12.345678,
        direccion: 'Calle Falsa 123',
        referencia: 'A 50 metros de la estación de tren',
        fechaCreacion: new Date('2023-01-01'),
        activo: true
      },  
      categoria: {
        id: '1',
        nombre: 'Incendio',
        descripcion: 'Incendio en la calle Falsa 123',
        color: '#FF0000',
        fechaCreacion: new Date('2023-01-01'),
        activo: true,
        icono: 'fas fa-fire'
      },    
      estado: {
        id: '1',
        nombre: 'Pendiente',
        descripcion: 'Reporte pendiente de atención',
        color: '#FF0000',
        fechaCreacion: new Date('2023-01-01'),
        activo: true,
        icono: 'fas fa-exclamation-triangle'
      },  
      fechaInicio: new Date('2023-01-01'),
      fechaFinalizacion: new Date('2023-01-01'),
      usuarioCreador: {
        id: '1',
        nombre: 'Juan',
        apellido: 'Pérez',  
        email: 'juan.perez@example.com',
        roles: [{
          id: '1',
          nombre: 'Administrador',
          descripcion: 'Rol con acceso total al sistema',
          color: '#FF0000', 
          tipo: 'admin',
          fechaCreacion: new Date('2023-01-01'),
          activo: true
        }],
        fechaCreacion: new Date('2023-01-01'),
        estado: 'activo',
        tipo: 'usuario',
        intentosFallidos: 0,
        password: 'hashed_password',
      },  
      historialAsignaciones: [],
      historialEstados: [],
      fechaCreacion: new Date('2023-01-01'),
      activo: true
    },
    estadoAnterior: 'no_existe',
    estadoNuevo: 'activo',
    fechaHoraCambio: new Date('2023-01-01T10:00:00'),
    realizadoPor: {
      id: '0',
      nombre: 'Sistema',
      apellido: '',
      email: 'sistema@example.com',
      estado: 'activo',
      tipo: 'usuario',
      intentosFallidos: 0,
      password: 'hashed_password',
      roles: [{
        id: '1',
        nombre: 'Administrador',
        descripcion: 'Rol con acceso total al sistema',
        color: '#FF0000',
        tipo: 'admin',
        fechaCreacion: new Date('2023-01-01'),
        activo: true
      }],
      fechaCreacion: new Date('2023-01-01'),
    },
    tipoAccion: 'creacion',
  },
  {
    id: '2',
    idReporte: {
      id: '1',
      titulo: 'Reporte de prueba',
      descripcion: 'Descripción del reporte',
      ubicacion: {
        id: '1',
        latitud: 12.345678,
        longitud: 12.345678,
        direccion: 'Calle Falsa 123',
        referencia: 'A 50 metros de la estación de tren',
        fechaCreacion: new Date('2023-01-01'),
        activo: true
      },
      categoria: {
        id: '1',
        nombre: 'Incendio',
        descripcion: 'Incendio en la calle Falsa 123',
        color: '#FF0000',
        fechaCreacion: new Date('2023-01-01'),
        activo: true,
        icono: 'fas fa-fire'
      },
      estado: {
        id: '1',
        nombre: 'Pendiente',
        descripcion: 'Reporte pendiente de atención',
        color: '#FF0000',
        fechaCreacion: new Date('2023-01-01'),
        activo: true,
        icono: 'fas fa-exclamation-triangle'
      },
      fechaInicio: new Date('2023-01-01'),
      fechaFinalizacion: new Date('2023-01-01'),
      usuarioCreador: {
        id: '1',
        nombre: 'Juan',
        apellido: 'Pérez',
        email: 'juan.perez@example.com',
        estado: 'activo',
        tipo: 'usuario',
        intentosFallidos: 0,
        password: 'hashed_password',
        roles: [{
          id: '1',
          nombre: 'Administrador',
          descripcion: 'Rol con acceso total al sistema',
          color: '#FF0000',
          tipo: 'admin',
          fechaCreacion: new Date('2023-01-01'),
          activo: true
        }],
        fechaCreacion: new Date('2023-01-01'),
      },
      historialAsignaciones: [],
      historialEstados: [],
      fechaCreacion: new Date('2023-01-01'),
      activo: true
    },
    estadoAnterior: 'activo',
    estadoNuevo: 'inactivo',
    fechaHoraCambio: new Date('2023-02-15T15:30:00'),
    realizadoPor: {
      id: '2',
      nombre: 'María',
      apellido: 'González',
      email: 'maria.gonzalez@example.com',
      estado: 'activo',
      tipo: 'usuario',
      intentosFallidos: 0,
      password: 'hashed_password',
      roles: [{
        id: '1',
        nombre: 'Administrador',
        descripcion: 'Rol con acceso total al sistema',
        color: '#FF0000',
        tipo: 'admin',
        fechaCreacion: new Date('2023-01-01'),
        activo: true
      }],
      fechaCreacion: new Date('2023-01-01'),
    },
    motivoCambio: 'Usuario en vacaciones',
    tipoAccion: 'cambio_estado',
  },
];

export const historialEstadosReporteEjemplo: HistorialEstadoReporte[] = [
  {
    id: '1',
    idReporte: {
      id: '1',
      titulo: 'Reporte de prueba',
      descripcion: 'Descripción del reporte',
      estado: {
        id: '1',
        nombre: 'Pendiente',
        color: '#FF0000',
        descripcion: 'Reporte pendiente de atención',
        fechaCreacion: new Date('2023-01-01'),
        activo: true,
        icono: 'clock'
      },
      ubicacion: {
        id: '1',
        latitud: 19.4326,
        longitud: -99.1332,
        direccion: 'Ciudad de México',
        referencia: 'Centro histórico',
        fechaCreacion: new Date('2023-01-01'),
        activo: true
      },
      categoria: {
        id: '1',
        nombre: 'General',
        descripcion: 'Categoría general',
        color: '#000000',
        icono: 'folder',
        fechaCreacion: new Date('2023-01-01'),
        activo: true
      },
      usuarioCreador: {
        id: '1',
        nombre: 'Admin',
        apellido: 'Sistema',
        email: 'admin@example.com',
        estado: 'activo',
        tipo: 'usuario',
        intentosFallidos: 0,
        password: 'hashed_password',
        roles: [{
          id: '1',
          nombre: 'Administrador',
          descripcion: 'Rol con acceso total al sistema',
          color: '#FF0000',
          tipo: 'admin',
          fechaCreacion: new Date('2023-01-01'),
          activo: true
        }],
        fechaCreacion: new Date('2023-01-01')
      },
      historialAsignaciones: [],
      historialEstados: [],
      fechaCreacion: new Date('2023-01-01'),
      fechaActualizacion: new Date('2023-01-02'),
      fechaInicio: new Date('2023-01-01'),
      activo: true
    },
    estadoAnterior: 'Pendiente',
    estadoNuevo: 'En Proceso',
    fechaHoraCambio: new Date('2023-01-02'),
    realizadoPor: {
      id: '1',
      nombre: 'Admin',
      apellido: 'Sistema',
      email: 'admin@example.com',
      estado: 'activo',
      tipo: 'usuario',
      intentosFallidos: 0,
      password: 'hashed_password',
      roles: [{
        id: '1',
        nombre: 'Administrador',
        descripcion: 'Rol con acceso total al sistema',
        color: '#FF0000',
        tipo: 'admin',
        fechaCreacion: new Date('2023-01-01'),
        activo: true
      }],
      fechaCreacion: new Date('2023-01-01')
    },
    motivoCambio: 'Inicio de atención del reporte',
    tipoAccion: 'cambio_estado'
  },
  {
    id: '2',
    idReporte: {
      id: '1',
      titulo: 'Reporte de prueba',
      descripcion: 'Descripción del reporte',
      estado: {
        id: '2',
        nombre: 'En Proceso',
        color: '#FFA500',
        descripcion: 'Reporte en proceso de atención',
        fechaCreacion: new Date('2023-01-01'),
        activo: true,
        icono: 'clock'
      },
      ubicacion: {
        id: '1',
        latitud: 19.4326,
        longitud: -99.1332,
        direccion: 'Ciudad de México',
        referencia: 'Centro histórico',
        fechaCreacion: new Date('2023-01-01'),
        activo: true
      },
      categoria: {
        id: '1',
        nombre: 'General',
        descripcion: 'Categoría general',
        color: '#000000',
        icono: 'folder',
        fechaCreacion: new Date('2023-01-01'),
        activo: true
      },
      usuarioCreador: {
        id: '1',
        nombre: 'Admin',
        apellido: 'Sistema',
        email: 'admin@example.com',
        estado: 'activo',
        tipo: 'usuario',
        intentosFallidos: 0,
        password: 'hashed_password',
        roles: [{
          id: '1',
          nombre: 'Administrador',
          descripcion: 'Rol con acceso total al sistema',
          color: '#FF0000',
          tipo: 'admin',
          fechaCreacion: new Date('2023-01-01'),
          activo: true
        }],
        fechaCreacion: new Date('2023-01-01')
      },
      historialAsignaciones: [],
      historialEstados: [],
      fechaCreacion: new Date('2023-01-01'),
      fechaActualizacion: new Date('2023-01-03'),
      fechaInicio: new Date('2023-01-01'),
      activo: true
    },
    estadoAnterior: 'En Proceso',
    estadoNuevo: 'Resuelto',
    fechaHoraCambio: new Date('2023-01-03'),
    realizadoPor: {
      id: '1',
      nombre: 'Admin',
      apellido: 'Sistema',
      email: 'admin@example.com',
      estado: 'activo',
      tipo: 'usuario',
      intentosFallidos: 0,
      password: 'hashed_password',
      roles: [{
        id: '1',
        nombre: 'Administrador',
        descripcion: 'Rol con acceso total al sistema',
        color: '#FF0000',
        tipo: 'admin',
        fechaCreacion: new Date('2023-01-01'),
        activo: true
      }],
      fechaCreacion: new Date('2023-01-01')
    },
    motivoCambio: 'Reporte resuelto satisfactoriamente',
    tipoAccion: 'cambio_estado'
  }
];

export const historialEstadosCategoria: HistorialEstadoCategoria[] = [
  {
    id: '1',
    idCategoria: {
      id: '1',
      nombre: 'Incendio',
      descripcion: 'Incendio en la calle Falsa 123',
      color: '#FF0000',
      fechaCreacion: new Date('2023-01-01'),
      activo: true,
      icono: 'fas fa-fire'
    },
    estadoAnterior: 'no_existe',
    estadoNuevo: 'activo',
    fechaHoraCambio: new Date('2023-01-01T10:00:00'),
    realizadoPor: {
      id: '0',
      nombre: 'Sistema',
      apellido: '',
      email: 'sistema@example.com',
      estado: 'activo',
      tipo: 'usuario',
      intentosFallidos: 0,
      password: 'hashed_password',
      roles: [{
        id: '1',
        nombre: 'Administrador',
        descripcion: 'Rol con acceso total al sistema',
        color: '#FF0000',
        tipo: 'admin',
        fechaCreacion: new Date('2023-01-01'),
        activo: true
      }],
      fechaCreacion: new Date('2023-01-01'),
    },
    tipoAccion: 'creacion',
  },
  {
    id: '2',
    idCategoria: {
      id: '1',
      nombre: 'Incendio',
      descripcion: 'Incendio en la calle Falsa 123',
      color: '#FF0000',
      fechaCreacion: new Date('2023-01-01'),
      activo: false,
      icono: 'fas fa-fire'
    },
    estadoAnterior: 'activo',
    estadoNuevo: 'inactivo',
    fechaHoraCambio: new Date('2023-02-15T15:30:00'),
    realizadoPor: {
      id: '2',
      nombre: 'María',
      apellido: 'González',
      email: 'maria.gonzalez@example.com',
      estado: 'activo',
      tipo: 'usuario',
      intentosFallidos: 0,
      password: 'hashed_password',
      roles: [{
        id: '1',
        nombre: 'Administrador',
        descripcion: 'Rol con acceso total al sistema',
        color: '#FF0000',
        tipo: 'admin',
        fechaCreacion: new Date('2023-01-01'),
        activo: true
      }],
      fechaCreacion: new Date('2023-01-01'),
    },
    motivoCambio: 'Categoría obsoleta',
    tipoAccion: 'cambio_estado',
  },
  {
    id: '3',
    idCategoria: {
      id: '1',
      nombre: 'Incendio',
      descripcion: 'Incendio en la calle Falsa 123',
      color: '#FF0000',
      fechaCreacion: new Date('2023-01-01'),
      activo: true,
      icono: 'fas fa-fire'
    },
    estadoAnterior: 'inactivo',
    estadoNuevo: 'activo',
    fechaHoraCambio: new Date('2023-03-01T09:15:00'),
    realizadoPor: {
      id: '2',
      nombre: 'María',
      apellido: 'González',
      email: 'maria.gonzalez@example.com',
      estado: 'activo',
      tipo: 'usuario',
      intentosFallidos: 0,
      password: 'hashed_password',
      roles: [{
        id: '1',
        nombre: 'Administrador',
        descripcion: 'Rol con acceso total al sistema',
        color: '#FF0000',
        tipo: 'admin',
        fechaCreacion: new Date('2023-01-01'),
        activo: true
      }],
      fechaCreacion: new Date('2023-01-01'),
    },
    motivoCambio: 'Categoría reactivada por demanda',
    tipoAccion: 'cambio_estado',
  }
];

// Datos de ejemplo para el historial de actividades de categorías
export const historialActividadCategoria: HistorialActividadCategoria[] = [
  {
    id: '1',
    categoria: categorias[0],
    tipoActividad: 'creacion',
    descripcion: 'Creación de la categoría',
    fechaActividad: new Date('2023-01-01T10:00:00'),
    usuarioResponsable: usuarios[0],
    detalles: {
      comentario: 'Categoría creada correctamente'
    },
    activo: true
  },
  {
    id: '2',
    categoria: categorias[0],
    tipoActividad: 'modificacion',
    descripcion: 'Actualización del nombre de la categoría',
    fechaActividad: new Date('2023-01-15T14:30:00'),
    usuarioResponsable: usuarios[1],
    detalles: {
      campo: 'nombre',
      valorAnterior: 'Categoría antigua',
      valorNuevo: categorias[0].nombre,
      comentario: 'Se actualizó el nombre para mayor claridad'
    },
    activo: true
  },
  {
    id: '3',
    categoria: categorias[1],
    tipoActividad: 'cambio_estado',
    descripcion: 'Cambio de estado de la categoría',
    fechaActividad: new Date('2023-02-05T09:15:00'),
    usuarioResponsable: usuarios[0],
    detalles: {
      campo: 'activo',
      valorAnterior: 'false',
      valorNuevo: 'true',
      comentario: 'Se reactivó la categoría por demanda de usuarios'
    },
    activo: true
  },
  {
    id: '4',
    categoria: categorias[2],
    tipoActividad: 'eliminacion',
    descripcion: 'Eliminación lógica de la categoría',
    fechaActividad: new Date('2023-03-10T16:45:00'),
    usuarioResponsable: usuarios[1],
    detalles: {
      comentario: 'Categoría eliminada por obsolescencia'
    },
    activo: true
  }
];

// Datos de ejemplo para el historial de estados de roles
export const historialEstadosRol: HistorialEstadoRol[] = [
  {
    id: '1',
    idRol: roles[0], // Administrador
    estadoAnterior: 'no_existe',
    estadoNuevo: 'activo',
    fechaHoraCambio: new Date('2023-01-01T08:00:00'),
    realizadoPor: usuarios[0], // Admin Sistema
    tipoAccion: 'creacion'
  },
  {
    id: '2',
    idRol: roles[1], // Supervisor
    estadoAnterior: 'no_existe',
    estadoNuevo: 'activo',
    fechaHoraCambio: new Date('2023-01-01T08:15:00'),
    realizadoPor: usuarios[0], // Admin Sistema
    tipoAccion: 'creacion'
  },
  {
    id: '3',
    idRol: roles[2], // Operador
    estadoAnterior: 'no_existe',
    estadoNuevo: 'activo',
    fechaHoraCambio: new Date('2023-01-01T08:30:00'),
    realizadoPor: usuarios[0], // Admin Sistema
    tipoAccion: 'creacion'
  },
  {
    id: '4',
    idRol: roles[3], // Ciudadano
    estadoAnterior: 'no_existe',
    estadoNuevo: 'activo',
    fechaHoraCambio: new Date('2023-01-01T08:45:00'),
    realizadoPor: usuarios[0], // Admin Sistema
    tipoAccion: 'creacion'
  },
  {
    id: '5',
    idRol: roles[1], // Supervisor
    estadoAnterior: 'activo',
    estadoNuevo: 'inactivo',
    fechaHoraCambio: new Date('2023-02-15T14:30:00'),
    realizadoPor: usuarios[0], // Admin Sistema
    motivoCambio: 'Rol temporalmente suspendido',
    tipoAccion: 'cambio_estado'
  },
  {
    id: '6',
    idRol: roles[1], // Supervisor
    estadoAnterior: 'inactivo',
    estadoNuevo: 'activo',
    fechaHoraCambio: new Date('2023-03-01T10:15:00'),
    realizadoPor: usuarios[0], // Admin Sistema
    motivoCambio: 'Rol reactivado por necesidad operativa',
    tipoAccion: 'cambio_estado'
  },
  {
    id: '7',
    idRol: roles[2], // Operador
    estadoAnterior: 'Operador',
    estadoNuevo: 'Técnico de Campo',
    fechaHoraCambio: new Date('2023-03-15T09:30:00'),
    realizadoPor: usuarios[0], // Admin Sistema
    motivoCambio: 'Actualización de nombre de rol para mayor claridad',
    tipoAccion: 'actualizacion'
  }
];

// Datos de ejemplo para el historial de estados
export const historialEstados: HistorialEstado[] = [
  {
    id: '1',
    idEstado: estadosReporte[0], // Pendiente
    estadoAnterior: 'no_existe',
    estadoNuevo: 'activo',
    fechaHoraCambio: new Date('2023-01-01T08:00:00'),
    realizadoPor: usuarios[0], // Admin Sistema
    tipoAccion: 'creacion'
  },
  {
    id: '2',
    idEstado: estadosReporte[1], // En revisión
    estadoAnterior: 'no_existe',
    estadoNuevo: 'activo',
    fechaHoraCambio: new Date('2023-01-01T08:15:00'),
    realizadoPor: usuarios[0], // Admin Sistema
    tipoAccion: 'creacion'
  },
  {
    id: '3',
    idEstado: estadosReporte[2], // En proceso
    estadoAnterior: 'no_existe',
    estadoNuevo: 'activo',
    fechaHoraCambio: new Date('2023-01-01T08:30:00'),
    realizadoPor: usuarios[0], // Admin Sistema
    tipoAccion: 'creacion'
  },
  {
    id: '4',
    idEstado: estadosReporte[3], // Resuelto
    estadoAnterior: 'no_existe',
    estadoNuevo: 'activo',
    fechaHoraCambio: new Date('2023-01-01T08:45:00'),
    realizadoPor: usuarios[0], // Admin Sistema
    tipoAccion: 'creacion'
  },
  {
    id: '5',
    idEstado: estadosReporte[4], // Cancelado
    estadoAnterior: 'no_existe',
    estadoNuevo: 'activo',
    fechaHoraCambio: new Date('2023-01-01T09:00:00'),
    realizadoPor: usuarios[0], // Admin Sistema
    tipoAccion: 'creacion'
  },
  {
    id: '6',
    idEstado: estadosReporte[1], // En revisión
    estadoAnterior: 'activo',
    estadoNuevo: 'inactivo',
    fechaHoraCambio: new Date('2023-02-15T14:30:00'),
    realizadoPor: usuarios[0], // Admin Sistema
    motivoCambio: 'Estado temporalmente suspendido para mantenimiento',
    tipoAccion: 'cambio_estado'
  },
  {
    id: '7',
    idEstado: estadosReporte[1], // En revisión
    estadoAnterior: 'inactivo',
    estadoNuevo: 'activo',
    fechaHoraCambio: new Date('2023-03-01T10:15:00'),
    realizadoPor: usuarios[0], // Admin Sistema
    motivoCambio: 'Estado reactivado tras mantenimiento',
    tipoAccion: 'cambio_estado'
  },
  {
    id: '8',
    idEstado: estadosReporte[2], // En proceso
    estadoAnterior: 'En proceso',
    estadoNuevo: 'En ejecución',
    fechaHoraCambio: new Date('2023-03-15T09:30:00'),
    realizadoPor: usuarios[0], // Admin Sistema
    motivoCambio: 'Actualización de nombre para mayor claridad',
    tipoAccion: 'actualizacion'
  }
]; 
