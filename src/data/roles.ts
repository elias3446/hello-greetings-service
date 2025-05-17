
import { Rol } from '../types/tipos';
import { permisosDisponibles } from './permisos';

const todosLosPermisos = permisosDisponibles.map(permiso => permiso.id);

export const roles: Rol[] = [
  {
    id: '1',
    nombre: 'Administrador',
    descripcion: 'Control total del sistema',
    permisos: todosLosPermisos.map(id => permisosDisponibles.find(permiso => permiso.id === id)),
    color: '#EF4444',  // Red color
    tipo: 'admin',
    fechaCreacion: new Date('2025-04-25T08:30:00'),
    activo: true,
  },
  {
    id: '2',
    nombre: 'Supervisor',
    descripcion: 'Gestiona reportes y usuarios',
    permisos: permisosDisponibles.filter(permiso => permiso.id === 'ver_usuario' || permiso.id === 'crear_reporte' || permiso.id === 'editar_reporte' || permiso.id === 'ver_reporte' || permiso.id === 'ver_categoria' || permiso.id === 'editar_estado' || permiso.id === 'ver_estado' || permiso.id === 'ver_rol'),
    color: '#3B82F6',  // Blue color
    tipo: 'usuario',
    fechaCreacion: new Date('2025-04-25T08:30:00'),
    activo: true,
  },
  {
    id: '3',
    nombre: 'Operador',
    descripcion: 'Procesa reportes asignados',
    permisos: permisosDisponibles.filter(permiso => permiso.id === 'ver_usuario' || permiso.id === 'editar_reporte' || permiso.id === 'ver_reporte' || permiso.id === 'ver_categoria' || permiso.id === 'ver_estado' || permiso.id === 'ver_rol'),
    color: '#10B981',  // Green color
    tipo: 'usuario',
    fechaCreacion: new Date('2025-04-25T08:30:00'),
    activo: true,
  },
  {
    id: '4',
    nombre: 'Ciudadano',
    descripcion: 'Crea y ve sus propios reportes',
    permisos: permisosDisponibles.filter(permiso => permiso.id === 'ver_usuario' || permiso.id === 'crear_reporte' || permiso.id === 'ver_reporte' || permiso.id === 'ver_categoria' || permiso.id === 'ver_estado'),
    color: '#6B7280',  // Gray color
    tipo: 'usuario',
    fechaCreacion: new Date('2025-04-25T08:30:00'),
    activo: true,
  },
  {
    id: '5',
    nombre: 'Ciudadano',
    descripcion: 'Crea y ve sus propios reportes',
    permisos: permisosDisponibles.filter(permiso => permiso.id === 'ver_usuario' || permiso.id === 'crear_reporte' || permiso.id === 'ver_reporte' || permiso.id === 'ver_categoria' || permiso.id === 'ver_estado'),
    color: '#6B7280',  // Gray color
    tipo: 'usuario',
    fechaCreacion: new Date('2025-04-25T08:30:00'),
    activo: true,
  },  
  {
    id: '6',
    nombre: 'Ciudadano',
    descripcion: 'Crea y ve sus propios reportes',
    permisos: permisosDisponibles.filter(permiso => permiso.id === 'ver_usuario' || permiso.id === 'crear_reporte' || permiso.id === 'ver_reporte' || permiso.id === 'ver_categoria' || permiso.id === 'ver_estado'),
    color: '#6B7280',  // Gray color
    tipo: 'usuario',
    fechaCreacion: new Date('2025-04-25T08:30:00'),
    activo: true,
  },  
];
