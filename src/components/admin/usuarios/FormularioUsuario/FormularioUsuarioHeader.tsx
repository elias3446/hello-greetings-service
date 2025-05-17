import React from 'react';
import { FormHeader } from '@/components/forms/UserFormHeader';
import { FormularioUsuarioHeaderProps } from '@/props/admin/usuarios/PropFormularioUsuario';

const FormularioUsuarioHeader: React.FC<FormularioUsuarioHeaderProps> = ({
  modo,
  handleCancel,
  handleSubmit,
  isSubmitting,
  form
}) => {
  return (
    <FormHeader 
      modo={modo} 
      handleCancel={handleCancel}
      handleSubmit={() => form.handleSubmit(handleSubmit)()}
      isSubmitting={isSubmitting}
    />
  );
};

export default FormularioUsuarioHeader; 