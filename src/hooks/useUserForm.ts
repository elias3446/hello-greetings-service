import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from '@/components/ui/sonner';
import { createUser, updateUser, getUserById } from '@/controller/CRUD/userController';
import { roles } from '@/data/roles';
import { UserFormData, UserFormState, FormMode } from '@/types/user';
import { DEFAULT_FORM_VALUES, formSchema } from '@/utils/userConstants';
import { hasUserChanges, getSystemUser, handleUserStateChange } from '@/utils/userUtils';
import { Usuario } from '@/types/tipos';
import { registrarCambioEstado } from '@/controller/CRUD/historialEstadosUsuario';
import { crearUsuario } from '@/controller/controller/newUser';
import { actualizarUsuario } from '@/controller/controller/userUpdateController';

export const useUserForm = (modo: FormMode, id?: string): UserFormState => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showCancelDialog, setShowCancelDialog] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const usuarioExistente = id ? getUserById(id) : undefined;

  const form = useForm<UserFormData>({
    defaultValues: usuarioExistente ? {
      nombre: usuarioExistente.nombre,
      apellido: usuarioExistente.apellido,
      email: usuarioExistente.email,
      password: usuarioExistente.password,
      roles: usuarioExistente.roles?.map(rol => rol.id) || [],
      estado: usuarioExistente.estado,
      tipo: usuarioExistente.tipo
    } : DEFAULT_FORM_VALUES,
    resolver: (data) => {
      const errors: Record<string, { message: string }> = {};
      
      // Validate required fields
      Object.entries(formSchema).forEach(([field, rules]) => {
        if (rules.required && !data[field as keyof UserFormData]) {
          errors[field] = { message: rules.required };
        }
      });

      // Validate email format
      if (data.email && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(data.email)) {
        errors.email = { message: 'Correo electrónico inválido' };
      }

      // Validate password strength only for new users or when password is changed
      if (modo === 'crear' && data.password && !/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(data.password)) {
        errors.password = { message: 'La contraseña debe contener letras y números' };
      } else if (modo === 'editar' && data.password && data.password !== usuarioExistente?.password && !/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(data.password)) {
        errors.password = { message: 'La contraseña debe contener letras y números' };
      }

      return {
        values: data,
        errors: Object.keys(errors).length > 0 ? errors : {}
      };
    }
  });

  useEffect(() => {
    if (modo === 'editar' && id) {
      const usuarioExistente = getUserById(id);
      if (usuarioExistente) {
        const rolesIds = usuarioExistente.roles?.map(r => r.id) || [];
        form.reset({
          nombre: usuarioExistente.nombre,
          apellido: usuarioExistente.apellido,
          email: usuarioExistente.email,
          password: usuarioExistente.password,
          roles: rolesIds,
          estado: usuarioExistente.estado,
          tipo: usuarioExistente.tipo
        });
      }
    }
  }, [modo, id, form]);

  const handleSubmit = async (data: UserFormData): Promise<void> => {
    try {
      setIsSubmitting(true);
      const rolesSeleccionados = roles.filter(rol => data.roles.includes(rol.id));
      const userData = {
        ...data,
        roles: rolesSeleccionados,
        permisos: rolesSeleccionados.flatMap(rol => rol.permisos || []),
        intentosFallidos: 0
      };

      if (modo === 'editar' && id) {
        await handleUpdateUser(id, userData);
      } else {
        await handleCreateUser(userData);
      }

      // Usar la ruta anterior si existe, o la ruta por defecto
      const previousPath = location.state?.from || '/admin/usuarios';
      navigate(previousPath);
    } catch (error) {
      toast.error("Error al procesar el usuario");
      console.error('Error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateUser = async (id: string, userData: Partial<Usuario>): Promise<void> => {
    const usuarioAnterior = getUserById(id);
    if (!usuarioAnterior) throw new Error("Usuario no encontrado");

    const formData: UserFormData = {
      nombre: userData.nombre || '',
      apellido: userData.apellido || '',
      email: userData.email || '',
      password: userData.password || '',
      roles: userData.roles?.map(r => r.id) || [],
      estado: userData.estado || 'activo',
      tipo: userData.tipo || 'usuario'
    };

    const hayCambios = hasUserChanges(usuarioAnterior, formData);
    if (!hayCambios) {
      toast.info("No hay cambios para guardar");
      const previousPath = location.state?.from || '/admin/usuarios';
      navigate(previousPath);
      return;
    }

    const resultado = await actualizarUsuario(
      usuarioAnterior,
      userData,
      {
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
      }
    );

    if (resultado) {
      const previousPath = location.state?.from || '/admin/usuarios';
      navigate(previousPath);
    }
  };

  const handleCreateUser = async (userData: Partial<Usuario>): Promise<void> => {
    if (!userData.nombre || !userData.apellido || !userData.email || !userData.password) {
      throw new Error("Faltan campos requeridos para crear el usuario");
    }

    const nuevoUsuario = await crearUsuario(userData);  

    toast.success("Usuario creado exitosamente");
  };

  const handleCancel = (): void => {
    if (form.formState.isDirty) {
      setShowCancelDialog(true);
    } else {
      const previousPath = location.state?.from || '/admin/usuarios';
      navigate(previousPath);
    }
  };

  return {
    form,
    showCancelDialog,
    setShowCancelDialog,
    handleSubmit,
    handleCancel,
    navigate,
    isSubmitting
  };
}; 