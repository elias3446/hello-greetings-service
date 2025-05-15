import { Usuario } from "@/types/tipos";
import { registrarCambioHistorial } from "@/controller/CRUD/user/historialUsuario";
import { registrarCambioEstado } from "@/controller/CRUD/user/historialEstadosUsuario";
import { getSystemUser } from "@/utils/userUtils";
import { createUser } from "@/controller/CRUD/user/userController";

/**
 * Crea un nuevo usuario en el sistema, asignando valores por defecto si es necesario,
 * y registra los cambios iniciales en los historiales correspondientes.
 * 
 * @param userData - Datos parciales para crear el usuario (nombre es obligatorio)
 * @throws Error si faltan campos requeridos
 * @returns Promise<Usuario> - El usuario creado
 */
export const crearUsuario = async (userData: Partial<Usuario>): Promise<Usuario> => {
  if (!userData.nombre || userData.nombre.trim() === '') {
    throw new Error("Campo requerido: 'nombre' es obligatorio y no puede estar vacío.");
  }

  // Asignar valores por defecto para los campos faltantes
  const datosCompletos: Omit<Usuario, 'id'> = {
    nombre: userData.nombre.trim(),
    apellido: userData.apellido?.trim() ?? '',
    email: userData.email?.trim() ?? `${userData.nombre.toLowerCase()}@example.com`,
    password: userData.password ?? `${userData.nombre.toLowerCase()}@example.com`,
    estado: userData.estado ?? 'activo',
    roles: userData.roles ?? [],
    fechaCreacion: userData.fechaCreacion ?? new Date(),
    tipo: userData.tipo ?? 'usuario',
    intentosFallidos: userData.intentosFallidos ?? 0,
  };

  try {
    // Crear usuario en base de datos
    const nuevoUsuario = await createUser(datosCompletos);

    // Registrar el cambio de estado inicial en historial de estados
    await registrarCambioEstado(
      nuevoUsuario,
      'no_existe',                 // Estado anterior ficticio
      nuevoUsuario.estado,         // Estado actual
      getSystemUser(),             // Usuario sistema que realiza el cambio
      'Usuario creado en el sistema',
      'creacion'
    );

    // Registrar evento de creación en historial general de usuario
    await registrarCambioHistorial(
      nuevoUsuario.id,
      'creacion',
      'Usuario creado en el sistema',
      new Date(),
      nuevoUsuario.id
    );

    return nuevoUsuario;

  } catch (error) {
    console.error('Error al crear usuario:', error);
    throw new Error('No se pudo crear el usuario. Inténtalo nuevamente.');
  }
};
