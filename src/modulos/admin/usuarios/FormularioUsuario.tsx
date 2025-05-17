import { useParams, useLocation } from 'react-router-dom';
import { ConfirmationDialog } from '@/components/ui/confirmation-dialog';
import { FormularioUsuarioProps } from '@/types/user';
import { useUserForm } from '@/hooks/useUserForm';
import FormularioUsuarioHeader from '@/components/admin/usuarios/FormularioUsuario/FormularioUsuarioHeader';
import FormularioUsuarioContent from '@/components/admin/usuarios/FormularioUsuario/FormularioUsuarioContent';
import FormularioUsuarioSidebar from '@/components/admin/usuarios/FormularioUsuario/FormularioUsuarioSidebar';

const FormularioUsuario = ({ modo }: FormularioUsuarioProps) => {
  const { id } = useParams();
  const location = useLocation();
  const {
    form,
    showCancelDialog,
    setShowCancelDialog,
    handleSubmit,
    handleCancel,
    navigate,
    isSubmitting
  } = useUserForm(modo, id);

  return (
    <div>
      <div className="space-y-6">
        <FormularioUsuarioHeader
          modo={modo}
          handleCancel={handleCancel}
          handleSubmit={handleSubmit}
          isSubmitting={isSubmitting}
          form={form}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <FormularioUsuarioContent
            form={form}
            modo={modo}
          />
          <FormularioUsuarioSidebar />
        </div>
      </div>

      <ConfirmationDialog
        isOpen={showCancelDialog}
        onClose={() => setShowCancelDialog(false)}
        onConfirm={() => {
          setShowCancelDialog(false);
          const previousPath = location.state?.from || '/admin/usuarios';
          navigate(previousPath);
        }}
        title="¿Cancelar cambios?"
        description="Tienes cambios sin guardar. ¿Estás seguro que deseas salir sin guardar?"
        confirmText="Sí, salir"
        cancelText="No, seguir editando"
      />
    </div>
  );
};

export default FormularioUsuario;
