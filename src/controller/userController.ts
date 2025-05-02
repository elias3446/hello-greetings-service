import { Usuario } from '../types/tipos';
import { usuarios } from '../data/usuarios';
import { filterReports, updateReport } from '@/controller/reportController';

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
    const updatedUser = { ...usuarios[index], ...userData };
    usuarios[index] = updatedUser;

    // Si el estado del usuario cambia a 'bloqueado' o 'inactivo', desasignar sus reportes
    if (userData.estado && (userData.estado === 'bloqueado' || userData.estado === 'inactivo')) {
      const reportesAsignados = filterReports({ userId: id });
      reportesAsignados.forEach(reporte => {
        updateReport(reporte.id, { asignadoA: undefined });
      });
    }

    return updatedUser;
  }
  return undefined;
};

// Eliminar un usuario
export const deleteUser = (id: string): boolean => {
  const index = usuarios.findIndex((user) => user.id === id);
  if (index !== -1) {
    // Desasignar todos los reportes del usuario antes de eliminarlo
    const reportesAsignados = filterReports({ userId: id });
    reportesAsignados.forEach(reporte => {
      updateReport(reporte.id, { asignadoA: undefined });
    });

    usuarios.splice(index, 1);
    return true;
  }
  return false;
};
