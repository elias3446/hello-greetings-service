import { Usuario } from '@/types/tipos';
import { UserFormData } from '@/types/user';
import { registrarCambioEstado } from '@/controller/CRUD/historialEstadosUsuario';
import { registrarCambioEstadoReporte } from '@/controller/CRUD/historialEstadosReporte';
import { filterReports } from '@/controller/CRUD/reportController';

// Ordenar usuarios
export const sortUsers = (users: Usuario[], sortBy: string, direction: 'asc' | 'desc'): Usuario[] => {
  const sortedUsers = [...users];
  
  sortedUsers.sort((a, b) => {
    let comparison = 0;
    
    switch (sortBy) {
      case 'nombre':
        comparison = (a.nombre + ' ' + a.apellido).localeCompare(b.nombre + ' ' + b.apellido);
        break;
      case 'email':
        comparison = a.email.localeCompare(b.email);
        break;
      case 'rol':
        const rolA = a.roles[0]?.nombre || '';
        const rolB = b.roles[0]?.nombre || '';
        comparison = rolA.localeCompare(rolB);
        break;
      case 'fecha':
        const fechaA = a.fechaCreacion instanceof Date ? a.fechaCreacion : new Date(a.fechaCreacion);
        const fechaB = b.fechaCreacion instanceof Date ? b.fechaCreacion : new Date(b.fechaCreacion);
        comparison = fechaA.getTime() - fechaB.getTime();
        break;
      default:
        comparison = 0;
    }

    return direction === 'asc' ? comparison : -comparison;
  });
  
  return sortedUsers;
};

export const hasUserChanges = (usuarioAnterior: Usuario, newData: UserFormData): boolean => {
  return (
    usuarioAnterior.nombre !== newData.nombre ||
    usuarioAnterior.apellido !== newData.apellido ||
    usuarioAnterior.email !== newData.email ||
    usuarioAnterior.password !== newData.password ||
    usuarioAnterior.estado !== newData.estado ||
    usuarioAnterior.tipo !== newData.tipo ||
    JSON.stringify(usuarioAnterior.roles.map(r => r.id)) !== JSON.stringify(newData.roles)
  );
};

export const getSystemUser = (): Usuario => ({
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
});

export const handleUserStateChange = async (
  usuarioActualizado: Usuario,
  usuarioAnterior: Usuario
): Promise<void> => {
  await registrarCambioEstado(
    usuarioActualizado,
    usuarioAnterior.estado,
    usuarioActualizado.estado,
    usuarioActualizado,
    `Usuario ${usuarioActualizado.estado === 'activo' ? 'activado' : 'desactivado'} por ${usuarioActualizado.nombre} ${usuarioActualizado.apellido}`,
    'cambio_estado'
  );

  const reportesAsignados = filterReports({ userId: usuarioAnterior.id });
  for (const reporte of reportesAsignados) {
    await registrarCambioEstadoReporte(
      reporte,
      `Usuario ${usuarioAnterior.estado}`,
      `Usuario ${usuarioActualizado.estado}`,
      usuarioActualizado,
      `Usuario ${usuarioActualizado.estado === 'activo' ? 'activado' : 'desactivado'} por ${usuarioActualizado.nombre} ${usuarioActualizado.apellido}`,
      'cambio_estado'
    );
  }
};
