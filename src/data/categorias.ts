import { Categoria, Prioridad } from '../types/tipos';
import { FileText, Shield, AlertTriangle, MapPin, Construction } from 'lucide-react';
import { usuarios } from './usuarios';

export const categorias: Categoria[] = [
  {
    id: '1',
    nombre: 'Infraestructura',
    descripcion: 'Problemas relacionados con calles, aceras, puentes, etc.',
    color: '#FF6B6B',
    icono: 'Construction',
    fechaCreacion: new Date('2025-04-25T08:30:00'),
    fechaActualizacion: new Date('2025-04-25T08:30:00'),
    fechaEliminacion: new Date('2025-04-25T08:30:00'),
    usuarioCreador: usuarios[0],
    activo: true,
  },
  {
    id: '2',
    nombre: 'Servicios Públicos',
    descripcion: 'Problemas con electricidad, agua, alcantarillado, etc.',
    color: '#4ECDC4',
    icono: 'Shield',
    fechaCreacion: new Date('2025-04-25T08:30:00'),
    fechaActualizacion: new Date('2025-04-25T08:30:00'),
    fechaEliminacion: new Date('2025-04-25T08:30:00'),
    usuarioCreador: usuarios[0],
    activo: true,
  },
  {
    id: '3',
    nombre: 'Seguridad',
    descripcion: 'Incidentes de seguridad ciudadana',
    color: '#FFD166',
    icono: 'TriangleAlert',
    fechaCreacion: new Date('2025-04-25T08:30:00'),
    fechaActualizacion: new Date('2025-04-25T08:30:00'),
    fechaEliminacion: new Date('2025-04-25T08:30:00'),
    usuarioCreador: usuarios[0],
    activo: true,
  },
  {
    id: '4',
    nombre: 'Medio Ambiente',
    descripcion: 'Problemas ambientales como basura, contaminación, etc.',
    color: '#06D6A0',
    icono: 'MapPin',
    fechaCreacion: new Date('2025-04-25T08:30:00'),
    fechaActualizacion: new Date('2025-04-25T08:30:00'),
    fechaEliminacion: new Date('2025-04-25T08:30:00'),
    usuarioCreador: usuarios[0],
    activo: true,
  },
  {
    id: '5',
    nombre: 'Otros',
    descripcion: 'Problemas que no encajan en las otras categorías',
    color: '#118AB2',
    icono: 'FileText',
    fechaCreacion: new Date('2025-04-25T08:30:00'),
    fechaActualizacion: new Date('2025-04-25T08:30:00'),
    fechaEliminacion: new Date('2025-04-25T08:30:00'),
    usuarioCreador: usuarios[0],
    activo: true,
  },
];

export const prioridades: Prioridad[] = [
  { id: '1', nombre: 'Alta', tipo: 'alta', color: '#DC2626', fechaCreacion: new Date('2025-04-25T08:30:00'), activo: true },
  { id: '2', nombre: 'Media', tipo: 'media', color: '#F97316', fechaCreacion: new Date('2025-04-25T08:30:00'), activo: true },
  { id: '3', nombre: 'Baja', tipo: 'baja', color: '#2563EB', fechaCreacion: new Date('2025-04-25T08:30:00'), activo: true }
];
