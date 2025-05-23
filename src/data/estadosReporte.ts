
// Datos de ejemplo para estados de reporte
import { EstadoReporte } from '../types/tipos';

export const estadosReporte: EstadoReporte[] = [
  {
    id: '1',
    nombre: 'Pendiente',
    descripcion: 'Reporte recibido pero sin asignar',
    color: '#FFD166',
    fechaCreacion: new Date('2025-04-25T08:30:00'),
    activo: true,
    icono: 'TriangleAlert'
  },
  {
    id: '2',
    nombre: 'En revisión',
    descripcion: 'Reporte asignado y en proceso de evaluación',
    color: '#118AB2',
    fechaCreacion: new Date('2025-04-25T08:30:00'),
    activo: true,
    icono: 'Clock'
  },
  {
    id: '3',
    nombre: 'En proceso',
    descripcion: 'El problema está siendo solucionado',
    color: '#06D6A0',
    fechaCreacion: new Date('2025-04-25T08:30:00'),
    activo: true,
    icono: 'Clock'
  },
  {
    id: '4',
    nombre: 'Resuelto',
    descripcion: 'El problema ha sido solucionado',
    color: '#73D2DE',
    fechaCreacion: new Date('2025-04-25T08:30:00'),
    activo: true,
    icono: 'CircleCheckBig'
  },
  {
    id: '5',
    nombre: 'Cancelado',
    descripcion: 'El reporte ha sido cancelado o no procede',
    color: '#EF476F',
    fechaCreacion: new Date('2025-04-25T08:30:00'),
    activo: true,
    icono: 'CircleX'
  },
  {
    id: '6',
    nombre: 'Sin asignar',
    descripcion: 'Reporte sin asignar a ningún usuario',
    color: '#6B7280',
    fechaCreacion: new Date('2025-04-25T08:30:00'),
    activo: true,
    icono: 'CircleX'
  }
];
