import { ActividadUsuario, ActividadReporte, ActividadCategoria, HistorialAsignacion, HistorialEstadoUsuario, HistorialEstadoReporte, HistorialEstadoCategoria } from '@/types/tipos';
import { usuarios } from './usuarios';
import { reportes } from './reportes';
import { categorias } from './categorias';

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
        tipo: 'pendiente',
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
        tipo: 'pendiente',
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
        tipo: 'pendiente',
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
        tipo: 'en_progreso',
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
