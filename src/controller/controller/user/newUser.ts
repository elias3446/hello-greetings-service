import { Usuario } from "@/types/tipos";
import { registrarCambioHistorial } from "@/controller/CRUD/historialUsuario";
import { registrarCambioEstado } from "@/controller/CRUD/historialEstadosUsuario";
import { getSystemUser } from "@/utils/userUtils";
import { createUser } from "@/controller/CRUD/userController";

/**
 * Función para crear un nuevo usuario en el sistema
 * @param userData Datos parciales del usuario a crear
 */
export const crearUsuario = async (userData: Partial<Usuario>) => {
  if (!userData.nombre) {
    throw new Error("Faltan campos requeridos: nombre es obligatorio");
  }

  // Asignamos valores por defecto si no se proporcionan
  const datosCompletos: Omit<Usuario, 'id'> = {
    nombre: userData.nombre,
    apellido: userData.apellido ?? '',
    email: userData.email ?? `${userData.nombre}@example.com`,
    password: userData.password ?? `${userData.nombre}@example.com`,
    estado: userData.estado ?? 'activo',
    roles: userData.roles ?? [],
    fechaCreacion: userData.fechaCreacion ?? new Date(),
    tipo: userData.tipo ?? 'usuario',
    intentosFallidos: userData.intentosFallidos ?? 0,
  };

  // Creamos el usuario en la base de datos
  const nuevoUsuario = await createUser(datosCompletos);

  // Registramos el cambio de estado inicial en el historial de estados
  await registrarCambioEstado(
    nuevoUsuario,
    'no_existe',
    nuevoUsuario.estado,
    getSystemUser(),
    'Usuario creado en el sistema',
    'creacion'
  );

  // Registramos el evento de creación en el historial de cambios
  await registrarCambioHistorial(
    nuevoUsuario.id,
    'creacion',
    'Usuario creado en el sistema',
    new Date(),
    nuevoUsuario.id
  );
};
