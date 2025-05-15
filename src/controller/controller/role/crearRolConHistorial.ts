import { Rol, Usuario } from '@/types/tipos';
import { createRole, getRoleById } from '../../CRUD/role/roleController';
import { createHistorialEstadoRol } from '../../CRUD/role/historialEstadoRolController';
import { toast } from '@/components/ui/sonner';

/**
 * Crea un nuevo rol y registra su creación en el historial de estados
 * 
 * @param rolData - Datos del nuevo rol
 * @param usuario - Usuario que realiza la creación
 * @param comentario - Comentario opcional sobre la creación
 * @returns Promise con el rol creado o null si ocurrió un error
 */
export const crearRolConHistorial = async (
  rolData: Omit<Rol, 'id'>,
  usuario: Usuario,
  comentario?: string
): Promise<Rol | null> => {
  try {
    // 1. Validar datos mínimos necesarios
    if (!rolData.nombre) {
      toast.error('El nombre del rol es obligatorio');
      return null;
    }

    // Asegurar que se incluyan los campos necesarios con valores por defecto
    const datosCompletos: Omit<Rol, 'id'> = {
      ...rolData,
      fechaCreacion: rolData.fechaCreacion || new Date(),
      activo: rolData.activo !== undefined ? rolData.activo : true,
      permisos: rolData.permisos || [],
      tipo: rolData.tipo || 'usuario'
    };

    // 2. Crear el rol
    const nuevoRol = createRole(datosCompletos);

    if (!nuevoRol) {
      throw new Error('Error al crear el rol');
    }

    // 3. Registrar la creación en el historial de estados de roles
    const descripcionCambio = comentario || `Creación del rol "${nuevoRol.nombre}"`;
    
    const historialCreado = createHistorialEstadoRol(
      nuevoRol.id,
      'no_existe', // Estado anterior
      nuevoRol.activo ? 'activo' : 'inactivo', // Estado nuevo
      usuario.id,
      'creacion', // Tipo de acción
      descripcionCambio
    );

    if (!historialCreado) {
      console.warn('No se pudo registrar el historial de la creación del rol');
    }

    toast.success(`Rol "${nuevoRol.nombre}" creado correctamente`);
    return nuevoRol;
  } catch (error) {
    console.error('Error en crearRolConHistorial:', error);
    toast.error('Error al crear el rol');
    return null;
  }
};

/**
 * Crea un rol duplicando uno existente
 * 
 * @param idRolBase - ID del rol a duplicar
 * @param nuevoNombre - Nombre para el nuevo rol
 * @param usuario - Usuario que realiza la operación
 * @param comentario - Comentario opcional sobre la creación
 * @returns Promise con el nuevo rol o null si ocurrió un error
 */
export const duplicarRol = async (
  idRolBase: string,
  nuevoNombre: string,
  usuario: Usuario,
  comentario?: string
): Promise<Rol | null> => {
  try {
    // 1. Obtener el rol base
    const rolBase = getRoleById(idRolBase);
    
    if (!rolBase) {
      toast.error('No se encontró el rol a duplicar');
      return null;
    }

    // 2. Preparar los datos del nuevo rol (eliminando el id y fechas específicas)
    const datosNuevoRol: Omit<Rol, 'id'> = {
      nombre: nuevoNombre,
      descripcion: `${rolBase.descripcion} (copia)`,
      permisos: rolBase.permisos,
      color: rolBase.color,
      tipo: rolBase.tipo,
      fechaCreacion: new Date(),
      activo: true
    };

    // 3. Crear el nuevo rol con historial
    const comentarioFinal = comentario || 
      `Rol creado como duplicado de "${rolBase.nombre}"`;
    
    return await crearRolConHistorial(
      datosNuevoRol,
      usuario,
      comentarioFinal
    );
  } catch (error) {
    console.error('Error en duplicarRol:', error);
    toast.error('Error al duplicar el rol');
    return null;
  }
};

/**
 * Crea uno o más roles a partir de una plantilla predefinida
 * 
 * @param tipoPlantilla - Tipo de plantilla a usar ('basico', 'intermedio', 'completo')
 * @param usuario - Usuario que realiza la creación
 * @returns Promise con array de roles creados
 */
export const crearRolesDesdeTemplates = async (
  tipoPlantilla: 'basico' | 'intermedio' | 'completo',
  usuario: Usuario
): Promise<Rol[]> => {
  const rolesCreados: Rol[] = [];

  try {
    // Cargar los permisos disponibles
    const permisosDisponibles = require('@/data/permisos').permisosDisponibles;
    
    // Definir templates de roles según el tipo solicitado
    const templates: Omit<Rol, 'id'>[] = [];
    
    if (tipoPlantilla === 'basico' || tipoPlantilla === 'intermedio' || tipoPlantilla === 'completo') {
      // Siempre incluir el rol básico de visualizador
      templates.push({
        nombre: 'Visualizador',
        descripcion: 'Puede ver información pero no modificarla',
        permisos: permisosDisponibles.filter(p => p.id.startsWith('ver_')),
        color: '#6B7280', // Gris
        tipo: 'usuario',
        fechaCreacion: new Date(),
        activo: true
      });
    }
    
    if (tipoPlantilla === 'intermedio' || tipoPlantilla === 'completo') {
      // Añadir rol de editor
      templates.push({
        nombre: 'Editor',
        descripcion: 'Puede ver y editar información existente',
        permisos: permisosDisponibles.filter(p => 
          p.id.startsWith('ver_') || 
          p.id.startsWith('editar_')
        ),
        color: '#10B981', // Verde
        tipo: 'usuario',
        fechaCreacion: new Date(),
        activo: true
      });
    }
    
    if (tipoPlantilla === 'completo') {
      // Añadir rol de gestor
      templates.push({
        nombre: 'Gestor',
        descripcion: 'Puede crear, editar y gestionar la mayoría de contenidos',
        permisos: permisosDisponibles.filter(p => 
          !p.id.includes('admin_') && 
          !p.id.includes('eliminar_usuario')
        ),
        color: '#3B82F6', // Azul
        tipo: 'usuario',
        fechaCreacion: new Date(),
        activo: true
      });
    }

    // Crear roles desde los templates
    for (const template of templates) {
      const rolCreado = await crearRolConHistorial(
        template,
        usuario,
        `Rol creado automáticamente desde plantilla de tipo "${tipoPlantilla}"`
      );
      
      if (rolCreado) {
        rolesCreados.push(rolCreado);
      }
    }

    if (rolesCreados.length > 0) {
      toast.success(`Se crearon ${rolesCreados.length} roles desde la plantilla "${tipoPlantilla}"`);
    } else {
      toast.warning('No se pudo crear ningún rol desde la plantilla');
    }

    return rolesCreados;
  } catch (error) {
    console.error('Error en crearRolesDesdeTemplates:', error);
    toast.error('Error al crear roles desde plantillas');
    return rolesCreados;
  }
}; 