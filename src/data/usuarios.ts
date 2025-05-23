// Datos de ejemplo para usuarios
import { Usuario } from '../types/tipos';
import { roles } from './roles';
export const usuarios: Usuario[] = [
  {
    id: '1',
    nombre: 'Admin',
    apellido: 'Sistema',
    email: 'admin@sistema.com',
    roles: [roles[0]],
    fechaCreacion: new Date('2023-01-01'),
    estado: 'activo',
    tipo: 'admin',
    permisos: roles[0].permisos,
    intentosFallidos: 0,
    password: 'admin',
  },
  {
    id: '2',
    nombre: 'Carlos',
    apellido: 'Rodríguez',
    email: 'carlos@ejemplo.com',
    roles: [roles[1]],
    fechaCreacion: new Date('2023-01-15'),
    estado: 'activo',
    tipo: 'usuario',
    permisos: roles[1].permisos,
    intentosFallidos: 0,
    password: 'usuario',
  },
  {
    id: '3',
    nombre: 'María',
    apellido: 'González',
    email: 'maria@ejemplo.com',
    roles: [roles[2]],
    fechaCreacion: new Date('2023-02-05'),
    estado: 'activo',
    tipo: 'usuario',
    permisos: roles[2].permisos,
    intentosFallidos: 0,
    password: 'usuario',
  },
  {
    id: '4',
    nombre: 'Juan',
    apellido: 'Pérez',
    email: 'juan@ejemplo.com',
    roles: [roles[3]],
    fechaCreacion: new Date('2023-02-20'),
    estado: 'activo',
    tipo: 'usuario',
    permisos: roles[3].permisos,
    intentosFallidos: 0,
    password: 'usuario',
  },
  {
    id: '5',
    nombre: 'Laura',
    apellido: 'Sánchez',
    email: 'laura@ejemplo.com',
    roles: [roles[3]],
    fechaCreacion: new Date('2023-03-10'),
    estado: 'inactivo',
    tipo: 'usuario',
    permisos: roles[3].permisos,
    intentosFallidos: 0,
    password: 'usuario',
  },
  {
    id: '6',
    nombre: 'Ana',
    apellido: 'López',
    email: 'ana@ejemplo.com',
    roles: [roles[3]],
    fechaCreacion: new Date('2023-03-25'),
    estado: 'activo',
    tipo: 'usuario',
    permisos: roles[3].permisos,
    intentosFallidos: 0,
    password: 'usuario',
  },  
];
