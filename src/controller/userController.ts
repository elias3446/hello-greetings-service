
import { Usuario } from '../types/tipos';
import { usuarios } from '../data/usuarios';

// Obtener todos los usuarios
export const getUsers = (): Usuario[] => {
  return usuarios;
};

// Obtener un usuario por ID
export const getUserById = (id: string): Usuario | undefined => {
  return usuarios.find((user) => user.id === id);
};

// Crear un nuevo usuario
export const createUser = (userData: Omit<Usuario, 'id'>): Usuario => {
  const newUser: Usuario = {
    id: crypto.randomUUID(),
    ...userData,
    fechaCreacion: new Date(),
  };
  usuarios.push(newUser);
  return newUser;
};

// Actualizar un usuario
export const updateUser = (id: string, userData: Partial<Usuario>): Usuario | undefined => {
  const index = usuarios.findIndex((user) => user.id === id);
  if (index !== -1) {
    usuarios[index] = { ...usuarios[index], ...userData };
    return usuarios[index];
  }
  return undefined;
};

// Eliminar un usuario
export const deleteUser = (id: string): boolean => {
  const index = usuarios.findIndex((user) => user.id === id);
  if (index !== -1) {
    usuarios.splice(index, 1);
    return true;
  }
  return false;
};
