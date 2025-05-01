
import { Usuario } from '@/types/tipos';

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
