// Datos de ejemplo para reportes
import { Reporte, Ubicacion } from '../types/tipos';
import { historialAsignaciones } from './actividades';
import { categorias, prioridades } from './categorias';
import { estadosReporte } from './estadosReporte';
import { usuarios } from './usuarios';

export const reportes: Reporte[] = [
  {
    id: '1',
    titulo: 'Bache en calle principal',
    descripcion: 'Bache grande en la calle principal que representa un peligro para los vehículos',
    ubicacion: {
      id: '1',
      direccion: 'Calle Principal 123',
      latitud: 19.4326,
      longitud: -99.1332,
      referencia: 'Calle Principal 123',
      fechaCreacion: new Date('2024-01-15'),
      activo: true
    },
    categoria: categorias[0],
    estado: estadosReporte[0],
    prioridad: prioridades[0],
    imagenes: ['https://picsum.photos/300/200?random=1'],
    fechaCreacion: new Date('2024-01-15'),
    usuarioCreador: usuarios[0],
    asignadoA: usuarios[1],
    historialAsignaciones: [historialAsignaciones[0]],
    fechaInicio: new Date('2024-01-15'),
    activo: true
  },
  {
    id: '2',
    titulo: 'Poste de luz caído',
    descripcion: 'Poste de luz caído en la esquina de la calle secundaria',
    ubicacion: {
      id: '2',
      direccion: 'Calle Secundaria 456',
      latitud: 19.4327,
      longitud: -99.1333,
      referencia: 'Calle Secundaria 456',
      fechaCreacion: new Date('2024-01-16'),
      activo: true
    },
    categoria: categorias[1],
    estado: estadosReporte[1],
    prioridad: prioridades[1],
    imagenes: ['https://picsum.photos/300/200?random=2'],
    fechaCreacion: new Date('2024-01-16'),
    usuarioCreador: usuarios[2],
    asignadoA: usuarios[3],
    historialAsignaciones: [historialAsignaciones[0]],
    fechaInicio: new Date('2024-01-16'),
    activo: true
  },
  {
    id: '3',
    titulo: 'Basura acumulada',
    descripcion: 'Acumulación de basura en el parque local',
    ubicacion: {
      id: '3',
      direccion: 'Parque Central',
      latitud: 19.4328,
      longitud: -99.1334,
      referencia: 'Parque Central',
      fechaCreacion: new Date('2024-01-17'),
      activo: true
    },
    categoria: categorias[2],
    estado: estadosReporte[2],
    prioridad: prioridades[2],
    imagenes: ['https://picsum.photos/300/200?random=3'],
    fechaCreacion: new Date('2024-01-17'),
    usuarioCreador: usuarios[3],
    asignadoA: usuarios[4],
    historialAsignaciones: [historialAsignaciones[0]],
    fechaInicio: new Date('2024-01-17'),
    activo: true
  },
  {
    id: '4',
    titulo: 'Poste dañado',
    descripcion: 'Poste de teléfono dañado y peligroso',
    ubicacion: {  
      id: '4',
      direccion: 'Avenida Principal 789',
      latitud: 19.4329,
      longitud: -99.1335,
      referencia: 'Avenida Principal 789',
      fechaCreacion: new Date('2024-01-18'),
      activo: true
    },
    categoria: categorias[3],
    estado: estadosReporte[3],
    prioridad: prioridades[2],
    imagenes: ['https://picsum.photos/300/200?random=4'],
    fechaCreacion: new Date('2024-01-18'),
    usuarioCreador: usuarios[4],
    asignadoA: usuarios[0],
    historialAsignaciones: [historialAsignaciones[0]],
    fechaInicio: new Date('2024-01-18'),
    activo: true
  },
  {
    id: '5',
    titulo: 'Grafiti en pared',
    descripcion: 'Grafiti no autorizado en pared de edificio público',
    ubicacion: {
      id: '5',
      direccion: 'Edificio Municipal',
      latitud: 19.4330,
      longitud: -99.1336,
      referencia: 'Edificio Municipal',
      fechaCreacion: new Date('2024-01-19'),
      activo: true
    },
    categoria: categorias[4],
    estado: estadosReporte[4],
    prioridad: prioridades[2],
    imagenes: ['https://picsum.photos/300/200?random=5'],
    fechaCreacion: new Date('2024-01-19'),
    usuarioCreador: usuarios[0],
    asignadoA: usuarios[1],
    historialAsignaciones: [historialAsignaciones[0]],
    fechaInicio: new Date('2024-01-19'),
    activo: true
  },
  {
    id: '6',
    titulo: 'Grafiti en pared',
    descripcion: 'Grafiti no autorizado en pared de edificio público',
    ubicacion: {
      id: '6',
      direccion: 'Edificio Municipal',
      latitud: 19.4331,
      longitud: -99.1337,
      referencia: 'Edificio Municipal',
      fechaCreacion: new Date('2024-01-20'),  
      activo: true
    },
    categoria: categorias[4],
    estado: estadosReporte[4],
    prioridad: prioridades[2],
    imagenes: ['https://picsum.photos/300/200?random=6'],
    fechaCreacion: new Date('2024-01-20'),
    usuarioCreador: usuarios[1],
    asignadoA: usuarios[2],
    historialAsignaciones: [historialAsignaciones[0]],
    fechaInicio: new Date('2024-01-20'),
    activo: true
  } 

];
