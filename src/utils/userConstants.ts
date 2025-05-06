import { UserFormData, SelectOption } from '@/types/user';

export const DEFAULT_FORM_VALUES: UserFormData = {
  nombre: '',
  apellido: '',
  email: '',
  password: '',
  roles: [],
  estado: 'activo',
  tipo: 'usuario'
};

export const USER_STATUS_OPTIONS: SelectOption[] = [
  { value: 'activo', label: 'Activo' },
  { value: 'inactivo', label: 'Inactivo' },
  { value: 'bloqueado', label: 'Bloqueado' }
];

export const formSchema = {
  nombre: {
    required: 'El nombre es requerido',
    minLength: {
      value: 2,
      message: 'El nombre debe tener al menos 2 caracteres'
    }
  },
  apellido: {
    required: 'El apellido es requerido',
    minLength: {
      value: 2,
      message: 'El apellido debe tener al menos 2 caracteres'
    }
  },
  email: {
    required: 'El correo electrónico es requerido',
    pattern: {
      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
      message: 'Correo electrónico inválido'
    }
  },
  password: {
    required: 'La contraseña es requerida',
    minLength: {
      value: 8,
      message: 'La contraseña debe tener al menos 8 caracteres'
    },
    pattern: {
      value: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/,
      message: 'La contraseña debe contener letras y números'
    }
  },
  roles: {
    required: 'Debe seleccionar al menos un rol'
  },
  estado: {
    required: 'El estado es requerido'
  },
  tipo: {
    required: 'El tipo de usuario es requerido'
  }
}; 