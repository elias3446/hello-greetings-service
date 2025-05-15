import { Rol, Usuario } from '@/types/tipos';
import { crearRol, obtenerRolPorId } from '../../CRUD/role/roleController';
import { crearHistorialEstadoRol } from '../../CRUD/role/historialEstadoRolController';
import { toast } from '@/components/ui/sonner';

/**
 * Crea un nuevo rol y registra su creación en el historial
 */
export const crearRolConHistorial = async (
  rolData: Omit<Rol, 'id'>,
  usuario: Usuario,
  comentario?: string
): Promise<Rol | null> => {
  try {
    if (!rolData.nombre?.trim()) {
      toast.error('El nombre del rol es obligatorio');
      return null;
    }

    const datos: Omit<Rol, 'id'> = {
      ...rolData,
      fechaCreacion: rolData.fechaCreacion ?? new Date(),
      activo: rolData.activo ?? true,
      permisos: rolData.permisos ?? [],
      tipo: rolData.tipo ?? 'usuario',
    };

    const nuevoRol = crearRol(datos);

    if (!nuevoRol) {
      throw new Error('Error al crear el rol');
    }

    const descripcion = comentario || `Creación del rol "${nuevoRol.nombre}"`;

    const historial = crearHistorialEstadoRol(
      nuevoRol.id,
      'no_existe',
      nuevoRol.activo ? 'activo' : 'inactivo',
      usuario.id,
      'creacion',
      descripcion
    );

    if (!historial) {
      console.warn(`Historial no registrado para rol "${nuevoRol.nombre}"`);
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
 * Duplica un rol existente asignándole un nuevo nombre
 */
export const duplicarRol = async (
  idRolBase: string,
  nuevoNombre: string,
  usuario: Usuario,
  comentario?: string
): Promise<Rol | null> => {
  try {
    const rolBase = obtenerRolPorId(idRolBase);

    if (!rolBase) {
      toast.error('No se encontró el rol a duplicar');
      return null;
    }

    const nuevoRol: Omit<Rol, 'id'> = {
      nombre: nuevoNombre,
      descripcion: `${rolBase.descripcion} (copia)`,
      permisos: [...rolBase.permisos],
      color: rolBase.color,
      tipo: rolBase.tipo,
      fechaCreacion: new Date(),
      activo: true,
    };

    return await crearRolConHistorial(
      nuevoRol,
      usuario,
      comentario || `Rol duplicado desde "${rolBase.nombre}"`
    );
  } catch (error) {
    console.error('Error en duplicarRol:', error);
    toast.error('Error al duplicar el rol');
    return null;
  }
};

/**
 * Crea uno o más roles desde una plantilla predefinida
 */
export const crearRolesDesdeTemplates = async (
  tipoPlantilla: 'basico' | 'intermedio' | 'completo',
  usuario: Usuario
): Promise<Rol[]> => {
  const rolesCreados: Rol[] = [];

  try {
    const { permisosDisponibles } = require('@/data/permisos');

    const baseTemplate = (nombre: string, descripcion: string, filtro: (id: string) => boolean, color: string): Omit<Rol, 'id'> => ({
      nombre,
      descripcion,
      permisos: permisosDisponibles.filter(p => filtro(p.id)),
      color,
      tipo: 'usuario',
      fechaCreacion: new Date(),
      activo: true,
    });

    const templates: Omit<Rol, 'id'>[] = [];

    if (['basico', 'intermedio', 'completo'].includes(tipoPlantilla)) {
      templates.push(baseTemplate(
        'Visualizador',
        'Puede ver información pero no modificarla',
        id => id.startsWith('ver_'),
        '#6B7280'
      ));
    }

    if (['intermedio', 'completo'].includes(tipoPlantilla)) {
      templates.push(baseTemplate(
        'Editor',
        'Puede ver y editar información existente',
        id => id.startsWith('ver_') || id.startsWith('editar_'),
        '#10B981'
      ));
    }

    if (tipoPlantilla === 'completo') {
      templates.push(baseTemplate(
        'Gestor',
        'Puede crear, editar y gestionar la mayoría de contenidos',
        id => !id.includes('admin_') && !id.includes('eliminar_usuario'),
        '#3B82F6'
      ));
    }

    for (const template of templates) {
      const creado = await crearRolConHistorial(
        template,
        usuario,
        `Rol creado desde plantilla "${tipoPlantilla}"`
      );
      if (creado) rolesCreados.push(creado);
    }

    rolesCreados.length > 0
      ? toast.success(`Se crearon ${rolesCreados.length} roles desde la plantilla "${tipoPlantilla}"`)
      : toast.warning('No se creó ningún rol');

    return rolesCreados;
  } catch (error) {
    console.error('Error en crearRolesDesdeTemplates:', error);
    toast.error('Error al crear roles desde plantillas');
    return rolesCreados;
  }
};
