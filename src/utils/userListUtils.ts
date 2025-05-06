import { Usuario } from '@/types/tipos';
import { ITEMS_PER_PAGE } from './userListConstants';

export const calculatePagination = (usuarios: Usuario[], currentPage: number) => {
  const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
  const currentUsuarios = usuarios.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(usuarios.length / ITEMS_PER_PAGE);

  return {
    currentUsuarios,
    totalPages
  };
};

export const getUniqueRoles = (usuarios: Usuario[]): string[] => {
  return [...new Set(
    usuarios.flatMap(usuario => 
      usuario.roles?.map(rol => rol.nombre) || []
    )
  )];
}; 