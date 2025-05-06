import { Usuario } from '@/types/tipos';

export const normalizeText = (text: string): string => {
  return text
    .toString()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
};

export const getFieldValue = (usuario: Usuario, field: string): string => {
  switch (field) {
    case 'nombre':
      return usuario.nombre + ' ' + usuario.apellido;
    case 'email':
      return usuario.email;
    case 'fecha':
      return new Date(usuario.fechaCreacion).toLocaleDateString('es-ES');
    case 'estado':
      return usuario.estado;
    case 'rol':
      return usuario.roles?.map(rol => rol.nombre).join(', ') || '';
    default:
      return '';
  }
};

export const exportUsuariosToCSV = (usuarios: Usuario[]): void => {
  const data = usuarios.map(usuario => ({
    nombre: usuario.nombre + ' ' + usuario.apellido,
    email: usuario.email,
    rol: usuario.roles?.length > 0 ? usuario.roles[0].nombre : '',
    fechaCreacion: new Date(usuario.fechaCreacion).toLocaleDateString('es-ES'),
    estado: usuario.estado ? 'Activo' : 'Inactivo'
  }));
  
  const csvContent = [
    Object.keys(data[0]).join(','),
    ...data.map(row => Object.values(row).join(','))
  ].join('\n');
  
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', 'usuarios_export.csv');
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}; 