
import { ActividadUsuario, ActividadReporte, ActividadCategoria } from '@/types/tipos';
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
