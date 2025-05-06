import React from 'react';
import { useParams } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ConfirmationDialog } from '@/components/ui/confirmation-dialog';
import { FormularioUsuarioProps } from '@/types/user';
import { useUserForm } from '@/hooks/useUserForm';
import { FormHeader, UserProfile } from '@/components/forms/UserFormHeader';
import { GeneralInfoTab, AccountInfoTab } from '@/components/forms/UserFormTabs';
import { InfoCard, TipsCard } from '@/components/forms/UserFormCards';

const FormularioUsuario = ({ modo }: FormularioUsuarioProps) => {
  const { id } = useParams();
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
        <FormHeader 
          modo={modo} 
          handleCancel={handleCancel}
          handleSubmit={() => form.handleSubmit(handleSubmit)()}
          isSubmitting={isSubmitting}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <Card className="overflow-hidden">
              <UserProfile form={form} />

              <Tabs defaultValue="general" className="p-6">
                <TabsList className="mb-4">
                  <TabsTrigger value="general">Información General</TabsTrigger>
                  <TabsTrigger value="cuenta">Datos de Cuenta</TabsTrigger>
                </TabsList>
                
                <TabsContent value="general">
                  <GeneralInfoTab form={form} />
                </TabsContent>
                
                <TabsContent value="cuenta">
                  <AccountInfoTab form={form} modo={modo} />
                </TabsContent>
              </Tabs>
            </Card>
          </div>

          <div className="space-y-6">
            <InfoCard />
            <TipsCard />
          </div>
        </div>
      </div>

      <ConfirmationDialog
        isOpen={showCancelDialog}
        onClose={() => setShowCancelDialog(false)}
        onConfirm={() => {
          setShowCancelDialog(false);
          navigate('/admin/usuarios');
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
